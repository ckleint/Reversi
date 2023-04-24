import cloneDeep from 'lodash/cloneDeep'

type TPosition = { row: number; col: number }

const pieceAboveIsSameColor = (
  board: Array<Array<string>>,
  position: { row: number; col: number },
  color: string
): boolean => {
  if (position.row === 0) {
    return false;
  }
  return board[position.row - 1][position.col] === color;
};

const pieceBelowIsSameColor = (
  board: Array<Array<string>>,
  position: { row: number; col: number },
  color: string
): boolean => {
  if (position.row === board.length - 1) {
    return false;
  }
  return board[position.row + 1][position.col] === color;
};

const pieceLeftIsSameColor = (
  board: Array<Array<string>>,
  position: { row: number; col: number },
  color: string
): boolean => {
  if (position.col === 0) {
    return false;
  }
  return board[position.row][position.col - 1] === color;
};

const pieceRightIsSameColor = (
  board: Array<Array<string>>,
  position: { row: number; col: number },
  color: string
): boolean => {
  if (position.col === board.length - 1) {
    return false;
  }
  return board[position.row][position.col + 1] === color;
};

const isPositionEmpty = (
  board: any,
  position: { row: number; col: number }
) => {
  return board[position.row][position.col] === "empty";
};

export const getCoordinatesOfEmptySpots = (board: TBoard): Array<TPosition> => {
    const positions=[]
    for(let i=0; i<board.length; i++){
        for(let j=0; j<board.length; j++){
            if(board[i][j] === 'empty'){
                positions.push({ row: i, col: j})
            }
        }  
    }
    return positions;
}

export const hasAnyMovesLeft = (board: TBoard, color: string) => {
    const availableSpots = getCoordinatesOfEmptySpots(board);
    for(let space of availableSpots){
        if(isMoveValid(board, space, color)){
            return true;
        }
    }
    return false;
}

export const isMoveValid = (
  board: Array<Array<string>>,
  position: { row: number; col: number },
  color: string
): boolean => {
  const hasAdjacentSameColor =
    pieceAboveIsSameColor(board, position, color) ||
    pieceLeftIsSameColor(board, position, color) ||
    pieceRightIsSameColor(board, position, color) ||
    pieceBelowIsSameColor(board, position, color);

  const isEmpty = isPositionEmpty(board, position)

  if(!isEmpty){
    return false;
  }

  const fakeUpdatedBoard = cloneDeep(board)
  fakeUpdatedBoard[position.row][position.col] = color;

  return (
     isEmpty &&
    JSON.stringify(updateBoardWithNewMove(board as any, position, color)) !==
      JSON.stringify(fakeUpdatedBoard)
  );
};

type TBoard = Array<Array<"empty" | "black" | "white">>;

const isOutOfBounds = (position:  { row: number; col: number }, boardSize: number) => {
    const {row, col} = position;
    return row < 0 || col < 0 || row >= boardSize || col >= boardSize
}

export const updateBoardWithNewMove = (
  currentBoard: TBoard,
  position: { row: number; col: number },
  color: string
): TBoard => {
    const board = cloneDeep(currentBoard)
    const enemyColor = color === 'white' ? 'black' : 'white'
    const boardSize = board.length;
    const directions = [
        {x: -1, y: -1},
        {x: -1, y: 0},
        {x: -1, y: 1},
        {x: 0, y: -1},
        {x: 0, y: 1},
        {x: 1, y: -1},
        {x: 1, y: 0},
        {x: 1, y: 1},
    ]

    directions.forEach(direction => {
        let positionsToFlip = []
        let currRow = position.row + direction.x;
        let currCol = position.col + direction.y

        let done=false
        // When we place a tile, we flip all tiles between that spot and the next tile of our color in a linear direction
        while(!done){
            if(isOutOfBounds({row: currRow, col: currCol}, boardSize)){
                positionsToFlip = []
                done=true;
                continue;
            }
            const cell = board[currRow][currCol]

            if(cell === 'empty'){
                positionsToFlip = []
                done=true;
                continue;
            }


            if(cell === enemyColor) {
                positionsToFlip.push({row: currRow, col: currCol})
            }

            if(cell === color){
                // flip cells in positions to flipc
                positionsToFlip.forEach(updatedPosition => {
                    board[updatedPosition.row][updatedPosition.col] = color;
                })
                done=true;
            }
            currRow += direction.x
            currCol += direction.y
        }


    })
    board[position.row][position.col] = color as any
    return board;
};


export const getScoreCounts = (board: TBoard) => {
    let counts = {
        white: 0,
        black: 0,
        empty: 0
    }
    board.forEach((row) => {
        row.forEach((cell) => {
            counts[cell] += 1;
        })
    })

    return counts
}