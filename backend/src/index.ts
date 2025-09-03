import express from 'express';
import type{Request, Response} from 'express';  
import { connectDatabase, disconnectDatabase } from './db';
import groupRouter from './routes/groupRouter';
import aggregateRouter from './routes/aggregateRouter'
import cors from 'cors';

const app = express();
const PORT = 3000;

app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());

//test log
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

app.use('/api/groups', groupRouter);
app.use('/api/aggregate', aggregateRouter);



//health check
app.get('/health', (_req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

//err handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Server error:', err);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

//server
(async ()=>{
    const isConnected = await connectDatabase();
    if(!isConnected)
        process.exit(1);

    const server = app.listen(PORT, ()=>{
        console.log(`Server is running on port ${PORT}`);
    });

    // shutdown
    process.on('SIGINT', async () => {
        console.log('Shutting down...');
        server.close(async () => {
            await disconnectDatabase();
            process.exit(0);
        });
    });
}) ();
