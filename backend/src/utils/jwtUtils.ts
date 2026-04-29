import jwt from 'jsonwebtoken';

export function generateToken(userId: string) {
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
        throw new Error("JWT Secret not found in env");
    }

    return jwt.sign(
        { id: userId },
        JWT_SECRET,
        {expiresIn: '30d'}
    );
}
