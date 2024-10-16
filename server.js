import express, { urlencoded } from 'express';
import router from './routes';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use('/', router);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
