import { createSlice } from "@reduxjs/toolkit";

const organizationSlice = createSlice({
    name: "organization",
    initialState: {
        singleOrganization: null,
        organizations: [],
        searchOrganizationByText: "",
    },
    reducers: {
        setSingleOrganization (state,action){
            state.singleOrganization = action.payload;
        },
        setOrganizations(state, action) {
            state.organizations = action.payload;
        },
        setSearchOrganizationByText(state, action) {
            state.searchOrganizationByText = action.payload;
        }
    }
})
export const { setSingleOrganization, setOrganizations, setSearchOrganizationByText } = organizationSlice.actions;
export default organizationSlice.reducer;