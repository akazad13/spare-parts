using System.ComponentModel.DataAnnotations;

namespace DHP.Domain.Dtos
{
    public class ForgotPasswordDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }
    }
}
