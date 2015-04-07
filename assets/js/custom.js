// construct the player object by setting another variable equal to the preconstructed object
// must be global in it's construction so it can be accessed by playerHit and playerStay methods
// *TODO have input for the amount of players wanted by user, up to 5 
// and use for loop to construct player objects

// more robust way of declaring local variables in javascript
window.player1 = {};
window.dealer = {};
window.deck = {};

dealer.turn = function() {
    var dealerStatus  = dealer.cardsValue();

    if( dealerStatus == 17 && dealer.aceCounter > 0 ) {
        var card = Deck.deal();
        dealer.addCard(card[0]);

        var cardString = Deck.rankToString(card[0]) + card[1];
        $('<img src="assets/img/classic-cards/' + cardString + '.png" class="card" alt="">').appendTo( $("#dealersCards") );
    }
}

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

$( document ).ready(function() {
    // alert("yay");
    $('#hit').on('click', hitFunction);
    $('#stay').on('click', stayFunction);
    initializeGame();
});

function initializeGame() {
    // constructs the Deck object and shuffles the multi-dimensional array :format[["rank","suit"],["...","..."]]
    // we will alwyas only have one deck, and therefore it isn't necessary to construct another variable
    deck = new Deck();
    deck.shuffle();
    player1 = new Player();
    dealer = new Player();

    // loops the deal to each player and the dealer twice
    for(var i=1; i <= 2; i++) {
        var card = deck.deal();
        dealer.addCard(card[0]);
        var cardString = deck.rankToString(card[0]) + card[1];
        $('<img src="assets/img/classic-cards/' + cardString + '.png" class="card" alt="">').appendTo( $("#dealersCards") );

        card = deck.deal();
        player1.addCard(card[0]);
        cardString = deck.rankToString(card[0]) + card[1];
        $('<img src="assets/img/classic-cards/' + cardString + '.png" class="card" alt="">').appendTo( $("#playersCards") );
    }

    $('#dealersNumber').text( dealer.getTotal() );
    $('#yourNumber').text( player1.getTotal() );

    setTimeout(function(){player1.checkStatus()},100);
}

function hitFunction() {
    //alert("Yay, you hit!");
    var card = deck.deal();
    player1.addCard(card[0]);

    var cardString = deck.rankToString(card[0]) + card[1];
    $('<img src="assets/img/classic-cards/' + cardString + '.png" class="card" alt="">').appendTo( $("#playersCards") );

    $('#yourNumber').text( player1.getTotal() );

    setTimeout(function(){player1.checkStatus()},100);
    // player.validateStatus();
};

function stayFunction() {
    disablePlayerButtons();
    // pass turn to dealer
};

$('#reset').click(function() {
    // temporary solution, want to reinitialize classes and restore state of UI so page doesnt have to reload
    // Reload the current page, without using the cache.
    $("#playersCards").empty();
    $("#dealersCards").empty();
    if( $._data($('#hit')[0], "events") == undefined) {
        enablePlayersButtons();
    }
    initializeGame();
});