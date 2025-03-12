import React, { useState } from "react";
import axios from "axios";
import SlippageSetting from "./SlippageSetting";
import { Center } from "@chakra-ui/react";
const BASE_URL = "https://aftermath.finance/api";

const Swap = () => {
  return (
    <Center
      bg="transparent"
      minHeight="calc(100vh)"
      display="flex"
      flexDirection="column"
      px={4}
      color={"red"}
    ></Center>
  );
};

export default Swap;
