'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Blackjack() {
  const [dealerSum, setDealerSum] = useState(0);
  const [playerSum, setPlayerSum] = useState(0);
  const [dealerAceCount, setDealerAceCount] = useState(0);
  const [playerAceCount, setPlayerAceCount] = useState(0);
  const [hidden, setHidden] = useState('');
  const [deck, setDeck] = useState<string[]>([]);
  const [canHit, setCanHit] = useState(true);
  const [dealerCards, setDealerCards] = useState<string[]>([]);
  const [playerCards, setPlayerCards] = useState<string[]>([]);
  const [results, setResults] = useState('');
  const [balance, setBalance] = useState(1000);
  const [bet, setBet] = useState(10);
  const [user, setUser] = useState<string | null>(null);
  const [username, setUsername] = useState('');

  const buildDeck = () => {
    const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    const types = ["C", "D", "H", "S"];
    const newDeck: string[] = [];
    for (let i = 0; i < types.length; i++) {
      for (let j = 0; j < values.length; j++) {
        newDeck.push(`${values[j]}-${types[i]}`);
      }
    }
    return newDeck;
  };

  const shuffleDeck = (deck: string[]) => {
    for (let i = 0; i < deck.length; i++) {
      const j = Math.floor(Math.random() * deck.length);
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
  };

  const getValue = (card: string) => {
    const data = card.split("-");
    const value = data[0];
    if (isNaN(Number(value))) {
      if (value === "A") return 11;
      return 10;
    }
    return parseInt(value);
  };

  const checkAce = (card: string) => {
    return card[0] === "A" ? 1 : 0;
  };

  const reduceAce = (sum: number, aceCount: number) => {
    let newSum = sum;
    let newAceCount = aceCount;
    while (newSum > 21 && newAceCount > 0) {
      newSum -= 10;
      newAceCount -= 1;
    }
    return newSum;
  };

  const startGame = useCallback(() => {
    const newDeck = shuffleDeck(buildDeck());
    setDeck(newDeck);
    const hiddenCard = newDeck.pop()!;
    setHidden(hiddenCard);
    let dSum = getValue(hiddenCard);
    let dAceCount = checkAce(hiddenCard);
    const newDealerCards: string[] = [];

    while (dSum < 17) {
      const card = newDeck.pop()!;
      newDealerCards.push(card);
      dSum += getValue(card);
      dAceCount += checkAce(card);
    }

    setDealerCards(newDealerCards);
    setDealerSum(dSum);
    setDealerAceCount(dAceCount);

    const newPlayerCards: string[] = [];
    let pSum = 0;
    let pAceCount = 0;
    for (let i = 0; i < 2; i++) {
      const card = newDeck.pop()!;
      newPlayerCards.push(card);
      pSum += getValue(card);
      pAceCount += checkAce(card);
    }

    setPlayerCards(newPlayerCards);
    setPlayerSum(pSum);
    setPlayerAceCount(pAceCount);
    setDeck(newDeck);
    setCanHit(true);
    setResults('');
  }, []);

  const hit = () => {
    if (!canHit) return;
    const newDeck = [...deck];
    const card = newDeck.pop()!;
    const newPlayerCards = [...playerCards, card];
    const pSum = playerSum + getValue(card);
    const pAceCount = playerAceCount + checkAce(card);
    setPlayerCards(newPlayerCards);
    setPlayerSum(pSum);
    setPlayerAceCount(pAceCount);
    setDeck(newDeck);
    if (reduceAce(pSum, pAceCount) > 21) {
      setCanHit(false);
    }
  };

  const stay = () => {
    const dSum = reduceAce(dealerSum, dealerAceCount);
    const pSum = reduceAce(playerSum, playerAceCount);
    setCanHit(false);
    let message = "";
    if (pSum > 21) {
      message = "You lose";
    } else if (dSum > 21) {
      message = "You win";
    } else if (pSum > dSum) {
      message = "You win";
    } else if (dSum > pSum) {
      message = "You lose";
    } else {
      message = "Tie!";
    }
    setResults(message);
    if (message === "You win") {
      setBalance(balance + bet);
    } else if (message === "You lose") {
      setBalance(balance - bet);
    }
  };

  useEffect(() => {
    startGame();
  }, [startGame]);

  return (
    <div style={{ fontFamily: 'Arial, Helvetica, sans-serif', textAlign: 'center', minHeight: '100vh', backgroundColor: '#0f4c0f', color: 'white', padding: '20px' }}>
      {!user ? (
        <div>
          <h1>Login to Casino</h1>
          <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Enter username" style={{ padding: '10px', margin: '10px' }} />
          <button onClick={() => setUser(username)} style={{ padding: '10px' }}>Login</button>
        </div>
      ) : (
        <>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>Blackjack</h1>
          <p>Balance: {balance} coins</p>
          <div style={{ marginBottom: '10px' }}>
            <p>Bet: {bet} coins</p>
            <button onClick={() => setBet(Math.max(10, bet - 10))} disabled={bet <= 10} style={{ marginRight: '5px' }}>-</button>
            <button onClick={() => setBet(Math.min(balance, bet + 10))} disabled={bet >= balance} style={{ marginRight: '10px' }}>+</button>
            <button onClick={() => setBalance(balance + 100)}>Add 100 Coins</button>
          </div>
          <h2>Dealer: <span>{canHit ? '?' : dealerSum}</span></h2>
          <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
            <Image src={canHit ? "/cards/BACK.png" : `/cards/${hidden}.png`} width={125} height={175} alt="hidden" style={{ margin: '2px' }} />
            {dealerCards.map((card, index) => (
              <Image key={index} src={`/cards/${card}.png`} width={125} height={175} alt={card} style={{ margin: '2px' }} />
            ))}
          </div>
          <h2>Player: <span>{reduceAce(playerSum, playerAceCount)}</span></h2>
          <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
            {playerCards.map((card, index) => (
              <Image key={index} src={`/cards/${card}.png`} width={125} height={175} alt={card} style={{ margin: '2px' }} />
            ))}
          </div>
          <br />
          <button onClick={hit} disabled={!canHit} style={{ width: '100px', height: '50px', fontSize: '20px', marginRight: '10px' }}>Hit</button>
          <button onClick={stay} disabled={!canHit} style={{ width: '100px', height: '50px', fontSize: '20px' }}>Stay</button>
          <p style={{ fontSize: '1.2rem', margin: '20px 0' }}>{results}</p>
          <br />
          <button onClick={startGame} style={{ width: '120px', height: '50px', fontSize: '20px' }}>New Game</button>
          <br />
          <Link href="/" className="text-yellow-300 underline mt-5 block">Back to Home</Link>
        </>
      )}
    </div>
  );
}