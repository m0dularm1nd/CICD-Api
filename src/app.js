import express from 'express';
import cors from 'cors';
import pool from './db.js';
import path from 'path';
import logHandling from './middlewares/logHandler.js';
import errorHandling from './middlewares/errorHandler.js';

const __dirname = import.meta.dirname;

const app = express();

app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type'],
  })
);

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(logHandling);
app.use(errorHandling);

app.get('/', (req, res) => {
  res.status(200).sendFile(path.join(__dirname, './public', 'index.html'));
});

app.get('/setup', async (req, res) => {
  try {
    await pool.query(
      'CREATE TABLE wall( id SERIAL PRIMARY KEY, name VARCHAR(100), message VARCHAR(100))'
    );
    res.status(200).send({ message: 'Successfully created table' });
  } catch (err) {}
});

app.get('/message', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM wall ORDER BY id DESC');
    res.status(200).send(result.rows);
  } catch (err) {}
});

app.post('/message', async (req, res) => {
  const { name, message } = req.body;
  try {
    await pool.query('INSERT INTO wall (name, message) VALUES ($1, $2)', [
      name,
      message,
    ]);
    res.status(200).send({ message: 'Successfully added new entry' });
  } catch (err) {
    // console.log(err);
    // res.sendStatus(500);
  }
});

app.delete('/message/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'DELETE FROM wall WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).send({ error: 'Message not found' });
    }

    res.status(200).send({ message: 'Successfully deleted entry' });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).send({ error: 'Failed to delete message' });
  }
});

const port = 3000;
app.listen(port, () => {
  console.log(`Up and Runing...\n|︻デ═一---\n`);
});
