import { useEffect, useState } from 'react'
import { DUTY_API } from '@/utils/constant'
import axios from 'axios'

const useGetFilterOptions = () => {
  const [filterOptions, setFilterOptions] = useState({
    locations: [],
    jobTypes: [],
    experienceLevels: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${DUTY_API}/filters`, { withCredentials: true });
        if (res.data.success) {
          setFilterOptions(res.data.filters);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchFilterOptions();
  }, []);

  return { filterOptions, loading };
}

export default useGetFilterOptions

