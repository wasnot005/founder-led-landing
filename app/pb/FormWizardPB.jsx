'use client'

import { useRef, useState } from "react";
import { supabase } from "../lib/supabase";
import "./pb.css";

const initialAnswers = {
  name: "",
  email: "",
  phone: "",
  instagramUrl: "",
  investment: "",
};

const stepConfig = [
  {
    key: "name",
    label: "What's your name?",
    helper: "We love knowing who we're speaking with.",
    type: "text",
    placeholder: "e.g., Suresh Malani",
  },
  {
    key: "email",
    label: "Work email",
    helper: "We'll share your personalised content roadmap here.",
    type: "email",
    placeholder: "you@company.com",
  },
  {
    key: "phone",
    label: "Phone / WhatsApp",
    helper: "Include your country code so we can reach you easily.",
    type: "text",
    placeholder: "+91 98xxxxxxx",
  },
  {
    key: "instagramUrl",
    label: "Main Instagram profile",
    helper: "Drop your @handle or a link—we'll review it before the call.",
    type: "text",
    placeholder: "@yourhandle or profile URL",
  },
  {
    key: "investment",
    label: "Monthly investment you can commit",
    helper: "Choose the tier that reflects your growth budget right now.",
    type: "radio",
    options: ["Under $500", "$500 – $1,000", "$1,000 – $5,000", "$5,000+"],
  },
];

const RESULT_COPY = {
  not_qualified: {
    emoji: "🙏",
    heading: "Thanks For Reaching Out",
    body: [
      "We currently partner with campaigns investing $500 or more each month.",
      "Update your investment amount to continue, or revisit once you are ready to scale.",
    ],
    showCalendly: false,
    secondary: { label: "Change Investment Amount", type: "reset" },
  },
  qualified_basic: {
    emoji: "🎉",
    heading: "You've Been Pre Qualified!",
    body: [
      "You are a strong fit for our starter tier and we will keep your details on file.",
      "Want to move faster? Boost your monthly investment and we can open the full system for you.",
    ],
    showCalendly: true,
    secondary: { label: "Change Investment Amount", type: "reset" },
  },
  qualified_full: {
    emoji: "🚀",
    heading: "You're In!",
    body: [
      "Your profile lines up perfectly with Social SEO and we are ready to set a measurable reach target.",
      "Book a slot so we can map month one and lock your custom guarantee.",
    ],
    showCalendly: true,
    secondary: { label: "Close", type: "close" },
  },
};

export default function FormWizardPB({ onClose, onQualified }) {
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

    const tierMap = {
      "Under $500": "none",
      "$500 – $1,000": "basic",
      "$1,000 – $5,000": "full",
      "$5,000+": "full",
    };
    const tier = tierMap[answers.investment] ?? "none";

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
          instagram_url: answers.instagramUrl,
          investment: answers.investment,
        });

      if (insertError) throw insertError;
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

  const handleSecondary = (action) => {
    if (action.type === "reset") {
      setResult(null);
      setError(null);
      setStep(stepConfig.length - 1);
      return;
    }

    if (action.type === "close") {
      setResult(null);
      onClose();
    }
  };

  const renderField = () => {
    if (currentStep.type === "radio") {
      return (
        <div className="mt-6 space-y-4">
          {currentStep.options.map((option) => (
            <label
              key={option}
              className={`group flex items-center justify-between rounded-2xl border px-4 py-3 text-base backdrop-blur transition ${
                answers[currentStep.key] === option
                  ? "border-indigo-400/70 bg-indigo-500/15 text-white"
                  : "border-white/10 bg-white/5 text-white/85 hover:border-indigo-300/40"
              }`}
            >
              <span className="font-medium">{option}</span>
              <input
                type="radio"
                name={currentStep.key}
                checked={answers[currentStep.key] === option}
                onChange={() => updateAnswer(currentStep.key, option)}
                className="h-4 w-4 accent-indigo-500"
              />
            </label>
          ))}
        </div>
      );
    }

    return (
      <input
        ref={inputRef}
        autoFocus
        className="mt-6 w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-base text-white outline-none backdrop-blur transition focus:border-indigo-300 focus:bg-white/10"
        type={currentStep.type}
        placeholder={currentStep.placeholder}
        value={answers[currentStep.key]}
        onChange={(event) => updateAnswer(currentStep.key, event.target.value)}
      />
    );
  };

  if (result) {
    const state = RESULT_COPY[result.type];
    return (
      <div className="pb-overlay">
        <div className="pb-result-card">
          <div className="pb-result-emoji" aria-hidden>{state.emoji}</div>
          <h3 className="pb-result-title">{state.heading}</h3>
          <div className="pb-result-body">
            {state.body.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
          <div className="pb-result-actions">
            {state.showCalendly && (
              <a
                href="https://calendly.com/personalbrand-wasnot/15-minutes-discovery-call"
                target="_blank"
                rel="noopener noreferrer"
                className="pb-result-cta"
              >
                Apply now
              </a>
            )}
            {state.secondary && (
              <button
                type="button"
                onClick={() => handleSecondary(state.secondary)}
                className="pb-result-secondary"
              >
                {state.secondary.label}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-overlay">
      <div className="pb-shapes" aria-hidden>
        <div className="pb-shape pb-shape-1" />
        <div className="pb-shape pb-shape-2" />
        <div className="pb-shape pb-shape-3" />
      </div>
      <div
        className="pb-card"
        onKeyDown={handleCardKeyDown}
        tabIndex={0}
      >
        <div className="pb-step">Step {step + 1} of {totalSteps}</div>
        <h3 className="pb-question">{currentStep.label}</h3>
        {currentStep.helper ? <p className="pb-helper">{currentStep.helper}</p> : null}
        {renderField()}

        <div className="pb-actions">
          <button type="button" onClick={onClose} className="pb-link">Close</button>
          <div className="pb-buttons">
            {step > 0 && (
              <button type="button" onClick={goPrev} className="pb-secondary">
                Back
              </button>
            )}
            {step < totalSteps - 1 ? (
              <button
                type="button"
                disabled={!canAdvance() || saving}
                onClick={goNext}
                className={`pb-primary ${(!canAdvance() || saving) ? 'pb-primary--disabled' : ''}`}
              >
                Next
              </button>
            ) : (
              <button
                type="button"
                disabled={!canAdvance() || saving}
                onClick={handleSubmit}
                className={`pb-primary ${(!canAdvance() || saving) ? 'pb-primary--disabled' : ''}`}
              >
                {saving ? "Submitting..." : "Finish"}
              </button>
            )}
          </div>
        </div>

        {error ? <p className="pb-error">{error}</p> : null}
      </div>
    </div>
  );
}
