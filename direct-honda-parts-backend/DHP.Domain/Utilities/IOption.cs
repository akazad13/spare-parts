using System;
using System.Collections.Generic;
using System.Text;

namespace DHP.Domain.Utilities
{
    public interface IOption<T>
    {
        bool IsSome { get; }
        bool IsSomeOf(T value);
        bool IsNone { get; }
        TResult Match<TResult>(Func<T, TResult> onSome, Func<TResult> onNone);
        IOption<TResult> Bind<TResult>(Func<T, IOption<TResult>> f);
        IOption<TResult> Map<TResult>(Func<T, TResult> f);
        IOption<T> Guard(bool condition);
        IOption<T> Alt(IOption<T> other);
        T Or(T aDefault);
        void Iter(Action<T> onSome);
        IList<T> ToList();
        T Always();
    }
}
