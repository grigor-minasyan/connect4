
const db = require('./db_model');

const db_controller = {};


db_controller.getUser = (req, res, next) => {
    const queryStr = 'SELECT * FROM connect4users WHERE googleId=$1';
    const values = [req.user];
    db.query(queryStr, values)
        .then(queryRes => {
            res.locals.userObj = queryRes.rows[0];
            return next();
        })
        .catch(err => next(err));

}

db_controller.setHighScore = (req, res, next) => {
    const queryStr = 'UPDATE connect4users SET highscore = $1 WHERE googleid=$2';
    const values = [req.query.highScore, req.user];
    db.query(queryStr, values)
        .then(queryRes => {
            next();
        }).catch(err => next(err));
}

db_controller.findOrCreate = (userObj, doneCB) => {
    const queryStr = 'SELECT * FROM connect4users WHERE googleid=$1';
    const values = [userObj.id];
    db.query(queryStr, values)
        .then(queryRes => {
            if (queryRes.rows.length === 0) { // not found, create entry

                const insertQueryStr = 'INSERT INTO connect4users (googleid, displayname, highscore) VALUES ($1, $2, $3)';
                const insertValues = [userObj.id, userObj.displayName, 0];
                db.query(insertQueryStr,insertValues)
                    .then(insertQueryRes => {
                        console.log(insertQueryRes);
                        return doneCB(null);
                    })
                    .catch(err => doneCB(err));


            } else { // user found, continue
                console.log('user already exists');
                console.log(queryRes.rows[0]);
                return doneCB(null);
            }
            
        })
        .catch(err => doneCB(err));

}


module.exports = db_controller;