import React, { useState } from "react";
import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";

export default function Network() {
  return (
    <div>
      <ConnectButton />
    </div>
  );
}
