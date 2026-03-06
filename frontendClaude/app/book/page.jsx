"use client";
import { useState } from "react";
import { Calendar, Check, Wrench, Clock } from "lucide-react";

const SERVICES = [
  { id: "fitting",    label: "Tyre Fitting",     icon: "🔩", duration: "30–60 min" },
  { id: "alignment",  label: "Wheel Alignment",   icon: "⚙️", duration: "45–60 min" },
  { id: "rim",        label: "Rim Renovation",    icon: "✨", duration: "1–2 days" },
  { id: "hotel",      label: "Tyre Hotel Storage",icon: "🏨", duration: "Seasonal" },
  { id: "inspection", label: "Tyre Inspection",   icon: "🔍", duration: "15–20 min" },
];

const TIME_SLOTS = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
  "11:00", "11:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30",
];

export default function BookPage() {
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [form, setForm] = useState({ name: "", email: "", phone: "", vehicle: "", notes: "" });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  function canProceed() {
    if (step === 1) return !!selectedService;
    if (step === 2) return !!selectedDate && !!selectedTime;
    if (step === 3) return form.name && form.email && form.phone;
    return true;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1200)); // Simulate API call
    setSubmitted(true);
    setSubmitting(false);
  }

  // Success
  if (submitted) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center px-6">
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: "#F5C518" }}>
            <Check size={36} color="#000" />
          </div>
          <h1 className="heading-display text-4xl mb-3">Appointment Booked!</h1>
          <p className="font-body text-base-content/60 mb-2">
            <strong className="text-base-content">{form.name}</strong>, your appointment for{" "}
            <strong className="text-brand-yellow">{SERVICES.find(s => s.id === selectedService)?.label}</strong>{" "}
            is confirmed.
          </p>
          <p className="font-body text-base-content/50 text-sm mb-2">
            📅 {selectedDate} at {selectedTime}
          </p>
          <p className="font-body text-base-content/50 text-sm mb-8">
            We&apos;ll send a confirmation to <strong>{form.email}</strong>.
          </p>
          <button
            className="btn font-display tracking-widest uppercase"
            style={{ background: "#F5C518", color: "#000", border: "none" }}
            onClick={() => { setSubmitted(false); setStep(1); setSelectedService(""); setSelectedDate(""); setSelectedTime(""); setForm({ name: "", email: "", phone: "", vehicle: "", notes: "" }); }}
          >
            Book Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100">
      {/* Header */}
      <div className="bg-base-200 border-b border-base-300 px-6 md:px-10 py-10 max-w-[1440px] mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-px w-8" style={{ background: "#F5C518" }} />
          <span className="text-xs font-body uppercase tracking-[0.2em] text-brand-yellow">
            Workshop
          </span>
        </div>
        <h1 className="heading-display text-4xl md:text-5xl">
          Book an <span style={{ color: "#F5C518" }}>Appointment</span>
        </h1>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-12">
        {/* Progress steps */}
        <ul className="steps w-full mb-10 font-body text-xs">
          {["Service", "Date & Time", "Your Details"].map((s, i) => (
            <li key={s} className={`step ${step > i ? "step-primary" : ""}`} style={step > i ? { "--p": "oklch(0.865 0.218 83.49)" } : {}}>
              {s}
            </li>
          ))}
        </ul>

        {/* Step 1: Service */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="heading-display text-2xl mb-6">Select a Service</h2>
            {SERVICES.map((svc) => (
              <button
                key={svc.id}
                type="button"
                onClick={() => setSelectedService(svc.id)}
                className={`w-full card border transition-all text-left ${
                  selectedService === svc.id
                    ? "border-brand-yellow bg-base-200"
                    : "border-base-300 bg-base-200 hover:border-base-content/30"
                }`}
              >
                <div className="card-body p-4 flex-row items-center gap-4">
                  <span className="text-2xl">{svc.icon}</span>
                  <div className="flex-1">
                    <p className="font-display font-bold uppercase tracking-wide">{svc.label}</p>
                    <p className="text-xs font-body text-base-content/50 flex items-center gap-1 mt-0.5">
                      <Clock size={11} /> {svc.duration}
                    </p>
                  </div>
                  {selectedService === svc.id && (
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "#F5C518" }}>
                      <Check size={12} color="#000" />
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Step 2: Date + Time */}
        {step === 2 && (
          <div className="space-y-6">
            <h2 className="heading-display text-2xl mb-6">Pick a Date & Time</h2>

            <div className="form-control">
              <label className="label">
                <span className="label-text text-xs font-body uppercase tracking-wider text-base-content/50">
                  Date
                </span>
              </label>
              <input
                type="date"
                className="input input-bordered font-body"
                value={selectedDate}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>

            <div>
              <p className="text-xs font-body uppercase tracking-wider text-base-content/50 mb-3">
                Available Time Slots
              </p>
              <div className="grid grid-cols-4 gap-2">
                {TIME_SLOTS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setSelectedTime(t)}
                    className={`btn btn-sm font-mono font-semibold transition-all ${
                      selectedTime === t ? "text-black" : "btn-ghost border border-base-300"
                    }`}
                    style={selectedTime === t ? { background: "#F5C518", border: "1px solid #F5C518" } : {}}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Details */}
        {step === 3 && (
          <form id="book-form" onSubmit={handleSubmit} className="space-y-4">
            <h2 className="heading-display text-2xl mb-6">Your Details</h2>

            <div className="grid grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label py-1"><span className="label-text text-xs font-body uppercase tracking-wider text-base-content/50">Full Name <span className="text-error">*</span></span></label>
                <input type="text" name="name" required className="input input-bordered input-sm font-body" value={form.name} onChange={handleChange} />
              </div>
              <div className="form-control">
                <label className="label py-1"><span className="label-text text-xs font-body uppercase tracking-wider text-base-content/50">Phone <span className="text-error">*</span></span></label>
                <input type="tel" name="phone" required className="input input-bordered input-sm font-body" value={form.phone} onChange={handleChange} />
              </div>
            </div>

            <div className="form-control">
              <label className="label py-1"><span className="label-text text-xs font-body uppercase tracking-wider text-base-content/50">Email <span className="text-error">*</span></span></label>
              <input type="email" name="email" required className="input input-bordered input-sm font-body" value={form.email} onChange={handleChange} />
            </div>

            <div className="form-control">
              <label className="label py-1"><span className="label-text text-xs font-body uppercase tracking-wider text-base-content/50">Vehicle (make, model, year)</span></label>
              <input type="text" name="vehicle" placeholder="e.g. Volvo XC60 2021" className="input input-bordered input-sm font-body" value={form.vehicle} onChange={handleChange} />
            </div>

            <div className="form-control">
              <label className="label py-1"><span className="label-text text-xs font-body uppercase tracking-wider text-base-content/50">Notes</span></label>
              <textarea name="notes" className="textarea textarea-bordered textarea-sm font-body h-20" value={form.notes} onChange={handleChange} placeholder="Any special requests…" />
            </div>

            {/* Summary */}
            <div className="bg-base-200 rounded-xl p-4 border border-base-300 text-sm font-body space-y-1.5">
              <p className="text-xs uppercase tracking-widest text-base-content/50 mb-2">Booking Summary</p>
              <p><span className="text-base-content/60">Service:</span> <strong>{SERVICES.find(s => s.id === selectedService)?.label}</strong></p>
              <p><span className="text-base-content/60">Date:</span> <strong>{selectedDate}</strong></p>
              <p><span className="text-base-content/60">Time:</span> <strong>{selectedTime}</strong></p>
            </div>
          </form>
        )}

        {/* Navigation buttons */}
        <div className="flex justify-between mt-8 pt-6 border-t border-base-300">
          {step > 1 ? (
            <button className="btn btn-ghost font-body normal-case" onClick={() => setStep(step - 1)}>
              ← Back
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              className="btn font-display tracking-widest uppercase gap-2"
              style={canProceed() ? { background: "#F5C518", color: "#000", border: "none" } : {}}
              disabled={!canProceed()}
              onClick={() => setStep(step + 1)}
            >
              Next →
            </button>
          ) : (
            <button
              type="submit"
              form="book-form"
              disabled={!canProceed() || submitting}
              className="btn font-display tracking-widest uppercase"
              style={canProceed() ? { background: "#F5C518", color: "#000", border: "none" } : {}}
            >
              {submitting ? <span className="loading loading-spinner loading-sm" /> : "Confirm Booking ✓"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
