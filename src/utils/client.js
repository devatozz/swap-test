import { useMemo } from "react";
import { createPublicClient, http } from 'viem'
import { CHAINS } from "./wallet";

export function useViemClient() {
    return useMemo(() => {
        return createPublicClient({
            chain: CHAINS[0],
            transport: http()
        })
    }, [CHAINS])
}