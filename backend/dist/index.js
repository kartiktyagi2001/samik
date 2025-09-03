import express from 'express';
import { connectDatabase, disconnectDatabase } from './db.js';
const app = express();
const PORT = 3000;
app.use(express.json());
app.get('/', (req, res) => {
    res.send('Hello World!');
});
//server
(async () => {
    const isConnected = await connectDatabase();
    if (!isConnected)
        process.exit(1);
    const server = app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
    // Graceful shutdown
    process.on('SIGINT', async () => {
        console.log('🔌 Shutting down...');
        server.close(async () => {
            await disconnectDatabase();
            process.exit(0);
        });
    });
});
//# sourceMappingURL=index.js.map