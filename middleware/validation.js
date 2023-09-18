const { failure } = require("../util/common");
const { body, query, param } = require("express-validator");

const validator = {
  createValidation: [
    body("age")
      .exists()
      .withMessage("This request must contain age property")
      .custom((value, { req, res }) => {
        if (value <= 0) {
          throw new Error("age must be greater or equal than 0");
        }
        return true;
      }),

    body("name")
      .exists()
      .withMessage("This request must contain Name property")
      .not()
      .equals("")
      .withMessage("Name was not provided in the property"),

    body("access")
      .exists()
      .withMessage("This request must contain access property")
      .not()
      .equals("")
      .withMessage("access was not provided in the property")
      .not()
      .equals(0)
      .withMessage("stock was not provided in the property"),

    body("email")
      .exists()
      .withMessage("This request must contain email property")
      .not()
      .equals("")
      .withMessage("author was not provided in the property"),

    body("userName")
      .exists()
      .withMessage("This request must contain userName property")
      .not()
      .equals("")
      .withMessage("userName was not provided in the property"),
  ],

  updateValidation: [
    body("age")
      .optional()
      .custom((value, { req, res }) => {
        if (value <= 0) {
          throw new Error("age must be greater or equal than 0");
        }
        return true;
      }),

    body("name")
      .optional()
      .not()
      .equals("")
      .withMessage("Name was not provided in the property"),

    body("email")
      .optional()
      .not()
      .equals("")
      .withMessage("author was not provided in the property"),

    body("access")
      .optional()
      .not()
      .equals("")
      .withMessage("access was not provided in the property")
      .not()
      .equals(0)
      .withMessage("stock was not provided in the property"),

    body("userName")
      .optional()
      .not()
      .equals("")
      .withMessage("userName was not provided in the property"),
  ],

  signup: [
    body("name")
      .not()
      .equals("")
      .withMessage("name must be provided")
      .bail()
      .isString()
      .withMessage("name must be a string"),

    body("email")
      .not()
      .equals("")
      .withMessage("Email must be Provided in the field")
      .bail()
      .isString()
      .withMessage("Email Must be a string")
      .bail()
      .isEmail()
      .withMessage("Email must be in valid format"),

    body("userName")
      .not()
      .equals("")
      .withMessage("name must be provided")
      .bail()
      .isString()
      .withMessage("name must be a string"),

    body("password")
      .not()
      .equals("")
      .withMessage("Password must be provided")
      .bail()
      .isString()
      .withMessage("Password must be a string")
      .bail()
      .isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minSymbols: 1,
        minNumbers: 1,
      }),
    body("phoneNo")
      .not()
      .equals("")
      .withMessage("phoneNo must be provided")
      .bail()
      .isString()
      .withMessage("phoneNo must be a Number"),
  ],

  signin: [
    body("email")
      .not()
      .equals("")
      .withMessage("Email must be Provided in the field")
      .bail()
      .isEmail()
      .withMessage("Email must be in a valid format")
      .bail()
      .isString()
      .withMessage("Email must be a string"),
    body("password")
      .exists()
      .not()
      .equals("")
      .withMessage("Password must be provided")
      .bail()
      .isString()
      .withMessage("Password must be a string"),
  ],

  createProductValidation: [
    body("price")
      .exists()
      .withMessage("This request must contain price property")
      .custom((value, { req, res }) => {
        if (value <= 0) {
          throw new Error("price must be greater or equal than 0");
        }
        return true;
      }),

    body("stock")
      .exists()
      .withMessage("This request must contain stock property")
      .custom((value, { req, res }) => {
        if (value <= 0) {
          throw new Error("stock must be greater or equal than 0");
        }
        return true;
      }),

    body("name")
      .exists()
      .withMessage("This request must contain Name property")
      .not()
      .equals("")
      .withMessage("Name was not provided in the property"),

    body("releaseDate")
      .exists()
      .withMessage("This request must contain email property")
      .not()
      .equals("")
      .withMessage("author was not provided in the property"),

    body("author")
      .exists()
      .withMessage("This request must contain userName property")
      .not()
      .equals("")
      .withMessage("userName was not provided in the property"),
  ],

  createTransactionValidation: [
    body("user")
      .exists()
      .withMessage("This request must contain Name property")
      .not()
      .equals("")
      .withMessage("Name was not provided in the property"),

    body("product")
      .exists()
      .withMessage("This request must contain Name property")
      .not()
      .equals("")
      .withMessage("Name was not provided in the property"),

    body("quantity")
      .exists()
      .withMessage("This request must contain access property")
      .not()
      .equals("")
      .withMessage("access was not provided in the property")
      .not()
      .equals(0)
      .withMessage("quantity was not provided in the property"),
  ],

  addFundingValidation: [
    body("userId")
      .exists()
      .withMessage("This request must contain userId property")
      .bail()
      .not()
      .equals("")
      .withMessage("Name was not provided in the property")
      .bail()
      .isString()
      .withMessage("userId must be a string"),

      body("amount")
      .exists()
      .withMessage("This request must contain amount property")
      .bail()
      .not()
      .equals("")
      .withMessage("amount was not provided in the property")
      .bail()
      .isNumeric()
      .withMessage("amount must be a Number")
      .bail()
      .custom((value, { req, res }) => {
        if (value <= 0) {
          throw new Error("Amount must be greater than 0");
        }
        return true;
      }),
  ]
};

module.exports = validator;
