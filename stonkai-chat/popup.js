const messagesEl = document.getElementById('messages');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const saveBtn = document.getElementById('saveBtn');
const gatewayUrlInput = document.getElementById('gatewayUrl');
const tokenInput = document.getElementById('token');
const statusEl = document.getElementById('status');

let config = { gatewayUrl: '', token: '' };

// Load saved config
chrome.storage.local.get(['gatewayUrl', 'token'], (result) => {
  config.gatewayUrl = result.gatewayUrl || 'http://localhost:3000';
  config.token = result.token || '';
  gatewayUrlInput.value = config.gatewayUrl;
  tokenInput.value = config.token;
  updateStatus(config.token ? 'Ready to chat' : 'Enter gateway URL and token');
});

saveBtn.addEventListener('click', () => {
  config.gatewayUrl = gatewayUrlInput.value.trim();
  config.token = tokenInput.value.trim();
  
  chrome.storage.local.set({
    gatewayUrl: config.gatewayUrl,
    token: config.token
  }, () => {
    updateStatus('Settings saved!');
  });
});

sendBtn.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendMessage();
});

function updateStatus(text) {
  statusEl.textContent = text;
}

function addMessage(text, sender) {
  const div = document.createElement('div');
  div.className = `message ${sender}`;
  div.textContent = text;
  messagesEl.appendChild(div);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

async function sendMessage() {
  const text = messageInput.value.trim();
  if (!text) return;
  if (!config.token) {
    updateStatus('Please save your gateway URL and token first');
    return;
  }
  
  addMessage(text, 'user');
  messageInput.value = '';
  sendBtn.disabled = true;
  
  try {
    const response = await fetch(`${config.gatewayUrl}/api/v1/sessions/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.token}`
      },
      body: JSON.stringify({
        message: text,
        sessionKey: 'webchat'
      })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    addMessage(data.response || data.message || 'Message sent!', 'assistant');
    
  } catch (err) {
    addMessage(`Error: ${err.message}. Make sure OpenClaw gateway is running.`, 'assistant');
    updateStatus('Connection failed');
  } finally {
    sendBtn.disabled = false;
    messageInput.focus();
  }
}