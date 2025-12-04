# 01BLog - Social Blogging Platform

A fullstack social blogging platform where students can share their learning experiences, discoveries, and progress throughout their journey. Users can interact with each other's content, follow one another, and engage in meaningful discussions.

## 📋 Table of Contents

- [Overview](#overview)
- [Technologies Used](#technologies-used)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Security](#security)

## 🎯 Overview

01Blog is a comprehensive social blogging platform built with modern web technologies. It allows users to:
- Create, edit, and delete blog posts with rich text and media
- Follow other users and receive notifications
- Like and comment on posts
- Report inappropriate content
- Admin dashboard for content moderation

## 🛠 Technologies Used

### Backend
- **Java 17** - Programming language
- **Spring Boot 3.5.5** - Application framework
- **Spring Security** - Authentication and authorization
- **JWT (JSON Web Tokens)** - Secure token-based authentication
- **PostgreSQL** - Relational database
- **Spring Data JPA** - Data persistence
- **Hibernate** - ORM framework
- **BCrypt** - Password hashing
- **Maven** - Build and dependency management

### Frontend
- **Angular 18** - Frontend framework
- **TypeScript** - Programming language
- **Angular Material** - UI component library
- **RxJS** - Reactive programming
- **Quill Editor** - Rich text editor for posts
- **HttpClient** - HTTP communication

### Security Features
- JWT-based authentication
- BCrypt password encryption
- Role-based access control (RBAC)
- CORS configuration
- SQL injection prevention via JPA
- XSS protection

## ✨ Features

### User Features
- ✅ User registration and authentication
- ✅ User profile with avatar
- ✅ Create, edit, and delete posts with rich text and media
- ✅ Upload images and videos
- ✅ Like and unlike posts
- ✅ Comment on posts
- ✅ Follow/unfollow users
- ✅ Receive notifications when followed users post
- ✅ Report inappropriate users or posts
- ✅ View personalized feed from followed users

### Admin Features
- ✅ Admin dashboard with statistics
- ✅ View all users, posts, and reports
- ✅ Ban/unban users
- ✅ Hide or delete inappropriate posts
- ✅ Review and resolve user reports
- ✅ Moderate content

### Additional Features
- ✅ Responsive design (mobile-friendly)
- ✅ Real-time notification system
- ✅ Media file storage and retrieval
- ✅ Secure file upload with validation
- ✅ Toast notifications for user feedback

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Java Development Kit (JDK) 17 or higher**
  - [Download JDK](https://www.oracle.com/java/technologies/downloads/)
  - Verify: `java -version`

- **Node.js 18 or higher and npm**
  - [Download Node.js](https://nodejs.org/)
  - Verify: `node -v` and `npm -v`

- **PostgreSQL 14 or higher**
  - [Download PostgreSQL](https://www.postgresql.org/download/)
  - Verify: `psql --version`

- **Maven 3.8 or higher** (optional, included via wrapper)
  - Verify: `mvn -version`

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd 01BLog
```

### 2. Database Setup

Create a PostgreSQL database:

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE blog_db;

# Create user (optional)
CREATE USER blog_user WITH ENCRYPTED PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE blog_db TO blog_user;

# Exit psql
\q
```

### 3. Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Configure database connection in `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/blog_db
spring.datasource.username=blog_user
spring.datasource.password=your_password

# JWT Configuration
jwt.secret=your-secret-key-here-min-256-bits
jwt.expiration=86400000

# File upload settings
file.upload-dir=./uploads
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB
```

Install dependencies and build:

```bash
./mvnw clean install
```

### 4. Frontend Setup

Open a new terminal and navigate to the frontend directory:

```bash
cd front
```

Install dependencies:

```bash
npm install
```

Configure API URL in `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080'
};
```

## 🏃 Running the Application

### Start the Backend

From the `backend` directory:

```bash
./mvnw spring-boot:run
```

The backend server will start on `http://localhost:8080`

### Start the Frontend

From the `front` directory:

```bash
ng serve
```

or

```bash
npm start
```

The frontend application will start on `http://localhost:4200`

### Access the Application

Open your browser and navigate to:
- **Frontend**: http://localhost:4200
- **Backend API**: http://localhost:8080/api

### Default Admin Account

After first run, you may need to create an admin account manually in the database or through registration and then update the role to `ADMIN`.

## 📁 Project Structure

```
01BLog/
├── backend/                    # Spring Boot backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/example/test/
│   │   │   │   ├── config/    # Security, CORS, Web config
│   │   │   │   ├── controller/# REST controllers
│   │   │   │   ├── dto/       # Data Transfer Objects
│   │   │   │   ├── model/     # JPA entities
│   │   │   │   ├── repository/# Spring Data repositories
│   │   │   │   ├── security/  # JWT and authentication
│   │   │   │   └── service/   # Business logic
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/              # Unit and integration tests
│   └── pom.xml                # Maven dependencies
│
├── front/                     # Angular frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/    # Angular components
│   │   │   ├── models/        # TypeScript interfaces
│   │   │   ├── services/      # HTTP services
│   │   │   └── guards/        # Route guards
│   │   ├── assets/            # Static files
│   │   └── environments/      # Environment configs
│   ├── angular.json
│   └── package.json
│
└── README.md                  # This file
```

## 📚 API Documentation

### Authentication Endpoints

```
POST   /api/auth/register    # Register new user
POST   /api/auth/login        # Login user
```

### Article Endpoints

```
GET    /api/articles          # Get articles from subscribed users
POST   /api/articles          # Create new article
GET    /api/articles/{id}     # Get specific article
PUT    /api/articles/{id}     # Update article
DELETE /api/articles/{id}     # Delete article
GET    /api/articles/user/{userId}  # Get user's articles
GET    /api/articles/all      # Get all articles (admin)
PUT    /api/articles/{id}/hide # Hide article (admin)
```

### User Endpoints

```
GET    /api/users             # Get all users
GET    /api/users/{id}        # Get user by ID
POST   /api/users/{id}/follow # Follow user
DELETE /api/users/{id}/unfollow # Unfollow user
GET    /api/users/{id}/is-following # Check if following
PUT    /api/users/{id}/ban    # Ban user (admin)
```

### Like Endpoints

```
POST   /api/articles/{id}/like    # Like article
DELETE /api/articles/{id}/unlike  # Unlike article
```

### Comment Endpoints

```
GET    /api/articles/{id}/comments       # Get article comments
POST   /api/articles/{id}/comments       # Add comment
PUT    /api/comments/{id}                # Update comment
DELETE /api/comments/{id}                # Delete comment
POST   /api/comments/{id}/like           # Like comment
DELETE /api/comments/{id}/unlike         # Unlike comment
```

### Report Endpoints

```
GET    /api/reports           # Get all reports (admin)
POST   /api/reports           # Create report
PUT    /api/reports/{id}/resolve  # Resolve report (admin)
PUT    /api/reports/{id}/dismiss  # Dismiss report (admin)
```

### Notification Endpoints

```
GET    /api/notifications     # Get user notifications
PUT    /api/notifications/{id}/read  # Mark as read
```

### Dashboard Endpoints

```
GET    /api/dashboard/stats   # Get admin statistics
```

## 🔒 Security

### Authentication Flow

1. User registers with username, email, and password
2. Password is hashed using BCrypt
3. User logs in with credentials
4. Server validates and returns JWT token
5. Client stores token and includes it in subsequent requests
6. Server validates token for protected routes

### Role-Based Access Control

- **USER**: Can create posts, comment, like, follow, report
- **ADMIN**: All user permissions + moderation capabilities
- **BANNED**: Cannot perform any actions

### Security Features

- JWT token expiration
- Password encryption with BCrypt
- CORS configuration for frontend
- SQL injection prevention via JPA
- File upload validation
- Input sanitization
- HTTPS ready (configure in production)

## 🧪 Testing

### Run Backend Tests

```bash
cd backend
./mvnw test
```

### Run Frontend Tests

```bash
cd front
ng test
```

## 🚢 Deployment

### Backend Deployment

1. Update `application.properties` for production
2. Build production JAR: `./mvnw clean package`
3. Run: `java -jar target/demo-0.0.1-SNAPSHOT.jar`

### Frontend Deployment

1. Update `environment.prod.ts` with production API URL
2. Build: `ng build --configuration production`
3. Deploy `dist/` folder to web server

## 📝 License

This project is created for educational purposes.

## 👥 Contributors

- Development Team

## 📧 Contact

For questions or support, please contact the development team.

---

**Note**: This is a learning project built as part of a fullstack development course.
