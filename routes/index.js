import express from 'express';
import FilesController from '../controllers/FilesController';

const router = express.Router();

router.get('/status', FilesController.getStatus);
router.get('/stats', FilesController.getStats);
router.post('/users', FilesController.postUser);
router.get('/connect', FilesController.getConnect);
router.get('/disconnect', FilesController.getDisconnect);
router.get('/users/me', FilesController.getMe);
router.post('/files', FilesController.postUpload);
router.get('/files/:id', FilesController.getShow); // New endpoint
router.get('/files', FilesController.getIndex); // New endpoint

export default router;
