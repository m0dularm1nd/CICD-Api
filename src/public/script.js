const ws = new WebSocket(`ws://${window.location.host}`);

ws.onopen = () => {
  console.log("Connected to WebSocket server");
};

ws.onmessage = (event) => {
  const messages = JSON.parse(event.data);
  displayMessages(messages);
};

ws.onerror = (error) => {
  console.error("WebSocket error:", error);
};

loadMessages();

// Handle form submission
document.getElementById("messageForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const message = document.getElementById("message").value;

  ws.send(JSON.stringify({ name, message }));

  document.getElementById("message").value = "";
});

async function deleteMessage(id) {
  try {
    const response = await fetch(`/message/${id}`, {
      method: "DELETE",
    });
    if (response.ok) {
      loadMessages();
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

// Function to load messages
async function loadMessages() {
  try {
    const response = await fetch("/message");
    const messages = await response.json();
    displayMessages(messages);
  } catch (error) {
    console.error("Error:", error);
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
              <span class="font-bold text-violet-400">${msg.name}:</span>
              <span class="text-gray-700">${msg.message}</span>
          </div>
          <button onclick="deleteMessage(${msg.id})" 
              class="text-sm bg-pink-300 text-white px-2 py-2 rounded-md hover:bg-pink-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14">
	<path fill="currentColor" fill-rule="evenodd" d="M1.707.293A1 1 0 0 0 .293 1.707L5.586 7L.293 12.293a1 1 0 1 0 1.414 1.414L7 8.414l5.293 5.293a1 1 0 0 0 1.414-1.414L8.414 7l5.293-5.293A1 1 0 0 0 12.293.293L7 5.586z" clip-rule="evenodd" />
</svg>
          </button>
      </div>`,
    )
    .join("");
}
