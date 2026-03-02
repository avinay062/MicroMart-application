const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { validateSignupData } = require('../utils/validation');
const { AppError } = require('shared-utils');

class UserController {
    async signup(req, res) {
        validateSignupData(req);

        const { firstName, lastName, emailId, password } = req.body;
        const existing = await User.findOne({ emailId });
        if (existing) {
            throw AppError.conflict('User with this email is already registered', { emailId });
        }

        const passwordHash = await bcrypt.hash(password, 12);
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash
        });

        const savedUser = await user.save();

        return res.status(201).json({
            message: 'User is Added Successfully..!',
            data: {
                id: savedUser._id,
                firstName: savedUser.firstName,
                lastName: savedUser.lastName,
                emailId: savedUser.emailId,
                createdAt: savedUser.createdAt
            }
        });
    }

    async signIn(req, res) {
        const { emailId, password } = req.body;
        if (!emailId || !password) {
            throw AppError.badRequest('Email and password are required');
        }

        const user = await User.findOne({ emailId }).select('+password');
        const isPasswordvalid = user ? await user.validatePassword(password) : false;

        if (!user || !isPasswordvalid) {
            throw AppError.unauthorized('Invalid credentials');
        }

        const SECRET_KEY = process.env.JWT_SECRET;
        if (!SECRET_KEY) {
            throw AppError.internal('JWT secret key is not configured', null, 'ERR_JWT_SECRET_MISSING');
        }

        const newToken = jwt.sign(
            { id: user._id, email: user.emailId },
            SECRET_KEY,
            { expiresIn: '7d' }
        );

        res.cookie('token', newToken, {
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
            expires: new Date(Date.now() + 15 * 60 * 1000)
        });

        const { _id, firstName, lastName, emailId: email } = user;
        return res.json({
            message: 'Login Successful',
            data: {
                id: _id,
                firstName,
                lastName,
                emailId: email
            }
        });
    }

    async getUserById(req, res) {
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) {
            throw AppError.notFound('User not found', { userId: id });
        }
        return res.json({ message: 'User retrieved successfully', data: user });
    }

    async getAllUsers(req, res) {
        const users = await User.find();
        return res.status(200).json({ message: 'Users retrieved successfully', data: users });
    }

    async logout(req, res) {
        res.clearCookie('token');
        return res.status(200).json({ message: 'Logout successful' });
    }

    validateAuth(req, res, next) {
        // Lazy require to avoid circular dependency inside middleware
        const authMiddleware = require('../middleware/authentication');
        authMiddleware(req, res, (err) => {
            if (err) {
                return next(AppError.unauthorized('Authentication failed', { reason: err.message }));
            }
            res.status(200).json({ message: 'Authentication successful' });
        });
    }
}

module.exports = UserController;