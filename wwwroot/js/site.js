document.addEventListener("DOMContentLoaded", () => {
    const textDisplay = document.getElementById("textDisplay");
    const hiddenInput = document.getElementById("hidden-input");
    const restartButton = document.getElementById("restart-btn");
    const resultsContainer = document.getElementById("results-container");
    const countdownDisplay = document.getElementById("countdown");
    const wpmDisplay = document.getElementById("wpm");
    const accuracyDisplay = document.getElementById("accuracy");

    let globalCorrectChars = 0;
    let globalWrongChars = 0;
    let globalTotalTyped = 0;
    let globalCorrectWords = 0;
    let globalWrongWords = 0;

    let lines = Array.from(document.querySelectorAll(".line")).map(line => line.innerText.trim());

    let countdownActive = false;
    let timeLeft = 10;
    let startTime;
    let countdownInterval;

    function startCountdown() {
        if (countdownActive) return;

        countdownActive = true;
        countdownInterval = setInterval(() => {
            timeLeft--;
            countdownDisplay.textContent = `Time Left: ${timeLeft}s`;

            if (timeLeft <= 0) {
                clearInterval(countdownInterval);
                countdownDisplay.textContent = "Time's up!";
                hiddenInput.value = '';
                hiddenInput.disabled = true;
                showResults();
            }
        }, 1000);
    }

    function showResults() {
        resultsContainer.style.display = "block";
        restartButton.style.display = "inline-block";

        document.getElementById("result-wpm").textContent = `WPM: ${wpmDisplay.textContent.split(': ')[1]}`;
        document.getElementById("result-accuracy").textContent = `Accuracy: ${accuracyDisplay.textContent.split(': ')[1]}`;
        document.getElementById("correct-words").textContent = `Correct Words: ${globalCorrectWords}`;
        document.getElementById("wrong-words").textContent = `Wrong Words: ${globalWrongWords}`;
        document.getElementById("wrong-characters").textContent = `Wrong Characters: ${globalWrongChars}`;
    }
    function regenerateText() {
        fetch('/Typing/RegenerateText')
            .then(response => response.json())
            .then(newTextSamples => {
                textDisplay.innerHTML = '';
                newTextSamples.forEach(text => {
                    const lineDiv = document.createElement('div');
                    lineDiv.classList.add('line');
                    lineDiv.innerText = text;
                    textDisplay.appendChild(lineDiv);
                });

                lines = newTextSamples;
                updateAllChars();
                hiddenInput.value = '';
            })
            .catch(err => console.error('Error regenerating text:', err));
    }
    function updateAllChars() {
        const allLines = document.querySelectorAll(".line");
        allLines.forEach(line => {
            const chars = line.innerText.split('').map(char => {
                const span = document.createElement('span');
                span.classList.add('char');
                span.textContent = char;
                return span;
            });

            line.innerHTML = '';
            chars.forEach(span => line.appendChild(span));
        });
    }

    hiddenInput.addEventListener("input", () => {
        const typedText = hiddenInput.value;

        if (!countdownActive) {
            startCountdown();
            startTime = new Date();
        }

        const allChars = document.querySelectorAll(".char");
        allChars.forEach(char => char.classList.remove("underline"));

        let roundCorrectChars = 0;
        let roundWrongChars = 0;

        typedText.split('').forEach((char, index) => {
            const expectedChar = allChars[index]?.textContent || '';

            if ((char === expectedChar) || (expectedChar === '·' && char === ' ')) {
                allChars[index].classList.add("green");
                allChars[index].classList.remove("red");
                roundCorrectChars++;
            } else {
                allChars[index].classList.add("red");
                allChars[index].classList.remove("green");
                roundWrongChars++;
            }
        });

        const normalizedTyped = typedText.replace(/ /g, '·');
        const roundTypedWords = normalizedTyped.split('·').filter(word => word.length > 0);

        const expectedText = lines.join('');
        const expectedWords = expectedText.split('·').filter(word => word.length > 0);

        let roundCorrectWords = 0;
        let roundWrongWords = 0;

        for (let i = 0; i < roundTypedWords.length; i++) {
            if (roundTypedWords[i] === expectedWords[i]) {
                roundCorrectWords++;
            } else {
                roundWrongWords++;
            }
        }

        globalCorrectChars = roundCorrectChars;
        globalWrongChars = roundWrongChars;
        globalTotalTyped = roundCorrectChars + roundWrongChars;
        globalCorrectWords = roundCorrectWords;
        globalWrongWords = roundWrongWords;
        if (allChars[typedText.length]) {
            allChars[typedText.length].classList.add("underline");
        }
        if (typedText.length === allChars.length) {
            regenerateText();
            return;
        }

        const elapsedTime = (new Date() - startTime) / 1000 / 60;
        const wpm = elapsedTime > 0 ? Math.round((globalCorrectChars / 5) / elapsedTime) : 0;
        const accuracy = globalTotalTyped > 0
            ? Math.round((globalCorrectChars / globalTotalTyped) * 100)
            : 100;

        wpmDisplay.textContent = `WPM: ${wpm}`;
        accuracyDisplay.textContent = `Accuracy: ${accuracy > 100 ? 100 : accuracy}%`;
        document.getElementById("correct-words").textContent = `Correct Words: ${globalCorrectWords}`;
        document.getElementById("wrong-words").textContent = `Wrong Words: ${globalWrongWords}`;
        document.getElementById("wrong-characters").textContent = `Wrong Characters: ${globalWrongChars}`;
    });
    document.addEventListener("keydown", () => {
        if (!hiddenInput.disabled) hiddenInput.focus();
    });

    restartButton.addEventListener("click", () => {
        window.location.reload();
    });

    updateAllChars();
});
