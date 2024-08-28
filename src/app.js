import express from 'express';

const app = express();

app.get('/', (_req, res) => {
  res.status(200).json({
    email: 'Hello from the other side!',
    password: 'you know what it is, yes?',
  });
});

app.post('/', (_req, res) => {
  res.send('Checking check... nothing...');
});

const port = 3000;
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
