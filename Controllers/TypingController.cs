using Microsoft.AspNetCore.Mvc;
using SpeedTypingTest.Patterns;
using System.Collections.Generic;

namespace SpeedTypingTest.Controllers
{
    public class TypingController : Controller
    {
        public IActionResult Index()
        {
            List<string> textSamples = TextFactory.GenerateTextBatch();
            ViewData["TextSamples"] = textSamples;
            return View();
        }

        public IActionResult RegenerateText()
        {
            List<string> newTextSamples = TextFactory.GenerateTextBatch();
            return Json(newTextSamples);
        }
    }
}
