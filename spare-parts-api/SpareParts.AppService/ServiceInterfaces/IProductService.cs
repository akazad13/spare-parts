using SpareParts.Domain.Dtos;
using SpareParts.Domain.Models;
using SpareParts.Domain.Utilities;

namespace SpareParts.AppService.ServiceInterfaces
{
    public interface IProductService
    {
        Task<IResult<IEnumerable<Product>>> GetModels();
        Task<IResult<IEnumerable<Year>>> GetYearsByModel(int modelId);
        Task<IResult<IEnumerable<VehicleSearchDropdownDto>>> GetBodyAndTrims(
            int modelId,
            int yearId
        );
        Task<IResult<IEnumerable<VehicleSearchDropdownDto>>> GetEmissionAndTransmission(
            int modelId,
            int yearId,
            int doorId,
            int gradeId
        );
    }
}
