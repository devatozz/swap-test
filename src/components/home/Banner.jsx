import styled from "styled-components";

import Image from "next/image";
import { Box, Text, Center } from "@chakra-ui/react";

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

export default function Banner() {
  return (
    <Center
      bg="transparent"
      minHeight="calc(100vh)"
      display="flex"
      flexDirection="column"
      px={4}
    ></Center>
  );
}
