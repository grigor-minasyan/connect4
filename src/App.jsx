import React, {Component} from 'react';
import Board from './Board.jsx';
class App extends React.Component {
    render() {

        fetch('/api/getSignedin')
            .then(res => res.json())
            .then(data => {
                if (data.googleid) {
                    document.getElementById('loginBox').innerHTML = `Welcome back, <b>${data.displayname}</b> (<a href="/auth/logout">Not you?</a>). Your high score is <b id='userHighScore'>${data.highscore}</b>`;
                } else {
                    document.getElementById('loginBox').innerHTML = `<a href="/auth/google">Sign In with Google to save your high score</a>. Your current high score is <b id='userHighScore'>${data.highscore}</b>`;
                }
                console.log(data)
            });


        return(
            <div className='main'>
                <h1>Welcome to the Connect4 Powered by bleeding edge AI technology</h1>
                <p>You can try to beat the computer, but you will fail most probably. Your can get a high score by surviving as long as you can. <b>Note:</b> the AI sometimes is nice and it lets you play slightly longer even if it has the chance to win. But it will beat you, undoubtedly.</p>
                <div id='loginBox'></div>
                
                <br></br>
                <Board />
            </div>
        );
    }
}
export default App
