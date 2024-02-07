using System.ComponentModel.DataAnnotations;

namespace SpareParts.Domain.Dtos
{
    public class ForgotPasswordDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }
    }
}
