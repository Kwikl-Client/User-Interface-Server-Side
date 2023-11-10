import jwt from 'jsonwebtoken';

export const generateAccessToken = (id, email) => {
    return jwt.sign({ id, email }, process.env.JWT_SECRET_KEY, {
        expiresIn: '30d',
    });
};