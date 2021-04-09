using DHP.AppService.ServiceInterfaces;
using DHP.Domain.Models.Authentication;
using DHP.Domain.Utilities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;
using System.Security.Claims;

namespace DHP.Api.Controllers
{
    public class BaseController : ControllerBase
    {

        private readonly IAccountService _accountService;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public BaseController(IAccountService accountService, IHttpContextAccessor httpContextAccessor)
        {
            _accountService = accountService;
            _httpContextAccessor = httpContextAccessor;
        }

        protected IActionResult DoWorkAfterValidation(Func<IActionResult> f)
        {
            return IsUserTokenValid() ? f() : Unauthorized("Expired Token");
        }

        protected IActionResult DoWebJobsAfterValidation(Func<IActionResult> f)
        {
            return IsHeaderPresent("Authorization") ? f() : Unauthorized("Not Authorized");
        }

        protected string GetCurrentUserEmail()
        {
            return GetClaim(ClaimType.Email).Always()?.Value;
        }

        protected IOption<long> GetCurrentUserId()
        {
            return GetClaim(ClaimType.Id)
              .Bind(userIdClaim =>
                long.TryParse(userIdClaim.Value, out long id)
                ? Some.Of(id)
                : new None<long>()
               );
        }


        protected IOption<Claim> GetTokenIdClaim()
        {
            return GetClaim(ClaimType.TokenId);
        }

        private bool IsUserTokenValid()
        {
            return GetTokenIdClaim().Then(tokenClaimOption =>
                        tokenClaimOption.IsSome
                        && IsGuid(tokenClaimOption.Always().Value)
                        && _accountService.IsTokenValid(tokenClaimOption.Always().Value)
                   );
        }

        private bool IsHeaderPresent(string headerStr)
        {
            return HelperFunctions.Pipe(
                Option.FromMaybeNull(_httpContextAccessor.HttpContext.Request.Headers[headerStr].ToString()),
                header => header.IsSome && IsGuid(header.Always())
            );
        }

        private bool IsGuid(string idString)
        {
            return Guid.TryParse(idString, out var someGuid);
        }

        protected bool IsAdmin()
        {
            return GetClaim(ClaimType.CurrentUserRole).Then(claimOption =>
                        claimOption.IsSome
                        && claimOption.Always().Value == "Admin"
                   );
        }

        private IOption<Claim> GetClaim(string clameType)
        {
            return HelperFunctions.Pipe(
                _httpContextAccessor.HttpContext.User.Claims.Where(x => x.Type == clameType).SingleOrDefault(),
                Option.FromMaybeNull
            );
        }
    }
}
