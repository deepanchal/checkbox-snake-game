export type SnakeBodyPart = [x: number, y: number]
export type SnakeDirection = 'up' | 'down' | 'left' | 'right'

export const CELL_TYPES = {
  HEAD: 1,
  BODY: 1,
  TAIL: 1,
  EMPTY: 0,
  FOOD: 2
} as const

export class Snake {
  #body: SnakeBodyPart[]
  #direction: SnakeDirection = 'right'
  #moveStep = 1

  constructor() {
    this.#body = [
      [0, 0],
      [1, 0],
      [2, 0],
      [3, 0]
    ]
  }

  get head() {
    return this.#body[0]
  }

  get tail() {
    return this.#body[this.#body.length - 1]
  }

  get body() {
    return this.#body
  }

  get bodyWithoutHead() {
    return this.#body.slice(1)
  }

  get length() {
    return this.#body.length
  }

  set direction(direction: SnakeDirection) {
    this.#direction = direction
  }

  grow() {
    const tail = this.tail
    this.#body.push([tail[0], tail[1]])
  }

  move() {
    const head = this.head
    const newHead: SnakeBodyPart = [head[0], head[1]]
    const actionsMap: Record<SnakeDirection, () => void> = {
      up: () => (newHead[0] -= this.#moveStep),
      down: () => (newHead[0] += this.#moveStep),
      left: () => (newHead[1] -= this.#moveStep),
      right: () => (newHead[1] += this.#moveStep)
    }
    actionsMap[this.#direction]()
    this.#body.unshift(newHead)
    this.#body.pop()
  }
}

export class SnakeGame {
  #board: number[][]
  #boardRef: HTMLDivElement
  #rows: number
  #cols: number
  #snake: Snake
  #isGameOver = false
  #delay = 200

  constructor(options: {
    boardRef: HTMLDivElement
    rows?: number
    cols?: number
  }) {
    const { boardRef, rows, cols } = options
    this.#boardRef = boardRef
    this.#rows = rows || 10
    this.#cols = cols || 10
    this.#board = this.getInitialBoard()
    this.#snake = new Snake()
  }

  get board() {
    return this.#board
  }

  get boardRef() {
    return this.#boardRef
  }

  getInitialBoard() {
    return Array.from({ length: this.#rows }).map(() =>
      Array.from({ length: this.#cols }).map(() => CELL_TYPES.EMPTY)
    )
  }

  sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  renderBoard() {
    const { boardRef: gameBoard, board } = this
    board.forEach((row, x) => {
      row.forEach((col, y) => {
        const prevCell = gameBoard.querySelector(`#cell-${x}${y}`)
        const cell = document.createElement('input') as HTMLInputElement
        cell.setAttribute('type', 'checkbox')
        cell.setAttribute('id', `cell-${x}${y}`)
        if (col === CELL_TYPES.FOOD) {
          cell.classList.add('cell__food')
        } else {
          cell.classList.add('cell__body')
        }
        cell.checked = col === CELL_TYPES.BODY || col === CELL_TYPES.FOOD
        cell.classList.add('cell')
        cell.dataset.row = x.toString()
        cell.dataset.col = y.toString()
        if (prevCell) {
          prevCell.replaceWith(cell)
        } else {
          gameBoard.appendChild(cell)
        }
      })
    })
  }

  generateFood() {
    const { board } = this
    // spawn food on random empty cell
    const emptyCells = board.reduce((acc, row, x) => {
      row.forEach((col, y) => {
        if (col === CELL_TYPES.EMPTY) {
          acc.push([x, y])
        }
      })
      return acc
    }, [] as [number, number][])

    const randomIndex = Math.floor(Math.random() * emptyCells.length)
    const [x, y] = emptyCells[randomIndex]
    board[x][y] = CELL_TYPES.FOOD
  }

  checkGameOver() {
    const { head } = this.#snake
    const [x, y] = head
    const isOutOfBounds = x < 0 || x >= this.#rows || y < 0 || y >= this.#cols
    const isCollidingWithBody = this.#snake.bodyWithoutHead.some(
      ([x, y]) => x === head[0] && y === head[1]
    )
    if (isOutOfBounds || isCollidingWithBody) {
      this.#isGameOver = true
    } else {
      this.#isGameOver = false
    }
  }

  handleGesture(touchX: [number, number], touchY: [number, number]) {
    const [x1, x2] = touchX
    const [y1, y2] = touchY
    const deltaX = x2 - x1
    const deltaY = y2 - y1
    const absDeltaX = Math.abs(deltaX)
    const absDeltaY = Math.abs(deltaY)
    const isHorizontal = absDeltaX > absDeltaY
    const isVertical = absDeltaX < absDeltaY
    const isLeft = deltaX < 0
    const isUp = deltaY < 0
    if (isHorizontal) {
      if (isLeft) {
        this.#snake.direction = 'left'
      } else {
        this.#snake.direction = 'right'
      }
    } else if (isVertical) {
      if (isUp) {
        this.#snake.direction = 'up'
      } else {
        this.#snake.direction = 'down'
      }
    }
  }

  registerEvents() {
    document.addEventListener('keydown', (e) => {
      const key = e.key
      const keyActions: [keys: string[], handler: () => void][] = [
        [['w', 'ArrowUp'], () => (this.#snake.direction = 'up')],
        [['s', 'ArrowDown'], () => (this.#snake.direction = 'down')],
        [['a', 'ArrowLeft'], () => (this.#snake.direction = 'left')],
        [['d', 'ArrowRight'], () => (this.#snake.direction = 'right')]
      ]
      keyActions.forEach(([keys, action]) => {
        if (keys.includes(key)) {
          action()
        }
      })
    })
  }

  registerTouchEvents() {
    let touchX: [number, number] = [0, 0]
    let touchY: [number, number] = [0, 0]
    document.addEventListener('touchstart', (e) => {
      touchX[0] = e.changedTouches[0].screenX
      touchY[0] = e.changedTouches[0].screenY
    })
    document.addEventListener('touchend', (e) => {
      touchX[1] = e.changedTouches[0].screenX
      touchY[1] = e.changedTouches[0].screenY
      this.handleGesture(touchX, touchY)
    })
  }

  async start() {
    console.log('start')
    this.renderBoard()
    this.generateFood()
    this.registerEvents()
    this.registerTouchEvents()
    while (!this.#isGameOver) {
      await this.sleep(this.#delay)
      this.#snake.move()
      this.#board.forEach((row, x) => {
        row.forEach((col, y) => {
          const isSnakeBody = this.#snake.body.some(
            ([x1, y1]) => x1 === x && y1 === y
          )
          const isFood = col === CELL_TYPES.FOOD
          this.#board[x][y] = isSnakeBody
            ? CELL_TYPES.BODY
            : isFood
            ? CELL_TYPES.FOOD
            : CELL_TYPES.EMPTY
          if (isSnakeBody && isFood) {
            this.#snake.grow()
            this.generateFood()
          }
        })
      })
      this.renderBoard()
      console.log('move', this.#snake.head)
      this.checkGameOver()
    }
    console.log('this.gameOver', this.#isGameOver)
  }
}
