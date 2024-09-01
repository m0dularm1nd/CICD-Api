import express from 'express';

const app = express();

app.get('/', (_req, res) => {
  res.status(200).json({
    message: 'Hello from the other side 👽',
    user: 'Username 👑',
    email: 'hena@manar.com',
    password: 'pass',
  });
});

app.get('/anotherendpoint', (_req, res) => {
  res.status(200).json({
    email: 'hena@here.com',
    mshpassword: 'test',
  });
});

// app.post('/', (_req, res) => {
//   res.send('Checking check...');
// });
//
// app.post('/postcheck', (_req, res) => {
//   res.send('Checking check... hmmmmmmmmm...');
// });

const port = 3000;
app.listen(port, () => {
  console.log(`healty...`);
});
