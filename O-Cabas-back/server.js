import 'dotenv/config';
import debug from 'debug';
import express from 'express';
import router from './app/routers/index.js';
import cors from 'cors';

const logger = debug('api:initialization');

const app = express();
const PORT = process.env.PORT ?? 3333;

// Enable JSON format
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(cors(process.env.CORS_DOMAINS ?? '*'));

app.use("/api", router);



// Start the server
app.listen(PORT, () => {
    logger(`API launched on http://localhost:${PORT}/api`);
});
