using System.ComponentModel.DataAnnotations;

namespace SpareParts.Domain.Dtos
{
    public class UpdatePasswordDto
    {
        [Required]
        public string OldPassword { get; set; }

        [Required]
        public string NewPassword { get; set; }
    }
}
