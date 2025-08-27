# StudyNotion – EdTech Platform  

🚀 [Live Website](https://studynotion-frontend.vercel.app/)  

---

## 📖 Introduction  
**StudyNotion** is a fully functional EdTech platform that enables users to **create, consume, and rate educational content**.  
It is built with the **MERN stack** (MongoDB, ExpressJS, ReactJS, NodeJS) and provides an interactive learning experience for students while giving instructors the tools to create and manage courses.  

---

## 📑 Table of Contents  
- [Introduction](#-introduction)  
- [System Architecture](#-system-architecture)  
- [Front-end](#-front-end)  
- [Back-end](#-back-end)  
- [Database](#-database)  
- [Architecture Diagram](#-architecture-diagram)  
- [API Design](#-api-design)  
- [Installation](#-installation)  
- [Configuration](#-configuration)  
- [Usage](#-usage)  

---

## 🏗 System Architecture  
The platform consists of three main components:  
1. **Front-end (ReactJS)** – Client-side interface for students & instructors.  
2. **Back-end (NodeJS + ExpressJS)** – REST APIs for authentication, course management, payments.  
3. **Database (MongoDB)** – Stores users, courses, and content.  

---

## 🎨 Front-end  
Built with **ReactJS**, styled using **Tailwind CSS**, and state managed with **Redux**.  

### Student Pages:
- **Homepage** – Introduction + course list.  
- **Course List** – All available courses with details & ratings.  
- **Wishlist** – Saved courses.  
- **Cart & Checkout** – Course purchase flow.  
- **Course Content** – Videos, documents, and materials.  
- **User Details & Edit Profile** – Manage account info.  

### Instructor Pages:
- **Dashboard** – Overview of instructor’s courses & ratings.  
- **Insights** – Analytics (views, clicks, engagement).  
- **Course Management** – Create, update, delete courses.  
- **Profile Management** – View & edit profile details.  

---

## ⚙️ Back-end  
Built with **NodeJS + ExpressJS**, provides APIs for user authentication, course handling, and payments.  

### Key Features:
- **Authentication & Authorization** (JWT, OTP verification, forgot password).  
- **Course Management** (CRUD operations for instructors, rating system for students).  
- **Payment Integration** (Razorpay checkout flow).  
- **Cloud Media Storage** (Cloudinary for images, videos, documents).  
- **Markdown Support** (Course documents stored in markdown).  

### Libraries & Tools:
- **Node.js** – Runtime.  
- **Express.js** – Backend framework.  
- **MongoDB** – NoSQL database.  
- **Mongoose** – ODM for MongoDB.  
- **JWT** – Secure authentication.  
- **Bcrypt** – Password hashing.  

---

## 🗄 Database  
The platform uses **MongoDB** with schemas for students, instructors, and courses.  

- **Student Schema** – name, email, password, enrolled courses.  
- **Instructor Schema** – name, email, password, created courses.  
- **Course Schema** – name, description, instructor, media, pricing.  

### Database Schema Diagram  
![Database Schema](./assets/database-schema.png)  

---

## 📊 Architecture Diagram  
![System Architecture](./assets/system-architecture.png)  

---

## 🔗 API Design  
- RESTful API with **JSON responses**.  
- Methods: `GET`, `POST`, `PUT`, `DELETE`.  
- Authentication with **JWT tokens**.  

(See API Documentation for full details.)  

---

## 🛠 Installation  
```bash
# Clone the repository
git clone https://github.com/username/StudyNotion.git

# Navigate to project directory
cd StudyNotion

# Install dependencies
npm install

MONGODB_URI=<your-mongodb-connection-url>
JWT_SECRET=<your-jwt-secret-key>

