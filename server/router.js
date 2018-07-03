const auth = require('./controllers/auth');
const passportService = require('./services/passport');
const passport = require('passport');

const requireAuth = passport.authenticate('jwt', {session : false});
const requireSignin = passport.authenticate('local', {session : false});

module.exports = (app) => {

    // app.get('/', (req, res, next) => {
    //     // res.send(`<h1>hi4</h1>`);
    //     res.send(['waterbottle', 'phone', 'paper']);
    // });

    app.get('/', requireAuth, (req, res) => {
        res.send({hi : 'there'});
    });

    app.post('/signin', requireSignin, auth.signin);
    app.post('/signup', auth.signup);
};