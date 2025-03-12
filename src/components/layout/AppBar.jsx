import React from "react";
import {
  Box,
  Flex,
  Stack,
  useColorModeValue,
  Button,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerBody,
  useMediaQuery,
  VStack,
  PopoverTrigger,
  PopoverContent,
  Popover,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import NextLink from "next/link";
import { useRouter } from "next/router";
import styled from "styled-components";
import Network from "./Network";
import Image from "next/image";
import { ImageLanguageSwitcher } from "../Language/Switcher";
import { AthenButton } from "../Button/AthenButton";
import { useLanguage } from "src/contexts/LanguageContext";
import { IoMdArrowDropdown } from "react-icons/io";

const TransColored = styled.span`
  color: #cdd6d4;
  font-size: 16px;
  font-family: Lexend;
  font-weight: 600;
  line-height: 125%;
  display: flex;
  gap: 4px;
  opacity: 1;
  background: #fff;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  position: relative;

  &:hover,
  &.active {
    opacity: 1;
    background: linear-gradient(90deg, #40ff9f 0%, #06eeff 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  @media screen and (max-width: 1600px) {
    font-size: 16px;
    align-items: center;
    img {
      width: 16px;
      height: 18px;
    }
  }
  @media screen and (max-width: 1300px) {
    padding: 0 !important;
  }
  @media screen and (max-width: 1200px) {
    font-size: 14px;
    padding: 0 !important;
    img {
      width: 14px;
      height: 16px;
    }
  }
  @media screen and (max-width: 1150px) {
    font-size: 12px;
    img {
      width: 12px;
      height: 14px;
    }
  }
`;
const TransColoredMobile = styled.span`
  color: #fff;
  font-size: 16px;
  font-family: Lexend;
  font-weight: 600;
  line-height: 125%;
  display: flex;
  gap: 4px;
  opacity: 1;
  &:hover,
  &.active {
    opacity: 1;
    color: #78ffb6;
  }
`;
const TransColoredSubMobile = styled.span`
  color: #fff;
  font-size: 14px;
  font-family: Lexend;
  font-weight: 600;
  line-height: 125%;
  display: flex;
  gap: 4px;
  margin-left: 10px;
  opacity: 1;
  &:hover,
  &.active {
    opacity: 1;
    color: #78ffb6;
  }
`;

export default function AppBar() {
  const { t, locale } = useLanguage();
  const [isDesktop] = useMediaQuery("(min-width: 767px)");
  const [isIpad] = useMediaQuery("(min-width: 1359px)");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();
  const router = useRouter();

  const NAV_ITEMS = [{ label: t(`navbar.trade`), href: "/" }];
  return (
    <Box
      borderBottom={"1px solid"}
      borderColor={{ md: "#94FFDF", base: "#94FFDF" }}
    >
      <Flex
        minH={"90px"}
        py={{ base: 2 }}
        justifyContent={"space-between"}
        maxW={locale === "vi" ? "1400px" : "1330px"}
        align={"center"}
        bgColor={"transparent"}
        margin={"0px auto"}
        alignItems={"center"}
        px={{ base: 2 }}
        gap={{
          base: "5px",
        }}
      >
        <Flex
          alignItems={"center"}
          justifyContent={"start"}
          gap={{ lg: "50px", sm: "10px" }}
        >
          {!isIpad && (
            <Button
              ref={btnRef}
              bg="transparent"
              color="#94ffdf"
              onClick={onOpen}
            >
              <HamburgerIcon fontSize={{ base: "24px", md: "32px" }} />
            </Button>
          )}

          <NextLink href={"/"}>
            <Flex gap={2} alignItems={"center"}>
              {isDesktop ? (
                <Text fontSize={"18px"} color={"#78ffb6"} fontWeight={700}>
                  MINTEST
                </Text>
              ) : (
                <Text fontSize={"18px"} color={"#78ffb6"} fontWeight={700}>
                  MINTEST
                </Text>
              )}
            </Flex>
          </NextLink>

          {isIpad && (
            <Flex>
              <Stack direction={"row"} spacing={{ lg: "5px", xl: 7 }}>
                {NAV_ITEMS.map((navItem, index) => (
                  <Box
                    key={index}
                    display={"flex"}
                    alignItems={"start"}
                    justifyContent={"center"}
                  >
                    {navItem.submenu ? (
                      <Menu>
                        <MenuButton>
                          <TransColored
                            className={
                              (navItem.label === t(`navbar.earn`) &&
                                (router.pathname === "/liquidity" ||
                                  router.pathname === "/stake")) ||
                              (navItem.label === t(`navbar.domain`) &&
                                (router.pathname === "/registerdomain" ||
                                  router.pathname === "/mydomain"))
                                ? "active"
                                : ""
                            }
                          >
                            {navItem.label}
                            {(navItem.label === t(`navbar.earn`) ||
                              navItem.label === t(`navbar.domain`)) && (
                              <svg
                                width="20"
                                height="20"
                                viewBox="0 0 16 16"
                                fill="none"
                                style={{
                                  marginLeft: "4px",
                                  color:
                                    (navItem.label === t(`navbar.earn`) &&
                                      (router.pathname === "/liquidity" ||
                                        router.pathname === "/stake")) ||
                                    (navItem.label === t(`navbar.domain`) &&
                                      (router.pathname === "/registerdomain" ||
                                        router.pathname === "/mydomain"))
                                      ? "#78ffb6"
                                      : "white",
                                }}
                              >
                                <path
                                  d="M8.83435 11.402C8.43911 12.001 7.56024 12.001 7.165 11.402L4.4041 7.21773C3.9654 6.55288 4.44223 5.66699 5.23877 5.66699L10.7606 5.66699C11.5571 5.66699 12.0339 6.55288 11.5953 7.21773L8.83435 11.402Z"
                                  fill="currentColor"
                                />
                              </svg>
                            )}
                            {navItem.label === t(`navbar.more`) && (
                              <svg
                                width="20"
                                height="20"
                                viewBox="0 0 16 16"
                                fill="none"
                                style={{
                                  marginLeft: "4px",
                                  color: "white",
                                }}
                              >
                                <path
                                  d="M8.83435 11.402C8.43911 12.001 7.56024 12.001 7.165 11.402L4.4041 7.21773C3.9654 6.55288 4.44223 5.66699 5.23877 5.66699L10.7606 5.66699C11.5571 5.66699 12.0339 6.55288 11.5953 7.21773L8.83435 11.402Z"
                                  fill="currentColor"
                                />
                              </svg>
                            )}
                          </TransColored>
                        </MenuButton>
                        <MenuList
                          background={"#3A4A45"}
                          color={"#fff"}
                          minWidth={"161px"}
                          padding={"0px"}
                          outline={"none"}
                          border={"none"}
                          zIndex={9999}
                          borderRadius={"12px"}
                          overflow={"hidden"}
                        >
                          {navItem.submenu.map((submenuItem, subIndex) =>
                            submenuItem.target ? (
                              <MenuItem
                                key={subIndex}
                                as="a"
                                href={submenuItem.href}
                                target={submenuItem.target}
                                rel="noopener noreferrer"
                                background={"transparent"}
                                minWidth={"161px"}
                                height={"44px"}
                                _hover={{
                                  background:
                                    "linear-gradient(90deg, #78FFB6 0%, #3AF3E8 100%)",
                                  color: "#000",
                                }}
                              >
                                <Text fontSize={"16px"} fontWeight={400}>
                                  {submenuItem.label}
                                </Text>
                              </MenuItem>
                            ) : (
                              <NextLink
                                key={subIndex}
                                href={submenuItem.href}
                                passHref
                              >
                                <MenuItem
                                  as="a"
                                  background={"transparent"}
                                  minWidth={"161px"}
                                  height={"44px"}
                                  _hover={{
                                    background:
                                      "linear-gradient(90deg, #78FFB6 0%, #3AF3E8 100%)",
                                    color: "#000",
                                  }}
                                >
                                  <Text fontSize={"16px"} fontWeight={400}>
                                    {submenuItem.label}
                                  </Text>
                                </MenuItem>
                              </NextLink>
                            )
                          )}
                        </MenuList>
                      </Menu>
                    ) : (
                      <Popover trigger={"hover"} placement={"bottom-start"}>
                        <PopoverTrigger>
                          {navItem.target ? (
                            <a
                              href={navItem.href}
                              target={navItem.target}
                              rel="noopener noreferrer"
                            >
                              <TransColored
                                className={
                                  router.pathname === navItem.href
                                    ? "active"
                                    : ""
                                }
                              >
                                {navItem.label}
                              </TransColored>
                            </a>
                          ) : (
                            <NextLink href={navItem.href} passHref>
                              <TransColored
                                as="a"
                                className={
                                  router.pathname === navItem.href
                                    ? "active"
                                    : ""
                                }
                              >
                                {navItem.label}
                              </TransColored>
                            </NextLink>
                          )}
                        </PopoverTrigger>
                      </Popover>
                    )}
                  </Box>
                ))}
              </Stack>
            </Flex>
          )}
        </Flex>
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          gap={"16px"}
        >
          <Network />
          {isDesktop && <ImageLanguageSwitcher />}
        </Box>
      </Flex>

      {!isIpad && (
        <Drawer
          isOpen={isOpen}
          placement="left"
          onClose={onClose}
          finalFocusRef={btnRef}
        >
          <DrawerOverlay />
          <Box position={"relative"} width={"253px"}>
            <DrawerContent
              bg="#222322"
              id="custom-drawer"
              role="dialog"
              sx={{
                "&[role='dialog']": {
                  width: "253px !important",
                },
              }}
            >
              <Box
                display={"flex"}
                justifyContent={"space-between"}
                marginTop={"15px"}
                marginLeft={"15px"}
                width={"124px"}
                height={"24px"}
              >
                <Text fontSize={"16px"} color={"#78ffb6"} fontWeight={700}>
                  MINTEST
                </Text>
              </Box>
              <DrawerCloseButton
                color="rgba(255, 255, 255, 0.6)"
                fontSize={"16px"}
              />

              <DrawerBody padding={"20px"}>
                <Flex h="full" w="full" align={"start"}>
                  <VStack
                    w="full"
                    h="full"
                    spacing={4}
                    align="start"
                    justifyContent={"space-between"}
                  >
                    <Accordion allowToggle w="full">
                      {NAV_ITEMS.map((navItem, index) => (
                        <Box
                          key={index}
                          w="full"
                          minHeight="60px"
                          display="flex"
                          alignItems="start"
                          justifyContent="space-between"
                          borderBottom="0.5px solid #232121"
                        >
                          {navItem.submenu ? (
                            <AccordionItem border="none">
                              {({ isExpanded }) => (
                                <>
                                  <AccordionButton
                                    padding={0}
                                    _expanded={{
                                      bg: "transparent",
                                      color: "#78FFB6",
                                    }}
                                    color="#fff"
                                  >
                                    <Box
                                      marginTop="16px"
                                      width="220px"
                                      display="flex"
                                      alignItems="start"
                                      justifyContent="space-between"
                                    >
                                      <Box
                                        flex="1"
                                        textAlign="left"
                                        color="inherit"
                                        paddingBottom="8px"
                                      >
                                        {navItem.label}
                                      </Box>
                                      <IoMdArrowDropdown
                                        color="inherit"
                                        style={{
                                          transition: "transform 0.3s ease",
                                          transform: isExpanded
                                            ? "rotate(180deg)"
                                            : "rotate(0deg)",
                                        }}
                                      />
                                    </Box>
                                  </AccordionButton>
                                  <AccordionPanel
                                    bg="#3a403e"
                                    borderRadius="12px"
                                    padding="0px"
                                    overflow="hidden"
                                    margin="0px"
                                    onClick={onClose}
                                  >
                                    {navItem.submenu.map(
                                      (submenuItem, subIndex) => (
                                        <NextLink
                                          key={subIndex}
                                          href={submenuItem.href}
                                          passHref
                                          legacyBehavior
                                        >
                                          <a>
                                            <Box
                                              minHeight="44px"
                                              display="flex"
                                              alignItems="center"
                                              justifyContent="start"
                                              _hover={{
                                                bg: "#4d5351",
                                              }}
                                              width="100%"
                                              height="100%"
                                            >
                                              <TransColoredSubMobile
                                                className={
                                                  router.pathname ===
                                                  submenuItem.href
                                                    ? "active"
                                                    : ""
                                                }
                                              >
                                                {submenuItem.label}
                                              </TransColoredSubMobile>
                                            </Box>
                                          </a>
                                        </NextLink>
                                      )
                                    )}
                                  </AccordionPanel>
                                </>
                              )}
                            </AccordionItem>
                          ) : (
                            <Box
                              width="100%"
                              minHeight="60px"
                              display="flex"
                              alignItems="center"
                              justifyContent="flex-start"
                              onClick={onClose}
                            >
                              <NextLink
                                href={navItem.href}
                                passHref
                                legacyBehavior
                              >
                                <a
                                  target={navItem.target}
                                  rel={
                                    navItem.target
                                      ? "noopener noreferrer"
                                      : undefined
                                  }
                                >
                                  <TransColoredMobile
                                    className={
                                      router.pathname === navItem.href
                                        ? "active"
                                        : ""
                                    }
                                  >
                                    {navItem.label}
                                  </TransColoredMobile>
                                </a>
                              </NextLink>
                            </Box>
                          )}
                        </Box>
                      ))}
                    </Accordion>

                    <Box
                      width={"220px"}
                      display={"flex"}
                      alignItems={"center"}
                      justifyContent={"center"}
                      padding={"10px 0px"}
                    >
                      <ImageLanguageSwitcher />
                    </Box>
                  </VStack>
                </Flex>
              </DrawerBody>
            </DrawerContent>
          </Box>
        </Drawer>
      )}
    </Box>
  );
}
