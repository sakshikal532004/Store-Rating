import { RequestHandler } from 'express';
import pool from '../config/db';

// FIX: Use RequestHandler type for better type inference with Express.
export const getStores: RequestHandler = async (req, res) => {
    try {
        // Query to get stores and their average rating
        const query = `
            SELECT 
                s.*, 
                AVG(r.value) as averageRating
            FROM stores s
            LEFT JOIN ratings r ON s.id = r.storeId
            GROUP BY s.id
        `;
        const [rows] = await pool.query(query);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// FIX: Use RequestHandler type for better type inference with Express.
export const addStore: RequestHandler = async (req, res) => {
    const { name, email, address, ownerId } = req.body;

    try {
        const [result] = await pool.query(
            'INSERT INTO stores (name, email, address, ownerId) VALUES (?, ?, ?, ?)',
            [name, email, address, ownerId || null]
        );
        const insertId = (result as any).insertId;
        const [rows] = await pool.query('SELECT * FROM stores WHERE id = ?', [insertId]);
        res.status(201).json((rows as any)[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
