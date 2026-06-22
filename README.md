# Virasat 2.0 - Digital Family Memory Keeper (https://www.virasat.space/)

A modern full-stack web application for preserving and sharing family memories through stories and circles. Virasat allows families to create digital archives of their memories, organize them into circles (groups), and invite family members to collaborate and view shared stories.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)

## 🎯 Overview

Virasat is a web-based platform designed to help families digitize and preserve their memories. Users can create family accounts, organize members into circles, upload stories with media (images/videos), and share them securely with family members. The platform provides a timeline view of all memories and tools to manage family invitations.

## ✨ Features

### Core Features

- **User Authentication**: Secure signup, login, and profile management with JWT tokens
- **Family Management**: Create families, invite members, and manage family hierarchies
- **Circles**: Create and manage custom groups within families for organizing stories
- **Story Upload**: Upload memories with multiple media files, titles, and descriptions
- **Timeline View**: Chronological feed of all family and circle stories
- **Media Management**: Cloudinary integration for image and video uploads
- **Invite System**: Email-based invitations for family members with token validation
- **Join Requests**: Handle family join requests with approval workflow
- **Rate Limiting**: Protected API endpoints with request rate limiting
- **Email Notifications**: Automated emails for invitations and notifications

### User Roles

- **Admin**: Full access to family management and approvals
- **Members**: Can view stories, upload memories to circles, and manage invitations

## 🛠️ Tech Stack

### Frontend

- **React 19** - UI library with latest features
- **Vite** - Fast build tool and dev server
- **React Router 7** - Client-side routing
- **React Query** - Data fetching and caching
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/ui** - Pre-built React components
- **Framer Motion** - Animation library
- **Axios** - HTTP client
- **Cloudinary** - Media upload and storage
- **React Toastify** - Toast notifications

### Backend

- **Node.js + Express 5** - Server framework
- **MongoDB + Mongoose** - Database and ODM
- **JWT** - Authentication tokens
- **Bcryptjs** - Password hashing
- **Cloudinary SDK** - Media management
- **Resend** - Email service
- **Express Rate Limit** - API rate limiting
- **CORS** - Cross-origin resource sharing
- **Nodemon** - Development server auto-reload

## 📁 Project Structure

```
Virasat-2.0/
├── backend/                          # Node.js Express API server
│   ├── main.js                      # Application entry point
│   ├── package.json
│   ├── controllers/                 # Route handlers
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   ├── family.controller.js
│   │   ├── circle.controller.js
│   │   ├── story.controller.js
│   │   └── invite.controller.js
│   ├── models/                      # Mongoose schemas
│   │   ├── user.model.js
│   │   ├── family.model.js
│   │   ├── circle.model.js
│   │   ├── story.model.js
│   │   ├── family.invite.model.js
│   │   └── join.request.model.js
│   ├── routes/                      # API route definitions
│   │   ├── auth.route.js
│   │   ├── user.route.js
│   │   ├── family.route.js
│   │   ├── circle.route.js
│   │   ├── story.route.js
│   │   └── invite.route.js
│   ├── middlewares/                 # Custom middlewares
│   │   ├── authMiddleware.js       # JWT authentication
│   │   └── rateLimiter.js          # Request rate limiting
│   └── utils/                       # Utility functions
│       ├── db.js                   # MongoDB connection
│       ├── emailService.js         # Email handling
│       ├── inviteTokenUtils.js     # Invite token generation
│       └── tokenUtils.js           # JWT utilities
│
└── frontend/                         # React + Vite application
    ├── src/
    │   ├── App.jsx                 # Main app component
    │   ├── main.jsx                # Application entry point
    │   ├── index.css               # Global styles
    │   ├── components/             # Reusable React components
    │   │   ├── Navbar.jsx
    │   │   ├── ProtectedRoute.jsx
    │   │   ├── StoryCard.jsx
    │   │   ├── UploadMemoryModal.jsx
    │   │   ├── CreateFamilyForm.jsx
    │   │   ├── ViewStoryModal.jsx
    │   │   └── ui/                 # UI components (shadcn)
    │   ├── pages/                  # Page components
    │   │   ├── Login.jsx
    │   │   ├── Signup.jsx
    │   │   ├── Home.jsx
    │   │   ├── Family.jsx
    │   │   ├── FamilyStories.jsx
    │   │   ├── Circles.jsx
    │   │   ├── Timeline.jsx
    │   │   ├── JoinFamily.jsx
    │   │   ├── Profile.jsx
    │   │   └── AdminApprovals.jsx
    │   ├── hooks/                  # Custom React hooks
    │   │   ├── useFamily.js
    │   │   ├── useStories.js
    │   │   └── useCircles.js
    │   ├── context/                # React Context
    │   │   └── AuthContext.jsx     # Global auth state
    │   └── lib/                    # Utility functions
    │       └── utils.js
    ├── public/                     # Static assets
    ├── vite.config.js
    ├── tailwind.config.js
    └── package.json
```

## 📋 Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (local or Atlas)
- **Cloudinary** account (for media uploads)
- **Resend** account (for email service)

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Virasat-2.0
```

### 2. Backend Setup

```bash
cd backend
npm install
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

## 🔐 Environment Variables

### Backend (.env)

Create a `.env` file in the `backend/` directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/virasat

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email Service (Resend)
RESEND_API_KEY=your_resend_api_key

# Frontend URLs (CORS)
CLIENT_URL=http://localhost:5173
CLIENT_URLS=http://localhost:5173,https://yourdomain.com

# Email Configuration
FROM_EMAIL=noreply@virasat.com
```

### Frontend (.env)

Create a `.env` file in the `frontend/` directory:

```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

## ▶️ Running the Application

### Development Mode

**Terminal 1 - Backend:**

```bash
cd backend
npm run dev
```

The API server will start at `http://localhost:3000`

**Terminal 2 - Frontend:**

```bash
cd frontend
npm run dev
```

The app will be available at `http://localhost:5173`

### Production Build

**Frontend Build:**

```bash
cd frontend
npm run build
npm run preview
```

## 📡 API Endpoints

### Authentication

- `POST /api/v1/auth/signup` - Register new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/logout` - Logout user

### Users

- `GET /api/v1/user/profile` - Get user profile
- `PUT /api/v1/user/profile` - Update user profile
- `GET /api/v1/user/:id` - Get user by ID

### Families

- `POST /api/v1/family/create` - Create a new family
- `GET /api/v1/family/:id` - Get family details
- `GET /api/v1/family/:id/members` - Get family members
- `PUT /api/v1/family/:id` - Update family
- `DELETE /api/v1/family/:id` - Delete family

### Circles

- `POST /api/v1/circle/create` - Create circle
- `GET /api/v1/circle/:id` - Get circle details
- `GET /api/v1/circle/:id/stories` - Get circle stories
- `PUT /api/v1/circle/:id` - Update circle
- `DELETE /api/v1/circle/:id` - Delete circle

### Stories

- `POST /api/v1/story/create` - Create new story with media
- `GET /api/v1/story/:id` - Get story details
- `GET /api/v1/story/family/:familyId` - Get family stories
- `GET /api/v1/story/circle/:circleId` - Get circle stories
- `PUT /api/v1/story/:id` - Update story
- `DELETE /api/v1/story/:id` - Delete story

### Invitations

- `POST /api/v1/invite/send` - Send family invitation
- `GET /api/v1/invite/:token` - Validate invitation token
- `POST /api/v1/invite/:token/accept` - Accept invitation
- `GET /api/v1/invite/pending` - Get pending invitations

### Admin/Approvals

- `GET /api/v1/family/:id/approvals` - Get pending join requests
- `POST /api/v1/family/:id/approve/:requestId` - Approve join request
- `POST /api/v1/family/:id/reject/:requestId` - Reject join request

## 🔒 Security Features

- JWT-based authentication with secure token storage
- Password hashing with bcryptjs
- CORS protection with configurable origins
- Rate limiting on API endpoints
- Email token validation for invitations
- Protected routes requiring authentication
- Secure cookie-based sessions

## 📝 License

ISC

## 👥 Contributing

Contributions are welcome! Please fork the repository and submit pull requests with improvements or bug fixes.

---

**Made with ❤️ for families to preserve their memories**
