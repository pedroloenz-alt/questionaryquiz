import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { profiles, questions, type ProfileKey } from "@/lib/quiz-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MasterQuiz - Diagnóstico de Oportunidades" },
      {
        name: "description",
        content:
          "Responde 5 preguntas y descubre qué camino de ingresos extra se adapta a tu tiempo, tus habilidades y tus objetivos. Gratis y sin registro.",
      },
      {
        property: "og:title",
        content: "MasterQuiz - Diagnóstico de Oportunidades",
      },
      {
        property: "og:description",
        content:
          "Un diagnóstico breve y orientativo para identificar el camino de ingresos extra más compatible con tu rutina.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type Stage = "intro" | "quiz" | "loading" | "result";

const DESTINO_URL = "https://spotifymaster.vercel.app/";

function Backdrop() {
  return (
    <div className="pointer-events-none absolute inset-0">
      <div
        className="absolute -top-24 -left-20 h-[380px] w-[380px] rounded-full bg-brand/25 blur-[110px]"
        style={{ animation: "floaty 14s ease-in-out infinite" }}
      />
      <div
        className="absolute bottom-0 -right-24 h-[420px] w-[420px] rounded-full bg-accent2/20 blur-[120px]"
        style={{ animation: "floaty 18s ease-in-out infinite reverse" }}
      />
    </div>
  );
}

function Index() {
  const [stage, setStage] = useState<Stage>("intro");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<ProfileKey[]>([]);

  useEffect(() => {
    if (stage !== "loading") return;
    const t = setTimeout(() => setStage("result"), 2200);
    return () => clearTimeout(t);
  }, [stage]);

  const resultKey = useMemo<ProfileKey>(() => {
    const tally: Record<string, number> = {};
    for (const a of answers) tally[a] = (tally[a] ?? 0) + 1;
    const best = Object.entries(tally).sort((a, b) => b[1] - a[1])[0];
    return (best?.[0] as ProfileKey) ?? "digital";
  }, [answers]);

  function choose(profile: ProfileKey) {
    const next = [...answers.slice(0, step), profile];
    setAnswers(next);
    if (step + 1 >= questions.length) {
      setStage("loading");
    } else {
      setStep(step + 1);
    }
  }

  function restart() {
    setAnswers([]);
    setStep(0);
    setStage("intro");
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-ink">
      <Backdrop />

      <div className="relative mx-auto flex min-h-screen max-w-2xl flex-col px-6 py-8">
        <nav className="flex items-center gap-2.5">
          <div className="grid size-9 place-items-center rounded-xl bg-white/10 font-display font-bold text-brand ring-1 ring-white/15 backdrop-blur-xl">
            R
          </div>
          <span className="font-display text-lg font-bold tracking-tight">MyRewards</span>
        </nav>

        <div className="flex flex-1 flex-col justify-center py-10">
          {stage === "intro" && <Intro onStart={() => setStage("quiz")} />}
          {stage === "quiz" && (
            <QuizView
              step={step}
              progress={Math.round((step / questions.length) * 100)}
              onChoose={choose}
              onBack={() => setStep((s) => Math.max(0, s - 1))}
            />
          )}
          {stage === "loading" && <Loading />}
          {stage === "result" && <Result profileKey={resultKey} onRestart={restart} />}
        </div>

        <p className="text-center text-xs leading-relaxed text-soft/70">
          Diagnóstico informativo y orientativo. No constituye una promesa de ingresos ni una
          recomendación financiera.
        </p>
      </div>
    </div>
  );
}

function Intro({ onStart }: { onStart: () => void }) {
  return (
    <div className="animate-fadeup text-center">
      <div className="inline-flex items-center gap-2 rounded-full bg-white/8 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-brand ring-1 ring-brand/25">
        Diagnóstico gratuito · 2 min
      </div>
      <h1 className="mt-6 font-display text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl">
        Descubre tu camino hacia los{" "}
        <span className="text-gradient-brand">ingresos extra</span>
      </h1>
      <p className="mx-auto mt-5 max-w-md text-lg leading-relaxed text-soft">
        Responde 5 preguntas rápidas y te mostramos qué tipo de actividad se adapta mejor a tu
        rutina.
      </p>
      <button
        onClick={onStart}
        className="mt-8 rounded-2xl bg-[image:var(--gradient-brand)] px-8 py-4 font-display text-base font-bold text-primary-foreground shadow-[var(--shadow-glow)] transition-transform hover:-translate-y-0.5"
      >
        Comenzar mi diagnóstico
      </button>
      <p className="mt-4 text-sm text-soft">Sin registro y sin datos bancarios</p>
    </div>
  );
}

function QuizView({
  step,
  progress,
  onChoose,
  onBack,
}: {
  step: number;
  progress: number;
  onChoose: (p: ProfileKey) => void;
  onBack: () => void;
}) {
  const q = questions[step] ?? questions[0]!;
  return (
    <div key={q.id} className="glass-panel animate-fadeup rounded-[28px] p-6 shadow-[var(--shadow-panel)] sm:p-8">
      <div className="flex items-center justify-between text-xs text-soft">
        <span className="font-semibold uppercase tracking-widest">
          Pregunta {step + 1} de {questions.length}
        </span>
        <span className="font-bold text-brand">{progress}%</span>
      </div>
      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-[image:var(--gradient-brand)] transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <h2 className="mt-6 font-display text-2xl font-bold leading-snug sm:text-3xl">
        {q.question}
      </h2>

      <div className="mt-6 space-y-3">
        {q.options.map((opt) => (
          <button
            key={opt.label}
            onClick={() => onChoose(opt.profile)}
            className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-left text-sm font-medium text-ink transition-colors hover:border-brand/50 hover:bg-brand/12"
          >
            {opt.label}
          </button>
        ))}
      </div>

      <button
        onClick={onBack}
        disabled={step === 0}
        className="mt-7 text-sm text-soft transition-colors hover:text-ink disabled:opacity-30"
      >
        ← Anterior
      </button>
    </div>
  );
}

function Loading() {
  return (
    <div className="glass-panel animate-fadeup rounded-[28px] p-8 text-center shadow-[var(--shadow-panel)]">
      <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-brand/15">
        <div className="size-6 animate-spin rounded-full border-2 border-brand border-t-transparent" />
      </div>
      <h2 className="mt-6 font-display text-2xl font-bold">Analizando tus respuestas…</h2>
      <p className="mt-2 text-sm text-soft">Preparando tu perfil.</p>
    </div>
  );
}

function Result({ profileKey, onRestart }: { profileKey: ProfileKey; onRestart: () => void }) {
  const p = profiles[profileKey];
  return (
    <div className="glass-panel animate-fadeup rounded-[28px] p-7 shadow-[var(--shadow-panel)] sm:p-9">
      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
        Tu perfil
      </span>
      <h2 className="mt-3 font-display text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
        {p.name}
      </h2>
      <p className="mt-4 text-base leading-relaxed text-soft">{p.summary}</p>

      <div className="mt-6 space-y-3">
        {p.steps.map((s, i) => (
          <div key={s} className="flex gap-3 rounded-2xl bg-white/5 p-4 text-sm text-ink">
            <span className="font-display font-bold text-brand">0{i + 1}</span>
            <span className="text-soft">{s}</span>
          </div>
        ))}
      </div>

      <a
        href={DESTINO_URL}
        className="mt-7 inline-flex w-full items-center justify-center rounded-2xl bg-[image:var(--gradient-brand)] px-6 py-4 font-display text-base font-bold text-primary-foreground shadow-[var(--shadow-glow)] transition-transform hover:-translate-y-0.5"
      >
        Ver el contenido completo
      </a>
      <p className="mt-3 text-center text-xs text-soft">
        Acceso informativo, sin costo y sin datos bancarios.
      </p>

      <button
        onClick={onRestart}
        className="mt-6 w-full text-center text-sm text-soft transition-colors hover:text-ink"
      >
        ← Repetir el diagnóstico
      </button>
    </div>
  );
}
