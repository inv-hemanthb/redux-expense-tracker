import jwt, { JwtPayload } from 'jsonwebtoken';

import type { Request, Response, NextFunction } from 'express';
import { getErrorMessage } from '../utils/error.js';

export async function protect(req: Request, res: Response, next: NextFunction) {
    let token: string | null = null;
    const JWT_SECRET = process.env.JWT_SECRET!;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
            req.user = decoded.id;

            next();
        }
        catch (error) {
            console.error("Token verification failed: ", getErrorMessage(error));
            return res.status(401).json({
                error: 'Not authorized, auth token failed'
            });
        }
    }

    if (!token) {
        return res.status(401).json({
            error: 'Not authorized, no auth token'
        });
    }
}