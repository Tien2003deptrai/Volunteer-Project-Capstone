// useGetAllAdminDuties.js
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setAllAdminDuties } from "@/redux/dutySlice";
import { DUTY_API } from "@/utils/constant";
import axios from "axios";

const useGetAllAdminDuties = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAllAdminDuties = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await axios.get(`${DUTY_API}/getadminduties`, {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setAllAdminDuties(res.data.duties)); // Use 'duties' as per getAdminDuties response
      }
    } catch (err) {
      console.error("Error fetching admin duties:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllAdminDuties();
  }, []);

  return { fetchAllAdminDuties, isLoading, error };
};

export default useGetAllAdminDuties;
