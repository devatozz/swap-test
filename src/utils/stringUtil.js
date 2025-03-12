export function replaceUIntSuffix(number) {
  return number ? number.replace(/u\d+/g, "") : number;
}

export function currencyFormat(number) {
  var parts = number.toString().split(".");
  var integerPart = parseInt(parts[0], 10).toLocaleString("en-US");
  var decimalPart = parts[1] ? parts[1].substring(0, 5) : "";
  return integerPart + (decimalPart ? "." + decimalPart : "");
}
function formatNumberCommas(num) {
  if (isNaN(num)) return "Invalid number";

  const [integerPart, decimalPart] = num.toString().split(".");

  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return decimalPart ? `${formattedInteger}.${decimalPart}` : formattedInteger;
}
export function currencyFormat2(number) {
  var parts = number.toString().split(".");
  var integerPart = parseInt(parts[0], 10).toLocaleString("en-US");
  var decimalPart = parts[1] ? parts[1].substring(0, 2) : "";
  return integerPart + (decimalPart ? "." + decimalPart : "");
}
export const currencyFormat4 = (number) => {
  if (number == null || number == undefined) return "0";
  const num = Number(number);
  if (isNaN(num)) return "0";
  const parts = num.toString().split(".");
  const integerPart = parseInt(parts[0], 10).toLocaleString("en-US");
  return integerPart;
};

export function currencyFormat3(number) {
  if (number < 0.00001) {
    return "<0.00001";
  }
  if (isNaN(number)) {
    return "Invalid number";
  }
  const parts = number.toString().split(".");
  const integerPart = parseInt(parts[0], 10).toLocaleString("en-US");
  const decimalPart = parts[1] ? parts[1].substring(0, 5) : "";
  return integerPart + (decimalPart ? "." + decimalPart : "");
}

export function formatInputAmount(amount) {
  // Handle the special case where the input is '0' or '0.' and leave it unchanged
  if (amount === "0" || amount === "0.") {
    return amount;
  }

  // For other inputs, eliminate leading zeros
  let tokenAmount = amount.replace(/^0+/, "");

  // If the result after removing leading zeros is '.', add a '0' before the dot
  if (tokenAmount.startsWith(".")) {
    tokenAmount = "0" + tokenAmount;
  }

  // Verify that the format is a valid number with an optional trailing dot, and extract the match
  const validNumberFormatMatch = tokenAmount.match(/^-?\d+(\.\d*)?/);
  tokenAmount = validNumberFormatMatch ? validNumberFormatMatch[0] : "";

  return tokenAmount;
}

export function shortenAddress(address, chars = 8) {
  return address.slice(0, chars) + "..." + address.slice(-chars);
}

export function formatInputAmount2(amount) {
  if (amount === "0" || amount === "0.") {
    return amount;
  }

  let tokenAmount = amount.replace(/^0+/, "");

  if (tokenAmount.startsWith(".")) {
    tokenAmount = "0" + tokenAmount;
  }

  const validNumberFormatMatch = tokenAmount.match(/^-?\d+(\.\d*)?/);
  tokenAmount = validNumberFormatMatch ? validNumberFormatMatch[0] : "";

  return tokenAmount;
}
export function formatNumberWithCommas(number) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(number);
}

export const formatZeroNumber = (value) => {
  if (!value) return "0";
  const numValue = Number(value);
  if (numValue === 0) return "0";
  if (numValue < 0.000001) return "<0.000001";
  let formattedValue = numValue.toString();
  if (numValue < 1) {
    formattedValue = numValue.toFixed(5).replace(/\.?0+$/, "");
    const parts = formattedValue.split(".");
    if (parts.length > 1 && parts[1].length < 3) {
      return numValue.toFixed(3);
    }
    return formattedValue;
  }

  return numValue.toFixed(5).replace(/\.?0+$/, "");
};
export default function convertTimestampToDate(timestamp) {
  const date = new Date(Number(timestamp) * 1000);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}
