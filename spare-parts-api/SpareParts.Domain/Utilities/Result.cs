namespace SpareParts.Domain.Utilities
{
    public class Success<T> : IResult<T>
    {
        private readonly T _results;

        public Success(T results)
        {
            _results = results;
        }

        public TResult Match<TResult>(Func<T, TResult> onSuccess, Func<GenericResponse, TResult> _)
        {
            return onSuccess(_results);
        }

        public IResult<TResult> Map<TResult>(Func<T, TResult> f)
        {
            return new Success<TResult>(f(_results));
        }

        public IResult<TResult> Bind<TResult>(Func<T, IResult<TResult>> f)
        {
            return f(_results);
        }
    }

    public class Error<T> : IResult<T>
    {
        private readonly GenericResponse _error;

        public Error(GenericResponse error)
        {
            _error = error;
        }

        public TResult Match<TResult>(Func<T, TResult> _, Func<GenericResponse, TResult> onError)
        {
            return onError(_error);
        }

        public IResult<TResult> Map<TResult>(Func<T, TResult> _)
        {
            return new Error<TResult>(_error);
        }

        public IResult<TResult> Bind<TResult>(Func<T, IResult<TResult>> _)
        {
            return new Error<TResult>(_error);
        }
    }
}
