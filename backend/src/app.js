import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import routes from './routes/index.js';
import errorHandler from './middleware/error.middleware.js';
import connectDB from './config/database.js';

const app = express();

if (process.env.NODE_ENV !== "test") {
  connectDB();
}


app.use(express.json());
app.use(morgan('dev'));

app.use(
  cors({
    origin: 'http://localhost:3000', // your React app origin
    credentials: true, // allow cookies or auth headers
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.get('/healthz', (req, res) => res.send({ status: 'ok' }));

app.use('/api', routes);

app.use(errorHandler);

export default app;
