const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const { success, failure } = require("../util/common");
const UserModel = require("../model/user");
const logger = require("../util/log")

class User {
  async addFund(req, res) {
    try {
      const { userId, amount } = req.body;

      const Validation = validationResult(req).array();
      if (Validation.length > 0) {
        return res.status(422).send(failure("Invalid input", Validation));
      }

      const apiRoute = req.originalUrl + " || " + "Status: Successfully accessed ";
      logger.logMessage(apiRoute);

      const user = await UserModel.findById(userId);

      if (user) {
        console.log(user.name);
        // user.balance += amount;
        user.balance = Number(user.balance) + amount;

        await user.save();

        return res
          .status(200)
          .send(success("Successfully added balance", user));
      } else {
        return res.status(400).send(failure("Failed to find user"));
      }
    } catch (error) {
      const apiRoute = req.originalUrl + " || Status: " + error.message;
      logger.logMessage(apiRoute);
      return res.status(500).send(failure("Internal server error"));
    }
  }
}

module.exports = new User();
