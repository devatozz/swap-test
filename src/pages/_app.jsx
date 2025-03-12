import React, { useEffect, useRef, useState } from "react";

import { useRouter } from "next/router";
import { CacheProvider } from "@emotion/react";
import createEmotionCache from "src/createEmotionCache";
import "../styles/global.css";
import theme from "src/styles/theme";
import { ChakraProvider } from "@chakra-ui/react";
import { Provider } from "react-redux";
import { store, persistor } from "src/state/store";
import { PersistGate } from "redux-persist/integration/react";
import AppBar from "src/components/layout/AppBar";
import Footer from "src/components/layout/Footer";
import { WagmiConfig } from "wagmi";
import { wagmiConfig } from "src/utils/wallet";
import styled from "styled-components";
import { LanguageProvider } from "src/contexts/LanguageContext";
import { languages } from "src/config/languages";

const clientSideEmotionCache = createEmotionCache();

const AppWrapper = styled.div`
  height: 100%;
  min-height: 100vh;
  background-color: #101010;
  position: relative;
  isolation: isolate;

  &::before {
    content: "";
    position: fixed;
    inset: 0;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    z-index: -1;
    transition: opacity 0.3s ease;
  }
`;

function RouteLoadingProvider({ children }) {
  return <>{children}</>;
}

export default function App(props) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  const router = useRouter();
  const { locale } = router;

  useEffect(() => {
    if (locale) {
      document.dir = languages[locale]?.dir || "ltr";
      document.documentElement.setAttribute("data-language", locale);
    }
  }, [locale]);

  return (
    <CacheProvider value={emotionCache}>
      <LanguageProvider>
        <ChakraProvider theme={theme}>
          <AppWrapper>
            <WagmiConfig config={wagmiConfig}>
              <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                  <RouteLoadingProvider>
                    <AppBar />
                    <Component {...pageProps} />
                    <Footer />
                  </RouteLoadingProvider>
                </PersistGate>
              </Provider>
            </WagmiConfig>
          </AppWrapper>
        </ChakraProvider>
      </LanguageProvider>
    </CacheProvider>
  );
}
