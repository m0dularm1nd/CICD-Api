import express from 'express';

const app = express();

app.get('/', (_req, res) => {
  res.status(200).json({
    message: 'Hello from the other side 👽',
    user: 'Manar 👑',
    email: 'hena@manar.com',
    mshpassword: '☠️',
  });
});

app.get('/manar', (_req, res) => {
  res.status(200).json({
    email: 'hena@manar.com',
    mshpassword: 'herewego',
  });
});

// app.post('/', (_req, res) => {
//   res.send('Checking check...');
// });
//
// app.post('/mohamed', (_req, res) => {
//   res.send('Checking check... hmmmmmmmmm...');
// });

const port = 3000;
app.listen(port, () => {
  console.log(`healty...`);
});
