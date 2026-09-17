import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { profiles, questions, type ProfileKey } from "@/lib/quiz-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "RentasVivas — Diagnóstico de ingresos extra en 10 preguntas" },
      {
        name: "description",
        content:
          "Responde 10 preguntas y descubre qué camino de ingresos extra se adapta a tu tiempo, tus habilidades y tus objetivos. Gratis y sin registro.",
      },
      {
        property: "og:title",
        content: "RentasVivas — Diagnóstico de ingresos extra en 10 preguntas",
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

function Backdrop() {
  return (
    <div className="pointer-events-none absolute inset-0">
      <div
        className="absolute -top-32 -left-24 h-[440px] w-[440px] rounded-full bg-brand/35 blur-[110px]"
        style={{ animation: "floaty 13s ease-in-out infinite" }}
      />
      <div
        className="absolute top-1/3 -right-28 h-[480px] w-[480px] rounded-full bg-accent2/30 blur-[120px]"
        style={{ animation: "floaty 17s ease-in-out infinite reverse" }}
      />
      <div
        className="absolute bottom-0 left-1/4 h-[360px] w-[360px] rounded-full bg-sky/25 blur-[120px]"
        style={{ animation: "floaty 15s ease-in-out infinite" }}
      />
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)",
          backgroundSize: "34px 34px",
        }}
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
    const t = setTimeout(() => setStage("result"), 2400);
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

  const progress = Math.round(((step + (stage === "quiz" ? 0 : 1)) / questions.length) * 100);

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-ink">
      <Backdrop />

      <div className="relative mx-auto max-w-7xl px-6 py-8 lg:px-10">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="grid size-9 place-items-center rounded-xl bg-white/10 font-display font-bold text-brand ring-1 ring-white/15 backdrop-blur-xl">
              R
            </div>
            <span className="font-display text-lg font-bold tracking-tight">RentasVivas</span>
          </div>
          <div className="hidden items-center gap-8 text-sm text-soft md:flex">
            <span>Método</span>
            <span>Resultados</span>
            <span>Preguntas</span>
          </div>
          <span className="rounded-full bg-white/8 px-4 py-2 text-sm font-medium ring-1 ring-white/12 backdrop-blur-xl">
            Mi panel
          </span>
        </nav>

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

        <p className="mx-auto mt-16 max-w-[70ch] text-center text-xs leading-relaxed text-soft/70">
          Este diagnóstico tiene fines informativos y orientativos. No constituye una promesa de
          ingresos ni una recomendación financiera. Los resultados dependen de cada persona y de su
          contexto.
        </p>
        <div className="h-8" aria-hidden />
        <span className="sr-only">{progress}</span>
      </div>
    </div>
  );
}

function Intro({ onStart }: { onStart: () => void }) {
  return (
    <>
      <div className="mt-14 grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="animate-fadeup">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/8 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-brand ring-1 ring-brand/25 backdrop-blur-xl">
            Diagnóstico gratuito · 2 min
          </div>
          <h1 className="mt-6 font-display text-5xl font-extrabold leading-[1.03] tracking-tight lg:text-6xl">
            Descubre tu camino hacia los{" "}
            <span className="text-gradient-brand">ingresos extra</span>
          </h1>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-soft">
            Responde 10 preguntas rápidas y te mostramos qué tipo de actividad se adapta mejor a tu
            horario, tus habilidades y tus objetivos.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              onClick={onStart}
              className="rounded-2xl bg-[image:var(--gradient-brand)] px-7 py-4 font-display text-base font-bold text-primary-foreground shadow-[var(--shadow-glow)] transition-transform hover:-translate-y-0.5"
            >
              Comenzar mi diagnóstico
            </button>
            <div className="flex items-center gap-3 text-sm text-soft">
              <div className="flex -space-x-2">
                <div className="grid size-8 place-items-center rounded-full bg-accent2/40 text-xs font-bold ring-2 ring-background">
                  M
                </div>
                <div className="grid size-8 place-items-center rounded-full bg-brand/40 text-xs font-bold ring-2 ring-background">
                  C
                </div>
                <div className="grid size-8 place-items-center rounded-full bg-sky/40 text-xs font-bold ring-2 ring-background">
                  D
                </div>
              </div>
              <span>Sin registro y sin datos bancarios</span>
            </div>
          </div>
        </div>

        <div className="relative animate-fadeup">
          <div className="glass-panel rounded-[28px] p-6 shadow-[var(--shadow-panel)]">
            <div className="flex items-center justify-between text-xs text-soft">
              <span className="font-semibold uppercase tracking-widest">Pregunta 3 de 10</span>
              <span className="font-bold text-brand">30%</span>
            </div>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-[30%] rounded-full bg-[image:var(--gradient-brand)]" />
            </div>
            <h3 className="mt-6 font-display text-2xl font-bold leading-snug">
              ¿Qué experiencia tienes con trabajos por internet?
            </h3>
            <div className="mt-5 space-y-3">
              <div className="rounded-2xl border border-brand/50 bg-brand/12 p-4 text-sm font-semibold">
                He probado algo, sin continuidad
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-soft">
                Ninguna, empiezo desde cero
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-soft">
                Tengo experiencia constante
              </div>
            </div>
          </div>
          <div className="absolute -bottom-6 -left-6 rounded-2xl border border-white/12 bg-white/[0.07] px-5 py-4 shadow-xl backdrop-blur-2xl">
            <p className="text-xs text-soft">Tu perfil estimado</p>
            <p className="font-display text-lg font-bold text-brand">Digital flexible</p>
          </div>
        </div>
      </div>

      <div className="mt-16 grid gap-5 md:grid-cols-3">
        <div className="glass-panel rounded-3xl p-6">
          <div className="grid size-11 place-items-center rounded-xl bg-brand/15 font-display text-lg font-bold text-brand">
            01
          </div>
          <h4 className="mt-4 text-lg font-bold">Diagnóstico a tu medida</h4>
          <p className="mt-2 text-sm leading-relaxed text-soft">
            Cada respuesta ajusta tu perfil. Nada de consejos genéricos copiados de internet.
          </p>
        </div>
        <div className="glass-panel rounded-3xl p-6">
          <div className="grid size-11 place-items-center rounded-xl bg-accent2/15 font-display text-lg font-bold text-accent2">
            02
          </div>
          <h4 className="mt-4 text-lg font-bold">Análisis de tus respuestas</h4>
          <p className="mt-2 text-sm leading-relaxed text-soft">
            Al terminar organizamos tu perfil y te mostramos las áreas más compatibles con tu rutina.
          </p>
        </div>
        <div className="glass-panel rounded-3xl p-6">
          <div className="grid size-11 place-items-center rounded-xl bg-sky/15 font-display text-lg font-bold text-sky">
            03
          </div>
          <h4 className="mt-4 text-lg font-bold">Pasos claros y realistas</h4>
          <p className="mt-2 text-sm leading-relaxed text-soft">
            Recibes un punto de partida concreto, pensado para el tiempo que tienes disponible.
          </p>
        </div>
      </div>
    </>
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
    <div className="mx-auto mt-14 max-w-2xl">
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
        {q.hint && <p className="mt-2 text-sm text-soft">{q.hint}</p>}

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

        <div className="mt-7 flex items-center justify-between">
          <button
            onClick={onBack}
            disabled={step === 0}
            className="text-sm text-soft transition-colors hover:text-ink disabled:opacity-30"
          >
            ← Anterior
          </button>
          <span className="text-xs text-soft">Puedes salir cuando quieras</span>
        </div>
      </div>
    </div>
  );
}

function Loading() {
  return (
    <div className="mx-auto mt-14 max-w-2xl">
      <div className="glass-panel animate-fadeup rounded-[28px] p-8 text-center shadow-[var(--shadow-panel)]">
        <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-brand/15">
          <div className="size-6 animate-spin rounded-full border-2 border-brand border-t-transparent" />
        </div>
        <h2 className="mt-6 font-display text-2xl font-bold">Analizando tus respuestas…</h2>
        <p className="mt-2 text-sm text-soft">
          Cruzando disponibilidad, habilidades y objetivos para armar tu perfil.
        </p>
        <div className="mt-7 space-y-3">
          <div className="h-2 w-11/12 rounded-full bg-white/10" />
          <div className="h-2 w-8/12 rounded-full bg-white/10" />
          <div className="h-2 w-10/12 rounded-full bg-white/10" />
          <div className="h-2 w-6/12 rounded-full bg-brand/40" />
        </div>
      </div>
    </div>
  );
}

function Result({ profileKey, onRestart }: { profileKey: ProfileKey; onRestart: () => void }) {
  const p = profiles[profileKey];
  return (
    <div className="mt-14 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="glass-panel animate-fadeup rounded-[28px] p-7 shadow-[var(--shadow-panel)]">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
          Tu perfil
        </span>
        <h2 className="mt-3 font-display text-4xl font-extrabold leading-tight tracking-tight">
          {p.name}
        </h2>
        <p className="mt-4 max-w-[52ch] text-base leading-relaxed text-soft">{p.summary}</p>
        <div className="mt-6 space-y-3">
          {p.traits.map((t) => (
            <div
              key={t.label}
              className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
            >
              <span className="text-sm text-soft">{t.label}</span>
              <span className="font-display text-sm font-bold text-brand">{t.value}</span>
            </div>
          ))}
        </div>
        <button
          onClick={onRestart}
          className="mt-6 text-sm text-soft transition-colors hover:text-ink"
        >
          ← Repetir el diagnóstico
        </button>
      </div>

      <div className="glass-panel animate-fadeup flex flex-col justify-between rounded-[28px] p-7 shadow-[var(--shadow-panel)]">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-accent2">
            Siguiente paso
          </span>
          <h3 className="mt-3 font-display text-2xl font-bold leading-tight">
            Tu punto de partida sugerido
          </h3>
          <ul className="mt-5 space-y-3">
            {p.steps.map((s, i) => (
              <li key={s} className="flex gap-3 rounded-2xl bg-white/5 p-4 text-sm text-ink">
                <span className="font-display font-bold text-brand">0{i + 1}</span>
                <span className="text-soft">{s}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-7">
          <a
            href="#"
            className="inline-flex w-full items-center justify-center rounded-2xl bg-[image:var(--gradient-brand)] px-6 py-4 font-display text-base font-bold text-primary-foreground shadow-[var(--shadow-glow)] transition-transform hover:-translate-y-0.5"
          >
            Ver el contenido completo
          </a>
          <p className="mt-3 text-center text-xs text-soft">
            Acceso informativo, sin costo y sin datos bancarios.
          </p>
        </div>
      </div>
    </div>
  );
}
