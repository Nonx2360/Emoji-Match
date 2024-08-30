const emojis = [
    '😀', '😁', '😂', '🤣', '😃', '😄', '😅', '😆', '😉', '😊',
    '😎', '😍', '😘', '🥰', '😗', '😙', '😚', '☺️', '🙂', '🙃',
    '😋', '😜', '😝', '😛', '🤑', '🤗', '🤩', '🥳', '😎', '🤓',
    '😏', '😒', '😞', '😟', '😠', '😡', '🤬', '🤯', '😱', '😳',
    '🤔', '🤐', '🤨', '😶', '😐', '😑', '😔', '😕', '😯', '😲'
];

let numPlayers = 2;
let playerNames = [];
let currentPlayerIndex = 0;
let gameState = [];
let flippedCards = [];
let matchedCards = 0;

function startGame() {
    numPlayers = parseInt(document.getElementById('numPlayers').value);
    document.getElementById('setup').style.display = 'none';
    document.getElementById('playerNames').style.display = 'block';

    let nameInputs = '';
    for (let i = 0; i < numPlayers; i++) {
        nameInputs += `<div>
            <label for="player${i}">Player ${i + 1} Name:</label>
            <input type="text" id="player${i}" required />
        </div>`;
    }
    document.getElementById('nameInputs').innerHTML = nameInputs;
}

function generateGame() {
    playerNames = [];
    for (let i = 0; i < numPlayers; i++) {
        const name = document.getElementById(`player${i}`).value.trim();
        if (name === '') {
            alert(`Please enter a name for Player ${i + 1}`);
            return;
        }
        playerNames.push(name);
    }

    document.getElementById('playerNames').style.display = 'none';
    document.getElementById('game').style.display = 'block';

    const numCards = 100; // 10x10 grid means 100 cards
    const numPairs = numCards / 2;

    if (emojis.length < numPairs) {
        alert('Not enough unique emojis to generate the game.');
        return;
    }

    const selectedEmojis = emojis.slice(0, numPairs);
    const gameEmojis = [...selectedEmojis, ...selectedEmojis].sort(() => 0.5 - Math.random());

    gameState = gameEmojis;
    flippedCards = [];
    matchedCards = 0;

    const gameBoard = document.getElementById('gameBoard');
    gameBoard.innerHTML = '';
    for (let i = 0; i < gameEmojis.length; i++) {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.index = i;
        card.addEventListener('click', handleCardClick);
        gameBoard.appendChild(card);
    }

    updateTurnDisplay();
}

function handleCardClick(event) {
    const index = event.target.dataset.index;

    if (flippedCards.length === 2 || event.target.classList.contains('flipped')) return;

    event.target.classList.add('flipped');
    event.target.textContent = gameState[index] || '';

    flippedCards.push({ element: event.target, index: index });

    if (flippedCards.length === 2) {
        checkMatch();
    }
}

function checkMatch() {
    const [firstCard, secondCard] = flippedCards;
    if (gameState[firstCard.index] === gameState[secondCard.index]) {
        firstCard.element.classList.add('matched');
        secondCard.element.classList.add('matched');
        matchedCards += 2;
        if (matchedCards === gameState.length) {
            alert(`Game Over! ${playerNames[currentPlayerIndex]} Wins!`);
            resetGame();
        }
    } else {
        setTimeout(() => {
            firstCard.element.classList.remove('flipped');
            secondCard.element.classList.remove('flipped');
            firstCard.element.textContent = '';
            secondCard.element.textContent = '';
            switchTurn();
        }, 1000);
    }
    flippedCards = [];
}

function switchTurn() {
    currentPlayerIndex = (currentPlayerIndex + 1) % numPlayers;
    updateTurnDisplay();
}

function updateTurnDisplay() {
    document.getElementById('turnDisplay').textContent = `It's ${playerNames[currentPlayerIndex]}'s turn`;
}

function resetGame() {
    document.getElementById('setup').style.display = 'block';
    document.getElementById('game').style.display = 'none';
}