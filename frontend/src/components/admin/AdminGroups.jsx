import { useEffect, useState } from 'react';
import axios from 'axios';
import { ADMIN_API, APPLICATION_API } from '@/utils/constant';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Avatar, AvatarImage } from '../ui/avatar';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Search, UserPlus, UserMinus, Users, MessageSquare, CheckCircle2, XCircle, FileText } from 'lucide-react';
import AdminLayout from './AdminLayout';

const AdminGroups = () => {
  const [groups, setGroups] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddMemberDialog, setShowAddMemberDialog] = useState(false);
  const [showRemoveMemberDialog, setShowRemoveMemberDialog] = useState(false);
  const [showViewMembersDialog, setShowViewMembersDialog] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [addingMembers, setAddingMembers] = useState(false);
  const [showApplicationsDialog, setShowApplicationsDialog] = useState(false);
  const [applications, setApplications] = useState([]);
  const [loadingApplications, setLoadingApplications] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(null);

  useEffect(() => {
    fetchGroups();
    fetchUsers();
  }, []);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${ADMIN_API}/groups`, {
        withCredentials: true
      });
      if (res.data.success) {
        setGroups(res.data.groups);
      }
    } catch (error) {
      console.log(error);
      toast.error("Không tải được danh sách nhóm");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${ADMIN_API}/users`, {
        withCredentials: true
      });
      if (res.data.success) {
        setUsers(res.data.users);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddMembers = async () => {
    if (selectedUsers.length === 0) {
      toast.error("Vui lòng chọn ít nhất một người dùng");
      return;
    }

    setAddingMembers(true);
    try {
      // Add users one by one
      const promises = selectedUsers.map(userId =>
        axios.post(
          `${ADMIN_API}/groups/member`,
          {
            groupId: selectedGroup._id,
            userId: userId
          },
          { withCredentials: true }
        )
      );

      const results = await Promise.allSettled(promises);
      const successful = results.filter(r => r.status === 'fulfilled' && r.value.data.success).length;
      const failed = results.length - successful;

      if (successful > 0) {
        toast.success(`Thêm thành công ${successful} người dùng${failed > 0 ? `, ${failed} thất bại` : ''}`);
        setShowAddMemberDialog(false);
        setSelectedUsers([]);
        setUserSearchTerm('');
        setSelectedGroup(null);
        fetchGroups();
      } else {
        toast.error("Thêm người dùng thất bại");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Thêm người dùng thất bại");
    } finally {
      setAddingMembers(false);
    }
  };

  const handleRemoveMember = async () => {
    try {
      const res = await axios.delete(
        `${ADMIN_API}/groups/${selectedGroup._id}/member/${selectedMember._id}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success("Xóa thành viên khỏi nhóm thành công");
        setShowRemoveMemberDialog(false);
        setSelectedMember(null);

        // Update selectedGroup with fresh data from backend
        if (res.data.group) {
          setSelectedGroup(res.data.group);
        } else if (selectedGroup) {
          // Fallback: manually filter out the removed member
          setSelectedGroup({
            ...selectedGroup,
            members: selectedGroup.members.filter(
              (member) => member._id !== selectedMember._id
            )
          });
        }

        // Refresh groups list
        await fetchGroups();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Xóa thành viên khỏi nhóm thất bại");
    }
  };

  const toggleUserSelection = (userId) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const selectAllUsers = () => {
    const availableUsers = getAvailableUsers();
    if (selectedUsers.length === availableUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(availableUsers.map(u => u._id));
    }
  };

  const getAvailableUsers = () => {
    return users.filter(user =>
      !selectedGroup?.members?.some(m => m._id === user._id) &&
      (userSearchTerm === '' ||
        user.fullname?.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(userSearchTerm.toLowerCase()))
    );
  };

  const fetchApplications = async (dutyId) => {
    if (!dutyId) return;
    try {
      setLoadingApplications(true);
      const res = await axios.get(`${APPLICATION_API}/${dutyId}/applicants`, {
        withCredentials: true
      });
      if (res.data.success) {
        setApplications(res.data.duty?.applications || []);
      }
    } catch (error) {
      console.log(error);
      toast.error("Không tải được danh sách đơn đăng ký");
    } finally {
      setLoadingApplications(false);
    }
  };

  const handleViewApplications = (group) => {
    setSelectedGroup(group);
    if (group.duty?._id) {
      fetchApplications(group.duty._id);
      setShowApplicationsDialog(true);
    } else {
      toast.error("Không có thông tin hoạt động");
    }
  };

  const handleUpdateApplicationStatus = async (applicationId, status) => {
    try {
      setUpdatingStatus(applicationId);
      const res = await axios.post(
        `${APPLICATION_API}/status/${applicationId}/update`,
        { status },
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success("Cập nhật trạng thái đơn thành công");
        // Refresh applications and groups
        if (selectedGroup?.duty?._id) {
          await fetchApplications(selectedGroup.duty._id);
        }
        await fetchGroups();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Cập nhật trạng thái đơn thất bại");
    } finally {
      setUpdatingStatus(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'accepted':
        return <Badge className="bg-green-100 text-green-700">Đã duyệt</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-700">Từ chối</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-700">Đang chờ</Badge>;
    }
  };

  const filteredGroups = groups.filter(group =>
    group.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.duty?.tittle?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <h1 className="text-3xl font-bold text-gray-900">Quản lý nhóm</h1>
            <p className="text-gray-600 mt-2">Quản lý tất cả nhóm tình nguyện và thành viên</p>
          </div>
        </div>

        {/* Search */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Tìm nhóm theo tên hoặc hoạt động..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Groups Table */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nhóm</TableHead>
                <TableHead>Hoạt động</TableHead>
                <TableHead>Thành viên</TableHead>
                <TableHead>Người tạo</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead className="text-center">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredGroups.length > 0 ? (
                filteredGroups.map((group) => (
                  <TableRow key={group._id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#467057] rounded-lg flex-shrink-0">
                          <MessageSquare className="h-5 w-5 text-white" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 truncate">{group.name}</p>
                          {group.description && (
                            <p className="text-sm text-gray-500 truncate max-w-xs">{group.description}</p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium text-gray-900">{group.duty?.tittle || 'N/A'}</p>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-[#467057]" />
                        <span className="font-medium">{group.members?.length || 0}</span>
                        <span className="text-gray-500 text-sm">thành viên</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-gray-700">{group.created_by?.fullname || 'N/A'}</p>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {new Date(group.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewApplications(group)}
                          className="border-blue-300 text-blue-700 hover:bg-blue-50"
                        >
                          <FileText className="h-4 w-4 mr-1" />
                          Đơn đăng ký
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedGroup(group);
                            setShowViewMembersDialog(true);
                          }}
                        >
                          <Users className="h-4 w-4 mr-1" />
                          Thành viên
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => {
                            setSelectedGroup(group);
                            setSelectedUsers([]);
                            setUserSearchTerm('');
                            setShowAddMemberDialog(true);
                          }}
                          className="bg-[#467057] hover:bg-[#2A4B37]"
                        >
                          <UserPlus className="h-4 w-4 mr-1" />
                          Thêm
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <MessageSquare className="h-12 w-12 text-gray-300" />
                      <p className="text-lg font-medium">Không tìm thấy nhóm</p>
                      <p className="text-sm">Hãy thử thay đổi từ khóa tìm kiếm</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* View Members Dialog */}
        <Dialog open={showViewMembersDialog} onOpenChange={setShowViewMembersDialog}>
          <DialogContent className="max-w-3xl max-h-[80vh]">
            <DialogHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#467057] rounded-lg">
                  <MessageSquare className="h-6 w-6 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-2xl">{selectedGroup?.name}</DialogTitle>
                  <DialogDescription className="mt-1">
                    Quản lý thành viên nhóm (tổng {selectedGroup?.members?.length || 0})
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              {selectedGroup?.members && selectedGroup.members.length > 0 ? (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {selectedGroup.members.map((member) => (
                    <div
                      key={member._id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <Avatar className="w-12 h-12 flex-shrink-0">
                          <AvatarImage src={member.profile?.profilePhoto} />
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 truncate">{member.fullname}</p>
                          <p className="text-sm text-gray-500 truncate">{member.email}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 flex-shrink-0"
                        onClick={() => {
                          setSelectedMember(member);
                          setShowRemoveMemberDialog(true);
                        }}
                      >
                        <UserMinus className="h-4 w-4 mr-1" />
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>Chưa có thành viên trong nhóm này</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Add Members Dialog */}
        <Dialog open={showAddMemberDialog} onOpenChange={setShowAddMemberDialog}>
          <DialogContent className="max-w-3xl max-h-[85vh]">
            <DialogHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#467057] rounded-lg">
                  <UserPlus className="h-6 w-6 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-2xl">Thêm thành viên vào nhóm</DialogTitle>
                  <DialogDescription className="mt-1">
                    Chọn một hoặc nhiều người dùng để thêm vào <span className="font-semibold">{selectedGroup?.name}</span>
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              {/* Search and Select All */}
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Tìm kiếm người dùng theo tên hoặc email..."
                    value={userSearchTerm}
                    onChange={(e) => setUserSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={selectAllUsers}
                  className="whitespace-nowrap"
                >
                  {selectedUsers.length === getAvailableUsers().length && getAvailableUsers().length > 0
                    ? 'Bỏ chọn tất cả'
                    : 'Chọn tất cả'}
                </Button>
              </div>

              {/* Selected Count Badge */}
              {selectedUsers.length > 0 && (
                <div className="flex items-center gap-2">
                  <Badge className="bg-[#467057] text-white">
                    Đã chọn {selectedUsers.length} người dùng
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedUsers([])}
                    className="h-6 px-2 text-xs"
                  >
                    Xóa chọn
                  </Button>
                </div>
              )}

              {/* Users List */}
              <div className="border border-gray-200 rounded-lg max-h-96 overflow-y-auto">
                {getAvailableUsers().length > 0 ? (
                  <div className="divide-y divide-gray-200">
                    {getAvailableUsers().map((user) => (
                      <div
                        key={user._id}
                        className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${selectedUsers.includes(user._id) ? 'bg-[#467057]/5' : ''
                          }`}
                        onClick={() => toggleUserSelection(user._id)}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center ${selectedUsers.includes(user._id)
                            ? 'bg-[#467057] border-[#467057]'
                            : 'border-gray-300'
                            }`}>
                            {selectedUsers.includes(user._id) && (
                              <CheckCircle2 className="h-4 w-4 text-white" />
                            )}
                          </div>
                          <Avatar className="w-10 h-10 flex-shrink-0">
                            <AvatarImage src={user.profile?.profilePhoto} />
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 truncate">{user.fullname}</p>
                            <p className="text-sm text-gray-500 truncate">{user.email}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <Users className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p>Không có người dùng khả dụng để thêm</p>
                    <p className="text-sm mt-1">
                      {userSearchTerm ? 'Hãy thử từ khóa khác' : 'Tất cả người dùng đã là thành viên'}
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAddMemberDialog(false);
                    setSelectedUsers([]);
                    setUserSearchTerm('');
                    setSelectedGroup(null);
                  }}
                  disabled={addingMembers}
                >
                  Hủy
                </Button>
                <Button
                  onClick={handleAddMembers}
                  className="bg-[#467057] hover:bg-[#2A4B37]"
                  disabled={selectedUsers.length === 0 || addingMembers}
                >
                  {addingMembers ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Đang thêm...
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Thêm {selectedUsers.length > 0 ? `${selectedUsers.length} ` : ''}thành viên
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Applications Dialog */}
        <Dialog open={showApplicationsDialog} onOpenChange={setShowApplicationsDialog}>
          <DialogContent className="max-w-5xl max-h-[90vh] flex flex-col p-0">
            <DialogHeader className="px-6 pt-6 pb-4 flex-shrink-0 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <DialogTitle className="text-2xl truncate">Đơn đăng ký cho {selectedGroup?.duty?.tittle || 'Hoạt động'}</DialogTitle>
                  <DialogDescription className="mt-1">
                    Xem và quản lý đơn đăng ký cho hoạt động này (tổng {applications.length})
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
            <div className="flex-1 overflow-hidden flex flex-col px-6 py-4">
              {loadingApplications ? (
                <div className="flex items-center justify-center py-12 flex-1">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#467057]"></div>
                </div>
              ) : applications.length > 0 ? (
                <div className="space-y-3 overflow-y-auto flex-1 pr-2 custom-scrollbar">
                  {applications.map((application) => (
                    <div
                      key={application._id}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
                    >
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <Avatar className="w-12 h-12 flex-shrink-0">
                          <AvatarImage src={application.applicant?.profile?.profilePhoto} />
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <p className="font-semibold text-gray-900 truncate">{application.applicant?.fullname || 'Unknown'}</p>
                            {getStatusBadge(application.status)}
                          </div>
                          <p className="text-sm text-gray-500 truncate">{application.applicant?.email || 'N/A'}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            Ngày nộp: {new Date(application.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0 sm:ml-4">
                        {application.status === 'pending' ? (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUpdateApplicationStatus(application._id, 'accepted')}
                              disabled={updatingStatus === application._id}
                              className="border-green-300 text-green-700 hover:bg-green-50 whitespace-nowrap"
                            >
                              {updatingStatus === application._id ? (
                                <div className="h-4 w-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <>
                                  <CheckCircle2 className="h-4 w-4 mr-1" />
                                  Chấp nhận
                                </>
                              )}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUpdateApplicationStatus(application._id, 'rejected')}
                              disabled={updatingStatus === application._id}
                              className="border-red-300 text-red-700 hover:bg-red-50 whitespace-nowrap"
                            >
                              {updatingStatus === application._id ? (
                                <div className="h-4 w-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <>
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Từ chối
                                </>
                              )}
                            </Button>
                          </>
                        ) : (
                          <div className="text-sm text-gray-500 italic whitespace-nowrap">
                            {application.status === 'accepted' ? 'Đã được duyệt' : 'Đã bị từ chối'}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500 flex-1 flex items-center justify-center">
                  <div>
                    <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p>Không có đơn đăng ký cho hoạt động này</p>
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 flex-shrink-0">
              <Button
                variant="outline"
                onClick={() => {
                  setShowApplicationsDialog(false);
                  setApplications([]);
                  setSelectedGroup(null);
                }}
              >
                Đóng
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Remove Member Dialog */}
        <Dialog open={showRemoveMemberDialog} onOpenChange={setShowRemoveMemberDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Xóa thành viên</DialogTitle>
              <DialogDescription>
                Bạn có chắc muốn xóa <span className="font-semibold">{selectedMember?.fullname}</span> khỏi{' '}
                <span className="font-semibold">{selectedGroup?.name}</span>? Hành động này không thể hoàn tác.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setShowRemoveMemberDialog(false);
                  setSelectedMember(null);
                }}
              >
                Hủy
              </Button>
              <Button
                variant="destructive"
                onClick={handleRemoveMember}
              >
                <UserMinus className="h-4 w-4 mr-2" />
                Xóa thành viên
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminGroups;
