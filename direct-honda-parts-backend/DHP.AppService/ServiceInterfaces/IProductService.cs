using DHP.Domain.Dtos;
using DHP.Domain.Models;
using DHP.Domain.Utilities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DHP.AppService.ServiceInterfaces
{
    public interface IProductService
    {
        Task<IResult<IEnumerable<Product>>> GetModels(); 
        Task<IResult<IEnumerable<Year>>> GetYearsByModel(int modelId);
        Task<IResult<IEnumerable<VehicleSearchDropdownDto>>> GetBodyAndTrims(int modelId, int yearId);
        Task<IResult<IEnumerable<VehicleSearchDropdownDto>>> GetEmissionAndTransmission(
            int modelId, int yearId, int doorId, int gradeId);
    }
}
