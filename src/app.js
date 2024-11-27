import express from 'express';

const app = express();

app.use((_req, res, next) => {
  let send = res.send;
  res.send = c => {
    console.log(`Code: ${res.statusCode}`);
    console.log("Body: ", c);
    res.send = send;
    return res.send(c);
  }
  next();
});

app.get('/', (_req, res) => {
  res.status(200).json({
    message: '?multibranchagain',
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

app.post('/', (_req, res) => {
  res.send('yes...');
});

app.post('/postcheck', (_req, res) => {
  res.send('🔮 Checking check...');
});

const port = 3000;
app.listen(port, () => {
  console.log(`Up and Runing...\n |︻デ═一----------------------------------`);
});
