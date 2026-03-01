const UserController = require('./userController');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const { validateSignupData } = require('../utils/validation');

jest.mock('../models/user');
jest.mock('bcryptjs', () => ({ hash: jest.fn() }));
jest.mock('../utils/validation', () => ({ validateSignupData: jest.fn() }));

User.findOne = jest.fn();

const createResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('UserController.signup', () => {
  const controller = new UserController();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates a user when email is unique', async () => {
    const req = {
      body: {
        firstName: 'John',
        lastName: 'Doe',
        emailId: 'john@example.com',
        password: 'Password@123'
      }
    };
    const res = createResponse();
    const savedUser = {
      _id: 'user-id',
      firstName: 'John',
      lastName: 'Doe',
      emailId: 'john@example.com',
      createdAt: new Date()
    };

    User.findOne.mockResolvedValue(null);
    const saveMock = jest.fn().mockResolvedValue(savedUser);
    User.mockImplementation(() => ({ save: saveMock }));
    bcrypt.hash.mockResolvedValue('hashed-password');

    await controller.signup(req, res);

    expect(validateSignupData).toHaveBeenCalledWith(req);
    expect(bcrypt.hash).toHaveBeenCalledWith('Password@123', 12);
    expect(saveMock).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'User is Added Successfully..!'
      })
    );
  });

  it('returns conflict when user already exists', async () => {
    const req = {
      body: {
        firstName: 'John',
        lastName: 'Doe',
        emailId: 'john@example.com',
        password: 'Password@123'
      }
    };
    const res = createResponse();

    User.findOne.mockResolvedValue({ _id: 'existing' });

    await controller.signup(req, res);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({
      message: 'User with this email is already registered'
    });
    expect(bcrypt.hash).not.toHaveBeenCalled();
  });
});
