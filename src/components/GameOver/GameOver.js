import "./GameOver.css";

import React from 'react'

const GameOver = ({retry, score}) => {
    return (
        <div>
            <h1>Fim de Jogo!</h1>
            <h2>Sua pontuação: <span>{score}</span></h2>
            <button onClick={retry}>Restart jogo</button>
        </div>
    )
}

export default GameOver;