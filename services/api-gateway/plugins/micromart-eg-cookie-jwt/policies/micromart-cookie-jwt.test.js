const policyModule = require('./micromart-cookie-jwt');

describe('micromart-cookie-jwt policy', () => {
  it('injects authorization header from cookie', () => {
    const middleware = policyModule.policy({ cookieName: 'token' });
    const req = { headers: { cookie: 'token=abc123' } };
    const res = {};
    const next = jest.fn();

    middleware(req, res, next);

    expect(req.headers.authorization).toBe('Bearer abc123');
    expect(next).toHaveBeenCalled();
  });

  it('does not override existing authorization header', () => {
    const middleware = policyModule.policy();
    const req = {
      headers: {
        cookie: 'token=abc123',
        authorization: 'Bearer existing'
      }
    };
    const next = jest.fn();

    middleware(req, {}, next);

    expect(req.headers.authorization).toBe('Bearer existing');
    expect(next).toHaveBeenCalled();
  });

  it('skips when cookie missing', () => {
    const middleware = policyModule.policy();
    const req = { headers: {} };
    const next = jest.fn();

    middleware(req, {}, next);

    expect(req.headers.authorization).toBeUndefined();
    expect(next).toHaveBeenCalled();
  });
});
