import { useEffect, useState } from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import { PublicKey } from "@solana/web3.js";
import axios from "axios";
import { UseFindToken } from "../../CustomHook/UseFindToken";

const PortfolioRingChart = ({ walletAddress }: { walletAddress: string  }) => {

  interface Token {
    mint: string;
    amount: number;
  }
  
  
  const [chartData] = useState([]);
  const walletPublicKey = new PublicKey(walletAddress);
  const tokens : Token[]   = UseFindToken(walletPublicKey);

  useEffect(() => {
    const fetchTokenPrices = async () => {
      try {
        const mintList = tokens.map((t) => t.mint).join(",");

        const tokenPricesRes = await axios.get(
          "https://api.coingecko.com/api/v3/simple/token_price/solana",
          {
            params: {
              contract_addresses: mintList,
              vs_currencies: "usd",
            },
          }
        );

        const solPriceRes = await axios.get(
          "https://api.coingecko.com/api/v3/simple/price",
          { params: { ids: "solana", vs_currencies: "usd" } }
        );

        const solPrice = solPriceRes.data.solana.usd;
        const tokenPrices = tokenPricesRes.data;

       tokens.map((token, index) => {
          const price =
            token.mint === "So11111111111111111111111111111111111111112"
              ? solPrice
              : tokenPrices[token.mint]?.usd || 0;

          return {
            id: index,
            value: +(token.amount * price).toFixed(2),
            label:
              token.mint === "So11111111111111111111111111111111111111112"
                ? "SOL"
                : token.mint.slice(0, 4) + "...",
          };
        });

        // setChartData(pieData.filter((token) => token.value > 0));
      } catch (error) {
        console.error("Failed to fetch token prices", error);
      }
    };

    if (tokens.length > 0) {
      fetchTokenPrices();
    }
  }, [tokens]);

  return (
    <div className="p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">Portfolio Ring Chart</h2>
      {chartData.length > 0 ? (
        <PieChart
          series={[
            {
              data: chartData,
              innerRadius: 60, // 🟢 this makes it a ring chart
              outerRadius: 100,
            },
          ]}
          width={400}
          height={300}
        />
      ) : (
        <p className="text-center text-gray-500">Loading chart...</p>
      )}
    </div>
  );
};

export default PortfolioRingChart;
