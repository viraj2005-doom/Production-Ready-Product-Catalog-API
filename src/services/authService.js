const bcrypt = require("bcrypt");
const userRepository = require("../repositories/userRepository");
const AppError = require("../utils/appError");

const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require("../utils/tokenUtils");

const register = async ({ name, email, password }) => {
  if (!name || !email || !password) {
    throw new AppError("Name, email, and password are required", 400);
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(email)) {
    throw new AppError("Valid email is required", 400);
  }

  if (password.length < 6) {
    throw new AppError("Password must be at least 6 characters", 400);
  }

  const existingUser = await userRepository.findByEmail(email);

  if (existingUser) {
    throw new AppError("Email already exists", 409);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  return userRepository.createUser({
    name,
    email,
    password: hashedPassword,
  });
};

const login = async ({ email, password }) => {
  if (!email || !password) {
    throw new AppError("Email and password are required", 400);
  }

  const user = await userRepository.findByEmail(email);

  if (!user) {
    throw new AppError("Invalid credentials", 401);
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new AppError("Invalid credentials", 401);
  }

  const accessToken = generateAccessToken(user);

  const refreshToken = generateRefreshToken(user);

  await userRepository.saveRefreshToken(user.id, refreshToken);

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

const refresh = async (refreshToken) => {
  const decoded = verifyRefreshToken(refreshToken);

  const user = await userRepository.findById(decoded.id);
  await userRepository.findByRefreshToken(refreshToken);

  if (!user) {
    throw new Error("User not found");
  }

  const newAccessToken = generateAccessToken(user);

  return {
    accessToken: newAccessToken,
  };
};

module.exports = {
  register,
  login,
  refresh,
};
