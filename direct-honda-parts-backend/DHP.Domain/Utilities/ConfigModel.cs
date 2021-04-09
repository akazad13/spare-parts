namespace DHP.Domain.Utilities
{
    public class ConfigModel
    {
        public ConnectionStrings ConnectionStrings { get; set; }
        public Jwt Jwt { get; set; }
        public DHPEmail DHPEmail { get; set; }
        public AppConfig AppConfig { get; set; }
        public AWSSMTP AwsSmtp { get; set; }
    }

    public class Jwt
    {
        public string SigningSecret { get; set; }

        public int? ExpiryDuration { get; set; }

        public string ValidIssuer { get; set; }

        public string ValidAudience { get; set; }
    }

    public class ConnectionStrings
    {
        public string DefaultConnection { get; set; }
    }

    public class DHPEmail
    {
        public string Sender { get; set; }
        public string Name { get; set; }
    }

    public class AWS
    {
        public string Profile { get; set; }
        public string Region { get; set; }
    }

    public class AppConfig
    {
        public int? TokenExpireTime { get; set; }
        public string WebsiteUrl { get; set; }
        public string DashboardUrl { get; set; }
    }
    public class AWSSMTP
    {
        public string Host { get; set; }
        public int Port { get; set; }
        public bool EnableSSL { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
    }
}
