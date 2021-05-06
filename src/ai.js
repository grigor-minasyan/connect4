class aiConnect4 {
    constructor(RED, YELLOW, EMPTY, WINCONDITION, width, height) {
        this.RED = RED;
        this.YELLOW = YELLOW;
        this.EMPTY = EMPTY;
        this.WINCONDITION = WINCONDITION;
        this.width = width;
        this.height = height;
        this.MAXDEPTH = 7;

    };

    checkIfWinning = (boardArr, winCond = this.WINCONDITION) => {
        for (let i = 0; i < boardArr.length; i++) {
            for (let j = 0; j < boardArr[i].length; j++) {
                //ignore the empty ones
                if (boardArr[i][j] === this.EMPTY) {
                    continue;
                }

                //check the whole column
                if (j <= boardArr[i].length - winCond) {
                    let isWinning = true;
                    for (let k = 0; k < winCond; k++) {
                        if (boardArr[i][j] !== boardArr[i][j+k]) isWinning = false;
                    }
                    if (isWinning) {
                        return {
                            isWinning,
                            player: boardArr[i][j]
                        }
                    }
                }

                //check rows
                if (i <= boardArr.length - winCond) {
                    let isWinning = true;
                    for (let k = 0; k < winCond; k++) {
                        if (boardArr[i][j] !== boardArr[i+k][j]) isWinning = false;
                    }
                    if (isWinning) {
                        return {
                            isWinning,
                            player: boardArr[i][j]
                        }
                    }
                }

                //check diagonal 1
                if (i <= boardArr.length - winCond && j <= boardArr[i].length - winCond) {
                    let isWinning = true;
                    for (let k = 0; k < winCond; k++) {
                        if (boardArr[i][j] !== boardArr[i+k][j+k]) isWinning = false;
                    }
                    if (isWinning) {
                        return {
                            isWinning,
                            player: boardArr[i][j]
                        }
                    }
                }

                //check diagonal 2
                if (i <= boardArr.length - winCond && j >= winCond - 1) {
                    let isWinning = true;
                    for (let k = 0; k < winCond; k++) {
                        if (boardArr[i][j] !== boardArr[i+k][j-k]) isWinning = false;
                    }
                    if (isWinning) {
                        return {
                            isWinning,
                            player: boardArr[i][j]
                        }
                    }
                }
            }
        }

        return {
            isWinning : false,
            player: this.EMPTY
        }
    }

    checkIfValidBoard = (board) => {
        if (board.length !== this.width) return false;
        return board.every(el => el.length === this.height);
    }

    minimax = (board, aiPlayer) => {
        if (!this.checkIfValidBoard(board)) {
            throw ('not a valid board');
        }
        const minimaxInner = (board, aiPlayer, depth, isMaxPlayer, prevMove, alpha, beta) => {
            // console.log('minmax called at depth ', depth);
            const humanPlayer = (aiPlayer === this.RED ? this.YELLOW : this.RED);
            const player = (isMaxPlayer ? aiPlayer : humanPlayer);
            

            if (depth === 0 || this.isTerminalNode(board)) {
                const calcScore = this.scoreCalculator(board, aiPlayer);
                return {
                    score : calcScore,
                    prevMove : prevMove
                };
            }
            const availableTurns = this.getAvailableTurns(board);

            let scoreObj = {
                score: (isMaxPlayer ? -Infinity : Infinity),
                prevMove: -1,
            }

            for (const col of availableTurns) {
                const newBoard = this.dropPieceRetCopy(board, col, player);
                const childResult = minimaxInner(newBoard, aiPlayer, depth-1, !isMaxPlayer, col, alpha, beta);
                if (isMaxPlayer) {
                    if (scoreObj.score < childResult.score) {
                        scoreObj.score = childResult.score;
                        scoreObj.prevMove = col;
                    }
                    alpha = Math.max(alpha, scoreObj.score);
                } else {
                    if (scoreObj.score > childResult.score) {
                        scoreObj.score = childResult.score;
                        scoreObj.prevMove = col;
                    }
                    beta = Math.min(beta, scoreObj.score);
                }
                if (alpha >= beta) break;
            }
            return scoreObj;
        }
        return minimaxInner(board, aiPlayer, this.MAXDEPTH, true, -1, -Infinity, Infinity);
    }

    isTerminalNode = (board) => {
        if (this.checkIfWinning(board).isWinning) return true;
        return board.every(el => el[this.height-1] !== this.EMPTY);
    }


    scoreCalculator = (board, player) => {
    
        const oppPlayer = (player === this.RED ? this.YELLOW : this.RED);
        const arrScoreCalc = (arr) => {
            const playerCount = arr.filter(e => e === player).length;
            const oppCount = arr.filter(e => e === oppPlayer).length;
            const emptyCount = arr.filter(e => e === this.EMPTY).length;
            let score = 0;
            if (playerCount === this.WINCONDITION) score += 11000;
            if (playerCount === this.WINCONDITION - 1 && emptyCount === 1) score += 110;
            if (playerCount === this.WINCONDITION - 2 && emptyCount === 2) score += 11;
            if (oppCount === this.WINCONDITION) score -= 11000;
            if (oppCount === this.WINCONDITION - 1 && emptyCount === 1) score -= 110;
            if (oppCount === this.WINCONDITION - 2 && emptyCount === 2) score -= 11;
            return score;
        }

        let score = 0;

        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                
                //score the column
                if (j <= board[i].length - this.WINCONDITION) {
                    score += arrScoreCalc(board[i].slice(j, j+this.WINCONDITION));
                }

                //score the horizontal
                if (i <= board.length - this.WINCONDITION) {
                    let arrToScore = [];
                    for (let k = 0; k < this.WINCONDITION; k++) {
                        arrToScore.push(board[i+k][j]);
                    }
                    score += arrScoreCalc(arrToScore);
                }

                //score the diag one
                if (i <= board.length - this.WINCONDITION && j <= board[i].length - this.WINCONDITION) {
                    let arrToScore = [];
                    for (let k = 0; k < this.WINCONDITION; k++) {
                        arrToScore.push(board[i+k][j+k]);
                    }
                    score += arrScoreCalc(arrToScore);
                }

                //score the diag two
                if (i <= board.length - this.WINCONDITION && j >= this.WINCONDITION - 1) {
                    let arrToScore = [];
                    for (let k = 0; k < this.WINCONDITION; k++) {
                        arrToScore.push(board[i+k][j-k]);
                    }
                    score += arrScoreCalc(arrToScore);
                }
            }
        }
        return score;
    }

    getAvailableTurns = (board) => {

        const availableTurns = [];
        for (let i = 0; i < this.width; i++) {
            if (board[i].indexOf(this.EMPTY) > -1) availableTurns.push(i);
        }
        return availableTurns;
    }

    dropPieceRetCopy = (board, col, piece) => {

        const boardCopy = JSON.parse(JSON.stringify(board));
        let index = 0;
        while(index < boardCopy[col].length) {
            if (boardCopy[col][index] === this.EMPTY) {
                break;
            }
            index++;
        }
        boardCopy[col][index] = piece;
        return boardCopy;   
    }
};

export default aiConnect4;