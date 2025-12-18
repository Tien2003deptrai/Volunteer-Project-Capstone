import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'sonner';
import { DUTY_API } from '@/utils/constant';
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Briefcase, Loader2, MapPin, Clock, Users, Award, FileText } from 'lucide-react';

/* eslint-disable react/prop-types */
const PostDutyModal = ({ open, onOpenChange, onSuccess, dutyToEdit = null }) => {
  const [input, setInput] = useState({
    tittle: '',
    description: '',
    workDuration: '',
    requirements: '',
    location: '',
    jobType: '',
    experienceLevel: '',
    position: '',
    organizationId: ''
  });
  const [loading, setLoading] = useState(false);
  const { organizations } = useSelector((store) => store.organization);
  const isEditMode = !!dutyToEdit;

  useEffect(() => {
    if (open) {
      if (dutyToEdit) {
        // Populate form with duty data for editing
        setInput({
          tittle: dutyToEdit.tittle || '',
          description: dutyToEdit.description || '',
          workDuration: dutyToEdit.workDuration?.toString() || '',
          requirements: Array.isArray(dutyToEdit.requirements)
            ? dutyToEdit.requirements.join(', ')
            : dutyToEdit.requirements || '',
          location: dutyToEdit.location || '',
          jobType: dutyToEdit.jobType || '',
          experienceLevel: dutyToEdit.experienceLevel?.toString() || '',
          position: dutyToEdit.position?.toString() || '',
          organizationId: dutyToEdit.organization?._id || dutyToEdit.organization || ''
        });
      } else {
        // Reset form for new duty
        setInput({
          tittle: '',
          description: '',
          workDuration: '',
          requirements: '',
          location: '',
          jobType: '',
          experienceLevel: '',
          position: '',
          organizationId: ''
        });
      }
    }
  }, [open, dutyToEdit]);

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const selectChangeHandler = (value) => {
    const selectedOrganization = organizations.find(
      (organization) => organization._id === value
    );
    if (selectedOrganization) {
      setInput({ ...input, organizationId: selectedOrganization._id });
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!input.tittle.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!input.description.trim()) {
      toast.error("Description is required");
      return;
    }
    if (!input.organizationId) {
      toast.error("Please select an organization");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        tittle: input.tittle,
        description: input.description,
        workDuration: input.workDuration ? Number(input.workDuration) : '',
        position: input.position ? Number(input.position) : 0,
        experience: input.experienceLevel ? Number(input.experienceLevel) : null,
        location: input.location || '',
        jobType: input.jobType || '',
        organizationId: input.organizationId,
        requirements: input.requirements ? input.requirements.split(',').map(r => r.trim()).filter(r => r).join(',') : ''
      };

      let res;
      if (isEditMode) {
        // Update existing duty
        res = await axios.put(`${DUTY_API}/update/${dutyToEdit._id}`, payload, {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
        });
      } else {
        // Create new duty
        res = await axios.post(`${DUTY_API}/post`, payload, {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
        });
      }

      if (res.data.success) {
        toast.success(res.data.message || (isEditMode ? "Duty updated successfully" : "Duty posted successfully"));
        setInput({
          tittle: '',
          description: '',
          workDuration: '',
          requirements: '',
          location: '',
          jobType: '',
          experienceLevel: '',
          position: '',
          organizationId: ''
        });
        onOpenChange(false);
        if (onSuccess) onSuccess();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || (isEditMode ? "Error updating duty" : "Error posting duty"));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setInput({
        tittle: '',
        description: '',
        workDuration: '',
        requirements: '',
        location: '',
        jobType: '',
        experienceLevel: '',
        position: '',
        organizationId: ''
      });
      onOpenChange(false);
    }
  };

  const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Volunteer', 'Internship'];
  const experienceLevels = [
    { value: 0, label: 'Entry Level (0 years)' },
    { value: 1, label: 'Junior (1-2 years)' },
    { value: 2, label: 'Mid-level (3-5 years)' },
    { value: 3, label: 'Senior (5+ years)' }
  ];

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#467057] rounded-lg">
              <Briefcase className="h-6 w-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-2xl">
                {isEditMode ? 'Chỉnh sửa hoạt động' : 'Đăng hoạt động mới'}
              </DialogTitle>
              <DialogDescription className="mt-1">
                {isEditMode ? 'Cập nhật thông tin hoạt động tình nguyện' : 'Tạo hoạt động tình nguyện mới'}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={submitHandler} className="space-y-6 mt-4">
          {/* Organization Selection */}
          {organizations.length > 0 ? (
            <div className="space-y-2">
              <Label className="text-base font-semibold">
                Organization <span className="text-red-500">*</span>
              </Label>
              <Select
                value={input.organizationId}
                onValueChange={selectChangeHandler}
                disabled={loading}
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select an organization" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {organizations.map((organization) => (
                      <SelectItem key={organization._id} value={organization._id}>
                        {organization.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800 font-semibold">
                ⚠️ Please register an organization first before posting duties
              </p>
            </div>
          )}

          {/* Title and Description */}
          <div className="space-y-2">
            <Label htmlFor="tittle" className="text-base font-semibold flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="tittle"
              type="text"
              name="tittle"
              value={input.tittle}
              onChange={changeEventHandler}
              placeholder="e.g., Community Outreach Coordinator"
              className="h-11"
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-base font-semibold">
              Description <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              name="description"
              value={input.description}
              onChange={changeEventHandler}
              placeholder="Describe the duty, responsibilities, and what volunteers will be doing..."
              rows={5}
              required
              disabled={loading}
            />
          </div>

          {/* Requirements */}
          <div className="space-y-2">
            <Label htmlFor="requirements" className="text-base font-semibold">
              Requirements (comma-separated)
            </Label>
            <Input
              id="requirements"
              type="text"
              name="requirements"
              value={input.requirements}
              onChange={changeEventHandler}
              placeholder="e.g., Good communication skills, Team player, Basic computer skills"
              className="h-11"
              disabled={loading}
            />
            <p className="text-sm text-gray-500">
              Separate multiple requirements with commas
            </p>
          </div>

          {/* Grid Layout for Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location" className="text-base font-semibold flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Location
              </Label>
              <Input
                id="location"
                type="text"
                name="location"
                value={input.location}
                onChange={changeEventHandler}
                placeholder="City, Country"
                className="h-11"
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="jobType" className="text-base font-semibold">
                Job Type
              </Label>
              <Select
                value={input.jobType}
                onValueChange={(value) => setInput({ ...input, jobType: value })}
                disabled={loading}
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select job type" />
                </SelectTrigger>
                <SelectContent>
                  {jobTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="workDuration" className="text-base font-semibold flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Work Duration (hours)
              </Label>
              <Input
                id="workDuration"
                type="number"
                name="workDuration"
                value={input.workDuration}
                onChange={changeEventHandler}
                placeholder="e.g., 40"
                className="h-11"
                min="1"
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="experienceLevel" className="text-base font-semibold flex items-center gap-2">
                <Award className="h-4 w-4" />
                Experience Level
              </Label>
              <Select
                value={input.experienceLevel.toString()}
                onValueChange={(value) => setInput({ ...input, experienceLevel: value })}
                disabled={loading}
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select experience level" />
                </SelectTrigger>
                <SelectContent>
                  {experienceLevels.map((level) => (
                    <SelectItem key={level.value} value={level.value.toString()}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="position" className="text-base font-semibold flex items-center gap-2">
                <Users className="h-4 w-4" />
                Number of Slots
              </Label>
              <Input
                id="position"
                type="number"
                name="position"
                value={input.position}
                onChange={changeEventHandler}
                placeholder="e.g., 5"
                className="h-11"
                min="1"
                disabled={loading}
              />
            </div>
          </div>

          {/* Action Buttons */}
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
              className="bg-[#467057] hover:bg-[#2A4B37] min-w-[120px]"
              disabled={loading || organizations.length === 0}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditMode ? 'Đang cập nhật...' : 'Đang đăng...'}
                </>
              ) : (
                isEditMode ? 'Cập nhật' : 'Đăng hoạt động'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PostDutyModal;

