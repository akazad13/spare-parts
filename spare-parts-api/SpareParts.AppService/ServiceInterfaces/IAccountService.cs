using SpareParts.Domain.Utilities;
using SpareParts.Domain.Models;
using System.Security.Claims;
using SpareParts.Domain.Dtos;

namespace SpareParts.AppService.ServiceInterfaces
{
    public interface IAccountService
    {
        Task<IResult<GenericResponse>> RegisterCustomer(RegisterDto registerData);
        Task<IResult<GenericResponse>> Register(
            IOption<long> id,
            UserProfileDto userProfileDto,
            long requestUserId
        );
        Task<IResult<GenericResponse>> VerifyCustomer(VerificationDto verificationData);

        Task<IResult<LogInSuccessDto>> LogInService(LoginDto loginData, bool fromWebsite);
        Task<IResult<GenericResponse>> MakeKeyExpire(IOption<Claim> claimOption);

        bool IsTokenValid(string key);

        Task<IResult<GenericResponse>> ForgotPassword(string email);
        Task<IResult<GenericResponse>> ResetPasswordWithResetToken(
            string newPassword,
            string resetToken
        );
        Task<IResult<GenericResponse>> UpdatePassword(
            IOption<long> id,
            UpdatePasswordDto updatePasswordData
        );
        Task<IResult<GenericResponse>> UpdateCustomerProfile(
            IOption<long> id,
            UpdateCustomerProfileDto updateProfileData,
            long requestUserId
        );
        Task<IResult<GenericResponse>> AddOrUpdateAddress(
            IOption<long> id,
            AddressDto addressData,
            long requestUserId
        );
        Task<IResult<IEnumerable<UserAddress>>> GetAddress(
            IOption<long> id,
            long addressId,
            byte addressType,
            long requestUserId
        );
        Task<IResult<GenericResponse>> DeleteAddress(
            IOption<long> id,
            long addressId,
            long requestUserId
        );
        Task<IResult<IEnumerable<UserProfile>>> GetUserProfile(
            IOption<long> id,
            long userId,
            long requestUserId
        );
        Task<IResult<GenericResponse>> UpdateUserProfile(
            IOption<long> id,
            long userId,
            UserProfileDto profileData,
            long requestUserId
        );
        Task<IResult<GenericResponse>> DeleteUser(
            IOption<long> id,
            long userId,
            long requestUserId
        );
        Task<IResult<GenericResponse>> UpdateUserTheme(
            IOption<long> id,
            long userId,
            string theme,
            long requestUserId
        );
    }
}
