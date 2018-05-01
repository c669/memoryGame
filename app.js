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
var timer;
var open = [];
var matched = 0;
var moveCount = 0;
var stars = 3;
var threeStars = 15;
var twoStars = 20;
var modal = $("#win-modal");

// create and update card html
function createCard() {
   var index = 0;
   $(".card i").each(function () {  //iterates over each card, creates its HTML and
     $(this).attr("class", "fa " + deck[index]);  //adds each card's HTML to the page
     index++;  //adds 1 to index
   });
};

// generate random cards from the deck
function shuffleCards() {
        deck = shuffle(deck);
        deck.forEach(createCard);
};

// Places shuffled cards on page when loaded
shuffleCards();

// Start timer functions
startTimer();

// Ensures clicked card is available then starts main logic
function cardClick() {
  if (available( $(this) )) {
    gamePlay( $(this) );
  }
};

// Ensures selected card is not already open
function available(card) {
    return !(card.hasClass("open and show"));
};

// Main logic of the game
function gamePlay(card){
  if (open.length === 0) {  //if no cards already open then just
      openCard(card);       //opens card

  } else if (open.length === 1) {  //if 1 card already open
      openCard(card);              //opens card
      moveCount++;                 //adds to moves
      updateMoveCount();           //and runs updateMoveCount funtion

      if (checkForMatch()) {  //if 1 already open runs checkforMatch function
          setTimeout(isMatch(), 100);  //if matched-waits then puts in match state

      } else {
          setTimeout(flipBack, 400);//if no match-waits then flips cards back

      }
    }
};

// Opens and shows selected card
function openCard(card) {
        card.addClass("open and show");//adds card to open and show classes
        open.push(card);//adds card to the open array
};

// Updates HTML for number of moves. Removes star based on number of moves.
function updateMoveCount() {
    $(".moves").text(moveCount);  //updates move count on board with new count

    if (moveCount === threeStars) {   //tracks total moves then
        removeStar();               //runs removeStar function
    } else if (moveCount === twoStars) {  //tracks total moves then
        removeStar();                     //runs removeStar function
    }
};

// Removes star from remaining stars and updates modal
function removeStar() {
    $(".fa-star").last().attr("class", "fa fa-star-o"); //removes last star on board
    stars--;  //reduces numStars count
    $(".num-stars").text(String(stars));  //updates win modal with current number of stars
};

// checks if currently open cards match
function checkForMatch() {
    if (open[0].children().attr("class")===open[1].children().attr("class")) {
      return true;  //checks cards in position 1 and 2 in open array to see if they match
    }
};

// Sets open cards to the match state and checks for winner
function isMatch() {
    for (var i = 0, len = open.length; i < len; i++) {
      open[i].addClass("match"); //puts cards in match class
}
    open = [];  //empties open array
    matched ++;  //adds 1 to total matches

    if (winner()) {
        myStopFunction();   //function to stop the timer
        displayModal();     //function to show the win modal
    }
};

// Puts unmatched open cards back to default state
function flipBack() {
    for (var i = 0, len = open.length; i < len; i++) {
      open[i].toggleClass("open and show"); //removes the classes open and show from the card
}
    open = [];  //empties open array
};

// checks if all cards are matched
function winner() {
    if (matched === 8) {  //checks for 8 matches
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
$(".card").click(cardClick);
$(".restart").click(resetGame);
$(".play-again").click(playAgain);
