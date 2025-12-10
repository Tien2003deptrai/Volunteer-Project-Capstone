import { useEffect, useState } from 'react';
import axios from 'axios';
import { ADMIN_API, REPORT_API } from '@/utils/constant';
import { toast } from 'sonner';
import { Badge } from '../ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import AdminLayout from './AdminLayout';

const AdminReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${ADMIN_API}/reports`, {
        withCredentials: true
      });
      if (res.data.success) {
        setReports(res.data.reports);
      }
    } catch (error) {
      console.log(error);
      toast.error("Không tải được danh sách báo cáo");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (reportId, status) => {
    try {
      const res = await axios.put(
        `${REPORT_API}/${reportId}/status`,
        { status },
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success("Cập nhật trạng thái báo cáo thành công");
        fetchReports();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Cập nhật trạng thái thất bại");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'reviewed':
        return 'bg-blue-100 text-blue-700';
      case 'resolved':
        return 'bg-green-100 text-green-700';
      case 'dismissed':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending':
        return 'Đang chờ';
      case 'reviewed':
        return 'Đã xem xét';
      case 'resolved':
        return 'Đã giải quyết';
      case 'dismissed':
        return 'Đã bỏ qua';
      default:
        return status;
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

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Quản lý báo cáo</h1>
            <p className="text-gray-600 mt-2">Xem và xử lý nội dung bị báo cáo</p>
          </div>
        </div>

        {/* Reports Table */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Người báo cáo</TableHead>
                <TableHead>Lý do</TableHead>
                <TableHead>Mô tả</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.length > 0 ? (
                reports.map((report) => (
                  <TableRow key={report._id}>
                    <TableCell>
                      <div>
                        <p className="font-semibold text-gray-900">{report.reportedBy?.fullname}</p>
                        <p className="text-sm text-gray-500">{report.reportedBy?.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="capitalize">{report.reason}</span>
                    </TableCell>
                    <TableCell>
                      <p className="max-w-xs truncate">{report.description || 'N/A'}</p>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(report.status)}>
                        {getStatusLabel(report.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {new Date(report.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Select
                          value={report.status}
                          onValueChange={(value) => handleStatusUpdate(report._id, value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder="Chọn trạng thái" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Đang chờ</SelectItem>
                            <SelectItem value="reviewed">Đã xem xét</SelectItem>
                            <SelectItem value="resolved">Đã giải quyết</SelectItem>
                            <SelectItem value="dismissed">Đã bỏ qua</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    Không tìm thấy báo cáo
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminReports;

