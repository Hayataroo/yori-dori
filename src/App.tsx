import React, { useMemo, useState, useEffect, useRef } from "react";

// キングスカップ — モバイル向け単一ファイルReactアプリ（Tailwind CSS想定）
// UI改善: 山札をタップすると自動でカードがめくられるUI
// トランプの立体感を3px重なりで演出し、カードを大きくしてルール（完全日本語）をカード内に表示

const defaultRules = {
  A: "ウォーターフォール — 全員一斉に飲み始める。止めたい時に止めてもいいが、右隣の人より先には止められない。",
  "2": "あなた — 他のプレイヤー1人を指名し、その人が飲む。",
  "3": "私 — 自分が飲む。",
  "4": "床 — 一番最後に床を触った人が飲む。",
  "5": "男性 — 男性全員が飲む。",
  "6": "女性 — 女性全員が飲む。",
  "7": "天国 — 最後に手を挙げた人が飲む。",
  "8": "相棒 — 相棒を1人決める。この後、相棒が飲むとき自分も一緒に飲む。",
  "9": "ライム — 単語を1つ言う。順番にその単語と韻を踏む単語を言う。言えなかった人が飲む。",
  "10": "カテゴリー — カテゴリーを1つ決め、順番に当てはまるものを言う。言えなかった人が飲む。",
  J: "私は一度も — 『私は一度も〇〇したことがない』と言い、該当する人が飲む。",
  Q: "クエスチョンマスター — クエスチョンマスターが質問をしたら、答えてはいけない。答えた人が飲む。",
  K: "キング — カップに自分の飲み物を注ぐ。4枚目のキングを引いた人がカップを飲み干す。",
};

const suits = ["♠", "♥", "♦", "♣"] as const;
const ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"] as const;

function makeDeck() {
  const deck = [] as { rank: typeof ranks[number]; suit: typeof suits[number] }[];
  for (const r of ranks) for (const s of suits) deck.push({ rank: r, suit: s });
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

function Card({ rank, suit, flipped, rule, style }: { rank: string; suit: string; flipped?: boolean; rule?: string; style?: React.CSSProperties }) {
  const isRed = suit === "♥" || suit === "♦";
  return (
    <div
      style={style}
      className={`w-44 h-64 rounded-2xl shadow-xl border bg-white flex flex-col items-center justify-between p-4 transition-transform duration-500 active:scale-95 ${flipped ? "transform scale-110 z-10" : "bg-zinc-200"} ${isRed ? "text-red-600" : "text-gray-800"}`}
    >
      {flipped ? (
        <>
          <div className="w-full flex justify-between text-xl font-bold">
            <span>{rank}</span>
            <span>{suit}</span>
          </div>
          <div className="text-6xl my-2">{suit}</div>
          <div className="text-sm text-center text-gray-700 leading-snug px-2">
            {rule || "このカードのルールは未設定です"}
          </div>
          <div className="w-full flex justify-between text-xl rotate-180 font-bold">
            <span>{rank}</span>
            <span>{suit}</span>
          </div>
        </>
      ) : (
        <div className="w-full h-full flex items-center justify-center text-2xl bg-zinc-200">🂠</div>
      )}
    </div>
  );
}

export default function App() {
  const [deck, setDeck] = useState(makeDeck());
  const [currentCard, setCurrentCard] = useState<{ rank: string; suit: string } | null>(null);
  const [kings, setKings] = useState(0);
  const [rules, setRules] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem("kc_rules");
    return saved ? JSON.parse(saved) : defaultRules;
  });
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<number | null>(null);

  const flipSound = useRef(new Audio('/sounds/card-flip.mp3'));
  const cheerSound = useRef(new Audio('/sounds/cheer.mp3'));

  // ===== 効果音フォールバック（mp3が無い/再生不可でも動作） =====
  function playFallbackBeep(freq = 880, durMs = 90) {
    const AC: any = (window as any).AudioContext || (window as any).webkitAudioContext;
    if (!AC) return; // 音が出せない環境
    const ctx = new AC();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.value = freq;
    osc.connect(gain); gain.connect(ctx.destination);
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + durMs / 1000);
    osc.start();
    osc.stop(ctx.currentTime + durMs / 1000 + 0.01);
  }

  function playSound(type: 'flip' | 'cheer') {
    const el = type === 'flip' ? flipSound.current : cheerSound.current;
    const tryPlay = async () => {
      try {
        if (el) { el.currentTime = 0; await el.play(); return; }
      } catch {}
      // フォールバック
      if (type === 'flip') playFallbackBeep(900, 80); else playFallbackBeep(600, 180);
    };
    tryPlay();
  }

  useEffect(() => {
    localStorage.setItem("kc_rules", JSON.stringify(rules));
  }, [rules]);

  useEffect(() => {
    if (!toast) return;
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 2200);
  }, [toast]);

  const remaining = deck.length;

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
    playSound('flip');
    if (top.rank === "K") playSound('cheer');
    if (top.rank === "K") {
      setKings((k) => {
        const next = k + 1;
        if (next === 4) setToast("4枚目のキング！キングズカップ！");
        else setToast(`キング #${next}！`);
        return next;
      });
    }
  }

  const deckStack = useMemo(() => {
    const count = Math.min(remaining, 5);
    return Array.from({ length: count }, (_, i) => i);
  }, [remaining]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-zinc-100 text-zinc-900 flex flex-col items-center">
      <header className="px-4 pt-6 pb-3 sticky top-0 bg-gradient-to-b from-zinc-50 to-transparent backdrop-blur z-10 w-full">
        <h1 className="text-2xl font-bold text-center">キングスカップ</h1>
      </header>
      <main className="flex-1 flex flex-col items-center gap-4 mt-4">
        <div
          className="relative w-44 h-64 cursor-pointer select-none active:scale-[0.98]"
          onClick={drawCard}
        >
          {deckStack.map((idx) => (
            <Card
              key={idx}
              rank={currentCard ? currentCard.rank : deck[0]?.rank || ""}
              suit={currentCard ? currentCard.suit : deck[0]?.suit || ""}
              flipped={!!currentCard}
              rule={rules[currentCard ? currentCard.rank : deck[0]?.rank || ""]}
              style={{
                position: 'absolute',
                top: idx * 3,
                left: idx * 3,
                zIndex: idx,
                transform: `scale(${1 - idx * 0.02})`,
                transition: 'all 0.3s ease',
                opacity: 1,
                boxShadow: '0 6px 12px rgba(0, 0, 0, 0.25)',
              }}
            />
          ))}
        </div>
        <div className="flex gap-3 mt-4">
          <button
            onClick={resetGame}
            className="px-4 py-3 rounded-2xl shadow text-sm bg-brand-600 text-white hover:bg-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300"
          >
            リセット
          </button>
        </div>
        {toast && (
          <div className="fixed bottom-4 inset-x-0 flex justify-center">
            <div className="px-4 py-2 rounded-2xl shadow bg-brand-600 text-white">
              {toast}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
