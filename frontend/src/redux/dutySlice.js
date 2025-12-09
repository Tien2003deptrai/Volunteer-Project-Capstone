import { createSlice } from "@reduxjs/toolkit";

const dutySlice = createSlice({
  name: "duty",
  initialState: {
    allDuties: [],
    allAdminDuties: [],
    singleDuty: null,
    searchDutyByText: "",
    allAppliedDuties: [],
    searchedQuery: "",
    locationFilter: "",
    jobTypeFilter: "",
    experienceFilter: "",
  },
  reducers: {
    setAllDuties(state, action) {
      state.allDuties = action.payload;
    },
    setAllAdminDuties(state, action) {
      state.allAdminDuties = action.payload;
    },
    setSingleDuty(state, action) {
      state.singleDuty = action.payload;
    },
    setSearchDutyByText(state, action) {
      state.searchDutyByText = action.payload;
    },
    setAllAppliedDuties(state, action) {
      state.allAppliedDuties = action.payload;
    },
    setSearchedQuery(state, action) {
      state.searchedQuery = action.payload;
    },
    setLocationFilter(state, action) {
      state.locationFilter = action.payload;
    },
    setJobTypeFilter(state, action) {
      state.jobTypeFilter = action.payload;
    },
    setExperienceFilter(state, action) {
      state.experienceFilter = action.payload;
    },
    clearFilters(state) {
      state.locationFilter = "";
      state.jobTypeFilter = "";
      state.experienceFilter = "";
    }
  }
});
export const {
  setAllDuties,
  setAllAdminDuties,
  setSingleDuty,
  setSearchDutyByText,
  setAllAppliedDuties,
  setSearchedQuery,
  setLocationFilter,
  setJobTypeFilter,
  setExperienceFilter,
  clearFilters
} = dutySlice.actions;
export default dutySlice.reducer;
