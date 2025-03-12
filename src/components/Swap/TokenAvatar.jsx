import React from "react";
import { Box, Image } from "@chakra-ui/react";

const TokenAvatar = ({ name = "In", icon, size = "24px", ...props }) => {
  return (
    <Box
      overflow="hidden"
      {...props}
      borderRadius="50%"
      display={"flex"}
      alignItems={"center"}
      justifyContent={"center"}
      width={size}
      height={size}
    >
      {icon && (
        <Box
          width={size}
          height={size}
          borderRadius="50%"
          overflow="hidden"
          display="flex"
          alignItems="center"
          justifyContent="center"
          backgroundColor="#fff"
        >
          <Image
            src={icon}
            alt={name}
            width="100%"
            height="100%"
            objectFit="cover"
            borderRadius="50%"
          />
        </Box>
      )}
    </Box>
  );
};

export default TokenAvatar;
