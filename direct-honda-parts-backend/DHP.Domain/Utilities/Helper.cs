using DHP.Domain.Security;
using System;
using System.Security.Cryptography;
using System.Text;

namespace DHP.Domain.Utilities
{
    public class Helper
    {
        protected bool DoUnitOfWork(Action f)
        {
            try
            {
                f();
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        protected TResult DoUnitOfWork<TResult>(Func<TResult> f, Func<TResult> onError)
        {
            try
            {
                return f();
            }
            catch
            {
                return onError();
            }
        }

        protected TResult DoUnitOfWork<TResult>(Func<TResult> f, Func<Exception, TResult> onError)
        {
            try
            {
                return f();
            }
            catch (Exception e)
            {
                return onError(e);
            }
        }

        protected TResult DoUnitOfWork<TInput, TResult>(Func<TInput, TResult> f, TInput input, Func<TResult> onError)
        {
            try
            {
                return f(input);
            }
            catch
            {
                return onError();
            }
        }

        public bool VerifyPassword(string normalPassword, string hashedPassword)
        {
            return new HashingManager().Verify(normalPassword, hashedPassword);
        }

        public string TokenGenerate()
        {
            return BitConverter.ToString(new HashingManager().GetRandomBytes(32))?.ToLower()?.Replace("-", string.Empty);

        }

        public string TokenToHash(string token)
        {
            using HashAlgorithm algorithm = SHA256.Create();
            var byteArr = algorithm.ComputeHash(Encoding.UTF8.GetBytes(token));

            return Convert.ToBase64String(byteArr);
        }
    }
}
