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
};

// List that holds all the cards
var deck = ["fa-diamond", "fa-diamond", "fa-paper-plane-o", "fa-paper-plane-o", "fa-anchor", "fa-anchor",
           "fa-bolt", "fa-bolt", "fa-cube", "fa-cube", "fa-leaf", "fa-leaf",
           "fa-bicycle", "fa-bicycle", "fa-bomb", "fa-bomb"];

// Game variables
var open = [];
var matched = 0;
var moveCount = 0;
var numStars = 3;
var timer;
var modal = $("#win-modal");
var threeStars = 15;
var twoStars = 20;

// create and update card html

function createCard() {
   var index = 0;
   $(".card i").each(function () {  //iterates over each card, creates its HTML and
     $(this).attr("class", "fa " + deck[index]);  //adds each card's HTML to the page
     index++;
   });
};

// generate random cards from the deck
function shuffleCards() {
        deck = shuffle(deck);
        deck.forEach(createCard);
}

// Places shuffled cards on page when loaded
shuffleCards();

// Start timer functions
startTimer();

// Primary functions of the game
var onClick = function() {
    if (validPick( $(this) )) {  //clicked card not open or matched

        if (open.length === 0) {  //if no cards already open then just
            openCard( $(this) );  //opens card

        } else if (open.length === 1) {  //if 1 card already open
            openCard( $(this) );   //opens card
            moveCount++;           //adds to moves
            updateMoveCount();     //and runs updateMoveCount funtion

            if (checkForMatch()) {  //if 1 already open runs checkforMatch function
                setTimeout(isMatch, 100);  //if matched-waits then puts in match state

            } else {
                setTimeout(flipBack, 400);//if no match-waits then flips cards back

            }
        }
    }
};

// Ensures selected card is not already open or matched
function validPick(card) {
    return !(card.hasClass("open") || card.hasClass("match"));//card not in open or match state
};

// Opens and shows selected card
function openCard(card) {
        card.addClass("open");//adds card to open class
        card.addClass("show");//adds card to show class
        open.push(card);//adds card to the open array-length

};

// Updates HTML for number of moves. Removes star based on number of moves.
function updateMoveCount() {
    $(".moves").text(moveCount);  //updates move count on board with new count

    if (moveCount === threeStars || moveCount === twoStars) {  //tracks total moves then
        removeStar();                                          //runs removeStar function
    }
};

// Removes star from remaining stars and updates modal
function removeStar() {
    $(".fa-star").last().attr("class", "fa fa-star-o"); //removes last star on board
    numStars--;  //reduces numStars count
    $(".num-stars").text(String(numStars));  //updates win modal with current number of stars
};

// checks if currently open cards match
function checkForMatch() {
    if (open[0].children().attr("class")===open[1].children().attr("class")) {
        return true;  //checks cards in position 1 and 2 in open array to see if they match
    }
};

// Sets open cards to the match state and checks for winner
var isMatch = function() {
    open.forEach(function(card) {
        card.addClass("match");  //puts cards in match state
    });
    open = [];  //empties open array
    matched ++;  //adds 1 to total matches

    if (winner()) {
        myStopFunction();   //function to stop the timer
        displayModal();     //function to show the win modal
    }
};

// Puts unmatched open cards back to default state
var flipBack = function() {
    open.forEach(function(card) {
        card.toggleClass("open");  //removes the class open from the card
        card.toggleClass("show");  //removes the class show from the card
    });
    open = [];  //empties open array
};

// checks if all cards are matched
function winner() {
    if (matched === 2) {  //checks for 8 matches
        return true;
    }
};

// Stops the timer
function myStopFunction() {
    clearInterval(timer);
}

// Turns win modal on
function displayModal() {
    modal.css("display", "block");
};

// Resets game
var playAgain = function() {
    resetGame();
};

// Restarts the game
var resetGame = function() {
    location=location;
};

// Starts timer on first match attempt
function startTimer() {
  var clicks=0;
  $(".card").on("click", function() {  //listens for card to be clicked
    clicks++;  //adds 1 to clicks
    if (clicks === 1) {  //starts timer below after first click
      /*Timer function from stackoverflow.com/questions/5517597*/
      var sec = 0;
      function time ( val ) { return val > 9 ? val : "0" + val; }
      timer = setInterval( function(){
        $(".seconds").html(time(++sec%60));
        $(".minutes").html(time(parseInt(sec/60,10)));
    }, 1000);
    }
  })
}

// Event listeners
$(".card").click(onClick);
$(".restart").click(resetGame);
$(".play-again").click(playAgain);
