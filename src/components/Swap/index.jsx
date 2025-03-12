import React, { useState, useCallback, useEffect } from "react";
import axios from "axios";
import SlippageSetting from "./SlippageSetting";
import {
  Center,
  Box,
  Text,
  Flex,
  InputGroup,
  Input,
  Button,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import TokenAvatar from "src/components/swap/TokenAvatar";
import { currencyFormat, formatInputAmount } from "src/utils/stringUtil";
import { emptyToken } from "src/utils/utils";
import SwapTokenModal from "./TokensModal";
import { useLanguage } from "src/contexts/LanguageContext";
import showIcon from "src/asset/images/swap/showIcon.svg";
import { ConnectModal, useCurrentAccount } from "@mysten/dapp-kit";

const Swap = () => {
  const { t } = useLanguage();
  const toast = useToast();
  const [amountIn, setAmountIn] = useState("0");
  const [amountOut, setAmountOut] = useState("0");
  const [tokenIn, setTokenIn] = useState(emptyToken);
  const [tokenOut, setTokenOut] = useState(emptyToken);
  const currentAccount = useCurrentAccount();
  const {
    isOpen: openTokenIn,
    onOpen: openTokenInModal,
    onClose: closeTokenIn,
  } = useDisclosure();

  const {
    isOpen: openTokenOut,
    onOpen: openTokenOutModal,
    onClose: closeTokenOut,
  } = useDisclosure();

  const [tokenInBalance, setTokenInBalance] = useState("0");
  const [tokenOutBalance, setTokenOutBalance] = useState("0");
  const [tokenInValue, setTokenInValue] = useState("0");
  const [tokenOutValue, setTokenOutValue] = useState("0");
  const [loading, setLoading] = useState(false);
  const [exchangeRate, setExchangeRate] = useState(null);

  // Handle input amount changes
  const handleSetAmountIn = useCallback(
    (value) => {
      const sanitizedValue = value.replace(/,/g, ".");
      const amount = formatInputAmount(sanitizedValue);
      setAmountIn(amount);

      if (!amount || amount === "0") {
        setAmountOut("0");
        return;
      }

      // Calculate amount out if we have exchange rate
      if (exchangeRate && tokenIn.address && tokenOut.address) {
        const calculatedAmountOut = (parseFloat(amount) * exchangeRate).toFixed(
          6
        );
        setAmountOut(calculatedAmountOut);
      }
    },
    [tokenIn, tokenOut, exchangeRate]
  );

  const handleSetMaxTokenIn = useCallback(() => {
    if (tokenIn.balance) {
      setAmountIn(tokenIn.balance);

      // Calculate amount out if we have exchange rate
      if (exchangeRate && tokenIn.address && tokenOut.address) {
        const calculatedAmountOut = (
          parseFloat(tokenIn.balance) * exchangeRate
        ).toFixed(6);
        setAmountOut(calculatedAmountOut);
      }
    }
  }, [tokenIn, exchangeRate, tokenOut]);

  // Fetch token price using the token address
  const fetchTokenPrice = useCallback(
    async (token, balanceSetter, valueSetter) => {
      if (!token || !token.address) return;

      setLoading(true);
      try {
        const response = await axios.post(
          "https://aftermath.finance/api/price-info",
          {
            coins: [token.address],
          }
        );

        const prices = response.data;
        const tokenPrice = prices[token.address]?.price || 0;

        // Get token balance - in a real implementation, you would get this from the wallet
        const balance = await getTokenBalance(token.symbol);
        balanceSetter(balance);

        // Calculate USD value
        valueSetter((parseFloat(balance) * tokenPrice).toFixed(2));

        return tokenPrice;
      } catch (error) {
        console.error(`Error fetching price for ${token.symbol}:`, error);
        toast({
          title: t("common.error"),
          description: t("toast.failed_to_load_price"),
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return 0;
      } finally {
        setLoading(false);
      }
    },
    [t, toast]
  );

  // Mock function to get token balance - in a real implementation, you would get this from the wallet
  const getTokenBalance = async (tokenSymbol) => {
    // This is a mock function - replace with actual wallet integration
    const mockBalances = {
      SUI: "10.5",
      USDC: "100",
      FISH: "250",
      JWLCETUS: "5",
      SUIGGA: "20",
    };

    return mockBalances[tokenSymbol] || "0";
  };

  // Update exchange rate when tokens change
  useEffect(() => {
    const updateExchangeRate = async () => {
      if (tokenIn.address && tokenOut.address) {
        try {
          // Fetch prices for both tokens
          const priceInPromise = fetchTokenPrice(
            tokenIn,
            setTokenInBalance,
            setTokenInValue
          );
          const priceOutPromise = fetchTokenPrice(
            tokenOut,
            setTokenOutBalance,
            setTokenOutValue
          );

          const [priceIn, priceOut] = await Promise.all([
            priceInPromise,
            priceOutPromise,
          ]);

          // Calculate exchange rate
          if (priceIn && priceOut && priceIn > 0) {
            const rate = priceIn / priceOut;
            setExchangeRate(rate);

            // Update amount out if amount in is set
            if (amountIn && amountIn !== "0") {
              const calculatedAmountOut = (parseFloat(amountIn) * rate).toFixed(
                6
              );
              setAmountOut(calculatedAmountOut);
            }
          }
        } catch (error) {
          console.error("Error updating exchange rate:", error);
        }
      }
    };

    updateExchangeRate();
  }, [tokenIn, tokenOut, fetchTokenPrice]);

  // Handler for token selection
  const handleSelectTokenIn = useCallback(
    async (token) => {
      setTokenIn(token);
      await fetchTokenPrice(token, setTokenInBalance, setTokenInValue);
      closeTokenIn();
    },
    [fetchTokenPrice, closeTokenIn]
  );

  const handleSelectTokenOut = useCallback(
    async (token) => {
      setTokenOut(token);
      await fetchTokenPrice(token, setTokenOutBalance, setTokenOutValue);
      closeTokenOut();
    },
    [fetchTokenPrice, closeTokenOut]
  );

  return (
    <Center
      bg="transparent"
      minHeight="calc(100vh)"
      display="flex"
      justifyContent={"start"}
      mt={"60px"}
      flexDirection="column"
      px={4}
      color={"#fff"}
    >
      <Box>
        <Box
          border={"2px solid rgba(255,255,255,0.1)"}
          width={"400px"}
          height={"fit-content"}
          borderRadius={"12px"}
          display={"flex"}
          padding={"24px"}
          flexDirection={"column"}
          gap={"16px"}
        >
          <Text color={"#fff"} fontSize={"14px"}>
            Token In
          </Text>
          <Box
            border={"1px solid rgba(255,255,255,0.5)"}
            width={"100%"}
            height={"150px"}
            borderRadius={"12px"}
            padding={"12px"}
          >
            <Flex gap={6} flexDirection={"column"} mt={2}>
              <InputGroup justifyContent={"space-between"}>
                <Input
                  value={amountIn === "0" ? "" : amountIn}
                  onChange={(e) => {
                    const value = e.target.value;
                    const sanitizedValue = value.startsWith("-")
                      ? value.slice(1).replace(/,/g, ".")
                      : value.replace(/,/g, ".");
                    handleSetAmountIn(sanitizedValue);
                  }}
                  placeholder="0.00"
                  border="none"
                  outline="none"
                  _placeholder={{
                    color: "rgba(255, 255, 255, 0.4)",
                  }}
                  fontSize={{ base: "16px", md: "20px" }}
                  fontWeight="700"
                  lineHeight="30px"
                  padding="0px"
                  autoComplete="off"
                  fontFamily="Lexend"
                  _focus={{
                    boxShadow: "none",
                    border: "none",
                    outline: "none",
                  }}
                  style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                />

                <Box
                  position={"relative"}
                  display={"flex"}
                  alignItems={"center"}
                  justifyContent={"end"}
                  gap={"10px"}
                >
                  <Button
                    minWidth={{ md: "53px", base: "48px" }}
                    height={"27px"}
                    padding={"8px"}
                    borderRadius={"24px"}
                    fontSize={{ base: "14px", md: "16px" }}
                    onClick={handleSetMaxTokenIn}
                    bg={" linear-gradient(90deg, #40FF9F 0%, #06EEFF 100%)"}
                    _hover={{
                      boxShadow:
                        "0 0 15px rgba(6, 238, 255, 0.6), 0 0 10px rgba(64, 255, 159, 0.4)",
                      background:
                        "linear-gradient(90deg, #06eeff 0%, #40ff9f 100%)",
                    }}
                    lineHeight={"0px"}
                    mx={"5px"}
                  >
                    {t(`common.max`)}
                  </Button>
                  <Button
                    border={"none"}
                    outline={"none"}
                    justifyContent="right"
                    minW="60px"
                    variant="outline"
                    color={"#fff"}
                    aria-label="Options token in"
                    background={"transparent"}
                    _hover={{ background: "transparent" }}
                    padding={"0px"}
                    onClick={openTokenInModal}
                    fontSize={{ base: "16px", md: "20px" }}
                    fontWeight={"700"}
                    lineHeight={"28px"}
                    fontFamily={"Lexend"}
                    leftIcon={
                      <TokenAvatar
                        size="24px"
                        name={tokenIn.symbol ? tokenIn.symbol : "In"}
                        icon={tokenIn?.icon}
                      />
                    }
                  >
                    <Text>
                      {tokenIn.symbol ? tokenIn.symbol : t(`common.select`)}
                    </Text>
                  </Button>
                </Box>
              </InputGroup>
              {tokenIn.symbol && (
                <Text color="rgba(255, 255, 255, 0.6)" fontSize="14px" mt={2}>
                  Balance: {tokenInBalance} {tokenIn.symbol} (${tokenInValue})
                </Text>
              )}
            </Flex>
          </Box>

          <Text color={"#fff"} fontSize={"14px"}>
            Token Out
          </Text>
          <Box
            border={"1px solid rgba(255,255,255,0.5)"}
            width={"100%"}
            height={"150px"}
            borderRadius={"12px"}
            padding={"12px"}
          >
            <Flex gap={6} flexDirection={"column"} mt={2}>
              <InputGroup justifyContent={"space-between"}>
                <Input
                  value={amountOut === "0" ? "" : amountOut}
                  placeholder="0.00"
                  border="none"
                  outline="none"
                  isReadOnly
                  _placeholder={{
                    color: "rgba(255, 255, 255, 0.4)",
                  }}
                  fontSize={{ base: "16px", md: "20px" }}
                  fontWeight="700"
                  lineHeight="30px"
                  padding="0px"
                  autoComplete="off"
                  fontFamily="Lexend"
                  _focus={{
                    boxShadow: "none",
                    border: "none",
                    outline: "none",
                  }}
                  style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                />

                <Box
                  position={"relative"}
                  display={"flex"}
                  alignItems={"center"}
                  justifyContent={"end"}
                  gap={"10px"}
                >
                  <Button
                    border={"none"}
                    outline={"none"}
                    justifyContent="right"
                    minW="60px"
                    variant="outline"
                    color={"#fff"}
                    aria-label="Options token out"
                    background={"transparent"}
                    _hover={{ background: "transparent" }}
                    padding={"0px"}
                    onClick={openTokenOutModal}
                    fontSize={{ base: "16px", md: "20px" }}
                    fontWeight={"700"}
                    lineHeight={"28px"}
                    fontFamily={"Lexend"}
                    leftIcon={
                      <TokenAvatar
                        size="24px"
                        name={tokenOut.symbol ? tokenOut.symbol : "Out"}
                        icon={tokenOut?.icon}
                      />
                    }
                  >
                    <Text>
                      {tokenOut.symbol ? tokenOut.symbol : t(`common.select`)}
                    </Text>
                  </Button>
                </Box>
              </InputGroup>
              {tokenOut.symbol && (
                <Text color="rgba(255, 255, 255, 0.6)" fontSize="14px" mt={2}>
                  Balance: {tokenOutBalance} {tokenOut.symbol} (${tokenOutValue}
                  )
                </Text>
              )}
            </Flex>
          </Box>

          {tokenIn.symbol && tokenOut.symbol && (
            <Box>
              <Text color={"#fff"} fontSize={"14px"}>
                Rate: 1 {tokenIn.symbol} ={" "}
                {exchangeRate ? (1 / exchangeRate).toFixed(6) : "0"}{" "}
                {tokenOut.symbol}
              </Text>
            </Box>
          )}

          <Button
            width="100%"
            height="48px"
            borderRadius="12px"
            bg="linear-gradient(90deg, #40FF9F 0%, #06EEFF 100%)"
            _hover={{
              boxShadow:
                "0 0 15px rgba(6, 238, 255, 0.6), 0 0 10px rgba(64, 255, 159, 0.4)",
              background: "linear-gradient(90deg, #06eeff 0%, #40ff9f 100%)",
            }}
            isLoading={loading}
            isDisabled={
              !tokenIn.symbol || !tokenOut.symbol || amountIn === "0" || loading
            }
          >
            {t("common.swap")}
          </Button>
        </Box>
      </Box>

      <SwapTokenModal
        isOpen={openTokenIn}
        onClose={closeTokenIn}
        handleChoseToken={handleSelectTokenIn}
        selectedAddr={tokenOut.address} // Prevent selecting the same token
      />

      <SwapTokenModal
        isOpen={openTokenOut}
        onClose={closeTokenOut}
        handleChoseToken={handleSelectTokenOut}
        selectedAddr={tokenIn.address} // Prevent selecting the same token
      />
    </Center>
  );
};

export default Swap;
