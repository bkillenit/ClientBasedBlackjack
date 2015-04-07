var RANK = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

var SUIT = ["spades", "clubs", "hearts", "diamonds"];

var Deck = {
    deckCards: [],
    deckPos: 0,

    construct: function () {
        var index;

        $.each(RANK, function( i, rankVal ) {
            $.each(SUIT, function( k, suitVal ) {
                //alert(Deck.deckCards);
                Deck.deckCards.push([rankVal,suitVal]);
            });
        });
    },

    shuffle: function () {
        for(var i = 0; i < 26; i++){
            var randPos = Math.floor(Math.random()*52);
            if(randPos == i)
                randPos = Math.floor(Math.random()*52);
            var temp = Deck.deckCards[randPos];
            Deck.deckCards[randPos] = Deck.deckCards[i];
            Deck.deckCards[i] = temp;
        }
    },

    deal: function () {
        Deck.deckPos++;
        return this.deckCards[Deck.deckPos-1];
    },

    rankToString: function (c) {
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
    }
}

var Player = {
    construct: function() {
        var player = {

            cardsHolding: new Array(5),
            cardIndex: 0,
            total: 0,
            aceCounter: 0,
            wins: 0,

            addCard: function (c) {
                this.cardsHolding[this.cardIndex] = c;
                this.cardsValue();

                this.cardIndex++;
            },

            cardsValue: function () {
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
            },

            // returns a string of the value of the cards a player is currently holding, and adjust for 
            // soft versus hard numbers with the inclusion of aces. Ex. (17/7) for hand containing Ace,7
            getTotal: function () {
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
            },

            // refactor the conditional tree to decrease calling of the disablePlayerButtons function
            checkStatus: function() {
                if ( this.total > 21 ) {
                    $('#playerStatus').text("You busted, please try again");
                    disablePlayerButtons();
                }
                else if( this.total == 21 ) {
                    $('#playerStatus').text("Blackjack!");
                    disablePlayerButtons();
                }
                else {
                    if( this.cardIndex < 5 ) 
                        $('#playerStatus').text("Hit or Stay?");
                    else {
                        $('#playerStatus').text("You have reached the card limt of 5. Passing turn to dealer.");
                        disablePlayerButtons();
                    }
                }
            }
        } // end of player class

        return player;
    }
}