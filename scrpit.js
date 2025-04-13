const clientId = 'YOUR_CLIENT_ID_HERE'; 
const redirectUri = 'https://thewebsite.com/callback.php'; 
const scopes = ['identify', 'email'];

const loginButton = document.getElementById('login-btn');

loginButton.addEventListener('click', () => {
  const discordUrl = `https://discord.com/api/oauth2/authorize` +
    `?client_id=${clientId}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&response_type=code` +
    `&scope=${scopes.join('%20')}`;

  window.location.href = discordUrl;
});