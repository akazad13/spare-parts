using System;
using System.Collections.Generic;
using System.Text;

namespace DHP.Domain.Utilities
{
    public static class HelperFunctions
    {
        public static TResult Pipe<TValue, TResult>(TValue value, Func<TValue, TResult> f)
        {
            return f(value);
        }

        public static TResult Then<TValue, TResult>(this TValue value, Func<TValue, TResult> f)
        {
            return f(value);
        }

        public static void Then<TValue>(this TValue value, Action<TValue> f)
        {
            f(value);
        }
    }
}
