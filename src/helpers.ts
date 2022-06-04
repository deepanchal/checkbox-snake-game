export interface GameBoardInfo {
  boardRef: HTMLDivElement
  rows: number
  cols: number
}

export function setBoardStyles(options: GameBoardInfo) {
  const { boardRef: gameBoard, rows, cols } = options
  gameBoard.style.display = 'grid'
  gameBoard.style.gridTemplateColumns = `repeat(${cols}, 1fr)`
  gameBoard.style.gridTemplateRows = `repeat(${rows}, 1fr)`
  gameBoard.style.gap = '1rem'
  gameBoard.style.justifyContent = 'center'
  gameBoard.style.alignItems = 'center'
}

export function setupBoard(options: GameBoardInfo) {
  const { boardRef: gameBoard, rows, cols } = options
  Array.from({ length: rows }).forEach((_, row) => {
    Array.from({ length: cols }).forEach((_, col) => {
      const cell = document.createElement('input')
      cell.setAttribute('type', 'checkbox')
      // cell.disabled = true;
      cell.classList.add('cell')
      cell.id = `${row}${col}`
      cell.dataset.row = row.toString()
      cell.dataset.col = col.toString()
      gameBoard.appendChild(cell)
    })
  })
}
