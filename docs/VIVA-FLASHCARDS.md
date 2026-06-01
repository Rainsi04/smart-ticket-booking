# SmartTicket — 50 Viva Flashcards

> **How to use:** Cover the answer, read the question aloud, then check.

---

### 1
**Q:** What is SmartTicket?  
**A:** A full-stack web app for browsing movies, selecting cinemas/seats, and booking cinema tickets with smart seat recommendations.

---

### 2
**Q:** What architecture does it follow?  
**A:** 3-tier: Presentation (HTML/JS) → Application (Express API) → Data (MongoDB).

---

### 3
**Q:** Which port runs the backend?  
**A:** 5000 (default via `process.env.PORT || 5000`).

---

### 4
**Q:** Which port should the frontend use?  
**A:** 3000 (via `npx serve -p 3000`) — not opened as a local file.

---

### 5
**Q:** What is the API base URL?  
**A:** `http://localhost:5000/api`

---

### 6
**Q:** Name all backend dependencies.  
**A:** express, mongoose, bcryptjs, jsonwebtoken, dotenv, cors, express-validator.

---

### 7
**Q:** What is Mongoose?  
**A:** ODM (Object Data Modeling) library that maps JavaScript objects to MongoDB documents with schemas and validation.

---

### 8
**Q:** Why MongoDB over SQL?  
**A:** Flexible schema, JSON-like documents, easy arrays (seats, showtimes), fits the JavaScript stack for rapid development.

---

### 9
**Q:** How many collections/models exist?  
**A:** Four: User, Movie, Cinema, Booking.

---

### 10
**Q:** How is the password stored?  
**A:** Hashed with bcrypt (10 salt rounds) — never stored in plain text.

---

### 11
**Q:** When is the password hashed?  
**A:** In a Mongoose `pre('save')` hook before the user document is saved.

---

### 12
**Q:** What is `select: false` on the password field?  
**A:** Password is excluded from query results by default; login uses `.select('+password')` to include it.

---

### 13
**Q:** What is JWT?  
**A:** JSON Web Token — a signed token that proves user identity without server-side sessions.

---

### 14
**Q:** What is stored inside the JWT payload?  
**A:** `{ id: userId }` — the user's MongoDB ObjectId.

---

### 15
**Q:** How long does the token last?  
**A:** 30 days (`expiresIn: '30d'`).

---

### 16
**Q:** How is the token sent to the API?  
**A:** HTTP header: `Authorization: Bearer <token>`.

---

### 17
**Q:** Where is the token stored on the client?  
**A:** `localStorage` (key: `token`).

---

### 18
**Q:** Difference between `protect` and `optionalAuth`?  
**A:** `protect` rejects requests without a valid token. `optionalAuth` allows guests but attaches `req.user` if a valid token exists.

---

### 19
**Q:** Which route uses `optionalAuth`?  
**A:** `POST /api/bookings` — guests and logged-in users can both book.

---

### 20
**Q:** Which route uses `protect`?  
**A:** `GET /api/auth/me` and `GET /api/bookings/my`.

---

### 21
**Q:** Can a guest book tickets?  
**A:** Yes — they enter name and email in the booking modal; defaults are Guest User / guest@example.com.

---

### 22
**Q:** How is booking total calculated?  
**A:** `total = number of seats × movie.price` (on the server in `createBooking`).

---

### 23
**Q:** How is `bookingId` generated?  
**A:** Pre-save hook: `'BK-' + Date.now() + '-' + random(0–999)`.

---

### 24
**Q:** Why store `movieTitle` on the booking?  
**A:** Denormalization — booking stays readable even if the movie document is updated or deleted.

---

### 25
**Q:** What is `populate()` used for?  
**A:** In `getMyBookings`, it replaces `movieId` and `cinemaId` ObjectIds with full related documents.

---

### 26
**Q:** What does `GET /api/cinemas/cities` return?  
**A:** Distinct city names from active cinemas, sorted alphabetically.

---

### 27
**Q:** How do you filter cinemas by city?  
**A:** `GET /api/cinemas?city=Dehradun`

---

### 28
**Q:** Why is `/cities` registered before `/:id`?  
**A:** So Express does not treat `"cities"` as a MongoDB ObjectId parameter.

---

### 29
**Q:** Why is `GET /my` registered before `GET /:id`?  
**A:** So `"my"` is not interpreted as a booking ID.

---

### 30
**Q:** What is CORS?  
**A:** Cross-Origin Resource Sharing — lets the browser call the API on a different port (3000 → 5000). Enabled via `cors()` middleware.

---

### 31
**Q:** What is REST?  
**A:** Architectural style using HTTP methods on resource URLs; stateless; typically returns JSON.

---

### 32
**Q:** What is MVC in this project?  
**A:** Model = Mongoose schemas; View = HTML + JS DOM; Controller = `*Controller.js` files; Routes connect URLs to controllers.

---

### 33
**Q:** What makes the project "Smart"?  
**A:** `findBestSeats()` recommends optimal consecutive seats based on budget, seat count, and zone preference.

---

### 34
**Q:** Where does the smart algorithm run?  
**A:** Client-side in `frontend/booking.js` (not on the server).

---

### 35
**Q:** What are the seat zones?  
**A:** Rows A–B: front; C–F: middle; G–H: back; I–J: recliner.

---

### 36
**Q:** How many seats are in the layout?  
**A:** 10 rows × 12 columns = 120 seats.

---

### 37
**Q:** How are occupied seats determined?  
**A:** Frontend simulation (fixed positions + ~10% random) — not from the database.

---

### 38
**Q:** What is `localStorage` used for?  
**A:** token, user, selectedMovieId, selectedCity, currentBooking.

---

### 39
**Q:** What is `escapeHtml()` for?  
**A:** Prevents XSS by escaping `<`, `>`, `&`, quotes before inserting API data into the DOM.

---

### 40
**Q:** What does `seed.js` do?  
**A:** Connects to MongoDB, deletes all movies, inserts ~20 sample movies.

---

### 41
**Q:** What does `seedCinemas.js` do?  
**A:** Seeds cinemas (e.g. PVR, INOX in Dehradun).

---

### 42
**Q:** What is `dotenv` used for?  
**A:** Loads environment variables from `.env` (MONGODB_URI, JWT_SECRET, PORT).

---

### 43
**Q:** Default MongoDB connection string?  
**A:** `mongodb://localhost:27017/smartticket`

---

### 44
**Q:** What HTTP code is returned for wrong login?  
**A:** 401 Unauthorized — "Invalid email or password".

---

### 45
**Q:** What HTTP code is returned when a movie is not found?  
**A:** 404 Not Found.

---

### 46
**Q:** What is bcrypt's salt rounds value in this project?  
**A:** 10.

---

### 47
**Q:** Name all frontend pages.  
**A:** index (movies), booking, login, register, confirmation, my-bookings.

---

### 48
**Q:** What happens after a successful booking?  
**A:** Booking JSON saved to `localStorage.currentBooking` → redirect to `confirmation.html`.

---

### 49
**Q:** Name three limitations of the project.  
**A:** No payment gateway; no server-side seat locking; admin movie routes lack authentication.

---

### 50
**Q:** Name three future enhancements.  
**A:** Payment integration (Razorpay/Stripe); server-side seat availability; email/SMS with QR e-ticket.

---

*Good luck with your viva!*
