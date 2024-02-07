using SpareParts.Data.Core;
using SpareParts.Data.RepositoryInterfaces;
using SpareParts.Domain.Models;
using SpareParts.Domain.Utilities;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SpareParts.Data.Repository
{
    public class UserRepository : Helper, IUserRepository
    {
        private readonly DBAccess db;

        #region Stored Procedures
        const string GetUserByEmailSp = "setup_User_GetUserByEmail";
        const string GetUserByResetTokenSp = "setup_User_GetUserByResetToken";
        const string GetUserByIdSp = "setup_User_GetUserById";
        const string AddNewUserSp = "setup_User_AddNewUser";
        const string UpdateUserSp = "setup_User_UpdateUser";
        const string InsertExpiredKeySp = "setup_ExpiredKeys_InsertExpiredKey";
        const string GetExpiredKeySp = "setup_ExpiredKeys_GetExpiredKey";
        const string AddOrUpdateAddressSp = "setup_UserAddress_AddOrUpdateAddress";
        const string GetUserAddressesSp = "setup_UserAddress_GetUserAddresses";
        const string DeleteUserAddressSp = "setup_UserAddress_DeleteUserAddress";

        const string GetUserProfileSp = "dashboard_User_GetUserProfile";
        const string UpdateUserProfileSp = "dashboard_User_UpdateUserProfile";
        const string DeleteUserSp = "dashboard_User_DeleteUser";
        #endregion Stored Procedures

        public UserRepository(IOptions<ConfigModel> configModel)
        {
            db = new DBAccess(configModel.Value.ConnectionStrings.DefaultConnection);
        }

        public Task<User> GetUser(long id)
        {
            return db.GetInfo<User>(new { ID = id, }, GetUserByIdSp);
        }

        public Task<User> GetUserBasedOnEmail(string email)
        {
            return db.GetInfo<User>(new { EMAIL = email, }, GetUserByEmailSp);
        }

        public Task<User> GetUserBasedOnResetToken(string resetToken)
        {
            return db.GetInfo<User>(new { PASSWORDRESETTOKEN = resetToken }, GetUserByResetTokenSp);
        }

        public Task<dynamic> CreateNewUser(User user)
        {
            return db.BasicQueryOperation(
                new
                {
                    EMAIL = user.Email,
                    FIRSTNAME = user.FirstName ?? "",
                    LASTNAME = user.LastName ?? "",
                    PHONE = user.Phone,
                    PASSWORD = user.Password,
                    ROLE = user.Role,
                    VERIFICATIONCODE = user.VerificationCode,
                    VERIFIED = user.Verified,
                    ACTIVE = user.Active,
                    CREATEDBY = user.CreatedBy,
                    CREATEDON = user.CreatedOn
                },
                AddNewUserSp
            );
        }

        public bool UpdateUser(User user)
        {
            return DoUnitOfWork(
                () =>
                    db.BasicOperation(
                        new
                        {
                            ID = user.Id,
                            EMAIL = user.Email,
                            FIRSTNAME = user.FirstName ?? "",
                            LASTNAME = user.LastName ?? "",
                            PASSWORD = user.Password,
                            ROLE = user.Role,
                            VERIFICATIONCODE = user.VerificationCode,
                            VERIFIED = user.Verified,
                            PASSWORDRESETTOKEN = user.PasswordResetToken,
                            PASSWORDRESETEXPIRES = user.PasswordResetExpires,
                            PHONE = user.Phone,
                            ACTIVE = user.Active,
                            MODIFIEDBY = user.ModifiedBy,
                            MODIFIEDON = user.ModifiedOn
                        },
                        UpdateUserSp
                    )
            );
        }

        public bool InsertExpiredKey(string key)
        {
            return DoUnitOfWork(
                () =>
                    db.BasicOperation(
                        new { EXPIREDKEY = key, LOGOUTTIME = DateTime.UtcNow },
                        InsertExpiredKeySp
                    )
            );
        }

        public Task<ExpiredKeys> GetExpiredKeyWithAKey(string key)
        {
            return db.GetInfo<ExpiredKeys>(new { EXPIREDKEY = key }, GetExpiredKeySp);
        }

        public Task<dynamic> AddOrUpdateAddress(UserAddress userAddress, bool isAddOperation)
        {
            return db.BasicQueryOperation(
                new
                {
                    ID = userAddress.Id,
                    FIRSTNAME = userAddress.FirstName,
                    LASTNAME = userAddress.LastName,
                    COMPANYNAME = userAddress.CompanyName,
                    COUNTRY = userAddress.Country,
                    ADDRESS = userAddress.Address,
                    CITY = userAddress.City,
                    STATE = userAddress.State,
                    POSTCODE = userAddress.PostCode,
                    EMAIL = userAddress.Email,
                    PHONE = userAddress.Phone,
                    ADDRESSTYPE = userAddress.AddressType,
                    CREATEDBY = userAddress.CreatedBy,
                    CREATEDON = userAddress.CreatedOn,
                    MODIFIEDBY = userAddress.ModifiedBy,
                    MODIFIEDON = userAddress.ModifiedOn,
                    USERID = userAddress.UserId,
                    ISADDOPERATION = isAddOperation
                },
                AddOrUpdateAddressSp
            );
        }

        public Task<IEnumerable<UserAddress>> GetUserAddress(long userId, long Id, byte addressType)
        {
            return db.GetInfoList<UserAddress>(
                new { USERID = userId, ID = Id, ADDRESSTYPE = addressType },
                GetUserAddressesSp
            );
        }

        public Task<dynamic> DeleteUserAddress(long Id)
        {
            return db.BasicQueryOperation(new { ID = Id }, DeleteUserAddressSp);
        }

        public Task<IEnumerable<UserProfile>> GetUserProfile(long userId)
        {
            return db.GetInfoList<UserProfile>(new { USERID = userId }, GetUserProfileSp);
        }

        public Task<dynamic> UpdateUserProfile(UserProfile userProfile, long userId)
        {
            return db.BasicQueryOperation(
                new
                {
                    ID = userId,
                    FIRSTNAME = userProfile.FirstName,
                    LASTNAME = userProfile.LastName,
                    EMAIL = userProfile.Email,
                    ROLE = userProfile.Role,
                    PHONE = userProfile.Phone,
                    ACTIVE = userProfile.Active,
                    THEME = userProfile.Theme,
                    COMPANYNAME = userProfile.CompanyName,
                    COUNTRY = userProfile.Country,
                    ADDRESS = userProfile.Address,
                    CITY = userProfile.City,
                    STATE = userProfile.State,
                    POSTCODE = userProfile.PostCode,
                    MODIFIEDBY = userProfile.ModifiedBy,
                    MODIFIEDON = userProfile.ModifiedOn
                },
                UpdateUserProfileSp
            );
        }

        public Task<dynamic> DeleteUser(long userId)
        {
            return db.BasicQueryOperation(new { USERID = userId }, DeleteUserSp);
        }
    }
}
