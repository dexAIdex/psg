"use client";

import "@fontsource/luckiest-guy";
import { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import { Contract, BrowserProvider, formatUnits, parseEther } from "ethers";
import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";
import Confetti from "react-confetti";

const ethers = { Contract, BrowserProvider, formatUnits, parseEther };

const presaleAbi = [
  {
    inputs: [],
    name: "buyTokens",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "currentStage",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "depositTokens",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getBNBUSDPrice",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "nextStage",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "tokenAddress",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "tokensDeposited",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalRaised",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "tokensForOwner",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "tokensForPublic",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "withdrawFunds",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const colors = ["#004170", "#DA291C", "#FFD700", "#000000", "#00BFFF"];
const values = [33, 37, 15, 7.5, 7.5];
const labels = ["Presale", "Public", "Liquidity", "Marketing", "Team"];
const tokenomicsData = labels.map((label, i) => ({
  name: label,
  value: values[i],
}));

const faqData = [
  {
    question: "What is $PSGPEPE?",
    answer:
      "$PSGPEPE is a meme token inspired by football culture and powered by the BNB Chain. It combines humor, community, and blockchain technology.",
  },
  {
    question: "When does the presale start?",
    answer:
      "The presale is expected to launch in Q3 2025. Follow us on social channels for exact dates.",
  },
  {
    question: "How can I buy tokens?",
    answer:
      "You’ll be able to connect your MetaMask wallet and participate using BNB once the presale is live.",
  },
  {
    question: "Is $PSGPEPE officially linked to PSG?",
    answer:
      "No. $PSGPEPE is a fan-made project with no official affiliation to Paris Saint-Germain Football Club.",
  },
];

export default function Home() {
  useEffect(() => {
    setIsClient(true);

    const fetchCoingeckoPrice = async () => {
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd"
        );
        const data = await response.json();
        if (data?.binancecoin?.usd != null) {
          setBnbUsdPrice(data.binancecoin.usd);
        }
      } catch (err) {
        console.error("Errore nel recuperare il prezzo da CoinGecko:", err);
      }
    };

    fetchCoingeckoPrice();

    const fetchOnChainData = async () => {
      try {
        const provider = new ethers.JsonRpcProvider(
          "https://bsc-dataseed.binance.org/"
        );

        const presaleContract = new ethers.Contract(
          "0xb6F90C797223E1C9D3B7f3D458011A941b12332B",
          presaleAbi,
          provider
        );

        const raised = await presaleContract.totalRaised();
        const price = await presaleContract.getBNBUSDPrice();
        const stage = await presaleContract.currentStage();

        setTotalRaised(Number(ethers.utils.formatUnits(raised, 18)));
        setBnbUsdPrice(Number(price) / 1e8);
        setCurrentStage(Number(stage)); // Chainlink BNB/USD usually has 8 decimals
      } catch (err) {
        console.error("Errore nel recuperare i dati on-chain:", err);
      }
    };

    fetchOnChainData();
  }, []);
  const [walletConnected, setWalletConnected] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const [bnbAmount, setBnbAmount] = useState("");
  const [totalRaised, setTotalRaised] = useState(0);
  const [bnbUsdPrice, setBnbUsdPrice] = useState(0);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [currentStage, setCurrentStage] = useState(1);
  const [bnbBalance, setBnbBalance] = useState(null);
  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        setWalletConnected(true);
      } catch (error) {
        console.error("User rejected connection");
      }
    } else {
      alert("Please install MetaMask to use this feature.");
    }
  };

  const storiaDescriptions = [
    "Nobody wanted him. PEPE went to every team: trials, dreams, hopes. But he was too slow, too weird, too... frog. 🐸 He got rejected by everyone.",
    "The meme never forgot his dream ⚽️: to play football. But it was always the team that ruined it. 😞",
    "One day, the opportunity came. ✨ PSG was searching for its first true legend. 🏆",
    "And that's when PEPE stepped in. 💪 From outsider to Ligue 1 player. Jersey soaked, heart beyond irony. ❤️‍🔥",
    "A great season for PSG PEPE 🔥 who finishes on top 🥇 proving his full potential.",
    "From outsider to Champions League starter. 🌍 And in the final... the goal. ⚽️ PEPE became a legend. 👑",
    "The fans saw him lift the Cup 🏆. The memes became reality. 📸 PEPE fulfilled his dream. 💫",
    "Praised by all 👏, loved by the president 🤝. He had an idea for PEPE. 💡",
    "$PSGPEPE was born 🐸💸 — the first memecoin to win Europe. 🌍 Not just a symbol. The official currency of true fans. 💙",
    "The market explodes 🚀, PSGPEPE rises above all. 🔝 The meme is real 🐸. The glory has just begun. 🏆",
  ];

  const handleBuyWithBNB = async () => {
    if (!bnbAmount || isNaN(Number(bnbAmount))) {
      alert("Please enter a valid BNB amount");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const presaleContract = new ethers.Contract(
        "0xb6F90C797223E1C9D3B7f3D458011A941b12332B",
        presaleAbi,
        signer
      );

      const tx = await presaleContract.buyTokens({
        value: ethers.utils.parseEther(bnbAmount),
      });

      await tx.wait();
      alert("Purchase successful!");
    } catch (err) {
      console.error(err);
      alert("Transaction failed");
    }
  };

  return (
    <>
      <Head>
        <title>PSGPEPE Presale</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className="bg-blue-900 text-white min-h-screen font-['Luckiest_Guy'] relative overflow-hidden">
        {isClient && (
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            numberOfPieces={200}
            colors={["#FFD700"]}
            gravity={0.3}
            recycle={true}
          />
        )}
        <header className="p-6 flex justify-between items-center border-b border-blue-700">
          <h1 className="text-3xl font-bold">$PSGPEPE</h1>
          <button
            onClick={connectWallet}
            className="bg-white text-blue-900 px-4 py-2 rounded-xl hover:bg-blue-200"
          >
            {walletConnected ? "Wallet Connected" : "Connect Wallet"}
          </button>
        </header>
        <section
          className="relative text-center px-6 min-h-[600px] flex items-center justify-center overflow-hidden"
          id="hero"
        >
          <div className="absolute bottom-6 left-6 z-10 w-64 h-80">
            <Image
              src="/images/sagoma.png"
              alt="PSG Pepe Icon"
              width={320}
              height={320}
              className="object-contain shadow-lg"
              unoptimized
            />
          </div>
          <div className="absolute bottom-0 right-8 z-10 w-90 h-48.1">
            <Image
              src="/images/coppa.png"
              alt="PSG Pepe Icon"
              width={320}
              height={320}
              className="object-contain shadow-lg"
              unoptimized
            />
          </div>

          <Image
            src="/images/stadium.png"
            alt="Sfondo Hero"
            fill
            className="absolute inset-0 object-cover opacity-90 z-0"
            unoptimized
          />
          <div className="relative z-10 max-w-2xl mx-auto bg-blue-900/80 p-8 rounded-xl shadow-lg mt-16">
            <h2 className="text-5xl font-bold mb-4">
              The Meme Revolution of Football 🐸⚽
            </h2>
            <p className="text-xl">
              Join the $PSGPEPE presale and be part of the most legendary crypto
              kickoff on BNB Chain.
            </p>
          </div>
        </section>
        <section className="relative text-blue-900 text-center py-16 px-6 overflow-hidden">
          <Image
            src="/images/alzata2.png"
            alt="Sfondo Acquisto"
            fill
            className="absolute -top-40 inset-x-0 object-cover opacity-100 z-0"
            unoptimized
          />

          <div className="relative z-10 max-w-3xl mx-auto rounded-xl shadow-lg border border-blue-300 bg-white p-8">
            <h3 className="text-4xl font-extrabold mb-6 uppercase tracking-wide">
              Acquista subito i token $PSGPEPE
            </h3>

            <div className="bg-red-600 text-white py-3 px-6 rounded-xl shadow font-bold uppercase mb-8 text-lg">
              Stage Corrente: {isClient ? currentStage : "..."} – Prezzo: $
              {isClient
                ? (0.0001 + (currentStage - 1) * 0.000025).toFixed(6)
                : "..."}
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md mb-8">
              <p className="text-base text-gray-700">
                Paga con BNB –{" "}
                {bnbAmount && !isNaN(Number(bnbAmount))
                  ? `$${(Number(bnbAmount) * bnbUsdPrice).toFixed(2)} USD`
                  : "$0 USD"}
              </p>
              <div className="flex justify-center items-center gap-4 mt-4">
                <input
                  type="number"
                  placeholder="0"
                  value={bnbAmount}
                  onChange={(e) => setBnbAmount(e.target.value)}
                  className="p-3 border rounded-md w-32 text-center text-lg"
                />
                <span className="text-xl">→</span>
                <span className="font-bold text-xl">
                  {bnbAmount && !isNaN(Number(bnbAmount))
                    ? (
                        (Number(bnbAmount) * bnbUsdPrice) /
                        (0.0001 + (currentStage - 1) * 0.000025)
                      ).toFixed(0)
                    : 0}{" "}
                  $PSGPEPE
                </span>
              </div>

              <button
                onClick={handleBuyWithBNB}
                className="mt-6 w-full bg-blue-800 text-white font-bold px-6 py-4 rounded-xl shadow hover:bg-blue-900 text-lg"
              >
                Acquista con BNB
              </button>
              {walletConnected && bnbBalance !== null && (
                <p className="mt-4 text-sm text-gray-600">
                  Saldo wallet: {bnbBalance} BNB
                </p>
              )}
            </div>

            <div className="relative w-full h-6 bg-gray-200 rounded overflow-hidden shadow mx-auto">
              <div
                className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-600 skew-x-[-20deg]"
                style={{ width: `${(totalRaised / 300000) * 100}%` }}
              ></div>
              <div className="relative z-10 text-sm text-blue-900 font-bold h-full flex items-center justify-center">
                {`USDT RACCOLTI: $${totalRaised.toLocaleString()} / $300,000`}
              </div>
            </div>
          </div>
        </section>

        <section
          className="py-20 px-6 bg-[url('/images/stadio.png')] bg-cover bg-center bg-no-repeat relative"
          id="tokenomics"
        >
          <div className="animate-bounce-ball">
            <Image
              src="/images/ball.png"
              alt="Ball"
              width={64}
              height={64}
              unoptimized
            />
          </div>
          <div className="absolute bottom-0 right-0 z-10 w-68 h-48.1">
            <Image
              src="/images/squad.png"
              alt="Decorazione angolo"
              width={400}
              height={400}
              className="object-contain"
              unoptimized
            />
          </div>

          <div className="absolute inset-0 bg-blue-800/1 z-0" />
          <div className="relative z-10 flex justify-center">
            <div className="bg-white/70 rounded-2xl shadow-xl p-4 max-w-4xl w-full text-blue-900">
              <h3 className="text-4xl font-extrabold text-center mb-6 uppercase tracking-wide">
                Token Distribution
              </h3>
              <div className="flex justify-center">
                <PieChart width={400} height={400}>
                  <Pie
                    data={tokenomicsData}
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    innerRadius={50}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {tokenomicsData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={colors[index % colors.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </div>
            </div>
          </div>
        </section>
        <section
          className="py-20 px-6 relative bg-[length:100%_940px] bg-center bg-no-repeat"
          id="roadmap"
          style={{ backgroundImage: "url('/images/baby.png')" }}
        >
          <div className="absolute inset-0 bg-blue-900/1 z-0" />
          <div className="relative z-10 bg-red-700/30 rounded-2xl shadow-lg p-4 max-w-2xl mx-auto">
            <h3 className="text-4xl font-bold text-center mb-8">Roadmap</h3>
            <div className="max-w-3xl mx-auto relative z-10">
              <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-white transform -translate-x-1/2"></div>
              <ul className="space-y-12 relative z-10">
                <li className="text-center">
                  <div className="bg-blue-700 p-4 rounded-xl inline-block">
                    📣 Q2 – Community creation
                  </div>
                </li>
                <li className="text-center">
                  <div className="bg-blue-700 p-4 rounded-xl inline-block">
                    🚀 Q3 – Presale launch
                  </div>
                </li>
                <li className="text-center">
                  <div className="bg-blue-700 p-4 rounded-xl inline-block">
                    📢 Q3 – Marketing phase
                  </div>
                </li>
                <li className="text-center">
                  <div className="bg-blue-700 p-4 rounded-xl inline-block">
                    🎉 Q3 – Community events
                  </div>
                </li>
                <li className="text-center">
                  <div className="bg-blue-700 p-4 rounded-xl inline-block">
                    💥 Q3 – Bonus phase
                  </div>
                </li>
                <li className="text-center">
                  <div className="bg-blue-700 p-4 rounded-xl inline-block">
                    🎉 Q3 – Token launch
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section
          id="storia"
          className="relative py-40 text-white min-h-[1000px] bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url("/images/blu.png")' }}
        >
          <div className="container mx-auto px-4">
            <h2 className="text-5xl font-bold text-center mb-20">
              PSG PEPE HISTORY
            </h2>
            <div className="relative max-w-6xl mx-auto bg-white bg-opacity-70 p-10 rounded-3xl shadow-xl">
              <button
                onClick={() => {
                  setHistoryIndex((prev) => (prev - 1 + 10) % 10);
                }}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white text-blue-900 p-5 rounded-full z-10 shadow-lg"
              >
                ◀
              </button>
              <div className="flex justify-center items-center gap-10">
                {[...Array(3)].map((_, i) => {
                  const indices = [
                    (historyIndex - 1 + 10) % 10,
                    historyIndex,
                    (historyIndex + 1) % 10,
                  ];
                  const currentIndex = indices[i];
                  const isCenter = i === 1;
                  return (
                    <div
                      key={currentIndex}
                      className={`transition-all duration-700 ease-in-out transform ${
                        isCenter
                          ? "scale-135 opacity-100"
                          : "scale-90 opacity-50"
                      } bg-blue-700 rounded-2xl shadow-xl overflow-hidden flex flex-col items-center`}
                      style={{
                        width: isCenter ? "400px" : "300px",
                        height: isCenter ? "520px" : "300px",
                      }}
                    >
                      <Image
                        src={`/images/storia${currentIndex + 1}.png`}
                        alt={`PSG Pepe Story ${currentIndex + 1}`}
                        width={isCenter ? 400 : 300}
                        height={isCenter ? 400 : 300}
                        className="object-cover w-full h-[400px]"
                        unoptimized
                      />
                      {isCenter && (
                        <p className="text-center px-4 mt-3 text-base overflow-auto break-words">
                          {storiaDescriptions[historyIndex]}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
              <button
                onClick={() => {
                  setHistoryIndex((prev) => (prev + 1) % 10);
                }}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white text-blue-900 p-5 rounded-full z-10 shadow-lg"
              >
                ▶
              </button>
            </div>
          </div>

          <Image
            src="/images/legge.png"
            alt="PSG Pepe Bottom Left Decoration"
            width={400}
            height={400}
            className="absolute bottom-0 left-0 w-80 h-auto z-30"
            unoptimized
          />

          <Image
            src="/images/photo.png"
            alt="PSG Pepe Bottom Right Decoration"
            width={400}
            height={400}
            className="absolute bottom-0 right-0 w-80 h-auto z-30"
            unoptimized
          />
        </section>

        <section
          className="py-20 px-6 bg-black bg-opacity-80 backdrop-brightness-800 relative overflow-hidden"
          id="faq"
        >
          <div className="absolute inset-0 z-0 pointer-events-none">
            {[...Array(30)].map((_, i) => (
              <img
                key={i}
                src="/images/token.png"
                alt="coin"
                className="absolute w-12 h-12 animate-fall bright-coin"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 10}s`,
                  animationDuration: `${5 + Math.random() * 5}s`,
                }}
              />
            ))}
          </div>

          <div className="relative z-10">
            <h3 className="text-4xl font-bold text-center mb-12">FAQ</h3>
            <div className="max-w-3xl mx-auto space-y-6">
              {faqData.map((item, index) => (
                <div
                  key={index}
                  className="bg-blue-700 p-6 rounded-xl text-center transition duration-300 hover:bg-blue-600"
                >
                  <button
                    onClick={() =>
                      setOpenIndex(openIndex === index ? null : index)
                    }
                    className="w-full text-2xl font-semibold focus:outline-none"
                  >
                    {item.question}
                  </button>
                  {openIndex === index && (
                    <p className="text-white/90 mt-4">{item.answer}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <style jsx>{`
            @keyframes fall {
              0% {
                transform: translateY(-100px);
                opacity: 1;
              }
              100% {
                transform: translateY(100vh);
                opacity: 0;
              }
            }

            .animate-fall {
              animation-name: fall;
              animation-timing-function: linear;
              animation-iteration-count: infinite;
            }
            .bright-coin {
              filter: drop-shadow(0 0 4px gold);
            }
          `}</style>
        </section>
        <footer className="bg-blue-950 py-10 text-center text-sm">
          <p>© 2025 PSGPEPE. All rights reserved.</p>
          <a
            href="https://x.com/PSGPEPEPSG"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-4"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 1200 1227"
              fill="black"
            >
              <path d="M1033 0H841L603 361L361 0H0L442 622L0 1227H194L603 661L1006 1227H1200L758 616L1200 0H1033Z" />
            </svg>
          </a>
        </footer>
      </main>
    </>
  );
}
