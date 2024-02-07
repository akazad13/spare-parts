using SpareParts.Domain.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SpareParts.Data.RepositoryInterfaces
{
    public interface IUserRepository
    {
        Task<User> GetUser(long id);
        Task<User> GetUserBasedOnEmail(string email);
        Task<dynamic> CreateNewUser(User user);
        bool UpdateUser(User user);
        Task<User> GetUserBasedOnResetToken(string email);
        Task<ExpiredKeys> GetExpiredKeyWithAKey(string key);
        bool InsertExpiredKey(string key);
        Task<dynamic> AddOrUpdateAddress(UserAddress userAddress, bool isAddOperation);
        Task<IEnumerable<UserAddress>> GetUserAddress(long userId, long Id, byte addressType);
        Task<dynamic> DeleteUserAddress(long Id);
        Task<IEnumerable<UserProfile>> GetUserProfile(long userId);
        Task<dynamic> UpdateUserProfile(UserProfile userProfile, long userId);
        Task<dynamic> DeleteUser(long userId);
    }
}
