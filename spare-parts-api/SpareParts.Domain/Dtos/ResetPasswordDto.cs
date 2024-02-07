using System.ComponentModel.DataAnnotations;

namespace SpareParts.Domain.Dtos
{
    public class ResetPasswordDto
    {
        [Required]
        public string NewPassword { get; set; }

        [Required]
        public string ResetToken { get; set; }
    }
}
