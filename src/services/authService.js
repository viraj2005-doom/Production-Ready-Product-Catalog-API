const bcrypt = require("bcrypt");
const userRepository = require("../repositories/userRepository");

const {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
} = require("../utils/tokenUtils");

const register = async ({
    name,
    email,
    password,
}) => {

    const existingUser = await userRepository.findByEmail(email);

    if (existingUser) {
        throw new Error("Email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    return userRepository.createUser({
        name,
        email,
        password: hashedPassword,
    });
};

const login = async ({
    email,
    password,
}) => {

    const user = await userRepository.findByEmail(email);

    if (!user) {
        throw new Error("Invalid credentials");
    }

    const isMatch = await bcrypt.compare(
        password,
        user.password
    );

    if (!isMatch) {
        throw new Error("Invalid credentials");
    }

    const accessToken =
        generateAccessToken(user);

    const refreshToken =
        generateRefreshToken(user);

    await userRepository.saveRefreshToken(
        user.id,
        refreshToken
    );

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

    const decoded =
        verifyRefreshToken(refreshToken);

    const user =
        await userRepository.findById(decoded.id);
        await userRepository.findByRefreshToken(refreshToken); 
  
    if (!user) {
        throw new Error("User not found");
    }

    const newAccessToken =
        generateAccessToken(user);

    return {
        accessToken: newAccessToken,
    };
};

module.exports = {
    register,
    login,
    refresh,
};