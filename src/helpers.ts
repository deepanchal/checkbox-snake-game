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
