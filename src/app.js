import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import routes from './routes/index.js';
import errorHandler from './middleware/error.middleware.js';

const app = express();

app.use(express.json());
app.use(morgan('dev'));
app.use(cors());

app.get('/healthz', (req, res) => res.send({ status: 'ok' }));

app.use('/api', routes);

app.use(errorHandler);

export default app;