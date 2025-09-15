import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import pool from '../config/db';

// FIX: Use RequestHandler type for better type inference with Express.
export const protect: RequestHandler = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
            
            const [rows] = await pool.query('SELECT id, name, email, address, role, storeId FROM users WHERE id = ?', [decoded.id]);
            const users = rows as any[];
            
            if (users.length === 0) {
                return res.status(401).json({ message: 'Not authorized, user not found' });
            }

            req.user = users[0];
            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// FIX: Use RequestHandler type for better type inference with Express.
export const admin: RequestHandler = (req, res, next) => {
    if (req.user && req.user.role === 'System Administrator') {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as an admin' });
    }
};
