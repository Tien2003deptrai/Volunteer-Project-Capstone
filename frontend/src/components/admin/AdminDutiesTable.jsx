import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Edit2, Trash2, MoreHorizontal } from "lucide-react";
import { useSelector } from "react-redux";
import useGetAllAdminDuties from "@/hooks/useGetAllAdminDuties";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "../ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { toast } from "sonner";
import axios from "axios";
import { DUTY_API } from "@/utils/constant";
import PostDutyModal from "./PostDutyModal";

const AdminDutiesTable = () => {
  const { searchDutyByText } = useSelector((store) => store.duty);
  const { allAdminDuties } = useSelector((store) => store.duty);
  const { isLoading, error, fetchAllAdminDuties } = useGetAllAdminDuties();
  const [filterDuties, setFilterDuties] = useState([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [dutyToDelete, setDutyToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [dutyToEdit, setDutyToEdit] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Show 10 items per page

  useEffect(() => {
    const filtered = Array.isArray(allAdminDuties)
      ? allAdminDuties.filter((duty) => {
        if (!searchDutyByText) return true;
        return (
          duty?.tittle
            ?.toLowerCase()
            .includes(searchDutyByText.toLowerCase()) ||
          duty?.organization?.name
            ?.toLowerCase()
            ?.includes(searchDutyByText.toLowerCase())
        );
      })
      : [];
    setFilterDuties(filtered);
    setCurrentPage(1); // Reset to first page when filter changes
  }, [allAdminDuties, searchDutyByText]);

  // Calculate pagination
  const totalPages = Math.ceil(filterDuties.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDuties = filterDuties.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEditClick = (duty) => {
    setDutyToEdit(duty);
    setShowEditModal(true);
  };

  const handleDeleteClick = (duty) => {
    setDutyToDelete(duty);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!dutyToDelete) return;

    try {
      setIsDeleting(true);
      const res = await axios.delete(`${DUTY_API}/delete/${dutyToDelete._id}`, {
        withCredentials: true,
      });
      if (res.data.success) {
        toast.success("Xóa hoạt động thành công");
        setShowDeleteDialog(false);
        setDutyToDelete(null);
        // Refresh the list
        fetchAllAdminDuties();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Xóa hoạt động thất bại");
    } finally {
      setIsDeleting(false);
    }
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }

    return (
      <div className="mt-6">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>

            {pages.map((page, index) => (
              <PaginationItem key={index}>
                {page === '...' ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    onClick={() => handlePageChange(page)}
                    isActive={currentPage === page}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
        <div className="text-center mt-4 text-sm text-gray-600">
          Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filterDuties.length)} of {filterDuties.length} duties
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#467057] mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading duties...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="text-red-500 mb-2">⚠️ Error loading duties</div>
        <p className="text-sm text-gray-600">{error}</p>
      </div>
    );
  }

  return (
    <>
      <div className="p-2">
        {/* Mobile Layout */}
        <div className="block lg:hidden space-y-4">
          {currentDuties.length > 0 ? (
            currentDuties.map((duty) => (
              <div
                key={duty._id}
                className="border p-4 rounded-lg shadow-md space-y-1"
              >
                <div className="font-semibold text-lg">
                  {duty?.tittle || "No Title"}
                </div>
                <div className="text-sm text-gray-600">
                  {duty?.organization?.name || "No Organization"}
                </div>
                <div className="text-sm text-gray-500">
                  {duty?.createdAt?.split("T")[0] || "No Date"}
                </div>
                <div className="flex justify-end gap-4 pt-2">
                  <Edit2
                    className="w-4 cursor-pointer text-blue-600 hover:text-blue-800"
                    onClick={() => handleEditClick(duty)}
                  />
                  <Trash2
                    className="w-4 cursor-pointer text-red-600 hover:text-red-800"
                    onClick={() => handleDeleteClick(duty)}
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p className="text-lg font-semibold">No duties found</p>
              <p className="text-sm mt-2">
                {searchDutyByText
                  ? "Try adjusting your search criteria"
                  : "Start by creating your first duty"}
              </p>
            </div>
          )}
          {/* Pagination for Mobile */}
          {renderPagination()}
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <Table>
            <TableCaption>
              Danh sách hoạt động ({filterDuties.length} {filterDuties.length === 1 ? 'hoạt động' : 'hoạt động'})
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Tổ chức</TableHead>
                <TableHead>Tên hoạt động</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentDuties.length > 0 ? (
                currentDuties.map((duty) => (
                  <TableRow key={duty._id}>
                    <TableCell>{duty?.organization?.name || "N/A"}</TableCell>
                    <TableCell>{duty?.tittle || "N/A"}</TableCell>
                    <TableCell>
                      {duty?.createdAt?.split("T")[0] || "N/A"}
                    </TableCell>
                    <TableCell className="text-right cursor-pointer">
                      <Popover>
                        <PopoverTrigger>
                          <MoreHorizontal />
                        </PopoverTrigger>
                        <PopoverContent className="w-32">
                          <div className="flex flex-col items-start gap-2">
                            <div
                              onClick={() => handleEditClick(duty)}
                              className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded w-full"
                            >
                              <Edit2 className="w-4 text-blue-600" />
                              <span>Sửa</span>
                            </div>
                            <div
                              onClick={() => handleDeleteClick(duty)}
                              className="flex items-center gap-2 cursor-pointer hover:bg-red-50 p-2 rounded w-full"
                            >
                              <Trash2 className="w-4 text-red-600" />
                              <span className="text-red-600">Xóa</span>
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    <div className="text-gray-500">
                      <p className="text-lg font-semibold">No duties found</p>
                      <p className="text-sm mt-2">
                        {searchDutyByText
                          ? "Try adjusting your search criteria"
                          : "Start by creating your first duty"}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          {/* Pagination for Desktop */}
          {renderPagination()}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600 flex items-center gap-2">
              <Trash2 className="h-5 w-5" />
              Xác nhận xóa hoạt động
            </DialogTitle>
            <DialogDescription className="pt-4">
              Bạn có chắc chắn muốn xóa hoạt động{" "}
              <span className="font-semibold text-gray-900">
                &quot;{dutyToDelete?.tittle}&quot;
              </span>
              ? <br />
              <br />
              <span className="text-red-600 font-medium">
                Lưu ý: Tất cả đơn đăng ký và nhóm liên quan cũng sẽ bị xóa. Hành động này không thể hoàn tác.
              </span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteDialog(false);
                setDutyToDelete(null);
              }}
              disabled={isDeleting}
            >
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Đang xóa...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Xóa hoạt động
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Duty Modal */}
      <PostDutyModal
        open={showEditModal}
        onOpenChange={(open) => {
          setShowEditModal(open);
          if (!open) setDutyToEdit(null);
        }}
        onSuccess={() => {
          fetchAllAdminDuties();
        }}
        dutyToEdit={dutyToEdit}
      />
    </>
  );
};

export default AdminDutiesTable;
