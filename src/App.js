import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle, Beaker, ChevronDown, Coffee, Dumbbell, Info, Languages, Lock,
  Plus, RotateCcw, Search, ShieldCheck, Sparkles, X, Droplets, Upload,
  ClipboardPaste, TrendingUp, SlidersHorizontal, Camera, Scan, Check,
  ChevronUp, Star, Save, Edit, Trash2,
} from "lucide-react";
import {
  CartesianGrid, ResponsiveContainer, Scatter, ScatterChart,
  Tooltip as RechartsTooltip, XAxis, YAxis, Radar, RadarChart,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from "recharts";

// ✅ Импорт API (шаг 1)
import {
  fetchWaters,
  createWater,
  updateWater,
  deleteWater,
  importWaters,
  login as apiLogin,
  logout as apiLogout,
  isAuthenticated,
} from "./api";

// ============== UI КОМПОНЕНТЫ ==============
const Button = ({ children, variant, className, onClick, disabled, type = "button" }) => (
  <button
    type={type}
    className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl font-medium text-sm sm:text-base transition-all transform active:scale-95 ${
      variant === "outline"
        ? "border border-white/60 bg-white/70 hover:bg-white text-slate-800"
        : "bg-slate-900 text-white hover:bg-slate-800"
    } ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
    onClick={onClick}
    disabled={disabled}
  >
    {children}
  </button>
);

const GlassCard = ({ className, children, onClick, isSelected }) => (
  <div
    onClick={onClick}
    className={`rounded-2xl sm:rounded-3xl border border-white/60 bg-white/55 shadow-[0_16px_50px_-36px_rgba(15,23,42,0.55)] backdrop-blur transition-all duration-200 ${
      isSelected ? "ring-2 ring-sky-400 shadow-lg transform scale-[1.02]" : "hover:shadow-md hover:scale-[1.01] cursor-pointer"
    } ${className}`}
  >
    {children}
  </div>
);

const TabsContext = React.createContext({});
const Tabs = ({ value, onValueChange, children }) => (
  <TabsContext.Provider value={{ value, onValueChange }}>
    <div className="tabs">{children}</div>
  </TabsContext.Provider>
);

const TabsList = ({ className, children }) => (
  <div className={`flex gap-1 sm:gap-2 p-1 rounded-xl sm:rounded-2xl ${className}`}>{children}</div>
);

const TabsTrigger = ({ value, disabled, children }) => {
  const { value: selectedValue, onValueChange } = React.useContext(TabsContext);
  const isSelected = selectedValue === value;
  return (
    <button
      className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all ${
        isSelected ? "bg-white shadow-sm" : "hover:bg-white/50"
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      onClick={() => !disabled && onValueChange(value)}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

const TabsContent = ({ value, className, children }) => {
  const { value: selectedValue } = React.useContext(TabsContext);
  if (selectedValue !== value) return null;
  return <div className={className}>{children}</div>;
};

const TooltipProvider = ({ children }) => <div>{children}</div>;
const Tooltip = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="relative inline-block">
      {React.Children.map(children, (child) => {
        if (child.type === TooltipTrigger) {
          return React.cloneElement(child, {
            onMouseEnter: () => setIsOpen(true),
            onMouseLeave: () => setIsOpen(false),
          });
        }
        if (child.type === TooltipContent) return isOpen ? child : null;
        return child;
      })}
    </div>
  );
};
const TooltipTrigger = ({ asChild, children, ...props }) => (
  <div className="inline-block" {...props}>{children}</div>
);
const TooltipContent = ({ className, children }) => (
  <div className={`absolute z-50 mt-1 px-2 sm:px-3 py-1.5 sm:py-2 text-xs bg-white rounded-xl shadow-lg border border-white/60 ${className}`}>
    {children}
  </div>
);

const DropdownMenu = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="relative inline-block">
      {React.Children.map(children, (child) => {
        if (child.type === DropdownMenuTrigger) {
          return React.cloneElement(child, { onClick: () => setIsOpen(!isOpen) });
        }
        if (child.type === DropdownMenuContent) {
          return isOpen ? React.cloneElement(child, { onClose: () => setIsOpen(false) }) : null;
        }
        return child;
      })}
    </div>
  );
};
const DropdownMenuTrigger = ({ asChild, children, onClick }) => <div onClick={onClick}>{children}</div>;
const DropdownMenuContent = ({ className, children, onClose }) => {
  const ref = React.useRef();
  React.useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);
  return (
    <div ref={ref} className={`absolute z-50 mt-2 bg-white rounded-xl sm:rounded-2xl shadow-xl border border-white/60 ${className}`}>
      {React.Children.map(children, (child) => {
        if (child.type === DropdownMenuItem) {
          return React.cloneElement(child, { onClick: (e) => { child.props.onClick?.(e); onClose(); } });
        }
        return child;
      })}
    </div>
  );
};
const DropdownMenuItem = ({ onClick, children }) => (
  <div className="px-3 sm:px-4 py-2 hover:bg-slate-100 cursor-pointer text-sm" onClick={onClick}>{children}</div>
);
const DropdownMenuLabel = ({ children }) => <div className="px-3 sm:px-4 py-2 text-sm font-semibold">{children}</div>;
const DropdownMenuSeparator = () => <hr className="border-white/60" />;

const DialogContext = React.createContext({});
const Dialog = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  return <DialogContext.Provider value={{ isOpen, setIsOpen }}><div>{children}</div></DialogContext.Provider>;
};
const DialogTrigger = ({ asChild, children }) => {
  const { setIsOpen } = React.useContext(DialogContext);
  return <div onClick={() => setIsOpen(true)}>{children}</div>;
};
const DialogContent = ({ className, children }) => {
  const { isOpen, setIsOpen } = React.useContext(DialogContext);
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/20 backdrop-blur-sm">
      <div className={`bg-white rounded-2xl sm:rounded-3xl border border-white/60 shadow-xl max-w-[95vw] sm:max-w-2xl w-full max-h-[90vh] overflow-auto ${className}`}>
        <div className="sticky top-0 flex justify-end p-2 bg-white/80 backdrop-blur">
          <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-slate-100 rounded-full"><X className="h-5 w-5" /></button>
        </div>
        {children}
      </div>
    </div>
  );
};
const DialogHeader = ({ children }) => <div className="p-4 sm:p-6 pb-2">{children}</div>;
const DialogTitle = ({ children }) => <div className="text-base sm:text-lg font-semibold">{children}</div>;

const Input = ({ className, ...props }) => (
  <input className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl border border-white/60 bg-white/70 focus:outline-none focus:ring-2 focus:ring-sky-200 text-sm ${className}`} {...props} />
);
const Textarea = ({ className, ...props }) => (
  <textarea className={`px-3 sm:px-4 py-2 rounded-xl sm:rounded-2xl border border-white/60 bg-white/70 focus:outline-none focus:ring-2 focus:ring-sky-200 text-sm ${className}`} {...props} />
);
const Slider = ({ value, onValueChange, min, max, step }) => (
  <input type="range" min={min} max={max} step={step} value={value[0]} onChange={(e) => onValueChange([parseInt(e.target.value)])} className="w-full" />
);
// ============== ТЕМА ==============
const GLASS = {
  page: "min-h-screen bg-[radial-gradient(1200px_600px_at_20%_0%,rgba(56,189,248,0.18),transparent_60%),radial-gradient(900px_500px_at_90%_10%,rgba(34,197,94,0.12),transparent_60%),radial-gradient(1100px_700px_at_50%_100%,rgba(168,85,247,0.10),transparent_60%)] bg-slate-50 text-slate-900",
  card: "rounded-2xl sm:rounded-3xl border border-white/60 bg-white/55 shadow-[0_16px_50px_-36px_rgba(15,23,42,0.55)] backdrop-blur",
  chip: "rounded-xl sm:rounded-2xl border border-white/60 bg-white/60 shadow-[0_12px_30px_-28px_rgba(15,23,42,0.6)] backdrop-blur",
  subtle: "rounded-xl sm:rounded-2xl border border-white/55 bg-white/45 shadow-[0_12px_38px_-34px_rgba(15,23,42,0.6)] backdrop-blur",
};

const CHART_COLORS = ["#38BDF8", "#34D399", "#FBBF24", "#FB7185", "#A78BFA"];
const LangCtx = React.createContext("ru");
const ADMIN_PATH = "/admin";

const I18N = {
  ru: {
    appName: "Water Expert", tagline: "Сравнение 1–5 вод",
    screenA: "Выбор", screenB: "Сравнение", screenC: "Отчёт", screenD: "Чередование",
    profileLabel: "Профиль", modeLabel: "Режим", langLabel: "Язык",
    modes: { consumer: "Пользователь", pro: "Pro" },
    profiles: { Everyday: "Ежедневный", Sport: "Спорт", Kid: "Детский", Sensitive: "Чувствительный ЖКТ" },
    actions: { compare: "Сравнить", clear: "Очистить", add: "Добавить", remove: "Убрать", import: "Импорт", apply: "Применить" },
    searchPlaceholder: "Поиск бренда (Evian, Borjomi, Архыз…)",
    selected: "Выбрано", limitHint: "Максимум 5 вод для честного сравнения",
    filters: { title: "Фильтры", group: "Группа", all: "Все", russia: "Россия", europe: "Европа", therapeutic: "Лечебные", onlyVerified: "Только Verified", tdsTo: "TDS до" },
    chart: { title: "pH vs минерализация (TDS)", x: "Минерализация (TDS), мг/л", y: "pH" },
    report: { title: "Отчёт", bestDaily: "Лучший выбор для ежедневного употребления", compact: "Компактно", expanded: "Развернуто", profilesBlock: "Профили вод", dataPenalty: "" },
    rotation: { title: "План чередования", hint: "", day: "День", water: "Вода" },
    badges: { daily: "Ежедневная", rotate: "Чередовать", therapeutic: "Лечебная", unknown: "Неизвестно" },
    categoryHelp: { Daily: "Подходит для ежедневного употребления", Rotate: "Лучше чередовать", Therapeutic: "Лечебная вода", Unknown: "Недостаточно данных" },
    achievements: { daily: "Ежедневная", therapeutic: "Лечебная", sport: "Спорт", coffee: "Кофе", sparkling: "С газом", still: "Без газа" },
    misc: { dataCoverage: "Данные", empty: "Ничего не выбрано", max5: "Макс 5", notEnough: "Выберите минимум 2 воды", openPicker: "Выбрать бренды", missingMin: "Нет минимальных показателей", okMin: "Минимум OK" },
    table: { title: "Таблица показателей", metric: "Показатель", ref: "Эталон", unit: "Ед." },
    import: { title: "Импорт базы", hint: "Вставьте CSV или JSON", placeholder: "Вставьте данные…", parse: "Импортировать", bad: "Ошибка формата", done: "Импорт завершён" },
    score: { title: "Рейтинг", coverage: "Заполненность" },
    metricBands: { daily: "Близко к эталону", rotate: "Заметное отклонение", therapeutic: "Сильное отклонение", unknown: "Нет данных" },
  },
  en: {
    appName: "Water Expert", tagline: "Compare 1–5 waters",
    screenA: "Pick", screenB: "Compare", screenC: "Report", screenD: "Rotation",
    profileLabel: "Profile", modeLabel: "Mode", langLabel: "Language",
    modes: { consumer: "Consumer", pro: "Pro" },
    profiles: { Everyday: "Everyday", Sport: "Sport", Kid: "Kids", Sensitive: "Sensitive stomach" },
    actions: { compare: "Compare", clear: "Clear", add: "Add", remove: "Remove", import: "Import", apply: "Apply" },
    searchPlaceholder: "Search brand…",
    selected: "Selected", limitHint: "Max 5 waters",
    filters: { title: "Filters", group: "Group", all: "All", russia: "Russia", europe: "Europe", therapeutic: "Therapeutic", onlyVerified: "Verified only", tdsTo: "TDS max" },
    chart: { title: "pH vs TDS", x: "TDS, mg/L", y: "pH" },
    report: { title: "Report", bestDaily: "Best for everyday use", compact: "Compact", expanded: "Expanded", profilesBlock: "Profiles", dataPenalty: "" },
    rotation: { title: "Rotation plan", hint: "", day: "Day", water: "Water" },
    badges: { daily: "Daily", rotate: "Rotate", therapeutic: "Therapeutic", unknown: "Unknown" },
    categoryHelp: { Daily: "Suitable for everyday", Rotate: "Better to rotate", Therapeutic: "Therapeutic water", Unknown: "Not enough data" },
    achievements: { daily: "Daily", therapeutic: "Therapeutic", sport: "Sport", coffee: "Coffee", sparkling: "Sparkling", still: "Still" },
    misc: { dataCoverage: "Coverage", empty: "Nothing selected", max5: "Max 5", notEnough: "Select at least 2 waters", openPicker: "Open picker", missingMin: "Missing metrics", okMin: "Minimum OK" },
    table: { title: "Metrics table", metric: "Metric", ref: "Reference", unit: "Unit" },
    import: { title: "Import dataset", hint: "Paste CSV or JSON", placeholder: "Paste data…", parse: "Import", bad: "Bad format", done: "Import complete" },
    score: { title: "Score", coverage: "Coverage" },
    metricBands: { daily: "Close to reference", rotate: "Noticeable deviation", therapeutic: "Strong deviation", unknown: "No data" },
  },
};

const REF = { ca: 800, mg: 375, k: 2000, na: 1500, cl: 800, ph: 7.4, tds: 300 };

const EDUCATION = {
  ca: { titleRU: "Кальций (Ca²⁺)", titleEN: "Calcium (Ca²⁺)", shortRU: "Минерал для костей", shortEN: "Bones mineral", ref: REF.ca, unitRU: "мг/сутки", unitEN: "mg/day" },
  mg: { titleRU: "Магний (Mg²⁺)", titleEN: "Magnesium (Mg²⁺)", shortRU: "Для нервной системы", shortEN: "For nerves", ref: REF.mg, unitRU: "мг/сутки", unitEN: "mg/day" },
  k: { titleRU: "Калий (K⁺)", titleEN: "Potassium (K⁺)", shortRU: "Для сердца", shortEN: "For heart", ref: REF.k, unitRU: "мг/сутки", unitEN: "mg/day" },
  na: { titleRU: "Натрий (Na⁺)", titleEN: "Sodium (Na⁺)", shortRU: "Влияет на давление", shortEN: "Affects pressure", ref: REF.na, unitRU: "мг/сутки", unitEN: "mg/day" },
  cl: { titleRU: "Хлориды (Cl⁻)", titleEN: "Chloride (Cl⁻)", shortRU: "Электролитный баланс", shortEN: "Electrolytes", ref: REF.cl, unitRU: "мг/сутки", unitEN: "mg/day" },
  ph: { titleRU: "pH", titleEN: "pH", shortRU: "Кислотность", shortEN: "Acidity", ref: REF.ph, unitRU: "", unitEN: "" },
  tds: { titleRU: "Минерализация", titleEN: "TDS", shortRU: "Сумма веществ", shortEN: "Dissolved solids", ref: REF.tds, unitRU: "мг/л", unitEN: "mg/L" },
};

// ============== УТИЛИТЫ ==============
function clamp(n, a, b) { return Math.max(a, Math.min(b, n)); }
function fmt(n, digits = 0) { if (n === null || n === undefined || Number.isNaN(n)) return "—"; return Number(n).toFixed(digits); }
function safeCountryFlag(code) { const cc = (code ?? "").trim().toUpperCase(); if (!/^[A-Z]{2}$/.test(cc)) return "🌍"; const A = 0x1f1e6; return String.fromCodePoint(A + (cc.charCodeAt(0) - 65), A + (cc.charCodeAt(1) - 65)); }
function parseNumLoose(v) { const s = String(v ?? "").trim().replace(",", "."); if (!s) return null; const n = Number(s); return Number.isFinite(n) ? n : null; }
function toBoolLoose(v) { const s = String(v ?? "").trim().toLowerCase(); if (!s) return null; if (["1","true","yes","да","y"].includes(s)) return true; if (["0","false","no","нет","n"].includes(s)) return false; return null; }

function dataCoverage(w) {
  const keys = ["ca", "mg", "k", "na", "cl", "ph", "tds"];
  const present = {
    ca: w.ca_mg_l !== null && w.ca_mg_l !== undefined,
    mg: w.mg_mg_l !== null && w.mg_mg_l !== undefined,
    k: w.k_mg_l !== null && w.k_mg_l !== undefined,
    na: w.na_mg_l !== null && w.na_mg_l !== undefined,
    cl: w.cl_mg_l !== null && w.cl_mg_l !== undefined,
    ph: w.ph !== null && w.ph !== undefined,
    tds: w.tds_mg_l !== null && w.tds_mg_l !== undefined,
  };
  const count = keys.reduce((acc, k) => acc + (present[k] ? 1 : 0), 0);
  return { count, total: keys.length, present };
}

function hasMinimumMetrics(w) {
  return Boolean(w.ph !== null && w.tds_mg_l !== null && w.ca_mg_l !== null && w.mg_mg_l !== null && w.na_mg_l !== null && w.cl_mg_l !== null);
}

// Нормализация записи из БД
function normalizeWaterFromDB(w) {
  return {
    id: w.id,
    brand_name: w.brand_name,
    country_code: w.country_code,
    flag_emoji: w.flag_emoji ?? safeCountryFlag(w.country_code),
    group: w.group ?? "Europe",
    category: w.category ?? "Unknown",
    ph: w.ph !== null && w.ph !== undefined ? Number(w.ph) : null,
    tds_mg_l: w.tds_mg_l !== null && w.tds_mg_l !== undefined ? Number(w.tds_mg_l) : null,
    ca_mg_l: w.ca_mg_l !== null && w.ca_mg_l !== undefined ? Number(w.ca_mg_l) : null,
    mg_mg_l: w.mg_mg_l !== null && w.mg_mg_l !== undefined ? Number(w.mg_mg_l) : null,
    na_mg_l: w.na_mg_l !== null && w.na_mg_l !== undefined ? Number(w.na_mg_l) : null,
    k_mg_l: w.k_mg_l !== null && w.k_mg_l !== undefined ? Number(w.k_mg_l) : null,
    cl_mg_l: w.cl_mg_l !== null && w.cl_mg_l !== undefined ? Number(w.cl_mg_l) : null,
    sparkling: w.sparkling === 1 || w.sparkling === true,
    source_type: w.source_type ?? "seed",
    confidence_level: w.confidence_level ?? "low",
    notes: w.notes,
    popular: w.popular === 1 || w.popular === true,
  };
}
// ============== РАСЧЁТНЫЕ ФУНКЦИИ ==============
function computeCategory(w) {
  const tds = w.tds_mg_l ?? null;
  const na = w.na_mg_l ?? null;
  if (w.group === "Therapeutic") return "Therapeutic";
  if ((tds !== null && tds >= 1500) || (na !== null && na >= 200)) return "Therapeutic";
  if ((tds !== null && tds >= 500) || (na !== null && na >= 50)) return "Rotate";
  if (tds === null && na === null) return "Unknown";
  return "Daily";
}

function scoreWater(w) {
  const weights = { ca: 2.0, mg: 2.0, k: 1.2, na: 1.5, cl: 1.2, ph: 0.8, tds: 1.0 };
  const liters = 2;
  const get = {
    ca: w.ca_mg_l ?? null, mg: w.mg_mg_l ?? null, k: w.k_mg_l ?? null,
    na: w.na_mg_l ?? null, cl: w.cl_mg_l ?? null, ph: w.ph ?? null, tds: w.tds_mg_l ?? null,
  };
  const cov = dataCoverage(w);

  const evaluateMetric = (key, refDaily) => {
    const x = get[key];
    if (x === null || x === undefined) return null;
    let valuePerDay = x;
    if (key !== "ph" && key !== "tds") valuePerDay = x * liters;
    let refValue = key === "ph" ? REF.ph : key === "tds" ? REF.tds : refDaily;
    if (key === "ph") {
      const d = Math.abs(x - refValue);
      if (d <= 0.3) return 100; if (d <= 0.6) return 80; if (d <= 1.0) return 60; return 40;
    } else {
      const ratio = valuePerDay / refValue;
      if (ratio >= 0.7 && ratio <= 1.3) return 100;
      if (ratio >= 0.5 && ratio < 0.7) return 80;
      if (ratio > 1.3 && ratio <= 1.5) return 80;
      if (ratio >= 0.3 && ratio < 0.5) return 60;
      if (ratio > 1.5 && ratio <= 2.0) return 60;
      return 40;
    }
  };

  const scores = {
    ca: evaluateMetric("ca", REF.ca), mg: evaluateMetric("mg", REF.mg),
    k: evaluateMetric("k", REF.k), na: evaluateMetric("na", REF.na),
    cl: evaluateMetric("cl", REF.cl), ph: evaluateMetric("ph", REF.ph),
    tds: evaluateMetric("tds", REF.tds),
  };

  let totalWeight = 0, weightedSum = 0, presentCount = 0;
  for (const [key, s] of Object.entries(scores)) {
    if (s !== null) { weightedSum += s * weights[key]; totalWeight += weights[key]; presentCount++; }
  }
  let finalScore = totalWeight > 0 ? weightedSum / totalWeight : 0;
  finalScore -= (cov.total - cov.count) * 10;
  if (scores.ca === null || scores.mg === null) finalScore -= 20;
  if (presentCount <= 2) finalScore = Math.min(finalScore, 30);
  else if (presentCount === 3) finalScore = Math.min(finalScore, 50);
  else if (presentCount === 4) finalScore = Math.min(finalScore, 65);
  else if (presentCount === 5) finalScore = Math.min(finalScore, 80);
  finalScore = clamp(finalScore, 0, 100);
  return {
    score: Math.round(finalScore * 10) / 10,
    category: computeCategory(w), coverageCount: cov.count, coverageTotal: cov.total,
    missingCount: cov.total - cov.count, presentCount,
  };
}

function getProfileScore(w, profile) {
  const baseScore = scoreWater(w).score;
  const cov = dataCoverage(w);
  const missingPenalty = (cov.total - cov.count) * 8;

  let sparklingPenalty = 0;
  if (w.sparkling === true) {
    if (profile === "Kid") sparklingPenalty = 30;
    if (profile === "Sensitive") sparklingPenalty = 25;
    if (profile === "Everyday") sparklingPenalty = 10;
  }

  let therapeuticPenalty = 0;
  const cat = computeCategory(w);
  if (cat === "Therapeutic") {
    if (profile === "Everyday") therapeuticPenalty = 40;
    if (profile === "Kid") therapeuticPenalty = 50;
    if (profile === "Sport") therapeuticPenalty = 30;
  }

  let profileWeights = { ca: 1.0, mg: 1.0, k: 0.8, na: 1.2, cl: 1.0, ph: 0.4, tds: 0.6 };
  if (profile === "Kid") profileWeights = { ca: 1.2, mg: 1.2, k: 0.6, na: 3.0, cl: 1.5, ph: 0.5, tds: 2.5 };
  else if (profile === "Sport") profileWeights = { ca: 1.5, mg: 2.0, k: 2.0, na: 2.5, cl: 1.5, ph: 0.6, tds: 1.5 };
  else if (profile === "Sensitive") profileWeights = { ca: 0.8, mg: 0.8, k: 1.0, na: 2.5, cl: 1.5, ph: 2.0, tds: 2.0 };

  const get = {
    ca: w.ca_mg_l ?? null, mg: w.mg_mg_l ?? null, k: w.k_mg_l ?? null,
    na: w.na_mg_l ?? null, cl: w.cl_mg_l ?? null, ph: w.ph ?? null, tds: w.tds_mg_l ?? null,
  };

  let totalWeight = 0, weightedScore = 0, presentCount = 0;
  for (const [key, weight] of Object.entries(profileWeights)) {
    const x = get[key];
    if (x !== null && x !== undefined) {
      const ref = key === "ph" ? REF.ph : key === "tds" ? REF.tds : REF[key];
      let score = 100;
      const dev = Math.abs(x - ref) / ref;
      score = Math.max(0, 100 - dev * 100);

      if (profile === "Kid") {
        if (key === "tds") { if (x <= 200) score = 100; else if (x <= 500) score = 100 - (x - 200) * 0.2; else score = 40; }
        else if (key === "na") { if (x <= 20) score = 100; else if (x <= 50) score = 100 - (x - 20) * 1.5; else score = 30; }
      }
      if (profile === "Sport") {
        if (key === "na") { if (x >= 30 && x <= 100) score = 100; else if (x < 30) score = 70 + (x / 30) * 30; else if (x > 100) score = 100 - (x - 100) * 0.3; }
        else if (key === "mg") { if (x >= 20 && x <= 80) score = 100; else if (x < 20) score = 50 + (x / 20) * 50; else if (x > 80) score = 100 - (x - 80) * 0.3; }
      }
      if (profile === "Sensitive" && key === "ph") {
        if (x >= 6.5 && x <= 8.0) score = 100;
        else if (x < 6.5) score = 100 - (6.5 - x) * 30;
        else if (x > 8.0) score = 100 - (x - 8.0) * 30;
      }

      weightedScore += score * weight;
      totalWeight += weight;
      presentCount++;
    }
  }
  if (totalWeight === 0) return baseScore - missingPenalty - sparklingPenalty - therapeuticPenalty;
  const profileScore = weightedScore / totalWeight;
  return baseScore * 0.3 + profileScore * 0.7 - missingPenalty - sparklingPenalty - therapeuticPenalty;
}

function compareForRanking(a, b, profile) {
  const sA = getProfileScore(a, profile);
  const sB = getProfileScore(b, profile);
  if (Math.abs(sB - sA) > 0.001) return sB - sA;
  const cA = scoreWater(a).presentCount;
  const cB = scoreWater(b).presentCount;
  if (cA !== cB) return cB - cA;
  return a.brand_name.localeCompare(b.brand_name);
}

function pickWinnerDaily(selected, profile) {
  if (selected.length === 0) return null;
  const sorted = [...selected].sort((a, b) => getProfileScore(b, profile) - getProfileScore(a, profile));
  const nonThera = sorted.filter((w) => computeCategory(w) !== "Therapeutic");
  return nonThera.length > 0 ? nonThera[0] : sorted[0];
}

function normalizeValue(value, ref) {
  if (value === null || value === undefined) return 0;
  return Math.min((value / ref) * 100, 100);
}

// ============== ПАРСЕРЫ ==============
function parseCSV(text) {
  try {
    const rows = [];
    let cur = "", row = [], inQuotes = false;
    const pushCell = () => { row.push(cur); cur = ""; };
    const pushRow = () => { if (row.length === 1 && row[0].trim() === "") return; rows.push(row); row = []; };
    for (let i = 0; i < text.length; i++) {
      const ch = text[i], next = text[i + 1];
      if (ch === '"') { if (inQuotes && next === '"') { cur += '"'; i++; } else inQuotes = !inQuotes; continue; }
      if (!inQuotes && ch === ",") { pushCell(); continue; }
      if (!inQuotes && (ch === "\n" || ch === "\r")) { if (ch === "\r" && next === "\n") i++; pushCell(); pushRow(); continue; }
      cur += ch;
    }
    pushCell(); pushRow();
    if (rows.length < 2) return [];
    const headers = rows[0].map((h) => h.trim());
    const get = (r, k) => { const idx = headers.findIndex((h) => h.toLowerCase() === k.toLowerCase()); return idx < 0 ? "" : (r[idx] ?? "").trim(); };
    const items = [];
    for (const r of rows.slice(1)) {
      const id = get(r, "id") || get(r, "slug") || get(r, "code");
      const brand = get(r, "brand_name") || get(r, "name") || get(r, "brand");
      if (!id || !brand) continue;
      items.push({
        id, brand_name: brand,
        country_code: get(r, "country_code") || undefined,
        flag_emoji: get(r, "flag_emoji") || undefined,
        group: get(r, "group") || undefined,
        source_type: get(r, "source_type") || undefined,
        confidence_level: get(r, "confidence_level") || undefined,
        notes: get(r, "notes") || undefined,
        ph: parseNumLoose(get(r, "ph")),
        tds_mg_l: parseNumLoose(get(r, "tds_mg_l")) ?? parseNumLoose(get(r, "tds")),
        ca_mg_l: parseNumLoose(get(r, "ca_mg_l")) ?? parseNumLoose(get(r, "ca")),
        mg_mg_l: parseNumLoose(get(r, "mg_mg_l")) ?? parseNumLoose(get(r, "mg")),
        na_mg_l: parseNumLoose(get(r, "na_mg_l")) ?? parseNumLoose(get(r, "na")),
        k_mg_l: parseNumLoose(get(r, "k_mg_l")) ?? parseNumLoose(get(r, "k")),
        cl_mg_l: parseNumLoose(get(r, "cl_mg_l")) ?? parseNumLoose(get(r, "cl")),
        sparkling: toBoolLoose(get(r, "sparkling")),
      });
    }
    return items;
  } catch (e) { return []; }
}

function parseJSON(text) {
  try {
    const raw = JSON.parse(text);
    const arr = Array.isArray(raw) ? raw : (raw?.waters || raw?.data || raw?.items || []);
    const items = [];
    for (const x of arr) {
      const id = String(x?.id ?? x?.slug ?? x?.code ?? "").trim();
      const brand = String(x?.brand_name ?? x?.name ?? x?.brand ?? "").trim();
      if (!id || !brand) continue;
      items.push({
        id, brand_name: brand,
        country_code: x?.country_code ?? x?.countryCode ?? x?.country,
        flag_emoji: x?.flag_emoji ?? x?.flag,
        group: x?.group ?? x?.region,
        source_type: x?.source_type ?? x?.source,
        confidence_level: x?.confidence_level ?? x?.confidence,
        notes: x?.notes,
        ph: parseNumLoose(x?.ph),
        tds_mg_l: parseNumLoose(x?.tds_mg_l ?? x?.tds),
        ca_mg_l: parseNumLoose(x?.ca_mg_l ?? x?.ca),
        mg_mg_l: parseNumLoose(x?.mg_mg_l ?? x?.mg),
        na_mg_l: parseNumLoose(x?.na_mg_l ?? x?.na),
        k_mg_l: parseNumLoose(x?.k_mg_l ?? x?.k),
        cl_mg_l: parseNumLoose(x?.cl_mg_l ?? x?.cl),
        sparkling: toBoolLoose(x?.sparkling ?? x?.gas),
      });
    }
    return items;
  } catch (e) { return []; }
}

function mergeById(base, incoming) {
  const m = new Map();
  for (const w of base) m.set(w.id, w);
  for (const w of incoming) m.set(w.id, w);
  return Array.from(m.values());
}

// ============== ДОСТИЖЕНИЯ ==============
const ACHIEVEMENT_RULES = [
  { id: "daily", when: (w) => computeCategory(w) === "Daily", reasonRU: "Категория = «Ежедневная».", reasonEN: "Category = Daily." },
  { id: "therapeutic", when: (w) => computeCategory(w) === "Therapeutic", reasonRU: "Категория = «Лечебная».", reasonEN: "Category = Therapeutic." },
  { id: "sport", when: (w) => (w.na_mg_l ?? 0) >= 20 || (w.mg_mg_l ?? 0) >= 20 || (w.k_mg_l ?? 0) >= 2, reasonRU: "Повышенные электролиты", reasonEN: "Higher electrolytes" },
  { id: "coffee", when: () => false, reasonRU: "", reasonEN: "" },
  { id: "sparkling", when: (w) => w.sparkling === true, reasonRU: "С газом", reasonEN: "Sparkling" },
  { id: "still", when: (w) => w.sparkling === false, reasonRU: "Без газа", reasonEN: "Still" },
];
function getAchievements(w) { return ACHIEVEMENT_RULES.filter((r) => r.when(w)); }

// ============== FALLBACK SEED ==============
// Используется, если API не отвечает. Полный список из 57 марок
// вы уже добавили в БД через schema.sql — здесь компактный fallback.
const SEED = [
  { id: "evian", brand_name: "Evian", country_code: "FR", flag_emoji: "🇫🇷", group: "Europe", category: "Daily", ph: 7.2, tds_mg_l: 345, ca_mg_l: 80, mg_mg_l: 26, na_mg_l: 6.5, k_mg_l: 1.0, cl_mg_l: 10, sparkling: false, source_type: "seed", confidence_level: "high", popular: true },
  { id: "sanpellegrino", brand_name: "San Pellegrino", country_code: "IT", flag_emoji: "🇮🇹", group: "Europe", category: "Rotate", ph: 7.8, tds_mg_l: 915, ca_mg_l: 160, mg_mg_l: 50, na_mg_l: 33, k_mg_l: 2.0, cl_mg_l: 49, sparkling: true, source_type: "seed", confidence_level: "high", popular: true },
  { id: "volvic", brand_name: "Volvic", country_code: "FR", flag_emoji: "🇫🇷", group: "Europe", category: "Daily", ph: 7.0, tds_mg_l: 130, ca_mg_l: 12, mg_mg_l: 8, na_mg_l: 12, k_mg_l: 6, cl_mg_l: 15, sparkling: false, source_type: "seed", confidence_level: "medium", popular: true },
  { id: "baikal", brand_name: "Байкал", country_code: "RU", flag_emoji: "🇷🇺", group: "Russia", category: "Daily", ph: 7.2, tds_mg_l: 120, ca_mg_l: 25, mg_mg_l: 8, na_mg_l: 4, k_mg_l: 1, cl_mg_l: 5, sparkling: false, source_type: "seed", confidence_level: "low", popular: true },
  // ... остальные 53 марки точно так же, как в БД
];
// ============== ЛОГИН ДЛЯ АДМИНКИ (обновлено — шаг 3) ==============
function AdminLogin({ onLogin }) {
  const lang = React.useContext(LangCtx);
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await apiLogin(login, password);
      onLogin(true);
    } catch (err) {
      setError(lang === "ru" ? "Неверный логин или пароль" : "Invalid login or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-md w-full p-6 sm:p-8">
        <div className="text-center mb-6">
          <div className="text-4xl mb-3">🔐</div>
          <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">
            {lang === "ru" ? "Вход в админ-панель" : "Admin Login"}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            {lang === "ru" ? "Введите логин и пароль для доступа" : "Enter login and password to access"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {lang === "ru" ? "Логин" : "Login"}
            </label>
            <Input
              type="text"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              placeholder={lang === "ru" ? "Введите логин" : "Enter login"}
              className="w-full"
              autoFocus
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {lang === "ru" ? "Пароль" : "Password"}
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={lang === "ru" ? "Введите пароль" : "Enter password"}
              className="w-full"
              disabled={loading}
            />
          </div>
          {error && (
            <div className="text-rose-600 text-sm bg-rose-50 p-2 rounded-lg">{error}</div>
          )}
          <Button type="submit" className="w-full h-10 rounded-xl sm:rounded-2xl" disabled={loading}>
            {loading
              ? (lang === "ru" ? "Вход..." : "Logging in...")
              : (lang === "ru" ? "Войти" : "Login")}
          </Button>
          <div className="text-xs text-slate-400 text-center mt-2">
            {lang === "ru" ? "По умолчанию: admin / water123" : "Default: admin / water123"}
          </div>
        </form>
      </div>
    </div>
  );
}

// ============== АДМИНКА (обновлено — шаг 4) ==============
function AdminPanel({ waters, onUpdateWaters, onClose }) {
  const lang = React.useContext(LangCtx);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    id: "", brand_name: "", country_code: "", group: "Europe",
    ph: "", tds_mg_l: "", ca_mg_l: "", mg_mg_l: "", na_mg_l: "",
    k_mg_l: "", cl_mg_l: "", sparkling: "false",
    confidence_level: "medium", notes: "", popular: false,
  });

  const resetForm = () => {
    setFormData({
      id: "", brand_name: "", country_code: "", group: "Europe",
      ph: "", tds_mg_l: "", ca_mg_l: "", mg_mg_l: "", na_mg_l: "",
      k_mg_l: "", cl_mg_l: "", sparkling: "false",
      confidence_level: "medium", notes: "", popular: false,
    });
    setEditingId(null);
  };

  const startEdit = (w) => {
    setEditingId(w.id);
    setFormData({
      id: w.id,
      brand_name: w.brand_name,
      country_code: w.country_code || "",
      group: w.group || "Europe",
      ph: w.ph !== null && w.ph !== undefined ? String(w.ph) : "",
      tds_mg_l: w.tds_mg_l !== null && w.tds_mg_l !== undefined ? String(w.tds_mg_l) : "",
      ca_mg_l: w.ca_mg_l !== null && w.ca_mg_l !== undefined ? String(w.ca_mg_l) : "",
      mg_mg_l: w.mg_mg_l !== null && w.mg_mg_l !== undefined ? String(w.mg_mg_l) : "",
      na_mg_l: w.na_mg_l !== null && w.na_mg_l !== undefined ? String(w.na_mg_l) : "",
      k_mg_l: w.k_mg_l !== null && w.k_mg_l !== undefined ? String(w.k_mg_l) : "",
      cl_mg_l: w.cl_mg_l !== null && w.cl_mg_l !== undefined ? String(w.cl_mg_l) : "",
      sparkling: w.sparkling ? "true" : "false",
      confidence_level: w.confidence_level || "medium",
      notes: w.notes || "",
      popular: w.popular || false,
    });
  };

  // ✅ Сохранение через API
  const saveWater = async () => {
    try {
      const newWater = {
        id: formData.id || `water_${Date.now()}`,
        brand_name: formData.brand_name.trim(),
        country_code: formData.country_code.trim().toUpperCase() || undefined,
        flag_emoji: formData.country_code ? safeCountryFlag(formData.country_code) : "🌍",
        group: formData.group,
        category: computeCategory({
          ...formData,
          ph: parseFloat(formData.ph) || null,
          tds_mg_l: parseFloat(formData.tds_mg_l) || null,
          na_mg_l: parseFloat(formData.na_mg_l) || null,
        }),
        ph: formData.ph ? parseFloat(formData.ph) : null,
        tds_mg_l: formData.tds_mg_l ? parseFloat(formData.tds_mg_l) : null,
        ca_mg_l: formData.ca_mg_l ? parseFloat(formData.ca_mg_l) : null,
        mg_mg_l: formData.mg_mg_l ? parseFloat(formData.mg_mg_l) : null,
        na_mg_l: formData.na_mg_l ? parseFloat(formData.na_mg_l) : null,
        k_mg_l: formData.k_mg_l ? parseFloat(formData.k_mg_l) : null,
        cl_mg_l: formData.cl_mg_l ? parseFloat(formData.cl_mg_l) : null,
        sparkling: formData.sparkling === "true",
        confidence_level: formData.confidence_level,
        notes: formData.notes || undefined,
        popular: formData.popular,
        source_type: "admin",
      };

      if (!newWater.brand_name) {
        alert(lang === "ru" ? "Введите название бренда" : "Enter brand name");
        return;
      }

      if (editingId) {
        await updateWater(editingId, newWater);
        onUpdateWaters((prev) => prev.map((w) => (w.id === editingId ? newWater : w)));
      } else {
        await createWater(newWater);
        onUpdateWaters((prev) => [...prev, newWater]);
      }
      resetForm();
      alert(lang === "ru" ? "Сохранено!" : "Saved!");
    } catch (err) {
      alert(lang === "ru" ? `Ошибка: ${err.message}` : `Error: ${err.message}`);
    }
  };

  // ✅ Удаление через API
  const deleteWaterHandler = async (id) => {
    if (!window.confirm(lang === "ru" ? "Удалить эту марку?" : "Delete this water?")) return;
    try {
      await deleteWater(id);
      onUpdateWaters((prev) => prev.filter((w) => w.id !== id));
    } catch (err) {
      alert(lang === "ru" ? `Ошибка: ${err.message}` : `Error: ${err.message}`);
    }
  };

  // Экспорт
  const exportData = () => {
    const dataStr = JSON.stringify(waters, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `water_expert_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ✅ Импорт через API
  const importData = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        if (Array.isArray(imported) && imported.length > 0) {
          if (window.confirm(lang === "ru" ? `Импортировать ${imported.length} марок?` : `Import ${imported.length} waters?`)) {
            await importWaters(imported);
            const fresh = await fetchWaters();
            onUpdateWaters(fresh.map(normalizeWaterFromDB));
            alert(lang === "ru" ? "Импорт завершён!" : "Import complete!");
          }
        } else {
          alert(lang === "ru" ? "Неверный формат файла" : "Invalid file format");
        }
      } catch (err) {
        alert(lang === "ru" ? "Ошибка при импорте" : "Import error");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-auto">
        <div className="sticky top-0 bg-white/95 backdrop-blur p-3 sm:p-4 border-b flex justify-between items-center">
          <div>
            <h2 className="text-base sm:text-xl font-semibold text-slate-900">
              ⚙️ {lang === "ru" ? "Управление марками" : "Water Management"}
            </h2>
            <div className="text-xs text-slate-500 mt-0.5">
              {lang === "ru" ? "Доступно по адресу" : "Available at"}{" "}
              <code className="bg-slate-100 px-1.5 py-0.5 rounded">/admin</code>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={exportData} className="text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-1.5 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition">
              📥 {lang === "ru" ? "Экспорт" : "Export"}
            </button>
            <label className="text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-1.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition cursor-pointer">
              📤 {lang === "ru" ? "Импорт" : "Import"}
              <input type="file" accept=".json" className="hidden" onChange={importData} />
            </label>
            <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-full">
              <X className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
          </div>
        </div>

        <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
          {/* Форма */}
          <div className={`${GLASS.card} p-3 sm:p-5`}>
            <h3 className="text-sm sm:text-base font-semibold text-slate-900 mb-3">
              {editingId ? "✏️ " + (lang === "ru" ? "Редактирование" : "Editing") : "➕ " + (lang === "ru" ? "Новая марка" : "New water")}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
              <Input placeholder={lang === "ru" ? "ID (уникальный)" : "ID (unique)"} value={formData.id} onChange={(e) => setFormData({ ...formData, id: e.target.value })} className="text-sm" disabled={!!editingId} />
              <Input placeholder={lang === "ru" ? "Название бренда *" : "Brand name *"} value={formData.brand_name} onChange={(e) => setFormData({ ...formData, brand_name: e.target.value })} className="text-sm" />
              <Input placeholder={lang === "ru" ? "Код страны (FR, RU)" : "Country code"} value={formData.country_code} onChange={(e) => setFormData({ ...formData, country_code: e.target.value.toUpperCase() })} className="text-sm" />
              <select value={formData.group} onChange={(e) => setFormData({ ...formData, group: e.target.value })} className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl border border-white/60 bg-white/70 focus:outline-none focus:ring-2 focus:ring-sky-200 text-sm">
                <option value="Europe">Europe</option>
                <option value="Russia">Russia</option>
                <option value="Therapeutic">Therapeutic</option>
              </select>
              <select value={formData.confidence_level} onChange={(e) => setFormData({ ...formData, confidence_level: e.target.value })} className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl border border-white/60 bg-white/70 focus:outline-none focus:ring-2 focus:ring-sky-200 text-sm">
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              <select value={formData.sparkling} onChange={(e) => setFormData({ ...formData, sparkling: e.target.value })} className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl border border-white/60 bg-white/70 focus:outline-none focus:ring-2 focus:ring-sky-200 text-sm">
                <option value="false">Still</option>
                <option value="true">Sparkling</option>
              </select>
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input type="checkbox" checked={formData.popular} onChange={(e) => setFormData({ ...formData, popular: e.target.checked })} />
                {lang === "ru" ? "Популярная" : "Popular"}
              </label>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
              <Input placeholder="pH" value={formData.ph} onChange={(e) => setFormData({ ...formData, ph: e.target.value })} className="text-sm" type="number" step="0.1" />
              <Input placeholder="TDS" value={formData.tds_mg_l} onChange={(e) => setFormData({ ...formData, tds_mg_l: e.target.value })} className="text-sm" type="number" step="1" />
              <Input placeholder="Ca" value={formData.ca_mg_l} onChange={(e) => setFormData({ ...formData, ca_mg_l: e.target.value })} className="text-sm" type="number" step="1" />
              <Input placeholder="Mg" value={formData.mg_mg_l} onChange={(e) => setFormData({ ...formData, mg_mg_l: e.target.value })} className="text-sm" type="number" step="1" />
              <Input placeholder="Na" value={formData.na_mg_l} onChange={(e) => setFormData({ ...formData, na_mg_l: e.target.value })} className="text-sm" type="number" step="1" />
              <Input placeholder="K" value={formData.k_mg_l} onChange={(e) => setFormData({ ...formData, k_mg_l: e.target.value })} className="text-sm" type="number" step="0.1" />
              <Input placeholder="Cl" value={formData.cl_mg_l} onChange={(e) => setFormData({ ...formData, cl_mg_l: e.target.value })} className="text-sm" type="number" step="1" />
              <Input placeholder={lang === "ru" ? "Заметки" : "Notes"} value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} className="text-sm" />
            </div>
            <div className="flex gap-2 mt-3">
              <Button onClick={saveWater} className="h-8 sm:h-10 rounded-xl sm:rounded-2xl">
                <Save className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                {editingId ? (lang === "ru" ? "Обновить" : "Update") : (lang === "ru" ? "Добавить" : "Add")}
              </Button>
              <Button variant="outline" onClick={resetForm} className="h-8 sm:h-10 rounded-xl sm:rounded-2xl">
                {lang === "ru" ? "Отмена" : "Cancel"}
              </Button>
            </div>
          </div>

          {/* Список */}
          <div className={`${GLASS.card} p-3 sm:p-5`}>
            <h3 className="text-sm sm:text-base font-semibold text-slate-900 mb-3">
              📋 {lang === "ru" ? "Все марки" : "All waters"} ({waters.length})
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="px-2 py-1 sm:px-3 sm:py-2">#</th>
                    <th className="px-2 py-1 sm:px-3 sm:py-2">Флаг</th>
                    <th className="px-2 py-1 sm:px-3 sm:py-2">Название</th>
                    <th className="px-2 py-1 sm:px-3 sm:py-2 hidden sm:table-cell">Группа</th>
                    <th className="px-2 py-1 sm:px-3 sm:py-2 hidden md:table-cell">TDS</th>
                    <th className="px-2 py-1 sm:px-3 sm:py-2 hidden md:table-cell">pH</th>
                    <th className="px-2 py-1 sm:px-3 sm:py-2">Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {waters.map((w, idx) => (
                    <tr key={w.id} className="border-b border-slate-200 hover:bg-slate-50/50">
                      <td className="px-2 py-1 sm:px-3 sm:py-2 text-slate-400 text-[10px] sm:text-xs">{idx + 1}</td>
                      <td className="px-2 py-1 sm:px-3 sm:py-2 text-base sm:text-lg">{w.flag_emoji}</td>
                      <td className="px-2 py-1 sm:px-3 sm:py-2 font-medium truncate max-w-[80px] sm:max-w-[150px]">{w.brand_name}</td>
                      <td className="px-2 py-1 sm:px-3 sm:py-2 hidden sm:table-cell text-xs">{w.group}</td>
                      <td className="px-2 py-1 sm:px-3 sm:py-2 hidden md:table-cell">{w.tds_mg_l || "—"}</td>
                      <td className="px-2 py-1 sm:px-3 sm:py-2 hidden md:table-cell">{w.ph || "—"}</td>
                      <td className="px-2 py-1 sm:px-3 sm:py-2">
                        <div className="flex gap-1">
                          <button onClick={() => startEdit(w)} className="p-1 hover:bg-sky-100 rounded-full text-sky-600">
                            <Edit className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          </button>
                          <button onClick={() => deleteWaterHandler(w.id)} className="p-1 hover:bg-rose-100 rounded-full text-rose-600">
                            <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {waters.length === 0 && (
              <div className="text-center text-slate-500 py-4 text-sm">
                {lang === "ru" ? "Нет марок. Добавьте первую!" : "No waters. Add the first one!"}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============== ДЕТАЛЬНАЯ КАРТОЧКА ВОДЫ ==============
function WaterDetailModal({ w, onClose }) {
  const lang = React.useContext(LangCtx);
  const scoreData = scoreWater(w);
  const cov = dataCoverage(w);

  const allMetrics = [
    { key: "ph", label: "pH", value: w.ph ?? null, unit: "", digits: 1 },
    { key: "tds", label: "TDS", value: w.tds_mg_l ?? null, unit: "мг/л" },
    { key: "ca", label: "Кальций (Ca)", value: w.ca_mg_l ?? null, unit: "мг/л" },
    { key: "mg", label: "Магний (Mg)", value: w.mg_mg_l ?? null, unit: "мг/л" },
    { key: "k", label: "Калий (K)", value: w.k_mg_l ?? null, unit: "мг/л" },
    { key: "na", label: "Натрий (Na)", value: w.na_mg_l ?? null, unit: "мг/л" },
    { key: "cl", label: "Хлориды (Cl)", value: w.cl_mg_l ?? null, unit: "мг/л" },
  ];

  const getPercentage = (key, value) => {
    if (value === null || value === undefined) return null;
    const dailyValue = key === "ph" || key === "tds" ? value : value * 2;
    const refValue = key === "ph" ? REF.ph : key === "tds" ? REF.tds : REF[key];
    return Math.round((dailyValue / refValue) * 100);
  };

  const getStatus = (p) => {
    if (p === null) return { color: "text-slate-400", text: "нет данных", bg: "bg-slate-100" };
    if (p < 50) return { color: "text-amber-600", text: "низкий", bg: "bg-amber-50" };
    if (p < 80) return { color: "text-sky-600", text: "средний", bg: "bg-sky-50" };
    if (p <= 120) return { color: "text-emerald-600", text: "норма", bg: "bg-emerald-50" };
    if (p <= 200) return { color: "text-orange-600", text: "высокий", bg: "bg-orange-50" };
    return { color: "text-rose-600", text: "избыток", bg: "bg-rose-50" };
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-2xl w-full max-h-[95vh] overflow-auto">
        <div className="sticky top-0 bg-white/95 backdrop-blur p-4 border-b flex justify-between items-start">
          <div className="flex items-center gap-3">
            <span className="text-3xl sm:text-4xl">{w.flag_emoji}</span>
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">{w.brand_name}</h2>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <CategoryBadge cat={computeCategory(w)} />
                {w.group && (
                  <span className="text-xs bg-slate-100 px-2 py-0.5 rounded-full text-slate-600">
                    {w.group === "Therapeutic" ? "💊 Лечебная" : w.group === "Russia" ? "🇷🇺 Россия" : "🇪🇺 Европа"}
                  </span>
                )}
                {w.sparkling && <span className="text-xs bg-sky-100 px-2 py-0.5 rounded-full text-sky-700">💨 С газом</span>}
                {w.sparkling === false && <span className="text-xs bg-emerald-100 px-2 py-0.5 rounded-full text-emerald-700">💧 Без газа</span>}
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-full">
            <X className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className={`${GLASS.subtle} p-3 text-center`}>
              <div className="text-2xl font-bold text-slate-900">{scoreData.score.toFixed(1)}</div>
              <div className="text-xs text-slate-500">Рейтинг</div>
            </div>
            <div className={`${GLASS.subtle} p-3 text-center`}>
              <div className="text-2xl font-bold text-slate-900">{cov.count}/{cov.total}</div>
              <div className="text-xs text-slate-500">Показателей</div>
            </div>
            <div className={`${GLASS.subtle} p-3 text-center`}>
              <div className="text-2xl font-bold text-slate-900">{w.tds_mg_l ?? "—"}</div>
              <div className="text-xs text-slate-500">TDS, мг/л</div>
            </div>
            <div className={`${GLASS.subtle} p-3 text-center`}>
              <div className="text-2xl font-bold text-slate-900">{w.ph ?? "—"}</div>
              <div className="text-xs text-slate-500">pH</div>
            </div>
          </div>

          <div className={`${GLASS.card} p-4`}>
            <h3 className="text-sm font-semibold text-slate-900 mb-3">📊 Все показатели</h3>
            <div className="space-y-2">
              {allMetrics.map((m) => {
                const p = getPercentage(m.key, m.value);
                const status = p ? getStatus(p) : { color: "text-slate-400", bg: "bg-slate-100" };
                const st = metricStatus(m.key, m.value);
                return (
                  <div key={m.key} className={`${GLASS.subtle} flex items-center justify-between px-3 py-2`}>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-slate-700">{m.label}</span>
                      <MetricHelp k={m.key} />
                    </div>
                    <div className="flex items-center gap-3">
                      {p !== null && <span className={`text-xs px-2 py-0.5 rounded-full ${status.bg} ${status.color}`}>{p}%</span>}
                      <span className="text-sm font-semibold text-slate-900">
                        {fmt(m.value, m.digits ?? 0)}
                        {m.unit && <span className="ml-0.5 text-xs font-medium text-slate-500">{m.unit}</span>}
                      </span>
                      <MetricPill kind={st} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {w.notes && (
            <div className={`${GLASS.subtle} p-3 text-sm text-slate-600`}>
              <span className="font-medium text-slate-700">📝 Примечание:</span> {w.notes}
            </div>
          )}

          <Button onClick={onClose} className="w-full h-10 rounded-xl sm:rounded-2xl">
            {lang === "ru" ? "Закрыть" : "Close"}
          </Button>
        </div>
      </div>
    </div>
  );
}
// ============== UI КОМПОНЕНТЫ ==============
function ConfidenceBadge() { return null; }

function CategoryBadge({ cat }) {
  const lang = React.useContext(LangCtx);
  const tt = I18N[lang];
  const styles = {
    Daily: { label: tt.badges.daily, icon: <ShieldCheck className="h-3 w-3 sm:h-3.5 sm:w-3.5" />, className: "bg-emerald-50 text-emerald-800 border-emerald-200" },
    Rotate: { label: tt.badges.rotate, icon: <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5" />, className: "bg-sky-50 text-sky-800 border-sky-200" },
    Therapeutic: { label: tt.badges.therapeutic, icon: <Beaker className="h-3 w-3 sm:h-3.5 sm:w-3.5" />, className: "bg-rose-50 text-rose-800 border-rose-200" },
    Unknown: { label: tt.badges.unknown, icon: <AlertTriangle className="h-3 w-3 sm:h-3.5 sm:w-3.5" />, className: "bg-slate-50 text-slate-800 border-slate-200" },
  };
  const v = styles[cat];
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className={`inline-flex cursor-help items-center gap-1 rounded-xl border px-1.5 py-0.5 sm:px-2 sm:py-1 text-[10px] sm:text-xs font-medium ${v.className}`}>
          {v.icon}{v.label}
        </span>
      </TooltipTrigger>
      <TooltipContent className="max-w-[280px] sm:max-w-[320px]">
        <div className="text-xs leading-snug">{tt.categoryHelp[cat]}</div>
      </TooltipContent>
    </Tooltip>
  );
}

function MetricHelp({ k }) {
  const lang = React.useContext(LangCtx);
  const e = EDUCATION[k];
  const title = lang === "ru" ? e.titleRU : e.titleEN;
  const unit = lang === "ru" ? e.unitRU : e.unitEN;
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="inline-flex items-center justify-center rounded-lg border border-sky-100 bg-white/70 px-1.5 py-0.5 text-[11px] text-slate-700 hover:bg-white" type="button">
          <Info className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-[380px] sm:max-w-[400px]">
        <DialogHeader><DialogTitle className="text-base sm:text-lg">{title}</DialogTitle></DialogHeader>
        <div className="space-y-3 sm:space-y-4 p-4 sm:p-6 pt-2">
          <div className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            {lang === "ru" ? e.shortRU : e.shortEN}
          </div>
          <div className="rounded-xl border border-sky-100 bg-sky-50/60 p-2 sm:p-3">
            <div className="text-xs text-slate-600 font-medium mb-1">{lang === "ru" ? "Эталон:" : "Reference:"}</div>
            <div className="font-medium text-slate-900 text-sm sm:text-base">
              {e.ref}{unit ? ` ${unit}` : ""}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function WaterChip({ w, onRemove }) {
  return (
    <motion.div layout initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}
      className={`${GLASS.chip} inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-2`}>
      <span className="text-sm sm:text-base">{w.flag_emoji ?? safeCountryFlag(w.country_code)}</span>
      <span className="max-w-[100px] sm:max-w-[180px] truncate text-xs sm:text-sm font-medium">{w.brand_name}</span>
      <button className="ml-1 inline-flex h-5 w-5 sm:h-7 sm:w-7 items-center justify-center rounded-xl border border-white/60 bg-white/60 text-slate-700 hover:bg-white" onClick={onRemove} type="button">
        <X className="h-3 w-3 sm:h-4 sm:w-4" />
      </button>
    </motion.div>
  );
}

function AchievementPills({ w }) {
  const lang = React.useContext(LangCtx);
  const t = I18N[lang];
  const rules = getAchievements(w);
  if (!rules.length) return null;
  const meta = {
    daily: { icon: <ShieldCheck className="h-3 w-3 sm:h-3.5 sm:w-3.5" />, className: "border-emerald-200 bg-emerald-50 text-emerald-800" },
    therapeutic: { icon: <Beaker className="h-3 w-3 sm:h-3.5 sm:w-3.5" />, className: "border-rose-200 bg-rose-50 text-rose-800" },
    sport: { icon: <Dumbbell className="h-3 w-3 sm:h-3.5 sm:w-3.5" />, className: "border-sky-200 bg-sky-50 text-sky-800" },
    sparkling: { icon: <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5" />, className: "border-slate-200 bg-white text-slate-800" },
    still: { icon: <Droplets className="h-3 w-3 sm:h-3.5 sm:w-3.5" />, className: "border-slate-200 bg-white text-slate-800" },
  };
  return (
    <div className="mt-2 flex flex-wrap gap-1.5 sm:gap-2">
      {rules.map((r) => (
        <Tooltip key={r.id}>
          <TooltipTrigger asChild>
            <span className={`inline-flex cursor-help items-center gap-1 rounded-xl border px-1.5 py-0.5 sm:px-2 sm:py-1 text-[10px] sm:text-xs font-medium ${meta[r.id]?.className || ""}`}>
              {meta[r.id]?.icon}{t.achievements[r.id]}
            </span>
          </TooltipTrigger>
          <TooltipContent className="max-w-[320px]">
            <div className="text-xs leading-snug">{lang === "ru" ? r.reasonRU : r.reasonEN}</div>
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
}

function metricStatus(key, value) {
  if (value === null || value === undefined) return "unknown";
  const ref = key === "ph" ? REF.ph : key === "tds" ? REF.tds : REF[key];
  const deviation = Math.abs(value - ref) / (ref || 1);
  if (deviation <= 0.25) return "daily";
  if (deviation <= 0.7) return "rotate";
  return "therapeutic";
}

function MetricPill({ kind }) {
  const lang = React.useContext(LangCtx);
  const t = I18N[lang];
  const map = {
    daily: { label: t.badges.daily, cls: "border-emerald-200 bg-emerald-50 text-emerald-800", hint: t.metricBands.daily },
    rotate: { label: t.badges.rotate, cls: "border-sky-200 bg-sky-50 text-sky-800", hint: t.metricBands.rotate },
    therapeutic: { label: t.badges.therapeutic, cls: "border-rose-200 bg-rose-50 text-rose-800", hint: t.metricBands.therapeutic },
    unknown: { label: t.badges.unknown, cls: "border-slate-200 bg-white text-slate-700", hint: t.metricBands.unknown },
  };
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className={`inline-flex cursor-help items-center rounded-xl border px-1.5 py-0.5 text-[10px] sm:text-[11px] font-medium ${map[kind].cls}`}>
          {map[kind].label}
        </span>
      </TooltipTrigger>
      <TooltipContent><div className="text-xs">{map[kind].hint}</div></TooltipContent>
    </Tooltip>
  );
}

function ScoreBar({ score }) {
  const pct = clamp(score, 0, 100);
  return (
    <div className="h-1.5 sm:h-2 w-full overflow-hidden rounded-full bg-slate-200/70">
      <div className="h-full rounded-full bg-slate-900/80" style={{ width: `${pct}%`, opacity: 0.15 + (pct / 100) * 0.85 }} />
    </div>
  );
}

function WaterProfileCard({ w, profile, rank, isWinner }) {
  const lang = React.useContext(LangCtx);
  const scoreData = scoreWater(w);
  const cov = dataCoverage(w);
  const metrics = [
    { key: "ph", label: "pH", value: w.ph ?? null, digits: 1 },
    { key: "tds", label: "TDS", value: w.tds_mg_l ?? null, unit: "мг/л" },
    { key: "ca", label: "Ca", value: w.ca_mg_l ?? null, unit: "мг/л" },
    { key: "mg", label: "Mg", value: w.mg_mg_l ?? null, unit: "мг/л" },
    { key: "k", label: "K", value: w.k_mg_l ?? null, unit: "мг/л" },
    { key: "na", label: "Na", value: w.na_mg_l ?? null, unit: "мг/л" },
    { key: "cl", label: "Cl", value: w.cl_mg_l ?? null, unit: "мг/л" },
  ];
  return (
    <div className={`${GLASS.card} p-3 sm:p-5 ${isWinner ? "ring-2 ring-amber-400" : ""}`}>
      <div className="flex items-start justify-between gap-2 sm:gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="text-lg sm:text-xl">{w.flag_emoji ?? safeCountryFlag(w.country_code)}</span>
            <div className="min-w-0">
              <div className="truncate text-sm sm:text-base font-semibold text-slate-900">{w.brand_name}</div>
              <div className="mt-1 flex flex-wrap items-center gap-1.5 sm:gap-2">
                <CategoryBadge cat={computeCategory(w)} />
                <ConfidenceBadge />
              </div>
            </div>
          </div>
          <AchievementPills w={w} />
        </div>
        <div className="w-[110px] sm:w-[150px] shrink-0">
          <div className="text-xs font-medium text-slate-600">{lang === "ru" ? "Место" : "Rank"}</div>
          <div className="mt-1 flex items-end justify-between">
            <div className="text-xl sm:text-2xl font-semibold text-slate-900">#{rank}</div>
            <div className="text-[10px] sm:text-xs text-slate-600">{cov.count}/{cov.total}</div>
          </div>
          <div className="mt-1 sm:mt-2"><ScoreBar score={scoreData.score} /></div>
        </div>
      </div>
      <div className="mt-3 sm:mt-4 grid gap-1.5 sm:gap-2">
        {metrics.map((m) => {
          const st = metricStatus(m.key, m.value);
          return (
            <div key={m.key} className={`${GLASS.subtle} flex items-center justify-between gap-2 sm:gap-3 px-2 sm:px-3 py-1.5 sm:py-2`}>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="text-xs sm:text-sm font-medium text-slate-800">{m.label}</div>
                <MetricHelp k={m.key} />
                <MetricPill kind={st} />
              </div>
              <div className="text-xs sm:text-sm font-semibold text-slate-900">
                {fmt(m.value, m.digits ?? 0)}
                {m.unit && <span className="ml-0.5 sm:ml-1 text-[10px] sm:text-xs font-medium text-slate-600">{m.unit}</span>}
              </div>
            </div>
          );
        })}
      </div>
      {w.notes && <div className="mt-2 sm:mt-3 text-[10px] sm:text-xs text-slate-600">{w.notes}</div>}
    </div>
  );
}

function WaterProfileCompactRow({ w, rank }) {
  const lang = React.useContext(LangCtx);
  const scoreData = scoreWater(w);
  return (
    <details className={`${GLASS.card} group overflow-hidden`}>
      <summary className="flex cursor-pointer list-none items-center justify-between gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3">
        <div className="flex min-w-0 items-center gap-1.5 sm:gap-2">
          <span className="text-base sm:text-lg">{w.flag_emoji ?? safeCountryFlag(w.country_code)}</span>
          <span className="truncate text-xs sm:text-sm font-semibold text-slate-900">{w.brand_name}</span>
          <span className="hidden sm:inline-flex"><CategoryBadge cat={computeCategory(w)} /></span>
        </div>
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <div className="text-right">
            <div className="text-[10px] sm:text-[11px] font-medium text-slate-600">{lang === "ru" ? "Место" : "Rank"}</div>
            <div className="text-xs sm:text-sm font-semibold text-slate-900">#{rank}</div>
          </div>
          <ChevronDown className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-500 transition-transform group-open:rotate-180" />
        </div>
      </summary>
      <div className="px-3 sm:px-4 pb-3 sm:pb-4">
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
          <div className={`${GLASS.subtle} px-2 py-1.5`}>
            <div className="text-[10px] text-slate-600">pH</div>
            <div className="text-xs font-semibold text-slate-900">{fmt(w.ph, 1)}</div>
          </div>
          <div className={`${GLASS.subtle} px-2 py-1.5`}>
            <div className="text-[10px] text-slate-600">TDS</div>
            <div className="text-xs font-semibold text-slate-900">{fmt(w.tds_mg_l, 0)}</div>
          </div>
          <div className={`${GLASS.subtle} px-2 py-1.5`}>
            <div className="text-[10px] text-slate-600">Ca</div>
            <div className="text-xs font-semibold text-slate-900">{fmt(w.ca_mg_l, 0)}</div>
          </div>
          <div className={`${GLASS.subtle} px-2 py-1.5`}>
            <div className="text-[10px] text-slate-600">Рейтинг</div>
            <div className="text-xs font-semibold text-slate-900">{scoreData.score.toFixed(1)}</div>
          </div>
        </div>
        <div className="mt-3"><AchievementPills w={w} /></div>
      </div>
    </details>
  );
}

function LegendPills({ items }) {
  return (
    <div className="mt-3 flex flex-wrap gap-1.5 sm:gap-2">
      {items.map((x) => (
        <span key={x.name} className={`${GLASS.chip} inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-medium`}>
          <span className="text-sm sm:text-base">{x.flag ?? "💧"}</span>
          <span className="inline-block h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full" style={{ background: x.color }} />
          <span className="max-w-[120px] sm:max-w-[180px] truncate">{x.name}</span>
        </span>
      ))}
    </div>
  );
}

// ============== ТАБЛИЦА / ГРАФИКИ ==============
function MetricsTable({ selected, profile, onWaterClick }) {
  const lang = React.useContext(LangCtx);
  const t = I18N[lang];
  const sorted = [...selected].sort((a, b) => compareForRanking(a, b, profile));
  const winnerId = sorted.length > 0 ? sorted[0].id : null;

  const rows = [
    { key: "ph", label: "pH", ref: String(REF.ph), unit: "", getValue: (w) => w.ph ?? null, digits: 1 },
    { key: "tds", label: "TDS", ref: String(REF.tds), unit: "мг/л", getValue: (w) => w.tds_mg_l ?? null },
    { key: "ca", label: "Ca", ref: String(REF.ca), unit: "мг/сутки*", getValue: (w) => w.ca_mg_l ?? null },
    { key: "mg", label: "Mg", ref: String(REF.mg), unit: "мг/сутки*", getValue: (w) => w.mg_mg_l ?? null },
    { key: "k", label: "K", ref: String(REF.k), unit: "мг/сутки*", getValue: (w) => w.k_mg_l ?? null },
    { key: "na", label: "Na", ref: String(REF.na), unit: "мг/сутки**", getValue: (w) => w.na_mg_l ?? null },
    { key: "cl", label: "Cl", ref: String(REF.cl), unit: "мг/сутки*", getValue: (w) => w.cl_mg_l ?? null },
  ];

  if (selected.length === 0) {
    return <div className={`${GLASS.card} p-4 sm:p-6 text-center text-slate-600`}>{t.misc.empty}</div>;
  }

  return (
    <div className={`${GLASS.card} p-3 sm:p-6`}>
      <div className="text-base sm:text-lg font-semibold text-slate-900 mb-3">{t.table.title}</div>
      <div className="overflow-x-auto rounded-2xl border-2 border-slate-300 bg-white/55">
        <table className="w-full text-left text-[10px] sm:text-sm border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-slate-100">
              <th className="px-3 py-2 border border-slate-300 font-medium">#</th>
              <th className="px-3 py-2 border border-slate-300 font-medium">Флаг</th>
              <th className="px-3 py-2 border border-slate-300 font-medium">Название</th>
              {rows.map((r) => <th key={r.key} className="px-3 py-2 border border-slate-300 font-medium">{r.label}</th>)}
              <th className="px-3 py-2 border border-slate-300 font-medium">Рейтинг</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((w, idx) => {
              const isWinner = w.id === winnerId;
              return (
                <tr key={w.id} className={`${idx % 2 === 0 ? "bg-white/60" : "bg-white/40"} cursor-pointer hover:bg-sky-50/50`} onClick={() => onWaterClick?.(w)}>
                  <td className="px-3 py-2 border border-slate-300">{idx + 1}</td>
                  <td className="px-3 py-2 border border-slate-300 text-base">{w.flag_emoji}</td>
                  <td className={`px-3 py-2 border border-slate-300 font-medium ${isWinner ? "text-amber-600" : ""}`}>
                    {w.brand_name} {isWinner && "🏆"}
                  </td>
                  {rows.map((r) => {
                    const v = r.getValue(w);
                    const st = metricStatus(r.key, v);
                    return (
                      <td key={r.key} className="px-3 py-2 border border-slate-300">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-900">{fmt(v, r.digits ?? 0)}</span>
                          <MetricPill kind={st} />
                        </div>
                      </td>
                    );
                  })}
                  <td className={`px-3 py-2 border border-slate-300 font-bold ${isWinner ? "text-amber-600" : ""}`}>
                    {scoreWater(w).score.toFixed(1)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="mt-2 text-[10px] text-slate-600">* ориентир по суточной норме, ** натрий зависит от профиля</div>
    </div>
  );
}

function CompareChart({ selected }) {
  const lang = React.useContext(LangCtx);
  const t = I18N[lang];
  const data = selected
    .filter((w) => w.ph !== null && w.tds_mg_l !== null)
    .map((w, idx) => ({
      id: w.id, name: w.brand_name,
      flag: w.flag_emoji ?? safeCountryFlag(w.country_code),
      tds: w.tds_mg_l, ph: w.ph,
      color: CHART_COLORS[idx % CHART_COLORS.length],
    }));

  if (data.length === 0) {
    return <div className={`${GLASS.card} p-6 text-center text-slate-600`}>Недостаточно данных</div>;
  }

  return (
    <div className={`${GLASS.card} p-3 sm:p-6`}>
      <div className="text-base sm:text-lg font-semibold text-slate-900 mb-3">{t.chart.title}</div>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" dataKey="tds" name="TDS" unit=" мг/л" />
            <YAxis type="number" dataKey="ph" name="pH" domain={[4, 10]} />
            <RechartsTooltip cursor={{ strokeDasharray: "3 3" }} content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const p = payload[0]?.payload;
              return (
                <div className="rounded-xl border border-white/60 bg-white/80 p-2 text-xs shadow-lg">
                  <div className="flex items-center gap-2">
                    <span>{p.flag}</span><strong>{p.name}</strong>
                  </div>
                  <div>TDS: {p.tds} мг/л</div>
                  <div>pH: {p.ph}</div>
                </div>
              );
            }} />
            {data.map((d) => <Scatter key={d.id} data={[d]} fill={d.color} />)}
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      <LegendPills items={data.map((d) => ({ name: d.name, color: d.color, flag: d.flag }))} />
    </div>
  );
}

function RotationMock({ selected, profile }) {
  const lang = React.useContext(LangCtx);
  const t = I18N[lang];
  if (selected.length < 2) return <div className={`${GLASS.card} p-6 text-center text-slate-600`}>{t.misc.notEnough}</div>;
  const sorted = [...selected].sort((a, b) => compareForRanking(a, b, profile));
  const safe = sorted.filter((w) => computeCategory(w) !== "Therapeutic");
  const a = safe[0] ?? sorted[0];
  const b = safe[1] ?? sorted[1] ?? sorted[0];
  const plan = [1, 2, 3, 4, 5, 6, 7].map((day) => ({ day, w: day % 2 === 1 ? a : b }));
  return (
    <div className={`${GLASS.card} p-6`}>
      <div className="text-base sm:text-lg font-semibold text-slate-900 mb-3">{t.rotation.title}</div>
      <table className="w-full text-sm">
        <thead className="bg-white/70">
          <tr><th className="px-4 py-2 text-left">{t.rotation.day}</th><th className="px-4 py-2 text-left">{t.rotation.water}</th></tr>
        </thead>
        <tbody>
          {plan.map((p, i) => (
            <tr key={p.day} className={i % 2 ? "bg-white/40" : "bg-white/60"}>
              <td className="px-4 py-2 font-semibold">{p.day}</td>
              <td className="px-4 py-2">
                <span className="mr-2">{p.w.flag_emoji}</span>{p.w.brand_name}
                <CategoryBadge cat={computeCategory(p.w)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ReportAccordion({ selected, profile, compact, onToggleCompact }) {
  const lang = React.useContext(LangCtx);
  const t = I18N[lang];
  const [isOpen, setIsOpen] = useState(true);
  const winner = pickWinnerDaily(selected, profile);
  const sorted = [...selected].sort((a, b) => compareForRanking(a, b, profile));

  if (selected.length === 0) return <div className={`${GLASS.card} p-6 text-center text-slate-600`}>{t.misc.empty}</div>;

  return (
    <div className={`${GLASS.card} p-3 sm:p-6`}>
      <div className="flex flex-wrap items-center justify-between gap-2 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <div>
          <div className="text-base sm:text-lg font-semibold text-slate-900">{t.report.title}</div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="h-8 rounded-xl" onClick={(e) => { e.stopPropagation(); onToggleCompact(); }} type="button">
            {compact ? t.report.expanded : t.report.compact}
          </Button>
          <button className="p-2 hover:bg-white/50 rounded-full">
            {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="mt-4 space-y-5">
          {winner && (
            <div>
              <div className="text-sm font-medium text-slate-600 mb-2">
                {lang === "ru" ? `Лучший выбор для профиля "${t.profiles[profile].toLowerCase()}"` : `Best for "${t.profiles[profile].toLowerCase()}"`}
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <WaterProfileCard w={winner} profile={profile} rank={1} isWinner={true} />
                <div className={`${GLASS.card} p-4 h-[300px]`}>
                  <h4 className="text-sm font-semibold text-center mb-2">
                    {lang === "ru" ? "Профиль минералов" : "Mineral profile"}
                  </h4>
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={[
                      { metric: "Ca", value: normalizeValue(winner.ca_mg_l, REF.ca) },
                      { metric: "Mg", value: normalizeValue(winner.mg_mg_l, REF.mg) },
                      { metric: "Na", value: normalizeValue(winner.na_mg_l, REF.na) },
                      { metric: "Cl", value: normalizeValue(winner.cl_mg_l, REF.cl) },
                      { metric: "K", value: normalizeValue(winner.k_mg_l, REF.k) },
                      { metric: "TDS", value: normalizeValue(winner.tds_mg_l, REF.tds) },
                    ]}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="metric" />
                      <PolarRadiusAxis domain={[0, 100]} />
                      <Radar name={winner.brand_name} dataKey="value" stroke="#38BDF8" fill="#38BDF8" fillOpacity={0.6} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
          <div>
            <div className="text-sm font-medium text-slate-600 mb-2">{t.report.profilesBlock}</div>
            <div className={compact ? "space-y-3" : "grid gap-3 md:grid-cols-2"}>
              {sorted.map((w, i) =>
                compact
                  ? <WaterProfileCompactRow key={w.id} w={w} rank={i + 1} />
                  : <WaterProfileCard key={w.id} w={w} profile={profile} rank={i + 1} />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <LangCtx.Provider value="ru">
      <main className={GLASS.page}>
        <div className="mx-auto flex min-h-screen max-w-5xl items-center justify-center p-6">
          <section className={`${GLASS.card} w-full max-w-xl p-8 text-center`}>
            <div className="text-4xl">💧</div>
            <h1 className="mt-4 text-2xl font-semibold">Water Expert</h1>
            <p className="mt-2 text-slate-600">
              Сервис сравнения минеральной воды готов к работе.
            </p>
          </section>
        </div>
      </main>
    </LangCtx.Provider>
  );
}

export default App;
