import styled from "styled-components";

export const AthenButton = styled.button`
  padding: 5px;
  height: 48px;
  border-radius: 24px;
  color: ${({ color }) => color ?? "#000"};
  min-width: ${({ $width }) => $width ?? "166px"};
  background: linear-gradient(90deg, #40ff9f 0%, #06eeff 100%);
  font-size: 16px;
  font-weight: 400;
  text-align: center;
  border: 1px solid #2b937a;
  text-decoration: none;
  display: flex;
  justify-content: center;
  flex-wrap: nowrap;
  align-items: center;
  cursor: pointer;
  position: relative;
  z-index: 1;

  @media screen and (max-width: 767px) {
    width: 150px;
    height: 43px;
  }
  @media screen and (max-width: 380px) {
    width: 140px;
    height: 36px;
  }

  &:disabled {
    opacity: 50%;
    cursor: auto;
    pointer-events: none;
  }

  will-change: transform;
  transition: transform 300ms ease, box-shadow 300ms ease,
    border-color 300ms ease;
  transform: perspective(1px) translateZ(0);

  > * {
    user-select: none;
  }

  > a {
    text-decoration: none;
  }

  &:hover {
    box-shadow: 0 0 15px rgba(6, 238, 255, 0.6),
      0 0 30px rgba(64, 255, 159, 0.4);
    background: linear-gradient(90deg, #06eeff 0%, #40ff9f 100%);
  }
`;
