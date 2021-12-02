const LocalStrategy = require('passport-local');
const bcrypt = require('bcryptjs');

const User = require('../models/userModel');

module.exports = function(passport) {
    passport.use(
        new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
            User.findOne({
                email: email
            }).then(user => {
                if(!user)
                {
                    return done(null, false, { message: 'Email is not registered.' });
                }
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if(err) throw err;
                    if(isMatch) 
                    {
                        return done(null, user);
                    }
                    else
                    {
                        return done(null, false, { message: 'Password is incorrect.' });
                    }
                });
            });
        })
    );
    passport.serializeUser(function(user, done)
    {
        done(null, user.id);
    });
    passport.deserializeUser(function(id, done){
        User.findById(id, function(err, user2){
            done(err, user2);
        });
    });
};