using SpareParts.AppService.ServiceInterfaces;
using SpareParts.Domain.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace SpareParts.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : BaseController
    {
        private readonly IAccountService _accountService;

        public AccountController(
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
            return (await _accountService.LogInService(loginData, false)).Match<IActionResult>(
                Ok,
                BadRequest
            );
        }

        [Route("logout")]
        [HttpGet]
        [Authorize]
        public async Task<IActionResult> Logout()
        {
            return (await _accountService.MakeKeyExpire(GetTokenIdClaim())).Match<IActionResult>(
                Ok,
                BadRequest
            );
        }

        [Route("forgotPassword")]
        [HttpPost]
        public async Task<IActionResult> ForgotPassword(ForgotPasswordDto forgotPassword)
        {
            return (
                await _accountService.ForgotPassword(forgotPassword.Email)
            ).Match<IActionResult>(Ok, BadRequest);
        }

        [Route("resetPasswordWithToken")]
        [HttpPost]
        public async Task<IActionResult> ResetPasswordWithResetToken(ResetPasswordDto resetPassword)
        {
            return (
                await _accountService.ResetPasswordWithResetToken(
                    resetPassword.NewPassword,
                    resetPassword.ResetToken
                )
            ).Match<IActionResult>(Ok, BadRequest);
        }

        [HttpPost]
        [Route("updatePassword")]
        [Authorize]
        public IActionResult UpdatePassword(UpdatePasswordDto updatePasswordData)
        {
            return DoWorkAfterValidation(
                () =>
                    _accountService
                        .UpdatePassword(GetCurrentUserId(), updatePasswordData)
                        .Result.Match<IActionResult>(Ok, BadRequest)
            );
        }
    }
}
