let dealerSum = 0;
let playerSum = 0;
let dealerAceCount = 0;
let playerAceCount = 0;
let hidden;
let deck;
let canHit = true; // allows the player to draw while yourSum<21

const dealerCards = document.getElementById("dealer-cards");
const playerCards = document.getElementById("player-cards");
const dealerSumDisplay = document.getElementById("dealer-sum");
const playerSumDisplay = document.getElementById("player-sum");
const resultsDisplay = document.getElementById("results");
const hitButton = document.getElementById("hit");
const stayButton = document.getElementById("stay");

window.addEventListener("load", () => {
    buildDeck();
    shuffleDeck();
    startGame();
  });

function buildDeck() {
    const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K" ];
    const types = ["C", "D", "H", "S"];
    deck = [];
    for (let i = 0; i < types.length; i++) {
      for (let j = 0; j < values.length; j++){
        deck.push(`${values[j]}-${types[i]}`);
      }
    }
}

function shuffleDeck(){
    for(let i = 0; i < deck.length; i++){
        const j = Math.floor(Math.random() * deck.length);
        [deck[i], deck[j]] = [deck[j], deck[i]];
      }
    }

function startGame(){
        hidden = deck.pop();
        dealerSum += getValue(hidden);
        dealerAceCount += checkAce(hidden);
        
        while (dealerSum<17){
            let cardImg = document.createElement("img");
            let card = deck.pop();
            cardImg.src = "./cards/" + card + ".png";
            dealerSum += getValue(card);
            dealerAceCount += checkAce(card);
            document.getElementById("dealer-cards").append(cardImg);
        }
        console.log(dealerSum);

        for(let i= 0; i<2; i++){
            let cardImg = document.createElement("img");
            let card = deck.pop();
            cardImg.src = "./cards/" + card + ".png";
            playerSum += getValue(card);
            playerAceCount += checkAce(card);
            document.getElementById("player-cards").append(cardImg);
        }
        console.log(playerSum);
        document.getElementById("hit").addEventListener("click", hit);
        document.getElementById("stay").addEventListener("click", stay);
}

function hit(){
    if(!canHit){
        return;
    }

    let cardImg = document.createElement("img");
    let card = deck.pop();
    cardImg.src = `./cards/${card}.png`;
    playerSum += getValue(card);
    playerAceCount += checkAce(card);
    document.getElementById("player-cards").append(cardImg);
    if (reduceAce(playerSum, playerAceCount) > 21){
        canHit = false;
    }
}

function reduceAce(playerSum, playerAceCount) {
    while(playerSum > 21 && playerAceCount > 0){
        playerSum -= 10;
        playerAceCount -= 1;
    }
    return playerSum;

}

function stay() {
    dealerSum = reduceAce(dealerSum, dealerAceCount);
    playerSum = reduceAce(playerSum, playerAceCount);
    canHit = false;
    document.getElementById("hidden").src =`./cards/${hidden}.png`;
    let message = "";
    if(playerSum> 21){
        message = "You lose";
    }
    else if (dealerSum> 21){
        message="You win";
    }
    else if (playerSum> dealerSum){
        message="You win";
    }
    else if (dealerSum> playerSum){
        message= "You lose";
    }
    else if (playerSum==dealerSum){
        message= "Tie!";
 
    }
    document.getElementById("results").innerText = message;
    document.getElementById("dealer-sum").innerText = dealerSum;
    document.getElementById("player-sum").innerText = playerSum;

}


function getValue(card){
    let data = card.split("-"); // "4-C" -> ["4", "C"]
    let value = data[0];

    if (isNaN(value)) {
        if (value == "A") {
             return 11;
        }
        return 10;
    }
    return parseInt(value);
}
function checkAce(card){
    if(card[0] == "A"){
        return 1;
    } 
    return 0;
}