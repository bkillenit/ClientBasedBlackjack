var RANK = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

var SUIT = ["spades", "clubs", "hearts", "diamonds"];

var Deck = function() {
    tempDeckCards = [];
    this.deckPos = 0;

    var index;

    $.each(RANK, function( i, rankVal ) {
        $.each(SUIT, function( k, suitVal ) {
            //alert(Deck.deckCards);
            tempDeckCards.push([rankVal,suitVal]);
        });
    });

    this.deckCards = tempDeckCards;
};

Deck.prototype.shuffle = function () {
    for(var i = 0; i < 26; i++){
        var randPos = Math.floor(Math.random()*52);
        if(randPos == i)
            randPos = Math.floor(Math.random()*52);
        var temp = this.deckCards[randPos];
        this.deckCards[randPos] = this.deckCards[i];
        this.deckCards[i] = temp;
    }
};

Deck.prototype.deal = function () {
    this.deckPos++;
    return this.deckCards[this.deckPos-1];
};

Deck.prototype.rankToString = function (c) {
    var rankString;
    switch(c) {
        case 1:
            rankString = "ace";
            break;
        case 11:
            rankString = "jack";
            break;
        case 12:
            rankString = "queen";
            break;
        case 13:
            rankString = "king";
            break;
        default:
            rankString = c.toString();
    }

    return rankString;
};

var Player = function() {
    this.cardsHolding =  new Array(5);
    this.cardIndex = 0;
    this.total = 0;
    this.aceCounter = 0;

    //alert(this.wins);

    // need to find a way to not initialize this if a value already exists
    this.wins = 0;
};

Player.prototype.clear = function() {
    delete this.cardsHolding;
    delete this.cardIndex;
    delete this.total;
    delete this.aceCounter;
}

Player.prototype.addCard = function (c) {
    this.cardsHolding[this.cardIndex] = c;
    this.cardsValue();

    this.cardIndex++;
};

Player.prototype.cardsValue = function () {
    // using for loop instead of $.each() form jQuery to avoid scoping error of the jQuery method
    // which keeps us from accessing any value outside of the loops scope, such as this.total
    var rankValue = this.cardsHolding[this.cardIndex] ;

    if ( rankValue != 1 ) {
        if( rankValue > 10 ) 
            this.total += 10;
        else 
            this.total += rankValue;

        if ( this.aceCounter == 1 && this.total > 21) {
            this.total -= 10;
            this.aceCounter++;
        }
    }
    else {
        switch(this.aceCounter){
        case 0:
            if( this.total > 10 ) 
                this.total += 1;
            else {
                this.total += 11;
            }
            break;
        case 1:
            this.aceCounter--;
            this.total += 1;
            break;
        default:
            this.total += 1;
            break;
        }

        this.aceCounter++;
    }
};

// returns a string of the value of the cards a player is currently holding, and adjust for 
// soft versus hard numbers with the inclusion of aces. Ex. (17/7) for hand containing Ace,7
// TODO: refactor to return an array containing the highest numeric total of the hand and a boolean 
// indicating if the 11 value of an Ace was used to compute the total. ie. total[number, bigAceValUsed]
Player.prototype.getTotal = function () {
    if ( this.aceCounter == 1 ) {
        if ( this.total != 21 ) {
            var soft = this.total - 10;
            return this.total + "/" + soft;
        } else {
            return "21";
        }
    }
    else {
        return this.total;
    }
};

// refactor the conditional tree to decrease calling of the disablePlayerButtons function
Player.prototype.checkStatus = function() {
    if ( this.total > 21 ) {
        $('#playerStatus').text("You busted, please try again");
        disablePlayerButtons();
    }
    else if( this.total == 21 ) {
        $('#playerStatus').text("Blackjack!");
        displayPlayerWin();
    }
    else {
        if( this.cardIndex < 5 ) 
            $('#playerStatus').text("Hit or Stay?");
        else {
            $('#playerStatus').text("You have reached the card limt of 5. Passing turn to dealer.");
            disablePlayerButtons();
            dealer.takeTurn();
        }
    }
};

// blank function which serves as a constructor target for the Dealer class
var Dealer = function() {};

// Dealer extends a player
Dealer.prototype = new Player();

// recursively making the dealer take turns until he hits a base case, which is a winning or losing condition
Dealer.prototype.takeTurn = function() {
    var dealerTotal  = this.getTotal();
    var totalIncludesBigAce = false;

    // if the total returns in format 17/7 then there is room for the player to hit, the game logic needs a number
    // for comparison however. The conditional below handles those cases.
    if(typeof dealerTotal == 'string'){
        dealerTotal = parseInt(dealerTotal.slice(0,2));
        totalIncludesBigAce = true;
    }

    // conditional block to tell the dealer what to do next in the game tree based on his current hand's state
    if(dealerTotal > 21) {
        $('#playerStatus').text('The dealer has busted');
        displayPlayerWin();
    }
    else if(dealerTotal == 21) {
        displayDealerWin();
    }
    else if( (this.cardIndex == 5) || (dealerTotal == 17 && dealer.aceCounter > 0) || (dealerTotal >= 17 && !totalIncludesBigAce) ) {
        comparePlayerResults();
    }
    else {
        // deal another card for the dealer
        var card = deck.deal();
        this.addCard(card[0]);
        $('#dealersNumber').text(this.getTotal());

        var cardString = deck.rankToString(card[0]) + card[1];
        $('<img src="assets/img/classic-cards/' + cardString + '.png" class="card" alt="">').appendTo( $("#dealersCards") );

        // sleep(2);
        this.takeTurn();
    }
};

function sleep(miliseconds) {
   var currentTime = new Date().getTime();

   while (currentTime + miliseconds >= new Date().getTime()) {
   }
}