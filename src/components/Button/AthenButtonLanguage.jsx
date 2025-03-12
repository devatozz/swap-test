import styled, { DefaultTheme, useTheme } from "styled-components";
export const AthenButtonLanguage = styled.button`
  padding: 5px;
  height: 48px;
  border-radius: 24px;
  color: ${({ color }) => color ?? "#fff"};
  width: ${({ $width }) => $width ?? "168px"};
  min-width: 168px;
  background: radial-gradient(
      2058.68% 50% at 50% 50%,
      rgba(43, 147, 122, 0.1) 0%,
      rgba(43, 147, 122, 0) 100%
    ),
    #0a1013;

  font-size: 16px;
  font-weight: 400;
  text-align: center;
  border: 1px solid #0afad2;
  text-decoration: none;
  display: flex;
  justify-content: center;
  flex-wrap: nowrap;
  align-items: center;
  cursor: pointer;
  position: relative;
  z-index: 1;
  @media screen and (max-width: 1024px) {
    width: 100%;
    height: 43px;
  }

  &:disabled {
    opacity: 50%;
    cursor: auto;
    pointer-events: none;
  }

  will-change: transform;
  transition: transform 450ms ease;
  transform: perspective(1px) translateZ(0);

  > * {
    user-select: none;
  }

  > a {
    text-decoration: none;
  }
  &:hover {
    box-shadow: 0 0 10px rgba(6, 238, 255, 0.6),
      0 0 10px rgba(64, 255, 159, 0.4);
  }
`;
