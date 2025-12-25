import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, MessageSquare, Database, Zap, ArrowRight, Sparkles, Activity, Users } from 'lucide-react';
import Login from '../components/Auth/Login';
import Register from '../components/Auth/Register';

const Guest = () => {
  const [showLogin, setShowLogin] = useState(true);
  const navigate = useNavigate();

  const features = [
    {
      icon: Brain,
      title: 'AI Thông Minh',
      description: 'Công nghệ AI tiên tiến phân tích và trả lời các câu hỏi y sinh một cách chính xác và khoa học.'
    },
    {
      icon: Database,
      title: 'Đồ Thị Tri Thức SPOKE',
      description: 'Kết nối với cơ sở dữ liệu y sinh khổng lồ của SPOKE, cung cấp kiến thức cập nhật nhất.'
    },
    {
      icon: MessageSquare,
      title: 'Tương Tác Tự Nhiên',
      description: 'Giao tiếp bằng tiếng Việt một cách tự nhiên, dễ hiểu với các chuyên gia y tế.'
    },
    {
      icon: Zap,
      title: 'Phản Hồi Nhanh',
      description: 'Xử lý câu hỏi phức tạp chỉ trong vài giây với độ chính xác cao.'
    }
  ];

  const stats = [
    { icon: Users, value: '10K+', label: 'Người dùng tin tưởng' },
    { icon: MessageSquare, value: '1M+', label: 'Câu hỏi đã trả lời' },
    { icon: Database, value: '50M+', label: 'Dữ liệu y sinh' },
    { icon: Activity, value: '99.5%', label: 'Độ chính xác' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="relative z-10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur opacity-25"></div>
              <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-full">
                <Brain className="w-6 h-6 text-white" />
              </div>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Agent Y Sinh SPOKE
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowLogin(true)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                showLogin
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              Đăng nhập
            </button>
            <button
              onClick={() => setShowLogin(false)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                !showLogin
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
              }`}
            >
              Đăng ký
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Hero Content */}
          <div className="space-y-8">
            {/* Hero Title */}
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                AI Y Sinh Thế Hệ Mới
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Trợ Lý AI
                </span>
                <br />
                <span className="text-gray-900">Chuyên Khoa Y Sinh</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Khám phá kiến thức y sinh với công nghệ AI tiên tiến, kết hợp với đồ thị tri thức SPOKE
                để đưa ra câu trả lời chính xác và khoa học nhất.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setShowLogin(true)}
                className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
              >
                Bắt Đầu Trải Nghiệm
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-8 py-4 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all duration-200">
                Tìm Hiểu Thêm
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg">
                    <stat.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Auth Form */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-md">
              {showLogin ? (
                <Login onSwitchMode={() => setShowLogin(false)} />
              ) : (
                <Register onSwitchMode={() => setShowLogin(true)} />
              )}
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-24 space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-gray-900">
              Tại Sao Chọn AI Agent Y Sinh SPOKE?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Chúng tôi kết hợp công nghệ AI tiên tiến với kiến thức y sinh chuyên sâu
              để mang đến trải nghiệm học tập và nghiên cứu tốt nhất.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group p-6 bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-200 border border-gray-100">
                <div className="flex items-center justify-center w-12 h-12 mb-4 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-24 pt-12 border-t border-gray-200">
          <div className="text-center py-4 text-sm text-gray-500 border-t">
            <p>&copy; {new Date().getFullYear()} ThangTD. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Guest;
