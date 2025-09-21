import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { defaultRules } from "../data/kingsCup";

const suits = ["♠", "♥", "♦", "♣"] as const;
const ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"] as const;

type Suit = (typeof suits)[number];
type Rank = (typeof ranks)[number];
type CardShape = { rank: Rank; suit: Suit };

function makeDeck() {
  const deck: CardShape[] = [];
  for (const rank of ranks) {
    for (const suit of suits) {
      deck.push({ rank, suit });
    }
  }
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

function Card({
  rank,
  suit,
  flipped,
  rule,
  style,
}: {
  rank: string;
  suit: string;
  flipped?: boolean;
  rule?: string;
  style?: React.CSSProperties;
}) {
  const isRed = suit === "♥" || suit === "♦";

  return (
    <div
      style={style}
      className={`w-44 h-64 rounded-3xl border shadow-xl bg-white flex flex-col items-center justify-between p-5 transition-transform duration-500 ${
        flipped ? "scale-105 z-10" : "bg-zinc-200"
      } ${isRed ? "text-red-600" : "text-zinc-800"}`}
    >
      {flipped ? (
        <>
          <div className="w-full flex justify-between text-xl font-bold">
            <span>{rank}</span>
            <span>{suit}</span>
          </div>
          <div className="text-6xl my-2">{suit}</div>
          <div className="text-sm text-center text-zinc-700 leading-snug px-1">
            {rule || "このカードのルールは未設定です"}
          </div>
          <div className="w-full flex justify-between text-xl rotate-180 font-bold">
            <span>{rank}</span>
            <span>{suit}</span>
          </div>
        </>
      ) : (
        <div className="w-full h-full flex items-center justify-center text-2xl bg-gradient-to-br from-brand-100 to-brand-200 text-brand-700 rounded-2xl">
          🂠
        </div>
      )}
    </div>
  );
}

export default function KingsCupPlay() {
  const [deck, setDeck] = useState<CardShape[]>(() => makeDeck());
  const [currentCard, setCurrentCard] = useState<CardShape | null>(null);
  const [kings, setKings] = useState(0);
  const [rules, setRules] = useState<Record<string, string>>(() => {
    if (typeof window === "undefined") return defaultRules;
    const saved = window.localStorage.getItem("kc_rules");
    return saved ? JSON.parse(saved) : defaultRules;
  });
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<number | null>(null);
  const flipSound = useRef<HTMLAudioElement | null>(null);
  const cheerSound = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    flipSound.current = new Audio("/sounds/card-flip.mp3");
    cheerSound.current = new Audio("/sounds/cheer.mp3");
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("kc_rules", JSON.stringify(rules));
  }, [rules]);

  useEffect(() => {
    if (!toast) return;
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 2400);
  }, [toast]);

  const remaining = deck.length;

  function playFallbackBeep(freq = 880, durMs = 90) {
    if (typeof window === "undefined") return;
    const AudioContext = (window as any).AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.value = freq;
    osc.connect(gain);
    gain.connect(ctx.destination);
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.22, ctx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + durMs / 1000);
    osc.start();
    osc.stop(ctx.currentTime + durMs / 1000 + 0.05);
  }

  function playSound(type: "flip" | "cheer") {
    const el = type === "flip" ? flipSound.current : cheerSound.current;
    const tryPlay = async () => {
      try {
        if (el) {
          el.currentTime = 0;
          await el.play();
          return;
        }
      } catch (error) {
        console.warn("Failed to play sound", error);
      }
      if (type === "flip") playFallbackBeep(900, 80);
      else playFallbackBeep(600, 180);
    };
    void tryPlay();
  }

  function resetGame() {
    setDeck(makeDeck());
    setCurrentCard(null);
    setKings(0);
    setToast("新しいデッキにシャッフルしました！");
  }

  function drawCard() {
    if (deck.length === 0) return;
    const [top, ...rest] = deck;
    setDeck(rest);
    setCurrentCard(top);
    playSound("flip");
    if (top.rank === "K") {
      playSound("cheer");
      setKings((prev) => {
        const next = prev + 1;
        if (next === 4) setToast("4枚目のキング！キングズカップ！");
        else setToast(`キング #${next}！`);
        return next;
      });
    }
  }

  const deckStack = useMemo(() => {
    const count = Math.min(remaining, 5);
    return Array.from({ length: count }, (_, index) => index);
  }, [remaining]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-4 pb-16 pt-8 sm:px-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link to="/" className="flex items-center gap-3 text-xl font-semibold text-brand-700">
            <img src="/logo.svg" alt="YoriDori" className="h-10 w-10" />
            <span>YoriDori Games</span>
          </Link>
          <nav className="flex flex-wrap gap-3 text-sm font-medium text-slate-600">
            <Link to="/kingscup" className="rounded-full px-4 py-2 transition hover:bg-slate-100 hover:text-brand-700">
              キングスカップとは
            </Link>
            <Link to="/kingscup/rules" className="rounded-full px-4 py-2 transition hover:bg-slate-100 hover:text-brand-700">
              ルール一覧
            </Link>
          </nav>
        </header>

        <main className="mt-10 flex flex-1 flex-col items-center gap-8">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-500">King's Cup</p>
            <h1 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">カードを引いて、瞬間盛り上がる。</h1>
            <p className="mt-3 max-w-xl text-sm text-slate-600 sm:text-base">
              デッキをタップしてカードをめくると、ドリンクゲームの王道「キングスカップ」が始まります。画面を囲んで乾杯しよう！
            </p>
          </div>

          <div
            className="relative w-44 cursor-pointer select-none sm:w-48"
            onClick={drawCard}
            role="button"
            aria-label="カードを引く"
          >
            {deckStack.map((idx) => {
              const card = currentCard ?? deck[0] ?? null;
              return (
                <Card
                  key={idx}
                  rank={card?.rank ?? ""}
                  suit={card?.suit ?? ""}
                  flipped={!!currentCard && idx === 0}
                  rule={card ? rules[card.rank] : undefined}
                  style={{
                    position: "absolute",
                    inset: 0,
                    top: idx * 3,
                    left: idx * 3,
                    zIndex: idx,
                    transform: `scale(${1 - idx * 0.02})`,
                    transition: "all 0.3s ease",
                    boxShadow: "0 8px 16px rgba(15, 23, 42, 0.15)",
                  }}
                />
              );
            })}
          </div>

          <div className="flex flex-col items-center gap-3 text-sm text-slate-600 sm:flex-row sm:gap-6">
            <span className="rounded-full bg-white px-4 py-2 shadow-sm">
              残りカード: <strong className="font-semibold text-brand-700">{remaining}</strong>
            </span>
            <span className="rounded-full bg-white px-4 py-2 shadow-sm">
              引いたキング: <strong className="font-semibold text-brand-700">{kings}</strong>
            </span>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              onClick={resetGame}
              className="inline-flex items-center justify-center rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-600/40 transition hover:bg-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-300"
            >
              新しいデッキで遊ぶ
            </button>
            <Link
              to="/kingscup/rules"
              className="inline-flex items-center justify-center rounded-full border border-brand-200 bg-white px-6 py-3 text-sm font-semibold text-brand-700 shadow-sm transition hover:border-brand-400 hover:text-brand-800"
            >
              ルールを確認
            </Link>
          </div>
        </main>
      </div>
      {toast && (
        <div className="pointer-events-none fixed bottom-6 left-0 right-0 flex justify-center px-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-xl">
            <span>{toast}</span>
          </div>
        </div>
      )}
    </div>
  );
}
