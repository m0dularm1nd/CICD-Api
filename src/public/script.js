// WebSocket connection with protocol detection
const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
const wsUrl = `${protocol}//${window.location.host}`;
let ws = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;

function connectWebSocket() {
  ws = new WebSocket(wsUrl);

  ws.onopen = () => {
    console.log("Connected to WebSocket server");
    reconnectAttempts = 0;
    loadMessages();
  };

  ws.onclose = () => {
    console.log("WebSocket connection closed");
    if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
      reconnectAttempts++;
      console.log(`Reconnecting... Attempt ${reconnectAttempts}`);
      setTimeout(connectWebSocket, 3000);
    }
  };

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (Array.isArray(data)) {
      displayMessages(data);
    } else if (data.error) {
      console.error("Server error:", data.error);
    }
  };

  ws.onerror = (error) => {
    console.error("WebSocket error:", error);
  };
}

// Initialize connection
connectWebSocket();

// Update form submission to check connection
document.getElementById("messageForm").addEventListener("submit", function (e) {
  e.preventDefault();
  if (ws && ws.readyState === WebSocket.OPEN) {
    const name = document.getElementById("name").value;
    const message = document.getElementById("message").value;
    ws.send(JSON.stringify({ name, message }));
    document.getElementById("message").value = "";
  } else {
    console.error("WebSocket connection not available");
  }
});

async function deleteMessage(id) {
  try {
    ws.send(
      JSON.stringify({
        type: "delete",
        id: id,
      }),
    );
  } catch (error) {
    console.error("Error:", error);
  }
}

// Function to load messages
function loadMessages() {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ type: "get" }));
  }
}

// New function to display messages
function displayMessages(messages) {
  const messagesDiv = document.getElementById("messages");
  messagesDiv.innerHTML = messages
    .map(
      (msg) => `
      <div class="bg-gray-50 p-4 rounded-lg shadow-sm flex justify-between items-center">
        <div>
          <span class="text-2xl font-bold text-violet-400">${msg.name}:</span>
          <span class="text-2xl text-gray-700">${msg.message}</span>
        </div>
        <button onclick="deleteMessage(${msg.id})" 
          class="text-sm bg-pink-300 text-white px-2 py-2 rounded-md hover:bg-pink-600 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14">
            <path fill="currentColor" fill-rule="evenodd" d="M1.707.293A1 1 0 0 0 .293 1.707L5.586 7L.293 12.293a1 1 0 1 0 1.414 1.414L7 8.414l5.293 5.293a1 1 0 0 0 1.414-1.414L8.414 7l5.293-5.293A1 1 0 0 0 12.293.293L7 5.586z" clip-rule="evenodd"/>
          </svg>
        </button>
      </div>`,
    )
    .join("");
}
