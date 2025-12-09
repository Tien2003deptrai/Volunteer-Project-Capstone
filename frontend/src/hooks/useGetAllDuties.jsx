import { setAllDuties } from '@/redux/dutySlice';
import { DUTY_API } from '@/utils/constant';
import axios from 'axios';
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const useGetAllDuties = () => {
  const dispatch = useDispatch();
  const { searchedQuery, locationFilter, jobTypeFilter, experienceFilter } = useSelector(store => store.duty);
  useEffect(() => {
    const fetchAllDuties = async () => {
      try {
        const params = new URLSearchParams();

        if (searchedQuery) {
          params.append('keyword', searchedQuery);
        }
        if (locationFilter) {
          params.append('location', locationFilter);
        }
        if (jobTypeFilter) {
          params.append('jobType', jobTypeFilter);
        }
        if (experienceFilter) {
          params.append('experienceLevel', experienceFilter);
        }

        const queryString = params.toString();
        const query = queryString ? `?${queryString}` : "";
        const url = `${DUTY_API}/get${query}`;

        const res = await axios.get(url, { withCredentials: true });
        if (res.data.success) {
          dispatch(setAllDuties(res.data.duties));
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchAllDuties();
  }, [searchedQuery, locationFilter, jobTypeFilter, experienceFilter, dispatch]);
}

export default useGetAllDuties;
