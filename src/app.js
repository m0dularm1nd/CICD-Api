import express from "express";
import cors from "cors";
import pool from "./db.js";
import path from "path";
import logHandling from "./middlewares/logHandler.js";
import errorHandling from "./middlewares/errorHandler.js";
import { WebSocket, WebSocketServer } from "ws";
import { createServer } from "http";

const __dirname = import.meta.dirname;

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ noServer: true }); // Change to noServer: true

// Add connection tracking set
const clients = new Set();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "DELETE"],
    allowedHeaders: ["Content-Type", "*"],
  }),
);

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use(logHandling);
app.use(errorHandling);

app.get("/", (req, res) => {
  res.status(200).sendFile(path.join(__dirname, "./public", "index.html"));
});

app.get("/setup", async (req, res) => {
  try {
    await pool.query(
      "CREATE TABLE wall( id SERIAL PRIMARY KEY, name VARCHAR(100), message VARCHAR(100))",
    );
    res.status(200).send({ message: "Successfully created table" });
  } catch (err) {}
});

app.get("/message", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM wall ORDER BY id DESC");
    res.status(200).send(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/message", async (req, res) => {
  res
    .status(400)
    .send({ message: "Please use WebSocket connection for messages" });
});

app.delete("/message/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM wall WHERE id = $1 RETURNING *",
      [id],
    );

    if (result.rowCount === 0) {
      return res.status(404).send({ error: "Message not found" });
    }

    res.status(200).send({ message: "Successfully deleted entry" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).send({ error: "Failed to delete message" });
  }
});

// Single upgrade handler
server.on("upgrade", (request, socket, head) => {
  try {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit("connection", ws, request);
    });
  } catch (err) {
    console.error("Upgrade error:", err);
    socket.destroy();
  }
});

// WebSocket connection handling
wss.on("connection", (ws) => {
  clients.add(ws);
  console.log(`Client connected. Total clients: ${clients.size}`);

  ws.on("message", async (data) => {
    const message = JSON.parse(data);

    try {
      if (message.type === "delete") {
        await pool.query("DELETE FROM wall WHERE id = $1", [message.id]);
      } else {
        await pool.query("INSERT INTO wall (name, message) VALUES ($1, $2)", [
          message.name,
          message.message,
        ]);
      }

      // Broadcast updated messages to all connected clients
      const result = await pool.query("SELECT * FROM wall ORDER BY id DESC");
      const messageData = JSON.stringify(result.rows);

      clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(messageData);
        }
      });
    } catch (err) {
      ws.send(JSON.stringify({ error: err.message }));
    }
  });

  ws.on("close", () => {
    clients.delete(ws);
    console.log(`Client disconnected. Total clients: ${clients.size}`);
  });

  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
    clients.delete(ws);
  });
});

// Update server creation
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
