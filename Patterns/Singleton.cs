using System;

namespace SpeedTypingTest.Patterns
{
    public sealed class TextService
    {
        private static readonly Lazy<TextService> instance = new(() => new TextService());

        public static TextService Instance => instance.Value;

        private readonly string singletonText = "This·text·is·implemented·just·once·with·the·pattern·Singleton;";

        public string GetSingletonText() => singletonText;
    }
}
