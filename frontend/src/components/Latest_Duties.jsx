// Latest_Duties.jsx
import React from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import DutyCards from "./DutyCards";
import useGetAllDuties from "@/hooks/useGetAllDuties";

const Latest_Duties = () => {
  const { allDuties } = useSelector((store) => store.duty);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center max-w-7xl mx-auto my-10 px-4"
    >
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold my-10 text-center"
      >
        <span className="text-[#467057]">Latest & Top</span> Volunteer Duties 
      </motion.h1>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 my-5"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
        }}
      >
        {Array.isArray(allDuties) && allDuties.length > 0 ? (
          allDuties.slice(0, 6).map((duty) => (
            <motion.div
              key={duty._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.7 }}
            >
              <DutyCards duty={duty} />
            </motion.div>
          ))
        ) : (
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.5 }}
          >
            No Duties Available
          </motion.span>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Latest_Duties;