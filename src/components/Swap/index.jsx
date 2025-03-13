import React, { useState, useCallback, useEffect } from "react";
import axios from "axios";
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
  IconButton,
} from "@chakra-ui/react";
import TokenAvatar from "src/components/Swap/tokenAvatar";
import { currencyFormat, formatInputAmount } from "src/utils/stringUtil";
import { emptyToken } from "src/utils/utils";
import SwapTokenModal from "./tokensModal";
import { useLanguage } from "src/contexts/LanguageContext";
import showIcon from "src/asset/images/swap/showIcon.svg";
import { ConnectModal, useCurrentAccount } from "@mysten/dapp-kit";
import TokenList from "src/constant/tokenlist.json";
import { FiArrowDown } from "react-icons/fi";
import { getTokenBalance } from "src/utils/getTokenBalance";

function formatValue(value) {
  if (value >= 1) {
    return parseFloat(value.toFixed(2));
  } else {
    let precision = Math.min(8, Math.max(2, Math.ceil(-Math.log10(value)) + 2));
    return parseFloat(value.toFixed(precision));
  }
}
const formatNumber = (value) => {
  if (!value) return "";
  const cleanedValue = value.replace(/,/g, "");
  const [integer, decimal] = cleanedValue.split(".");
  const formattedInteger = parseInt(integer, 10).toLocaleString("en-US");
  return decimal !== undefined
    ? `${formattedInteger}.${decimal}`
    : formattedInteger;
};
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
  const [balanceLoading, setBalanceLoading] = useState(false);
  const [tradeRoutes, setTradeRoutes] = useState(null);

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
    if (tokenInBalance && tokenInBalance !== "0") {
      setAmountIn(tokenInBalance);

      // Calculate amount out if we have exchange rate
      if (exchangeRate && tokenIn.address && tokenOut.address) {
        const calculatedAmountOut = (
          parseFloat(tokenInBalance) * exchangeRate
        ).toFixed(6);
        setAmountOut(calculatedAmountOut);
      }
    }
  }, [tokenIn, exchangeRate, tokenOut, tokenInBalance]);

  // Add reverse function to swap token in and token out
  const handleReverseTokens = useCallback(() => {
    // Save the current values
    const tempTokenIn = tokenIn;
    const tempTokenOut = tokenOut;
    const tempAmountIn = amountIn;
    const tempAmountOut = amountOut;
    const tempTokenInBalance = tokenInBalance;
    const tempTokenOutBalance = tokenOutBalance;
    const tempTokenInValue = tokenInValue;
    const tempTokenOutValue = tokenOutValue;

    // Swap tokens
    setTokenIn(tempTokenOut);
    setTokenOut(tempTokenIn);

    // Swap balances and values
    setTokenInBalance(tempTokenOutBalance);
    setTokenOutBalance(tempTokenInBalance);
    setTokenInValue(tempTokenOutValue);
    setTokenOutValue(tempTokenInValue);

    // Swap amounts if they're set
    if (tempAmountOut !== "0") {
      setAmountIn(tempAmountOut);
    }
    if (tempAmountIn !== "0") {
      setAmountOut(tempAmountIn);
    }

    // Invert the exchange rate if it exists
    if (exchangeRate && exchangeRate !== 0) {
      setExchangeRate(1 / exchangeRate);
    }
  }, [
    tokenIn,
    tokenOut,
    amountIn,
    amountOut,
    tokenInBalance,
    tokenOutBalance,
    tokenInValue,
    tokenOutValue,
    exchangeRate,
  ]);

  function getTokenListEntry(tokenIn, tokenList) {
    return tokenList.coins.find((coin) => {
      const parts = coin.split("::");
      return parts[2] === tokenIn.symbol;
    });
  }

  const fetchTokenBalance = useCallback(
    async (token, balanceSetter) => {
      if (!token || !token.symbol || !currentAccount) {
        balanceSetter("0");
        return "0";
      }

      setBalanceLoading(true);
      try {
        const balance = await getTokenBalance(token.symbol, currentAccount);
        balanceSetter(balance);
        return balance;
      } catch (error) {
        console.error(`Error fetching balance for ${token.symbol}:`, error);
        toast({
          title: t("common.error"),
          description: t("toast.failed_to_load_balance"),
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        balanceSetter("0");
        return "0";
      } finally {
        setBalanceLoading(false);
      }
    },
    [currentAccount, t, toast]
  );

  // Fetch token price using the token address
  const fetchTokenPrice = useCallback(
    async (token, balanceSetter, valueSetter) => {
      if (!token || !token.address) return;

      setLoading(true);
      try {
        let coins = getTokenListEntry(token, TokenList);
        const response = await axios.post(
          "https://aftermath.finance/api/price-info",
          {
            coins: [coins],
          }
        );
        const tokenPrice = response.data || 0;
        const formattedPrice = tokenPrice?.[coins]?.price;

        const balance = await fetchTokenBalance(token, balanceSetter);

        const usdValue = (parseFloat(balance) * formattedPrice).toFixed(9);
        valueSetter(usdValue);

        return formattedPrice;
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
    [t, toast, fetchTokenBalance]
  );

  const fetchTradeRoutes = useCallback(
    async (tokenIn, tokenOut) => {
      let tokenInEntry = getTokenListEntry(tokenIn, TokenList);
      let tokenOutEntry = getTokenListEntry(tokenOut, TokenList);

      const parsedAmountIn = parseFloat(amountIn.replace(/,/g, ""));
      if (isNaN(parsedAmountIn) || parsedAmountIn <= 0) {
        return;
      }

      if (!tokenInEntry || !tokenOutEntry || amountIn <= 0) {
        return;
        d;
      }

      const params = {
        coinInType: tokenInEntry,
        coinInAmount:
          (parsedAmountIn * Math.pow(10, tokenIn?.decimals)).toString() + "n",
        coinOutType: tokenOutEntry,
      };

      console.log("Fetching trade routes with params:", params);

      try {
        const response = await axios.post(
          "https://aftermath.finance/api/router/trade-route",
          params
        );
        const routes = response.data.routes;

        setTradeRoutes({
          spotPrice: response.data.spotPrice,
          coinIn: response.data.coinIn,
          coinOut: response.data.coinOut,
          routes: routes,
        });
      } catch (error) {
        console.error("Error fetching trade routes:", error);
        toast({
          title: t("common.error"),
          description: t("common.failed_to_load_routes"),
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    },
    [amountIn]
  );
  useEffect(() => {
    if (amountIn && tokenIn && tokenOut) {
      fetchTradeRoutes(tokenIn, tokenOut);
    }
  }, [amountIn, tokenIn, tokenOut, fetchTradeRoutes]);

  useEffect(() => {
    const updateExchangeRate = async () => {
      if (tokenIn.address && tokenOut.address) {
        try {
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

          if (priceIn && priceOut && priceIn > 0) {
            const rate = priceIn / priceOut;
            setExchangeRate(rate);

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

    // Also update balances when wallet changes
    if (currentAccount?.address) {
      if (tokenIn.symbol) {
        fetchTokenBalance(tokenIn, setTokenInBalance);
      }
      if (tokenOut.symbol) {
        fetchTokenBalance(tokenOut, setTokenOutBalance);
      }
    }
  }, [tokenIn, tokenOut, fetchTokenPrice, currentAccount, fetchTokenBalance]);

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

  // Function to execute the trade
  const executeTrade = async () => {
    if (!tradeRoutes) {
      console.error("No trade routes available.");
      return;
    }

    const params = {
      walletAddress: currentAccount.address,
      completeRoute: {
        coinIn: {
          type: tradeRoutes.coinIn.type,
          amount: tradeRoutes.coinIn.amount,
          tradeFee: tradeRoutes.coinIn.tradeFee,
        },
        coinOut: {
          type: tradeRoutes.coinOut.type,
          amount: tradeRoutes.coinOut.amount,
          tradeFee: tradeRoutes.coinOut.tradeFee,
        },
        netTradeFeePercentage: 0,
        spotPrice: tradeRoutes.spotPrice,
        routes: tradeRoutes.routes.map((route) => ({
          paths: route.paths,
          portion: route.portion,
          coinIn: {
            type: route.coinIn.type,
            amount: route.coinIn.amount,
            tradeFee: route.coinIn.tradeFee,
          },
          coinOut: {
            type: route.coinOut.type,
            amount: route.coinOut.amount,
            tradeFee: route.coinOut.tradeFee,
          },
          spotPrice: route.spotPrice,
        })),
      },

      slippage: 0.01,
      isSponsoredTx: false,
    };

    // Log the parameters being sent to the API
    console.log(
      "Executing trade with parameters:",
      JSON.stringify(params, null, 2)
    );

    try {
      const response = await axios.post(
        "https://aftermath.finance/api/router/transactions/trade",
        params
      );
      console.log("Trade response:", response.data);
      toast({
        title: "Trade Successful",
        description: "Your trade has been executed successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      // Log the error response for debugging
      console.error("Error executing trade:", error);
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        console.error("Error response headers:", error.response.headers);
      }
      toast({
        title: "Trade Failed",
        description: "There was an error executing your trade.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

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
          gap={"8px"}
        >
          <Text color={"#fff"} fontSize={"14px"}>
            Token In
          </Text>
          <Box
            border={"1px solid rgba(255,255,255,0.5)"}
            width={"100%"}
            height={"130px"}
            borderRadius={"12px"}
            padding={"12px"}
          >
            <Flex gap={6} flexDirection={"column"} mt={2}>
              <InputGroup justifyContent={"space-between"}>
                <Input
                  value={amountIn === "0" ? "" : formatNumber(amountIn)}
                  onChange={(e) => {
                    let value = e.target.value;

                    value = value.replace(/[^0-9.]/g, "");

                    handleSetAmountIn(value);
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
                    bg={"linear-gradient(90deg, #40FF9F 0%, #06EEFF 100%)"}
                    _hover={{
                      boxShadow:
                        "0 0 15px rgba(6, 238, 255, 0.6), 0 0 10px rgba(64, 255, 159, 0.4)",
                      background:
                        "linear-gradient(90deg, #06eeff 0%, #40ff9f 100%)",
                    }}
                    lineHeight={"0px"}
                    mx={"5px"}
                    isLoading={balanceLoading}
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
                  Balance: {balanceLoading ? "Loading..." : tokenInBalance}{" "}
                  {tokenIn.symbol}
                  {!balanceLoading &&
                    tokenInValue !== "0" &&
                    ` ($${formatValue(Number(tokenInValue))})`}
                </Text>
              )}
            </Flex>
          </Box>

          {/* Reverse Button */}
          <Flex justifyContent="center" alignItems="center" position="relative">
            <IconButton
              aria-label="Reverse tokens"
              icon={<FiArrowDown size="20px" />}
              onClick={handleReverseTokens}
              isRound
              size="md"
              bg="rgba(255, 255, 255, 0.1)"
              color="#fff"
              _hover={{
                bg: "rgba(255, 255, 255, 0.2)",
                transform: "rotate(180deg)",
                transition: "transform 0.3s ease-in-out",
              }}
              transition="all 0.3s ease-in-out"
              isDisabled={!tokenIn.address || !tokenOut.address}
            />
          </Flex>

          <Text color={"#fff"} fontSize={"14px"}>
            Token Out
          </Text>
          <Box
            border={"1px solid rgba(255,255,255,0.5)"}
            width={"100%"}
            height={"130px"}
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
                  Balance: {balanceLoading ? "Loading..." : tokenOutBalance}{" "}
                  {tokenOut.symbol}
                  {!balanceLoading &&
                    tokenOutValue !== "0" &&
                    ` ($${formatValue(Number(tokenOutValue))})`}
                </Text>
              )}
            </Flex>
          </Box>

          {tokenIn.symbol && tokenOut.symbol && (
            <Box>
              <Text color={"#fff"} fontSize={"14px"}>
                Rate: 1 {tokenIn.symbol} ={" "}
                {exchangeRate ? formatValue(exchangeRate) : "0"}{" "}
                {tokenOut.symbol}
              </Text>
            </Box>
          )}
          {tradeRoutes && (
            <Box width={"100%"}>
              <Text color={"#fff"} fontSize={"14px"} mb={2}>
                Routes:
              </Text>
              {tradeRoutes.routes?.map((route, index) => (
                <Box
                  key={index}
                  p={2}
                  border="1px solid rgba(255, 255, 255, 0.3)"
                  borderRadius="8px"
                  mb={2}
                >
                  <Text color={"#fff"} fontSize={"14px"}>
                    Protocol: {route?.paths[0].protocolName}
                  </Text>
                  <Text color={"#fff"} fontSize={"12px"}>
                    Spot Price: {route?.spotPrice}
                  </Text>
                </Box>
              ))}
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
            isLoading={loading || balanceLoading}
            isDisabled={
              !tokenIn.symbol ||
              !tokenOut.symbol ||
              amountIn === "0" ||
              loading ||
              balanceLoading ||
              !currentAccount
            }
          >
            {!currentAccount ? "Connect Wallet" : t("common.swap")}
          </Button>
        </Box>
      </Box>

      <SwapTokenModal
        isOpen={openTokenIn}
        onClose={closeTokenIn}
        handleChoseToken={handleSelectTokenIn}
        selectedAddr={tokenOut.address}
      />

      <SwapTokenModal
        isOpen={openTokenOut}
        onClose={closeTokenOut}
        handleChoseToken={handleSelectTokenOut}
        selectedAddr={tokenIn.address}
      />

      {tradeRoutes && (
        <Box
          mt={4}
          p={4}
          border="1px solid rgba(255, 255, 255, 0.5)"
          borderRadius="12px"
        >
          <Text color={"#fff"} fontSize={"16px"} fontWeight="bold">
            Trade Route Details
          </Text>
          <Text color={"#fff"} fontSize={"14px"}>
            Spot Price: {tradeRoutes.spotPrice}
          </Text>
          <Text color={"#fff"} fontSize={"14px"}>
            Coin In: {tradeRoutes.coinIn.type} - Amount:{" "}
            {tradeRoutes.coinIn.amount}
          </Text>
          <Text color={"#fff"} fontSize={"14px"}>
            Coin Out: {tradeRoutes.coinOut.type} - Amount:{" "}
            {tradeRoutes.coinOut.amount}
          </Text>

          <Text color={"#fff"} fontSize={"14px"} mt={2}>
            Routes:
          </Text>
          {tradeRoutes.routes.map((route, index) => (
            <Box
              key={index}
              p={2}
              border="1px solid rgba(255, 255, 255, 0.3)"
              borderRadius="8px"
              mb={2}
            >
              <Text color={"#fff"} fontSize={"14px"}>
                Protocol: {route.protocolName}
              </Text>
              <Text color={"#fff"} fontSize={"12px"}>
                Spot Price: {route.spotPrice}
              </Text>
              <Text color={"#fff"} fontSize={"12px"}>
                Coin In: {route.coinIn.type} - Amount: {route.coinIn.amount}
              </Text>
              <Text color={"#fff"} fontSize={"12px"}>
                Coin Out: {route.coinOut.type} - Amount: {route.coinOut.amount}
              </Text>
            </Box>
          ))}

          {/* Button to execute the trade */}
          <Button
            mt={4}
            colorScheme="teal"
            onClick={executeTrade}
            isDisabled={!tradeRoutes}
          >
            Execute Trade
          </Button>
        </Box>
      )}
    </Center>
  );
};

export default Swap;
