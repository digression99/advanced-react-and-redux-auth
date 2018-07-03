const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');
const pify = require('pify');

const userSchema = new Schema({
    email : { type : String, unique : true, lowercase : true, required : true },
    password : { type : String, required : true }
});

// on save hook, encrypt password.
userSchema.pre('save', async function (next) {
    // get access to the user model.
    const User = this;

    try {
        // generate a salt.
        const salt = await pify(bcrypt.genSalt)(10);
        // hash our password using the salt.
        const hash = await pify(bcrypt.hash)(User.password, salt, null);
        // overwrite plain text password with encrypted password.
        User.password = hash;
        // console.log('hash: ', hash);
        next();
    } catch (e) {
        next(e);
    }
});

userSchema.methods.comparePassword = async function (candidatePassword, callback) {

    if (!callback) {
        return new Promise(async (resolve, reject) => {
            const isMatch = await pify(bcrypt.compare)(candidatePassword, this.password).catch(e => {
                console.error(e);
                return reject(e);
                // return callback(e);
            });
            resolve(isMatch);
        });
    }

    const isMatch = await pify(bcrypt.compare)(candidatePassword, this.password).catch(e => {
        console.error(e);
        return callback(e);
    });
    callback(null, isMatch);
};

const ModelClass = mongoose.model('user', userSchema);

module.exports = ModelClass;