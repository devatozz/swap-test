import Head from "next/head";
import React from "react";
import "@mysten/dapp-kit/dist/index.css";
import { CacheProvider } from "@emotion/react";
import createEmotionCache from "src/createEmotionCache";
import "../styles/global.css";
import theme from "src/styles/theme";
import { ChakraProvider } from "@chakra-ui/react";
import AppBar from "src/components/layout/AppBar";
import Footer from "src/components/layout/Footer";
import { LanguageProvider } from "src/contexts/LanguageContext";
import styled from "styled-components";
import { getFullnodeUrl } from "@mysten/sui.js/client";
import { SuiClientProvider, WalletProvider } from "@mysten/dapp-kit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import favicon from "src/public/static/favicon.ico";

const WrapComponent = styled.div`
  background: #101010;
`;

const queryClient = new QueryClient();
const networks = {
  localnet: { url: getFullnodeUrl("localnet") },
  devnet: { url: getFullnodeUrl("devnet") },
  testnet: { url: getFullnodeUrl("testnet") },
  mainnet: { url: getFullnodeUrl("mainnet") },
};

const clientSideEmotionCache = createEmotionCache();

export default function App(props) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>MIN TEST</title>
        <link rel="shortcut icon" href={favicon.src} />
      </Head>
      <WrapComponent>
        <LanguageProvider>
          <ChakraProvider theme={theme}>
            <QueryClientProvider client={queryClient}>
              <SuiClientProvider networks={networks} defaultNetwork="mainnet">
                <WalletProvider autoConnect>
                  <AppBar />
                  <Component {...pageProps} />
                  <Footer />
                </WalletProvider>
              </SuiClientProvider>
            </QueryClientProvider>
          </ChakraProvider>
        </LanguageProvider>
      </WrapComponent>
    </CacheProvider>
  );
}
