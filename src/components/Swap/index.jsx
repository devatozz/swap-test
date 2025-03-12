import React, { useState, useCallback } from "react";
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
} from "@chakra-ui/react";
import TokenAvatar from "src/components/swap/TokenAvatar";
import { currencyFormat, formatInputAmount } from "src/utils/stringUtil";
import { emptyToken } from "src/utils/utils";
import SwapTokenModal from "./TokensModal";
import { useLanguage } from "src/contexts/LanguageContext";
import showIcon from "src/asset/images/swap/showIcon.svg";

const Swap = () => {
  const { t } = useLanguage();
  const [amountIn, setAmountIn] = useState("0");
  const [amountOut, setAmountOut] = useState("0");
  const [tokenIn, setTokenIn] = useState(emptyToken);
  const [tokenOut, setTokenOut] = useState(emptyToken);

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

  const handleSetAmountIn = useCallback(
    (value) => {
      const sanitizedValue = value.replace(/,/g, ".");
      const amount = formatInputAmount(sanitizedValue);
      setAmountIn(amount);

      if (!amount || amount === "0") {
        setAmountOut("0");
        return;
      }
    },
    [tokenIn, tokenOut]
  );

  const handleSetMaxTokenIn = useCallback(() => {
    if (tokenIn.balance) {
      setAmountIn(tokenIn.balance);
    }
  }, [tokenIn]);

  const handleSelectTokenIn = useCallback(
    (token) => {
      setTokenIn(token);
      closeTokenIn();
    },
    [closeTokenIn]
  );

  const handleSelectTokenOut = useCallback(
    (token) => {
      setTokenOut(token);
      closeTokenOut();
    },
    [closeTokenOut]
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
            </Flex>
          </Box>

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
            isDisabled={!tokenIn.symbol || !tokenOut.symbol || amountIn === "0"}
          >
            {t("common.swap")}
          </Button>
        </Box>
      </Box>

      <SwapTokenModal
        isOpen={openTokenIn}
        onClose={closeTokenIn}
        handleChoseToken={handleSelectTokenIn}
        selectedAddr={tokenIn.address}
      />

      <SwapTokenModal
        isOpen={openTokenOut}
        onClose={closeTokenOut}
        handleChoseToken={handleSelectTokenOut}
        selectedAddr={tokenOut.address}
      />
    </Center>
  );
};

export default Swap;
