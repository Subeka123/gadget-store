import { Request, Response } from 'express';
import CryptoJS from 'crypto-js';
import pool from '../config/db';

export const getAllGadgets = async (req: Request, res: Response): Promise<void> => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute('SELECT * FROM gadgets');
    connection.release();

    // Decrypt the `secretInfo` field for each gadget
    const decryptedRows = (rows as any[]).map((row: any) => {
      if (row.secretInfo) {
        const bytes = CryptoJS.AES.decrypt(row.secretInfo, 'encryptionKey');
        row.secretInfo = bytes.toString(CryptoJS.enc.Utf8);
      }
      return row;
    });

    res.status(200).json(decryptedRows);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createGadget = async (req: Request, res: Response): Promise<void> => {
  const { name, price, quantity } = req.body;
  const encryptedName = CryptoJS.AES.encrypt(name, 'encryptionKey').toString();

  try {
    const connection = await pool.getConnection();
    const result = await connection.execute(
      'INSERT INTO gadgets (name, price, quantity, secretInfo) VALUES (?, ?, ?, ?)',
      [name, price, quantity, encryptedName]
    );
    connection.release();

    const insertResult = result[0] as any;
    res.status(200).json({ id: insertResult.insertId });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteGadget = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const connection = await pool.getConnection();
    const result = await connection.execute('DELETE FROM gadgets WHERE id = ?', [id]);
    connection.release();

    const deleteResult = result[0] as any;
    if (deleteResult.affectedRows === 0) {
      res.status(404).json({ message: 'Gadget not found' });
      return;
    }
    res.status(200).json({ message: 'Gadget deleted' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateGadget = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { name, price, quantity } = req.body;

  try {
    const connection = await pool.getConnection();
    const result = await connection.execute(
      'UPDATE gadgets SET name = ?, price = ?, quantity = ?, updated_at = NOW() WHERE id = ?',
      [name, price, quantity, id]
    );
    connection.release();

    const updateResult = result[0] as any;
    if (updateResult.affectedRows === 0) {
      res.status(404).json({ message: 'Gadget not found' });
      return;
    }
    res.status(200).json({ message: 'Gadget updated' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getGadgetById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute('SELECT * FROM gadgets WHERE id = ?', [id]);
    connection.release();

    if ((rows as any[]).length === 0) {
      res.status(404).json({ message: 'Gadget not found' });
      return;
    }
    res.status(200).json((rows as any[])[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const bulkDeleteGadgets = async (req: Request, res: Response): Promise<void> => {
  const { ids } = req.body;

  if (!Array.isArray(ids) || ids.length === 0) {
    res.status(400).json({ message: 'Invalid request' });
    return;
  }

  try {
    const connection = await pool.getConnection();
    const placeholders = ids.map(() => '?').join(',');
    const result = await connection.execute(
      `DELETE FROM gadgets WHERE id IN (${placeholders})`,
      ids
    );
    connection.release();

    const deleteResult = result[0] as any;
    res.status(200).json({ message: `${deleteResult.affectedRows} gadgets deleted` });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const bulkUpdateGadgets = async (req: Request, res: Response): Promise<void> => {
  const gadgets = req.body;

  if (!Array.isArray(gadgets) || gadgets.length === 0) {
    res.status(400).json({ message: 'Invalid request' });
    return;
  }

  try {
    const connection = await pool.getConnection();
    let totalUpdated = 0;

    for (const gadget of gadgets) {
      const { id, name, price, quantity } = gadget;
      const result = await connection.execute(
        'UPDATE gadgets SET price = ?, quantity = ?, updated_at = NOW() WHERE id = ?',
        [price, quantity, id]
      );
      totalUpdated += (result[0] as any).affectedRows;
    }

    connection.release();
    res.status(200).json({ message: `${totalUpdated} gadgets updated` });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
