using System.Threading.Tasks;
using SpareParts.AppService.ServiceInterfaces;
using Microsoft.AspNetCore.Mvc;

namespace SpareParts.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductController : Controller
    {
        private readonly IProductService _productService;

        public ProductController(IProductService productService)
        {
            _productService = productService;
        }

        [HttpGet]
        [Route("models")]
        public async Task<IActionResult> GetModels()
        {
            return (await _productService.GetModels()).Match<IActionResult>(Ok, BadRequest);
        }

        [HttpGet]
        [Route("models/{modelId}/years")]
        public async Task<IActionResult> GetYearsByModel(int modelId)
        {
            return (await _productService.GetYearsByModel(modelId)).Match<IActionResult>(
                Ok,
                BadRequest
            );
        }

        [HttpGet]
        [Route("models/{modelId}/years/{yearId}/bodyAndTrims")]
        public async Task<IActionResult> GetBodyAndTrims(int modelId, int yearId)
        {
            return (await _productService.GetBodyAndTrims(modelId, yearId)).Match<IActionResult>(
                Ok,
                BadRequest
            );
        }

        [HttpGet]
        [Route(
            "models/{modelId}/years/{yearId}/door/{doorId}/grade/{gradeid}/emissionAndTransmission"
        )]
        public async Task<IActionResult> GetEmissionAndTransmission(
            int modelId,
            int yearId,
            int doorId,
            int gradeId
        )
        {
            return (
                await _productService.GetEmissionAndTransmission(modelId, yearId, doorId, gradeId)
            ).Match<IActionResult>(Ok, BadRequest);
        }
    }
}
