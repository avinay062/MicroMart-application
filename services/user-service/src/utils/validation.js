const validator = require('validator');
const { AppError } = require('shared-utils');

const validateSignupData = (req) => {

    const { firstName, lastName, emailId, password } = req.body || {};

    // Normalize
    req.body.firstName = (firstName || '').trim();
    req.body.lastName = (lastName || '').trim();
    req.body.emailId = (emailId || '').trim().toLowerCase();

    // Presence
    if (!req.body.firstName || !req.body.lastName) {
        throw AppError.badRequest('Name is not valid');
    }
    if (!req.body.emailId || !validator.isEmail(req.body.emailId)) {
        throw AppError.badRequest('Given Email id is Invalid');
    }

    if (!password || password.length < 8) {
        throw AppError.badRequest('Password must be at least 8 characters long');
    }

    // (Optional) Strong password policy at request level:
    if (!validator.isStrongPassword(password, {
        minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1,
    })) {
        throw AppError.badRequest('Password is not strong enough');
    }

}

module.exports = {
    validateSignupData
}