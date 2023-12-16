const Joi = require("joi");

const avatarUrlRegex =
  /^(https?:\/\/)(www\.)?([a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]+)#?$/;

const createUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  name: Joi.string().min(2).max(30),
  about: Joi.string().min(2).max(30),
  avatar: Joi.string()
    .pattern(avatarUrlRegex)
    .message("Некорректный URL аватара"),
});

const updateUserSchema = Joi.object({
  name: Joi.string().min(2).max(30),
  about: Joi.string().min(2).max(30),
});

const updateAvatarSchema = Joi.object({
  avatar: Joi.string()
    .pattern(avatarUrlRegex)
    .required()
    .message("Некорректный URL аватара"),
});

module.exports = {
  createUserSchema,
  updateUserSchema,
  updateAvatarSchema,
};
