import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ADMIN_API } from '@/utils/constant';
import { toast } from 'sonner';
import {
  Users,
  Briefcase,
  Building2,
  FileText,
  MessageSquare,
  Flag,
  UserCheck,
  TrendingUp
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import AdminLayout from './AdminLayout';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentDuties, setRecentDuties] = useState([]);
  const [recentApplications, setRecentApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${ADMIN_API}/dashboard`, {
        withCredentials: true
      });
      if (res.data.success) {
        setStats(res.data.stats);
        setRecentDuties(res.data.recentDuties || []);
        setRecentApplications(res.data.recentApplications || []);
      }
    } catch (error) {
      console.log(error);
      toast.error("Không tải được dữ liệu bảng điều khiển");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#467057]"></div>
        </div>
      </AdminLayout>
    );
  }

  const statCards = [
    {
      title: 'Tổng người dùng',
      value: stats?.totalUsers || 0,
      icon: Users,
      color: 'bg-blue-500',
      link: '/admin/users'
    },
    {
      title: 'Tổng hoạt động',
      value: stats?.totalDuties || 0,
      icon: Briefcase,
      color: 'bg-green-500',
      link: '/admin/duties'
    },
    {
      title: 'Tổ chức',
      value: stats?.totalOrganizations || 0,
      icon: Building2,
      color: 'bg-purple-500',
      link: '/admin/organizations'
    },
    {
      title: 'Nhóm',
      value: stats?.totalGroups || 0,
      icon: MessageSquare,
      color: 'bg-orange-500',
      link: '/admin/groups'
    },
    {
      title: 'Bài viết',
      value: stats?.totalPosts || 0,
      icon: FileText,
      color: 'bg-pink-500',
      link: '/admin/posts'
    },
    {
      title: 'Báo cáo chờ duyệt',
      value: stats?.pendingReports || 0,
      icon: Flag,
      color: 'bg-red-500',
      link: '/admin/reports'
    },
    {
      title: 'Đơn đăng ký',
      value: stats?.totalApplications || 0,
      icon: UserCheck,
      color: 'bg-indigo-500',
      link: '/admin/duties'
    },
    {
      title: 'Quản trị viên',
      value: stats?.totalAdmins || 0,
      icon: TrendingUp,
      color: 'bg-teal-500',
      link: '/admin/users'
    }
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bảng điều khiển</h1>
          <p className="text-gray-600 mt-2">Chào mừng bạn đến trang quản trị</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card
                key={index}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => navigate(stat.link)}
              >
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </CardTitle>
                  <div className={`${stat.color} p-2 rounded-lg`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Recent Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Duties */}
          <Card>
            <CardHeader>
              <CardTitle>Hoạt động gần đây</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentDuties.length > 0 ? (
                  recentDuties.map((duty) => (
                    <div
                      key={duty._id}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                      onClick={() => navigate(`/description/${duty._id}`)}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">
                          {duty.tittle}
                        </p>
                        <p className="text-sm text-gray-600">
                          {duty.organization?.name} • {duty.created_by?.fullname}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">Chưa có hoạt động gần đây</p>
                )}
              </div>
              <Button
                variant="outline"
                className="w-full mt-4"
                onClick={() => navigate('/admin/duties')}
              >
                Xem tất cả hoạt động
              </Button>
            </CardContent>
          </Card>

          {/* Recent Applications */}
          <Card>
            <CardHeader>
              <CardTitle>Đơn đăng ký gần đây</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentApplications.length > 0 ? (
                  recentApplications.map((app) => (
                    <div
                      key={app._id}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">
                          {app.applicant?.fullname}
                        </p>
                        <p className="text-sm text-gray-600 truncate">
                          Ứng tuyển: {app.duty?.tittle}
                        </p>
                        <span className={`inline-block mt-1 px-2 py-1 text-xs rounded-full ${app.status === 'accepted' ? 'bg-green-100 text-green-700' :
                          app.status === 'rejected' ? 'bg-red-100 text-red-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                          {app.status === 'accepted'
                            ? 'Đã duyệt'
                            : app.status === 'rejected'
                              ? 'Từ chối'
                              : 'Đang chờ'}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">Chưa có đơn đăng ký gần đây</p>
                )}
              </div>
              <Button
                variant="outline"
                className="w-full mt-4"
                onClick={() => navigate('/admin/duties')}
              >
                Xem tất cả đơn đăng ký
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;

