document.addEventListener("DOMContentLoaded", () => {
    const choices = ["rock", "paper", "scissors"];
    let playerChoice = null;
    let playerWins = 0;
    let computerWins = 0;
    let ties = 0;

    const playerChoices = document.querySelectorAll(".choice");
    const computerImage = document.getElementById("computer-choice");
    const resultText = document.getElementById("result");
    const playAgainButton = document.getElementById("play-again");

    const playerWinsDisplay = document.getElementById("player-wins");
    const computerWinsDisplay = document.getElementById("computer-wins");
    const tiesDisplay = document.getElementById("ties");
    const resetButton = document.getElementById("reset");

    playerChoices.forEach(choice => {
        choice.addEventListener("click", () => {
            playerChoices.forEach(c => c.classList.remove("selected"));
            choice.classList.add("selected");
            playerChoice = choice.id;
            playComputerTurn();
        });
    });

    function playComputerTurn() {
        let computerChoice = "";
        resultText.textContent = "Computer is thinking...";
        playAgainButton.style.display = "none";

        let shuffleInterval = setInterval(() => {
            const randomIndex = Math.floor(Math.random() * 3);
            computerChoice = choices[randomIndex];
            computerImage.src = `images/${computerChoice}.png`;
        }, 500);

        setTimeout(() => {
            clearInterval(shuffleInterval);
            determineWinner(playerChoice, computerChoice);
        }, 3000);
    }

    function determineWinner(playerChoice, computerChoice) {
        if (playerChoice === computerChoice) {
            resultText.textContent = "It's a tie!";
            ties++;
            tiesDisplay.textContent = ties;
        } else if (
            (playerChoice === "rock" && computerChoice === "scissors") ||
            (playerChoice === "paper" && computerChoice === "rock") ||
            (playerChoice === "scissors" && computerChoice === "paper")
        ) {
            resultText.textContent = "You win!";
            playerWins++;
            playerWinsDisplay.textContent = playerWins;
        } else {
            resultText.textContent = "Computer wins!";
            computerWins++;
            computerWinsDisplay.textContent = computerWins;
        }

        playAgainButton.style.display = "inline-block";
    }

    playAgainButton.addEventListener("click", () => {
        resultText.textContent = "Make your choice!";
        computerImage.src = "images/question-mark.png";
        playerChoices.forEach(c => c.classList.remove("selected"));
        playAgainButton.style.display = "none";
    });

    resetButton.addEventListener("click", () => {
        playerWins = 0;
        computerWins = 0;
        ties = 0;
        playerWinsDisplay.textContent = playerWins;
        computerWinsDisplay.textContent = computerWins;
        tiesDisplay.textContent = ties;
        resultText.textContent = "Make your choice!";
        computerImage.src = "images/question-mark.png";
        playerChoices.forEach(c => c.classList.remove("selected"));
        playAgainButton.style.display = "none";
    });
});
