namespace DHP.Domain.Dtos
{
    public class AddressDto
    {
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
        public bool IsAddOperation { get; set; }
    }
}
