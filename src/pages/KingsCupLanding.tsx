import React from "react";
import { Link } from "react-router-dom";
import { kingsCupHighlights } from "../data/kingsCup";

export default function KingsCupLanding() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-brand-50/40 to-slate-100 text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col gap-12 px-6 pb-16 pt-10 sm:px-10">
        <header className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <Link to="/" className="flex items-center gap-3 text-xl font-semibold text-brand-700">
            <img src="/logo.svg" alt="YoriDori" className="h-10 w-10" />
            <span>YoriDori Games</span>
          </Link>
          <nav className="flex flex-wrap gap-4 text-sm font-semibold text-slate-600">
            <Link to="/kingscup/rules" className="transition hover:text-brand-700">
              詳細ルール
            </Link>
            <Link to="/kingscup/play" className="transition hover:text-brand-700">
              プレイ画面へ
            </Link>
          </nav>
        </header>

        <main className="flex flex-1 flex-col gap-12">
          <section className="space-y-6">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-500">About King's Cup</p>
            <h1 className="text-4xl font-bold leading-tight text-slate-900 sm:text-5xl">
              一枚のカードが、テーブル全体を盛り上げる。
            </h1>
            <p className="max-w-3xl text-lg leading-relaxed text-slate-600">
              キングスカップは、1枚引いたカードに書かれたアクションを全員で実行して楽しむドリンクゲームです。4枚目のキングを引いた人がカップの中身を飲み干すまで、笑いと歓声が止まりません。YoriDoriのキングスカップは、スマートフォンでもPCでも快適に遊べるように調整されています。
            </p>
          </section>

          <section className="grid gap-6 rounded-3xl bg-white/70 p-8 shadow-xl shadow-brand-900/5 sm:grid-cols-2">
            {kingsCupHighlights.map((highlight) => (
              <div key={highlight.title} className="rounded-2xl border border-brand-100 bg-brand-50/60 px-6 py-5">
                <h2 className="text-lg font-semibold text-brand-700">{highlight.title}</h2>
                <p className="mt-2 text-sm text-slate-600">{highlight.description}</p>
              </div>
            ))}
          </section>

          <section className="grid gap-8 rounded-3xl border border-brand-100 bg-white/70 p-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900">遊び方</h2>
              <ol className="space-y-4 text-slate-700">
                <li>
                  <span className="font-semibold text-brand-700">1. デッキをシャッフル</span>
                  <p className="mt-1 text-sm leading-relaxed">
                    プレイ画面では「新しいデッキで遊ぶ」をタップするだけで52枚のカードがシャッフルされます。
                  </p>
                </li>
                <li>
                  <span className="font-semibold text-brand-700">2. カードを1枚めくる</span>
                  <p className="mt-1 text-sm leading-relaxed">
                    山札のカードをタップすると自動的にカードがめくられ、該当するルールと演出が表示されます。
                  </p>
                </li>
                <li>
                  <span className="font-semibold text-brand-700">3. ルールに従って盛り上がる</span>
                  <p className="mt-1 text-sm leading-relaxed">
                    各ルールは日本語で丁寧に記載。カスタムルールも保存されるので、自分たちのハウスルールでも遊べます。
                  </p>
                </li>
              </ol>
            </div>

            <div className="flex flex-col justify-between gap-6 rounded-3xl bg-gradient-to-br from-brand-600 to-brand-700 p-8 text-white">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">今夜のパーティーをアップグレード</h2>
                <p className="text-sm leading-relaxed text-brand-100">
                  カードをめくるだけで会話が弾む。キングスカップは初対面のアイスブレイクにも、気心の知れた友人との飲み会にもぴったりです。
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <Link
                  to="/kingscup/play"
                  className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand-700 shadow-lg shadow-black/20 transition hover:bg-brand-50"
                >
                  プレイ画面へ進む
                </Link>
                <Link
                  to="/kingscup/rules"
                  className="inline-flex items-center justify-center rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  ルールを詳しく見る
                </Link>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
