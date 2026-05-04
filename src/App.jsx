import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  BookOpen,
  Bot,
  GraduationCap,
  LogOut,
  Menu,
  Send,
  Sparkles,
  Trash2,
  UserRound,
  WalletCards,
  X
} from "lucide-react";
import data from "./data/universityData.json";

const quickQuestions = [
  "Who is the faculty for Data Structures?",
  "What is the fee for CSE?",
  "Tell me about cultural activities",
  "Who is the principal?"
];

const initialMessages = [
  {
    id: 1,
    sender: "bot",
    text: "Hi! I am University Query Bot. Ask me about subjects, faculty, fees, leadership, or cultural activities."
  }
];

function normalize(text) {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}

function includesAny(text, words) {
  return words.some((word) => text.includes(word));
}

function wordsOf(text) {
  return normalize(text).split(" ").filter(Boolean);
}

function formatSubject(subject) {
  return `${subject.name} is handled by ${subject.faculty} from ${subject.department}. ${subject.description}`;
}

function formatFee(fee) {
  return `${fee.fullName} (${fee.program}) has an annual fee of ${fee.annualFee}. ${fee.notes}`;
}

function getBotResponse(query) {
  const q = normalize(query);

  if (!q) {
    return "Please type a question, and I will help you find the university information.";
  }

  if (includesAny(q, ["hello", "hi", "hey"])) {
    return `Hello! You can ask about ${data.subjects.length} subjects, faculty members, fee details, the principal, chairman, or campus activities.`;
  }

  if (includesAny(q, ["principal", "head of college"])) {
    const principal = data.leadership.principal;
    return `The principal is ${principal.name}. ${principal.details}`;
  }

  if (includesAny(q, ["chairman", "chairperson", "governing"])) {
    const chairman = data.leadership.chairman;
    return `The chairman is ${chairman.name}. ${chairman.details}`;
  }

  if (includesAny(q, ["cultural", "activity", "activities", "event", "events", "fest", "club"])) {
    return `Cultural activities include ${data.culturalActivities
      .map((activity) => `${activity.name} (${activity.schedule}): ${activity.details}`)
      .join(" ")}`;
  }

  if (includesAny(q, ["fee", "fees", "tuition", "cost"])) {
    const queryWords = new Set(wordsOf(q));
    const match = data.fees.find((fee) => {
      const programCode = fee.program.toLowerCase();
      const fullName = normalize(fee.fullName);
      return queryWords.has(programCode) || q.includes(fullName);
    });

    if (match) {
      return formatFee(match);
    }

    return `Fee structure: ${data.fees.map(formatFee).join(" ")}`;
  }

  const subjectMatch = data.subjects.find((subject) => {
    const names = [subject.name, subject.department, ...subject.aliases].map(normalize);
    return names.some((name) => q.includes(name));
  });

  if (subjectMatch) {
    if (includesAny(q, ["faculty", "teacher", "professor", "who"])) {
      return `${subjectMatch.faculty} is the faculty for ${subjectMatch.name}.`;
    }

    return formatSubject(subjectMatch);
  }

  if (includesAny(q, ["subject", "subjects", "course", "courses", "faculty", "teacher", "professor"])) {
    return `Subjects and faculty: ${data.subjects
      .map((subject) => `${subject.name} - ${subject.faculty}`)
      .join("; ")}.`;
  }

  if (includesAny(q, ["contact", "admission", "office", "email", "phone"])) {
    return `For admissions, email ${data.contacts.admissions}. You can also call the office at ${data.contacts.office}.`;
  }

  return "I could not find an exact match. Try asking about a subject, faculty, principal, chairman, fees, or cultural activities.";
}

function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    onLogin(email || "student@university.edu");
  }

  return (
    <main className="min-h-screen bg-[#eff5f8] px-4 py-8 text-slate-900 sm:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center">
        <section className="grid w-full overflow-hidden rounded-[28px] bg-white shadow-soft lg:grid-cols-[1.05fr_0.95fr]">
          <div className="bg-[#173f5f] p-7 text-white sm:p-10 lg:p-12">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#3caea3]">
                <GraduationCap className="h-6 w-6" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm text-cyan-100">{data.university.name}</p>
                <h1 className="text-2xl font-bold sm:text-3xl">University Query Bot</h1>
              </div>
            </div>

            <div className="mt-14 max-w-xl">
              <p className="text-4xl font-bold leading-tight sm:text-5xl">
                Campus answers, neatly gathered for students.
              </p>
              <p className="mt-5 text-base leading-7 text-cyan-50">
                Login to ask about subjects, assigned faculty, fees, leadership, contacts, and student activities from a single friendly dashboard.
              </p>
            </div>

            <div className="mt-12 grid gap-3 text-sm sm:grid-cols-2">
              {[
                ["Subjects", "Faculty mapped by course"],
                ["Fees", "Program-wise annual details"],
                ["Activities", "Clubs, fests, outreach"],
                ["Leadership", "Principal and chairman info"]
              ].map(([title, body]) => (
                <div key={title} className="rounded-2xl border border-white/15 bg-white/10 p-4">
                  <p className="font-semibold">{title}</p>
                  <p className="mt-1 text-cyan-100">{body}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center p-7 sm:p-10 lg:p-12">
            <form onSubmit={handleSubmit} className="w-full">
              <div className="mb-8">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#3caea3]">Student login</p>
                <h2 className="mt-3 text-3xl font-bold text-slate-950">Welcome back</h2>
                <p className="mt-2 text-slate-600">Use any email and password to enter the demo dashboard.</p>
              </div>

              <label className="block text-sm font-semibold text-slate-700" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="student@university.edu"
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-[#3caea3] focus:bg-white focus:ring-4 focus:ring-teal-100"
              />

              <label className="mt-5 block text-sm font-semibold text-slate-700" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter password"
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-[#3caea3] focus:bg-white focus:ring-4 focus:ring-teal-100"
              />

              <button
                type="submit"
                className="mt-7 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#173f5f] px-5 py-3 font-semibold text-white transition hover:bg-[#102f47] focus:outline-none focus:ring-4 focus:ring-[#173f5f]/20"
              >
                <Sparkles className="h-5 w-5" aria-hidden="true" />
                Login to dashboard
              </button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}

function Sidebar({ open, onClose, onAsk }) {
  const stats = useMemo(
    () => [
      { label: "Subjects", value: data.subjects.length, icon: BookOpen },
      { label: "Programs", value: data.fees.length, icon: WalletCards },
      { label: "Activities", value: data.culturalActivities.length, icon: Sparkles }
    ],
    []
  );

  return (
    <>
      <div
        className={`fixed inset-0 z-30 bg-slate-950/40 transition lg:hidden ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-80 max-w-[86vw] flex-col border-r border-slate-200 bg-white p-5 transition-transform lg:static lg:z-auto lg:w-80 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#173f5f] text-white">
              <Bot className="h-6 w-6" aria-hidden="true" />
            </div>
            <div>
              <p className="font-bold text-slate-950">Query Bot</p>
              <p className="text-sm text-slate-500">University assistant</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-10 w-10 place-items-center rounded-full text-slate-600 transition hover:bg-slate-100 lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-2">
          {stats.map(({ label, value, icon: Icon }) => (
            <div key={label} className="rounded-2xl bg-[#eef7f6] p-3 text-center">
              <Icon className="mx-auto h-5 w-5 text-[#17766f]" aria-hidden="true" />
              <p className="mt-2 text-lg font-bold text-slate-950">{value}</p>
              <p className="text-xs text-slate-600">{label}</p>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <p className="text-sm font-semibold text-slate-700">Suggested questions</p>
          <div className="mt-3 space-y-2">
            {quickQuestions.map((question) => (
              <button
                key={question}
                type="button"
                onClick={() => onAsk(question)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left text-sm text-slate-700 transition hover:border-[#3caea3] hover:bg-[#f2fbfa]"
              >
                {question}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-auto rounded-2xl bg-[#fff8ea] p-4 text-sm text-slate-700">
          <p className="font-semibold text-slate-950">{data.university.name}</p>
          <p className="mt-1">{data.university.tagline}</p>
        </div>
      </aside>
    </>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-2 rounded-2xl rounded-bl-md bg-white px-4 py-3 shadow-sm ring-1 ring-slate-200">
      <span className="h-2 w-2 animate-bounce rounded-full bg-[#3caea3]" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-[#3caea3] [animation-delay:120ms]" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-[#3caea3] [animation-delay:240ms]" />
    </div>
  );
}

function Dashboard({ userEmail, onLogout }) {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  function askBot(question) {
    const trimmed = question.trim();
    if (!trimmed || isTyping) return;

    const userMessage = {
      id: Date.now(),
      sender: "user",
      text: trimmed
    };

    setMessages((current) => [...current, userMessage]);
    setInput("");
    setSidebarOpen(false);
    setIsTyping(true);

    window.setTimeout(() => {
      setMessages((current) => [
        ...current,
        {
          id: Date.now() + 1,
          sender: "bot",
          text: getBotResponse(trimmed)
        }
      ]);
      setIsTyping(false);
    }, 700);
  }

  function handleSubmit(event) {
    event.preventDefault();
    askBot(input);
  }

  return (
    <main className="flex h-screen overflow-hidden bg-[#f6f8fb] text-slate-900">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} onAsk={askBot} />

      <section className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-slate-700 transition hover:bg-slate-100 lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>
            <div className="min-w-0">
              <h1 className="truncate text-lg font-bold text-slate-950 sm:text-2xl">University Query Bot</h1>
              <p className="truncate text-sm text-slate-500">Ask once. Get campus information instantly.</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-sm text-slate-700 sm:flex">
              <UserRound className="h-4 w-4" aria-hidden="true" />
              <span className="max-w-48 truncate">{userEmail}</span>
            </div>
            <button
              type="button"
              onClick={onLogout}
              className="grid h-10 w-10 place-items-center rounded-full text-slate-600 transition hover:bg-slate-100"
              aria-label="Logout"
              title="Logout"
            >
              <LogOut className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </header>

        <div className="flex min-h-0 flex-1 flex-col">
          <div className="chat-scroll min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6">
            <div className="mx-auto flex max-w-4xl flex-col gap-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[88%] rounded-3xl px-4 py-3 text-sm leading-6 shadow-sm sm:max-w-[72%] sm:text-base ${
                      message.sender === "user"
                        ? "rounded-br-md bg-[#173f5f] text-white"
                        : "rounded-bl-md bg-white text-slate-750 ring-1 ring-slate-200"
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <TypingIndicator />
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <div className="border-t border-slate-200 bg-white px-4 py-4 sm:px-6">
            <div className="mx-auto max-w-4xl">
              <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
                {quickQuestions.slice(0, 3).map((question) => (
                  <button
                    key={question}
                    type="button"
                    onClick={() => askBot(question)}
                    className="shrink-0 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700 transition hover:border-[#3caea3] hover:bg-[#f2fbfa]"
                  >
                    {question}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="flex items-end gap-2">
                <button
                  type="button"
                  onClick={() => setMessages(initialMessages)}
                  className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-slate-200 text-slate-600 transition hover:bg-slate-50"
                  aria-label="Clear chat"
                  title="Clear chat"
                >
                  <Trash2 className="h-5 w-5" aria-hidden="true" />
                </button>
                <input
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder="Ask about faculty, CSE fees, principal, events..."
                  className="min-h-12 flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-[#3caea3] focus:bg-white focus:ring-4 focus:ring-teal-100"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#3caea3] text-white transition hover:bg-[#27877f] disabled:cursor-not-allowed disabled:bg-slate-300"
                  aria-label="Send message"
                  title="Send"
                >
                  <Send className="h-5 w-5" aria-hidden="true" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function App() {
  const [userEmail, setUserEmail] = useState("");

  if (!userEmail) {
    return <LoginPage onLogin={setUserEmail} />;
  }

  return <Dashboard userEmail={userEmail} onLogout={() => setUserEmail("")} />;
}
