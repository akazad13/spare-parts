using System.Threading.Tasks;

namespace DHP.Domain.Utilities
{
    public class GenericResponse
    {
        public GenericResponse(string message)
        {
            Message = message;
        }

        public string Message { get; set; }
    }

    public static class Response<T>
    {
        public static IResult<T> SuccessResponese(T value)
        {
            return new Success<T>(value);
        }

        public static IResult<T> ErrorResponse(string message)
        {
            return new Error<T>(new GenericResponse(message));
        }

        public static IResult<T> ErrorResponse(GenericResponse genericResponse)
        {
            return new Error<T>(genericResponse);
        }

        public static IResult<GenericResponse> SuccessResponese(string message)
        {
            return new Success<GenericResponse>(new GenericResponse(message));
        }

        public static Task<IResult<T>> GetErrorResponseMessage(string message)
        {
            return Task<IResult<T>>.Factory.StartNew(() => ErrorResponse(message));
        }
    }
}