import React, { useEffect, useCallback, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  VStack,
  Button,
  Box,
  Text,
} from "@chakra-ui/react";
import styled from "styled-components";
import { BREAKPOINTS } from "../home/Banner";
import { useLanguage } from "src/contexts/LanguageContext";
import Image from "next/image";
import { LuCopy } from "react-icons/lu";
import { useToast } from "@chakra-ui/react";
const WrapperBox = styled.div`
  width: 400px;
  height: fit-content;
  padding: 12px 24px 0px 24px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 8px;
  border-radius: 12px;
  background: #0f1211;
  box-shadow: 0px 0px 4px 0px rgba(255, 254, 254, 0.25);
  backdrop-filter: blur(200px);
  position: relative;
  overflow: hidden;

  margin: 0px auto;
  @media screen and (max-width: ${BREAKPOINTS.xxl}px) {
    width: 400px;
    height: auto;
  }
  @media screen and (max-width: ${BREAKPOINTS.md}px) {
    width: 95%;
    height: auto;
    align-items: center;
    justify-content: start;
    backdrop-filter: none;
    z-index: 2;
  }

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
`;

export default function MobileConnectModal({ isOpen, onClose }) {
  const { t } = useLanguage();
  const [isCopied, setCopied] = useState(false);
  const toast = useToast();
  const copyToClipboard = async () => {
    const fullUrl = window.location.href;
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      toast({
        title: t(`toast.copy_success`),
        description: t(`toast.copy_description`),
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
      });
      setTimeout(() => setCopied(false), 500);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay bg="rgba(0, 0, 0, 0.8)" />
      <ModalContent bg={"transparent"}>
        <WrapperBox>
          <div className="background-top" />

          <ModalHeader width={"100%"} padding={"0px"}>
            <Box
              display={"flex"}
              alignItems={"start"}
              justifyContent={"space-between"}
              position={"relative"}
              width={"100%"}
            >
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

          <ModalBody padding={"24px 0px"} width={"100%"}>
            <VStack w="full">
              <Box>
                <Text
                  fontSize={{ base: "16px", md: "20px" }}
                  color={"#fff"}
                  textAlign={"center"}
                >
                  {t(`common.mobile_connect`)}
                </Text>
              </Box>
              <Box width={"80%"} marginTop={"12px"}>
                <Button
                  bg={" linear-gradient(90deg, #40FF9F 0%, #06EEFF 100%)"}
                  _hover={{
                    boxShadow:
                      "0 0 15px rgba(6, 238, 255, 0.6), 0 0 20px rgba(64, 255, 159, 0.4)",
                    background:
                      "linear-gradient(90deg, #06eeff 0%, #40ff9f 100%)",
                  }}
                  color={"#000"}
                  w={"full"}
                  height={"48px"}
                  borderRadius={"24px"}
                  onClick={copyToClipboard}
                  disabled={isCopied}
                >
                  <span
                    style={{
                      marginRight: "5px",
                    }}
                  >
                    <LuCopy size={24} />
                  </span>
                  {t(`common.copy_address`)}
                </Button>
              </Box>
            </VStack>
          </ModalBody>
        </WrapperBox>
      </ModalContent>
    </Modal>
  );
}
