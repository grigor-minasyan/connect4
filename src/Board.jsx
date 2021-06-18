import React from 'react';
import aiConnect4 from './ai';
const _ = require('lodash');

const WIDTH = 7;
const HEIGHT = 6;
const RED = 1;
const YELLOW = 2;
const EMPTY = ' ';
const WINCONDITION = 4; // is it connect4? or connect5???
const yellowPieceImgSrc = './static/yellow_piece.png';
const redPieceImgSrc = './static/red_piece.png';
const downArrowSrc = './static/down_arrow.png';

class Board extends React.Component {
    constructor(props) {
        super(props);
        this.isWon = false;
        const boardArrInitial = [];
        for (let i = 0; i < WIDTH; i++) {
            const tempArr = [];
            for (let j = 0; j < HEIGHT; j++) {
                tempArr.push(EMPTY);
            }
            boardArrInitial.push(tempArr);
        }
        this.state = {
            width: WIDTH,
            height: HEIGHT,
            turn: RED,
            playCount: 0,
            boardAi: new aiConnect4(RED, YELLOW, EMPTY, WINCONDITION, WIDTH, HEIGHT),
            boardArr: boardArrInitial,
        };
    }

    insertIntoBoard = (e) => {
        const col = Number(e.target.getAttribute('col'));
        const copiedArr = _.cloneDeep(this.state.boardArr);

        for (let i = 0; i < this.state.height; i++) {
            if (copiedArr[col][i] === EMPTY) {
                if (this.state.turn === RED && !this.isWon) {
                    // human player
                    copiedArr[col][i] = this.state.turn;
                    this.setState({
                        playCount: this.state.playCount + 1,
                        turn: this.state.turn === RED ? YELLOW : RED,
                        boardArr: copiedArr,
                    });
                    return;
                }
            }
        }
    };

    componentDidUpdate = () => {
        const checkIfWinningReturn = this.state.boardAi.checkIfWinning(this.state.boardArr);
        if (checkIfWinningReturn.isWinning) {
            console.log(`${checkIfWinningReturn.player} won`);

            this.isWon = true;
            // add class for the winning
            for (const el of checkIfWinningReturn.retWinArr) {
                document.getElementById(`cell-${el[0]}-${el[1]}`).classList.add('winning');
            }

            window.setTimeout(() => {
                // remove class for the winning
                for (const el of checkIfWinningReturn.retWinArr) {
                    document.getElementById(`cell-${el[0]}-${el[1]}`).classList.remove('winning');
                }
                this.isWon = false;
                this.setState({
                    playCount: 0,
                    turn: RED,
                    boardArr: new Array(WIDTH).fill(new Array(HEIGHT).fill(EMPTY)),
                });
            }, 3000);
            return;
        }
        if (this.state.turn === YELLOW) {
            // window.setTimeout(() => {
            this.moveAI();
            // }, 100);
            return;
        }
    };

    checkIfWinning = () => {
        return this.state.boardAi.checkIfWinning(this.state.boardArr);
    };

    moveAI = () => {
        const aiRetObj = this.state.boardAi.minimax(this.state.boardArr, YELLOW);
        const aiMove = aiRetObj.prevMove;

        // console.log(aiRetObj);

        this.setState({
            turn: this.state.turn === RED ? YELLOW : RED,
            boardArr: this.state.boardAi.dropPieceRetCopy(
                this.state.boardArr,
                aiMove,
                this.state.turn
            ),
        });
        return;
    };

    createTable = () => {
        let table = [];

        let headerChildren = [];
        for (let j = 0; j < this.state.width; j++) {
            const keyIdName = `cellHeader-${j}`;
            headerChildren.push(
                <td className="downArrCell" key={keyIdName} id={keyIdName}>
                    <img
                        src={downArrowSrc}
                        width="95%"
                        height="95%"
                        col={j}
                        onClick={this.insertIntoBoard}
                    />
                </td>
            );
        }
        table.push(<tr key="tableHeadRow">{headerChildren}</tr>);

        for (let i = 0; i < this.state.height; i++) {
            let children = [];
            const rowNum = this.state.height - i - 1;
            for (let j = 0; j < this.state.width; j++) {
                const colNum = j;
                const keyIdName = `cell-${colNum}-${rowNum}`;
                let bgImageSrc;
                if (this.state.boardArr[colNum][rowNum] === RED) {
                    bgImageSrc = <img src={redPieceImgSrc} width="85%" height="85%" />; // TODO fix styling
                } else if (this.state.boardArr[colNum][rowNum] === YELLOW) {
                    bgImageSrc = <img src={yellowPieceImgSrc} width="85%" height="85%" />;
                } else {
                    bgImageSrc = EMPTY;
                }
                children.push(
                    <td
                        col={colNum}
                        row={rowNum}
                        key={keyIdName}
                        id={keyIdName}
                        className="boardCells"
                    >
                        {bgImageSrc}
                    </td>
                );
            }
            table.push(
                <tr row={rowNum} key={`row-${rowNum}`}>
                    {children}
                </tr>
            );
        }
        // TODO change onclick to more specific button
        return (
            <table className="boardTable">
                <tbody>{table}</tbody>
            </table>
        );
    };

    render() {
        return (
            <div>
                <div>{this.createTable()}</div>
            </div>
        );
    }
}

export default Board;
