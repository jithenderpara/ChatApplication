import {Router} from 'express';
const routerFile = Router();
import multer from 'multer';
import {uploadFile} from '../api/upload/index.js';
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '/uploads')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix)
    }
  })
  const uploadFiles = multer({ storage: storage }).array('myFiles', 4);// myFiles is input filed name
  routerFile.get('/uploadFiles', uploadFiles, uploadFile).post('/upload', uploadFiles, uploadFile)
export default routerFile;