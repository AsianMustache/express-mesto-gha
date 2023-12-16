const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    // required: true,
    // minlength: 2,
    // maxlength: 30,
    default: "Жак-Ив Кусто",
  },
  about: {
    type: String,
    // required: true,
    // minlength: 2,
    // maxlength: 30,
    default: "Исследователь",
  },
  avatar: {
    type: String,
    // required: true,
    default:
      "https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png",
  },
  email: {
    type: String,
    require: {
      value: true,
      message: "Поле email является обязательным",
    },
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: "Неверный формат email",
    },
  },
  password: {
    type: String,
    require: {
      value: true,
      message: "Поле password является обязательным",
    },
  },
});

module.exports = mongoose.model("user", userSchema);
