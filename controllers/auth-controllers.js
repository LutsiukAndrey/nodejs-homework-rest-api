const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const { User } = require("../models/user");

const { HttpError } = require("../helpers/index");

const { ctrlWrapper } = require("../utils");

const { SECRET_KEY } = process.env;

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "email already exist");
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const result = await User.create({ ...req.body, password: hashPassword });

  res.status(201).json({
    name: result.name,
    email: result.email,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "email already exist");
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "password incorrect");
  }
  const { _id: id } = user;

  const payload = {
    id,
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "48h" });

  await User.findByIdAndUpdate(id, { token });

  res.json({
    token,
    user: {
      name: user.name,
      email: user.email,
    },
  });
};

const getCurrent = async (req, res) => {
  const { name, email } = req.user;

  res.json({
    user: {
      name,
      email,
    },
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;

  await User.findByIdAndUpdate(_id, { token: null });
  res.json({
    message: "logout success",
  });
};

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
};
