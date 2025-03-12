// components/footer/FooterCopyright.tsx
import React from "react";
import styled from "styled-components";
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
const WrapperText = styled.div`
  color: #fff;
  font-size: 12px;
`;
const FooterCopyright = () => {
  const currentYear = new Date().getFullYear();

  return (
    <WrapperText>
      © {currentYear} MINTEST NETWORK LTD. All rights reserved.
    </WrapperText>
  );
};

export default FooterCopyright;
