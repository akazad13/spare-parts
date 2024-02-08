﻿using SpareParts.Domain.Dtos;
using SpareParts.Domain.Models;

namespace SpareParts.Data.RepositoryInterfaces
{
    public interface IProductRepository
    {
        Task<IEnumerable<Product>> GetModels();
        Task<IEnumerable<Year>> GetYearsByModel(int modelId);
        Task<IEnumerable<VehicleSearchDropdownDto>> GetBodyAndTrims(int modelId, int yearId);
        Task<IEnumerable<VehicleSearchDropdownDto>> GetEmissionAndTransmission(
            int modelId,
            int yearId,
            int doorId,
            int gradeId
        );
    }
}
