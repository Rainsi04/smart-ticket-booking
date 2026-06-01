document.addEventListener('DOMContentLoaded', () => {
    // Get booking data from localStorage
    const booking = localStorage.getItem('currentBooking');
    
    if (!booking) {
        // If no booking found, redirect to home page
        alert('No booking found. Please book tickets first.');
        window.location.href = 'index.html';
        return;
    }
    
    try {
        const data = JSON.parse(booking);
        const detailsDiv = document.getElementById('ticketDetails');
        
        // Format date
        let formattedDate = data.bookingDate || data.date;
        if (formattedDate) {
            const dateObj = new Date(formattedDate);
            if (!isNaN(dateObj.getTime())) {
                formattedDate = dateObj.toLocaleDateString('en-US', { 
                    weekday: 'short', 
                    month: 'short', 
                    day: 'numeric',
                    year: 'numeric'
                });
            }
        } else {
            formattedDate = new Date().toLocaleDateString('en-US', { 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric' 
            });
        }
        
        // Format seats display
        const seatsDisplay = Array.isArray(data.seats) ? data.seats.join(', ') : data.seats;
        
        // Get movie title and genre
        const movieTitle = data.movieTitle || (data.movie ? data.movie.title : 'Unknown Movie');
        const movieGenre = data.movieGenre || (data.movie ? data.movie.genre : '');
        
        // Get showtime
        const showtime = data.showtime || 'Not specified';
        
        // Get total amount
        const totalAmount = data.total || 0;
        
        // Get booking ID
        const bookingId = data.bookingId || data._id || 'BK-' + Date.now();
        
        // Get customer name and email
        const customerName = data.customerName || 'Guest User';
        const customerEmail = data.customerEmail || 'guest@example.com';
        
        // Create the ticket details HTML
        detailsDiv.innerHTML = `
            <div class="detail-row">
                <div class="detail-label">MOVIE</div>
                <div class="detail-value">
                    <div class="movie-title">${escapeHtml(movieTitle)}</div>
                    <div class="movie-genre">${escapeHtml(movieGenre)}</div>
                </div>
            </div>
            <div class="detail-row">
                <div class="detail-label">CINEMA</div>
                <div class="detail-value">
                    <div>${escapeHtml(data.cinemaName || '—')}</div>
                    <div style="font-size: 12px; color: #888;">${escapeHtml(data.city || '')}</div>
                </div>
            </div>
            <div class="detail-row">
                <div class="detail-label">TIME</div>
                <div class="detail-value">${escapeHtml(showtime)}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">SEATS</div>
                <div class="detail-value">${escapeHtml(seatsDisplay)}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">BOOKING ID</div>
                <div class="detail-value">${escapeHtml(bookingId)}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">DATE</div>
                <div class="detail-value">${escapeHtml(formattedDate)}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">BOOKED BY</div>
                <div class="detail-value">
                    <div>${escapeHtml(customerName)}</div>
                    <div style="font-size: 12px; color: #888;">${escapeHtml(customerEmail)}</div>
                </div>
            </div>
            <div class="detail-row">
                <div class="detail-label">TOTAL PAID</div>
                <div class="detail-value total-amount">₹${totalAmount}</div>
            </div>
        `;
        
        const myBookingsLink = document.getElementById('myBookingsLink');
        if (myBookingsLink && typeof isLoggedIn === 'function' && isLoggedIn()) {
            myBookingsLink.style.display = 'inline-block';
        }
        
    } catch (error) {
        console.error('Error displaying booking:', error);
        const detailsDiv = document.getElementById('ticketDetails');
        if (detailsDiv) {
            detailsDiv.innerHTML = `
                <div class="detail-row">
                    <div class="detail-label">ERROR</div>
                    <div class="detail-value" style="color: #ff6b6b;">
                        There was an error loading your booking details. Please contact support.
                    </div>
                </div>
            `;
        }
    }
});

// Helper function to prevent XSS attacks
function escapeHtml(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}