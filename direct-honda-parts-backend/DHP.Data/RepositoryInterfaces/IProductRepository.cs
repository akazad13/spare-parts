using DHP.Domain.Dtos;
using DHP.Domain.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DHP.Data.RepositoryInterfaces
{
    public interface IProductRepository
    {
        Task<IEnumerable<Product>> GetModels();
        Task<IEnumerable<Year>> GetYearsByModel(int modelId);
        Task<IEnumerable<VehicleSearchDropdownDto>> GetBodyAndTrims(int modelId, int yearId);
        Task<IEnumerable<VehicleSearchDropdownDto>> GetEmissionAndTransmission(int modelId, int yearId, int doorId, int gradeId);
    }
}
