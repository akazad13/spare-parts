using System;
using System.Collections.Generic;

namespace SpareParts.Domain.Utilities
{
    public class Some
    {
        public static IOption<T> Of<T>(T value)
        {
            return new Some<T>(value);
        }
    }

    public class Option
    {
        public static IOption<T> FromNullable<T>(T? v) where T : struct
        {
            return v.HasValue ? Some.Of(v.Value) : new None<T>();
        }

        public static IOption<T> FromMaybeNull<T>(T v) where T : class
        {
            return v != null ? Some.Of(v) : new None<T>();
        }

        public static IEnumerable<T> ToEnumerable<T>(IOption<T> value)
        {
            return value.ToList();
        }
    }

    public class Some<T> : IOption<T>
    {
        protected bool Equals(Some<T> other)
        {
            return EqualityComparer<T>.Default.Equals(Value, other.Value);
        }

        public override bool Equals(object obj)
        {
            if (obj is null)
                return false;
            if (ReferenceEquals(this, obj))
                return true;
            if (obj.GetType() != GetType())
                return false;
            return Equals((Some<T>)obj);
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(Value);
        }

        public T Value { get; }

        public Some(T value)
        {
            Value = value;
        }

        public bool IsSome => true;

        public bool IsSomeOf(T value)
        {
            return Value.Equals(value);
        }

        public bool IsNone => false;

        public IOption<T> Guard(bool condition)
        {
            return condition ? Some.Of(Value) : new None<T>();
        }

        public IOption<T> Alt(IOption<T> _)
        {
            return Some.Of(Value);
        }

        public TResult Match<TResult>(Func<T, TResult> onSome, Func<TResult> _)
        {
            return onSome(Value);
        }

        public IOption<TResult> Bind<TResult>(Func<T, IOption<TResult>> f)
        {
            return f(Value);
        }

        public IOption<TResult> Map<TResult>(Func<T, TResult> f)
        {
            return new Some<TResult>(f(Value));
        }

        public T Or(T _)
        {
            return Value;
        }

        public void Iter(Action<T> onSome)
        {
            onSome(Value);
        }

        public IList<T> ToList()
        {
            return new List<T> { Value };
        }

        public T Always()
        {
            return Value;
        }
    }

    public class None<T> : IOption<T>
    {
        public override bool Equals(object obj)
        {
            return obj?.GetType() == GetType();
        }

        public override int GetHashCode()
        {
            return 0;
        }

        public bool IsSome => false;

        public bool IsSomeOf(T value)
        {
            return false;
        }

        public bool IsNone => true;

        public IOption<T> Guard(bool condition)
        {
            return new None<T>();
        }

        public TResult Match<TResult>(Func<T, TResult> _, Func<TResult> onNone)
        {
            return onNone();
        }

        public IOption<T> Alt(IOption<T> other)
        {
            return other;
        }

        public IOption<TResult> Bind<TResult>(Func<T, IOption<TResult>> _)
        {
            return new None<TResult>();
        }

        public IOption<TResult> Map<TResult>(Func<T, TResult> _)
        {
            return new None<TResult>();
        }

        public T Or(T aDefault)
        {
            return aDefault;
        }

        public void Iter(Action<T> _) { }

        public IList<T> ToList()
        {
            return new List<T>();
        }

        public T Always()
        {
            return default;
        }
    }
}
