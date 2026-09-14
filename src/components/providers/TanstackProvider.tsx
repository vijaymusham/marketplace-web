"use client";

import { useState, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "../redux/store";

function makeQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 60 * 1000,
                retry: 1,
                refetchOnWindowFocus: false,
            },
            mutations: {
                retry: 0,
            },
        },
    });
}

export default function TanstackProvider({ children }: { children: ReactNode }) {
    const [queryClient] = useState(makeQueryClient);

    return (
        <QueryClientProvider client={queryClient}>
            <Provider store={store}>
                {/*
                  PersistGate defaults to `bootstrapped: false` and would render
                  `loading` (null) on the server — wiping all SSR HTML and
                  delaying LCP until JS hydrates. Always render children so the
                  first paint includes the real UI; Redux rehydrates in place.
                */}
                <PersistGate loading={children} persistor={persistor}>
                    {children}
                </PersistGate>
            </Provider>
        </QueryClientProvider>
    );
}
