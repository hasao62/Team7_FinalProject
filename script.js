const clientId = 'YOUR_CLIENT_ID'; // Replace this
const redirectUri = 'http://localhost:3000/Discord_Callback.php'; // Or your hosted callback
const scopes = ['identify'];

const loginButton = document.getElementById('login-btn');

loginButton.addEventListener('click', () => {
  const discordUrl = `https://discord.com/api/oauth2/authorize` +
    `?client_id=${clientId}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&response_type=code` +
    `&scope=${scopes.join('%20')}`;

  window.location.href = discordUrl;
});