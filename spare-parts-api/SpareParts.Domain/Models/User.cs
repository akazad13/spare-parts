using System;

namespace SpareParts.Domain.Models
{
    public class User
    {
        public User() { }

        public User(
            string firstName,
            string lastName,
            string email,
            string phone,
            string password,
            string role,
            string verificationCode,
            bool verified,
            bool active,
            long createdBy,
            DateTime createdOn
        )
        {
            (
                FirstName,
                LastName,
                Email,
                Phone,
                Password,
                Role,
                VerificationCode,
                Verified,
                Active,
                CreatedBy,
                CreatedOn
            ) = (
                firstName,
                lastName,
                email,
                phone,
                password,
                role,
                verificationCode,
                verified,
                active,
                createdBy,
                createdOn
            );
        }

        public long Id { get; set; }

        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }

        public string Password { get; set; }

        public string Role { get; set; }

        public string VerificationCode { get; set; }

        public bool Verified { get; set; }

        public string PasswordResetToken { get; set; }

        public DateTime? PasswordResetExpires { get; set; }

        public string Phone { get; set; }
        public bool Active { get; set; }
        public string Theme { get; set; }
        public long? CreatedBy { get; set; }
        public DateTime? CreatedOn { get; set; }
        public long? ModifiedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
    }
}
