//CSS
import './App.css';

//React
import { useCallback, useEffect, useState } from 'react';

//Data
import { wordsList } from './data/words';

//Compónents
import StartScreen from './components/StartScreen/StartScreen';
import Game from './components/Game/Game';
import GameOver from './components/GameOver/GameOver';

const stages = [
  { id: 1, name: "start" },
  { id: 2, name: "game" },
  { id: 3, name: "end" }
]

const quantGuessed = 3;

function App() {
  const [gameStage, setGameStage] = useState(stages[0].name);
  const [words] = useState(wordsList);

  const [pickedWord, setPickedWord] = useState("");
  const [pickedCategory, setPickedCategory] = useState("");
  const [letters, setLetters] = useState([]);

  //States do jogo
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [guesses, setGuesses] = useState(quantGuessed);
  const [score, setScore] = useState(0);

  const pickWordAndCategory = useCallback(() => {
    //Escolhendo categoria aleatória
    const categories = Object.keys(words);
    const category = categories[Math.floor(Math.random() * Object.keys(categories).length)];

    //Escolhendo palavra aleatória
    const word = words[category][Math.floor(Math.random() * words[category].length)];

    return { category, word };
  }, [words]);

  //Ir para a tela de Game
  const startGame = useCallback(() => {
    clearLetterState();
    const { category, word } = pickWordAndCategory();

    //Pegando letras da palavra
    let wordLetters = word.split("");
    wordLetters = wordLetters.map((palavra) => palavra.toLowerCase());

    //Mudanod estadoes
    setPickedCategory(category);
    setPickedWord(word);
    setLetters(wordLetters);

    setGameStage(stages[1].name);
  }, [pickWordAndCategory]);

  //Processar letra no input
  const verifyLetter = (letter) => {
    console.log(letter);
    const normalizedLetter = letter.toLowerCase();

    //Checando se já a letra já foi utilizada
    if (guessedLetters.includes(normalizedLetter)) {
      alert(`A letra ${letter} já foi acertada!`);
      return;
    } else if (wrongLetters.includes(normalizedLetter)) {
      alert(`A letra ${letter} já foi utilizada!`);
      return;
    }

    //Colocando letras acertadas
    if (letters.includes(normalizedLetter)) {
      setGuessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters,
        normalizedLetter
      ])
    } else {
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters,
        normalizedLetter
      ])
      setGuesses((actualGuesses) => actualGuesses - 1);
    }
  }

  const clearLetterState = () => {
    setGuessedLetters([]);
    setWrongLetters([]);
  }

  useEffect(() => {
    if(guesses <= 0) {
      //Resetar o game
      clearLetterState();

      setGameStage(stages[2].name)

      //salvar no localStorage a pontuaçao geral
      if(localStorage.getItem("scoreGeral")) {
        let scoreAnterior = localStorage.getItem("scoreGeral");
        localStorage.setItem("scoreGeral", (Number(scoreAnterior) + score));
      } else {
        localStorage.setItem("scoreGeral", score);
      }
    }
  }, [guesses, score])

  useEffect(() => {
    const uniqueLetters = [...new Set(letters)];

    //Condição de vitória
    if(uniqueLetters.length === guessedLetters.length && uniqueLetters.length !== 0) {
      setScore((actualScore) => actualScore += 100);
      startGame();
    }

  }, [guessedLetters, letters, startGame])

  //Renicializar o jogo
  const retry = () => {
    setScore(0);
    setGuesses(quantGuessed);
    setGameStage(stages[0].name);
  }

  return (
    <div className="App">
      {gameStage === 'start' && <StartScreen startGame={startGame} />}
      {gameStage === 'game' &&
        <Game
          verifyLetter={verifyLetter}
          pickedWord={pickedWord}
          pickedCategory={pickedCategory}
          letters={letters}
          guessedLetters={guessedLetters}
          wrongLetters={wrongLetters}
          guesses={guesses}
          score={score}
        />}
      {gameStage === 'end' && <GameOver retry={retry} score={score} />}
    </div>
  );
}

export default App;
