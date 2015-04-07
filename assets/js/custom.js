// construct the player object by setting another variable equal to the preconstructed object
// must be global in it's construction so it can be accessed by playerHit and playerStay methods
// *TODO have input for the amount of players wanted by user, up to 5 
// and use for loop to construct player objects
player1 = Player.construct();
dealer = Player.construct();

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
    buttons.forEach(function(value){
        var idString = '#' + value;
        $(idString).addClass('disabled');
        $(idString).off('click');
    });
}

$( document ).ready(function() {
    // alert("yay");

    // constructs the Deck object and shuffles the multi-dimensional array :format[["rank","suit"],["...","..."]]
    // we will alwyas only have one deck, and therefore it isn't necessary to construct another variable
    Deck.construct();
    Deck.shuffle();
    //Dealer dealer = new Dealer();

    // loops the deal to each player and the dealer twice
    for(var i=1; i <= 2; i++) {
        var card = Deck.deal();
        dealer.addCard(card[0]);

        /*
        if(i == 1) {
            $('<img src="assets/img/classic-cards/b1fv.png" class="card" alt="">').appendTo( $("#dealersCards") );
        } else { */
            var cardString = Deck.rankToString(card[0]) + card[1];
            $('<img src="assets/img/classic-cards/' + cardString + '.png" class="card" alt="">').appendTo( $("#dealersCards") );
        // }
        
        card = Deck.deal();
        player1.addCard(card[0]);
        cardString = Deck.rankToString(card[0]) + card[1];
        $('<img src="assets/img/classic-cards/' + cardString + '.png" class="card" alt="">').appendTo( $("#playersCards") );
    }

    $('#dealersNumber').text( dealer.getTotal() );
    $('#yourNumber').text( player1.getTotal() );

    setTimeout(function(){player1.checkStatus()},100);

});

$('#hit').click(function() {
    //alert("Yay, you hit!");
    var card = Deck.deal();
    player1.addCard(card[0]);

    var cardString = Deck.rankToString(card[0]) + card[1];
    $('<img src="assets/img/classic-cards/' + cardString + '.png" class="card" alt="">').appendTo( $("#playersCards") );

    $('#yourNumber').text( player1.getTotal() );

    setTimeout(function(){player1.checkStatus()},100);
    // player.validateStatus();
});

$('#stay').click(function() {
    disablePlayerButtons();
    // pass turn to dealer
});