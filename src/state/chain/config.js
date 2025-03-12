import baseForwardDev from "src/constant/base-contract-dev.json";
import baseForwardMaster from "src/constant/base-contract-master.json";
export const noneAddress = "0x0000000000000000000000000000000000000000";

const NetworkConfig = {
  sepolia: {
    rpcAddress:
      "https://eth-sepolia.nodereal.io/v1/c71923693184445ca9aa5f64082602f7",
    logoURL: "",
    wssAddress:
      "wss://eth-sepolia.nodereal.io/ws/v1/c71923693184445ca9aa5f64082602f7",
    chainId: 11155111,
    blockchainExplorer: "https://sepolia.etherscan.io/",
    name: "sepolia",
    nativeToken: {
      name: "ETH",
      symbol: "ETH",
      logo: "",
      address: noneAddress,
      decimals: 18,
    },
    athAddress: "",
  },
  ethereum: {
    rpcAddress: "https://mainnet.infura.io/v3/your-infura-key",
    logoURL: "",
    wssAddress: "wss://mainnet.infura.io/ws/v3/your-infura-key",
    chainId: 1,
    blockchainExplorer: "https://etherscan.io/",
    name: "ethereum",
    nativeToken: {
      name: "ETH",
      symbol: "ETH",
      logo: "",
      address: noneAddress,
      decimals: 18,
    },
    athAddress: "",
  },
};

const ForwardDev = {
  networkConfig: NetworkConfig.sepolia,
  currentNetwork: "sepolia",
};

const ForwardMaster = {
  networkConfig: NetworkConfig.ethereum,
  currentNetwork: "ethereum",
};

export const config =
  process.env.NEXT_PUBLIC_NEXT_ENV === "prod" ? ForwardMaster : ForwardDev;

const ChainInfosTestnet = {
  sepolia: {
    label: "Sepolia Testnet",
    logo: "",
    disabled: false,
  },
};

const ChainInfosMainnet = {
  ethereum: {
    label: "Ethereum",
    logo: "",
    disabled: false,
  },
};

export const chainInfos =
  process.env.NEXT_PUBLIC_NEXT_ENV === "prod"
    ? ChainInfosMainnet
    : ChainInfosTestnet;

export const walletInfos = {
  metaMask: {
    logo: "/metamask-icon.png",
  },
  coinbaseWallet: {
    logo: "/coinbase-wallet-logo.png",
  },
  walletConnect: {
    logo: "/wallet-connect-logo.png",
  },
};
