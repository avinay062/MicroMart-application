const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { validateSignupData } = require('../utils/validation');

class UserController {

    async signup(req, res) {
        try {
            validateSignupData(req);

            const { firstName, lastName, emailId, password } = req.body;
            const existing = await User.findOne({ emailId });
            if (existing) {
                return res.status(409).json({ message: 'User with this email is already registered' });
            }
            const passwordHash = await bcrypt.hash(password, 12);
            const user = new User({
                firstName,
                lastName,
                emailId,
                password: passwordHash,
            });
            const savedUser = await user.save();
      
            return res.status(201).json({
                message: 'User is Added Successfully..!',
                data: {
                    id: savedUser._id,
                    firstName: savedUser.firstName,
                    lastName: savedUser.lastName,
                    emailId: savedUser.emailId,
                    createdAt: savedUser.createdAt,
                },
            });
        } catch (err) {
            if (err?.code === 11000 && err?.keyPattern?.emailId) {
                return res.status(409).json({ message: 'User with this email is already registered' });
            }
            if (err?.name === 'ValidationError') {
                const details = Object.values(err.errors).map(e => ({
                    field: e.path,
                    message: e.message,
                }));
                return res.status(400).json({ message: 'Validation failed', details });
            }

            console.error('Signup error:', err);
            return res.status(400).json({ message: err?.message || 'Invalid signup request' });
        }

    }
    async signIn(req, res) {
        try {
            const { emailId, password } = req.body;
            const user = await User.findOne({ emailId }).select('+password');
            if (!user) {
                throw new Error("Invalid Credentials");
            }
            const isPasswordvalid = await user.validatePassword(password);

            if (!isPasswordvalid) {
                throw new Error('Invalid Credentials');
            }
            const SECRET_KEY = process.env.JWT_SECRET;
            if (!SECRET_KEY) {
               throw new Error('JWT secret key is not configured');
            } 
            const newToken = jwt.sign({id: user._id, email: user.emailId},
                SECRET_KEY,
                {expiresIn: '7d'}
            )

            res.cookie('token', newToken, {
                httpOnly: true, 
                sameSite: 'strict', 
                secure: process.env.NODE_ENV === 'production',
                expires: new Date(Date.now() + 15 * 60 * 1000), 
            });

            const { _id, firstName, lastName, emailId: email } = user;
            return res.json({
                message: 'Login Successful',
                data: {
                    id: _id,
                    firstName: firstName,
                    lastName: lastName,
                    emailId: email
                }
            });
        } catch (err) {
            res.status(400).send("Error: " + err.message);
        }
    }
    
    async getUserById(req, res) {
        try{
            console.log('Fetching user with ID:', req);
        } catch(err){
            console.error('Error fetching user by ID:', err);
            res.status(500).json({ message: 'Failed to fetch user', error: err.message });
        }
    }

    async getAllUsers(req, res) {
        try {
            const users = await User.find();
            res.status(200).json({ message: 'Users retrieved successfully', data: users });
        } catch (err) {
            console.error('Error fetching users:', err);
            res.status(500).json({ message: 'Failed to fetch users', error: err.message });
        }
    }
    async logout(req, res) {
        try {
            res.clearCookie('token');
            res.status(200).json({ message: 'Logout successful' });
        } catch (err) {
            console.error('Error during logout:', err);
            res.status(500).json({ message: 'Logout failed', error: err.message });
        }
    }

    validateAuth(req, res, next) {
        const authMiddleware = require('../middleware/authentication');
        authMiddleware(req, res, (err) => {
            if (err) {
                return res.status(401).json({ message: 'Authentication failed', error: err.message });
            }
            res.status(200).json({ message: 'Authentication successful' });
        });
    }
}

module.exports = UserController;