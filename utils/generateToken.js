import jwt from 'jsonwebtoken';

export const generateAccessToken = (id, email, name) => {
    return jwt.sign({ id, email, name }, process.env.JWT_SECRET_KEY, {
        expiresIn: '30d',
    });
};