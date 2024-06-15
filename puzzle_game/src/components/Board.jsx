import React, { useState, useEffect } from "react";

const generateInitialBoard = (size) => {
  const totalTiles = size * size;
  const initialBoard = Array.from({ length: totalTiles }, (_, index) =>
    index === totalTiles - 1 ? null : index + 1
  );
  return initialBoard;
};

const shuffleArray = (array) => {
  let shuffledArray = array.slice();
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
};

const isSolvable = (board) => {
  let inversions = 0;
  const array = board.filter((item) => item !== null);
  for (let i = 0; i < array.length - 1; i++) {
    for (let j = i + 1; j < array.length; j++) {
      if (array[i] > array[j]) inversions++;
    }
  }
  return inversions % 2 === 0;
};

const Board = () => {
  const [level, setLevel] = useState(3);
  const [initialBoard, setInitialBoard] = useState(generateInitialBoard(level));
  const [board, setBoard] = useState(generateInitialBoard(level));
  const [initialShuffledBoard, setInitialShuffledBoard] = useState(null);
  const [gameActive, setGameActive] = useState(false);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    shuffleBoard();
  }, [level]);

  useEffect(() => {
    let timerInterval;
    if (gameActive) {
      timerInterval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
    } else if (!gameActive && timer !== 0) {
      clearInterval(timerInterval);
    }
    return () => clearInterval(timerInterval);
  }, [gameActive, timer]);

  const shuffleBoard = () => {
    let shuffledBoard;
    do {
      shuffledBoard = shuffleArray(generateInitialBoard(level));
    } while (!isSolvable(shuffledBoard));
    setInitialShuffledBoard(shuffledBoard);
    setBoard(shuffledBoard);
  };

  const resetBoard = () => {
    setBoard(initialShuffledBoard);
    setGameActive(false);
    setTimer(0);
  };

  const handleTileClick = (index) => {
    if (gameActive && !isSolved(board)) {
      const emptyIndex = board.indexOf(null);
      const validMoves = [
        emptyIndex - 1,
        emptyIndex + 1,
        emptyIndex - level,
        emptyIndex + level,
      ];
      if (validMoves.includes(index)) {
        const newBoard = board.slice();
        [newBoard[emptyIndex], newBoard[index]] = [
          newBoard[index],
          newBoard[emptyIndex],
        ];
        setBoard(newBoard);
      }
    }
  };

  const handleChangeLevel = (newLevel) => {
    setLevel(newLevel);
  };

  const startGame = () => {
    setGameActive(true);
    setTimer(0);
  };

  const isSolved = (board) => {
    for (let i = 0; i < board.length - 1; i++) {
      if (board[i] !== i + 1) return false;
    }
    return board[board.length - 1] === null;
  };

  // Render the board
  return (
    <div className="flex flex-col items-center mt-10">
        <div className="mt-5 text-2xl text-white">
        Time: {Math.floor(timer / 60)}:{("0" + (timer % 60)).slice(-2)}
      </div>
      <div
        className={`grid gap-2`}
        style={{
          gridTemplateColumns: `repeat(${level}, minmax(0, 1fr))`,
        }}
      >
        {board.map((tile, index) => (
          <div
            key={index}
            id={`tile-${index}`} // Unique id for each tile
            className={`w-20 h-20 flex items-center justify-center text-2xl font-bold border ${
              tile === null ? "bg-green" : "bg-blue-300 cursor-pointer"
            }`}
            style={{ transition: "transform 0.2s ease-in-out" }} // Inline style for transition
            onClick={() => handleTileClick(index)}
          >
            {tile}
          </div>
        ))}
      </div>
      <div className="mt-5 flex flex-wrap justify-center gap-2">
      {!gameActive && (
          <button
            className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4"
            onClick={startGame}
          >
            Start Game
          </button>
        )}

        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4"
          onClick={shuffleBoard}
        >
          New Board
        </button>
       
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4"
          onClick={() => handleChangeLevel(3)}
        >
          Easy
        </button>
        <button
          className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4"
          onClick={() => handleChangeLevel(4)}
        >
          Medium
        </button>
        <button
          className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4"
          onClick={() => handleChangeLevel(5)}
        >
          Hard
        </button>
        <button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4"
          onClick={resetBoard}
        >
          Reset
        </button>
      </div>
    
      {isSolved(board) && (
        <div className="mt-5 text-2xl text-green-500">Puzzle Solved!</div>
      )}
    </div>
  );
};

export default Board;
