import { setSingleOrganization } from '@/redux/organizationSlice';
import { ORGANIZATION_API } from '@/utils/constant';
import axios from 'axios';
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'

const useGetOrganizationById = (organizationId) => {
  const dispatch = useDispatch();
  useEffect(()=>{
    const fetchOrganizationById = async() =>{
        try {
            const res = await axios.get(`${ORGANIZATION_API}/get/${organizationId}`,{withCredentials:true});
            if(res.data.success){
                dispatch(setSingleOrganization(res.data.organization));
            }
        } catch (error) {
            console.log(error);
        }
    }
    fetchOrganizationById();
  },[organizationId, dispatch]);
}

export default useGetOrganizationById