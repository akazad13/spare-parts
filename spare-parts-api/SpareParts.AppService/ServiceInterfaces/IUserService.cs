using SpareParts.Domain.Models;
using SpareParts.Domain.Utilities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SpareParts.AppService.ServiceInterfaces
{
    public interface IUserService
    {
        Task<IOption<User>> GetUser(long id);

        Task<bool> DoesEmailExists(string email);

        Task<dynamic> CreateUser(User user);

        Task<IOption<User>> GetUserBasedOnEmail(string email);
        Task<IOption<User>> GetUserBasedOnResetToken(string resetToken);
        bool UpdateUser(User user, long modifiedBy);
        IOption<ExpiredKeys> GetExpiredKeyWithAKey(string key);
        bool InsertExpiredKey(string key);

        Task<dynamic> AddOrUpdateAddress(UserAddress userAddress, bool isAddOperation);
        Task<IOption<IEnumerable<UserAddress>>> GetAddress(long userId, long id, byte addressType);
        Task<dynamic> DeleteAddress(long Id);
        Task<IOption<IEnumerable<UserProfile>>> GetUserProfile(long userId);
        Task<dynamic> UpdateUserProfile(long userId, UserProfile profileData);
        Task<dynamic> DeleteUser(long userId);
    }
}
