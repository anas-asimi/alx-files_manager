import { Router } from 'express';
import { getStats, getStatus } from '../controllers/AppController';
import addUser from '../controllers/UsersController';
import {
  getConnect,
  getDisconnect,
  getMe,
} from '../controllers/AuthController';
import {
  getFile,
  getIndex,
  getShow,
  postUpload,
  putPublish,
  putUnpublish,
} from '../controllers/FilesController';

const router = Router();

router.get('/status', getStatus);
router.get('/stats', getStats);
router.post('/users', addUser);
router.get('/connect', getConnect);
router.get('/disconnect', getDisconnect);
router.get('/users/me', getMe);
router.post('/files', postUpload);
router.get('/files', getIndex);
router.get('/files/:id', getShow);
router.put('/files/:id/publish', putPublish);
router.put('/files/:id/unpublish', putUnpublish);
router.get('/files/:id/data', getFile);

export default router;
