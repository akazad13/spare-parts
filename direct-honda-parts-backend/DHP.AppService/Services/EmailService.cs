using Amazon.SimpleEmail;
using Amazon.SimpleEmail.Model;
using DHP.AppService.ServiceInterfaces;
using DHP.Domain.Utilities;
using Microsoft.Extensions.Options;
using MimeKit;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;

namespace DHP.AppService.Services
{
    public class EmailService : IEmailService
    {
        private readonly IAmazonSimpleEmailService _emailService;
        private readonly ConfigModel _configModel;

        public EmailService(IAmazonSimpleEmailService emailService, IOptions<ConfigModel> configModel)
        {
            _emailService = emailService;
            _configModel = configModel.Value;
        }

        public async Task<IResult<GenericResponse>> SendVerificationEmail(string kindOf, string to, string subject, bool isHtmlBody, string token, bool isForWebsite)
        {
            var body = "";
            var successMsg = "";

            var toList = new List<string>
            {
                to
            };

            if (kindOf.Equals(ConstVariables.EmailVerificationBody))
            {
                body = EmailBody.GetUserVerificationBody(to, _configModel.DHPEmail.Sender, token, isForWebsite == true ? _configModel.AppConfig.WebsiteUrl : _configModel.AppConfig.DashboardUrl);
                successMsg = $@"A verification email is sent to {to}. Please verify your email by following the instructions.";
            }
            else if (kindOf.Equals(ConstVariables.ResetPasswordEmailBody))
            {
                body = EmailBody.GetForgotPasswordBody(_configModel.DHPEmail.Sender, token, isForWebsite == true ? _configModel.AppConfig.WebsiteUrl + "/account" : _configModel.AppConfig.DashboardUrl +"/auth");
                successMsg = $@"A password reset token is sent to {to}. Please follow the instructions to reset your password.";
            }
            else if(kindOf.Equals(ConstVariables.NewAccountConformationBody))
            {
                body = EmailBody.GetNewAccountConformationBody(_configModel.DHPEmail.Sender, token, _configModel.AppConfig.DashboardUrl, to);
                successMsg = $@"Account information is sent to {to}.";
            }

            // var response = await SendEmail(toList, subject, body, isHtmlBody, null, null);
            var response = await SendEmailSMTP(toList, subject, body, isHtmlBody, null, null);

            if (response == HttpStatusCode.OK)
            {
                return Response<GenericResponse>.SuccessResponese(successMsg);
            }
            else
            {
                if(kindOf.Equals(ConstVariables.NewAccountConformationBody))
                {
                    return Response<GenericResponse>.ErrorResponse(@"Account has been created but failed to send email to the account holder.");
                }
                return Response<GenericResponse>.ErrorResponse(@"Problem Sending Email. Please resend the email.");
            }
        }

        public Task<HttpStatusCode> SendEmailWithAttachment(List<string> to, string subject, string body, bool isHtmlBody, string fileAttachmentPath, List<string> cc, List<string> bcc)
        {
            var emailMessage = BuildEmailHeaders(_configModel.DHPEmail.Sender, _configModel.DHPEmail.Name, to, cc, bcc, subject);
            var emailBody = BuildEmailBody(body, isHtmlBody);
            if (!string.IsNullOrEmpty(fileAttachmentPath))
            {
                emailBody.Attachments.Add(fileAttachmentPath);
            }
            emailMessage.Body = emailBody.ToMessageBody();
            return SendEmailAsync(emailMessage);
        }

        public Task<HttpStatusCode> SendEmailWithAttachment(List<string> to, string subject, string body, bool isHtmlBody, string fileName, Stream fileAttachmentStream, List<string> cc, List<string> bcc)
        {
            var emailMessage = BuildEmailHeaders(_configModel.DHPEmail.Sender, _configModel.DHPEmail.Name, to, cc, bcc, subject);
            var emailBody = BuildEmailBody(body, isHtmlBody);
            if (fileAttachmentStream != null && !string.IsNullOrEmpty(fileName))
            {
                emailBody.Attachments.Add(fileName, fileAttachmentStream);
            }
            emailMessage.Body = emailBody.ToMessageBody();
            return SendEmailAsync(emailMessage);
        }

        #region helpers

        private Task<HttpStatusCode> SendEmail(List<string> to, string subject, string body, bool isHtmlBody, List<string> cc = null, List<string> bcc = null)
        {
            var emailMessage = BuildEmailHeaders(_configModel.DHPEmail.Sender, _configModel.DHPEmail.Name, to, cc, bcc, subject);
            var emailBody = BuildEmailBody(body, isHtmlBody);
            emailMessage.Body = emailBody.ToMessageBody();
            return SendEmailAsync(emailMessage);
        }
        private static BodyBuilder BuildEmailBody(string body, bool isHtmlBody = true)
        {
            var bodyBuilder = new BodyBuilder();
            if (isHtmlBody)
            {
                bodyBuilder.HtmlBody = body;
            }
            else
            {
                bodyBuilder.TextBody = body;
            }
            return bodyBuilder;
        }
        private static MimeMessage BuildEmailHeaders(string from, string fromName, List<string> to, IReadOnlyCollection<string> cc, IReadOnlyCollection<string> bcc, string subject)
        {
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress(fromName, from));
            foreach (var recipient in to)
            {
                message.To.Add(new MailboxAddress(string.Empty, recipient));
            }
            if (cc != null && cc.Any())
            {
                foreach (var recipient in cc)
                {
                    message.Cc.Add(new MailboxAddress(string.Empty, recipient));
                }
            }
            if (bcc != null && bcc.Any())
            {
                foreach (var recipient in bcc)
                {
                    message.Bcc.Add(new MailboxAddress(string.Empty, recipient));
                }
            }
            message.Subject = subject;
            return message;
        }
        private async Task<HttpStatusCode> SendEmailAsync(MimeMessage message)
        {
            using var memoryStream = new MemoryStream();
            await message.WriteToAsync(memoryStream);
            var sendRequest = new SendRawEmailRequest { RawMessage = new RawMessage(memoryStream) };

            try
            {
                var response = await _emailService.SendRawEmailAsync(sendRequest);
                return response.HttpStatusCode;
            }
            catch
            {
                return HttpStatusCode.BadGateway;
            }

        }


        public async Task<HttpStatusCode> SendEmailSMTP(List<string> to, string subject, string body, bool isHtmlBody, List<string> cc = null, List<string> bcc = null)
        {
            MailMessage mailMessage = new MailMessage
            {
                From = new MailAddress(_configModel.DHPEmail.Sender, _configModel.DHPEmail.Name),
                Body = body,
                IsBodyHtml = isHtmlBody,
                Subject = subject,

            };

            foreach (var recipient in to)
            {
                mailMessage.To.Add(new MailAddress(recipient));
            }

            using var client = new SmtpClient(_configModel.AwsSmtp.Host, _configModel.AwsSmtp.Port)
            {
                Credentials = new NetworkCredential(_configModel.AwsSmtp.Username, _configModel.AwsSmtp.Password),
                EnableSsl = _configModel.AwsSmtp.EnableSSL
            };

            try
            {
                await client.SendMailAsync(mailMessage);
                return HttpStatusCode.OK;
            }
            catch (Exception ex)
            {
                return HttpStatusCode.BadGateway;
            }

        }

        #endregion
    }
}
