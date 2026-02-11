import express, { Router } from 'express';
import {
  getAllGadgets,
  createGadget,
  deleteGadget,
  updateGadget,
  getGadgetById,
  bulkDeleteGadgets,
  bulkUpdateGadgets
} from '../controllers/gadgetController';
import authenticateJWT from '../middleware/auth';

const router: Router = express.Router();

router.get('/', authenticateJWT, getAllGadgets);
router.post('/', authenticateJWT, createGadget);
router.delete('/:id', authenticateJWT, deleteGadget);
router.put('/bulk-update', authenticateJWT, bulkUpdateGadgets);
router.put('/:id', authenticateJWT, updateGadget);
router.get('/:id', authenticateJWT, getGadgetById);
router.post('/bulk-delete', authenticateJWT, bulkDeleteGadgets);

export default router;
