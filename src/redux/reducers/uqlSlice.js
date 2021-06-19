import {createSlice} from '@reduxjs/toolkit'

export const uqlSlice = createSlice({
    name: 'uql-query',
    initialState: {
        uql: "",
    },
    reducers: {
        runQuery: (state, action) => {
            let uqlType = 'none';
            const q = action.payload.query.toLowerCase();
            if(q.startsWith('select event')) {
                uqlType = "event";
            } else if(q.startsWith('select rule')) {
                uqlType = "rule";
            } else if(q.startsWith('select segment')) {
                uqlType = "segment";
            }
            state.uql = action.payload.query;
            state.uqlType = uqlType;
            localStorage.setItem('uqlType', uqlType);
        }
    }
})

export const {runQuery} = uqlSlice.actions
export default uqlSlice.reducer