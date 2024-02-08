using SpareParts.AppService.ServiceInterfaces;
using SpareParts.Domain.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace SpareParts.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdminController : BaseController
    {
        private readonly IAccountService _accountService;

        public AdminController(
            IAccountService accountService,
            IHttpContextAccessor httpContextAccessor
        ) : base(accountService, httpContextAccessor)
        {
            _accountService = accountService;
        }

        [HttpGet]
        [Route("{adminId}/users/{userId}/profile")]
        [Authorize(Policy = "RequireAdminRole")]
        public IActionResult GetUserProfile(long adminId, long userId)
        {
            return DoWorkAfterValidation(
                () =>
                    _accountService
                        .GetUserProfile(GetCurrentUserId(), userId, adminId)
                        .Result.Match<IActionResult>(Ok, BadRequest)
            );
        }

        [HttpPost]
        [Route("{adminId}/users/new")]
        [Authorize(Policy = "RequireAdminRole")]
        public IActionResult AddNewUser(long adminId, UserProfileDto profileData)
        {
            return DoWorkAfterValidation(
                () =>
                    _accountService
                        .Register(GetCurrentUserId(), profileData, adminId)
                        .Result.Match<IActionResult>(Ok, BadRequest)
            );
        }

        [HttpPatch]
        [Route("{adminId}/users/{userId}/profile")]
        [Authorize(Policy = "RequireAdminRole")]
        public IActionResult UpdateUserProfile(
            long adminId,
            long userId,
            UserProfileDto profileData
        )
        {
            return DoWorkAfterValidation(
                () =>
                    _accountService
                        .UpdateUserProfile(GetCurrentUserId(), userId, profileData, adminId)
                        .Result.Match<IActionResult>(Ok, BadRequest)
            );
        }

        [HttpDelete]
        [Route("{adminId}/users/{userId}/profile")]
        [Authorize(Policy = "RequireAdminRole")]
        public IActionResult DeleteUserProfile(long adminId, long userId)
        {
            return DoWorkAfterValidation(
                () =>
                    _accountService
                        .DeleteUser(GetCurrentUserId(), userId, adminId)
                        .Result.Match<IActionResult>(Ok, BadRequest)
            );
        }
    }
}
