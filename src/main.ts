import { setBoardStyles, setupBoard } from './helpers'
import type { GameBoardInfo } from './helpers'
import './style.css'

const app = document.querySelector<HTMLDivElement>('#app')!
const ROWS = 10
const COLS = 10
const gameBoard = document.createElement('div')
gameBoard.classList.add('game-board')

const boardInfo: GameBoardInfo = {
  boardRef: gameBoard,
  rows: ROWS,
  cols: COLS
}

setBoardStyles(boardInfo)
setupBoard(boardInfo)

// append game board to app
app.appendChild(gameBoard)
