export function setBoard(gameBoard: HTMLDivElement, rows: number, cols: number) {
    gameBoard.style.display = 'grid';
    gameBoard.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    gameBoard.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
    gameBoard.style.gap = '5px';
    gameBoard.style.justifyContent = 'center';
    gameBoard.style.alignItems = 'center';
}
