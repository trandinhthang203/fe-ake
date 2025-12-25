import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardFooter, Input, Alert, Button } from '../ui';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Loader2, Brain, Activity } from 'lucide-react';
import { toast } from 'sonner';

interface LoginProps {
  onClose?: () => void;
  onSwitchMode?: () => void;
}

const Login = ({ onClose, onSwitchMode }: LoginProps) => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const canSubmit = form.email.trim() !== '' && form.password.trim() !== '' && !isSubmitting;
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError(''); // Clear error when user starts typing
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) {
      setError('Hãy nhập đầy đủ thông tin!');
      return;
    }
    setError('');
    setIsSubmitting(true);

    try {
      await login({ email: form.email, password: form.password });
      toast.success('Đăng nhập thành công! Chào mừng bạn đến với AI Agent Y Sinh SPOKE', {
        description: 'Đang chuyển hướng đến trang chat...',
        duration: 3000,
      });
      if (onClose) onClose();
      navigate('/chat');
    } catch (error: any) {
      const errorMessage = error?.response?.data?.detail || 'Đăng nhập thất bại. Vui lòng kiểm tra thông tin.';
      setError(errorMessage);
      toast.error('Đăng nhập thất bại', {
        description: 'Vui lòng kiểm tra email và mật khẩu của bạn.',
        duration: 4000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="relative w-full max-w-md rounded-2xl p-8 shadow-2xl pt-8 bg-gradient-to-br from-white to-blue-50/30 border-0">
      {/* Header with AI Icon */}
      <div className="flex items-center justify-center mb-6">
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur opacity-25"></div>
          <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-full">
            <Brain className="w-8 h-8 text-white" />
          </div>
        </div>
      </div>

      {onClose && (
        <button
          className="absolute right-3 top-3 text-xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-50 hover:text-red-600 transition-colors z-10"
          onClick={onClose}
          aria-label="Close modal"
          type="button"
        >
          ×
        </button>
      )}

      <form onSubmit={handleSubmit}>
        <CardHeader className="p-0 pt-2 mb-6 text-center">
          <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            AI Agent Y Sinh SPOKE
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Hỗ trợ kiến thức y sinh với công nghệ AI tiên tiến
          </p>
        </CardHeader>

        <CardContent className="space-y-5 p-0">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <Input
              type="email"
              name="email"
              placeholder="your@email.com"
              value={form.email}
              onChange={handleChange}
              autoFocus
              className="h-12 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all"
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Mật khẩu</label>
            <Input
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              className="h-12 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all"
              disabled={isSubmitting}
            />
          </div>

          {error && (
            <Alert className="border-red-200 bg-red-50 text-red-800 rounded-xl">
              <Activity className="w-4 h-4" />
              {error}
            </Alert>
          )}
        </CardContent>

        <CardFooter className="flex flex-col gap-3 pt-6 px-0">
          <Button
            type="submit"
            disabled={!canSubmit}
            className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Đang đăng nhập...</span>
              </div>
            ) : (
              <span>Đăng nhập</span>
            )}
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            Chưa có tài khoản?{' '}
            <button
              type="button"
              onClick={(e) => {e.preventDefault(); onSwitchMode && onSwitchMode();}}
              className="text-blue-600 font-medium hover:text-blue-700 hover:underline transition-colors"
            >
              Đăng ký ngay
            </button>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
};

export default Login;
