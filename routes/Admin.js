const express = require("express");
const routes = express();
const AuthValidator = require("../middleware/auth");
const UserValidator = require("../middleware/validation");
const AdminController = require("../controller/AdminController");

routes.get("/getAllUser", AuthValidator.isAuthorized, AuthValidator.isAdmin, AdminController.getAllUsers);
routes.patch("/updateUserData", AuthValidator.isAuthorized, AuthValidator.isAdmin, AdminController.updateUserData);

module.exports = routes;