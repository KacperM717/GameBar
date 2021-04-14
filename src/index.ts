import './util/secrets';
import http from 'http';
import app from './app';

if (process.env.ENV_MODE === 'dev') {
  console.log('In development mode');
}

// Passing express to http - makes it available for socket.io and https in future
const server = http.createServer(app);

server.listen(app.get('port'), () => {
  console.log(`App is running on port ${app.get('port')}`);
});

export default server;
