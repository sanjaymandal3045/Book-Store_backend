const express = require("express");
const routes = express();
const AuthController = require("../controller/AuthController");
const validator = require("../middleware/validation");


routes.post("/signup", validator.signup, AuthController.signup);

routes.post("/login", validator.signin, AuthController.login);


module.exports = routes;