import { prisma } from '../lib/prisma.js';
import { getErrorMessage } from '../utils/error.js';
import { generateToken } from '../utils/jwtUtils.js';
import bcrypt from 'bcrypt';

import type { Request, Response } from 'express';

const SALT_ROUNDS = 10;

export async function register(req: Request, res: Response) {
    try {
        const { username, password } = req.body;

        const userExists = await prisma.user.findUnique({
            where: {
                username: username
            }
        });
        if (userExists) {
            console.error("A user with that name already exists");
            return res.status(400).json({
                error: 'Username already exists'
            });
        }

        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

        const user = await prisma.user.create({
            data: {
                username: username,
                password_hash: passwordHash
            }
        });

        return res.status(201).json({
            id: user.id,
            username: user.username,
            token: generateToken(user.id),
        });
    }
    catch (error) {
        console.error("Failed to create user: ", getErrorMessage(error));
        return res.status(500).json({
            error: "Error during signup"
        });
    }
}

export async function login(req: Request, res: Response) {
    try {
        const { username, password } = req.body;
        const user = await prisma.user.findUnique({
            where: {
                username: username
            }
        });
        if (!user) {
            return res.status(404).json({
                error: "Invalid credentials"
            });
        }

        const match = await bcrypt.compare(password, user.password_hash!);
        if (!match) {
            return res.status(401).json({
                error: "Invalid credentials"
            });
        }

        return res.json({
            id: user.id,
            username: user.username,
            token: generateToken(user.id!)
        });
    }
    catch (error) {
        console.error("Error during login: ", getErrorMessage(error));
        return res.status(500).json({
            error: "Error during login"
        });
    }
}

export async function changePassword(req: Request, res: Response) {
    try {
        const userId = req.user;
        const { oldPassword, newPassword } = req.body;

        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        });

        if (!user) {
            console.error("User not found");
            return res.status(404).json({
                error: "User not found"
            });
        }

        const match = await bcrypt.compare(oldPassword, user.password_hash);
        if(!match) {
            console.error("Old password not correct");
            return res.status(401).json({
                error: "Old password not correct"
            });
        }

        const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
        await prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                password_hash: passwordHash
            }
        });

        const newToken = generateToken(userId!);
        console.log("Password changed successfully");
        return res.json({
            message: "Password changed successfully",
            token: newToken
        })
    }
    catch (error) {
        console.error("Error changing password: ", getErrorMessage(error));
        return res.status(500).json({
            error: "Failed to change password"
        });
    }
}

export async function deleteUser(req: Request, res: Response) {
    try {
        const userId = req.user;
        await prisma.user.delete({
            where: {
                id: userId,
            }
        });

        return res.json({
            message: "User deleted successfully"
        });
    }
    catch (error) {
        console.error("Error deleting user: ", getErrorMessage(error));
        return res.status(500).json({
            error: "Failed to delete user"
        });
    }
}