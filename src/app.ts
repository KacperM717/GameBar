import express from 'express';

const app = express();

// Express configuration
console.log(process.env.APP_PORT);
app.set('port', process.env.APP_PORT || 5500);

app.get('/', (req, res) => {
  res.send('Hello');
});

export default app;
