using AutoMapper;
using DHP.AppService.ServiceInterfaces;
using DHP.Domain.Dtos;
using DHP.Domain.Models;
using DHP.Domain.Models.Authentication;
using DHP.Domain.Security;
using DHP.Domain.Utilities;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace DHP.AppService.Services
{
    public class AccountService : Helper, IAccountService
    {
        private readonly IUserService _userService;
        private readonly IEmailService _emailService;
        private readonly ConfigModel _configModel;
        private readonly IMapper _mapper;

        public AccountService(IOptions<ConfigModel> configModel, IUserService userService, IEmailService emailService, IMapper mapper)
        {
            _userService = userService;
            _emailService = emailService;
            _configModel = configModel.Value;
            _mapper = mapper;
        }
        public async Task<IResult<LogInSuccessDto>> LogInService(LoginDto loginData, bool fromWebsite)
        {
            var currentUser = await _userService.GetUserBasedOnEmail(loginData.Email);

            if (currentUser.IsNone)
            {
                return await Response<LogInSuccessDto>.GetErrorResponseMessage("No Rrcord found with this email and password.");
            }

            var alwaysAUser = currentUser.Always();

            if ((alwaysAUser.Role == Roles.Customer && !fromWebsite) || (alwaysAUser.Role != Roles.Customer && fromWebsite))
            {
                return await Response<LogInSuccessDto>.GetErrorResponseMessage("You are not authorized.");
            }

            if(!alwaysAUser.Active)
            {
                return await Response<LogInSuccessDto>.GetErrorResponseMessage("You account is deactive. Please contact the support.");
            }

            if (!alwaysAUser.Verified)
            {
                return await Response<LogInSuccessDto>.GetErrorResponseMessage("You are not verified. Please confirm your email address.");
            }

            return
              VerifyPassword(loginData.Password, alwaysAUser.Password)
              ? await Task<IResult<LogInSuccessDto>>.Factory.StartNew(
                  () => Response<LogInSuccessDto>.SuccessResponese(
                    new LogInSuccessDto()
                    {
                        Token = JwtTokenGen(alwaysAUser),
                        Email = alwaysAUser.Email,
                        FirstName = alwaysAUser.FirstName,
                        LastName = alwaysAUser.LastName,
                        Phone = alwaysAUser.Phone,
                        Theme = alwaysAUser.Theme
                    }
                 ))
              : await Response<LogInSuccessDto>.GetErrorResponseMessage("No Rrcord found with this email and password.");
        }
        public Task<IResult<GenericResponse>> RegisterCustomer(RegisterDto registerData)
        {
            return Register(null, null, registerData.Email, null, registerData.Password, Roles.Customer, 0, DateTime.UtcNow, null);
        }

        public Task<IResult<GenericResponse>> Register(IOption<long> id, UserProfileDto userProfileDto, long requestUserId)
        {
            if (id.IsNone || id.Always() != requestUserId)
            {
                return Response<GenericResponse>.GetErrorResponseMessage("You are not authorized.");
            }

            string password = new Random().Next(100000, 999999).ToString();

            var addressData = new UserAddress(userProfileDto.FirstName, userProfileDto.LastName, userProfileDto.CompanyName,
                                              userProfileDto.Country, userProfileDto.Address, userProfileDto.City, userProfileDto.State,
                                              userProfileDto.PostCode?? 0, userProfileDto.Email, userProfileDto.Phone, 1, 0, requestUserId, DateTime.UtcNow
                                              );

            return Register(userProfileDto.FirstName, userProfileDto.LastName, userProfileDto.Email, userProfileDto.Phone, password, userProfileDto.Role, id.Always(), DateTime.UtcNow, addressData);
        }

        public async Task<IResult<GenericResponse>> VerifyCustomer(VerificationDto verificationData)
        {
            var user = await _userService.GetUserBasedOnEmail(verificationData.Email);

            if (user.IsNone)
            {
                return await Response<GenericResponse>.GetErrorResponseMessage("No Rrcord found with this email address");
            }

            var alwaysAUser = user.Always();

            if (!(new Helper().TokenToHash(verificationData.VerificationCode) == alwaysAUser.VerificationCode))
            {
                return await Response<GenericResponse>.GetErrorResponseMessage("Wrong verification code");
            }

            alwaysAUser.Verified = true;
            alwaysAUser.ModifiedOn = DateTime.UtcNow;

            return
              _userService.UpdateUser(alwaysAUser, alwaysAUser.Id)
              ? await Task<IResult<GenericResponse>>.Factory.StartNew(
                    () => Response<GenericResponse>.SuccessResponese(
                      "User Is Verified"
                    ))
              : await Response<GenericResponse>.GetErrorResponseMessage("Something Went Wrong. Please Try Again Later");
        }

        private async Task<IResult<GenericResponse>> Register(string firstName, string lastName, string email, string phone, string password, string role, long createdBy, DateTime createdOn, UserAddress addressData)
        {
            if (await _userService.DoesEmailExists(email))
            {
                return await Response<GenericResponse>.GetErrorResponseMessage("There is a user account with the provided email Or Its not a valid Email");
            }

            var token = "";
            if (role == Roles.Customer)
            {
                token = new Helper().TokenGenerate();
            }

            var newUser = CreateNewUnverifiedUserObject(
               firstName, lastName, email, phone, new HashingManager().HashToString(password)
               , role, new Helper().TokenToHash(token), createdBy, createdOn
             );

            if(role != Roles.Customer)
            {
                newUser.Verified = true;
            }

            var ret = await _userService.CreateUser(newUser);
            long.TryParse(ret?.Id?.ToString(), out long Id);

            if (Id != -1)
            {
                if (newUser.Role == Roles.Customer)
                {
                    return await _emailService.SendVerificationEmail(
                          ConstVariables.EmailVerificationBody, newUser.Email,
                          "Verify Email Address", true, token, true
                        );
                }
                else
                {
                    addressData.UserId = Id;
                    await _userService.AddOrUpdateAddress(addressData, true);

                    return await _emailService.SendVerificationEmail(
                          ConstVariables.NewAccountConformationBody, newUser.Email,
                          "Your account information", true, password, false
                        );

                }
            }
            else
            {
                return await Response<GenericResponse>.GetErrorResponseMessage("Problem Creating account");
            }
        }

        public async Task<IResult<GenericResponse>> ForgotPassword(string email)
        {
            var user = await _userService.GetUserBasedOnEmail(email);
            if (!user.IsNone)
            {
                var alwaysAUser = user.Always();

                var resetToken = new Helper().TokenGenerate();

                alwaysAUser.PasswordResetToken = new Helper().TokenToHash(resetToken);
                var currentTime = DateTime.UtcNow;
                alwaysAUser.PasswordResetExpires = currentTime.AddMinutes(15);

                if (_userService.UpdateUser(alwaysAUser, alwaysAUser.Id))
                {
                    return await _emailService.SendVerificationEmail(ConstVariables.ResetPasswordEmailBody, email, "Reset your password", true, resetToken, alwaysAUser.Role == Roles.Customer);
                }
                return await Response<GenericResponse>.GetErrorResponseMessage("Problem creating the reset token.");

            }
            return await Response<GenericResponse>.GetErrorResponseMessage("Entered email does not exist.");
        }

        public async Task<IResult<GenericResponse>> ResetPasswordWithResetToken(string newPassword, string resetToken)
        {

            var user = await _userService.GetUserBasedOnResetToken(new Helper().TokenToHash(resetToken));

            if (!user.IsNone)
            {
                var alwaysAUser = user.Always();

                if (alwaysAUser.PasswordResetExpires < DateTime.UtcNow)
                {
                    return await Response<GenericResponse>.GetErrorResponseMessage("Reset token is invalid.");
                }

                alwaysAUser.Password = new HashingManager().HashToString(newPassword);

                alwaysAUser.PasswordResetToken = "";
                alwaysAUser.PasswordResetExpires = DateTime.UtcNow;
                alwaysAUser.ModifiedOn = DateTime.UtcNow;

                if (_userService.UpdateUser(alwaysAUser, alwaysAUser.Id))
                {
                    return await Task<IResult<GenericResponse>>.Factory.StartNew(
                    () => Response<GenericResponse>.SuccessResponese(
                      "Password is updated"
                    ));
                }
                return await Response<GenericResponse>.GetErrorResponseMessage("Problem resetting new password");
            }
            return await Response<GenericResponse>.GetErrorResponseMessage("Could not find the account.");
        }
        public Task<IResult<GenericResponse>> MakeKeyExpire(IOption<Claim> claimOption)
        {
            return claimOption.IsSome
                ? _userService.InsertExpiredKey(claimOption.Always().Value)
                  ? Task<IResult<GenericResponse>>.Factory.StartNew(
                    () => Response<GenericResponse>.SuccessResponese(
                      "Successfully logged out."
                    ))
                  : Response<GenericResponse>.GetErrorResponseMessage("Problem login out.")
                : Response<GenericResponse>.GetErrorResponseMessage("You are not authorized.");
        }
        public bool IsTokenValid(string key)
        {
            return _userService.GetExpiredKeyWithAKey(key).IsNone;

        }

        public async Task<IResult<GenericResponse>> UpdatePassword(IOption<long> id, UpdatePasswordDto updatePasswordData)
        {
            if (id.IsNone)
            {
                return await Response<GenericResponse>.GetErrorResponseMessage("You are not authorized.");
            }

            var user = await _userService.GetUser(id.Always());

            if (!user.IsNone)
            {
                var alwaysAUser = user.Always();

                if (!VerifyPassword(updatePasswordData.OldPassword, alwaysAUser.Password))
                {
                    return await Response<GenericResponse>.GetErrorResponseMessage("Please Enter your correct current password.");
                }

                alwaysAUser.Password = new HashingManager().HashToString(updatePasswordData.NewPassword);
                alwaysAUser.ModifiedOn = DateTime.UtcNow;

                if (_userService.UpdateUser(alwaysAUser, alwaysAUser.Id))
                {
                    return await Task<IResult<GenericResponse>>.Factory.StartNew(
                    () => Response<GenericResponse>.SuccessResponese(
                      "Password updated successfully."
                    ));
                }
                return await Response<GenericResponse>.GetErrorResponseMessage("Problem updating password.");
            }
            return await Response<GenericResponse>.GetErrorResponseMessage("Could not find the account.");
        }

        public async Task<IResult<GenericResponse>> UpdateCustomerProfile(IOption<long> id, UpdateCustomerProfileDto updateProfileData, long requestUserId)
        {
            if (id.IsNone || id.Always() != requestUserId)
            {
                return await Response<GenericResponse>.GetErrorResponseMessage("You are not authorized.");
            }

            var user = await _userService.GetUser(id.Always());
            if (!user.IsNone)
            {
                var alwaysAUser = user.Always();

                _mapper.Map(updateProfileData, alwaysAUser); // (from, to)
                alwaysAUser.ModifiedOn = DateTime.UtcNow;

                if (_userService.UpdateUser(alwaysAUser, alwaysAUser.Id))
                {
                    return await Task<IResult<GenericResponse>>.Factory.StartNew(
                    () => Response<GenericResponse>.SuccessResponese(
                      "Successfully updated profile."
                    ));
                }
                return await Response<GenericResponse>.GetErrorResponseMessage("Problem updating profile.");
            }
            return await Response<GenericResponse>.GetErrorResponseMessage("Could not find the account.");
        }

        public async Task<IResult<GenericResponse>> AddOrUpdateAddress(IOption<long> id, AddressDto addressData, long requestUserId)
        {
            if (id.IsNone || id.Always() != requestUserId)
            {
                return await Response<GenericResponse>.GetErrorResponseMessage("You are not authorized.");
            }

            if (addressData.IsAddOperation)
            {
                var addressToCreate = _mapper.Map<UserAddress>(addressData);
                addressToCreate.CreatedBy = id.Always();
                addressToCreate.CreatedOn = DateTime.UtcNow;
                addressToCreate.UserId = id.Always();

                var ret = await _userService.AddOrUpdateAddress(addressToCreate, addressData.IsAddOperation);

                int.TryParse(ret?.ReturnCode?.ToString(), out int code);

                return code == 0
                      ? await Task<IResult<GenericResponse>>.Factory.StartNew(
                            () => Response<GenericResponse>.SuccessResponese(
                              "Successfully added the address."
                        ))
                      : await Response<GenericResponse>.GetErrorResponseMessage(ret?.ReturnMsg?.ToString());
            }
            else
            {
                var addressToUpdate = _mapper.Map<UserAddress>(addressData);
                addressToUpdate.ModifiedBy = id.Always();
                addressToUpdate.ModifiedOn = DateTime.UtcNow;

                if (addressToUpdate.UserId == 0)
                {
                    addressToUpdate.UserId = id.Always();
                }

                var ret = await _userService.AddOrUpdateAddress(addressToUpdate, addressData.IsAddOperation);

                int.TryParse(ret?.ReturnCode?.ToString(), out int code);

                return code == 0
                      ? await Task<IResult<GenericResponse>>.Factory.StartNew(
                            () => Response<GenericResponse>.SuccessResponese(
                              "Successfully updated the address."
                        ))
                      : await Response<GenericResponse>.GetErrorResponseMessage(ret?.ReturnMsg?.ToString());
            }
        }

        public async Task<IResult<IEnumerable<UserAddress>>> GetAddress(IOption<long> id, long addressId, byte addressType, long requestUserId)
        {
            if (id.IsNone || id.Always() != requestUserId)
            {
                return await Response<IEnumerable<UserAddress>>.GetErrorResponseMessage("You are not authorized.");
            }

            return (await _userService.GetAddress(id.Always(), addressId, addressType))
                 .Map(addresses => Response<IEnumerable<UserAddress>>.SuccessResponese(addresses))
                 .Or(Response<IEnumerable<UserAddress>>.ErrorResponse("User address is not found"));
        }

        public async Task<IResult<GenericResponse>> DeleteAddress(IOption<long> id, long addressId, long requestUserId)
        {
            if (id.IsNone || id.Always() != requestUserId)
            {
                return await Response<GenericResponse>.GetErrorResponseMessage("You are not authorized.");
            }

            var ret = await _userService.DeleteAddress(addressId);

            int.TryParse(ret?.ReturnCode?.ToString(), out int code);

            return code == 0
                      ? await Task<IResult<GenericResponse>>.Factory.StartNew(
                            () => Response<GenericResponse>.SuccessResponese(
                              "Successfully deleted the address."
                        ))
                      : await Response<GenericResponse>.GetErrorResponseMessage(ret?.ReturnMsg?.ToString());
        }

        public async Task<IResult<IEnumerable<UserProfile>>> GetUserProfile(IOption<long> id, long userId, long requestUserId)
        {
            if (id.IsNone || id.Always() != requestUserId)
            {
                return await Response<IEnumerable<UserProfile>>.GetErrorResponseMessage("You are not authorized.");
            }

            return (await _userService.GetUserProfile(userId))
                 .Map(userProfile => Response<IEnumerable<UserProfile>>.SuccessResponese(userProfile))
                 .Or(Response<IEnumerable<UserProfile>>.ErrorResponse("User is not found"));
        }

        public async Task<IResult<GenericResponse>> UpdateUserProfile(IOption<long> id, long userId, UserProfileDto profileData, long requestUserId)
        {
            if (id.IsNone || id.Always() != requestUserId)
            {
                return await Response<GenericResponse>.GetErrorResponseMessage("You are not authorized.");
            }

            var userProfiles = await _userService.GetUserProfile(userId);

            if (!userProfiles.IsNone)
            {
                var alwaysUserProfileToUpdate = userProfiles.Always();
                var userProfileToUpdate = alwaysUserProfileToUpdate.ToList()[0];

                // only admin can change the role
                if (userProfileToUpdate.Role != Roles.Admin)
                {
                    var prevRole = userProfileToUpdate.Role;
                    _mapper.Map(profileData, userProfileToUpdate); // (from, to)
                    userProfileToUpdate.Role = prevRole;
                }
                else
                {
                    _mapper.Map(profileData, userProfileToUpdate); // (from, to)
                }

                userProfileToUpdate.ModifiedBy = requestUserId;
                userProfileToUpdate.ModifiedOn = DateTime.UtcNow;

                var ret = await _userService.UpdateUserProfile(userId, userProfileToUpdate);

                int.TryParse(ret?.ReturnCode?.ToString(), out int code);

                return code == 0
                      ? await Task<IResult<GenericResponse>>.Factory.StartNew(
                            () => Response<GenericResponse>.SuccessResponese(
                              "Successfully updated profile."
                        ))
                      : await Response<GenericResponse>.GetErrorResponseMessage(ret?.ReturnMsg?.ToString());
            }

            return await Response<GenericResponse>.GetErrorResponseMessage("Error updating profile.");
        }

        public async Task<IResult<GenericResponse>> DeleteUser(IOption<long> id, long userId, long requestUserId)
        {
            if (id.IsNone || id.Always() != requestUserId)
            {
                return await Response<GenericResponse>.GetErrorResponseMessage("You are not authorized.");
            }

            var ret = await _userService.DeleteUser(userId);

            int.TryParse(ret?.ReturnCode?.ToString(), out int code);

            return code == 0
                      ? await Task<IResult<GenericResponse>>.Factory.StartNew(
                            () => Response<GenericResponse>.SuccessResponese(
                              "Successfully deleted the user."
                        ))
                      : await Response<GenericResponse>.GetErrorResponseMessage(ret?.ReturnMsg?.ToString());
        }

        public async Task<IResult<GenericResponse>> UpdateUserTheme(IOption<long> id, long userId, string theme, long requestUserId)
        {
            if (id.IsNone || id.Always() != requestUserId)
            {
                return await Response<GenericResponse>.GetErrorResponseMessage("You are not authorized.");
            }

            var userProfiles = await _userService.GetUserProfile(userId);

            if (!userProfiles.IsNone)
            {
                var alwaysUserProfileToUpdate = userProfiles.Always();
                var userProfileToUpdate = alwaysUserProfileToUpdate.ToList()[0];

                userProfileToUpdate.Theme = theme;

                userProfileToUpdate.ModifiedBy = requestUserId;
                userProfileToUpdate.ModifiedOn = DateTime.UtcNow;

                var ret = await _userService.UpdateUserProfile(userId, userProfileToUpdate);

                int.TryParse(ret?.ReturnCode?.ToString(), out int code);

                return code == 0
                      ? await Task<IResult<GenericResponse>>.Factory.StartNew(
                            () => Response<GenericResponse>.SuccessResponese(
                              "Successfully updated theme."
                        ))
                      : await Response<GenericResponse>.GetErrorResponseMessage(ret?.ReturnMsg?.ToString());
            }

            return await Response<GenericResponse>.GetErrorResponseMessage("Error updating theme.");
        }

        private User CreateNewUnverifiedUserObject(string firstName, string LastName, string email, string phone, string password, string role, string verificationCode, long createdBy, DateTime createdOn)
        {
            return new User(firstName, LastName, email, phone, password, role, verificationCode, verified: false, active: true, createdBy, createdOn);
        }

        private string JwtTokenGen(User user)
        {

            var signingKey = Convert.FromBase64String(_configModel.Jwt.SigningSecret);
            var expiryDuration = Option.FromNullable(_configModel.Jwt.ExpiryDuration);
            var validIssuer = _configModel.Jwt.ValidIssuer;
            var validAudience = _configModel.Jwt.ValidAudience;
            var guid = Guid.NewGuid();
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Issuer = validIssuer,
                Audience = validAudience,
                IssuedAt = DateTime.UtcNow,
                NotBefore = DateTime.UtcNow,
                Expires = DateTime.UtcNow.AddMinutes(expiryDuration.IsSome ? expiryDuration.Always() : 120),
                Subject = new ClaimsIdentity(new List<Claim> {
                    new Claim(ClaimType.Id, user.Id.ToString()),
                    new Claim(ClaimType.Email, user.Email),
                    new Claim(ClaimType.Role, user.Role),
                    new Claim(ClaimType.TokenId, $@"{guid}"),
                    new Claim(ClaimType.CurrentUserRole, user.Role)
                }),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(signingKey), SecurityAlgorithms.HmacSha256Signature)
            };
            var jwtTokenHandler = new JwtSecurityTokenHandler();
            var jwtToken = jwtTokenHandler.CreateJwtSecurityToken(tokenDescriptor);
            var token = jwtTokenHandler.WriteToken(jwtToken);
            return token;
        }
    }
}
