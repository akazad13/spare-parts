using System.ComponentModel.DataAnnotations;

namespace DHP.Domain.Dtos
{
    public class UpdatePasswordDto
    {
        [Required]
        public string OldPassword { get; set; }
        [Required]
        public string NewPassword { get; set; }
    }
}
