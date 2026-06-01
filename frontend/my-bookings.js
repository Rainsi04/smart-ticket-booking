document.addEventListener('DOMContentLoaded', async () => {
    if (!requireAuth()) {
        return;
    }

    const loadingEl = document.getElementById('bookingsLoading');
    const emptyEl = document.getElementById('bookingsEmpty');
    const listEl = document.getElementById('bookingsList');

    try {
        const response = await fetchWithAuth(`${API_URL}/bookings/my`);
        const data = await response.json();

        loadingEl.hidden = true;

        if (!data.success) {
            if (response.status === 401) {
                clearAuth();
                window.location.href = 'login.html?return=my-bookings.html';
                return;
            }
            listEl.innerHTML = `<p class="bookings-message error">${escapeHtml(data.message)}</p>`;
            return;
        }

        if (!data.data || data.data.length === 0) {
            emptyEl.hidden = false;
            return;
        }

        listEl.innerHTML = data.data.map(booking => renderBookingCard(booking)).join('');
    } catch (error) {
        loadingEl.hidden = true;
        listEl.innerHTML = '<p class="bookings-message error">Could not load bookings. Make sure the backend is running.</p>';
    }
});

function renderBookingCard(booking) {
    const date = new Date(booking.bookingDate).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
    const seats = Array.isArray(booking.seats) ? booking.seats.join(', ') : booking.seats;
    const genre = booking.movieId?.genre || '';

    return `
        <article class="booking-card">
            <div class="booking-card-header">
                <div>
                    <h3>${escapeHtml(booking.movieTitle)}</h3>
                    ${genre ? `<span class="booking-genre">${escapeHtml(genre)}</span>` : ''}
                </div>
                <span class="booking-id">${escapeHtml(booking.bookingId)}</span>
            </div>
            <div class="booking-card-body">
                <div class="booking-detail">
                    <span class="label">Date booked</span>
                    <span>${escapeHtml(date)}</span>
                </div>
                <div class="booking-detail">
                    <span class="label">Cinema</span>
                    <span>${escapeHtml(booking.cinemaName || booking.cinemaId?.name || '—')}${booking.city ? `, ${escapeHtml(booking.city)}` : ''}</span>
                </div>
                <div class="booking-detail">
                    <span class="label">Showtime</span>
                    <span>${escapeHtml(booking.showtime)}</span>
                </div>
                <div class="booking-detail">
                    <span class="label">Seats</span>
                    <span>${escapeHtml(seats)}</span>
                </div>
                <div class="booking-detail">
                    <span class="label">Total</span>
                    <span class="booking-total">₹${booking.total}</span>
                </div>
            </div>
        </article>
    `;
}
