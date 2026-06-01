// API_URL is defined in auth.js

// Fetch movies from backend
async function fetchMovies() {
    const grid = document.getElementById('moviesGrid');
    try {
        const response = await fetch(`${API_URL}/movies`);
        const data = await response.json();
        
        if (data.success && data.data.length > 0) {
            displayMovies(data.data);
        } else if (data.success) {
            grid.innerHTML = '<p class="movies-empty">No movies in the database. Run <code>node seed.js</code> in the backend folder.</p>';
        } else {
            grid.innerHTML = `<p class="movies-empty error">Could not load movies: ${data.message || 'Unknown error'}</p>`;
        }
    } catch (error) {
        console.error('Error:', error);
        grid.innerHTML = `
            <p class="movies-empty error">
                Cannot reach the API at ${API_URL}.<br>
                Start the backend with <code>npm run dev</code> in the backend folder,<br>
                then open the site at <a href="http://localhost:3000">http://localhost:3000</a> (not as a local file).
            </p>`;
    }
}

// Modified displayMovies function
function displayMovies(moviesToShow) {
    const grid = document.getElementById('moviesGrid');
    if (!grid) return;
    
    grid.innerHTML = moviesToShow.map(movie => `
        <div class="movie-card" onclick="selectMovie('${movie._id}')">
            <div class="movie-poster" style="background-image: url('${escapeHtml(movie.poster)}')">
                <div class="movie-rating">⭐ ${movie.rating}</div>
            </div>
            <div class="movie-info">
                <h3>${escapeHtml(movie.title)}</h3>
                <div class="genre">${escapeHtml(movie.genre)}</div>
                <div class="synopsis">${escapeHtml(movie.synopsis.substring(0, 80))}...</div>
                <div class="movie-meta">
                    <span>⏱️ ${escapeHtml(movie.duration)}</span>
                    <span>💰 ₹${movie.price}</span>
                </div>
            </div>
        </div>
    `).join('');
}

function selectMovie(movieId) {
    // Store only the ID, fetch full details on booking page
    localStorage.setItem('selectedMovieId', movieId);
    window.location.href = 'booking.html';
}

async function loadCities() {
    const citySelect = document.getElementById('citySelect');
    if (!citySelect) return;

    try {
        const response = await fetch(`${API_URL}/cinemas/cities`);
        const data = await response.json();

        if (data.success && data.data.length > 0) {
            const savedCity = localStorage.getItem('selectedCity');
            citySelect.innerHTML = '<option value="">Choose your city...</option>' +
                data.data.map(city =>
                    `<option value="${escapeHtml(city)}"${city === savedCity ? ' selected' : ''}>${escapeHtml(city)}</option>`
                ).join('');

            citySelect.addEventListener('change', () => {
                if (citySelect.value) {
                    localStorage.setItem('selectedCity', citySelect.value);
                } else {
                    localStorage.removeItem('selectedCity');
                }
            });
        } else {
            citySelect.innerHTML = '<option value="">No cities available</option>';
        }
    } catch (error) {
        citySelect.innerHTML = '<option value="">Could not load cities</option>';
    }
}

// Load movies when page loads
document.addEventListener('DOMContentLoaded', () => {
    fetchMovies();
    loadCities();
    
    // Search functionality
    const searchInput = document.getElementById('movieSearch');
    if (searchInput) {
        searchInput.addEventListener('input', async (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const response = await fetch(`${API_URL}/movies`);
            const data = await response.json();
            
            if (data.success) {
                const filtered = data.data.filter(movie => 
                    movie.title.toLowerCase().includes(searchTerm) ||
                    movie.genre.toLowerCase().includes(searchTerm)
                );
                displayMovies(filtered);
            }
        });
    }
});