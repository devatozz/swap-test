// components/footer/Footer.tsx
import React, { useState } from "react";
import FooterCopyright from "src/components/Footer/FooterCopyright";
import FooterLogo from "src/components/Footer/FooterLogo";
import FooterSocialLinks from "src/components/Footer/FooterSocialLink";
import Link from "next/link";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { FaPlus, FaMinus } from "react-icons/fa6";
import { useLanguage } from "src/contexts/LanguageContext";
import styled from "styled-components";
import { useMediaQuery } from "@chakra-ui/react";
import { Box, Text } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
export const BREAKPOINTS = {
  xs: 396,
  sss: 325,
  xxs: 370,
  sm: 640,
  md: 767,
  lg: 1024,
  xl: 1280,
  xxl: 1536,
  xxxl: 1920,
};
const FooterWrapper = styled.div`
  background: linear-gradient(to top, #012e1d, rgba(0, 0, 0, 0.9));
  color: white;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  padding-bottom: 10px;
  background-image: url(./bg/bg-footer.png);
  box-shadow: 6px 0px 40px 0px #72feba;
  border-top: 1px solid;
  border-image-source: linear-gradient(90deg, #78ffb6 0%, #3af3e8 100%);
  border-image-slice: 1;
  @media screen and (max-width: ${BREAKPOINTS.md}px) {
    margin-top: 40px;
  }
`;

const FooterContainer = styled.div`
  max-width: 1440px;
  margin: 0 auto;
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 1rem 1rem 0rem 1rem;
  justify-content: space-between;
  @media screen and (max-width: ${BREAKPOINTS.md}px) {
    padding: 12px 0px 0px;
  }
`;

const FooterContent = styled.div`
  display: flex;
  padding: 16px 16px 0px 16px;
  justify-content: space-between;
  align-items: flex-start;
  flex-direction: row;
  gap: 0;

  @media screen and (max-width: ${BREAKPOINTS.md}px) {
    gap: 0.5rem;
    flex-direction: column-reverse;
    align-items: center;
    margin: 0px auto;
    justify-content: center;

    padding-top: 0.5rem;
  }
`;

const FooterLeft = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  margin-bottom: 0.5rem;
  font-size: 20px;
  p {
    font-size: 18px;
    text-align: center;
    margin-bottom: 1rem;
  }
  .social-links {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-top: 0.125rem;
  }
  @media screen and (max-width: ${BREAKPOINTS.md}px) {
    text-align: center;
    align-items: center;
  }
`;

const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  @media screen and (max-width: ${BREAKPOINTS.md}px) {
    & > :first-child {
      grid-column: span 2;
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }

    & > :last-child {
      grid-column: span 1;
    }
  }
`;

const FooterColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;

  a {
    font-weight: 500;
    font-size: 1rem;
  }
`;

const FooterEarn = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  cursor: pointer;

  span {
    display: flex;
    align-items: center;
  }
`;

const FooterDropdown = styled.div`
  display: ${(props) => (props.isOpen ? "flex" : "none")};
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;

  a {
    font-weight: 300;
    font-size: 0.875rem;
  }
`;

const FooterCopyrightWrapper = styled.div`
  width: 100%;
  text-align: center;
  margin-top: 0;

  @media screen and (max-width: ${BREAKPOINTS.md}px) {
    margin-top: 1rem;
  }
`;
const FooterSlogan = styled.div`
  background: linear-gradient(90deg, #78ffb6 0%, #3af3e8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-align: left;
  word-break: break-word;
  width: 100%;
  margin: 0 auto;
  font-size: 20px;

  @media screen and (max-width: ${BREAKPOINTS.lg}px) {
    font-size: 14px;
  }
  @media screen and (max-width: ${BREAKPOINTS.md}px) {
    text-align: center;
  }
`;
const WrapperLink = styled.div`
  width: 100%;
`;
const Footer = () => {
  const { t } = useLanguage();
  const [isOpenEarn, setIsOpenEarn] = useState(false);
  const [isOpenDomain, setIsOpenDomain] = useState(false);
  const [isOpenEcosystem, setIsOpenEcosystem] = useState(false);
  const [isDesktop] = useMediaQuery("(min-width: 767px)");
  const router = useRouter();
  const createNavigationHandler = (path) => {
    return () => {
      router.push(path);
      Promise.resolve().then(() => {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: "instant",
        });
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      });
    };
  };

  return (
    <FooterWrapper>
      <FooterContainer>
        <FooterContent>
          <FooterLeft>
            <FooterLogo />
            <FooterSlogan>{t("common.text_footer_slogan")}</FooterSlogan>
            <WrapperLink>
              <FooterSocialLinks />
            </WrapperLink>
          </FooterLeft>
          <Box display={"flex"} alignItems={"start"}>
            <Box display={"grid"} gridTemplateColumns={"repeat(2, 1fr)"}>
              <Box
                display={"flex"}
                alignItems={"flex-start"}
                justifyContent={{ base: "start", md: "center" }}
                flexDirection={{ base: "column", md: "row" }}
              >
                <Box
                  display={"flex"}
                  alignItems={"flex-start"}
                  justifyContent={{ base: "start", md: "center" }}
                  gap={"8px"}
                  flexDirection={"column"}
                  width={{
                    lg: "160px",
                    md: "90px",
                    sm: "150px",
                    base: "140px",
                  }}
                >
                  <Box
                    onClick={createNavigationHandler("/")}
                    cursor={"pointer"}
                  >
                    <Text
                      color={"#fff"}
                      _hover={{
                        color: "#40FF9F",
                      }}
                    >
                      {t(`navbar.trade`)}
                    </Text>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </FooterContent>

        <FooterCopyrightWrapper>
          <FooterCopyright />
        </FooterCopyrightWrapper>
      </FooterContainer>
    </FooterWrapper>
  );
};

export default Footer;
