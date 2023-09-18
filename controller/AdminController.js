const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const HTTP_STATUS = require("../constants/statusCodes");
const { success, failure } = require("../util/common");
const UserModel = require("../model/user");
const logger = require("../util/log");

class Admin {
  async getAllUsers(req, res) {
    try {
      const apiRoute =
        req.originalUrl + " || " + "Status: Successfully accessed ";
      logger.logMessage(apiRoute);

      const allUsers = await UserModel.find({ access: "user" }).select(
        "-access -balance"
      );
      if (allUsers.length > 0) {
        return res
          .status(HTTP_STATUS.OK)
          .send(success("Successfully received all Users", allUsers));
      }

      return res.status(HTTP_STATUS.NOT_FOUND).send(success("No Users found"));
    } catch (error) {
      const apiRoute = req.originalUrl + " || Status: " + error.message;
      logger.logMessage(apiRoute);
      return res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .send(failure("Internal server error"));
    }
  }

  async updateUserData(req, res) {
    try {
      const { userId, name, access } = req.body;
      const apiRoute =
        req.originalUrl + " || " + "Status: Successfully accessed ";
      logger.logMessage(apiRoute);

      const user = await UserModel.findOne({_id:userId}).select(
        "-phoneNo -balance"
      );

      if (user) {
        if (name) {
          user.name = name;
        }
        if (access) {
          user.access = access;
        }
        await user.save();

        return res
          .status(HTTP_STATUS.OK)
          .send(success(`Successfully edited user`, user));
      } else {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .send(success("No Users found"));
      }
    } catch (error) {
      const apiRoute = req.originalUrl + " || Status: " + error.message;
      logger.logMessage(apiRoute);
      return res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .send(failure("Internal server error"));
    }
  }

  async updateUserData(req, res) {
    try {
      const { userId} = req.body;
      const apiRoute =
        req.originalUrl + " || " + "Status: Successfully accessed ";
      logger.logMessage(apiRoute);

      const isDeleted = await UserModel.deleteOne({_id:userId});

      if (isDeleted) {
        return res
          .status(HTTP_STATUS.OK)
          .send(success(`Successfully edited user`));
      } else {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .send(success("No Users found"));
      }
    } catch (error) {
      const apiRoute = req.originalUrl + " || Status: " + error.message;
      logger.logMessage(apiRoute);
      return res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .send(failure("Internal server error"));
    }
  }
}

module.exports = new Admin();
