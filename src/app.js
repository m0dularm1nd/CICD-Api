import express from 'express';

const app = express();

app.get('/', (_req, res) => {
  res.status(200).json({
    message: 'Hello from the other side',
    user: 'Express.js Backend server',
    request: 'json response',
    email: 'here@V3il.com',
    password: 'notpassword',
    customImage: "nexus",
    color: "sky",
    shape: "pyramid",
    image: "🔮"
  });
});

app.get('/anotherendpoint', (_req, res) => {
  res.status(200).json({
    email: 'here@v3il.xyz',
    token: 'test',
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
