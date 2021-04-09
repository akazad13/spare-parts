using System;

namespace DHP.Domain.Models
{
    public class ExpiredKeys
    {
        public string ExpiredKey { get; set; }
        public DateTime LogoutTime { get; set; }
    }
}
