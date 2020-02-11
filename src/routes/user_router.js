const express = require('express');
const userRouter = express.Router();
const passport = require('passport');
const userCtrl = require("../controllers/user_controller");
const checkAuth = require("../middleware/check_auth");
const roles = require('../helpers/roles');
require('../helpers/authorize');

userRouter.post("/register", userCtrl.register);

userRouter.post("/login", passport.authenticate('local', {
    session: false
}), userCtrl.login);

userRouter.get("/admin", checkAuth([roles.admin, roles.user]), userCtrl.admin);

module.exports = userRouter;