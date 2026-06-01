const API_URL = 'http://localhost:5000/api';

function getToken() {
    return localStorage.getItem('token');
}

function getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
}

function saveAuth(token, user) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
}

function clearAuth() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
}

function isLoggedIn() {
    return !!getToken();
}

function authHeaders() {
    const headers = { 'Content-Type': 'application/json' };
    const token = getToken();
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
}

async function fetchWithAuth(url, options = {}) {
    const response = await fetch(url, {
        ...options,
        headers: {
            ...authHeaders(),
            ...(options.headers || {})
        }
    });
    return response;
}

function updateNav() {
    const nav = document.querySelector('header nav');
    if (!nav) return;

    const user = getUser();
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    let navHtml = `<a href="index.html" class="${currentPage === 'index.html' ? 'active' : ''}">Movies</a>`;
    navHtml += `<a href="my-bookings.html" class="${currentPage === 'my-bookings.html' ? 'active' : ''}">My Bookings</a>`;

    if (user) {
        navHtml += `<span class="nav-user">Hi, ${escapeHtml(user.name.split(' ')[0])}</span>`;
        navHtml += `<a href="#" id="logoutBtn" class="nav-logout">Logout</a>`;
    } else {
        navHtml += `<a href="login.html" class="${currentPage === 'login.html' ? 'active' : ''}">Login</a>`;
        navHtml += `<a href="register.html" class="nav-register ${currentPage === 'register.html' ? 'active' : ''}">Sign Up</a>`;
    }

    nav.innerHTML = navHtml;

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            clearAuth();
            window.location.href = 'index.html';
        });
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function requireAuth(redirectTo = 'login.html') {
    if (!isLoggedIn()) {
        const returnUrl = encodeURIComponent(window.location.pathname.split('/').pop());
        window.location.href = `${redirectTo}?return=${returnUrl}`;
        return false;
    }
    return true;
}

document.addEventListener('DOMContentLoaded', updateNav);
