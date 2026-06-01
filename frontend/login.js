document.addEventListener('DOMContentLoaded', () => {
    if (isLoggedIn()) {
        redirectAfterLogin();
        return;
    }

    const form = document.getElementById('loginForm');
    const errorEl = document.getElementById('loginError');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorEl.hidden = true;

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Logging in...';

        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (data.success) {
                saveAuth(data.token, data.data);
                redirectAfterLogin();
            } else {
                errorEl.textContent = data.message || 'Login failed';
                errorEl.hidden = false;
            }
        } catch (error) {
            errorEl.textContent = 'Cannot connect to server. Is the backend running?';
            errorEl.hidden = false;
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Log In';
        }
    });
});

function redirectAfterLogin() {
    const params = new URLSearchParams(window.location.search);
    const returnPage = params.get('return') || 'index.html';
    window.location.href = returnPage;
}
