using SpareParts.AppService.ServiceInterfaces;
using SpareParts.Data.RepositoryInterfaces;
using SpareParts.Domain.Dtos;
using SpareParts.Domain.Models;
using SpareParts.Domain.Utilities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SpareParts.AppService.Services
{
    public class ProductService : IProductService
    {
        private readonly IProductRepository _productRepository;

        public ProductService(IProductRepository product)
        {
            _productRepository = product;
        }

        public async Task<IResult<IEnumerable<Product>>> GetModels()
        {
            return ((await _productRepository.GetModels()).Then(Option.FromMaybeNull))
                .Map(model => Response<IEnumerable<Product>>.SuccessResponese(model))
                .Or(Response<IEnumerable<Product>>.ErrorResponse("Could not found the data"));
        }

        public async Task<IResult<IEnumerable<Year>>> GetYearsByModel(int modelId)
        {
            return ((await _productRepository.GetYearsByModel(modelId)).Then(Option.FromMaybeNull))
                .Map(model => Response<IEnumerable<Year>>.SuccessResponese(model))
                .Or(Response<IEnumerable<Year>>.ErrorResponse("Could not found the data"));
        }

        public async Task<IResult<IEnumerable<VehicleSearchDropdownDto>>> GetBodyAndTrims(
            int modelId,
            int yearId
        )
        {
            return (
                (await _productRepository.GetBodyAndTrims(modelId, yearId)).Then(
                    Option.FromMaybeNull
                )
            )
                .Map(
                    model => Response<IEnumerable<VehicleSearchDropdownDto>>.SuccessResponese(model)
                )
                .Or(
                    Response<IEnumerable<VehicleSearchDropdownDto>>.ErrorResponse(
                        "Could not found the data"
                    )
                );
        }

        public async Task<
            IResult<IEnumerable<VehicleSearchDropdownDto>>
        > GetEmissionAndTransmission(int modelId, int yearId, int doorId, int gradeId)
        {
            return (
                (
                    await _productRepository.GetEmissionAndTransmission(
                        modelId,
                        yearId,
                        doorId,
                        gradeId
                    )
                ).Then(Option.FromMaybeNull)
            )
                .Map(
                    model => Response<IEnumerable<VehicleSearchDropdownDto>>.SuccessResponese(model)
                )
                .Or(
                    Response<IEnumerable<VehicleSearchDropdownDto>>.ErrorResponse(
                        "Could not found the data"
                    )
                );
        }
    }
}
