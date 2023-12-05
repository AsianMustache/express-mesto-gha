const User = "../models/users";

// Получение всех пользователей
export async function getAllUsers(req, res) {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (err) {
    res.status(500).send(err);
  }
}

// Получение пользователя по ID
export async function getUserById(req, res) {
  try {
    const user = await User.findById(req.params.userId);
    res.status(200).json(user);
  } catch (err) {
    res.status(500).send(err);
  }
}

// Создание нового пользователя
export async function createUser(req, res) {
  try {
    const newUser = await User.create(req.body);
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).send(err);
  }
}
