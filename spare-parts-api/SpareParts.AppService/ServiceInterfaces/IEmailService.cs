using SpareParts.Domain.Utilities;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Threading.Tasks;

namespace SpareParts.AppService.ServiceInterfaces
{
    public interface IEmailService
    {
        Task<IResult<GenericResponse>> SendVerificationEmail(
            string kindOf,
            string to,
            string subject,
            bool isHtmlBody,
            string token,
            bool isForWebsite
        );
        Task<HttpStatusCode> SendEmailWithAttachment(
            List<string> to,
            string subject,
            string body,
            bool isHtmlBody,
            string fileAttachmentPath,
            List<string> cc,
            List<string> bcc
        );
        Task<HttpStatusCode> SendEmailWithAttachment(
            List<string> to,
            string subject,
            string body,
            bool isHtmlBody,
            string fileName,
            Stream fileAttachmentStream,
            List<string> cc,
            List<string> bcc
        );
    }
}
