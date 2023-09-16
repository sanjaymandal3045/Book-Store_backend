const { validationResult } = require("express-validator");
const ProductModel = require("../model/Product");
const { success, failure } = require("../util/common");
const UserModel = require("../model/user");
const AuthModel = require("../model/Auth");
const mongoose = require("mongoose");
const Auth = require("../model/Auth");
const jsonwebtoken = require("jsonwebtoken");

const bcrypt = require("bcrypt");
const { json } = require("express");

class AuthController {
  async login(req, res) {
    try {
      const Validation = validationResult(req).array();
      console.log(Validation);
      if (Validation.length > 0) {
        return res.status(422).send(failure("Invalid input", Validation));
      }

      const { email, password } = req.body;
      console.log(email, password);

      const auth = await Auth.findOne({ email }).populate("user");
      console.log("AUTH:::,,,,,,,,,,", auth);

      if (!auth) {
        return res.status(200).send(failure("User is not registered"));
      }

      const checkPassword = await bcrypt.compare(password, auth.password);

      if (checkPassword) {
        auth.loginAttempts = 0;
        auth.lastLogin = new Date();
        await auth.save();

        const modifiedResponse = {
          email: auth.email,
          user: auth.user,
        };

        console.log("Modified response",modifiedResponse);

        const jwt = jsonwebtoken.sign(
          modifiedResponse,
          process.env.SECRET_KEY,
          { expiresIn: "12h" }
        );
        modifiedResponse.token = jwt;

        return res.status(200).send(success("Success", modifiedResponse));
      } else {
        let leftAttempts = 0;
        if (auth) {
          const lastLoginArray = auth.lastLogin;
          const lastLoginTimestamp = lastLoginArray[lastLoginArray.length - 1];

          const currentTime = new Date();
          const timeDifferenceInMS = currentTime - lastLoginTimestamp;

          if(timeDifferenceInMS > 5000){
            auth.isBlocked = false,
            auth.loginAttempts = 0,
            auth.lastLogin = [],

            await auth.save();
          }

          if (auth.isBlocked === true) {
            return res.status(200).send(failure("User is blocked"));
          }

          leftAttempts = 5 - auth.loginAttempts;
          auth.loginAttempts++;
          auth.lastLogin.push(new Date());
          if (auth.loginAttempts >= 5) {
            auth.isBlocked = true;
          }
          await auth.save();
        }

        return res
          .status(400)
          .send(
            failure(
              `invalid username of password of user, ${leftAttempts} attempts left`
            )
          );
      }
    } catch (error) {
      console.log("Errorrrrrrrrrrrrr", error);
      return res.status(500).send(success("Server Error"));
    }
  }

  async signup(req, res) {
    try {
      const Validation = validationResult(req).array();
      console.log(Validation);
      if (Validation.length > 0) {
        return res.status(422).send(failure("Invalid input", Validation));
      }

      const { email, password, name, userName, phoneNo } = req.body;

      const isAvailable = await UserModel.findOne({email});
      
      if(isAvailable){
        return res.status(400).send(failure("User already exists"));
      }

      const hashedPassword = await bcrypt.hash(password, 10).then((hash) => {
        return hash;
      });

      console.log(hashedPassword);
      if (hashedPassword) {
        const newUser = await UserModel.create({
          email,
          name,
          userName,
          phoneNo
        });

        if (newUser) {
          const newAuthUser = await AuthModel.create({
            email,
            password: hashedPassword,
            user: newUser._id,
          });
          if (newAuthUser) {
            return res
              .status(200)
              .send(success("Successfully created new User"));
          }
        }

        return res.status(400).send(failure("could not create new User"));
      }
    } catch (error) {
      console.log(error);
      return res.status(500).send(failure("Internal Server Error"));
    }
  }
}

module.exports = new AuthController();
