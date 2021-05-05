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

            let scoreObj = {
                score: (isMaxPlayer ? -Infinity : Infinity),
                prevMove: -1,
            }
            const availableTurns = this.getAvailableTurns(board);
            for (const col of availableTurns) {
                const childResult = minimaxInner(this.dropPieceRetCopy(board, col, player), aiPlayer, depth-1, !isMaxPlayer, col, alpha, beta);
                if (depth === this.MAXDEPTH) {
                    console.log(childResult);
                }
                if (isMaxPlayer) {
                    if (scoreObj.score < childResult.score) {
                        scoreObj.score = childResult.score;
                        scoreObj.prevMove = childResult.prevMove;
                    }
                    alpha = Math.max(alpha, scoreObj.score);
                } else {
                    if (scoreObj.score > childResult.score) {
                        scoreObj.score = childResult.score;
                        scoreObj.prevMove = childResult.prevMove;
                    }
                    beta = Math.min(beta, scoreObj.score);
                }
                if (alpha >= beta) {
                    break;
                }
            }
            return scoreObj;
    
        }
        // return [board, aiPlayer, 10, true];
        return minimaxInner(board, aiPlayer, this.MAXDEPTH, true, -1, -Infinity, Infinity);
        // return this.scoreCalculator(board, aiPlayer);
    }

    isTerminalNode = (board) => {
        if (this.checkIfWinning(board).isWinning) return true;
        return board.every(el => el[this.height-1] !== this.EMPTY);
    }


    scoreCalculator = (board, player) => {
    

        let score = 0;

        for (let winCond = this.WINCONDITION; winCond > 1; winCond--) {
            for (let i = 0; i < board.length; i++) {
                for (let j = 0; j < board[i].length; j++) {
                    //ignore the empty ones
                    if (board[i][j] === this.EMPTY) {
                        continue;
                    }

                    //check the whole column
                    if (j <= board[i].length - this.WINCONDITION) {
                        let isWinning = true;
                        for (let k = 0; k < winCond; k++) { // check player count 
                            if (board[i][j] !== board[i][j+k]) isWinning = false;
                        }
                        for (let k = winCond; k < this.WINCONDITION; k++) {  // check empty count 
                            if (board[i][j+k] !== this.EMPTY) isWinning = false;
                        }
                        if (isWinning) {
                            score += ((board[i][j] === player ? 1 : -2) * winCond**(2*winCond));
                        }
                    }

                    //check rows
                    if (i <= board.length - this.WINCONDITION) {
                        let isWinning = true;
                        for (let k = 0; k < winCond; k++) {
                            if (board[i][j] !== board[i+k][j]) isWinning = false;
                        }
                        for (let k = winCond; k < this.WINCONDITION; k++) {  // check empty count 
                            if (board[i+k][j] !== this.EMPTY) isWinning = false;
                        }
                        if (isWinning) {
                            score += ((board[i][j] === player ? 1 : -2) * winCond**(2*winCond));
                        }
                    }

                    //check diagonal 1
                    if (i <= board.length - this.WINCONDITION && j <= board[i].length - this.WINCONDITION) {
                        let isWinning = true;
                        for (let k = 0; k < winCond; k++) {
                            if (board[i][j] !== board[i+k][j+k]) isWinning = false;
                        }
                        for (let k = winCond; k < this.WINCONDITION; k++) {  // check empty count 
                            if (board[i+k][j+k] !== this.EMPTY) isWinning = false;
                        }
                        if (isWinning) {
                            score += ((board[i][j] === player ? 1 : -2) * winCond**(2*winCond));
                        }
                    }

                    //check diagonal 2
                    if (i <= board.length - this.WINCONDITION && j >= this.WINCONDITION - 1) {
                        let isWinning = true;
                        for (let k = 0; k < winCond; k++) {
                            if (board[i][j] !== board[i+k][j-k]) isWinning = false;
                        }
                        for (let k = winCond; k < this.WINCONDITION; k++) {  // check empty count 
                            if (board[i+k][j-k] !== this.EMPTY) isWinning = false;
                        }
                        if (isWinning) {
                            score += ((board[i][j] === player ? 1 : -2) * winCond**(2*winCond));
                        }
                    }
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