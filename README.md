# Smart College Resource Platform - MERN Stack

A comprehensive educational platform built with MongoDB, Express.js, React.js, and Node.js that provides students and teachers with a centralized hub for academic resources, AI-powered assistance, and community interaction.

## 🚀 Features

### 🔐 Authentication & Authorization
- **JWT-based authentication** with secure token management
- **Role-based access control** (Student, Teacher, Admin)
- **bcrypt password hashing** for enhanced security
- **Protected routes** with middleware validation

### 📚 Content Management
- **Notes, Syllabus, Videos, and PYQs** upload and management
- **Advanced filtering** by branch, year, semester, subject
- **File upload** with validation and security checks
- **Content approval system** for quality control
- **Like, bookmark, and download** tracking

### 🤖 AI-Powered Chatbot
- **Academic-focused AI assistant** using OpenAI GPT
- **Content-aware responses** based on uploaded materials
- **Prompt filtering** to ensure academic relevance
- **Conversation history** and context management
- **Smart content classification** to reject irrelevant queries

### 💬 Real-time Chat System
- **Student-to-Student** group discussions
- **Student-to-Teacher** consultation channels
- **Real-time messaging** with Socket.IO
- **File sharing** capabilities
- **Message read receipts** and typing indicators

### 👨‍💼 Admin Dashboard
- **User management** with role assignments
- **Content moderation** and approval workflows
- **Analytics and reporting** with visual charts
- **Announcement system** with targeted messaging
- **Chat monitoring** and moderation tools

## 🛠️ Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database with Mongoose ODM
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Socket.IO** - Real-time communication
- **OpenAI API** - AI chatbot functionality
- **Multer** - File upload handling
- **Express Validator** - Input validation

### Frontend
- **React.js** - UI library
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Animations
- **Lucide React** - Icon library
- **Axios** - HTTP client

### Security & Middleware
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **Rate limiting** - API protection
- **File validation** - Upload security
- **Input sanitization** - XSS prevention

## 📁 Project Structure

```
smart-college/
├── backend/
│   ├── controllers/     # API logic and business rules
│   ├── models/          # Mongoose schemas and models
│   ├── routes/          # Express route definitions
│   ├── middleware/      # Authentication, validation, upload
│   ├── services/        # Business logic (AI filtering, etc.)
│   ├── utils/           # Helper functions and utilities
│   ├── config/          # Database and environment config
│   ├── uploads/         # File storage directory
│   └── server.js        # Main server file
├── src/                 # React frontend
│   ├── components/      # Reusable UI components
│   ├── pages/           # Page components
│   ├── hooks/           # Custom React hooks
│   ├── context/         # React context providers
│   ├── services/        # API service functions
│   └── utils/           # Frontend utilities
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- OpenAI API key (for AI chatbot)

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your configuration:
   ```env
   MONGODB_URI=mongodb://localhost:27017/smart-college
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRE=7d
   PORT=5000
   NODE_ENV=development
   OPENAI_API_KEY=your-openai-api-key-here
   FRONTEND_URL=http://localhost:3000
   ```

4. **Start the backend server**
   ```bash
   # Development mode with auto-restart
   npm run dev
   
   # Production mode
   npm start
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd ../
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Update API configuration**
   Create `.env` in the root directory:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Start the frontend development server**
   ```bash
   npm run dev
   ```

### Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **API Health Check**: http://localhost:5000/api/health

## 🔑 API Endpoints

### Authentication
```
POST /api/auth/register    # User registration
POST /api/auth/login       # User login
GET  /api/auth/me          # Get current user
PUT  /api/auth/profile     # Update profile
PUT  /api/auth/change-password # Change password
POST /api/auth/logout      # Logout user
```

### Content Management
```
GET    /api/content        # Get all content with filters
GET    /api/content/:id    # Get specific content
POST   /api/content        # Create new content (Teacher/Admin)
PUT    /api/content/:id    # Update content (Owner/Admin)
DELETE /api/content/:id    # Delete content (Owner/Admin)
POST   /api/content/:id/like     # Like/unlike content
POST   /api/content/:id/bookmark # Bookmark content
POST   /api/content/:id/download # Track download
```

### AI Chatbot
```
POST /api/ai/chat          # Chat with AI assistant
GET  /api/ai/history       # Get conversation history
```

### Chat System
```
GET    /api/chat           # Get user's chats
POST   /api/chat           # Create new chat
GET    /api/chat/:id       # Get specific chat
POST   /api/chat/:id/messages # Send message
PUT    /api/chat/:id/read  # Mark messages as read
```

### Admin Routes
```
GET    /api/admin/analytics     # Platform analytics
GET    /api/admin/users         # All users
PUT    /api/admin/users/:id/status # Update user status
GET    /api/admin/content       # All content
PUT    /api/admin/content/:id/approve # Approve content
POST   /api/admin/announcements # Create announcement
```

## 🔒 Security Features

### Authentication Security
- **JWT tokens** with configurable expiration
- **bcrypt hashing** with salt rounds
- **Role-based permissions** for route protection
- **Token validation** middleware

### Input Validation
- **Express Validator** for request validation
- **File type and size** restrictions
- **XSS prevention** with input sanitization
- **SQL injection protection** with Mongoose

### API Security
- **Rate limiting** to prevent abuse
- **CORS configuration** for cross-origin requests
- **Helmet** for security headers
- **File upload validation** with type checking

### AI Security
- **Prompt filtering** to ensure academic relevance
- **Content classification** to reject inappropriate queries
- **Token usage monitoring** and rate limiting
- **Context validation** for content-aware responses

## 🤖 AI Chatbot Features

### Academic Focus
- **Content-aware responses** based on uploaded materials
- **Academic keyword filtering** to ensure relevance
- **Subject-specific assistance** for different branches
- **Study guidance** and concept explanations

### Smart Filtering
- **Inappropriate content detection** and rejection
- **Non-academic query filtering** with helpful redirects
- **Context validation** for content-specific questions
- **Conversation history** for better context understanding

### Usage Examples
```javascript
// Academic question (✅ Allowed)
"Can you explain the concept of binary trees in data structures?"

// Content-specific question (✅ Allowed)
"I'm reading the notes on algorithms. Can you help me understand quicksort?"

// Non-academic question (❌ Rejected)
"What's the weather like today?"

// Inappropriate content (❌ Rejected)
"How can I cheat on my exam?"
```

## 📊 Admin Dashboard Features

### Analytics
- **User growth** tracking and visualization
- **Content engagement** metrics (views, downloads, likes)
- **Popular resources** identification
- **Activity monitoring** with real-time data

### User Management
- **Role assignment** and permission control
- **Account activation/deactivation**
- **User profile** viewing and editing
- **Bulk operations** for user management

### Content Moderation
- **Approval workflows** for uploaded content
- **Quality control** with review processes
- **Content categorization** and tagging
- **Bulk content operations**

## 🔧 Development

### Running Tests
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd ../
npm test
```

### Building for Production
```bash
# Build frontend
npm run build

# Start production server
cd backend
npm start
```

### Database Seeding
```bash
# Seed database with sample data
cd backend
npm run seed
```

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- **Email**: support@smartcollege.edu
- **Documentation**: [Wiki](https://github.com/your-repo/wiki)
- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)

## 🙏 Acknowledgments

- **OpenAI** for GPT API
- **MongoDB** for database solutions
- **React** and **Express** communities
- **All contributors** who helped build this platform

---

**Built with ❤️ for education**