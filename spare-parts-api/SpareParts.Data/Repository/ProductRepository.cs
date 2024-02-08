using SpareParts.Data.Core;
using SpareParts.Data.RepositoryInterfaces;
using SpareParts.Domain.Dtos;
using SpareParts.Domain.Models;
using SpareParts.Domain.Utilities;
using Microsoft.Extensions.Options;

namespace SpareParts.Data.Repository
{
    public class ProductRepository : IProductRepository
    {
        private readonly DBAccess db;

        #region Stored Procedures
        const string GetModelListSp = "vehicles_Product_GetModels";
        const string GetYearsByProductModelSp = "vehicles_Year_GetYearsByProductModel";
        const string GetBodyAndTrimsSp = "vehicles_Door_Grade_GetBodyAndTrims";
        const string GetEmissionAndTransmissionSp =
            "vehicles_Area_Transmission_GetEmissionAndTransmission";
        #endregion Stored Procedures

        public ProductRepository(IOptions<ConfigModel> configModel)
        {
            db = new DBAccess(configModel.Value.ConnectionStrings.DefaultConnection);
        }

        public Task<IEnumerable<Product>> GetModels()
        {
            return db.GetInfoList<Product>(new { }, GetModelListSp);
        }

        public Task<IEnumerable<Year>> GetYearsByModel(int modelId)
        {
            return db.GetInfoList<Year>(new { MODELID = modelId }, GetYearsByProductModelSp);
        }

        public Task<IEnumerable<VehicleSearchDropdownDto>> GetBodyAndTrims(int modelId, int yearId)
        {
            return db.GetInfoList<VehicleSearchDropdownDto>(
                new { MODELID = modelId, YEARID = yearId },
                GetBodyAndTrimsSp
            );
        }

        public Task<IEnumerable<VehicleSearchDropdownDto>> GetEmissionAndTransmission(
            int modelId,
            int yearId,
            int doorId,
            int gradeId
        )
        {
            return db.GetInfoList<VehicleSearchDropdownDto>(
                new { MODELID = modelId, YEARID = yearId, DOORID = doorId, GRADEID = gradeId },
                GetEmissionAndTransmissionSp
            );
        }
    }
}
