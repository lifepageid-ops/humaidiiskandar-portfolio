import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, MapPin, Send, CheckCircle2, Clock, AlertCircle } from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "Corporate Recruiter",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Form validation
    if (!formData.name || !formData.email || !formData.message) {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
      return;
    }

    setStatus("loading");

    // Simulate high-end API submission
    setTimeout(() => {
      setStatus("success");
      setFormData({
        name: "",
        email: "",
        role: "Corporate Recruiter",
        subject: "",
        message: "",
      });
    }, 1800);
  };

  return (
    <section
      id="contact"
      className="py-16 sm:py-20 lg:py-24 relative bg-slate-50 dark:bg-slate-950 transition-colors duration-300 overflow-hidden"
    >
      {/* Background glow gradients */}
      <div className="absolute top-[20%] left-[-10%] w-[400px] h-[400px] bg-orange-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[400px] h-[400px] bg-teal-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/40 border border-teal-100/30 dark:border-teal-900/30 mb-4">
            <Clock className="w-3.5 h-3.5 text-teal-500" />
            <span className="text-xs font-bold text-teal-600 dark:text-teal-400 tracking-wider uppercase">
              Direct Channel
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Initiate Collaboration
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base mt-3 max-w-2xl mx-auto leading-relaxed font-normal">
            Connect for corporate recruitment, strategic partnership requests, NGO consultation, or sustainability programs.
          </p>
          <div className="h-1 w-20 bg-gradient-to-r from-orange-500 to-teal-500 mx-auto mt-4 rounded-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          {/* Left Column: Brand Detail Cards (5 columns) */}
          <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
            <div className="space-y-6">
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white leading-tight">
                Let's create sustainable organizational impact together.
              </h3>
              <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
                I am active and ready to contribute immediately to corporate recruitment cycles, CSR frameworks, and Strategic Partnerships. Connect directly through standard channels or leave a structured inquiry.
              </p>

              {/* Channels Cards */}
              <div className="space-y-4">
                {/* Email */}
                <a
                  href="mailto:humaidicreativelabs@gmail.com"
                  className="flex items-center gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-500 dark:hover:border-teal-400 transition-all duration-300 shadow-md group"
                >
                  <div className="p-3.5 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 group-hover:bg-teal-500 group-hover:text-white transition-colors shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">Official Email</p>
                    <p className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white mt-1.5 truncate max-w-[220px] sm:max-w-xs">
                      humaidicreativelabs@gmail.com
                    </p>
                  </div>
                </a>

                {/* WhatsApp */}
                <a
                  href="https://wa.me/6285717306163"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-green-500 dark:hover:border-green-400 transition-all duration-300 shadow-md group"
                >
                  <div className="p-3.5 rounded-xl bg-green-50 dark:bg-green-950/50 text-green-600 dark:text-green-400 group-hover:bg-green-500 group-hover:text-white transition-colors shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">WhatsApp Messenger</p>
                    <p className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white mt-1.5">
                      +62 857-1730-6163
                    </p>
                  </div>
                </a>

                {/* LinkedIn */}
                <a
                  href="https://www.linkedin.com/in/humaidiiskandar"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300 shadow-md group"
                >
                  <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors shrink-0">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">Official LinkedIn</p>
                    <p className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white mt-1.5">
                      linkedin.com/in/humaidiiskandar
                    </p>
                  </div>
                </a>

                {/* Location */}
                <div className="flex items-center gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md">
                  <div className="p-3.5 rounded-xl bg-orange-50 dark:bg-orange-950 text-orange-500 shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">Location & HQ</p>
                    <p className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white mt-1.5">
                      Jakarta, Indonesia
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Response SLA Note */}
            <div className="bg-teal-50/30 dark:bg-teal-950/20 border border-teal-200/10 rounded-2xl p-4 text-xs text-slate-500 dark:text-slate-400 flex items-start gap-2.5 mt-6 lg:mt-0">
              <Clock className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
              <span>
                <strong>Average response SLA:</strong> Under 4 hours for email inquiries, immediate response for WhatsApp calls.
              </span>
            </div>
          </div>

          {/* Right Column: Contact Form (7 columns) */}
          <div className="lg:col-span-7">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl backdrop-blur-md relative">
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                Send Direct Message
                <span className="text-xs font-normal px-2 py-0.5 rounded bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-400">
                  Secure Connection
                </span>
              </h3>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Name */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter full name"
                      className="w-full px-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter email address"
                      className="w-full px-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Role selection */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      I Am A *
                    </label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="w-full px-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all"
                    >
                      <option value="Corporate Recruiter">Corporate Recruiter</option>
                      <option value="Human Capital Director">Human Capital Director</option>
                      <option value="CSR / Sustainability Manager">CSR / Sustainability Manager</option>
                      <option value="NGO Director / Planner">NGO Director / Planner</option>
                      <option value="Strategic Alliance Partner">Strategic Alliance Partner</option>
                      <option value="Other Business Inquiry">Other Business Inquiry</option>
                    </select>
                  </div>

                  {/* Subject */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Subject of Inquiry
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="e.g., Senior CSR Specialist role"
                      className="w-full px-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all"
                    />
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Detailed Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Detail your recruitment needs or partnership proposal..."
                    rows={5}
                    className="w-full px-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all resize-none"
                    required
                  ></textarea>
                </div>

                {/* Notification area */}
                <AnimatePresence mode="wait">
                  {status === "success" && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/30 text-emerald-700 dark:text-emerald-450 flex items-center gap-3 text-sm font-bold"
                    >
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                      Message sent successfully! Humaidi will respond shortly.
                    </motion.div>
                  )}

                  {status === "error" && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-250/20 text-red-600 dark:text-red-400 flex items-center gap-3 text-sm font-bold"
                    >
                      <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                      Please complete all required fields before submitting.
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full relative group px-6 py-4 rounded-2xl font-bold text-sm sm:text-base tracking-wide text-white shadow-xl shadow-teal-500/15 overflow-hidden flex items-center justify-center gap-2 hover:shadow-teal-500/25 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:-translate-y-0 cursor-pointer"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-orange-500 via-teal-500 to-teal-650 transition-transform duration-300 group-hover:scale-105" />
                  <span className="relative flex items-center gap-2">
                    {status === "loading" ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Securing Connection...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" /> Deliver Secure Message
                      </>
                    )}
                  </span>
                </button>
              </form>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}