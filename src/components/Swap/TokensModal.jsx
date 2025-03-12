import React, { useEffect, useCallback, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  VStack,
  Button,
  Avatar,
  Text,
  FormControl,
  Input,
  InputGroup,
  InputLeftElement,
  FormErrorMessage,
  Box,
  Spinner,
  useToast,
  Tooltip,
  Flex,
} from "@chakra-ui/react";

import { SearchIcon, InfoIcon } from "@chakra-ui/icons";

import { emptyToken } from "src/utils/utils";
import styled from "styled-components";
import TokenAvatar from "./TokenAvatar";
import { useLanguage } from "src/contexts/LanguageContext";
import axios from "axios";

export const BREAKPOINTS = {
  xs: 396,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  xxl: 1536,
  xxxl: 1920,
};

const WrapperBox = styled.div`
  position: relative;
  border-radius: 12px;
  width: 100%;
  height: 100%;
  overflow: hidden;
  padding: 24px;
  z-index: 1;

  background: #0f1211;
  box-shadow: 0px 0px 4px 0px rgba(255, 254, 254, 0.25);
  backdrop-filter: blur(200px);
  position: relative;
  overflow: hidden;
  &:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 11.5px;
    padding: 2px;
    background: linear-gradient(322.78deg, #40ff9f -1.25%, #06eeff 100%);
    -webkit-mask: linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    transition: background 0.3s ease;
    z-index: -1;
  }

  &:hover:before {
    background: linear-gradient(322.78deg, #06eeff -1.25%, #40ff9f 100%);
  }

  @media screen and (max-width: ${BREAKPOINTS.xxl}px) {
    width: 100%;
    margin: 0px auto;
  }
  @media screen and (max-width: ${BREAKPOINTS.lg}px) {
    width: 100%;
    margin: 0px auto;
  }

  @media screen and (max-width: ${BREAKPOINTS.md}px) {
    width: 95%;
    margin: 0px auto;
  }
`;

const TitleText = styled.span`
  color: #fff;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: 140%; /* 28px */
`;

// Default token images if iconUrl is null
const DEFAULT_TOKEN_IMAGES = {
  SUI: "https://cryptologos.cc/logos/sui-sui-logo.png",
  USDC: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png",
};

export default function SwapTokenModal({
  handleChoseToken = null,
  isOpen,
  onClose,
  selectedAddr,
  wallet,
  onSelectToken,
}) {
  const { t } = useLanguage();
  const toast = useToast();
  // State management
  const [tokenList, setTokenList] = useState([]);
  const [defaultTokenList, setDefaultTokenList] = useState([]);
  const [tokenSearch, setTokenSearch] = useState("");
  const [tokenInfo, setTokenInfo] = useState(emptyToken);
  const [tokenMsg, setTokenMsg] = useState("");
  const [loadingSearchToken, setLoadingSearchToken] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tokenObj, setTokenObj] = useState({});
  const [tokenBalances, setTokenBalances] = useState({});

  const handleTokenSelection = useCallback(
    (token) => {
      if (typeof handleChoseToken === "function") {
        handleChoseToken(token);
      } else if (typeof onSelectToken === "function") {
        onSelectToken(token);
      } else {
        console.warn("No token selection handler provided");
      }
      onClose();
    },
    [handleChoseToken, onSelectToken, onClose]
  );

  // Function to fetch token balances
  const fetchTokenBalances = useCallback(async () => {
    if (!wallet) return;
    console.log("data", wallet.address);
    try {
      const response = await axios.post(
        `https://aftermath.finance/api/wallet/${wallet}/balances/coins`,
        {
          coins: [
            "0x0000000000000000000000000000000000000000000000000000000000000002::sui::SUI",
            "0xdba34672e30cb065b1f93e3ab55318768fd6fef66c15942c9f7cb846e2f900e7::usdc::USDC",
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "*/*",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = await response.json();

      // Assuming API response is in format { balances: { coin_id: amount } }
      setTokenBalances(data.balances || {});
    } catch (error) {
      console.error("Error fetching token balances:", error);
    }
  }, [wallet]);

  // Fetch token list from Aftermath API
  const fetchTokenList = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "https://aftermath.finance/api/coins/metadata",
        {
          coins: [
            "0x0000000000000000000000000000000000000000000000000000000000000002::sui::SUI",
            "0xdba34672e30cb065b1f93e3ab55318768fd6fef66c15942c9f7cb846e2f900e7::usdc::USDC",
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "*/*",
          },
        }
      );

      if (response.data && Array.isArray(response.data)) {
        // Transform the API response into token objects
        const tokens = response.data.map((token) => {
          // Use default images if iconUrl is null
          const iconUrl =
            token.iconUrl ||
            (token.symbol === "SUI"
              ? DEFAULT_TOKEN_IMAGES.SUI
              : token.symbol === "USDC"
              ? DEFAULT_TOKEN_IMAGES.USDC
              : "");

          return {
            address: token.id, // Using id as address
            name: token.name,
            symbol: token.symbol,
            decimals: token.decimals,
            icon: iconUrl,
            description: token.description || "",
            metadataType: token.metadataType,
            balance: tokenBalances[token.id] || "0.0", // Add balance from state
          };
        });

        // Create object mapping for easy access
        const tokensObj = tokens.reduce((acc, token) => {
          acc[token.address] = token;
          return acc;
        }, {});

        setDefaultTokenList(
          tokens.filter(
            (token) =>
              token.address?.toLowerCase() !== selectedAddr?.toLowerCase()
          )
        );
        setTokenObj(tokensObj);
        setTokenList(
          tokens.filter(
            (token) =>
              token.address?.toLowerCase() !== selectedAddr?.toLowerCase()
          )
        );
      } else {
        toast({
          title: t("common.error"),
          description: t("toast.failed_to_load_tokens"),
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error fetching token list:", error);
      toast({
        title: t("common.error"),
        description: t("toast.failed_to_load_tokens"),
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }, [selectedAddr, t, toast, tokenBalances]);

  // Get token data for a specific ID
  const getTokenData = useCallback(
    async (id) => {
      try {
        const existingToken = tokenObj[id];
        if (existingToken) {
          return existingToken;
        }

        const response = await axios.post(
          "https://aftermath.finance/api/coins/metadata"
        );
        const token = response.data.find(
          (t) => t.id.toLowerCase() === id.toLowerCase()
        );

        if (token) {
          const iconUrl =
            token.iconUrl ||
            (token.symbol === "SUI"
              ? DEFAULT_TOKEN_IMAGES.SUI
              : token.symbol === "USDC"
              ? DEFAULT_TOKEN_IMAGES.USDC
              : "");

          return {
            address: token.id,
            name: token.name,
            symbol: token.symbol,
            decimals: token.decimals,
            icon: iconUrl,
            description: token.description || "",
            metadataType: token.metadataType,
            balance: tokenBalances[token.id] || "0.0",
          };
        }
        throw new Error("Token not found");
      } catch (error) {
        throw new Error("Token not found");
      }
    },
    [tokenObj, tokenBalances]
  );

  const handleSearchToken = useCallback((e) => {
    setTokenSearch(e.target.value);
  }, []);

  const handleGetTokenInfo = useCallback(
    async (value) => {
      setLoadingSearchToken(true);
      try {
        const tokenFetch = await getTokenData(value);
        setTokenInfo({ ...tokenFetch, disable: false });
        setTokenMsg("");
      } catch (e) {
        setTokenInfo(emptyToken);
        setTokenMsg(t(`toast.not_found_token`));
      } finally {
        setLoadingSearchToken(false);
      }
    },
    [getTokenData, t]
  );

  // Load tokens and balances on initial render
  useEffect(() => {
    if (isOpen) {
      fetchTokenBalances();
      fetchTokenList();
    }
  }, [fetchTokenList, fetchTokenBalances, isOpen]);

  // Filter tokens based on search
  useEffect(() => {
    if (defaultTokenList.length && tokenSearch !== "") {
      let searchValue = tokenSearch.replace(/\s+/g, "");
      let searchLower = searchValue.toLowerCase();

      const isValidId =
        searchValue.length === 66 && searchValue.substring(0, 2) === "0x";

      if (!isValidId) {
        let searchTokens = defaultTokenList.filter(
          (item) =>
            item.address.toLowerCase().includes(searchLower) ||
            item.name.toLowerCase().includes(searchLower) ||
            item.symbol.toLowerCase().includes(searchLower)
        );

        if (searchTokens.length === 0) {
          setTokenInfo(emptyToken);
          setTokenMsg(t(`toast.not_found_token`));
        } else {
          setTokenInfo(emptyToken);
        }
        setTokenList(searchTokens);
      } else {
        handleGetTokenInfo(searchValue);
        setTokenList([]);
      }
    } else {
      setTokenList(defaultTokenList);
      setTokenInfo(emptyToken);
      setTokenMsg("");
    }
  }, [defaultTokenList, tokenSearch, handleGetTokenInfo, t]);

  const handleCloseModal = useCallback(() => {
    onClose();
    setTokenSearch("");
    setTokenMsg("");
  }, [onClose]);

  // Format balance with proper decimals
  const formatBalance = (balance, decimals) => {
    if (!balance) return "0.00";

    // Parse balance as float
    const numBalance = parseFloat(balance);

    // Display with appropriate decimal places based on token type
    return numBalance.toFixed(decimals === 6 ? 2 : 4);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleCloseModal} isCentered>
      <ModalOverlay bg="rgba(0, 0, 0, 0.8)" />

      <ModalContent h={"600px"} bg={"transparent"}>
        <WrapperBox>
          <div className="background-top" />

          <ModalHeader padding={"0px 0px 15px 0px"}>
            <Box
              display={"flex"}
              alignItems={"start"}
              justifyContent={"space-between"}
              position={"relative"}
            >
              <TitleText>{t("common.select_token")}</TitleText>
              <ModalCloseButton
                width={"16px"}
                height={"16px"}
                color={"#fff"}
                top={1}
                right={0}
                iconSize="16px"
              />
            </Box>
          </ModalHeader>
          <Box
            width={"700px"}
            left={0}
            right={0}
            top={"65px"}
            position={"absolute"}
            height={"1px"}
            bg={"rgba(255, 255, 255, 0.1)"}
          />
          <ModalBody padding={"0px"}>
            <VStack w="full" marginTop={"30px"}>
              <FormControl isInvalid={tokenMsg != ""}>
                <InputGroup
                  bg={"rgba(255, 255, 255, 0.1)"}
                  borderColor={"rgba(255, 255, 255, 0.1)"}
                  borderRadius={"8px"}
                  outline={"none"}
                  color={"#fff"}
                  fontSize={"16px"}
                  height={"48px"}
                  display={"flex"}
                  alignItems={"center"}
                  justifyContent={"center"}
                >
                  <InputLeftElement ml={"10px"} mt={"5px"}>
                    <SearchIcon
                      width={"24px"}
                      height={"24px"}
                      iconSize="18px"
                    />
                  </InputLeftElement>
                  <Input
                    placeholder={t("common.search")}
                    _placeholder={{
                      color: "rgba(255, 255, 255, 0.6)",
                    }}
                    height={"48px"}
                    onChange={handleSearchToken}
                    value={tokenSearch}
                    pl={"55px"}
                    _focus={{
                      boxShadow: "none",
                      borderColor: "#78ffb6",
                      outline: "none",
                    }}
                    _hover={{
                      boxShadow: "none",
                      borderColor: "#78ffb6",
                      outline: "none",
                    }}
                  />
                </InputGroup>
                <Box marginTop={"10px"}>
                  <FormErrorMessage>{tokenMsg}</FormErrorMessage>
                </Box>
              </FormControl>

              {loading && (
                <Box mt={"20px"} textAlign="center" width="100%">
                  <Spinner color="#40ff9f" size="lg" />
                  <Text color="#40ff9f" mt={2}>
                    {t("common.loading_tokens")}
                  </Text>
                </Box>
              )}

              {loadingSearchToken && (
                <Box mt={"20px"} color={"#40ff9f"}>
                  {t(`common.searching`)}
                </Box>
              )}

              {tokenInfo.address !== "" && (
                <Button
                  w="full"
                  bg={"transparent"}
                  color={"#fff"}
                  justifyContent="left"
                  minHeight={"60px"}
                  marginTop={"10px"}
                  border={"1px solid rgba(255, 255, 255, 0.1)"}
                  borderRadius={"8px"}
                  _hover={{
                    bg: "transparent",
                    borderColor: "#78ffb6",
                  }}
                  key={`token-option-${tokenInfo.address}`}
                  py={2}
                  leftIcon={
                    <TokenAvatar
                      size="32px"
                      name={tokenInfo.symbol}
                      icon={tokenInfo.icon}
                    />
                  }
                  h="max"
                  onClick={() => handleTokenSelection(tokenInfo)}
                >
                  <VStack align="start" width="100%">
                    <Flex
                      width="100%"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Text>{tokenInfo.symbol}</Text>
                      <Text color="#40ff9f">
                        {formatBalance(tokenInfo.balance, tokenInfo.decimals)}
                      </Text>
                    </Flex>
                    <Flex
                      width="100%"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Text
                        fontWeight={"400"}
                        fontSize={"14px"}
                        color={"rgba(255, 255, 255, 0.6)"}
                      >
                        {tokenInfo.name}
                      </Text>
                      {tokenInfo.description && (
                        <Tooltip label={tokenInfo.description} placement="top">
                          <InfoIcon
                            color="rgba(255, 255, 255, 0.6)"
                            boxSize={4}
                          />
                        </Tooltip>
                      )}
                    </Flex>
                  </VStack>
                </Button>
              )}

              <Box
                maxHeight="400px"
                overflowY="auto"
                width={"100%"}
                css={{
                  "&::-webkit-scrollbar": {
                    width: "0px",
                  },
                  "&::-webkit-scrollbar-track": {
                    width: "0px",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    background: "transparent",
                  },
                }}
              >
                {!loading && tokenList.length > 0
                  ? tokenList.map((item, index) => (
                      <Button
                        w="full"
                        bg={"transparent"}
                        justifyContent="left"
                        isDisabled={item?.disable}
                        minHeight={"60px"}
                        marginTop={"10px"}
                        key={`token-option-${index}`}
                        border={"1px solid rgba(255, 255, 255, 0.1)"}
                        borderRadius={"8px"}
                        _hover={{
                          bg: "transparent",
                          borderColor: "#78ffb6",
                        }}
                        leftIcon={
                          <TokenAvatar
                            size="32px"
                            name={item.symbol}
                            icon={item.icon}
                          />
                        }
                        h="max"
                        onClick={() => handleTokenSelection(item)}
                      >
                        <VStack align="start" width="100%">
                          <Flex
                            width="100%"
                            justifyContent="space-between"
                            alignItems="center"
                          >
                            <Text
                              fontWeight={"500"}
                              fontSize={"16px"}
                              color={"#fff"}
                            >
                              {item.symbol}
                            </Text>
                            <Text color="#40ff9f">
                              {formatBalance(item.balance, item.decimals)}
                            </Text>
                          </Flex>
                          <Flex
                            width="100%"
                            justifyContent="space-between"
                            alignItems="center"
                          >
                            <Text
                              fontWeight={"400"}
                              fontSize={"14px"}
                              color={"rgba(255, 255, 255, 0.6)"}
                            >
                              {item.name}
                            </Text>
                            {item.description && (
                              <Tooltip label={item.description} placement="top">
                                <InfoIcon
                                  color="rgba(255, 255, 255, 0.6)"
                                  boxSize={4}
                                />
                              </Tooltip>
                            )}
                          </Flex>
                        </VStack>
                      </Button>
                    ))
                  : !loading && (
                      <Box>
                        <Text
                          color={"#fff"}
                          fontSize={"16px"}
                          textAlign={"center"}
                          mt={"30px"}
                        >
                          {t("common.token_not_found")}
                        </Text>
                      </Box>
                    )}
              </Box>
            </VStack>
          </ModalBody>
        </WrapperBox>
      </ModalContent>
    </Modal>
  );
}
