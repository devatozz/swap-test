import React from "react";
import styled from "styled-components";

const ButtonContainer = styled.div`
  position: relative;
  display: inline-block;
  opacity: ${({ $isDisabled }) => ($isDisabled ? "0.5" : 1)};
`;

const BorderLayer = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, #6ae0a4 0%, #54ddbe 35%, #32cfc1 100%);
  clip-path: polygon(
    91% 4px,
    calc(100% - 4px) 50%,
    91% calc(100% - 4px),
    9% calc(100% - 4px),
    4px 50%,
    9% 4px
  );
  transform: scale(1.03);
`;

const GlowEffect = styled.div`
  position: absolute;
  inset: -2px;
  background: linear-gradient(90deg, #40ff9f 0%, #06eeff 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
  box-shadow: 0 0 1px rgba(6, 238, 255, 0.6), 0 0 1px rgba(64, 255, 159, 0.4);
  filter: blur(10px);
  z-index: -2;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ $paddingX, $paddingY }) =>
    $paddingX && $paddingY ? `${$paddingX} ${$paddingY}` : "8px 16px"};
  font-size: ${({ $fontSize }) => $fontSize || "16px"};
  background: linear-gradient(90deg, #40ff9f 0%, #06eeff 100%);
  border: none;
  color: ${({ $color }) => $color || "#1F1F1F"};
  width: ${({ $width }) => $width || "150px"};
  height: ${({ $height }) => $height || "32px"};
  font-weight: 600;
  position: relative;
  z-index: 1;
  margin: 3px;
  clip-path: polygon(
    93% 4px,
    calc(100% - 4px) 50%,
    93% calc(100% - 4px),
    7% calc(100% - 4px),
    4px 50%,
    7% 4px
  );
  cursor: pointer;
  text-align: center;
  transition: all 0.3s ease;

  &:hover {
    background: linear-gradient(90deg, #06eeff 0%, #40ff9f 100%);

    & + ${GlowEffect} {
      opacity: 0.3;
    }
  }

  &:disabled {
    cursor: not-allowed;
    &:hover {
      background: linear-gradient(90deg, #40ff9f 0%, #06eeff 100%);
      & + ${GlowEffect} {
        opacity: 0;
      }
    }
  }
`;

const IconWrapper = styled.span`
  margin-right: 8px;
`;

const HexagonButton = ({
  text,
  paddingX,
  paddingY,
  fontSize,
  color,
  width,
  height,
  isDisabled,
  leftIcon,
  ...props
}) => {
  return (
    <ButtonContainer $isDisabled={isDisabled}>
      <BorderLayer />
      <Button
        $paddingX={paddingX}
        $paddingY={paddingY}
        $fontSize={fontSize}
        $color={color}
        $width={width}
        $height={height}
        disabled={isDisabled}
        {...props}
      >
        {leftIcon && <IconWrapper>{leftIcon}</IconWrapper>}
        {text}
      </Button>
      <GlowEffect />
    </ButtonContainer>
  );
};

export default HexagonButton;
