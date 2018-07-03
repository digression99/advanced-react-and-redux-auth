const jwt = require('jwt-simple');

const User = require('../models/user');
const config = require('../config');

const tokenForUser = (user) => {
    const timestamp = new Date().getTime();

    console.log('config : ');
    console.log(JSON.stringify(config, null, 2));

    console.log('user : ');
    console.log(JSON.stringify(user, null, 2));

    const data = {
        sub : user.id, // _id.
        iat : timestamp
    };

    console.log('data : ');
    console.log(JSON.stringify(data, null, 2));

    return jwt.encode(
        data,
        config.secret
    );
};

exports.signup = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) return res.status(422).json({
        message : 'must provide email, password.',
        success : false
    });

    try {
        // check if a use with the given email exists.
        const user = await User.findOne({email});
        // if a user with email does exist, return an error.

        if (user) return res.status(422).json({
            error : 'user already exists',
            success : false
        });
        // if (user) throw new Error('user already exists');

        // if a user with email does not exist, create and save use record.
        const newUser = new User({email, password});
        await newUser.save();

        // respond to request, indicating the use was created.
        res.status(200).json({
            message : 'user created.',
            token : tokenForUser(newUser)
            // success : true
            // user : newUser
        });
    } catch (e) {
        next(e);
    }
};

exports.signin = async (req, res, next) => {
    // user has already had their email and password auth'd
    // just need to give them a token.

    res.status(200).json({
        token : tokenForUser(req.user)
    });
};