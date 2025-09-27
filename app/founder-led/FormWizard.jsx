'use client'

import { useRef, useState } from "react";
import { supabase } from "../lib/supabase";

const initialAnswers = {
  name: "",
  email: "",
  phone: "",
  instagramUrl: "",
  investment: "",
};

const stepConfig = [
  { key: "name", label: "Your name", type: "text", placeholder: "e.g., Suresh Malani" },
  { key: "email", label: "Work email", type: "email", placeholder: "you@company.com" },
  { key: "phone", label: "Phone / WhatsApp (with country code)", type: "text", placeholder: "+91 98xxxxxxx" },
  { key: "instagramUrl", label: "Main Instagram profile", type: "text", placeholder: "@yourhandle or profile URL" },
  {
    key: "investment",
    label: "Monthly investment you can commit",
    type: "radio",
    options: ["< $500", "$500 - $1000", "$1000 - $5000", "> $5000"],
  },
];

const RESULT_COPY = {
  not_qualified: {
    title: "We Appreciate Your Interest",
    body: [
      "We currently partner with campaigns investing $500 or more each month.",
      "Update your investment amount to continue, or drop back in once you are ready to scale.",
    ],
    showCalendly: false,
    showReset: true,
  },
  qualified_basic: {
    title: "You've Been Pre Qualified!",
    body: [
      "You are a great fit for our starter tier and we will keep your details on file.",
      "Increase your monthly investment to unlock the full Social SEO system immediately.",
    ],
    showCalendly: true,
    showReset: true,
  },
  qualified_full: {
    title: "You're In!",
    body: [
      "Your profile aligns perfectly with Social SEO and we are ready to set a measurable reach target.",
      "Book a slot so we can map month one and lock your custom guarantee.",
    ],
    showCalendly: true,
    showReset: false,
  },
};

export default function FormWizard({ onClose, onQualified }) {
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [answers, setAnswers] = useState(initialAnswers);
  const inputRef = useRef(null);

  const totalSteps = stepConfig.length;
  const currentStep = stepConfig[step];

  const updateAnswer = (key, value) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const canAdvance = () => {
    if (currentStep.type === "radio") return answers[currentStep.key] !== "";
    const value = (answers[currentStep.key] || "").trim();
    if (currentStep.key === "email") return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    return value.length > 1;
  };

  const goNext = () => {
    if (step < totalSteps - 1) setStep((prev) => prev + 1);
  };

  const goPrev = () => {
    if (step > 0) setStep((prev) => prev - 1);
  };

  const handleCardKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      if (step < totalSteps - 1 && canAdvance()) goNext();
      else if (step === totalSteps - 1 && canAdvance() && !saving) handleSubmit();
    } else if (event.key === "Enter" && event.shiftKey) {
      event.preventDefault();
      goPrev();
    }
  };

  const handleSubmit = async () => {
    setSaving(true);
    setError(null);

    const tier =
      answers.investment === "< $500"
        ? "none"
        : answers.investment === "$500 to $1000"
          ? "basic"
          : "full";

    try {
      if (!supabase || typeof supabase.from !== "function") {
        throw new Error("Supabase client is not configured");
      }

      const { error: insertError } = await supabase
        .from("submissions")
        .insert({
          name: answers.name,
          email: answers.email,
          phone: answers.phone,
          // use snake_case to match DB column
          instagram_url: answers.instagramUrl,
          investment: answers.investment,
        });

      if (insertError) {
        throw insertError;
      }
    } catch (err) {
      console.error("Supabase insert failed:", err);
      setSaving(false);
      setError("Something went wrong while saving. Please try again.");
      return;
    }

    setSaving(false);

    const resultType =
      tier === "none" ? "not_qualified" : tier === "basic" ? "qualified_basic" : "qualified_full";

    setResult({ type: resultType, data: { ...answers } });

    if (resultType === "qualified_full" && onQualified) {
      onQualified(answers.name, answers.email);
    }
  };

  const handleReset = (targetStep = null) => {
    setError(null);
    if (targetStep !== null) setStep(targetStep);
    setResult(null);
  };

  const renderField = () => {
    if (currentStep.type === "radio") {
      return (
        <div className="mt-6 space-y-3">
          {currentStep.options.map((option) => (
            <label key={option} className="flex cursor-pointer items-center gap-3 rounded-2xl px-4 py-3">
              <input
                type="radio"
                name={currentStep.key}
                checked={answers[currentStep.key] === option}
                onChange={() => updateAnswer(currentStep.key, option)}
                className="h-4 w-4 accent-indigo-500"
              />
              <span className="text-lg">{option}</span>
            </label>
          ))}
        </div>
      );
    }

    return (
      <input
        ref={inputRef}
        autoFocus
        className="form-input"
        type={currentStep.type}
        placeholder={currentStep.placeholder}
        value={answers[currentStep.key]}
        onChange={(event) => updateAnswer(currentStep.key, event.target.value)}
      />
    );
  };

  if (result) {
    const copy = RESULT_COPY[result.type];
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur">
        <div className="background-container" aria-hidden>
          <div className="shape shape1"></div>
          <div className="shape shape2"></div>
          <div className="shape shape3"></div>
        </div>

        <div className="card fullscreen" role="dialog" aria-modal="true">
          <h3 className="text-3xl md:text-4xl font-extrabold text-indigo-400">{copy.title}</h3>
          <div className="mt-6 space-y-4 text-white/80 max-w-2xl mx-auto">
            {copy.body.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
          <div className="mt-8 flex flex-col items-center gap-3">
            {copy.showCalendly && (
              <a
                href="https://calendly.com/personalbrand-wasnot/15-minutes-discovery-call"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-emerald-500 text-slate-950 font-bold py-3 px-8 rounded-lg text-lg hover:bg-emerald-400 transition-shadow shadow-[0_0_25px_rgba(16,185,129,0.3)] uppercase"
              >
                BOOK a call
              </a>
            )}
            {copy.showReset && (
              <button type="button" onClick={() => handleReset(stepConfig.length - 1)} className="rounded-xl border border-white/15 px-4 py-2 text-white/90">
                Change investment amount
              </button>
            )}
            {!copy.showReset && (
              <button type="button" onClick={() => { handleReset(); onClose(); }} className="rounded-xl border border-white/15 px-4 py-2 text-white/90">
                Close
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4 py-10">
      <div
        className="w-full max-w-xl rounded-3xl border border-slate-700/60 bg-slate-900/90 p-8 shadow-2xl"
        onKeyDown={handleCardKeyDown}
        tabIndex={0}
      >
        <div className="mb-2 text-sm text-slate-400">
          Step {step + 1} of {totalSteps}
        </div>
        <h3 className="text-2xl font-semibold text-slate-100">{currentStep.label}</h3>
        {renderField()}

        <div className="mt-8 flex items-center justify-between text-sm text-slate-300">
          <button type="button" onClick={onClose} className="hover:text-white">
            Close
          </button>
          <div className="flex items-center gap-2">
            {step > 0 && (
              <button
                type="button"
                onClick={goPrev}
                className="rounded-full border border-slate-600 px-4 py-2 text-slate-200 hover:border-slate-400"
              >
                Back
              </button>
            )}
            {step < totalSteps - 1 ? (
              <button
                type="button"
                disabled={!canAdvance() || saving}
                onClick={goNext}
                className={`rounded-full px-5 py-2 font-semibold transition ${
                  canAdvance() && !saving
                    ? "bg-indigo-500 text-white hover:bg-indigo-400"
                    : "bg-slate-700 text-slate-400"
                }`}
              >
                Next
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!canAdvance() || saving}
                className={`rounded-full px-5 py-2 font-semibold transition ${
                  canAdvance() && !saving
                    ? "bg-emerald-500 text-slate-950 hover:bg-emerald-400"
                    : "bg-slate-700 text-slate-400"
                }`}
              >
                {saving ? "Submitting..." : "Finish"}
              </button>
            )}
          </div>
        </div>

        {error ? <p className="mt-4 text-sm text-rose-400">{error}</p> : null}
      </div>
    </div>
  );
}
