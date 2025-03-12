import React from "react";
import Image from "next/image";
import Link from "next/link";
import xIcon from "src/asset/images/social/x-icon.svg";
import website from "src/asset/images/social/website.svg";
import telegram from "src/asset/images/social/tele.svg";
import facebook from "src/asset/images/social/facebook.svg";
import discord from "src/asset/images/social/discord.svg";
import youtube from "src/asset/images/social/youtube.svg";
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
const WrapperLink = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: start;
  gap: 24px;
  margin-top: 10px;
  @media screen and (max-width: ${BREAKPOINTS.lg}px) {
    gap: 16px;
  }
  @media screen and (max-width: ${BREAKPOINTS.md}px) {
    gap: 10px;
  }
`;
const SocialIconWrapper = styled(Link)`
  display: inline-block;
  text-decoration: none;
  transition: all 0.3s ease-in-out;
`;

const SocialIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  transition: all 0.3s ease-in-out;
  background: #1a1a1a;
  border-radius: 50%;
  img {
    width: 1.5rem;
    height: 1.5rem;
    transition: filter 0.3s ease-in-out;
  }
  &:hover {
    background: #00ff9d;
    transform: scale(1.1);

    img {
      filter: invert(1);
    }
  }
  @media screen and (max-width: ${BREAKPOINTS.md}px) {
    img {
      width: 1rem;
      height: 1rem;
    }
  }
`;

const FooterSocialLinks = () => {
  const LINKS = {
    WEBSITE: "",
    TELEGRAM: "",
    DISCORD: "",
    GITHUB: "",
    TWITTER: "",
    WEBSITE_BUG_REPORT: "",
    GITHUB_BUG_REPORT: "",
    YOUTUBE: "",
    FACEBOOK: "",
  };
  const links = [
    {
      icon: website,
      link: LINKS.WEBSITE,
      text: "Website",
    },
    {
      icon: telegram,
      link: LINKS.TELEGRAM,
      text: "Telegram Channel",
    },
    {
      icon: xIcon,
      link: LINKS.TWITTER,
      text: "Twitter/X",
    },
    {
      icon: youtube,
      link: LINKS.YOUTUBE,
      text: "Youtube",
    },
    {
      icon: discord,
      link: LINKS.DISCORD,
      text: "Discord",
    },
    {
      icon: facebook,
      link: LINKS.FACEBOOK,
      text: "Facebook",
    },
  ];

  return (
    <WrapperLink>
      {links?.map(({ link, icon, text }) => (
        <SocialIconWrapper
          key={link}
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={text}
        >
          <SocialIcon>
            <Image src={icon} alt={text} width={24} height={24} />
          </SocialIcon>
        </SocialIconWrapper>
      ))}
    </WrapperLink>
  );
};

export default FooterSocialLinks;
