import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardFooter, Input, Alert, Button } from '../ui';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Loader2, Brain, Activity, UserPlus } from 'lucide-react';
import { toast } from 'sonner';

interface RegisterProps {
  onClose?: () => void;
  onSwitchMode?: () => void;
}

const Register = ({ onClose, onSwitchMode }: RegisterProps) => {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    password: '',
    email: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const canSubmit = !!form.firstName && !!form.lastName && !!form.password && !!form.email && !isSubmitting;
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError(''); // Clear error when user starts typing
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) {
      setError('Hãy nhập đầy đủ thông tin bắt buộc!');
      return;
    }
    setError('');
    setIsSubmitting(true);

    try {
      const fullname = `${form.lastName} ${form.firstName}`.trim();
      await register({
        email: form.email,
        password: form.password,
        fullname: fullname || undefined,
      });

      toast.success('Đăng ký thành công! Chào mừng bạn đến với AI Agent Y Sinh SPOKE', {
        description: 'Vui lòng đăng nhập để bắt đầu sử dụng.',
        duration: 4000,
      });

      if (onClose) onClose();
      navigate('/login');
    } catch (error: any) {
      const errorMessage = error?.response?.data?.detail || 'Đăng ký thất bại. Vui lòng thử lại.';
      setError(errorMessage);
      toast.error('Đăng ký thất bại', {
        description: 'Vui lòng kiểm tra thông tin và thử lại.',
        duration: 4000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="relative w-full max-w-md rounded-2xl p-8 shadow-2xl pt-8 bg-gradient-to-br from-white to-purple-50/30 border-0">
      {/* Header with AI Icon */}
      <div className="flex items-center justify-center mb-6">
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full blur opacity-25"></div>
          <div className="relative bg-gradient-to-r from-purple-600 to-blue-600 p-3 rounded-full">
            <UserPlus className="w-8 h-8 text-white" />
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
          <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Tham gia AI Agent Y Sinh SPOKE
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Tạo tài khoản để khám phá kiến thức y sinh với AI
          </p>
        </CardHeader>

        <CardContent className="space-y-4 p-0">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Họ</label>
              <Input
                type="text"
                name="lastName"
                placeholder="Nguyễn"
                value={form.lastName}
                onChange={handleChange}
                className="h-11 rounded-xl border-gray-200 focus:border-purple-500 focus:ring-purple-500/20 transition-all"
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Tên</label>
              <Input
                type="text"
                name="firstName"
                placeholder="Văn A"
                value={form.firstName}
                onChange={handleChange}
                className="h-11 rounded-xl border-gray-200 focus:border-purple-500 focus:ring-purple-500/20 transition-all"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <Input
              type="email"
              name="email"
              placeholder="your@email.com"
              value={form.email}
              onChange={handleChange}
              className="h-11 rounded-xl border-gray-200 focus:border-purple-500 focus:ring-purple-500/20 transition-all"
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
              className="h-11 rounded-xl border-gray-200 focus:border-purple-500 focus:ring-purple-500/20 transition-all"
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
            className="w-full h-12 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Đang tạo tài khoản...</span>
              </div>
            ) : (
              <span>Tạo tài khoản</span>
            )}
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            Đã có tài khoản?{' '}
            <button
              type="button"
              onClick={(e) => {e.preventDefault(); onSwitchMode && onSwitchMode();}}
              className="text-purple-600 font-medium hover:text-purple-700 hover:underline transition-colors"
            >
              Đăng nhập ngay
            </button>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
};

export default Register;
