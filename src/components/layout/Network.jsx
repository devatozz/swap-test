import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { config, walletInfos } from "src/state/chain/config";
import { connectNetwork, disconnectNetwork } from "src/state/chain/slice";
import { useLanguage } from "src/contexts/LanguageContext";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import MobileConnectModal from "./MobileConnectModal";
import { useRouter } from "next/router";

import {
  Button,
  Image,
  MenuList,
  MenuItem,
  Menu,
  MenuButton,
  useClipboard,
  useToast,
  useDisclosure,
  useMediaQuery,
} from "@chakra-ui/react";

import {
  useAccount,
  useConnect,
  useDisconnect,
  useSwitchNetwork,
  useNetwork,
} from "wagmi";

import { AthenButton } from "../Button/AthenButton";
export default function Network() {
  const { t } = useLanguage();
  const dispatch = useDispatch();

  const { switchNetwork } = useSwitchNetwork();
  const { chain } = useNetwork();

  const { open, close } = useWeb3Modal();
  const [isDesktop] = useMediaQuery("(min-width: 767px)");
  const [isEthereumBrowser, setIsEthereumBrowser] = useState(false);
  const {
    isOpen: openMobileModal,
    onToggle: toggleOpenMobileModal,
    onClose: closeMobileModal,
  } = useDisclosure();
  const router = useRouter();
  function truncateString(str, length) {
    if (str.length > length) {
      return str.slice(0, length - 10) + "..." + str.slice(-3);
    } else {
      return str;
    }
  }
  const handleOpen = () => {
    open();
  };
  const handleMobileOpen = () => {
    toggleOpenMobileModal();
  };
  const checkEthereumBrowser = () => {
    const ethereum = window.ethereum;
    if (ethereum) {
      if (
        ethereum.isMetaMask ||
        ethereum.isTrust ||
        ethereum.isCoinbaseWallet
      ) {
        setIsEthereumBrowser(true);
      } else {
        setIsEthereumBrowser(!!ethereum.request);
      }
    } else {
      setIsEthereumBrowser(false);
    }
  };

  useEffect(() => {
    if (!isDesktop) {
      checkEthereumBrowser();
    }
  }, []);

  const handleDisconnectNetwork = useCallback(async () => {
    dispatch(disconnectNetwork());
  }, []);

  const handleConnectNetwork = useCallback(async ({ connector }) => {
    dispatch(connectNetwork(connector.id));
  }, []);

  const {
    isConnected,
    connector: currentConnector,
    address,
    isConnecting,
    isReconnecting,
  } = useAccount({
    onConnect: handleConnectNetwork,
    onDisconnect: handleDisconnectNetwork,
  });
  const { onCopy, setValue: setCopyValue } = useClipboard("");
  const toast = useToast();

  const [hasShownNetworkModal, setHasShownNetworkModal] = useState(false);

  const checkAndHandleChain = useCallback(async () => {
    if (isConnected && chain) {
      if (chain.id !== config.networkConfig.chainId) {
        try {
          if (switchNetwork) {
            await switchNetwork(config.networkConfig.chainId);
          } else {
            if (!hasShownNetworkModal) {
              open({ view: "Networks" });
              setHasShownNetworkModal(true);
            }
          }
        } catch (error) {
          console.error("Network switch failed", error);
        }
      } else {
        setHasShownNetworkModal(false);
        close();
      }
    }
  }, [
    isConnected,
    chain,
    switchNetwork,
    open,
    close,
    hasShownNetworkModal,
    toast,
  ]);

  useEffect(() => {
    if (chain) {
      checkAndHandleChain();
    }
  }, [chain?.id, isConnected]);

  useEffect(() => {
    setCopyValue(address);
  }, [address]);

  if (isConnected)
    return (
      <Menu matchWidth>
        <MenuButton
          as={AthenButton}
          variant="solid"
          fontSize={"16px"}
          fontWeight={400}
          onClick={handleOpen}
        >
          <p
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                display: "inline-block",
                maxWidth: "130px",
                height: "100%",

                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                textAlign: "center",
              }}
              title={address}
            >
              {truncateString(address, 18)}
            </span>
          </p>
        </MenuButton>
      </Menu>
    );

  return (
    <Menu matchWidth>
      {!isDesktop && !isEthereumBrowser && (
        <MobileConnectModal
          isOpen={openMobileModal}
          onClose={closeMobileModal}
        />
      )}

      {isDesktop && (
        <MenuButton
          as={AthenButton}
          variant="solid"
          fontWeight={500}
          isLoading={isConnecting || isReconnecting}
          onClick={handleOpen}
        >
          {t("common.connect-wallet")}
        </MenuButton>
      )}
      {!isDesktop && !isEthereumBrowser && (
        <MenuButton
          as={AthenButton}
          variant="solid"
          fontWeight={500}
          onClick={handleMobileOpen}
        >
          {t("common.connect-wallet")}
        </MenuButton>
      )}
      {!isDesktop && isEthereumBrowser && (
        <MenuButton
          as={AthenButton}
          variant="solid"
          fontWeight={500}
          isLoading={isConnecting || isReconnecting}
          onClick={handleOpen}
        >
          {t("common.connect-wallet")}
        </MenuButton>
      )}
    </Menu>
  );
}
