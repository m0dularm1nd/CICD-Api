import express from 'express';

const app = express();

app.get('/', (_req, res) => {
  res.status(200).json({
    email: 'Hello from the other side!',
    password: 'for manar',
  });
});

app.get('/manar', (_req, res) => {
  res.status(200).json({
    email: 'test@manar.com',
    mshpassword: 'herewego',
  });
});

app.post('/', (_req, res) => {
  res.send('Checking check... nothing...');
});

app.post('/mohamed', (_req, res) => {
  res.send('Checking check... herewego...');
});

const port = 3000;
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
