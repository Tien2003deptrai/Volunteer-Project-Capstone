import React, { useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useSelector } from 'react-redux'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import axios from 'axios'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { DUTY_API } from '@/utils/constant'

const PostDuty = () => {
    const [input, setInput] = useState({
        tittle: "",
        description: "",
        workDuration: "",
        requirements: "",
        location: "",
        jobType: "",
        experience: "",
        position: 0,
        organizationId: ""
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { organizations } = useSelector((store) => store.organization);

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const selectChangeHandler = (value) => {
        const selectedOrganization = organizations.find((organization) => organization.name.toLowerCase() === value);
        setInput({ ...input, organizationId: selectedOrganization._id });
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await axios.post(`${DUTY_API}/post`, input, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            if (res.data.success) {
                toast.success(res.data.message);
                navigate("/admin/duties");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Error posting duties");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen">
            <Navbar />
            <div className='flex justify-center w-full my-5 px-4'>
                <form onSubmit={submitHandler} className='w-full max-w-4xl border border-gray-200 shadow-lg rounded-md p-6 md:p-8'>
                    <h1 className='text-xl font-semibold mb-6 text-center'>Post a New Duty</h1>
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4'>
                        <div>
                            <Label>Title</Label>
                            <Input
                                type="text"
                                name="tittle"
                                value={input.tittle}
                                onChange={changeEventHandler}
                                className="my-1"
                            />
                        </div>
                        <div>
                            <Label>Description</Label>
                            <Input
                                type="text"
                                name="description"
                                value={input.description}
                                onChange={changeEventHandler}
                                className="my-1"
                            />
                        </div>
                        <div>
                            <Label>Work Duration</Label>
                            <Input
                                type="number"
                                name="workDuration"
                                value={input.workDuration}
                                onChange={changeEventHandler}
                                className="my-1"
                            />
                        </div>
                        <div>
                            <Label>Requirements</Label>
                            <Input
                                type="text"
                                name="requirements"
                                value={input.requirements}
                                onChange={changeEventHandler}
                                className="my-1"
                            />
                        </div>
                        <div>
                            <Label>Location</Label>
                            <Input
                                type="text"
                                name="location"
                                value={input.location}
                                onChange={changeEventHandler}
                                className="my-1"
                            />
                        </div>
                        <div>
                            <Label>Duty Type</Label>
                            <Input
                                type="text"
                                name="jobType"
                                value={input.jobType}
                                onChange={changeEventHandler}
                                className="my-1"
                            />
                        </div>
                        <div>
                            <Label>Experience</Label>
                            <Input
                                type="text"
                                name="experience"
                                value={input.experience}
                                onChange={changeEventHandler}
                                className="my-1"
                            />
                        </div>
                        <div>
                            <Label>No of Slot</Label>
                            <Input
                                type="number"
                                name="position"
                                value={input.position}
                                onChange={changeEventHandler}
                                className="my-1"
                            />
                        </div>
                        {
                            organizations.length > 0 && (
                                <div className="sm:col-span-2">
                                    <Label>Select Organization</Label>
                                    <Select onValueChange={selectChangeHandler}>
                                        <SelectTrigger className="w-full mt-1">
                                            <SelectValue placeholder="Select a Organization" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {organizations.map((organization) => (
                                                    <SelectItem key={organization._id} value={organization.name.toLowerCase()}>
                                                        {organization.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                            )
                        }
                    </div>
                    {
                        loading ? (
                            <Button className="w-full my-4" disabled>
                                <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait
                            </Button>
                        ) : (
                            <Button type="submit" className="w-full my-4">Post New Duty</Button>
                        )
                    }
                    {
                        organizations.length === 0 &&
                        <p className='text-xs text-red-600 font-bold text-center my-3'>
                            *Please register a company first, before posting jobs
                        </p>
                    }
                </form>
            </div>
        </div>
    );
};

export default PostDuty;