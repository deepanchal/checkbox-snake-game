import { setBoard } from './helpers';
import './style.css'

const app = document.querySelector<HTMLDivElement>('#app')!;
const ROWS = 10;
const COLS = 10;
const gameBoard = document.createElement('div');
gameBoard.classList.add('game-board');

setBoard(gameBoard, ROWS, COLS);

// create the board
for (let row = 0; row < ROWS; row++) {
  for (let col = 0; col < COLS; col++) {
    const cell = document.createElement('input')
    cell.setAttribute('type', 'checkbox');
    // cell.disabled = true;
    cell.classList.add('cell');
    cell.id = `${row}${col}`;
    cell.dataset.row = row.toString();
    cell.dataset.col = col.toString();
    gameBoard.appendChild(cell);
  }
}

// append game board to app
app.appendChild(gameBoard);
