namespace DHP.Domain.Models.Authentication
{
    public static class ClaimType
    {
        public static string Id { get; } = "Id";
        public static string Email { get; } = "Email";

        //dotnet can not recognize capital R
        public static string Role { get; } = "role";

        public static string TokenId { get; } = "TokenId";

        public static string CurrentUserRole { get; } = "Role";
    }
}
