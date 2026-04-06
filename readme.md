# Finance Dashboard Backend

A **role-based backend system** for managing financial records and providing dashboard analytics.  
Built with **Node.js, Express, MongoDB**, following clean architecture and RBAC.

---

## Features

### Authentication & Authorization
- User registration with OTP verification
- Login with JWT (Access + Refresh Tokens)
- Cookie-based authentication
- Forgot & Reset password
- Change password
- Role-based access control (RBAC)

---

## User Roles

| Role     | Permissions                                  |
|----------|----------------------------------------------|
| Viewer   | Can only view dashboard data                 |
| Analyst  | Can view records and dashboard insights      |
| Admin    | Full access (CRUD + user management)         |

---

## Financial Records Management

- Create records (Admin only)
- Read records (Admin, Analyst)
- Update records (Admin only)
- Soft delete records (Admin only)

### Filters Supported:
- Type (income / expense)
- Category
- Pagination

---

## Dashboard APIs

- Total Income
- Total Expense
- Net Balance
- Category-wise totals
- Monthly trends

---

## Access Control (RBAC)

- Implemented via middleware (`allowRoles`)
- Enforced at route level

---

## Project Structure

```
src/
│
├── controllers/
├── routes/
├── middlewares/
├── models/
├── validators/
├── utils/
│
├── app.js
├── server.js
└── db.connect.js
```

---

## Tech Stack

- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- express-validator
- Nodemailer

---

## API Endpoints

### Auth Routes (`/api/v1/auth`)
- POST `/register`
- POST `/login`
- POST `/logout`
- POST `/change-password`
- POST `/forgot-password`
- POST `/reset-password/:token`
- POST `/verify/:userId/:otp`

---

### Admin Routes (`/api/v1/admins`)
- PATCH `/block-user/:id`
- PATCH `/unblock-user/:id`
- PATCH `/update-user-role/:id`

---

### Record Routes (`/api/v1/records`)
- POST `/create`
- GET `/get-records`
- PUT `/update/:id`
- DELETE `/delete/:id`

---

### Dashboard Routes (`/api/v1/dashboard`)
- GET `/summary`
- GET `/total-of-category`
- GET `/monthly-trends`

---

## Security Features

- Password hashing (bcrypt)
- Token hashing for reset password
- HTTP-only cookies
- Role-based authorization
- Input validation

---

## Design Decisions

### Shared Data Model
- Records are global (not user-specific)
- Admin manages data
- Analyst reads data
- Viewer only sees dashboard

### Soft Delete
- Records are not permanently deleted
- Uses `isDeleted` flag

---

## How to Run

### 1. Clone Repository
```bash
git clone <your-repo-url>
cd finance-dashboard-backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables

Create `.env` file:

```env
PORT=4000
DB_URI=your_mongodb_connection_string

ACCESS_TOKEN_SECRET=your_access_secret
REFRESH_TOKEN_SECRET=your_refresh_secret

BASE_URL=http://localhost:4000
CORS_ORIGIN=http://localhost:3000
```

### 4. Run Server
```bash
npm run dev
```

---

## Test Endpoint

```bash
GET /check-server
```

---

## Notes

- Do not use `*` in CORS when credentials are enabled
- Role is NOT taken from user during login (secure design)
- Viewer has access only to dashboard APIs
- Admin controls all data

---
