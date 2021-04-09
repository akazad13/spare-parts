namespace DHP.Domain.Utilities
{
    public static class EmailBody
    {
        public static string GetUserVerificationBody(string toEmailAddress, string FromEmail, string token, string surl)
        {
            return $@"<!DOCTYPE html>
                        <html>
                          <head>
                            <title>Please confirm your e-mail</title>
                          </head>
                          <body>
                            <center>
                        <h1>Verify your e-mail to finish signing up for Direct Honda Parts</h1>

                        <h4>Thank you for choosing Direct Honda Parts.</h4>

                        <p>Please confirm that <b>{toEmailAddress}</b> is your e-mail address by <b>going to the following link</b></p>

                        <a href='{surl}/registration/verify-user?email={toEmailAddress}&&verificationCode={token}'>{surl}/registration/verify-user?email={toEmailAddress}&&verificationCode={token}</a>

                        <p>Need help? Ask at {FromEmail} or visit our Help Center</p>

                        <b>Direct Honda Parts Ltd.</b></br>
                        Some Street</br>
                        CA
                            </center>
                          </body>
                        </html>

                    ";
        }

        public static string GetForgotPasswordBody(string FromEmail, string resetToken, string surl)
        {
            return $@"
                        <!DOCTYPE html>
                        <html>
                          <head>
                            <title>Reset your password</title>
                          </head>
                          <body>
                            <center>
                        <h2>Forgot your password?</h2>

                        <p>Reset your password by <b>going to the following link</b>. The link will be valid for 15 minutes.</p>

                        <a href='{surl}/reset-password?resetToken={resetToken}'>{surl}/reset-password?resetToken={resetToken}</a>

                        <p>Need help? Ask at {FromEmail} or visit our Help Center</p>

                        <b>Direct Honda Parts Ltd.</b></br>
                        Some Street</br>
                        CA
                            </center>
                          </body>
                        </html>

                   ";
        }

        public static string GetNewAccountConformationBody(string FromEmail, string password, string surl, string toEmail)
        {
            return $@"
                        <!DOCTYPE html>
                        <html>
                          <head>
                            <title>Your account information</title>
                          </head>
                          <body>
                            <center>
                        <h2>Your account information</h2>

                        <p>Your account email is {toEmail} and password is {password}. Please login to your account by clicking the link below:</p>

                        <a href='{surl}/auth/login'>{surl}/auth/login</a>

                        <p>Need help? Ask at {FromEmail} or visit our Help Center</p>

                        <b>Direct Honda Parts Ltd.</b></br>
                        Some Street</br>
                        CA
                            </center>
                          </body>
                        </html>

                   ";
        }
    }
}