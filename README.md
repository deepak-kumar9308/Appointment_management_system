# DocPanel - Doctor Appointment System

A production-tier MERN stack application featuring Role-Based Access Control, optimistic UI data mutations, and seamless Patient-to-Doctor booking lifecycle architectures.

## Execution Environment

The system gracefully degrades if a MongoDB server is not running, launching an in-memory `mongodb-memory-server` automatically. However, to connect to your real remote cluster, configure the environment variables as follows.

### Environment Variables (`.env`)

Place this `.env` file at the root of the project:

```env
# Connection string for your MongoDB Atlas cluster
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/appointments_db

# Secret key used for signing JWT tokens (min 32 bytes recommended)
JWT_SECRET=your_super_secret_key_here

# Optional: Override express port (default 5000)
PORT=5000
```

## Running the Application

This is a decoupled Fullstack Mono-repo. You will need two terminal tabs.

1. **Start the Backend Node Server**
   ```bash
   cd e:\AIP\Project
   npm install
   npm run dev
   ```

2. **Start the Vite React Frontend**
   ```bash
   cd e:\AIP\Project\frontend
   npm install
   npm run dev
   ```
   Navigate to the local URL (e.g. `http://localhost:3000`).

## API Documentation

### Users
- **`POST /api/users/register`**
  - **Body**: `{ "name": "John", "email": "j@test.com", "password": "...", "role": "Patient" | "Doctor" }`
  - **Description**: Creates a user, hashes the password via `bcrypt`, and responds with a signed JWT.

### Doctors
- **`GET /api/doctors/:id/availability`**
  - **Query parameters**: `?date=YYYY-MM-DD`
  - **Description**: Retrieves securely formatted `isBooked` boolean time slots mapped against the doctor's root schedule schema.

### Appointments
- **`POST /api/appointments/book`**
  - **Body**: `{ "doctor": "<object_id>", "startTime": "...", "endTime": "...", "reason": "..." }`
  - **Description**: Applies double-booking index validation and pre-save chronological intersection hooks globally across the cluster.
- **`GET /api/appointments/me`**
  - **Query**: `?patientId=<id>` (JWT Mock Auth)
  - **Description**: Yields the historical and upcoming timeline for the active patient.
- **`GET /api/appointments`**
  - **Description**: Full administrative pull of all schedule requests for the DocPanel. Populates relational Patient User data.
- **`PATCH /api/appointments/:id/status`**
  - **Body**: `{ "status": "approved" | "rejected" }`
  - **Description**: Triggers atomic edits on the appointment timeline. Handled optimistically on the React UI via Tanstack Query.
