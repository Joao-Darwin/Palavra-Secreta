import "./StartScreen.css"
import React from 'react'

const StartScreen = ({ startGame }) => {
    let scoreGeral = localStorage.getItem("scoreGeral");

    return (
        <div className="startScreen">
            <h1>Start Screen</h1>
            <p>Clique no Botão abaixo para começar a jogar</p>
            <button onClick={startGame}>Começar o Jogo</button>
            {scoreGeral &&
                <p>Pontuação geral: <span>{scoreGeral}</span></p>
            }
        </div>
    )
}

export default StartScreen;