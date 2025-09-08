const urlParams = new URLSearchParams(window.location.search);
const serverId = urlParams.get('server') || 'Unknown';

const servers = {
  "1234567890": "Paradox",
  "9876543210": "Another Server"
};

const serverName = servers[serverId] || "Unknown Server";
document.getElementById('banner').textContent = `Overlay for ${serverName}`;
