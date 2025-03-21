namespace SpeedTypingTest.Patterns
{
    public interface IText
    {
        string FormatText(string text);
    }

    public class BaseText : IText
    {
        public string FormatText(string text) => text;
    }

    public class TypingFeedbackDecorator : IText
    {
        private readonly IText _innerText;

        public TypingFeedbackDecorator(IText innerText)
        {
            _innerText = innerText;
        }

        public string FormatText(string text)
        {
            return string.Join("", text.Select((c, index) =>
                $"<span class='char' data-index='{index}'>{c}</span>"));
        }
    }
}
