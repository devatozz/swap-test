import { SuiClient } from "@mysten/sui.js/client";
import TokenList from "src/constant/tokenlist.json";

export const getTokenBalance = async (tokenSymbol, currentAccount) => {
  if (!currentAccount?.address) {
    console.log("Wallet not connected");
    return "0";
  }

  try {
    const provider = new SuiClient({ url: "https://fullnode.mainnet.sui.io" });

    const coinType = getCoinTypeFromSymbol(tokenSymbol, TokenList);

    if (!coinType) {
      console.error(`Cannot find coin type for symbol: ${tokenSymbol}`);
      return "0";
    }

    const { data: coins } = await provider.getCoins({
      owner: currentAccount.address,
      coinType: coinType,
    });

    let totalBalance = 0n;
    for (const coin of coins) {
      totalBalance += BigInt(coin.balance);
    }

    const metadata = await provider.getCoinMetadata({ coinType });
    const decimals = metadata?.decimals || 9;

    const formattedBalance = formatBalance(totalBalance, decimals);

    return formattedBalance;
  } catch (error) {
    console.error(`Error fetching balance for ${tokenSymbol}:`, error);
    return "0";
  }
};
const getCoinTypeFromSymbol = (symbol, tokenList) => {
  const coinEntry = tokenList.coins.find((coin) => {
    const parts = coin.split("::");
    return parts[2] === symbol;
  });

  return coinEntry || null;
};
const formatBalance = (balance, decimals) => {
  const divisor = 10n ** BigInt(decimals);
  const integerPart = balance / divisor;
  const fractionalPart = balance % divisor;

  let fractionalStr = fractionalPart.toString().padStart(decimals, "0");

  fractionalStr = fractionalStr.replace(/0+$/, "");

  if (fractionalStr === "") {
    return integerPart.toString();
  }

  return `${integerPart}.${fractionalStr}`;
};
