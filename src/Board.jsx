import React from 'react';
const RED = 1;
const YELLOW = 2;
const EMPTY = ' ';
const WINCONDITION = 4; // is it connect4? or connect5???

class Board extends React.Component {
    constructor(props) {
        super(props);
        const width = 7;
        const height = 6;
        this.state = {
            width,
            height,
            turn : RED,
            boardArr : new Array(width).fill(new Array(height).fill(EMPTY))
        }
    }


    insertIntoBoard = (e) => {
        const col = Number(e.target.getAttribute('col'));
        const copiedArr = JSON.parse(JSON.stringify(this.state.boardArr));
        for (let i = 0; i < this.state.height; i++) {
            if (copiedArr[col][i] === EMPTY) {
                copiedArr[col][i] = this.state.turn;
                this.setState({
                    turn: (this.state.turn === RED ? YELLOW : RED),
                    boardArr : copiedArr
                })
                return;
            }
        }
    }
    componentDidUpdate = () => {
        console.log(this.checkIfWinning());
    }
    componentDidMount = () => {
        // console.log(this.checkIfWinning());
        

    }

    checkIfWinning = () => {
        const boardArr = this.state.boardArr;
        for (let i = 0; i < boardArr.length; i++) {
            for (let j = 0; j < boardArr[i].length; j++) {
                //ignore the empty ones
                if (boardArr[i][j] === EMPTY) {
                    continue;
                }

                //check the whole column
                if (j <= boardArr[i].length - WINCONDITION) {
                    let isWinning = true;
                    for (let k = 0; k < WINCONDITION; k++) {
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
                if (i <= boardArr.length - WINCONDITION) {
                    let isWinning = true;
                    for (let k = 0; k < WINCONDITION; k++) {
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
                if (i <= boardArr.length - WINCONDITION && j <= boardArr[i].length - WINCONDITION) {
                    let isWinning = true;
                    for (let k = 0; k < WINCONDITION; k++) {
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
                if (i <= boardArr.length - WINCONDITION && j >= WINCONDITION - 1) {
                    let isWinning = true;
                    for (let k = 0; k < WINCONDITION; k++) {
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
            player: EMPTY
        }

    }

    createTable = () => {
        let table = [];
        for (let i = 0; i < this.state.height; i++) {
            let children = [];
            const rowNum = this.state.height-i-1;
            for (let j = 0; j < this.state.width; j++) {
                const colNum = j;
                const keyIdName = `cell-${colNum}-${rowNum}`;
                children.push(<td col={colNum} row={rowNum} key={keyIdName} id={keyIdName} >{this.state.boardArr[colNum][rowNum]}</td>)
            }
            table.push(<tr row={rowNum} key={`row-${rowNum}`}>{children}</tr>);
        }
        return <table className='boardTable' onClick={this.insertIntoBoard}><tbody>{table}</tbody></table>;
    }

    render() {
        // console.log(this.state);
        return (
            <div>
                {this.createTable()}
            </div>
        );
    }
}

export default Board;