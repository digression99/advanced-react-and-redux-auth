const passport = require('passport');
const pify = require('pify');
const User = require('../models/user');
const config = require('../config');

const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const LocalStrategy = require('passport-local');

// setup options for jwt strategy
const jwtOptions = {
    jwtFromRequest : ExtractJwt.fromHeader('authorization'),
    secretOrKey : config.secret
};

// create jwt strategy
const jwtLogin = new JwtStrategy(jwtOptions, async (payload, done) => {
    // verifying function.
    // payload : decoded jwt token.

    // see if the user id in the payload exists in our database.
    // if it does, call done with that other.
    // otherwise, call done without a user object.

    const user = await User.findById(payload.sub).catch(e => console.error(e));
    if (!user) return done('no user found', false);
    done(null, user);
});

const localOptions = {usernameField : 'email'};

const localLogin = new LocalStrategy(localOptions, async (email, password, done) => {
    // verify this email and password, call done with the user
    // if it is the correct email and password,
    // otherwise, call done with false.

    const user = await User.findOne({email}).catch(e => console.error(e));
    if (!user) return done(null, false);

    // compare password.
    const isMatch = await user.comparePassword(password).catch(e => {
        // if some error occured.
        console.error(e);
        return done(e);
    });

    if (!isMatch) return done(null, false);
    return done(null, user);
});

// tell passport to use this strategy

passport.use(jwtLogin);
passport.use(localLogin);