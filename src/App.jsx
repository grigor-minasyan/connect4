import React from 'react';
import Board from './Board.jsx';
class App extends React.Component {
    render() {
        return (
            <div className="main">
                <h1>Welcome to the Connect4 Powered by bleeding edge AI technology</h1>
                <p>
                    You can try to beat the computer, but you will fail most probably. Your can get
                    a high score by surviving as long as you can. <b>Note:</b> the AI sometimes is
                    nice and it lets you play slightly longer even if it has the chance to win. But
                    it will beat you, undoubtedly.
                </p>

                <br></br>
                <Board />
            </div>
        );
    }
}
export default App;
