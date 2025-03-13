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
import {
  ConnectModal,
  useCurrentAccount,
  useSuiClient,
  useSignAndExecuteTransactionBlock,
} from "@mysten/dapp-kit";
import TokenList from "src/constant/tokenlist.json";
import { FiArrowDown } from "react-icons/fi";
import { getTokenBalance } from "src/utils/getTokenBalance";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { FiSettings } from "react-icons/fi";
import { MdClose } from "react-icons/md";

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
    mutate: signAndExecuteTransactionBlock,
    isPending: isTransactionPending,
  } = useSignAndExecuteTransactionBlock();

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

  const {
    isOpen: isSlippageModalOpen,
    onOpen: openSlippageModal,
    onClose: closeSlippageModal,
  } = useDisclosure();

  const [tokenInBalance, setTokenInBalance] = useState("0");
  const [tokenOutBalance, setTokenOutBalance] = useState("0");
  const [tokenInValue, setTokenInValue] = useState("0");
  const [tokenOutValue, setTokenOutValue] = useState("0");
  const [loading, setLoading] = useState(false);
  const [exchangeRate, setExchangeRate] = useState(null);
  const [balanceLoading, setBalanceLoading] = useState(false);
  const [tradeRoutes, setTradeRoutes] = useState(null);
  const [slippage, setSlippage] = useState(5);
  const [minReceive, setMinReceive] = useState("0");

  const handleSetAmountIn = useCallback(
    (value) => {
      const sanitizedValue = value.replace(/,/g, ".");
      const amount = formatInputAmount(sanitizedValue);
      setAmountIn(amount);

      if (!amount || amount === "0") {
        setAmountOut("0");
        setMinReceive("0");
        return;
      }

      if (exchangeRate && tokenIn.address && tokenOut.address) {
        const calculatedAmountOut = (parseFloat(amount) * exchangeRate).toFixed(
          6
        );
        setAmountOut(calculatedAmountOut);

        const minReceiveAmount = (
          parseFloat(calculatedAmountOut) *
          (1 - slippage / 100)
        ).toFixed(6);
        setMinReceive(minReceiveAmount);
      }
    },
    [tokenIn, tokenOut, exchangeRate, slippage]
  );

  const handleSetMaxTokenIn = useCallback(() => {
    if (tokenInBalance && tokenInBalance !== "0") {
      setAmountIn(tokenInBalance);

      if (exchangeRate && tokenIn.address && tokenOut.address) {
        const calculatedAmountOut = (
          parseFloat(tokenInBalance) * exchangeRate
        ).toFixed(6);
        setAmountOut(calculatedAmountOut);
      }
    }
  }, [tokenIn, exchangeRate, tokenOut, tokenInBalance]);

  const handleSetHalfTokenIn = useCallback(() => {
    if (tokenInBalance && tokenInBalance !== "0") {
      const halfAmount = (parseFloat(tokenInBalance) / 2).toFixed(6);
      setAmountIn(halfAmount);

      if (exchangeRate && tokenIn.address && tokenOut.address) {
        const calculatedAmountOut = (
          parseFloat(halfAmount) * exchangeRate
        ).toFixed(6);
        setAmountOut(calculatedAmountOut);
      }
    }
  }, [tokenIn, exchangeRate, tokenOut, tokenInBalance]);

  const handleReverseTokens = useCallback(() => {
    const tempTokenIn = tokenIn;
    const tempTokenOut = tokenOut;
    const tempAmountIn = amountIn;
    const tempAmountOut = amountOut;
    const tempTokenInBalance = tokenInBalance;
    const tempTokenOutBalance = tokenOutBalance;
    const tempTokenInValue = tokenInValue;
    const tempTokenOutValue = tokenOutValue;

    setTokenIn(tempTokenOut);
    setTokenOut(tempTokenIn);

    setTokenInBalance(tempTokenOutBalance);
    setTokenOutBalance(tempTokenInBalance);
    setTokenInValue(tempTokenOutValue);
    setTokenOutValue(tempTokenInValue);

    if (tempAmountOut !== "0") {
      setAmountIn(tempAmountOut);
    }
    if (tempAmountIn !== "0") {
      setAmountOut(tempAmountIn);
    }

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
          position: "bottom-right",
        });
        balanceSetter("0");
        return "0";
      } finally {
        setBalanceLoading(false);
      }
    },
    [currentAccount, t, toast]
  );

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
          position: "bottom-right",
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
          position: "bottom-right",
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

    if (currentAccount?.address) {
      if (tokenIn.symbol) {
        fetchTokenBalance(tokenIn, setTokenInBalance);
      }
      if (tokenOut.symbol) {
        fetchTokenBalance(tokenOut, setTokenOutBalance);
      }
    }
  }, [tokenIn, tokenOut, fetchTokenPrice, currentAccount, fetchTokenBalance]);

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

  useEffect(() => {
    const updateBalances = async () => {
      if (currentAccount?.address) {
        if (tokenIn.symbol) {
          await fetchTokenBalance(tokenIn, setTokenInBalance);
        }
        if (tokenOut.symbol) {
          await fetchTokenBalance(tokenOut, setTokenOutBalance);
        }
      }
    };

    updateBalances();
  }, [tokenIn, tokenOut, currentAccount]);

  const prepareTrade = async () => {
    if (!tradeRoutes) {
      console.error("No trade routes available.");
      return;
    }
    setLoading(true);
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
    try {
      const response = await axios.post(
        "https://aftermath.finance/api/router/transactions/trade",
        params
      );
      const txData = response.data;
      await executeTrade({ txb: txData });
    } catch (error) {
      console.error("Error preparing trade:", error);
      if (error.response) {
        console.error("Error response data:", error.response.data);
      }
      toast({
        title: "Trade Preparation Failed",
        description:
          error.message || "There was an error preparing your trade.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom-right",
      });
    } finally {
      setLoading(false);
    }
  };

  const executeTrade = async (payload) => {
    try {
      if (!payload || !payload.txb) {
        toast({
          title: "Trade Failed",
          description: "Invalid transaction payload structure.",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "bottom-right",
        });
        return;
      }

      let txb;

      if (payload.txb) {
        txb = TransactionBlock.from(payload.txb);
      } else {
        txb = TransactionBlock.from(payload);
      }

      signAndExecuteTransactionBlock(
        {
          transactionBlock: txb,
          options: {
            showEffects: true,
            showEvents: true,
          },
        },
        {
          onSuccess: async (result) => {
            await fetchTokenBalance(tokenIn, setTokenInBalance);
            await fetchTokenBalance(tokenOut, setTokenOutBalance);

            setAmountIn("0");
            setAmountOut("0");

            toast({
              title: "Trade Successful",
              description: `Successfully swapped ${tokenIn.symbol} to ${tokenOut.symbol}`,
              status: "success",
              duration: 5000,
              isClosable: true,
              position: "bottom-right",
            });

            fetchTradeHistory(currentAccount.address);
          },
          onError: (error) => {
            console.error("Transaction failed:", error);
            toast({
              title: "Trade Failed",
              description:
                error.message || "There was an error executing your trade.",
              status: "error",
              duration: 5000,
              isClosable: true,
              position: "bottom-right",
            });
          },
        }
      );
    } catch (error) {
      console.error("Error executing trade:", error);
      toast({
        title: "Trade Failed",
        description:
          error.message || "There was an error executing your trade.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom-right",
      });
    }
  };

  const fetchTradeHistory = async (walletAddress) => {
    try {
      const response = await axios.post(
        "https://aftermath.finance/api/router/events-by-user",
        {
          walletAddress: walletAddress,
          limit: 10,
        }
      );
    } catch (error) {
      console.error("Error fetching trade history:", error);
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
      {isSlippageModalOpen && (
        <Box
          position="fixed"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          bg="#101010"
          border={"1px solid rgba(255,255,255,0.4)"}
          borderRadius="12px"
          p={4}
          zIndex={1000}
          width="300px"
        >
          <Flex justifyContent="space-between" alignItems="center">
            <Text color="#fff" fontSize="18px">
              Set Slippage
            </Text>
            <IconButton
              aria-label="Close Slippage Modal"
              icon={<MdClose />}
              onClick={closeSlippageModal}
              bg="transparent"
              color="#fff"
              _hover={{ bg: "rgba(255, 255, 255, 0.1)" }}
            />
          </Flex>
          <Box mt={4}>
            <Input
              type="number"
              value={slippage}
              onChange={(e) =>
                setSlippage(Math.max(0, Math.min(100, e.target.value)))
              }
              placeholder="Enter slippage percentage"
              border="none"
              outline="none"
              _placeholder={{ color: "rgba(255, 255, 255, 0.4)" }}
              fontSize={{ base: "16px", md: "20px" }}
              fontWeight="700"
              lineHeight="30px"
              padding="0px"
              autoComplete="off"
              fontFamily="Lexend"
              _focus={{ boxShadow: "none", border: "none", outline: "none" }}
            />
          </Box>
          <Button
            mt={4}
            width="100%"
            onClick={closeSlippageModal}
            bg="linear-gradient(90deg, #40FF9F 0%, #06EEFF 100%)"
            _hover={{
              boxShadow:
                "0 0 15px rgba(6, 238, 255, 0.6), 0 0 10px rgba(64, 255, 159, 0.4)",
              background: "linear-gradient(90deg, #06eeff 0%, #40ff9f 100%)",
            }}
          >
            Save
          </Button>
        </Box>
      )}

      <Box>
        <Box
          border={"2px solid rgba(255,255,255,0.1)"}
          width={"400px"}
          height={"fit-content"}
          borderRadius={"12px"}
          display={"flex"}
          padding={"8px 24px 24px 24px"}
          flexDirection={"column"}
          gap={"8px"}
        >
          <Box
            display={"flex"}
            width={"100%"}
            justifyContent={"end"}
            alignItems={"center"}
          >
            <IconButton
              aria-label="Set Slippage"
              icon={<FiSettings />}
              onClick={openSlippageModal}
              bg="transparent"
              color="#fff"
              _hover={{ bg: "rgba(255, 255, 255, 0.1)" }}
            />
          </Box>
          <Text color={"#fff"} fontSize={"14px"}>
            Token In
          </Text>
          <Box
            border={"1px solid rgba(255,255,255,0.5)"}
            width={"100%"}
            height={"fit-content"}
            minH={"130px"}
            borderRadius={"12px"}
            padding={"12px"}
          >
            <Flex gap={1} flexDirection={"column"} mt={2}>
              <Box
                display={"flex"}
                width={"100%"}
                gap={2}
                alignItems={"center"}
                justifyContent={"end"}
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
                >
                  {t(`common.max`)}
                </Button>

                <Button
                  minWidth={{ md: "53px", base: "48px" }}
                  height={"27px"}
                  padding={"8px"}
                  borderRadius={"24px"}
                  fontSize={{ base: "14px", md: "16px" }}
                  onClick={handleSetHalfTokenIn}
                  bg={"linear-gradient(90deg, #FF9F40 0%, #EEFF06 100%)"}
                  _hover={{
                    boxShadow:
                      "0 0 15px rgba(255, 159, 64, 0.6), 0 0 10px rgba(255, 255, 6, 0.4)",
                    background:
                      "linear-gradient(90deg, #eeff06 0%, #ff9f40 100%)",
                  }}
                  lineHeight={"0px"}
                >
                  {t(`common.half`)}
                </Button>
              </Box>
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
                  Balance: {tokenInBalance} {tokenIn.symbol}
                  {tokenInValue !== "0" &&
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
            height={"fit-content"}
            minH={"130px"}
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
                  Balance: {tokenOutBalance} {tokenOut.symbol}
                  {tokenOutValue !== "0" &&
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

          <Box>
            <Text color={"#fff"} fontSize={"14px"}>
              Minimum Receive: {minReceive} {tokenOut.symbol}
            </Text>
          </Box>
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
            isLoading={loading || balanceLoading || isTransactionPending}
            onClick={prepareTrade}
            isDisabled={
              !tokenIn.symbol ||
              !tokenOut.symbol ||
              amountIn === "0" ||
              loading ||
              balanceLoading ||
              isTransactionPending ||
              !currentAccount ||
              !tradeRoutes ||
              parseFloat(amountOut) < parseFloat(minReceive)
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
    </Center>
  );
};

export default Swap;
