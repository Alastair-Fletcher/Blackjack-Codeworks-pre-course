// ====================================>> Create deck of 52 cards
function createDeck() {
  const SUITS = ['H', 'D', 'C', 'S'];
  const RANK = [
    'A',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    'J',
    'Q',
    'K',
  ];
  const DECK = [];
  for (let i = 0; i < SUITS.length; i++) {
    for (let j = 0; j < RANK.length; j++) {
      let value = parseInt(RANK[j]);
      if (RANK[j] == 'J' || RANK[j] == 'Q' || RANK[j] == 'K') {
        value = 10;
      } else if (RANK[j] == 'A') {
        value = 1;
      }
      DECK.push({
        name: `${RANK[j]}${SUITS[i]}`,
        value: value,
        image: `<img src="./images/${RANK[j]}${SUITS[i]}.svg" alt="${RANK[j]}${SUITS[i]}">`,
      });
    }
  }
  return DECK;
}
// ====================================>> Shuffle deck
function shuffle(collection) {
  let shuffledArr = Array.isArray(collection)
    ? collection.slice()
    : Object.values(collection);

  let length = shuffledArr.length;
  let t;
  let randIndex;
  while (length) {
    randIndex = Math.floor(Math.random() * length--);
    t = shuffledArr[length];
    shuffledArr[length] = shuffledArr[randIndex];
    shuffledArr[randIndex] = t;
  }
  return shuffledArr;
}
// ====================================>> Pick a random card
function pickRandomCard(deck) {
  let randomIndex = Math.floor(deck.length * Math.random());
  return deck[randomIndex];
}
// ====================================>> Start
const BLACKJACKDECK = createDeck();
const SHUFFLEDDECK = shuffle(BLACKJACKDECK);
let playerHand;
let dealerHand;
function startGame() {
  playerHand = [pickRandomCard(SHUFFLEDDECK), pickRandomCard(SHUFFLEDDECK)];
  dealerHand = [pickRandomCard(SHUFFLEDDECK)];
}
// ====================================>> Hit
function hit(playerOrDealer) {
  playerOrDealer.push(pickRandomCard(SHUFFLEDDECK));
}
// ====================================>> Stand
function stand() {
  dealerHand.unshift(pickRandomCard(SHUFFLEDDECK));
}
// ====================================>> Add up score
function addUpScore(hand) {
  let score = 0;
  let numOfAces = 0;
  for (let i = 0; i < hand.length; i++) {
    score += hand[i].value;
    if (hand[i].value === 1) {
      numOfAces += 1;
    }
  }
  for (let j = 0; j < numOfAces; j++) {
    if (score + 10 <= 21) {
      score += 10;
    }
  }
  return score;
}
// ====================================>> Play again
function playAgain() {
  window.location.reload();
}
// ====================================>> jQuery
jQuery(document).ready(function () {
  let win = $(
    '<div class="results-overlay"><h1>WIN</h1><button onClick="window.location.reload();">PLAY AGAIN</button></div>'
  );
  let lose = $(
    '<div class="results-overlay"><h1>LOSE</h1><button onClick="window.location.reload();">PLAY AGAIN</button></div>'
  );
  let draw = $(
    '<div class="results-overlay"><h1>DRAW</h1><button onClick="window.location.reload();">PLAY AGAIN</button></div>'
  );
  let bust = $(
    '<div class="results-overlay"><h1>BUST</h1><button onClick="window.location.reload();">PLAY AGAIN</button></div>'
  );
  $('#hit-button').hide();
  $('#stand-button').hide();
  // ====================================>> Play button
  $('#play-button').click(function () {
    startGame();
    $('#play-button').hide();
    $('#hit-button').show();
    $('#stand-button').show();
    $('#player-hand').append(playerHand[0].image, playerHand[1].image);
    $('#player-score').html(addUpScore(playerHand));
    $('#dealer-hand').append(
      '<img src="./images/backOfCard.svg" alt="backOfCard" id="backOfCard">',
      dealerHand[0].image
    );
    $('#dealer-score').html(addUpScore(dealerHand));
  });
  // ====================================>> Hit button
  $('#hit-button').click(function () {
    hit(playerHand);
    $('#player-hand').append(playerHand[playerHand.length - 1].image);
    $('#player-score').html(addUpScore(playerHand));
    if (addUpScore(playerHand) > 21) {
      $('body').prepend(bust);
    }
  });
  // ====================================>> Stand button
  $('#stand-button').click(function () {
    stand();
    $('#dealer-hand').prepend(dealerHand[0].image);
    $('#backOfCard').hide();
    while (addUpScore(dealerHand) <= 16) {
      hit(dealerHand);
      $('#dealer-hand').append(dealerHand[dealerHand.length - 1].image);
    }
    $('#dealer-score').html(addUpScore(dealerHand));
    if (addUpScore(dealerHand) > 21) {
      $('body').prepend(win);
    } else if (addUpScore(dealerHand) === addUpScore(playerHand)) {
      $('body').prepend(draw);
    } else if (addUpScore(dealerHand) < addUpScore(playerHand)) {
      $('body').prepend(win);
    } else {
      $('body').prepend(lose);
    }
  });
});
