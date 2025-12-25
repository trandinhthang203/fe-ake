import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Chat from "./pages/Chat";
import Profile from "./pages/Profile";
import Guest from "./pages/Guest";
import MainLayout from "./layouts/MainLayout";
import { Brain, Loader2 } from 'lucide-react';

// Loading Screen Component
const LoadingScreen = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
    <div className="text-center space-y-6">
      {/* Animated Logo */}
      <div className="relative">
        <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur opacity-30 animate-pulse"></div>
        <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-full">
          <Brain className="w-12 h-12 text-white animate-bounce" />
        </div>
      </div>

      {/* Loading Text */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          AI Agent Y Sinh SPOKE
        </h2>
        <div className="flex items-center justify-center gap-2 text-gray-600">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm">Đang khởi tạo hệ thống...</span>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="w-64 h-1 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-pulse"></div>
      </div>

      {/* Subtle hint */}
      <p className="text-xs text-gray-500 max-w-sm">
        Hệ thống đang kết nối với cơ sở tri thức y sinh và đồ thị SPOKE...
      </p>
    </div>
  </div>
);

export default function AppRoutes() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Routes>
      {/* Guest routes - when not authenticated */}
      <Route
        path="/"
        element={!user ? <Guest /> : <Navigate to="/chat" replace />}
      />
      <Route
        path="/login"
        element={!user ? <Login /> : <Navigate to="/chat" replace />}
      />
      <Route
        path="/register"
        element={!user ? <Register /> : <Navigate to="/chat" replace />}
      />

      {/* Protected routes - when authenticated */}
      <Route
        path="/chat"
        element={
          user ? (
            <MainLayout>
              <Chat />
            </MainLayout>
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      <Route
        path="/profile"
        element={
          user ? (
            <MainLayout>
              <Profile />
            </MainLayout>
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
