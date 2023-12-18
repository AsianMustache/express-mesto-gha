const Joi = require("joi");

const avatarUrlRegex =
  /^(https?:\/\/)(www\.)?([a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]+)#?$/;

const createUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  name: Joi.string().min(2).max(30),
  about: Joi.string().min(2).max(30),
  avatar: Joi.string().pattern(avatarUrlRegex).messages({
    "string.pattern.base": "Некорректный URL аватара",
  }),
});

const updateUserSchema = Joi.object({
  name: Joi.string().min(2).max(30),
  about: Joi.string().min(2).max(30),
});

const updateAvatarSchema = Joi.object({
  avatar: Joi.string().pattern(avatarUrlRegex).required().messages({
    "string.pattern.base": "Некорректный URL аватара",
    "any.required": "URL аватара обязателен",
  }),
});

const signInSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

module.exports = {
  createUserSchema,
  updateUserSchema,
  updateAvatarSchema,
  signInSchema,
};
