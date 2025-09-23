# 🤖 AI Code Generator

A modern, full-stack web application that generates clean, commented code using Google's Gemini AI. Built with React, Node.js, TypeScript, and MongoDB.

![AI Code Generator](https://img.shields.io/badge/AI-Code%20Generator-blue?style=for-the-badge&logo=openai)
![React](https://img.shields.io/badge/React-19.1.1-61DAFB?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Latest-339933?style=for-the-badge&logo=node.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?style=for-the-badge&logo=typescript)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)

## ✨ Features

### 🎯 **Core Functionality**
- **AI-Powered Code Generation** - Generate clean, simple code using Google Gemini AI
- **Multi-Language Support** - JavaScript, TypeScript, Python, Java, C++, C#, PHP, Go, Rust, and more
- **Smart Prompting** - Optimized prompts for concise, production-ready code
- **Syntax Highlighting** - Beautiful code display with proper color coding
- **Code History** - Save, view, and manage all your generated code

### 🎨 **Modern UI/UX**
- **Dark Theme** - Beautiful ChatGPT-inspired dark interface
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **Smooth Animations** - Polished transitions and hover effects
- **Intuitive Navigation** - Easy-to-use interface with clear visual hierarchy

### 🔐 **Authentication & Security**
- **JWT Authentication** - Secure user authentication system
- **Protected Routes** - Route-level security for authenticated users
- **User Management** - Registration, login, and profile management
- **Session Management** - Automatic token refresh and logout

### 📊 **Dashboard & Analytics**
- **Personal Dashboard** - Overview of your coding activity
- **Usage Statistics** - Track prompts, languages, and weekly activity
- **Recent History** - Quick access to your latest generated code
- **Language Analytics** - Visual breakdown of programming languages used

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account
- Google Gemini API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ai-code-generator.git
   cd ai-code-generator
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   ```

4. **Environment Configuration**
   
   Create `backend/.env`:
   ```env
   PORT=3000
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/
   ACCESS_TOKEN_SECRET=your_access_token_secret
   REFRESH_TOKEN_SECRET=your_refresh_token_secret
   GEMINI_API_KEY=your_gemini_api_key
   ```

   Create `frontend/.env`:
   ```env
   VITE_API_BASE_URL=http://localhost:3000/v1/api
   VITE_APP_NAME=AI Code Generator
   VITE_APP_VERSION=1.0.0
   ```

5. **Start the Application**
   
   Backend:
   ```bash
   cd backend
   npm run dev
   ```

   Frontend:
   ```bash
   cd frontend
   npm run dev
   ```

6. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000

## 🏗️ Project Structure

```
ai-code-generator/
├── backend/                 # Node.js + Express API
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── middlewares/     # Authentication & validation
│   │   ├── models/          # MongoDB schemas
│   │   ├── routes/          # API routes
│   │   ├── utils/           # Helper functions
│   │   └── index.ts         # Server entry point
│   ├── .env                 # Environment variables
│   └── package.json
├── frontend/                # React + TypeScript UI
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── ai/          # AI-related components
│   │   │   ├── auth/        # Authentication components
│   │   │   ├── common/      # Shared components
│   │   │   ├── dashboard/   # Dashboard components
│   │   │   └── layout/      # Layout components
│   │   ├── contexts/        # React contexts
│   │   ├── services/        # API services
│   │   ├── types/           # TypeScript types
│   │   └── App.tsx          # Main app component
│   ├── .env                 # Environment variables
│   └── package.json
└── README.md
```

## 🛠️ Tech Stack

### **Backend**
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **AI Integration**: Google Gemini API
- **Validation**: Custom middleware
- **Development**: Nodemon, ts-node

### **Frontend**
- **Framework**: React 19 with TypeScript
- **Styling**: Tailwind CSS with custom dark theme
- **Routing**: React Router DOM
- **HTTP Client**: Axios with interceptors
- **State Management**: React Context API
- **Build Tool**: Vite
- **Code Highlighting**: Custom syntax highlighter

### **Database Schema**
- **Users**: Authentication and profile data
- **PromptHistory**: Generated code history with metadata

## 📡 API Endpoints

### **Authentication**
```
POST   /v1/api/user/register     # User registration
POST   /v1/api/user/login        # User login
POST   /v1/api/user/logout       # User logout
GET    /v1/api/user/current-user # Get current user
POST   /v1/api/user/refresh-token # Refresh JWT token
```

### **AI Code Generation**
```
POST   /v1/api/ai/generate       # Generate code from prompt
GET    /v1/api/ai/history        # Get user's prompt history
GET    /v1/api/ai/history/:id    # Get specific prompt
DELETE /v1/api/ai/history/:id    # Delete prompt
PUT    /v1/api/ai/regenerate/:id # Regenerate code
POST   /v1/api/ai/improve        # Improve existing code
POST   /v1/api/ai/explain        # Explain code functionality
```

## 🎨 UI Components

### **Pages**
- **Login/Register** - Authentication forms with validation
- **Dashboard** - User overview with statistics and recent activity
- **Code Generator** - Main interface for generating code
- **Prompt History** - Paginated list of all generated code
- **Prompt Details** - Detailed view with regeneration options

### **Key Features**
- **Syntax Highlighting** - Color-coded display for multiple languages
- **Copy to Clipboard** - One-click code copying
- **Language Selection** - Support for 16+ programming languages
- **Responsive Design** - Mobile-first approach
- **Loading States** - Smooth loading animations
- **Error Handling** - User-friendly error messages

## 🔧 Configuration

### **Supported Languages**
- JavaScript/TypeScript
- Python
- Java
- C/C++
- C#
- PHP
- Ruby
- Go
- Rust
- Swift
- Kotlin
- HTML/CSS
- SQL
- Bash

### **AI Configuration**
- **Model**: Google Gemini 1.5 Flash
- **Max Tokens**: 2048
- **Temperature**: 0.7 (balanced creativity)
- **Focus**: Simple, clean, production-ready code

## 🚀 Deployment

### **Backend Deployment**
1. Deploy to platforms like Heroku, Railway, or DigitalOcean
2. Set environment variables in production
3. Ensure MongoDB Atlas is accessible
4. Configure CORS for your frontend domain

### **Frontend Deployment**
1. Build the production version: `npm run build`
2. Deploy to Vercel, Netlify, or similar platforms
3. Update API base URL for production
4. Configure environment variables

### **Environment Variables**
Make sure to set all required environment variables in production:
- Database connection strings
- JWT secrets
- API keys
- CORS origins

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### **Development Guidelines**
- Follow TypeScript best practices
- Use consistent code formatting
- Add proper error handling
- Include loading states for async operations
- Test on multiple screen sizes
- Follow the existing dark theme design

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Gemini AI** for powerful code generation
- **React Team** for the amazing framework
- **Tailwind CSS** for utility-first styling
- **MongoDB** for flexible database solutions
- **Vite** for lightning-fast development

## 📞 Support

If you have any questions or need help:

1. Check the [Issues](https://github.com/yourusername/ai-code-generator/issues) page
2. Create a new issue with detailed information
3. Join our community discussions

---

*Generate code smarter, not harder* 🚀