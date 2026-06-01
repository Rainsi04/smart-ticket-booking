# SmartTicket — One-Page Viva Cheat Sheet

## Project at a Glance
| Item | Answer |
|------|--------|
| **Name** | SmartTicket — Smart Cinema Ticket Booking System |
| **Stack** | HTML/CSS/JS + Node.js + Express + MongoDB + Mongoose |
| **Architecture** | 3-tier: Client → REST API (:5000) → MongoDB |
| **USP** | Smart seat finder (budget + count + zone → best consecutive seats) |

## Tech Stack
**Backend:** Express, Mongoose, bcryptjs, jsonwebtoken, dotenv, cors  
**Frontend:** Vanilla JS, fetch API, localStorage  
**DB:** MongoDB (`smartticket` database)

## Collections (4)
| Model | Key Fields |
|-------|------------|
| **User** | name, email, password (hashed), createdAt |
| **Movie** | title, rating, genre, synopsis, duration, price, poster, showtimes[], isActive |
| **Cinema** | name, city, address, screens, isActive |
| **Booking** | userId?, movieId, movieTitle, cinemaId, cinemaName, city, showtime, seats[], total, bookingId, customerName/Email, bookingDate |

## API Endpoints (`http://localhost:5000/api`)
| Route | Methods | Auth |
|-------|---------|------|
| `/auth` | POST register, POST login, GET me | me = JWT required |
| `/movies` | GET all, GET :id, POST, PUT, DELETE | Public (admin unprotected) |
| `/cinemas` | GET /cities, GET ?city=, GET :id | Public |
| `/bookings` | GET /my, POST, GET, GET :id | /my = protect; POST = optionalAuth |

## Auth Flow
1. Register/Login → bcrypt verify/hash → JWT `{ id }` (30 days)
2. Frontend: `localStorage` → `Authorization: Bearer <token>`
3. **protect** = must login | **optionalAuth** = guest OK, attach user if token valid

## Booking Flow
`index` → pick movie → `booking` → city/cinema/showtime/seats → POST `/bookings` → `confirmation`  
**Total:** `seats.length × movie.price` (calculated on server)

## Smart Seat Algorithm (client-side)
Inputs: seat count, budget, zone (front/middle/back/recliner)  
→ `maxSeats = floor(budget/price)` → find consecutive seats in preferred zone → highlight

## Seat Layout
10 rows (A–J) × 12 cols | Zones: A–B front, C–F middle, G–H back, I–J recliner

## Run Project
```bash
# Backend
cd backend && npm install && node seed.js && npm run seed:cinemas && npm run dev

# Frontend
cd frontend && npx serve -p 3000
```

## Key Code Locations
| What | Where |
|------|-------|
| Server entry | `backend/server.js` |
| DB connect | `backend/config/database.js` |
| Password hash | `backend/models/User.js` (pre-save) |
| JWT middleware | `backend/middleware/auth.js` |
| Create booking | `backend/controllers/bookingController.js` |
| Smart seats | `frontend/booking.js` → `findBestSeats()` |
| Token storage | `frontend/auth.js` |

## HTTP Status Codes Used
200 OK · 201 Created · 400 Bad Request · 401 Unauthorized · 404 Not Found · 500 Error

## Limitations (say honestly)
- No payment gateway · Seats not locked on server · Occupied seats simulated on frontend · Admin routes unprotected · No email/SMS ticket

## Future Scope
Payment integration · Server-side seat availability · Admin panel · QR e-ticket · Email confirmation

## 30-Second Intro
*"SmartTicket is a full-stack cinema booking app. Users browse movies from MongoDB, select city/cinema/showtime, pick seats with our smart recommendation engine, and book via REST API. JWT + bcrypt handle auth; guests can book without login. Bookings get a unique ID and logged-in users see history on My Bookings."*
