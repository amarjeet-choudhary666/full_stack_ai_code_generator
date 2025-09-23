# AI Code Generator Frontend

A modern React application for generating code using AI, built with TypeScript, Tailwind CSS, and Vite.

## Features

- 🔐 **Authentication System**: Login/Register with JWT tokens
- 🤖 **AI Code Generation**: Generate code using Google Gemini AI
- 📝 **Prompt History**: View, manage, and regenerate previous prompts
- 🎨 **Modern UI**: Clean, responsive design with Tailwind CSS
- 🔄 **Real-time Updates**: Live code generation and history updates
- 📱 **Mobile Responsive**: Works seamlessly on all devices
- 🚨 **Error Handling**: Comprehensive error boundaries and toast notifications
- 🔒 **Protected Routes**: Secure routing with authentication guards

## Tech Stack

- **React 19** - UI Framework
- **TypeScript** - Type Safety
- **Vite** - Build Tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Axios** - HTTP Client
- **Context API** - State Management

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── ai/             # AI-related components
│   ├── common/         # Common/shared components
│   └── layout/         # Layout components
├── contexts/           # React contexts
├── services/           # API services
├── types/              # TypeScript type definitions
├── App.tsx            # Main app component
└── main.tsx           # Entry point
```

## Available Routes

### Public Routes
- `/login` - User login
- `/register` - User registration

### Protected Routes
- `/dashboard` - Main dashboard with stats and recent prompts
- `/generate` - Code generation interface
- `/history` - Prompt history with pagination
- `/history/:id` - Individual prompt details

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Setup**
   Create a `.env` file:
   ```env
   VITE_API_BASE_URL=http://localhost:3000/v1/api
   VITE_APP_NAME=AI Code Generator
   VITE_APP_VERSION=1.0.0
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Build for Production**
   ```bash
   npm run build
   ```

## API Integration

The frontend integrates with the backend API through:

- **Auth Service**: Handles login, registration, and token management
- **AI Service**: Manages code generation and prompt history
- **Axios Interceptors**: Automatic token attachment and error handling

## Key Features

### Authentication
- JWT-based authentication
- Automatic token refresh
- Protected route guards
- Persistent login state

### Code Generation
- Multi-language support (JavaScript, Python, Java, etc.)
- Real-time code generation
- Copy to clipboard functionality
- Syntax highlighting

### Prompt Management
- History tracking with pagination
- Search and filter capabilities
- Delete and regenerate options
- Detailed prompt views

### User Experience
- Loading states and error handling
- Toast notifications
- Responsive design
- Intuitive navigation

## Development

### Code Style
- TypeScript for type safety
- ESLint for code quality
- Consistent component structure
- Proper error boundaries

### State Management
- React Context for global state
- Local state for component-specific data
- Custom hooks for reusable logic

### Performance
- Code splitting with React.lazy
- Optimized bundle size
- Efficient re-renders
- Proper dependency management

## Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder** to your hosting service

3. **Configure environment variables** for production

## Contributing

1. Follow the existing code structure
2. Use TypeScript for all new components
3. Add proper error handling
4. Include loading states
5. Test on mobile devices
6. Update documentation as needed

## License

This project is part of the AI Code Generator application.