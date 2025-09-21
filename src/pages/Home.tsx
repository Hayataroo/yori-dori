import React from "react";
import { Link } from "react-router-dom";
import { defaultRules, kingsCupHighlights, kingsCupKeywords } from "../data/kingsCup";

const sampleRules = Object.entries(defaultRules).slice(0, 3);

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-slate-100 text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-10 sm:px-10 lg:px-16">
        <header className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <img src="/logo.svg" alt="YoriDori" className="h-12 w-12" />
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.3em] text-brand-500">YoriDori</p>
              <p className="text-lg font-semibold text-slate-800">Party Game Collection</p>
            </div>
          </div>
          <nav className="flex flex-wrap items-center gap-4 text-sm font-semibold text-slate-600">
            <Link to="/kingscup" className="transition hover:text-brand-700">
              キングスカップとは
            </Link>
            <Link to="/kingscup/rules" className="transition hover:text-brand-700">
              ルールを見る
            </Link>
            <Link
              to="/kingscup/play"
              className="rounded-full bg-brand-600 px-5 py-2 text-white shadow-lg shadow-brand-600/40 transition hover:bg-brand-700"
            >
              今すぐ遊ぶ
            </Link>
          </nav>
        </header>

        <main className="mt-16 flex flex-1 flex-col gap-16 lg:flex-row">
          <section className="max-w-2xl space-y-10">
            <div className="space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-brand-500 shadow-sm shadow-brand-500/10">
                New release
              </span>
              <h1 className="text-4xl font-bold leading-tight text-slate-900 sm:text-5xl">
                ドリンクゲームの定番「キングスカップ」を<br className="hidden sm:block" />スマホ1つで遊べるように。
              </h1>
              <p className="text-lg text-slate-600">
                プレイヤー全員でカードを1枚ずつめくり、引いたカードのルールに従って盛り上がるゲームです。YoriDoriなら、ルールの確認も演出もすべてブラウザ上で完結します。
              </p>
            </div>

            <ul className="grid gap-4 sm:grid-cols-2">
              {kingsCupHighlights.map((highlight) => (
                <li
                  key={highlight.title}
                  className="rounded-2xl border border-brand-100 bg-white/80 px-4 py-5 text-sm text-slate-600 shadow-sm"
                >
                  <span className="block text-base font-semibold text-brand-700">{highlight.title}</span>
                  <span className="mt-2 block text-sm leading-relaxed text-slate-600">{highlight.description}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex flex-wrap gap-2">
                {kingsCupKeywords.map((keyword) => (
                  <span key={keyword} className="rounded-full bg-brand-100 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-brand-600">
                    {keyword}
                  </span>
                ))}
              </div>
              <div className="sm:ml-auto flex gap-3">
                <Link
                  to="/kingscup/play"
                  className="inline-flex items-center justify-center rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-600/40 transition hover:bg-brand-700"
                >
                  今すぐプレイ
                </Link>
                <Link
                  to="/kingscup/rules"
                  className="inline-flex items-center justify-center rounded-full border border-brand-200 bg-white px-6 py-3 text-sm font-semibold text-brand-700 shadow-sm transition hover:border-brand-400 hover:text-brand-800"
                >
                  ルールをチェック
                </Link>
              </div>
            </div>
          </section>

          <section className="relative mx-auto flex w-full max-w-sm flex-col items-center justify-center">
            <div className="absolute inset-0 -skew-y-3 rounded-[3rem] bg-gradient-to-br from-brand-200/60 via-brand-100/30 to-transparent blur-2xl" aria-hidden="true" />
            <div className="relative w-full max-w-xs rounded-[2.5rem] bg-white px-8 py-10 shadow-2xl shadow-brand-900/10">
              <div className="flex items-center justify-between text-sm font-semibold text-brand-600">
                <span>キングスカップ</span>
                <span>Party Mode</span>
              </div>
              <div className="mt-8 space-y-5">
                {sampleRules.map(([rank, rule]) => (
                  <div key={rank} className="rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-3">
                    <div className="flex items-center justify-between text-sm font-semibold text-brand-700">
                      <span className="text-xl">{rank}</span>
                      <span className="text-xs uppercase tracking-[0.2em] text-brand-400">Rule</span>
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-slate-600">{rule}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex flex-col gap-4">
                <Link
                  to="/kingscup/play"
                  className="inline-flex items-center justify-center rounded-2xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-600/30 transition hover:bg-brand-700"
                >
                  カードを引く
                </Link>
                <Link
                  to="/kingscup"
                  className="inline-flex items-center justify-center rounded-2xl border border-brand-100 bg-white px-4 py-3 text-sm font-semibold text-brand-700 transition hover:border-brand-300"
                >
                  詳細を見る
                </Link>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
