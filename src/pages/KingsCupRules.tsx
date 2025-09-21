import React from "react";
import { Link } from "react-router-dom";
import { defaultRules } from "../data/kingsCup";

const ruleEntries = Object.entries(defaultRules);

export default function KingsCupRules() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col gap-12 px-6 pb-16 pt-10 sm:px-10">
        <header className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <Link to="/" className="flex items-center gap-3 text-xl font-semibold text-brand-700">
            <img src="/logo.svg" alt="YoriDori" className="h-10 w-10" />
            <span>YoriDori Games</span>
          </Link>
          <nav className="flex flex-wrap gap-4 text-sm font-semibold text-slate-600">
            <Link to="/kingscup" className="transition hover:text-brand-700">
              キングスカップとは
            </Link>
            <Link to="/kingscup/play" className="transition hover:text-brand-700">
              プレイ画面へ
            </Link>
          </nav>
        </header>

        <main className="flex flex-1 flex-col gap-12">
          <section className="space-y-6">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-500">Rules</p>
            <h1 className="text-4xl font-bold text-slate-900 sm:text-5xl">キングスカップのルール一覧</h1>
            <p className="max-w-3xl text-base leading-relaxed text-slate-600">
              カードを引いたら、対応するルールを全員で実行しましょう。YoriDoriでは、以下のデフォルトルールがカード内に表示されます。必要に応じてハウスルールにアレンジしても構いません。
            </p>
          </section>

          <section className="rounded-3xl border border-brand-100 bg-white/80 p-6 shadow-xl shadow-brand-900/5">
            <div className="grid gap-4 sm:grid-cols-2">
              {ruleEntries.map(([rank, rule]) => (
                <div key={rank} className="rounded-2xl border border-slate-100 bg-white px-5 py-4 shadow-sm">
                  <div className="flex items-baseline justify-between">
                    <span className="text-3xl font-bold text-brand-700">{rank}</span>
                    <span className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-400">Rule</span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-slate-700">{rule}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl bg-gradient-to-br from-brand-600 to-brand-700 p-8 text-white">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">オリジナルルールも自由に追加</h2>
              <p className="text-sm leading-relaxed text-brand-100">
                プレイ画面でルールを編集すると、ローカルに保存され次回以降も反映されます。自分たちだけのキングスカップを作ってみましょう。
              </p>
            </div>
            <div className="mt-6 flex flex-wrap gap-4">
              <Link
                to="/kingscup/play"
                className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand-700 shadow-lg shadow-black/20 transition hover:bg-brand-50"
              >
                プレイ画面に戻る
              </Link>
              <Link
                to="/kingscup"
                className="inline-flex items-center justify-center rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                概要ページを見る
              </Link>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
