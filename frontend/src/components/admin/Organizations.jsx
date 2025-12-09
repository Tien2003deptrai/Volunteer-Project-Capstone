import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect, useCallback } from 'react';
import AdminLayout from './AdminLayout';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Search, Plus } from 'lucide-react';
import OrganizationsTable from './OrganizationsTable';
import OrganizationCreateModal from './OrganizationCreateModal';
import axios from 'axios';
import { ORGANIZATION_API } from '@/utils/constant';
import { setOrganizations } from '@/redux/organizationSlice';

const Organizations = () => {
  const dispatch = useDispatch();
  const [input, setInput] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedOrganization, setSelectedOrganization] = useState(null);
  const { organizations } = useSelector((store) => store.organization);

  const fetchOrganizations = useCallback(async () => {
    try {
      const res = await axios.get(`${ORGANIZATION_API}/get`, {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setOrganizations(res.data.organizations));
      }
    } catch (error) {
      console.error('Error fetching organizations:', error);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchOrganizations();
  }, [fetchOrganizations]);

  // Filter logic happens here
  const filteredOrganizations = organizations.filter((organization) => {
    if (!input) return true;
    return organization?.name?.toLowerCase().includes(input.toLowerCase());
  });

  const handleEdit = (organization) => {
    setSelectedOrganization(organization);
    setShowCreateModal(true);
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setSelectedOrganization(null);
  };

  const handleSuccess = () => {
    handleCloseModal();
    // Refresh organizations list
    fetchOrganizations();
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Organizations Management</h1>
            <p className="text-gray-600 mt-2">Manage all organizations</p>
          </div>
          <Button
            onClick={() => {
              setSelectedOrganization(null);
              setShowCreateModal(true);
            }}
            className="bg-[#467057] hover:bg-[#2A4B37]"
          >
            <Plus className="h-4 w-4 mr-2" />
            Register Organization
          </Button>
        </div>

        {/* Search */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search Organization"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Organizations Table */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200">
          <OrganizationsTable
            organizations={filteredOrganizations}
            onEdit={handleEdit}
          />
        </div>
      </div>

      {/* Create/Edit Organization Modal */}
      <OrganizationCreateModal
        open={showCreateModal}
        onOpenChange={handleCloseModal}
        onSuccess={handleSuccess}
        organization={selectedOrganization}
      />
    </AdminLayout>
  );
};

export default Organizations;
