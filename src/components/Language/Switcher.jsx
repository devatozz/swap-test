import React from "react";
import { useLanguage } from "src/contexts/LanguageContext";
import { languages } from "src/config/languages";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Box,
  useBreakpointValue,
} from "@chakra-ui/react";
import Image from "next/image";
import { AthenButton } from "../Button/AthenButton";
import { AthenButtonLanguage } from "../Button/AthenButtonLanguage";
import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";

export const ImageLanguageSwitcher = ({ className = "", zIndex = 1000 }) => {
  const { locale, changeLanguage } = useLanguage();
  const isIpad = useBreakpointValue({ base: true, xl: false });

  return (
    <Menu>
      {({ isOpen }) => (
        <>
          <MenuButton
            as={AthenButtonLanguage}
            className={className}
            background={"transparent"}
            color={"#fff"}
            textAlign={"center"}
            $width={"168px"}
          >
            <Box
              display="flex"
              alignItems="center"
              justifyContent={{ base: "space-around", md: "center" }}
            >
              <Box
                display="flex"
                alignItems="center"
                width={"100%"}
                justifyContent={{ base: "space-around", md: "center" }}
                gap={"10px"}
              >
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent={"center"}
                  gap={"8px"}
                >
                  <Image
                    src={languages[locale].img}
                    alt={`${languages[locale].nativeName} flag`}
                    style={{ width: "20px", height: "20px" }}
                  />
                  {languages[locale].nativeName}
                </Box>

                {isOpen ? (
                  <ChevronUpIcon
                    width={"24px"}
                    height={"24px"}
                    color={"#fff"}
                    transform={isIpad ? "rotate(180deg)" : "rotate(0deg)"}
                  />
                ) : (
                  <ChevronDownIcon
                    width={"24px"}
                    height={"24px"}
                    color={"#fff"}
                    transform={isIpad ? "rotate(180deg)" : "rotate(0deg)"}
                  />
                )}
              </Box>
            </Box>
          </MenuButton>
          <MenuList
            background={"#3A4A45"}
            color={"#fff"}
            minWidth={{ base: "220px", xl: "168px" }}
            border={"1px solid #FFFFFF1A"}
            p={0}
          >
            {Object.entries(languages).map(([code, lang]) => (
              <MenuItem
                key={code}
                onClick={() => changeLanguage(code)}
                display="flex"
                alignItems="center"
                background={"#3A4A45"}
                height={"44px"}
                minWidth={{ base: "220px", xl: "168px" }}
                _hover={{
                  background:
                    "linear-gradient(90deg, #40FF9F 0%, #06EEFF 100%)",
                  borderRadius: "0px",
                  color: "#000",
                }}
              >
                <Image
                  src={lang.img}
                  alt={`${lang.nativeName} flag`}
                  style={{ width: "20px", height: "20px", marginRight: "8px" }}
                />
                {lang.nativeName}
              </MenuItem>
            ))}
          </MenuList>
        </>
      )}
    </Menu>
  );
};
