using SpareParts.AppService.ServiceInterfaces;
using SpareParts.Domain.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace SpareParts.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CustomerController : BaseController
    {
        private readonly IAccountService _accountService;

        public CustomerController(
            IAccountService accountService,
            IHttpContextAccessor httpContextAccessor
        ) : base(accountService, httpContextAccessor)
        {
            _accountService = accountService;
        }

        [Route("login")]
        [HttpPost]
        public async Task<IActionResult> Login(LoginDto loginData)
        {
            return (await _accountService.LogInService(loginData, true)).Match<IActionResult>(
                Ok,
                BadRequest
            );
        }

        [Route("register")]
        [HttpPost]
        public async Task<IActionResult> Register(RegisterDto registerData)
        {
            return (await _accountService.RegisterCustomer(registerData)).Match<IActionResult>(
                Ok,
                BadRequest
            );
        }

        [Route("verifyCustomer")]
        [HttpPost]
        public async Task<IActionResult> VerifyCustomer(VerificationDto verificationData)
        {
            return (await _accountService.VerifyCustomer(verificationData)).Match<IActionResult>(
                Ok,
                BadRequest
            );
        }

        [HttpPost]
        [Route("{userId}/updateProfile")]
        [Authorize(Policy = "RequireCustomerRole")]
        public IActionResult UpdateProfile(UpdateCustomerProfileDto updateProfileData, long userId)
        {
            return DoWorkAfterValidation(
                () =>
                    _accountService
                        .UpdateCustomerProfile(GetCurrentUserId(), updateProfileData, userId)
                        .Result.Match<IActionResult>(Ok, BadRequest)
            );
        }

        [HttpPost]
        [Route("{userId}/addOrUpdateAddress")]
        [Authorize(Policy = "RequireCustomerRole")]
        public IActionResult AddOrUpdateAddress(AddressDto addressData, long userId)
        {
            return DoWorkAfterValidation(
                () =>
                    _accountService
                        .AddOrUpdateAddress(GetCurrentUserId(), addressData, userId)
                        .Result.Match<IActionResult>(Ok, BadRequest)
            );
        }

        [HttpGet]
        [Route("{userId}/address/{id}/type/{type}")]
        [Authorize(Policy = "RequireCustomerRole")]
        public IActionResult GetAddress(long userId, long id, byte type)
        {
            // id = -1 for all , type = 0 for any
            return DoWorkAfterValidation(
                () =>
                    _accountService
                        .GetAddress(GetCurrentUserId(), id, type, userId)
                        .Result.Match<IActionResult>(Ok, BadRequest)
            );
        }

        [HttpDelete]
        [Route("{userId}/address/{id}")]
        [Authorize(Policy = "RequireCustomerRole")]
        public IActionResult DeleteAddress(long userId, long id)
        {
            return DoWorkAfterValidation(
                () =>
                    _accountService
                        .DeleteAddress(GetCurrentUserId(), id, userId)
                        .Result.Match<IActionResult>(Ok, BadRequest)
            );
        }
    }
}
