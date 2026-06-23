// src/controllers/userController.js

const userRepository = require("../repositories/userRepository");

const getProfile = async (req, res, next) => {
  try {
    const user = await userRepository.findById(req.user.id);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
};
