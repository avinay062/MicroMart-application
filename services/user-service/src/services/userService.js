const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


class UserService {
    async createUser(userData) {
        const { firstName, lastName, emailId, password } = userData;
        const existing = await User.findOne({ emailId });
        if (existing) {
            throw new Error('User with this email is already registered');
        }   
        const passwordHash = await bcrypt.hash(password, 12);
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash,
        });
        return await user.save();
    }
    async validateUserCredentials(emailId, password) {
        const user = await User.findOne({ emailId }).select('+password');
        if (!user) {
            throw new Error("Invalid Credentials");
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error("Invalid Credentials");
        }
        return user;
    }   

    generateToken(user) {
        const SECRET_KEY = process.env.JWT_SECRET;
        if (!SECRET_KEY) {
            throw new Error('JWT_SECRET is not defined in environment variables');
        }
        const token = jwt.sign({ id: user._id, emailId: user.emailId }, SECRET_KEY, { expiresIn: '7d' });
        return token;
    }

    async getAllUsers() {
        return await User.find();
    }
}

module.exports = UserService;