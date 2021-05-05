import React from 'react';
import aiConnect4 from './ai';

const WIDTH = 7;
const HEIGHT = 6;
const RED = 1;
const YELLOW = 2;
const EMPTY = ' ';
const WINCONDITION = 4; // is it connect4? or connect5???
const yellowPieceImgSrc = './static/yellow_piece.png';
const redPieceImgSrc = './static/red_piece.png';

class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            width: WIDTH,
            height: HEIGHT,
            turn : RED,
            boardAi : new aiConnect4(RED, YELLOW, EMPTY, WINCONDITION, WIDTH, HEIGHT),
            boardArr : new Array(WIDTH).fill(new Array(HEIGHT).fill(EMPTY))
        }
    }


    insertIntoBoard = (e) => {
        const col = Number(e.target.getAttribute('col'));
        const copiedArr = JSON.parse(JSON.stringify(this.state.boardArr));

        for (let i = 0; i < this.state.height; i++) {
            if (copiedArr[col][i] === EMPTY) {
                if (this.state.turn === RED) { // human player
                    copiedArr[col][i] = this.state.turn;
                    this.setState({
                        turn: (this.state.turn === RED ? YELLOW : RED),
                        boardArr : copiedArr
                    })
                    return;
                }
            }
        }
    }
    componentDidUpdate = () => {
        const checkIfWinningReturn = this.state.boardAi.checkIfWinning(this.state.boardArr);
        if (checkIfWinningReturn.isWinning) {
            console.log(`${checkIfWinningReturn.player} won`);

            window.setTimeout(() => {
                this.setState({
                    turn: RED,
                    boardArr : new Array(WIDTH).fill(new Array(HEIGHT).fill(EMPTY))
                })
            }, 2000);
            return;
        }
        if (this.state.turn === YELLOW) {
            window.setTimeout(() => {
                this.moveAI();
            }, 100);
            return;
        }
    }
    componentDidMount = () => {


    }

    checkIfWinning = () => {
        return this.state.boardAi.checkIfWinning(this.state.boardArr);

    }

    moveAI = () => {

        const aiRetObj = this.state.boardAi.minimax(this.state.boardArr, YELLOW);
        const aiMove = aiRetObj.prevMove;

        console.log(aiRetObj);

        this.setState({
            turn: (this.state.turn === RED ? YELLOW : RED),
            boardArr : this.state.boardAi.dropPieceRetCopy(this.state.boardArr, aiMove, this.state.turn)
        });
        return;
    }

    createTable = () => {
        let table = [];
        for (let i = 0; i < this.state.height; i++) {
            let children = [];
            const rowNum = this.state.height-i-1;
            for (let j = 0; j < this.state.width; j++) {
                const colNum = j;
                const keyIdName = `cell-${colNum}-${rowNum}`;
                let bgImageSrc;
                if (this.state.boardArr[colNum][rowNum] === RED) {
                    bgImageSrc = <img src={redPieceImgSrc} width='95%' height='95%'/>; // TODO fix styling
                } else if (this.state.boardArr[colNum][rowNum] === YELLOW) {
                    bgImageSrc = <img src={yellowPieceImgSrc}  width='95%' height='95%'/>;
                } else {
                    bgImageSrc = EMPTY;
                }
                children.push(<td col={colNum} row={rowNum} key={keyIdName} id={keyIdName} >
                        
                        {bgImageSrc}
                    </td>)
            }
            table.push(<tr row={rowNum} key={`row-${rowNum}`}>{children}</tr>);
        }
        // TODO change onclick to more specific button
        return <table className='boardTable' onClick={this.insertIntoBoard}><tbody>{table}</tbody></table>;
    }

    render() {
        return (
            <div>
                {this.createTable()}
            </div>
        );
    }
}

export default Board;