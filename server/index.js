import express from 'express';
import postRoutes from './routes/posts.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import cookieParser from 'cookie-parser';
import multer from 'multer';
// import mysql from 'mysql2';


const app = express();

app.use(express.json());
app.use(cookieParser());


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '../client/public/images');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});


const upload = multer({storage});
app.post('/server/upload', upload.single('file'), (req, res) => {
    console.log(req.file);
    res.send(req.file.filename);
});

app.use('/server/posts', postRoutes);
app.use('/server/auth', authRoutes);
app.use('/server/users', userRoutes);

app.listen(8800, () => {
    console.log('Server is running on port 8800');
    }
);


