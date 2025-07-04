// useTokenMeta.ts
import { useEffect, useState } from "react";

export function useTokenMeta() {
  const [tokenMap, setTokenMap] = useState<{ [mint: string]: any }>({});

  useEffect(() => {
    const fetchTokenList = async () => {
      try {
        const res = await fetch(
          "https://cdn.jsdelivr.net/gh/solana-labs/token-list@main/src/tokens/solana.tokenlist.json"
        );
        const json = await res.json();
        const map = json.tokens.reduce((acc: any, token: any) => {
          acc[token.address] = token;
          return acc;
        }, {});
        setTokenMap(map);
      } catch (err) {
        console.error("Failed to load token list", err);
      }
    };

    fetchTokenList();
  }, []);

  return tokenMap;
}
