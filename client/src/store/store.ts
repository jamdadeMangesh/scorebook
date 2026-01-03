import { configureStore } from "@reduxjs/toolkit";
import { matchReducer } from "./Slice/MatchSlice";
import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE, persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
    key: 'root',
    storage
}
const persistedReducer = persistReducer(persistConfig, matchReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST,PURGE, REGISTER]
            }
        })
})

export const persistor = persistStore(store);