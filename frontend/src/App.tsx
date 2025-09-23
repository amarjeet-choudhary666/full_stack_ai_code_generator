import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Layout from './components/layout/Layout';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import CodeGenerator from './components/ai/CodeGenerator';
import PromptHistory from './components/ai/PromptHistory';
import PromptDetail from './components/ai/PromptDetail';
import './App.css';

function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <AuthProvider>
          <Router>
            <div className="App">
              <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* Protected Routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Dashboard />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/generate"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <CodeGenerator />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/history"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <PromptHistory />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/history/:id"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <PromptDetail />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                
                {/* Default redirect */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </div>
          </Router>
        </AuthProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
