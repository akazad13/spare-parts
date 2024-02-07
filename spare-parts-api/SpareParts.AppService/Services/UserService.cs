using SpareParts.AppService.ServiceInterfaces;
using SpareParts.Data.RepositoryInterfaces;
using SpareParts.Domain.Models;
using SpareParts.Domain.Utilities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SpareParts.AppService.Services
{
    public class UserService : Helper, IUserService
    {
        private readonly IUserRepository _userRepository;

        public UserService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<IOption<User>> GetUser(long id)
        {
            return (await _userRepository.GetUser(id)).Then(Option.FromMaybeNull);
        }

        public async Task<bool> DoesEmailExists(string email)
        {
            return IsValidEmail(email)
                && (await _userRepository.GetUserBasedOnEmail(email))
                    .Then(Option.FromMaybeNull)
                    .Then(user => user.IsSome);
        }

        public Task<dynamic> CreateUser(User user)
        {
            return _userRepository.CreateNewUser(user);
        }

        public async Task<IOption<User>> GetUserBasedOnEmail(string email)
        {
            return (await _userRepository.GetUserBasedOnEmail(email)).Then(Option.FromMaybeNull);
        }

        public bool UpdateUser(User user, long modifiedBy)
        {
            user.ModifiedBy = modifiedBy;
            user.ModifiedOn = DateTime.UtcNow;
            return _userRepository.UpdateUser(user);
        }

        public async Task<IOption<User>> GetUserBasedOnResetToken(string resetToken)
        {
            return (await _userRepository.GetUserBasedOnResetToken(resetToken)).Then(
                Option.FromMaybeNull
            );
        }

        public IOption<ExpiredKeys> GetExpiredKeyWithAKey(string key)
        {
            return (_userRepository.GetExpiredKeyWithAKey(key).Result).Then(Option.FromMaybeNull);
        }

        public bool InsertExpiredKey(string key)
        {
            return _userRepository.InsertExpiredKey(key);
        }

        private bool IsValidEmail(string email)
        {
            return DoUnitOfWork(
                (string emailAddress) =>
                    new System.Net.Mail.MailAddress(emailAddress).Address == emailAddress,
                email,
                () => false
            );
        }

        public Task<dynamic> AddOrUpdateAddress(UserAddress userAddress, bool isAddOperation)
        {
            return _userRepository.AddOrUpdateAddress(userAddress, isAddOperation);
        }

        public async Task<IOption<IEnumerable<UserAddress>>> GetAddress(
            long userId,
            long id,
            byte addressType
        )
        {
            return (await _userRepository.GetUserAddress(userId, id, addressType)).Then(
                Option.FromMaybeNull
            );
        }

        public Task<dynamic> DeleteAddress(long Id)
        {
            return _userRepository.DeleteUserAddress(Id);
        }

        public async Task<IOption<IEnumerable<UserProfile>>> GetUserProfile(long userId)
        {
            return (await _userRepository.GetUserProfile(userId)).Then(Option.FromMaybeNull);
        }

        public Task<dynamic> UpdateUserProfile(long userId, UserProfile profileData)
        {
            return _userRepository.UpdateUserProfile(profileData, userId);
        }

        public Task<dynamic> DeleteUser(long userId)
        {
            return _userRepository.DeleteUser(userId);
        }
    }
}
