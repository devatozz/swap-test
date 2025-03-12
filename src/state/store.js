// store.js
import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";

import chainReducer from "./chain/slice";

const isClient = typeof window !== "undefined";
const storage = isClient ? require("redux-persist/lib/storage").default : null;

let chainPersist = chainReducer;

if (isClient && storage) {
  const chainPersistConfig = {
    key: "chain",
    storage,
  };

  chainPersist = persistReducer(chainPersistConfig, chainReducer);
}

export const store = configureStore({
  reducer: {
    chain: chainPersist,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = isClient ? persistStore(store) : null;
