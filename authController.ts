import { RequestHandler } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/db';

const generateToken = (id: number) => {
    return jwt.sign({ id }, process.env.JWT_SECRET!, {
        expiresIn: '30d',
    });
};

// FIX: Use RequestHandler type for better type inference with Express.
export const registerUser: RequestHandler = async (req, res) => {
    const { name, email, password, address } = req.body;

    // Security: Enforce 'Normal User' role for public registration
    const role = 'Normal User';

    if (!name || !email || !password || !address) {
        return res.status(400).json({ message: 'Please add all fields' });
    }

    try {
        const [userExists] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if ((userExists as any[]).length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const [result] = await pool.query(
            'INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)',
            [name, email, hashedPassword, address, role]
        );

        const insertId = (result as any).insertId;

        const [rows] = await pool.query('SELECT id, name, email, address, role, storeId FROM users WHERE id = ?', [insertId]);
        const newUser = (rows as any[])[0];

        if (newUser) {
            res.status(201).json({
                token: generateToken(newUser.id),
                user: newUser,
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// FIX: Use RequestHandler type for better type inference with Express.
export const loginUser: RequestHandler = async (req, res) => {
    const { email, password } = req.body;
    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        const users = rows as any[];
        const user = users[0];

        if (user && (await bcrypt.compare(password, user.password))) {
            const { password: _, ...userWithoutPassword } = user;
            res.json({
                token: generateToken(user.id),
                user: userWithoutPassword,
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// FIX: Use RequestHandler type for better type inference with Express.
export const getUserProfile: RequestHandler = (req, res) => {
    res.json(req.user);
};
