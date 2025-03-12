import React from "react";
import Link from "next/link";
import styled from "styled-components";
import { useMediaQuery } from "@chakra-ui/react";
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
const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const StyledLink = styled(Link)`
  background: linear-gradient(90deg, #78ffb6 0%, #3af3e8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: bold;
  text-align: center;
  word-break: break-word;
  width: 100%;
  margin: 0 auto;
  font-size: 48px;
  &:hover {
    text-shadow: 0 0 20px rgba(120, 255, 182, 0.8),
      0 0 40px rgba(120, 255, 182, 0.6), 0 0 60px rgba(58, 243, 232, 0.5);
  }

  @media screen and (max-width: ${BREAKPOINTS.lg}px) {
    font-size: 30px;
  }
  @media screen and (max-width: ${BREAKPOINTS.md}px) {
    font-size: 24px;
  }
`;

const FooterLogo = () => {
  return (
    <LogoWrapper>
      <StyledLink href="/">MINTEST</StyledLink>
    </LogoWrapper>
  );
};

export default FooterLogo;
