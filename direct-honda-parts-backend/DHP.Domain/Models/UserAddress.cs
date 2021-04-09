using System;

namespace DHP.Domain.Models
{
    public class UserAddress
    {
        public UserAddress() { }
        public UserAddress(string firstname, string lastname, string companyName, string country, string address, string city, string state,
            int postCode, string email, string phone, byte addressType, long userId, long createdBy, DateTime createdOn)
        {
            (FirstName, LastName, CompanyName, Country, Address, City, State, PostCode, Email, Phone, AddressType, UserId, CreatedBy, CreatedOn) 
            = (firstname, lastname, companyName, country, address, city, state, postCode, email, phone, addressType, userId, createdBy, createdOn);
        }
        public long Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string CompanyName { get; set; }
        public string Country { get; set; }
        public string Address { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public int PostCode { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public byte AddressType { get; set; }
        public long CreatedBy { get; set; }
        public DateTime? CreatedOn { get; set; }
        public long ModifiedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public long UserId { get; set; }
    }
}
