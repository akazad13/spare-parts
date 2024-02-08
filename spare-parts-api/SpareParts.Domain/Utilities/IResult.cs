namespace SpareParts.Domain.Utilities
{
    public interface IResult<T>
    {
        TResult Match<TResult>(Func<T, TResult> onSuccess, Func<GenericResponse, TResult> onError);

        IResult<TResult> Map<TResult>(Func<T, TResult> f);

        IResult<TResult> Bind<TResult>(Func<T, IResult<TResult>> f);
    }
}
