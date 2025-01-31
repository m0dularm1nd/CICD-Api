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
const wss = new WebSocketServer({ noServer: true });

// Add connection tracking set
const clients = new Set();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "DELETE"],
    allowedHeaders: ["Content-Type"],
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
const logger = (type, action, details) => {
  console.log(`[${new Date().toISOString()}] [${type}] ${action}: ${details}`);
};

wss.on("connection", (ws) => {
  clients.add(ws);
  logger(
    "INFO",
    "CONNECTION",
    `New client connected. Total clients: ${clients.size}`,
  );

  ws.on("message", async (data) => {
    try {
      const message = JSON.parse(data);

      if (message.type === "get") {
        const result = await pool.query("SELECT * FROM wall ORDER BY id DESC");
        ws.send(JSON.stringify(result.rows));
        logger("INFO", "GET", `Retrieved ${result.rows.length} messages`);
      } else if (message.type === "delete") {
        await pool.query("DELETE FROM wall WHERE id = $1", [message.id]);
        const result = await pool.query("SELECT * FROM wall ORDER BY id DESC");
        clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(result.rows));
          }
        });
        logger("INFO", "DELETE", `Deleted message ID: ${message.id}`);
      } else {
        await pool.query("INSERT INTO wall (name, message) VALUES ($1, $2)", [
          message.name,
          message.message,
        ]);
        const result = await pool.query("SELECT * FROM wall ORDER BY id DESC");
        clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(result.rows));
          }
        });
        logger(
          "INFO",
          "INSERT",
          `New message from ${message.name}: ${message.message}`,
        );
      }
    } catch (err) {
      logger("ERROR", "OPERATION", err.message);
      ws.send(JSON.stringify({ error: err.message }));
    }
  });

  ws.on("close", () => {
    clients.delete(ws);
    logger(
      "INFO",
      "DISCONNECT",
      `Client disconnected. Total clients: ${clients.size}`,
    );
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
