import {configureStore} from '@reduxjs/toolkit'
import datasetSelectReducer from "./reducers/datasetSelectSlice";
import rightPaperReducer from "./reducers/rightPaperSlice";
import notificationReducer from "./reducers/notificationSlice";
import warningIconReducer from "./reducers/warningIconSlice";
import alertReducer from "./reducers/alertSlice";
import progressReducer from "./reducers/progressSlice";
import newResource from "./reducers/newResource";
import uqlReducer from "./reducers/uqlSlice";
import pagingReducer from "./reducers/pagingSlice";
import appReducer from "./reducers/appSlice";

export default configureStore({
        reducer: {
            datasetSelectReducer,
            rightPaperReducer,
            notificationReducer,
            progressReducer,
            warningIconReducer,
            alertReducer,
            newResource,
            uqlReducer,
            pagingReducer,
            appReducer,
        }
    }
);
