const JWT = require("jsonwebtoken");
const User = require("../models/user_schema");
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

module.exports = {
    register,
    login,
    admin,
};

function signToken(id, role) {
    return JWT.sign({
        iss: "doc",
        sub: id,
        role,
    }, process.env.JWT_SECRET);
}

function admin(req, res) {
    console.log('admin login');

    return res.status(200).json('admin');
}

async function register(req, res) {
    try {
        const findUser = await User.findOne({
            email: req.body.email
        });

        if (findUser) {
            return res.status(403).json({
                "Error": "Email is already in use"
            });
        }

        const newUser = new User({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            password: req.body.password,
            role: req.body.role,
            resetToken: 'none',
        });

        newUser.save((err, user) => {
            if (err) {
                return res.status(500).json({
                    "error": err
                });
            }

            if (!user) {
                return res.status(500).json({
                    "error": "Please Input user details"
                });
            }

            const accessToken = signToken(user._id, req.body.role);

            console.log(accessToken);

            res.json({
                message: "registered user successfully",
                user,
                accessToken,
            });
        });
    } catch (error) {
        return res.status(500).json({
            "message": "server error",
            "error": error
        });
    }
}

async function login(req, res) {
    try {
        if (!req.body.email || !req.body.password) {
            return res.status(500).json({
                "Error": "Please enter email and password"
            });
        }

        const user = await User.findOne({
            email: req.body.email
        });

        const accessToken = signToken(req.user, user.role);

        console.log(accessToken);

        res.status(200).json({
            message: "login successful",
            user: req.user,
            accessToken,
        });
    } catch (error) {
        return res.status(500).json({
            "message": "server error",
            "error": error
        });
    }
}