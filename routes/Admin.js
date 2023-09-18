const express = require("express");
const routes = express();
const AuthValidator = require("../middleware/auth");
const UserValidator = require("../middleware/validation");
const AdminController = require("../controller/AdminController");

routes.get("/getAllUser", AuthValidator.isAuthorized, AuthValidator.isAdmin, AdminController.getAllUsers);
routes.patch("/updateUserData", AuthValidator.isAuthorized, AuthValidator.isAdmin, AdminController.updateUserData);
routes.delete("/deleteUserData", AuthValidator.isAuthorized, AuthValidator.isAdmin, AdminController.deleteUserData);
routes.patch("/editBookData", AuthValidator.isAuthorized, AuthValidator.isAdmin, AdminController.editBookData);
routes.post("/addNewBook", AuthValidator.isAuthorized, AuthValidator.isAdmin, AdminController.addNewBook);
routes.post("/addDiscount", AuthValidator.isAuthorized, AuthValidator.isAdmin, AdminController.addDiscount);

module.exports = routes;