const express = require("express");
const routes = express();
const UserController = require("../controller/UserController");
const AuthValidator = require("../middleware/auth");
const UserValidator = require("../middleware/validation");

routes.post("/addFund", UserValidator.addFundingValidation, AuthValidator.isAuthorized, AuthValidator.isUser, UserController.addFund);

module.exports = routes;