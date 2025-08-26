# mern-skillshare-project

# Skillshare Clone - Full-Stack MERN Project

A feature-rich, full-stack web application inspired by Skillshare, built from the ground up using the MERN stack (MongoDB, Express.js, React, Node.js). This project allows users to sign up, create and manage courses, upload video lessons, and enroll in courses created by other users.

---

## Features Implemented ✨

- **User Authentication**: Secure user registration with OTP email verification, login, and JWT-based session management.
- **Course Management**: Full CRUD (Create, Read, Update, Delete) functionality for courses, restricted to the course instructor.
- **Lesson Management**: Instructors can add video lessons to their courses.
- **Media Uploads**: Integrated with Cloudinary for seamless image (thumbnails) and video (lessons) uploads.
- **Enrollment System**: Logged-in users can enroll in courses.
- **Dynamic Content**:
    - **Search**: Users can search for courses by title or category.
    - **Filtering**: The main skills page can be filtered by category.
- **User Profiles**: Users have a profile page with a randomly generated avatar and can update their name and bio.
- **User Dashboard**: A personalized dashboard showing courses a user has created and courses they are enrolled in.
- **Rating & Review System**: Enrolled students can leave a star rating and a written review for courses.

---

## Tech Stack 💻

**Frontend:**
- **React.js**: For building the user interface.
- **React Router**: For client-side routing.
- **Tailwind CSS**: For styling.
- **Axios**: For making API requests to the backend.

**Backend:**
- **Node.js**: JavaScript runtime environment.
- **Express.js**: Web framework for building the API.
- **MongoDB**: NoSQL database for storing data.
- **Mongoose**: Object Data Modeling (ODM) library for MongoDB.
- **JSON Web Tokens (JWT)**: For securing API endpoints.
- **Cloudinary**: For cloud-based image and video storage.
- **SendGrid**: For sending transactional emails (like OTPs).

---

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js installed on your machine
- npm or yarn
- A local MongoDB instance (using MongoDB Compass) or a MongoDB Atlas account

### Installation

1.  **Clone the repo**
    ```sh
    git clone [https://github.com/Maibram/mern-skillshare-clone-project.git](https://github.com/Maibram/mern-skillshare-clone-project.git)
    ```
2.  **Install Backend Dependencies**
    ```sh
    cd mern-skillshare-project/backend
    npm install
    ```
3.  **Install Frontend Dependencies**
    ```sh
    cd ../frontend
    npm install
    ```

### Environment Variables

Before you can run the backend, you need to create a `.env` file in the `backend` directory. Copy the contents of `.env.example` (or the template below) into a new file named `.env` and fill in your secret keys.


backend/.env
Server Configuration
PORT=5000

Database Configuration (replace with your MongoDB connection string)
MONGO_URI=mongodb://localhost:27017/skillshare

JWT Configuration (use a long, random string)
JWT_SECRET=your_super_secret_jwt_key

Email Configuration (SendGrid)
SENDGRID_API_KEY=YOUR_SENDGRID_API_KEY
EMAIL_FROM=your_verified_email@example.com

Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=YOUR_CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY=YOUR_CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET=YOUR_CLOUDINARY_API_SECRET


### Running the Application

1.  **Run the Backend Server** (from the `backend` folder)
    ```sh
    npm run server
    ```
2.  **Run the Frontend Development Server** (from the `frontend` folder, in a new terminal)
    ```sh
    npm run dev 
    ```
    Your application should now be running, with the frontend at `http://localhost:5173` (or your Vite port) and the backend at `http://localhost:5000`.

