const Joi = require("@hapi/joi");

// Create login form validation
const loginSchema = Joi.object().keys({
  email: Joi.string()
    .email()
    .required(),
  password: Joi.string().required()
});

const validateLogin = (email, password) => {
  const { error } = loginSchema.validate({ email, password });
  return error;
};

// Create email form validation
const emailSchema = Joi.object().keys({
  email: Joi.string()
    .email()
    .required()
});

const validateEmail = email => {
  const { error } = emailSchema.validate({ email });
  return error;
};

// Create set password form validation
const complexityMethod = (value, helpers) => {
  if (!value.match(/[A-Z]+/)) {
    throw new Error("password must have at least one uppercase.");
  }

  if (!value.match(/[a-z]+/)) {
    throw new Error("password must have at least one lowercase.");
  }

  if (!value.match(/[0-9]+/)) {
    throw new Error("password must have at least one number.");
  }

  if (!value.match(/[!@#$^%&]+/)) {
    throw new Error("password must have at least one symbol: '!@#$%^&'.");
  }

  return value;
};

const setPasswordSchema = Joi.object().keys({
  password: Joi.string()
    .min(5)
    .required()
    .label("Password")
    .custom(complexityMethod, "Password Complexity"),
  confirmPassword: Joi.string()
    .required()
    .valid(Joi.ref("password"))
    .label("Confirmed Password")
});

const validateSetPassword = (password, confirmPassword) => {
  const { error } = setPasswordSchema.validate({ password, confirmPassword });
  return error;
};

const setDisplayName = Joi.object().keys({
  displayName: Joi.string()
    .min(3)
    .max(20)
    .required()
    .label("Display Name")
});

const validateDisplayName = displayName => {
  const { error } = setDisplayName.validate({ displayName });
  return error;
};

module.exports = {
  validateLogin,
  validateEmail,
  validateSetPassword,
  validateDisplayName
};
