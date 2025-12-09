import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { ORGANIZATION_API } from '@/utils/constant';
import { toast } from 'sonner';
import { setSingleOrganization } from '@/redux/organizationSlice';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Avatar, AvatarImage } from '../ui/avatar';
import { Building2, Loader2, Upload, X } from 'lucide-react';

/* eslint-disable react/prop-types */
const OrganizationCreateModal = ({ open, onOpenChange, onSuccess, organization = null }) => {
  const isEditMode = !!organization;
  const [input, setInput] = useState({
    name: '',
    description: '',
    location: '',
    website: '',
    logo: null
  });
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (open) {
      if (isEditMode && organization) {
        setInput({
          name: organization.name || '',
          description: organization.description || '',
          location: organization.location || '',
          website: organization.website || '',
          logo: organization.logo || ''
        });
        setLogoPreview(organization.logo || '');
        setLogoFile(null);
      } else {
        setInput({
          name: '',
          description: '',
          location: '',
          website: '',
          logo: null
        });
        setLogoPreview('');
        setLogoFile(null);
      }
    }
  }, [open, isEditMode, organization]);

  const eventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setLogoFile(null);
    setLogoPreview(isEditMode && organization?.logo ? organization.logo : '');
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!input.name.trim()) {
      toast.error("Organization name is required");
      return;
    }

    setLoading(true);
    try {
      if (isEditMode) {
        // Update organization
        const formData = new FormData();
        formData.append('name', input.name);
        formData.append('description', input.description || '');
        formData.append('location', input.location || '');
        formData.append('website', input.website || '');
        if (logoFile) {
          formData.append('file', logoFile);
        }

        const res = await axios.put(
          `${ORGANIZATION_API}/update/${organization._id}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            withCredentials: true,
          }
        );

        if (res.data.success) {
          dispatch(setSingleOrganization(res.data.organization));
          toast.success(res.data.message || 'Organization updated successfully');
          handleClose();
          if (onSuccess) onSuccess(res.data.organization);
        }
      } else {
        // Create organization
        const res = await axios.post(
          `${ORGANIZATION_API}/register`,
          { organizationName: input.name },
          {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
          }
        );

        if (res.data.success) {
          dispatch(setSingleOrganization(res.data.organization));
          toast.success(res.data.message || 'Organization created successfully');
          handleClose();
          if (onSuccess) onSuccess(res.data.organization);
        }
      }
    } catch (error) {
      console.log(error);
      const err = error.response?.data?.message || 'Something went wrong';
      toast.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setInput({
        name: '',
        description: '',
        location: '',
        website: '',
        logo: null
      });
      setLogoPreview('');
      setLogoFile(null);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#467057] rounded-lg">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-2xl">
                {isEditMode ? 'Edit Organization' : 'Register New Organization'}
              </DialogTitle>
              <DialogDescription className="mt-1">
                {isEditMode
                  ? 'Update organization information'
                  : 'Create a new organization to post volunteer duties'}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={submitHandler} className="space-y-6 mt-4">
          {/* Logo Upload */}
          <div className="space-y-2">
            <Label className="text-base font-semibold">Logo</Label>
            <div className="flex items-center gap-4">
              {(logoPreview || (isEditMode && organization?.logo)) && (
                <div className="relative">
                  <Avatar className="w-20 h-20 border-2 border-gray-200">
                    <AvatarImage src={logoPreview || organization?.logo} />
                  </Avatar>
                  {logoFile && (
                    <button
                      type="button"
                      onClick={removeLogo}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              )}
              <div className="flex-1">
                <Label
                  htmlFor="logo-upload"
                  className="flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#467057] transition-colors"
                >
                  <Upload className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {logoFile ? 'Change logo' : 'Upload logo'}
                  </span>
                </Label>
                <Input
                  id="logo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={loading}
                />
              </div>
            </div>
            <p className="text-sm text-gray-500">
              Upload your organization logo (optional)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name" className="text-base font-semibold">
              Organization Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              type="text"
              name="name"
              value={input.name}
              onChange={eventHandler}
              placeholder="Enter organization name"
              className="h-11"
              required
              disabled={loading}
            />
            <p className="text-sm text-gray-500">
              This name will be displayed on all your posted duties
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location" className="text-base font-semibold">
                Location
              </Label>
              <Input
                id="location"
                type="text"
                name="location"
                value={input.location}
                onChange={eventHandler}
                placeholder="City, Country"
                className="h-11"
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="website" className="text-base font-semibold">
                Website
              </Label>
              <Input
                id="website"
                type="url"
                name="website"
                value={input.website}
                onChange={eventHandler}
                placeholder="https://example.com"
                className="h-11"
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-base font-semibold">
              Description
            </Label>
            <Textarea
              id="description"
              name="description"
              value={input.description}
              onChange={eventHandler}
              placeholder="Tell us about your organization..."
              rows={4}
              disabled={loading}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
              className="min-w-[100px]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#467057] hover:bg-[#2A4B37] min-w-[100px]"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditMode ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                isEditMode ? 'Update Organization' : 'Create Organization'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default OrganizationCreateModal;
