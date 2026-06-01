let selectedMovie = null;
let selectedCinema = null;
let selectedShowtime = '12:00 PM';
let selectedSeats = [];
let allSeats = [];
let seatPrice = 12;

// Generate seats (10 rows x 12 columns with proper zones)
function generateSeats() {
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    const seats = [];
    
    for (let i = 0; i < rows.length; i++) {
        for (let j = 1; j <= 12; j++) {
            const seatId = `${rows[i]}${j}`;
            
            // Determine zone
            let zone = '';
            if (i <= 2) zone = 'front';
            else if (i <= 6) zone = 'middle';
            else if (i <= 8) zone = 'back';
            else zone = 'recliner';
            
            // Random occupied seats (10% occupied for demo)
            let isOccupied = false;
            if ((i === 3 && (j === 5 || j === 6)) || 
                (i === 4 && j === 8) || 
                (i === 7 && j === 3) ||
                (i === 9 && j === 10) ||
                Math.random() < 0.1) {
                isOccupied = true;
            }
            
            seats.push({
                id: seatId,
                rowIndex: i,
                rowLetter: rows[i],
                seatNumber: j,
                zone: zone,
                occupied: isOccupied,
                selected: false,
                recommended: false,
                price: seatPrice
            });
        }
    }
    return seats;
}

// Render seats by sections
function renderSeats() {
    const container = document.getElementById('seatingSections');
    if (!container) return;
    
    const sections = {
        front: { seats: allSeats.filter(s => s.zone === 'front'), label: 'FRONT', class: 'front' },
        middle: { seats: allSeats.filter(s => s.zone === 'middle'), label: 'MIDDLE', class: 'middle' },
        back: { seats: allSeats.filter(s => s.zone === 'back'), label: 'BACK', class: 'back' },
        recliner: { seats: allSeats.filter(s => s.zone === 'recliner'), label: 'RECLINER', class: 'recliner' }
    };
    
    let html = '';
    
    for (let [key, section] of Object.entries(sections)) {
        if (section.seats.length === 0) continue;
        
        // Sort seats by row and number
        const sortedSeats = [...section.seats].sort((a, b) => {
            if (a.rowIndex !== b.rowIndex) return a.rowIndex - b.rowIndex;
            return a.seatNumber - b.seatNumber;
        });
        
        html += `<div class="seat-section">`;
        html += `<div class="section-label ${section.class}">${section.label}</div>`;
        html += `<div class="seats-grid">`;
        
        sortedSeats.forEach(seat => {
            let additionalClass = '';
            if (seat.zone === 'front') additionalClass = 'front-seat';
            else if (seat.zone === 'middle') additionalClass = 'middle-seat';
            else if (seat.zone === 'back') additionalClass = 'back-seat';
            else if (seat.zone === 'recliner') additionalClass = 'recliner-seat';
            
            let stateClass = '';
            if (seat.occupied) stateClass = 'occupied';
            else if (seat.selected) stateClass = 'selected';
            else if (seat.recommended) stateClass = 'recommended';
            else stateClass = 'available';
            
            html += `<div class="seat ${additionalClass} ${stateClass}" data-seat-id="${seat.id}" data-zone="${seat.zone}">
                        ${seat.seatNumber}
                    </div>`;
        });
        
        html += `</div></div>`;
    }
    
    container.innerHTML = html;
    
    // Attach click events
    document.querySelectorAll('.seat').forEach(seatDiv => {
        const seatId = seatDiv.dataset.seatId;
        const seat = allSeats.find(s => s.id === seatId);
        if (!seat || seat.occupied) return;
        
        seatDiv.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleSeat(seatId);
        });
    });
}

function toggleSeat(seatId) {
    const seat = allSeats.find(s => s.id === seatId);
    if (!seat || seat.occupied) return;
    
    const seatCount = parseInt(document.getElementById('seatCount').value);
    
    if (seat.selected) {
        seat.selected = false;
        selectedSeats = selectedSeats.filter(s => s.id !== seat.id);
    } else {
        if (selectedSeats.length >= seatCount) {
            // Visual feedback instead of alert
            const seatCountInput = document.getElementById('seatCount');
            seatCountInput.style.border = '2px solid #ff6b6b';
            setTimeout(() => {
                seatCountInput.style.border = '';
            }, 1000);
            return;
        }
        seat.selected = true;
        selectedSeats.push(seat);
    }
    
    // Clear recommendations when manually selecting
    if (!seat.selected) {
        allSeats.forEach(s => s.recommended = false);
    }
    
    updateSummary();
    renderSeats();
    document.getElementById('confirmBookingBtn').disabled = selectedSeats.length === 0;
}

function updateSummary() {
    const total = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
    const cityEl = document.getElementById('summaryCity');
    const cinemaEl = document.getElementById('summaryCinema');
    if (cityEl) cityEl.innerText = selectedCinema ? selectedCinema.city : '-';
    if (cinemaEl) cinemaEl.innerText = selectedCinema ? selectedCinema.name : '-';
    document.getElementById('summaryShowtime').innerText = selectedShowtime;
    document.getElementById('summarySeats').innerText = selectedSeats.length > 0 ? 
        selectedSeats.map(s => s.id).join(', ') : 'None selected';
    document.getElementById('summaryTotal').innerText = total;
}

async function loadCities() {
    const citySelect = document.getElementById('citySelect');
    if (!citySelect) return;

    try {
        const response = await fetch(`${API_URL}/cinemas/cities`);
        const data = await response.json();

        if (data.success) {
            const savedCity = localStorage.getItem('selectedCity');
            citySelect.innerHTML = '<option value="">Choose city...</option>' +
                data.data.map(city =>
                    `<option value="${escapeHtml(city)}"${city === savedCity ? ' selected' : ''}>${escapeHtml(city)}</option>`
                ).join('');

            if (savedCity && data.data.includes(savedCity)) {
                await loadCinemasForCity(savedCity);
            }
        }
    } catch (error) {
        console.error('Error loading cities:', error);
    }
}

async function loadCinemasForCity(city) {
    const cinemaSelect = document.getElementById('cinemaSelect');
    const addressEl = document.getElementById('cinemaAddress');
    selectedCinema = null;
    updateSummary();

    if (!city) {
        cinemaSelect.innerHTML = '<option value="">Choose cinema...</option>';
        cinemaSelect.disabled = true;
        if (addressEl) addressEl.textContent = '';
        return;
    }

    try {
        const response = await fetch(`${API_URL}/cinemas?city=${encodeURIComponent(city)}`);
        const data = await response.json();

        if (data.success && data.data.length > 0) {
            cinemaSelect.disabled = false;
            cinemaSelect.innerHTML = '<option value="">Choose cinema...</option>' +
                data.data.map(cinema =>
                    `<option value="${cinema._id}">${escapeHtml(cinema.name)} (${cinema.screens} screens)</option>`
                ).join('');
            cinemaSelect.dataset.cinemas = JSON.stringify(data.data);
        } else {
            cinemaSelect.disabled = true;
            cinemaSelect.innerHTML = '<option value="">No cinemas in this city</option>';
        }
        if (addressEl) addressEl.textContent = '';
    } catch (error) {
        console.error('Error loading cinemas:', error);
    }
}

function onCinemaChange(cinemaId) {
    const cinemaSelect = document.getElementById('cinemaSelect');
    const addressEl = document.getElementById('cinemaAddress');

    if (!cinemaId || !cinemaSelect.dataset.cinemas) {
        selectedCinema = null;
        if (addressEl) addressEl.textContent = '';
        updateSummary();
        return;
    }

    const cinemas = JSON.parse(cinemaSelect.dataset.cinemas);
    selectedCinema = cinemas.find(c => c._id === cinemaId) || null;

    if (addressEl && selectedCinema) {
        addressEl.textContent = `📍 ${selectedCinema.address}`;
    }
    updateSummary();
}

// Smart Recommendation Algorithm
function findBestSeats() {
    // Clear previous recommendations
    allSeats.forEach(seat => seat.recommended = false);
    
    const seatCount = parseInt(document.getElementById('seatCount').value);
    const budget = parseInt(document.getElementById('budget').value);
    const preference = document.getElementById('seatPreference').value;
    
    const maxBudgetSeats = Math.floor(budget / seatPrice);
    const finalSeatCount = Math.min(seatCount, maxBudgetSeats);
    
    // Visual feedback for budget issues
    if (finalSeatCount === 0) {
        const budgetInput = document.getElementById('budget');
        budgetInput.style.border = '2px solid #ff6b6b';
        setTimeout(() => {
            budgetInput.style.border = '';
        }, 1500);
        
        const findBtn = document.getElementById('findBestBtn');
        const originalText = findBtn.textContent;
        findBtn.textContent = '⚠️ Budget too low!';
        findBtn.style.background = '#ff6b6b';
        setTimeout(() => {
            findBtn.textContent = originalText;
            findBtn.style.background = '';
        }, 1500);
        renderSeats();
        return;
    }
    
    // Visual feedback for adjusted seat count
    if (finalSeatCount < seatCount) {
        const findBtn = document.getElementById('findBestBtn');
        const originalText = findBtn.textContent;
        findBtn.textContent = `✨ Only ${finalSeatCount} seat(s) affordable`;
        findBtn.style.background = '#ffb347';
        setTimeout(() => {
            findBtn.textContent = originalText;
            findBtn.style.background = '';
        }, 2000);
    }
    
    // Define preferred zones
    let preferredZones = [];
    switch(preference) {
        case 'front':
            preferredZones = ['front'];
            break;
        case 'middle':
            preferredZones = ['middle'];
            break;
        case 'back':
            preferredZones = ['back'];
            break;
        case 'recliner':
            preferredZones = ['recliner'];
            break;
    }
    
    // Find available seats
    let availableSeats = allSeats.filter(seat => !seat.occupied && !seat.selected);
    
    // Try each preferred zone
    let bestGroup = [];
    
    for (let zone of preferredZones) {
        const zoneSeats = availableSeats.filter(seat => seat.zone === zone);
        
        if (zoneSeats.length >= finalSeatCount) {
            // Try to find consecutive seats
            const rowsMap = new Map();
            zoneSeats.forEach(seat => {
                if (!rowsMap.has(seat.rowIndex)) rowsMap.set(seat.rowIndex, []);
                rowsMap.get(seat.rowIndex).push(seat);
            });
            
            for (let [rowIndex, rowSeats] of rowsMap) {
                rowSeats.sort((a, b) => a.seatNumber - b.seatNumber);
                
                for (let i = 0; i <= rowSeats.length - finalSeatCount; i++) {
                    let isConsecutive = true;
                    for (let k = 1; k < finalSeatCount; k++) {
                        if (rowSeats[i + k].seatNumber !== rowSeats[i].seatNumber + k) {
                            isConsecutive = false;
                            break;
                        }
                    }
                    if (isConsecutive) {
                        bestGroup = rowSeats.slice(i, i + finalSeatCount);
                        break;
                    }
                }
                if (bestGroup.length > 0) break;
            }
            
            if (bestGroup.length === 0) {
                bestGroup = zoneSeats.slice(0, finalSeatCount);
            }
            
            if (bestGroup.length > 0) break;
        }
    }
    
    if (bestGroup.length === 0) {
        bestGroup = availableSeats.slice(0, finalSeatCount);
    }
    
    if (bestGroup.length === 0) {
        const findBtn = document.getElementById('findBestBtn');
        const originalText = findBtn.textContent;
        findBtn.textContent = '❌ No seats available!';
        findBtn.style.background = '#ff6b6b';
        setTimeout(() => {
            findBtn.textContent = originalText;
            findBtn.style.background = '';
        }, 1500);
        renderSeats();
        return;
    }
    
    // Mark recommended seats
    bestGroup.forEach(seat => {
        const originalSeat = allSeats.find(s => s.id === seat.id);
        if (originalSeat) originalSeat.recommended = true;
    });
    
    renderSeats();
    
    const findBtn = document.getElementById('findBestBtn');
    const originalText = findBtn.textContent;
    findBtn.textContent = `✨ ${bestGroup.length} seat(s) highlighted!`;
    findBtn.style.background = '#4ecdc4';
    setTimeout(() => {
        findBtn.textContent = originalText;
        findBtn.style.background = '';
    }, 2000);
}

// Show Modal for Name and Email
function showBookingModal() {
    if (!selectedCinema) {
        const citySelect = document.getElementById('citySelect');
        const cinemaSelect = document.getElementById('cinemaSelect');
        if (citySelect) citySelect.style.border = '2px solid #ff6b6b';
        if (cinemaSelect) cinemaSelect.style.border = '2px solid #ff6b6b';
        setTimeout(() => {
            if (citySelect) citySelect.style.border = '';
            if (cinemaSelect) cinemaSelect.style.border = '';
        }, 1500);
        return;
    }

    if (selectedSeats.length === 0) {
        const confirmBtn = document.getElementById('confirmBookingBtn');
        confirmBtn.style.background = '#ff6b6b';
        confirmBtn.textContent = '⚠️ Select seats first!';
        setTimeout(() => {
            confirmBtn.style.background = '#4ecdc4';
            confirmBtn.textContent = 'Confirm Booking';
        }, 1500);
        return;
    }
    
    // Update modal with booking summary
    const total = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
    const modalSummary = document.getElementById('modalBookingSummary');
    modalSummary.innerHTML = `
        <p><strong>🎬 ${selectedMovie.title}</strong></p>
        <p>📍 ${selectedCinema.city} — ${selectedCinema.name}</p>
        <p>🕐 ${selectedShowtime}</p>
        <p>💺 Seats: ${selectedSeats.map(s => s.id).join(', ')}</p>
        <p>💰 Total: <span class="total-amount-modal">₹${total}</span></p>
    `;
    
    const user = getUser();
    const guestFields = document.getElementById('guestFields');
    const loggedInNotice = document.getElementById('loggedInNotice');

    if (user) {
        guestFields.hidden = true;
        loggedInNotice.hidden = false;
        loggedInNotice.textContent = `Booking as ${user.name} (${user.email})`;
    } else {
        guestFields.hidden = false;
        loggedInNotice.hidden = true;
        document.getElementById('customerName').value = '';
        document.getElementById('customerEmail').value = '';
        document.getElementById('customerName').classList.remove('error');
        document.getElementById('customerEmail').classList.remove('error');
    }
    
    // Show modal
    const modal = document.getElementById('bookingModal');
    modal.style.display = 'block';
    
    if (!user) {
        setTimeout(() => {
            document.getElementById('customerName').focus();
        }, 100);
    }
}

// Close Modal
function closeModal() {
    const modal = document.getElementById('bookingModal');
    modal.style.display = 'none';
}

// Create booking with name and email
async function processBooking() {
    const user = getUser();
    const bookingData = {
        movieId: selectedMovie._id,
        cinemaId: selectedCinema._id,
        showtime: selectedShowtime,
        seats: selectedSeats.map(s => s.id)
    };

    if (!user) {
        const name = document.getElementById('customerName').value.trim();
        const email = document.getElementById('customerEmail').value.trim();
        
        let isValid = true;
        
        if (!name) {
            document.getElementById('customerName').classList.add('error');
            isValid = false;
        } else {
            document.getElementById('customerName').classList.remove('error');
        }
        
        if (!email) {
            document.getElementById('customerEmail').classList.add('error');
            isValid = false;
        } else if (!email.includes('@') || !email.includes('.')) {
            document.getElementById('customerEmail').classList.add('error');
            isValid = false;
        } else {
            document.getElementById('customerEmail').classList.remove('error');
        }
        
        if (!isValid) {
            return;
        }

        bookingData.customerName = name;
        bookingData.customerEmail = email;
    }
    
    try {
        const confirmBtn = document.getElementById('confirmBookingModalBtn');
        confirmBtn.textContent = 'Processing...';
        confirmBtn.disabled = true;
        
        const response = await fetchWithAuth(`${API_URL}/bookings`, {
            method: 'POST',
            body: JSON.stringify(bookingData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            localStorage.setItem('currentBooking', JSON.stringify(data.data));
            closeModal();
            window.location.href = 'confirmation.html';
        } else {
            confirmBtn.textContent = 'Confirm & Pay';
            confirmBtn.disabled = false;
            alert('Booking failed: ' + data.message);
        }
    } catch (error) {
        console.error('Error creating booking:', error);
        const confirmBtn = document.getElementById('confirmBookingModalBtn');
        confirmBtn.textContent = 'Confirm & Pay';
        confirmBtn.disabled = false;
        alert('Error creating booking. Please make sure the backend server is running.');
    }
}

// Fetch movie details by ID
async function fetchMovieDetails(movieId) {
    try {
        const response = await fetch(`${API_URL}/movies/${movieId}`);
        const data = await response.json();
        
        if (data.success) {
            selectedMovie = data.data;
            seatPrice = selectedMovie.price;
            
            const header = document.getElementById('movieInfoHeader');
            header.innerHTML = `
                <h2>${selectedMovie.title}</h2>
                <p>⭐ ${selectedMovie.rating} | ${selectedMovie.genre} | ${selectedMovie.duration} | 🎟️ ₹${seatPrice}/seat</p>
            `;
            
            allSeats = generateSeats();
            renderSeats();
            updateSummary();
        } else {
            console.error('Error fetching movie:', data.message);
            const header = document.getElementById('movieInfoHeader');
            header.innerHTML = `
                <h2>Error Loading Movie</h2>
                <p style="color: #ff6b6b;">Could not load movie details. Please go back and try again.</p>
            `;
        }
    } catch (error) {
        console.error('Error fetching movie:', error);
        const header = document.getElementById('movieInfoHeader');
        header.innerHTML = `
            <h2>Connection Error</h2>
            <p style="color: #ff6b6b;">Cannot connect to server. Make sure backend is running on port 5000.</p>
        `;
    }
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    const movieId = localStorage.getItem('selectedMovieId');
    loadCities();

    const citySelect = document.getElementById('citySelect');
    const cinemaSelect = document.getElementById('cinemaSelect');

    if (citySelect) {
        citySelect.addEventListener('change', (e) => {
            localStorage.setItem('selectedCity', e.target.value);
            loadCinemasForCity(e.target.value);
        });
    }

    if (cinemaSelect) {
        cinemaSelect.addEventListener('change', (e) => onCinemaChange(e.target.value));
    }

    if (movieId) {
        fetchMovieDetails(movieId);
    } else {
        const header = document.getElementById('movieInfoHeader');
        header.innerHTML = `
            <h2>No Movie Selected</h2>
            <p>Please go back to the <a href="index.html" style="color: #4ecdc4;">movies page</a> and select a movie.</p>
        `;
    }
    
    // Showtime buttons
    const showtimeBtns = document.querySelectorAll('.showtime-btn');
    showtimeBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            showtimeBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            selectedShowtime = e.target.dataset.time;
            updateSummary();
        });
    });
    
    if (showtimeBtns.length > 0) {
        showtimeBtns[0].classList.add('active');
    }
    
    // Find Best Seats button
    const findBestBtn = document.getElementById('findBestBtn');
    if (findBestBtn) {
        findBestBtn.addEventListener('click', findBestSeats);
    }
    
    // Confirm Booking button - Show Modal
    const confirmBtn = document.getElementById('confirmBookingBtn');
    if (confirmBtn) {
        confirmBtn.addEventListener('click', showBookingModal);
    }
    
    // Modal event listeners
    const modal = document.getElementById('bookingModal');
    const closeBtn = document.querySelector('.close-modal');
    const cancelBtn = document.getElementById('cancelBookingBtn');
    const confirmModalBtn = document.getElementById('confirmBookingModalBtn');
    
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
    if (confirmModalBtn) confirmModalBtn.addEventListener('click', processBooking);
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Enter key in inputs
    const nameInput = document.getElementById('customerName');
    const emailInput = document.getElementById('customerEmail');
    
    if (nameInput) {
        nameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') emailInput.focus();
        });
    }
    
    if (emailInput) {
        emailInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') processBooking();
        });
    }
    
    // Seat count change handler
    const seatCountInput = document.getElementById('seatCount');
    if (seatCountInput) {
        seatCountInput.addEventListener('change', () => {
            selectedSeats.forEach(seat => {
                const s = allSeats.find(se => se.id === seat.id);
                if (s) s.selected = false;
            });
            selectedSeats = [];
            allSeats.forEach(seat => seat.recommended = false);
            renderSeats();
            updateSummary();
            document.getElementById('confirmBookingBtn').disabled = true;
        });
    }
    
    // Budget input validation
    const budgetInput = document.getElementById('budget');
    if (budgetInput) {
        budgetInput.addEventListener('input', () => {
            budgetInput.style.border = '';
        });
    }
});