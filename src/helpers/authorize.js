const JWT = require("jsonwebtoken");
const User = require("../models/user_schema");
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const LocalStrategy = require('passport-local').Strategy;
const passport = require('passport');
const jwtStrategy = require("passport-jwt").Strategy;
const {ExtractJwt} = require('passport-jwt');

dotenv.config();

//JWT strategy for signup
passport.use(new jwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
}, async (payload, done) => {
    try {
        // find user in db
        var user = await User.findById(payload.sub);

        //if user doesn't exist
        if (!user) {
            return done(null, false);
        }

        if (user) {
            return done(null, user);
        }

    } catch (error) {
        return done(error, false);
    }
}));

//Local strategy for login
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    session: false
}, async (email, password, done) => {
    try {
        //find user
        const findUser = await User.findOne({
            email: email
        });

        //if no user 
        if (!findUser) {
            return done(null, false, {
                message: 'Incorrect Email or password.'
            });
        }

        //check if the passwords match
        const isMatch = await findUser.comparePassword(password);

        //if no match
        if (!isMatch) {
            return done(null, false, {
                message: "Incorrect password."
            });
        }

        return done(null, findUser, {
            message: 'Login successful'
        });
    } catch (error) {
        return done(error, false);
    }

}));

module.exports = passport;