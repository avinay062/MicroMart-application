jest.mock('jsonwebtoken', () => ({ verify: jest.fn() }));
process.env.JWT_SECRET = 'test-secret';

const jwt = require('jsonwebtoken');
const { authenticateUser } = require('./authMiddleware');

jest.mock('jsonwebtoken', () => ({ verify: jest.fn() }));

afterAll(() => {
  delete process.env.JWT_SECRET;
});

const createResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('authenticateUser middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('attaches decoded user when token is valid', () => {
    const req = { cookies: { token: 'jwt-token' } };
    const res = createResponse();
    const next = jest.fn();
    const decoded = { id: 'user-1' };
    jwt.verify.mockReturnValue(decoded);

    authenticateUser(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith('jwt-token', process.env.JWT_SECRET);
    expect(req.user).toEqual(decoded);
    expect(next).toHaveBeenCalled();
  });

  it('returns 401 when token is missing', () => {
    const req = { cookies: {} };
    const res = createResponse();
    const next = jest.fn();

    authenticateUser(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Authentication token missing' });
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 401 when jwt verification fails', () => {
    const req = { cookies: { token: 'bad' } };
    const res = createResponse();
    const next = jest.fn();
    jwt.verify.mockImplementation(() => {
      throw new Error('expired');
    });

    authenticateUser(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid or expired authentication token' });
  });
});
