import { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import useGetAllAdminDuties from "@/hooks/useGetAllAdminDuties";
import { useDispatch } from "react-redux";
import { setSearchDutyByText } from "@/redux/dutySlice";
import AdminDutiesTable from "./AdminDutiesTable";
import { Search, Plus } from 'lucide-react';
import PostDutyModal from "./PostDutyModal";

const AdminDuties = () => {
  useGetAllAdminDuties();
  const [input, setInput] = useState("");
  const [showPostModal, setShowPostModal] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setSearchDutyByText(input));
  }, [input, dispatch]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Duties Management</h1>
            <p className="text-gray-600 mt-2">Manage all volunteer duties</p>
          </div>
          <Button
            onClick={() => setShowPostModal(true)}
            className="bg-[#467057] hover:bg-[#2A4B37]"
          >
            <Plus className="h-4 w-4 mr-2" />
            Post New Duty
          </Button>
        </div>

        {/* Search */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Filter by organization, role"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Duties Table */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200">
          <AdminDutiesTable />
        </div>
      </div>

      {/* Post Duty Modal */}
      <PostDutyModal
        open={showPostModal}
        onOpenChange={setShowPostModal}
        onSuccess={() => {
          // Refresh duties list if needed
          window.location.reload();
        }}
      />
    </AdminLayout>
  );
};

export default AdminDuties;
