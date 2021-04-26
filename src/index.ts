import { PORT } from './config';
import http from 'http';
import app from './app';
import { connectDB } from './db';
import { initSocketIO } from './sockets';

(async () => {
  if (process.env.ENV_MODE === 'dev') {
    console.log('In development mode');
  }

  // Connect to DB
  const db = await connectDB();
  console.log(`DB Connected to: ${db.databaseName}`);

  // Passing express to http - makes it available for socket.io and https in future
  const server = http.createServer(app);

  const io = initSocketIO(server);
  console.log(
    'SocketIO registered event listeners: ',
    io.eventNames(),
  );

  server.listen(PORT, () => console.log(`HTTP running: ${PORT}`));
})();
