using System;
using System.Collections.Generic;

namespace SpeedTypingTest.Patterns
{
    public static class TextFactory
    {
        private static readonly List<string> wordPool = new List<string>
        {
            "alien", "earn", "nearer", "planet", "water",
            "river", "cloud", "storm", "light", "forest",
            "mountain", "valley", "animal", "flower", "garden",
            "wind", "ocean", "island", "desert", "village",
            "city", "castle", "bridge", "train", "station",
            "airport", "market", "school", "hospital", "library"
        };
        public static string GenerateRandomText()
        {
            var random = new Random();
            var selectedWords = new List<string>();

            while (selectedWords.Count < 10)
            {
                string word = wordPool[random.Next(wordPool.Count)];
                if (!selectedWords.Contains(word))
                {
                    selectedWords.Add(word);
                }
            }

            return string.Join("·", selectedWords) + ";";
        }
        public static List<string> GenerateTextBatch()
        {
            var textBatch = new List<string>
            {
                GenerateRandomText(),
                GenerateRandomText(),
                GenerateRandomText()
            };
            var singletonText = TextService.Instance.GetSingletonText();
            var random = new Random();
            textBatch.Insert(random.Next(1, 3), singletonText);

            return textBatch;
        }
    }
}
