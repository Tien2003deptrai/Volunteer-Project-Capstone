import React, { useEffect } from 'react';
import { setOrganizations } from '@/redux/organizationSlice';
import { ORGANIZATION_API } from '@/utils/constant';
import axios from 'axios';
import { useDispatch } from 'react-redux';


const useGetAllOrganizations = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchOrganizations = async () => {
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
    };

    fetchOrganizations(); 
  }, [dispatch]); 
};

export default useGetAllOrganizations;
