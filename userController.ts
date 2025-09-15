import { RequestHandler } from 'express';
import bcrypt from 'bcryptjs';
import pool from '../config/db';

// FIX: Use RequestHandler type for better type inference with Express.
export const getUsers: RequestHandler = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT id, name, email, address, role, storeId FROM users');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// FIX: Use RequestHandler type for better type inference with Express.
export const addUser: RequestHandler = async (req, res) => {
    const { name, email, password, address, role, storeId } = req.body;

    try {
        const [userExists] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if ((userExists as any[]).length > 0) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const [result] = await pool.query(
            'INSERT INTO users (name, email, password, address, role, storeId) VALUES (?, ?, ?, ?, ?, ?)',
            [name, email, hashedPassword, address, role, storeId || null]
        );
        const insertId = (result as any).insertId;
        
        const [rows] = await pool.query('SELECT id, name, email, address, role, storeId FROM users WHERE id = ?', [insertId]);

        res.status(201).json((rows as any)[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// FIX: Use RequestHandler type for better type inference with Express.
export const updateUserPassword: RequestHandler = async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user!.id;

    if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: 'Please provide current and new passwords' });
    }

    try {
        const [rows] = await pool.query('SELECT password FROM users WHERE id = ?', [userId]);
        const user = (rows as any)[0];
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid current password' });
        }
        
        const salt = await bcrypt.genSalt(10);
        const hashedNewPassword = await bcrypt.hash(newPassword, salt);
        
        await pool.query('UPDATE users SET password = ? WHERE id = ?', [hashedNewPassword, userId]);
        
        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
