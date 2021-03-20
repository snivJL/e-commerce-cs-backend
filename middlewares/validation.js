const utilsHelper = require("../helpers/utils.helper");
const mongoose = require("mongoose");

const { validationResult, check } = require("express-validator");
const validators = {};

validators.resultsValidator = (req) => {
  const messages = [];
  if (!validationResult(req).isEmpty()) {
    const errors = validationResult(req).array();
    for (const i of errors) {
      messages.push(i);
    }
  }
  return messages;
};

validators.validate = (validationArray) => async (req, res, next) => {
  await Promise.all(validationArray.map((validation) => validation.run(req)));
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();

  const extractedErrors = [];
  errors
    .array()
    .map((error) => extractedErrors.push({ [error.param]: error.msg }));
  return utilsHelper.sendResponse(
    res,
    422,
    false,
    null,
    extractedErrors,
    "Validation Error missing requirements"
  );
};

validators.checkObjectId = (paramId) => {
  if (!mongoose.Types.ObjectId.isValid(paramId)) {
    throw new Error("Invalid ObjectId: Object id is not a mongodb Id");
  }
  return true;
};

module.exports = validators;
