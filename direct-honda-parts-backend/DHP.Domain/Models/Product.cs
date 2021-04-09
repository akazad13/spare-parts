using System;
using System.Collections.Generic;
using System.Text;

namespace DHP.Domain.Models
{
    public class Product
    {
        public int ID { get; set; }
        public string Description { get; set; }
        public DateTime EffectiveDate { get; set; }
        public DateTime DateLastUpdated { get; set; }
        public string UpdatedBy { get; set; }
    }
}
