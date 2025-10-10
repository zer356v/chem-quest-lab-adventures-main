import express from 'express';
import { createUserExperiment, getUserExperiments } from '../controllers/experimentController.js';

const router = express.Router();
router.post('/', createUserExperiment); 
router.get('/:userId', getUserExperiments);

export default router;