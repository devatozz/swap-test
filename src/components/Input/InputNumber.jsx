import React, { useState } from "react";
import { Input, InputGroup, Button, Box, Text, Image } from "@chakra-ui/react";
import TokenAvatar from "../swap/TokenAvatar";
import showIcon from "src/asset/images/swap/showIcon.svg";

const FlexibleNumberInput = ({
  onAmountChange,
  token1Name,
  toggleTokenIn,
  account,
  t,
  handleSetMaxToken1,
}) => {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e) => {
    const value = e.target.value;

    if (/^[0-9]*[.,]?[0-9]*$/.test(value)) {
      setInputValue(value);

      const standardizedValue = value.replace(/,/g, ".");
      onAmountChange(standardizedValue);
    }
  };

  return (
    <InputGroup justifyContent="space-between">
      <Input
        value={inputValue}
        onChange={handleInputChange}
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
        position="relative"
        display="flex"
        alignItems="center"
        justifyContent="end"
        gap="10px"
        ml="5px"
      >
        <Button
          minWidth={{ md: "53px", base: "48px" }}
          height="27px"
          padding="8px"
          borderRadius="24px"
          onClick={handleSetMaxToken1}
          bg="linear-gradient(90deg, #40FF9F 0%, #06EEFF 100%)"
          _hover={{
            boxShadow:
              "0 0 15px rgba(6, 238, 255, 0.6), 0 0 10px rgba(64, 255, 159, 0.4)",
            background: "linear-gradient(90deg, #06eeff 0%, #40ff9f 100%)",
          }}
          lineHeight="0px"
        >
          <Box fontSize="16px">{t("common.max")}</Box>
        </Button>
        <Button
          border="none"
          outline="none"
          justifyContent="right"
          minW="100px"
          variant="outline"
          color="#fff"
          aria-label="Options token in"
          background="transparent"
          _hover={{ background: "transparent" }}
          padding="0px"
          fontSize="20px"
          fontWeight="700"
          lineHeight="28px"
          fontFamily="Lexend"
          onClick={toggleTokenIn}
          disabled={!account}
          leftIcon={
            <TokenAvatar
              size="24px"
              name={token1Name.symbol ? token1Name.symbol : "In"}
              icon={token1Name.icon}
            />
          }
          rightIcon={<Image size="sm" src={showIcon} alt="img" />}
        >
          <Text fontSize={{ base: "16px", md: "20px" }}>
            {token1Name.symbol ? token1Name.symbol : t(`common.select`)}
          </Text>
        </Button>
      </Box>
    </InputGroup>
  );
};

export default FlexibleNumberInput;
