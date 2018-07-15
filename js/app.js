/*
 * The variable holds Deck element
 */
    const deckElement = document.querySelector('.deck');

/*
 * Displays the cards on the page
 *   - shuffles the list of cards using the provided "shuffle" method below
 *   - loop through each card and creates its HTML
 *   - adds each card's HTML to the page
 */
    const shuffledDeck = shuffle(Array.from(document.querySelectorAll('.card')));

    for (card of shuffledDeck) {
        deckElement.appendChild(card);
    }

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

    //Sets up an click-event listener function for deck element 
    deckElement.addEventListener('click', gameLogic);
    //Array to hold open cards
    let openCards = [];
    /*Core function of this game, drives below actions
        -Open, hide and match cards 
        -Start and stop counter for recording moves made by user
        -Start and stop timer to record time taken to match all cards
        -Rate user based on moves made by user
        -Displaying results in modal
    Part of below function are inspired from 
    webinar - https://www.youtube.com/watch?v=_rUH-sEs68Y
    */
    function gameLogic(event) {
        const targetCard = event.target;
        //If the event target is card, proceed. If not, exit
        if (!targetCard.classList.contains('card')) {
            return;
        }
        //Start timer upon first click
        if (firstClick === false) {
            firstClick = true;
            startTimer();
        }
        //Verify Card's current status
        if (verifyCardSate(targetCard)) {
            //Store open cards in array
            openCards.push(targetCard);
            //Count moves
            counter++;

            //Open and display the card
            openCard(targetCard);

            //Record moves and update rating based on moves
            setMoves(moves);
            setScores(counter);

            //At a time, open only 2 cards and verify if they match
            if (openCards.length === 2) {
                if (openCards[0].children[0].classList.value === openCards[1].children[0].classList.value) {
                    //If cards match, update style to differentiate from open cards
                    matchCard(openCards[0]);
                    matchCard(openCards[1]);
                    //Count matched pairs
                    matches++;
                    //When all cards matched, stop timer and display results    
                    if (matches === 8) {
                        stopTimer();
                        displayResults();
                        return;
                    }
                    //Empty open cards array, open each match
                    openCards = [];
                }
                //Keeps cards open for 1 second and close when they do not match
                setTimeout(function () {
                    openCards.forEach(function (targetCard) {
                        closeCard(targetCard);
                    });
                    openCards = [];
                }, 1000);
            }
        }
    }

    //Declaring variables to be used in various functions to alter data 
    let firstClick = false;
    let matches = 0;
    let counter = 0;
    let minutes = 0, seconds = 0;
    let timer;

    //Variables to set rating and moves 
    let rating = document.querySelector('.stars');
    let moves = document.querySelector('.moves');

    //Assigns click event listener to Reset Game icon
    document.querySelector('.restart').addEventListener('click', resetGame);

    /*Major parts of start, format and stop timer are inspired from 
    webinar - https://www.youtube.com/watch?v=h_vUG-vi2LY*/

    //Function to start timer
    function startTimer() {
        timer = setInterval(function () {
            seconds++;
            if (seconds === 60) {
                minutes++;
                seconds = 0;
            }
            if (minutes === 60) {
                hour++;
                minutes = 0;
            }
            document.querySelector('.timer').innerText = formatTimerDisplay();
        }, 1000);
        
    }
    //Function to stop timer
    function stopTimer() {
        clearInterval(timer);
        document.querySelector('.timer').innerText = formatTimerDisplay();
    }
    //Format timer display
    function formatTimerDisplay() {
        let sec = seconds > 9 ? String(seconds) : '0' + String(seconds);
        let min = minutes > 9 ? String(minutes) : '0' + String(minutes);
        return min  + ':' + sec;
    }

    //This function verifies card's current state, to allow or deny click and match cards
    function verifyCardSate(targetCard) {
        return !targetCard.classList.contains('open') && !targetCard.classList.contains('show') &&
            !targetCard.classList.contains('match');
    }

    //This function sets number of moves made by user
    function setMoves() {
        moves.innerHTML = counter;
    }

    //This funcation changes card's style, when matched
    function matchCard(card) {
        card.classList.toggle('match');
    }
    //Function to close card
    function closeCard(card) {
        card.classList.remove('open', 'show');
    }
    //Function to open and show card
    function openCard(card) {
        card.classList.add('open', 'show');
    }
    //Resets Game
    function resetGame() {
        moves.innerHTML = "";
        window.location.reload();
    }

    //This function sets the score/rating based on number of moves made by user
    function setScores(counter){
        if (counter > 16 && counter <= 24 && rating.children.length ===3) {
            let replcaeStar = rating.children[2]; 
            rating.removeChild(replcaeStar);
        }
        else if (counter > 24 && counter <= 32 && rating.children.length ===2) {
            let replcaeStar1 = rating.children[1];
            rating.removeChild(replcaeStar1);
        }
    }

    //Function to open or hide modal
    function flipModal() {
        const modalElement = document.querySelector('.modal_bg');
        modalElement.classList.toggle('vanish');
    }

    /*Function to open modal,  display game stats
    and add event listener for replay & cancel buttons*/
    function displayResults() {
        flipModal();
        addGameStats();
        document.querySelector('.replay_button').addEventListener('click', resetGame);
        document.querySelector('.cancel_button').addEventListener('click', flipModal);
    }

    //Function to write game stats to modal-pop
    function addGameStats() {
        const timeSpan = document.querySelector('.game_time');
        const stopWatch = document.querySelector('.timer').innerHTML;
        timeSpan.innerHTML = `Time taken= ${stopWatch}`;
        const moveTracker = document.querySelector('.game_moves');
        moveTracker.innerHTML = `Moves made= ${moves.innerHTML}`;
        const ratingTracker = document.querySelector('.game_rating');
        ratingTracker.innerHTML = `Your rating= ${rating.children.length}`;
    }
