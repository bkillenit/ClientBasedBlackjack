// construct the player object by setting another variable equal to the preconstructed object
// must be global in it's construction so it can be accessed by playerHit and playerStay methods
// *TODO have input for the amount of players wanted by user, up to 5 
// and use for loop to construct player objects

// more robust way of declaring global variables in javascript, according to the MDN docs
window.player1 = undefined;
window.dealer = undefined;
window.deck = undefined;

var buttons = ['hit', 'stay'];

function disablePlayerButtons() {
    $.each(buttons, function(i, buttonName){
        $('#' + buttonName).addClass('disabled');
        $('#' + buttonName).off('click');
    });
}

function enablePlayersButtons() {
    $.each(buttons, function(i, buttonName){
        $('#' + buttonName).removeClass('disabled');
        $('#' + buttonName).on('click', window[buttonName + 'Function']);
    });
}

function displayDealerWin() {
    disablePlayerButtons();
    $('#playerStatus').text('The dealer has won');
}

function displayPlayerWin() {
    disablePlayerButtons();
    player1.wins++;
    $('#playerStatus').text('You have won! Congratulations!');
    $('#wins > #winTotal').text(player1.wins);
}

function displayPush() {
    disablePlayerButtons();
    $('#playerStatus').text('You have tied the dealer');
}

$( document ).ready(function() {
    // alert("yay");
    $('#hit').on('click', hitFunction);
    $('#stay').on('click', stayFunction);
    initializeGame();
});

function comparePlayerResults() {
    var player1Total = player1.getTotal();
    var dealerTotal = dealer.getTotal();

    // failsafe to parse out the numerical value of the player's and dealer's total
    // TODO: remove when the player and dealer classes available functions are refactored
    if(typeof player1Total == 'string'){
        player1Total = parseInt(player1Total.slice(0,2));
    }

    if(typeof dealerTotal == 'string'){
        dealerTotal = parseInt(dealerTotal.slice(0,2));
    }

    if( dealerTotal > player1Total ) {
        displayDealerWin();
    } else if( dealerTotal == player1Total ) {
        displayPush();
    }
    else {
        displayPlayerWin();
    }
}

function initializeGame() {
    // constructs the Deck object and shuffles the multi-dimensional array :format[["rank","suit"],["...","..."]]
    // we will alwyas only have one deck, and therefore it isn't necessary to construct another variable
    deck = new Deck();
    deck.shuffle();
    if(player1 == undefined) {
        player1 = new Player();
    } else {
        // clearing most property values of player1 instead of constructing the instance so the win
        // count of each player persists
        player1.clear();
    }
    dealer = new Dealer();

    // loops the deal to each player and the dealer twice, as dicatated by the game's rules
    for(var i=1; i <= 2; i++) {
        dealCard(dealer);
        dealCard(player1);
    }

    $('#dealersNumber').text( dealer.getTotal() );
    $('#yourNumber').text( player1.getTotal() );

    // if the dealer has 21, the dealer wins no matter what 2 cards the player has. pass turn to the player if
    // the dealer does not have 21 to begin the turn
    if( dealer.getTotal() == 21 ) {
        displayDealerWin();
    } else {
        setTimeout(function(){player1.checkStatus()},100);
    }
}

function dealCard( player ) {
    var card = deck.deal();
    player.addCard(card[0]);
    var cardString = deck.rankToString(card[0]) + card[1];

    //TODO: refactor logic to handle multiple players
    if (player instanceof Dealer) {
        $('<img src="assets/img/classic-cards/' + cardString + '.png" class="card" alt="' + cardString + '">').appendTo( $("#dealersCards") );
    } else {
        $('<img src="assets/img/classic-cards/' + cardString + '.png" class="card" alt="' + cardString + '">').appendTo( $("#playersCards") );
    }
}

function hitFunction() {
    dealCard(player1);
    $('#yourNumber').text( player1.getTotal() );

    player1.checkStatus();
};

function stayFunction() {
    disablePlayerButtons();

    // pass turn to dealer
    dealer.takeTurn();
};

$('#reset').click(function() {
    $("#playersCards").empty();
    $("#dealersCards").empty();
    if( $._data($('#hit')[0], "events") == undefined) {
        enablePlayersButtons();
    }

    initializeGame();
});