import { createConfig, configureChains, WagmiConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { createWeb3Modal, defaultWagmiConfig } from "@web3modal/wagmi/react";
import { mainnet, sepolia } from "wagmi/chains";

export const noneAddress = "0x0000000000000000000000000000000000000000";
const projectId = "1e73be5d9ea36f6d8288884de8be2113";

const customSepolia = {
  ...sepolia,
  rpcUrls: {
    default: {
      http: [
        "https://eth-sepolia.nodereal.io/v1/c71923693184445ca9aa5f64082602f7",
      ],
    },
    public: {
      http: [
        "https://eth-sepolia.nodereal.io/v1/c71923693184445ca9aa5f64082602f7",
      ],
    },
  },
};

// Define available networks
const AVAILABLE_CHAINS = {
  testnet: [customSepolia],
  mainnet: [mainnet],
};

// Select chains based on environment
export const CHAINS =
  process.env.NEXT_PUBLIC_NEXT_ENV === "prod"
    ? AVAILABLE_CHAINS.mainnet
    : AVAILABLE_CHAINS.testnet;

const { chains, provider, webSocketProvider } = configureChains(CHAINS, [
  publicProvider(),
]);

const metadata = {
  name: "MinSwap Finance",
  description: "MinSwap Finance Web3 Application",
  url: "",
  icons: [""],
};

export const wagmiConfig = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
});

if (typeof window !== "undefined") {
  createWeb3Modal({
    wagmiConfig,
    projectId,
    chains,
  });
}
