import { RequestHandler } from 'express';
import pool from '../config/db';

// FIX: Use RequestHandler type for better type inference with Express.
export const getAllRatings: RequestHandler = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM ratings');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// FIX: Use RequestHandler type for better type inference with Express.
export const getUserRatings: RequestHandler = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM ratings WHERE userId = ?', [req.user!.id]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// FIX: Use RequestHandler type for better type inference with Express.
export const getStoreRatings: RequestHandler = async (req, res) => {
    try {
        const storeId = req.params.id;
        const ratingsQuery = `
            SELECT r.id, r.value, u.name as userName, u.email as userEmail 
            FROM ratings r
            JOIN users u ON r.userId = u.id
            WHERE r.storeId = ?
        `;
        const [ratings] = await pool.query(ratingsQuery, [storeId]);
        
        const avgQuery = 'SELECT AVG(value) as averageRating FROM ratings WHERE storeId = ?';
        const [avgResult] = await pool.query(avgQuery, [storeId]);
        
        const averageRating = (avgResult as any)[0].averageRating || 0;
        
        res.json({ ratings, averageRating });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// FIX: Use RequestHandler type for better type inference with Express.
export const addOrUpdateRating: RequestHandler = async (req, res) => {
    const { storeId, value } = req.body;
    const userId = req.user!.id;

    if (!storeId || !value) {
        return res.status(400).json({ message: 'Store ID and rating value are required' });
    }

    try {
        const [existingRatings] = await pool.query('SELECT * FROM ratings WHERE userId = ? AND storeId = ?', [userId, storeId]);
        
        if ((existingRatings as any[]).length > 0) {
            // Update
            const existingRating = (existingRatings as any)[0];
            await pool.query('UPDATE ratings SET value = ? WHERE id = ?', [value, existingRating.id]);
            const [updatedRows] = await pool.query('SELECT * FROM ratings WHERE id = ?', [existingRating.id]);
            res.json((updatedRows as any)[0]);
        } else {
            // Insert
            const [result] = await pool.query('INSERT INTO ratings (userId, storeId, value) VALUES (?, ?, ?)', [userId, storeId, value]);
            const insertId = (result as any).insertId;
            const [newRows] = await pool.query('SELECT * FROM ratings WHERE id = ?', [insertId]);
            res.status(201).json((newRows as any)[0]);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
