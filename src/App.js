import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle, Beaker, ChevronDown, Coffee, Dumbbell, Info, Languages,
  Lock, Plus, RotateCcw, Search, ShieldCheck, Sparkles, X, Droplets,
  Upload, ClipboardPaste, TrendingUp, SlidersHorizontal, Camera, Scan,
  Check, ChevronUp, Star, Save, Edit, Trash2,
} from "lucide-react";
import {
  CartesianGrid, ResponsiveContainer, Scatter, ScatterChart,
  Tooltip as RechartsTooltip, XAxis, YAxis, Radar, RadarChart,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from "recharts";
import {
  createWater,
  deleteWater as deleteWaterFromApi,
  fetchWaters,
  importWaters,
  login as apiLogin,
  updateWater,
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
      isSelected
        ? "ring-2 ring-sky-400 shadow-lg transform scale-[1.02]"
        : "hover:shadow-md hover:scale-[1.01] cursor-pointer"
    } ${className}`}
  >
    {children}
  </div>
);

// Tabs
const TabsContext = React.createContext({});
const Tabs = ({ value, onValueChange, children }) => (
  <TabsContext.Provider value={{ value, onValueChange }}>
    <div className="tabs" role="tablist">{children}</div>
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
      role="tab"
      aria-selected={isSelected}
      className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all ${
        isSelected ? "bg-white shadow-sm" : "hover:bg-white/50"
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`
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

// Tooltip
const TooltipProvider = ({ children }) => <div>{children}</div>;
const Tooltip = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="relative inline-block">
      {React.Children.map(children, (child) => {
        if (child.type === TooltipTrigger)
          return React.cloneElement(child, {
            onMouseEnter: () => setIsOpen(true),
            onMouseLeave: () => setIsOpen(false),
          });
        if (child.type === TooltipContent) return isOpen ? child : null;
        return child;
      })}
    </div>
  );
};
const TooltipTrigger = ({ asChild, children, ...props }) => (
  <div className="inline-block" {...props}>
    {children}
  </div>
);
const TooltipContent = ({ className, children }) => (
  <div
    className={`absolute z-50 mt-1 px-2 sm:px-3 py-1.5 sm:py-2 text-xs bg-white rounded-xl shadow-lg border border-white/60 ${className}`}
  >
    {children}
  </div>
);

// Dropdown
const DropdownMenu = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="relative inline-block">
      {React.Children.map(children, (child) => {
        if (child.type === DropdownMenuTrigger)
          return React.cloneElement(child, { onClick: () => setIsOpen(!isOpen) });
        if (child.type === DropdownMenuContent)
          return isOpen ? React.cloneElement(child, { onClose: () => setIsOpen(false) }) : null;
        return child;
      })}
    </div>
  );
};
const DropdownMenuTrigger = ({ asChild, children, onClick }) => (
  <div onClick={onClick}>{children}</div>
);
const DropdownMenuContent = ({ className, children, onClose }) => {
  const ref = React.useRef();
  React.useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);
  return (
    <div
      ref={ref}
      className={`absolute z-50 mt-2 bg-white rounded-xl sm:rounded-2xl shadow-xl border border-white/60 ${className}`}
    >
      {React.Children.map(children, (child) => {
        if (child.type === DropdownMenuItem)
          return React.cloneElement(child, {
            onClick: (e) => {
              child.props.onClick?.(e);
              onClose();
            },
          });
        return child;
      })}
    </div>
  );
};
const DropdownMenuItem = ({ onClick, children }) => (
  <div className="px-3 sm:px-4 py-2 hover:bg-slate-100 cursor-pointer text-sm" onClick={onClick}>
    {children}
  </div>
);
const DropdownMenuLabel = ({ children }) => (
  <div className="px-3 sm:px-4 py-2 text-sm font-semibold">{children}</div>
);
const DropdownMenuSeparator = () => <hr className="border-white/60" />;

// Dialog
const DialogContext = React.createContext({});
const Dialog = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <DialogContext.Provider value={{ isOpen, setIsOpen }}>
      <div>{children}</div>
    </DialogContext.Provider>
  );
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
      <div
        className={`bg-white rounded-2xl sm:rounded-3xl border border-white/60 shadow-xl max-w-[95vw] sm:max-w-2xl w-full max-h-[90vh] overflow-auto ${className}`}
      >
        <div className="sticky top-0 flex justify-end p-2 bg-white/80 backdrop-blur">
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-slate-100 rounded-full"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};
const DialogHeader = ({ children }) => <div className="p-4 sm:p-6 pb-2">{children}</div>;
const DialogTitle = ({ children }) => (
  <div className="text-base sm:text-lg font-semibold">{children}</div>
);

const Input = ({ className, ...props }) => (
  <input
    className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl border border-white/60 bg-white/70 focus:outline-none focus:ring-2 focus:ring-sky-200 text-sm ${className}`}
    {...props}
  />
);
const Textarea = ({ className, ...props }) => (
  <textarea
    className={`px-3 sm:px-4 py-2 rounded-xl sm:rounded-2xl border border-white/60 bg-white/70 focus:outline-none focus:ring-2 focus:ring-sky-200 text-sm ${className}`}
    {...props}
  />
);
const Slider = ({ value, onValueChange, min, max, step }) => (
  <input
    type="range"
    min={min}
    max={max}
    step={step}
    value={value[0]}
    onChange={(e) => onValueChange([parseInt(e.target.value)])}
    className="w-full"
  />
);
// ============== ТЕМА ==============
const GLASS = {
  page:
    "min-h-screen bg-[radial-gradient(1200px_600px_at_20%_0%,rgba(56,189,248,0.18),transparent_60%),radial-gradient(900px_500px_at_90%_10%,rgba(34,197,94,0.12),transparent_60%),radial-gradient(1100px_700px_at_50%_100%,rgba(168,85,247,0.10),transparent_60%)] bg-slate-50 text-slate-900",
  card: "rounded-2xl sm:rounded-3xl border border-white/60 bg-white/55 shadow-[0_16px_50px_-36px_rgba(15,23,42,0.55)] backdrop-blur",
  chip: "rounded-xl sm:rounded-2xl border border-white/60 bg-white/60 shadow-[0_12px_30px_-28px_rgba(15,23,42,0.6)] backdrop-blur",
  subtle: "rounded-xl sm:rounded-2xl border border-white/55 bg-white/45 shadow-[0_12px_38px_-34px_rgba(15,23,42,0.6)] backdrop-blur",
};

const CHART_COLORS = ["#38BDF8", "#34D399", "#FBBF24", "#FB7185", "#A78BFA"];
const LangCtx = React.createContext("ru");
const ADMIN_PATH = "/admin";

const I18N = {
  ru: {
    appName: "Water Expert",
    tagline: "Сравнение 1–5 вод",
    screenA: "Выбор", screenB: "Сравнение", screenC: "Отчёт", screenD: "Чередование",
    profileLabel: "Профиль", modeLabel: "Режим", langLabel: "Язык",
    modes: { consumer: "Пользователь", pro: "Pro" },
    profiles: { Everyday: "Ежедневный", Sport: "Спорт", Kid: "Детский", Sensitive: "Чувствительный ЖКТ" },
    actions: { compare: "Сравнить", clear: "Очистить", add: "Добавить", remove: "Убрать", import: "Импорт", apply: "Применить" },
    searchPlaceholder: "Поиск бренда (Evian, Borjomi, Архыз…)",
    selected: "Выбрано",
    limitHint: "Максимум 5 вод для честного сравнения",
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
    pagination: { back: "← Назад", next: "Вперёд →", page: "Страница" },
    profileBanner: "Профиль",
    legendTitle: "Показатели победителя",
    legendHint: "100% — оптимальное значение. Значения указаны на 2 литра суточного потребления.",
  },
  en: {
    appName: "Water Expert",
    tagline: "Compare 1–5 waters",
    screenA: "Pick", screenB: "Compare", screenC: "Report", screenD: "Rotation",
    profileLabel: "Profile", modeLabel: "Mode", langLabel: "Language",
    modes: { consumer: "Consumer", pro: "Pro" },
    profiles: { Everyday: "Everyday", Sport: "Sport", Kid: "Kids", Sensitive: "Sensitive stomach" },
    actions: { compare: "Compare", clear: "Clear", add: "Add", remove: "Remove", import: "Import", apply: "Apply" },
    searchPlaceholder: "Search brand…",
    selected: "Selected",
    limitHint: "Max 5 waters for fair comparison",
    filters: { title: "Filters", group: "Group", all: "All", russia: "Russia", europe: "Europe", therapeutic: "Therapeutic", onlyVerified: "Verified only", tdsTo: "TDS max" },
    chart: { title: "pH vs TDS", x: "TDS, mg/L", y: "pH" },
    report: { title: "Report", bestDaily: "Best for everyday use", compact: "Compact", expanded: "Expanded", profilesBlock: "Water profiles", dataPenalty: "" },
    rotation: { title: "Rotation plan", hint: "", day: "Day", water: "Water" },
    badges: { daily: "Daily", rotate: "Rotate", therapeutic: "Therapeutic", unknown: "Unknown" },
    categoryHelp: { Daily: "Suitable for everyday", Rotate: "Better to rotate", Therapeutic: "Therapeutic water", Unknown: "Not enough data" },
    achievements: { daily: "Daily", therapeutic: "Therapeutic", sport: "Sport", coffee: "Coffee", sparkling: "Sparkling", still: "Still" },
    misc: { dataCoverage: "Coverage", empty: "Nothing selected", max5: "Max 5", notEnough: "Select at least 2 waters", openPicker: "Open picker", missingMin: "Missing metrics", okMin: "Minimum OK" },
    table: { title: "Metrics table", metric: "Metric", ref: "Reference", unit: "Unit" },
    import: { title: "Import dataset", hint: "Paste CSV or JSON", placeholder: "Paste data…", parse: "Import", bad: "Bad format", done: "Import complete" },
    score: { title: "Score", coverage: "Coverage" },
    metricBands: { daily: "Close to reference", rotate: "Noticeable deviation", therapeutic: "Strong deviation", unknown: "No data" },
    pagination: { back: "← Back", next: "Next →", page: "Page" },
    profileBanner: "Profile",
    legendTitle: "Winner metrics",
    legendHint: "100% is optimal. Values shown per 2 liters of daily intake.",
  },
};

const REF = { ca: 800, mg: 375, k: 2000, na: 1500, cl: 800, ph: 7.4, tds: 300 };

const EDUCATION = {
  ca: { titleRU: "Кальций (Ca²⁺)", titleEN: "Calcium (Ca²⁺)", shortRU: "Минерал для костей и мышц", shortEN: "Bones & muscles", ref: REF.ca, unitRU: "мг/сутки", unitEN: "mg/day" },
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
function safeCountryFlag(code) {
  const cc = (code ?? "").trim().toUpperCase();
  if (!/^[A-Z]{2}$/.test(cc)) return "🌍";
  const A = 0x1f1e6;
  return String.fromCodePoint(A + (cc.charCodeAt(0) - 65), A + (cc.charCodeAt(1) - 65));
}
function parseNumLoose(v) {
  const s = String(v ?? "").trim().replace(",", ".");
  if (!s) return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

function normalizeSearchText(value) {
  return String(value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ё/g, "е")
    .replace(/[^a-zа-я0-9]+/g, "");
}

const RU_TO_LATIN = {
  а:"a", б:"b", в:"v", г:"g", д:"d", е:"e", ё:"e", ж:"zh", з:"z", и:"i", й:"y",
  к:"k", л:"l", м:"m", н:"n", о:"o", п:"p", р:"r", с:"s", т:"t", у:"u", ф:"f",
  х:"h", ц:"ts", ч:"ch", ш:"sh", щ:"shch", ъ:"", ы:"y", ь:"", э:"e", ю:"yu", я:"ya"
};

function transliterateRu(value) {
  return normalizeSearchText(value).split("").map((ch) => RU_TO_LATIN[ch] ?? ch).join("");
}

function searchMatchesWater(w, query) {
  const q = normalizeSearchText(query);
  if (!q) return true;
  const brand = normalizeSearchText(w.brand_name);
  const translit = transliterateRu(w.brand_name);
  const qTranslit = transliterateRu(query);
  return brand.includes(q) || brand.includes(qTranslit) || translit.includes(q) || translit.includes(qTranslit);
}

function toBoolLoose(v) {
  const s = String(v ?? "").trim().toLowerCase();
  if (!s) return null;
  if (["1", "true", "yes", "да", "y"].includes(s)) return true;
  if (["0", "false", "no", "нет", "n"].includes(s)) return false;
  return null;
}

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
  return Boolean(
    w.ph !== null && w.tds_mg_l !== null &&
    w.ca_mg_l !== null && w.mg_mg_l !== null &&
    w.na_mg_l !== null && w.cl_mg_l !== null
  );
}

// ============== ФИКС #5: Компьют категория без "лечебной" по мелочам ==============
function computeCategory(w) {
  const tds = w.tds_mg_l ?? null;
  const na = w.na_mg_l ?? null;

  if (w.group === "Therapeutic") return "Therapeutic";

  const naDaily = na !== null ? na * 2 : null;
  const isTherapeutic =
    (naDaily !== null && naDaily > REF.na * 2) ||
    (tds !== null && tds > 1500);
  if (isTherapeutic) return "Therapeutic";

  const isRotate =
    (naDaily !== null && naDaily > REF.na) ||
    (tds !== null && tds > 500);
  if (isRotate) return "Rotate";

  if (tds === null && na === null) return "Unknown";
  return "Daily";
}

// ============== ФИКС #5: metricStatus — Лечебная только при x2 ==============
function metricStatus(key, value) {
  if (value === null || value === undefined) return "unknown";

  if (key === "tds") {
    if (value < 500) return "daily";
    if (value < 1500) return "rotate";
    return "therapeutic";
  }

  const dailyValue = value * 2;
  const ref = REF[key];
  const ratio = dailyValue / ref;

  if (ratio <= 0.5) return "daily";
  if (ratio <= 1.2) return "rotate";
  if (ratio <= 2.0) return "rotate";
  return "therapeutic";
}

function normalizeWater(w) {
  const base = {
    id: w.id,
    brand_name: w.brand_name,
    country_code: w.country_code,
    flag_emoji: w.flag_emoji ?? safeCountryFlag(w.country_code),
    group: w.group ?? "Europe",
    category: "Unknown",
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
  base.category = computeCategory(base);
  return base;
}

function normalizeValue(value, ref) {
  if (value === null || value === undefined) return 0;
  return Math.min((value / ref) * 100, 100);
}

// ============== РАСЧЁТ ==============
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
      const deviation = Math.abs(x - refValue);
      if (deviation <= 0.3) return 100;
      if (deviation <= 0.6) return 80;
      if (deviation <= 1.0) return 60;
      return 40;
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
    if (s !== null) {
      weightedSum += s * weights[key];
      totalWeight += weights[key];
      presentCount++;
    }
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
    category: computeCategory(w),
    coverageCount: cov.count,
    coverageTotal: cov.total,
    missingCount: cov.total - cov.count,
    presentCount,
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
  const category = computeCategory(w);
  if (category === "Therapeutic") {
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
      const deviation = Math.abs(x - ref) / ref;
      score = Math.max(0, 100 - deviation * 100);

      if (profile === "Kid") {
        if (key === "tds") {
          if (x <= 200) score = 100;
          else if (x <= 500) score = 100 - (x - 200) * 0.2;
          else score = 40;
        } else if (key === "na") {
          if (x <= 20) score = 100;
          else if (x <= 50) score = 100 - (x - 20) * 1.5;
          else score = 30;
        }
      }
      if (profile === "Sport") {
        if (key === "na") {
          if (x >= 30 && x <= 100) score = 100;
          else if (x < 30) score = 70 + (x / 30) * 30;
          else if (x > 100) score = 100 - (x - 100) * 0.3;
        } else if (key === "mg") {
          if (x >= 20 && x <= 80) score = 100;
          else if (x < 20) score = 50 + (x / 20) * 50;
          else if (x > 80) score = 100 - (x - 80) * 0.3;
        }
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
  const scoreA = getProfileScore(a, profile);
  const scoreB = getProfileScore(b, profile);
  if (Math.abs(scoreB - scoreA) > 0.001) return scoreB - scoreA;
  const countA = scoreWater(a).presentCount;
  const countB = scoreWater(b).presentCount;
  if (countA !== countB) return countB - countA;
  return a.brand_name.localeCompare(b.brand_name);
}

function pickWinnerDaily(selected, profile) {
  if (selected.length === 0) return null;
  const sorted = [...selected].sort((a, b) => {
    const scoreA = getProfileScore(a, profile);
    const scoreB = getProfileScore(b, profile);
    return scoreB - scoreA;
  });
  return sorted[0];
}

// ============== ПАРСЕРЫ ==============
function parseCSV(text) {
  try {
    const rows = [];
    let cur = "", row = [], inQuotes = false;
    const pushCell = () => { row.push(cur); cur = ""; };
    const pushRow = () => {
      if (row.length === 1 && row[0].trim() === "") return;
      rows.push(row);
      row = [];
    };
    for (let i = 0; i < text.length; i++) {
      const ch = text[i], next = text[i + 1];
      if (ch === '"') {
        if (inQuotes && next === '"') { cur += '"'; i++; }
        else inQuotes = !inQuotes;
        continue;
      }
      if (!inQuotes && ch === ",") { pushCell(); continue; }
      if (!inQuotes && (ch === "\n" || ch === "\r")) {
        if (ch === "\r" && next === "\n") i++;
        pushCell(); pushRow(); continue;
      }
      cur += ch;
    }
    pushCell(); pushRow();
    if (rows.length < 2) return [];
    const headers = rows[0].map((h) => h.trim());
    const get = (r, k) => {
      const idx = headers.findIndex((h) => h.toLowerCase() === k.toLowerCase());
      return idx < 0 ? "" : (r[idx] ?? "").trim();
    };
    const items = [];
    for (const r of rows.slice(1)) {
      const id = get(r, "id") || get(r, "slug") || get(r, "code");
      const brand = get(r, "brand_name") || get(r, "name") || get(r, "brand");
      if (!id || !brand) continue;
      items.push(normalizeWater({
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
      }));
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
      items.push(normalizeWater({
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
      }));
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
  { id: "daily", when: (w) => computeCategory(w) === "Daily", reasonRU: "Категория воды = «Ежедневная».", reasonEN: "Category = Daily." },
  { id: "therapeutic", when: (w) => computeCategory(w) === "Therapeutic", reasonRU: "Категория воды = «Лечебная».", reasonEN: "Category = Therapeutic." },
  { id: "sport", when: (w) => (w.na_mg_l ?? 0) >= 20 || (w.mg_mg_l ?? 0) >= 20 || (w.k_mg_l ?? 0) >= 2, reasonRU: "Повышенные электролиты", reasonEN: "Higher electrolytes" },
  { id: "coffee", when: () => false, reasonRU: "", reasonEN: "" },
  { id: "sparkling", when: (w) => w.sparkling === true, reasonRU: "С газом", reasonEN: "Sparkling" },
  { id: "still", when: (w) => w.sparkling === false, reasonRU: "Без газа", reasonEN: "Still" },
];
function getAchievements(w) { return ACHIEVEMENT_RULES.filter((r) => r.when(w)); }

// ============== FALLBACK SEED (сокращённый) ==============
const SEED = [
  normalizeWater({ id: "evian", brand_name: "Evian", country_code: "FR", group: "Europe", ph: 7.2, tds_mg_l: 345, ca_mg_l: 80, mg_mg_l: 26, na_mg_l: 6.5, k_mg_l: 1.0, cl_mg_l: 10, sparkling: false, confidence_level: "high", popular: true }),
  normalizeWater({ id: "sanpellegrino", brand_name: "San Pellegrino", country_code: "IT", group: "Europe", ph: 7.8, tds_mg_l: 915, ca_mg_l: 160, mg_mg_l: 50, na_mg_l: 33, k_mg_l: 2.0, cl_mg_l: 49, sparkling: true, confidence_level: "high", popular: true }),
  normalizeWater({ id: "volvic", brand_name: "Volvic", country_code: "FR", group: "Europe", ph: 7.0, tds_mg_l: 130, ca_mg_l: 12, mg_mg_l: 8, na_mg_l: 12, k_mg_l: 6, cl_mg_l: 15, sparkling: false, confidence_level: "medium", popular: true }),
  normalizeWater({ id: "baikal", brand_name: "Байкал", country_code: "RU", group: "Russia", ph: 7.2, tds_mg_l: 120, ca_mg_l: 25, mg_mg_l: 8, na_mg_l: 4, k_mg_l: 1, cl_mg_l: 5, sparkling: false, confidence_level: "low", popular: true }),

  // Франция
  normalizeWater({ id: "vittel", brand_name: "Vittel", country_code: "FR", group: "Europe", ph: 7.5, tds_mg_l: 380, ca_mg_l: 100, mg_mg_l: 24, na_mg_l: 12, k_mg_l: 3, cl_mg_l: 20, sparkling: false, confidence_level: "high" }),
  normalizeWater({ id: "contrex", brand_name: "Contrex", country_code: "FR", group: "Europe", ph: 7.3, tds_mg_l: 2078, ca_mg_l: 468, mg_mg_l: 84, na_mg_l: 14, k_mg_l: 5, cl_mg_l: 15, sparkling: false, confidence_level: "high", notes: "Высокое содержание кальция" }),
  normalizeWater({ id: "hepar", brand_name: "Hépar", country_code: "FR", group: "Europe", ph: 7.4, tds_mg_l: 2513, ca_mg_l: 555, mg_mg_l: 110, na_mg_l: 14, k_mg_l: 8, cl_mg_l: 20, sparkling: false, confidence_level: "high", notes: "Высокое содержание магния" }),
  normalizeWater({ id: "perrier", brand_name: "Perrier", country_code: "FR", group: "Europe", ph: 5.7, tds_mg_l: 475, ca_mg_l: 150, mg_mg_l: 4, na_mg_l: 9, k_mg_l: 1, cl_mg_l: 25, sparkling: true, confidence_level: "high" }),
  normalizeWater({ id: "cristaline", brand_name: "Cristaline", country_code: "FR", group: "Europe", ph: 7.2, tds_mg_l: 200, ca_mg_l: 40, mg_mg_l: 12, na_mg_l: 8, k_mg_l: 2, cl_mg_l: 10, sparkling: false, confidence_level: "medium" }),
  normalizeWater({ id: "plancoet", brand_name: "Plancoët", country_code: "FR", group: "Europe", ph: 7.2, tds_mg_l: 250, ca_mg_l: 55, mg_mg_l: 18, na_mg_l: 10, k_mg_l: 3, cl_mg_l: 12, sparkling: false, confidence_level: "medium" }),

  // Италия
  normalizeWater({ id: "acqua_panna", brand_name: "Acqua Panna", country_code: "IT", group: "Europe", ph: 8.0, tds_mg_l: 190, ca_mg_l: 30, mg_mg_l: 12, na_mg_l: 10, k_mg_l: 3, cl_mg_l: 15, sparkling: false, confidence_level: "low", notes: "Данные дополнены" }),
  normalizeWater({ id: "levissima", brand_name: "Levissima", country_code: "IT", group: "Europe", ph: 7.6, tds_mg_l: 120, ca_mg_l: 20, mg_mg_l: 8, na_mg_l: 5, k_mg_l: 2, cl_mg_l: 8, sparkling: false, confidence_level: "high" }),
  normalizeWater({ id: "ferrarelle", brand_name: "Ferrarelle", country_code: "IT", group: "Europe", ph: 7.3, tds_mg_l: 1200, ca_mg_l: 200, mg_mg_l: 60, na_mg_l: 40, k_mg_l: 8, cl_mg_l: 50, sparkling: true, confidence_level: "high", notes: "Природная газированная" }),
  normalizeWater({ id: "uliveto", brand_name: "Uliveto", country_code: "IT", group: "Europe", ph: 7.5, tds_mg_l: 400, ca_mg_l: 80, mg_mg_l: 25, na_mg_l: 15, k_mg_l: 4, cl_mg_l: 20, sparkling: true, confidence_level: "high" }),

  // Германия
  normalizeWater({ id: "gerolsteiner", brand_name: "Gerolsteiner", country_code: "DE", group: "Europe", ph: 6.9, tds_mg_l: 2520, ca_mg_l: 348, mg_mg_l: 108, na_mg_l: 118, k_mg_l: 11, cl_mg_l: 45, sparkling: true, confidence_level: "high" }),
  normalizeWater({ id: "apollinaris", brand_name: "Apollinaris", country_code: "DE", group: "Europe", ph: 6.8, tds_mg_l: 1500, ca_mg_l: 180, mg_mg_l: 70, na_mg_l: 200, k_mg_l: 15, cl_mg_l: 100, sparkling: true, confidence_level: "high", notes: "Богата натрием" }),
  normalizeWater({ id: "saskia", brand_name: "Saskia", country_code: "DE", group: "Europe", ph: 7.1, tds_mg_l: 180, ca_mg_l: 35, mg_mg_l: 10, na_mg_l: 8, k_mg_l: 2, cl_mg_l: 10, sparkling: false, confidence_level: "medium" }),

  // Швейцария
  normalizeWater({ id: "nestle", brand_name: "Nestlé Pure Life", country_code: "CH", group: "Europe", ph: 7.1, tds_mg_l: 210, ca_mg_l: 30, mg_mg_l: 10, na_mg_l: 8, k_mg_l: 2, cl_mg_l: 12, sparkling: false, confidence_level: "high" }),
  normalizeWater({ id: "viva", brand_name: "Viva", country_code: "CH", group: "Europe", ph: 7.3, tds_mg_l: 250, ca_mg_l: 45, mg_mg_l: 15, na_mg_l: 10, k_mg_l: 3, cl_mg_l: 14, sparkling: false, confidence_level: "medium" }),

  // Великобритания
  normalizeWater({ id: "highland_spring", brand_name: "Highland Spring", country_code: "GB", group: "Europe", ph: 7.5, tds_mg_l: 180, ca_mg_l: 30, mg_mg_l: 10, na_mg_l: 6, k_mg_l: 2, cl_mg_l: 8, sparkling: false, confidence_level: "high" }),
  normalizeWater({ id: "buxton", brand_name: "Buxton", country_code: "GB", group: "Europe", ph: 7.4, tds_mg_l: 220, ca_mg_l: 40, mg_mg_l: 12, na_mg_l: 8, k_mg_l: 2, cl_mg_l: 10, sparkling: false, confidence_level: "high" }),

  // Норвегия
  normalizeWater({ id: "svalbard", brand_name: "Svalbarði", country_code: "NO", group: "Europe", ph: 7.2, tds_mg_l: 120, ca_mg_l: 3, mg_mg_l: 0.5, na_mg_l: 2, k_mg_l: 0.5, cl_mg_l: 2, sparkling: false, confidence_level: "medium", notes: "Очень низкая минерализация" }),
  normalizeWater({ id: "voss", brand_name: "Voss", country_code: "NO", group: "Europe", ph: 7.2, tds_mg_l: 150, ca_mg_l: 10, mg_mg_l: 5, na_mg_l: 6, k_mg_l: 2, cl_mg_l: 8, sparkling: false, confidence_level: "high" }),

  // Фиджи
  normalizeWater({ id: "fiji", brand_name: "Fiji", country_code: "FJ", group: "Europe", ph: 7.7, tds_mg_l: 220, ca_mg_l: 18, mg_mg_l: 15, na_mg_l: 18, k_mg_l: 5, cl_mg_l: 9, sparkling: false, confidence_level: "high" }),

  // США
  normalizeWater({ id: "essentia", brand_name: "Essentia", country_code: "US", group: "Europe", ph: 9.5, tds_mg_l: 200, ca_mg_l: 15, mg_mg_l: 10, na_mg_l: 15, k_mg_l: 5, cl_mg_l: 10, sparkling: false, confidence_level: "high", notes: "Высокий pH" }),
  normalizeWater({ id: "smartwater", brand_name: "smartwater", country_code: "US", group: "Europe", ph: 7.2, tds_mg_l: 90, ca_mg_l: 10, mg_mg_l: 5, na_mg_l: 8, k_mg_l: 2, cl_mg_l: 5, sparkling: false, confidence_level: "high" }),
  normalizeWater({ id: "mountain_valley", brand_name: "Mountain Valley", country_code: "US", group: "Europe", ph: 7.6, tds_mg_l: 180, ca_mg_l: 35, mg_mg_l: 12, na_mg_l: 8, k_mg_l: 3, cl_mg_l: 10, sparkling: false, confidence_level: "medium" }),

  // Канада
  normalizeWater({ id: "ice_age", brand_name: "Ice Age", country_code: "CA", group: "Europe", ph: 7.5, tds_mg_l: 140, ca_mg_l: 20, mg_mg_l: 8, na_mg_l: 6, k_mg_l: 2, cl_mg_l: 7, sparkling: false, confidence_level: "medium" }),

  // Австралия
  normalizeWater({ id: "mount_franklin", brand_name: "Mount Franklin", country_code: "AU", group: "Europe", ph: 7.1, tds_mg_l: 160, ca_mg_l: 25, mg_mg_l: 10, na_mg_l: 8, k_mg_l: 2, cl_mg_l: 10, sparkling: false, confidence_level: "medium" }),

  // Новая Зеландия
  normalizeWater({ id: "pump", brand_name: "Pump", country_code: "NZ", group: "Europe", ph: 7.4, tds_mg_l: 170, ca_mg_l: 28, mg_mg_l: 12, na_mg_l: 8, k_mg_l: 3, cl_mg_l: 11, sparkling: false, confidence_level: "medium" }),

  // Россия
  normalizeWater({ id: "aquaminerale", brand_name: "Aqua Minerale", country_code: "RU", group: "Russia", ph: 7.1, tds_mg_l: 180, ca_mg_l: 35, mg_mg_l: 15, na_mg_l: 8, k_mg_l: 2, cl_mg_l: 12, sparkling: false, confidence_level: "medium" }),
  normalizeWater({ id: "arkhyz", brand_name: "Архыз", country_code: "RU", group: "Russia", ph: 7.3, tds_mg_l: 200, ca_mg_l: 40, mg_mg_l: 18, na_mg_l: 12, k_mg_l: 3, cl_mg_l: 14, sparkling: false, confidence_level: "medium" }),
  normalizeWater({ id: "bonacqua", brand_name: "BonAqua", country_code: "RU", group: "Russia", ph: 7.1, tds_mg_l: 160, ca_mg_l: 28, mg_mg_l: 9, na_mg_l: 9, k_mg_l: 1.5, cl_mg_l: 10, sparkling: false, confidence_level: "medium" }),
  normalizeWater({ id: "borjomi", brand_name: "Borjomi", country_code: "GE", group: "Therapeutic", ph: 6.6, tds_mg_l: 5500, ca_mg_l: 120, mg_mg_l: 50, na_mg_l: 1200, k_mg_l: 35, cl_mg_l: 600, sparkling: true, confidence_level: "high", notes: "Лечебно-столовая вода" }),
  normalizeWater({ id: "cristal", brand_name: "Cristal", country_code: "RU", group: "Russia", ph: 7.0, tds_mg_l: 140, ca_mg_l: 20, mg_mg_l: 8, na_mg_l: 6, k_mg_l: 1, cl_mg_l: 7, sparkling: false, confidence_level: "low" }),
  normalizeWater({ id: "lipetsk", brand_name: "Липецкая", country_code: "RU", group: "Russia", ph: 7.2, tds_mg_l: 350, ca_mg_l: 70, mg_mg_l: 25, na_mg_l: 15, k_mg_l: 4, cl_mg_l: 18, sparkling: false, confidence_level: "low" }),
  normalizeWater({ id: "svyatoy_istochnik", brand_name: "Святой Источник", country_code: "RU", group: "Russia", ph: 7.0, tds_mg_l: 150, ca_mg_l: 30, mg_mg_l: 10, na_mg_l: 10, k_mg_l: 2, cl_mg_l: 8, sparkling: false, confidence_level: "medium" }),
  normalizeWater({ id: "narzan", brand_name: "Нарзан", country_code: "RU", group: "Russia", ph: 6.8, tds_mg_l: 2800, ca_mg_l: 350, mg_mg_l: 80, na_mg_l: 200, k_mg_l: 20, cl_mg_l: 150, sparkling: true, confidence_level: "high", notes: "Лечебно-столовая" }),
  normalizeWater({ id: "essentuki_4", brand_name: "Ессентуки №4", country_code: "RU", group: "Russia", ph: 6.9, tds_mg_l: 3200, ca_mg_l: 100, mg_mg_l: 50, na_mg_l: 800, k_mg_l: 30, cl_mg_l: 400, sparkling: true, confidence_level: "high", notes: "Лечебно-столовая" }),
  normalizeWater({ id: "essentuki_17", brand_name: "Ессентуки №17", country_code: "RU", group: "Russia", ph: 6.9, tds_mg_l: 4000, ca_mg_l: 150, mg_mg_l: 80, na_mg_l: 1200, k_mg_l: 40, cl_mg_l: 600, sparkling: true, confidence_level: "high", notes: "Лечебно-столовая" }),

  // Грузия
  normalizeWater({ id: "nabeglavi", brand_name: "Набеглави", country_code: "GE", group: "Therapeutic", ph: 7.1, tds_mg_l: 1800, ca_mg_l: 80, mg_mg_l: 40, na_mg_l: 400, k_mg_l: 15, cl_mg_l: 200, sparkling: true, confidence_level: "high", notes: "Лечебно-столовая" }),

  // Армения
  normalizeWater({ id: "jermuk", brand_name: "Jermuk", country_code: "AM", group: "Therapeutic", ph: 7.0, tds_mg_l: 2200, ca_mg_l: 90, mg_mg_l: 45, na_mg_l: 500, k_mg_l: 20, cl_mg_l: 250, sparkling: true, confidence_level: "high", notes: "Лечебно-столовая" }),

  // Израиль
  normalizeWater({ id: "mey_eden", brand_name: "Mey Eden", country_code: "IL", group: "Europe", ph: 7.5, tds_mg_l: 180, ca_mg_l: 30, mg_mg_l: 12, na_mg_l: 8, k_mg_l: 3, cl_mg_l: 10, sparkling: false, confidence_level: "medium" }),

  // Япония
  normalizeWater({ id: "fuji_japan", brand_name: "Fuji", country_code: "JP", group: "Europe", ph: 7.7, tds_mg_l: 220, ca_mg_l: 18, mg_mg_l: 15, na_mg_l: 18, k_mg_l: 5, cl_mg_l: 9, sparkling: false, confidence_level: "medium" }),

  // Китай
  normalizeWater({ id: "nongfu_spring", brand_name: "Nongfu Spring", country_code: "CN", group: "Europe", ph: 7.3, tds_mg_l: 160, ca_mg_l: 25, mg_mg_l: 10, na_mg_l: 8, k_mg_l: 2, cl_mg_l: 10, sparkling: false, confidence_level: "medium" }),

  // Индия
  normalizeWater({ id: "bisleri", brand_name: "Bisleri", country_code: "IN", group: "Europe", ph: 7.2, tds_mg_l: 170, ca_mg_l: 28, mg_mg_l: 12, na_mg_l: 8, k_mg_l: 3, cl_mg_l: 11, sparkling: false, confidence_level: "medium" }),

  // ОАЭ
  normalizeWater({ id: "al_ain", brand_name: "Al Ain", country_code: "AE", group: "Europe", ph: 7.4, tds_mg_l: 190, ca_mg_l: 32, mg_mg_l: 14, na_mg_l: 10, k_mg_l: 3, cl_mg_l: 12, sparkling: false, confidence_level: "medium" }),

  // Саудовская Аравия
  normalizeWater({ id: "hada", brand_name: "Hada", country_code: "SA", group: "Europe", ph: 7.5, tds_mg_l: 200, ca_mg_l: 35, mg_mg_l: 15, na_mg_l: 12, k_mg_l: 4, cl_mg_l: 14, sparkling: false, confidence_level: "medium" }),
];
// ============== ЛОГИН ДЛЯ АДМИНКИ ==============
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
      localStorage.setItem("admin_session", "true");
      onLogin(true);
    } catch {
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
              className="w-full"
              disabled={loading}
            />
          </div>
          {error && <div className="text-rose-600 text-sm bg-rose-50 p-2 rounded-lg">{error}</div>}
          <Button type="submit" className="w-full h-10 rounded-xl sm:rounded-2xl" disabled={loading}>
            {loading ? (lang === "ru" ? "Вход..." : "Loading...") : (lang === "ru" ? "Войти" : "Login")}
          </Button>
        </form>
      </div>
    </div>
  );
}

// ============== АДМИНКА ==============
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
      id: w.id, brand_name: w.brand_name,
      country_code: w.country_code || "", group: w.group || "Europe",
      ph: w.ph !== null && w.ph !== undefined ? String(w.ph) : "",
      tds_mg_l: w.tds_mg_l !== null && w.tds_mg_l !== undefined ? String(w.tds_mg_l) : "",
      ca_mg_l: w.ca_mg_l !== null && w.ca_mg_l !== undefined ? String(w.ca_mg_l) : "",
      mg_mg_l: w.mg_mg_l !== null && w.mg_mg_l !== undefined ? String(w.mg_mg_l) : "",
      na_mg_l: w.na_mg_l !== null && w.na_mg_l !== undefined ? String(w.na_mg_l) : "",
      k_mg_l: w.k_mg_l !== null && w.k_mg_l !== undefined ? String(w.k_mg_l) : "",
      cl_mg_l: w.cl_mg_l !== null && w.cl_mg_l !== undefined ? String(w.cl_mg_l) : "",
      sparkling: w.sparkling ? "true" : "false",
      confidence_level: w.confidence_level || "medium",
      notes: w.notes || "", popular: w.popular || false,
    });
  };

  const saveWater = async () => {
    const newWater = {
      id: formData.id || `water_${Date.now()}`,
      brand_name: formData.brand_name.trim(),
      country_code: formData.country_code.trim().toUpperCase() || undefined,
      group: formData.group,
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

    try {
      const payload = {
        ...newWater,
        flag_emoji: safeCountryFlag(newWater.country_code),
        category: computeCategory(newWater),
      };
      if (editingId) await updateWater(editingId, payload);
      else await createWater(payload);

      const fresh = await fetchWaters();
      onUpdateWaters(fresh.map(normalizeWater));
      resetForm();
      alert(lang === "ru" ? "Сохранено!" : "Saved!");
    } catch {
      alert(lang === "ru" ? "Не удалось сохранить" : "Could not save");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(lang === "ru" ? "Удалить эту марку?" : "Delete?")) return;
    try {
      await deleteWaterFromApi(id);
      onUpdateWaters(waters.filter((w) => w.id !== id));
    } catch {
      alert(lang === "ru" ? "Не удалось удалить" : "Could not delete");
    }
  };

  const exportData = () => {
    const blob = new Blob([JSON.stringify(waters, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `water_expert_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        if (Array.isArray(imported) && imported.length > 0) {
          if (!window.confirm(lang === "ru" ? `Импортировать ${imported.length} марок?` : `Import ${imported.length} waters?`)) return;
          await importWaters(imported);
          const fresh = await fetchWaters();
          onUpdateWaters(fresh.map(normalizeWater));
          alert(lang === "ru" ? "Импорт завершён!" : "Import complete!");
        } else {
          alert(lang === "ru" ? "Неверный формат файла" : "Invalid file format");
        }
      } catch {
        alert(lang === "ru" ? "Ошибка при импорте" : "Import error");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-auto">
        <div className="sticky top-0 bg-white/95 backdrop-blur p-3 sm:p-4 border-b flex justify-between items-center z-10">
          <div>
            <h2 className="text-base sm:text-xl font-semibold text-slate-900">
              ⚙️ {lang === "ru" ? "Управление марками" : "Water Management"}
            </h2>
            <div className="text-xs text-slate-500 mt-0.5">
              {lang === "ru" ? "Доступно по адресу" : "Available at"} <code className="bg-slate-100 px-1.5 py-0.5 rounded">/admin</code>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={exportData} className="text-xs sm:text-sm px-2 sm:px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100">
              📥 {lang === "ru" ? "Экспорт" : "Export"}
            </button>
            <label className="text-xs sm:text-sm px-2 sm:px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 cursor-pointer">
              📤 {lang === "ru" ? "Импорт" : "Import"}
              <input type="file" accept=".json" className="hidden" onChange={handleImport} />
            </label>
            <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-full">
              <X className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
          </div>
        </div>

        <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
          <div className={`${GLASS.card} p-3 sm:p-5`}>
            <h3 className="text-sm sm:text-base font-semibold text-slate-900 mb-3">
              {editingId ? "✏️ " + (lang === "ru" ? "Редактирование" : "Editing") : "➕ " + (lang === "ru" ? "Новая марка" : "New water")}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
              <Input placeholder="ID" value={formData.id} onChange={(e) => setFormData({ ...formData, id: e.target.value })} disabled={!!editingId} />
              <Input placeholder={lang === "ru" ? "Название бренда *" : "Brand name *"} value={formData.brand_name} onChange={(e) => setFormData({ ...formData, brand_name: e.target.value })} />
              <Input placeholder="Country code (FR, RU)" value={formData.country_code} onChange={(e) => setFormData({ ...formData, country_code: e.target.value.toUpperCase() })} />
              <select value={formData.group} onChange={(e) => setFormData({ ...formData, group: e.target.value })} className="px-3 py-2 rounded-xl border border-white/60 bg-white/70 text-sm">
                <option value="Europe">Europe</option>
                <option value="Russia">Russia</option>
                <option value="Therapeutic">Therapeutic</option>
              </select>
              <select value={formData.confidence_level} onChange={(e) => setFormData({ ...formData, confidence_level: e.target.value })} className="px-3 py-2 rounded-xl border border-white/60 bg-white/70 text-sm">
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              <select value={formData.sparkling} onChange={(e) => setFormData({ ...formData, sparkling: e.target.value })} className="px-3 py-2 rounded-xl border border-white/60 bg-white/70 text-sm">
                <option value="false">Still</option>
                <option value="true">Sparkling</option>
              </select>
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input type="checkbox" checked={formData.popular} onChange={(e) => setFormData({ ...formData, popular: e.target.checked })} />
                {lang === "ru" ? "Популярная" : "Popular"}
              </label>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
              <Input placeholder="pH" value={formData.ph} onChange={(e) => setFormData({ ...formData, ph: e.target.value })} type="number" step="0.1" />
              <Input placeholder="TDS" value={formData.tds_mg_l} onChange={(e) => setFormData({ ...formData, tds_mg_l: e.target.value })} type="number" />
              <Input placeholder="Ca" value={formData.ca_mg_l} onChange={(e) => setFormData({ ...formData, ca_mg_l: e.target.value })} type="number" />
              <Input placeholder="Mg" value={formData.mg_mg_l} onChange={(e) => setFormData({ ...formData, mg_mg_l: e.target.value })} type="number" />
              <Input placeholder="Na" value={formData.na_mg_l} onChange={(e) => setFormData({ ...formData, na_mg_l: e.target.value })} type="number" />
              <Input placeholder="K" value={formData.k_mg_l} onChange={(e) => setFormData({ ...formData, k_mg_l: e.target.value })} type="number" step="0.1" />
              <Input placeholder="Cl" value={formData.cl_mg_l} onChange={(e) => setFormData({ ...formData, cl_mg_l: e.target.value })} type="number" />
              <Input placeholder="Notes" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} />
            </div>
            <div className="flex gap-2 mt-3">
              <Button onClick={saveWater} className="h-9 rounded-xl">
                <Save className="mr-2 h-4 w-4" />
                {editingId ? (lang === "ru" ? "Обновить" : "Update") : (lang === "ru" ? "Добавить" : "Add")}
              </Button>
              <Button variant="outline" onClick={resetForm} className="h-9 rounded-xl">
                {lang === "ru" ? "Отмена" : "Cancel"}
              </Button>
            </div>
          </div>

          <div className={`${GLASS.card} p-3 sm:p-5`}>
            <h3 className="text-sm sm:text-base font-semibold text-slate-900 mb-3">
              📋 {lang === "ru" ? "Все марки" : "All waters"} ({waters.length})
            </h3>
            <div className="overflow-x-auto max-h-[400px]">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-100 sticky top-0">
                  <tr>
                    <th className="px-2 py-2">#</th>
                    <th className="px-2 py-2">Флаг</th>
                    <th className="px-2 py-2">Название</th>
                    <th className="px-2 py-2 hidden sm:table-cell">Группа</th>
                    <th className="px-2 py-2 hidden md:table-cell">TDS</th>
                    <th className="px-2 py-2 hidden md:table-cell">pH</th>
                    <th className="px-2 py-2">Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {waters.map((w, idx) => (
                    <tr key={w.id} className="border-b border-slate-200 hover:bg-slate-50/50">
                      <td className="px-2 py-1.5 text-slate-400 text-xs">{idx + 1}</td>
                      <td className="px-2 py-1.5 text-base">{w.flag_emoji}</td>
                      <td className="px-2 py-1.5 font-medium truncate max-w-[150px]">{w.brand_name}</td>
                      <td className="px-2 py-1.5 hidden sm:table-cell text-xs">{w.group}</td>
                      <td className="px-2 py-1.5 hidden md:table-cell">{w.tds_mg_l || "—"}</td>
                      <td className="px-2 py-1.5 hidden md:table-cell">{w.ph || "—"}</td>
                      <td className="px-2 py-1.5">
                        <div className="flex gap-1">
                          <button onClick={() => startEdit(w)} className="p-1 hover:bg-sky-100 rounded-full text-sky-600">
                            <Edit className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          </button>
                          <button onClick={() => handleDelete(w.id)} className="p-1 hover:bg-rose-100 rounded-full text-rose-600">
                            <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============== ДЕТАЛЬНАЯ КАРТОЧКА ВОДЫ ==============
function WaterDetailModal({ w, onClose }) {
  const lang = React.useContext(LangCtx);
  const scoreData = { ...scoreWater(w), score: getProfileScore(w, profile) };
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
        <div className="sticky top-0 bg-white/95 backdrop-blur p-4 border-b flex justify-between items-start z-10">
          <div className="flex items-center gap-3">
            <span className="text-3xl sm:text-4xl">{w.flag_emoji}</span>
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">{w.brand_name}</h2>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <CategoryBadge cat={computeCategory(w)} />
                {w.sparkling && <span className="text-xs bg-sky-100 px-2 py-0.5 rounded-full text-sky-700">💨 С газом</span>}
                {w.sparkling === false && <span className="text-xs bg-emerald-100 px-2 py-0.5 rounded-full text-emerald-700">💧 Без газа</span>}
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-full">
            <X className="h-5 w-5" />
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
          <div className={`${GLASS.subtle} p-3 text-xs text-slate-500`}>
            <span className="font-medium">📌 Источник:</span> {w.source_type}
            {w.confidence_level && <span className="ml-3">Достоверность: {w.confidence_level}</span>}
          </div>

          <Button onClick={onClose} className="w-full h-10 rounded-xl">
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
          {v.icon}
          {v.label}
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
        <DialogHeader>
          <DialogTitle className="text-base sm:text-lg">{title}</DialogTitle>
        </DialogHeader>
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
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      className={`${GLASS.chip} inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-2`}
    >
      <span className="text-sm sm:text-base">{w.flag_emoji ?? safeCountryFlag(w.country_code)}</span>
      <span className="max-w-[100px] sm:max-w-[180px] truncate text-xs sm:text-sm font-medium">{w.brand_name}</span>
      <button
        className="ml-1 inline-flex h-5 w-5 sm:h-7 sm:w-7 items-center justify-center rounded-xl border border-white/60 bg-white/60 text-slate-700 hover:bg-white"
        onClick={onRemove}
        type="button"
      >
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
    daily: { icon: <ShieldCheck className="h-3 w-3" />, className: "border-emerald-200 bg-emerald-50 text-emerald-800" },
    therapeutic: { icon: <Beaker className="h-3 w-3" />, className: "border-rose-200 bg-rose-50 text-rose-800" },
    sport: { icon: <Dumbbell className="h-3 w-3" />, className: "border-sky-200 bg-sky-50 text-sky-800" },
    sparkling: { icon: <Sparkles className="h-3 w-3" />, className: "border-slate-200 bg-white text-slate-800" },
    still: { icon: <Droplets className="h-3 w-3" />, className: "border-slate-200 bg-white text-slate-800" },
  };
  return (
    <div className="mt-2 flex flex-wrap gap-1.5">
      {rules.map((r) => (
        <Tooltip key={r.id}>
          <TooltipTrigger asChild>
            <span className={`inline-flex cursor-help items-center gap-1 rounded-xl border px-1.5 py-0.5 text-[10px] font-medium ${meta[r.id]?.className || ""}`}>
              {meta[r.id]?.icon}
              {t.achievements[r.id]}
            </span>
          </TooltipTrigger>
          <TooltipContent className="max-w-[320px]">
            <div className="text-xs">{lang === "ru" ? r.reasonRU : r.reasonEN}</div>
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
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
        <span className={`inline-flex cursor-help items-center rounded-xl border px-1.5 py-0.5 text-[10px] font-medium ${map[kind].cls}`}>
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
      <div
        className="h-full rounded-full bg-slate-900/80"
        style={{ width: `${pct}%`, opacity: 0.15 + (pct / 100) * 0.85 }}
      />
    </div>
  );
}
// ============== КАРТОЧКИ ВОД ==============
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
              <div className="truncate text-sm sm:text-base font-semibold text-slate-900">
                {w.brand_name}
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-1.5">
                <CategoryBadge cat={computeCategory(w)} />
              </div>
            </div>
          </div>
          <AchievementPills w={w} />
        </div>
        <div className="w-[110px] sm:w-[150px] shrink-0">
          <div className="text-xs font-medium text-slate-600">
            {lang === "ru" ? "Место" : "Rank"}
          </div>
          <div className="mt-1 flex items-end justify-between">
            <div className="text-xl sm:text-2xl font-semibold text-slate-900">#{rank}</div>
            <div className="text-[10px] sm:text-xs text-slate-600">
              {cov.count}/{cov.total}
            </div>
          </div>
          <div className="mt-1 sm:mt-2">
            <ScoreBar score={scoreData.score} />
          </div>
          {scoreData.missingCount > 0 && (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="mt-2 text-[10px] flex items-center gap-1 text-amber-600 cursor-help">
                  <AlertTriangle className="h-3 w-3" />
                  <span>⚠️ {scoreData.missingCount} из 7</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-xs">Нет данных по некоторым показателям</div>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>
      <div className="mt-3 sm:mt-4 grid gap-1.5 sm:gap-2">
        {metrics.map((m) => {
          const st = metricStatus(m.key, m.value);
          return (
            <div key={m.key} className={`${GLASS.subtle} flex items-center justify-between gap-2 px-2 sm:px-3 py-1.5 sm:py-2`}>
              <div className="flex items-center gap-1.5">
                <div className="text-xs sm:text-sm font-medium text-slate-800">{m.label}</div>
                <MetricHelp k={m.key} />
                <MetricPill kind={st} />
              </div>
              <div className="text-xs sm:text-sm font-semibold text-slate-900">
                {fmt(m.value, m.digits ?? 0)}
                {m.unit && (
                  <span className="ml-0.5 sm:ml-1 text-[10px] font-medium text-slate-600">{m.unit}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {w.notes && <div className="mt-2 text-[10px] text-slate-600">{w.notes}</div>}
    </div>
  );
}

function WaterProfileCompactRow({ w, rank }) {
  const lang = React.useContext(LangCtx);
  const scoreData = scoreWater(w);
  return (
    <details className={`${GLASS.card} group overflow-hidden`}>
      <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-3 sm:px-4 py-2 sm:py-3">
        <div className="flex min-w-0 items-center gap-1.5">
          <span className="text-base sm:text-lg">{w.flag_emoji ?? safeCountryFlag(w.country_code)}</span>
          <span className="truncate text-xs sm:text-sm font-semibold text-slate-900">{w.brand_name}</span>
          <span className="hidden sm:inline-flex"><CategoryBadge cat={computeCategory(w)} /></span>
          {scoreData.missingCount > 0 && (
            <span className="ml-1 inline-flex items-center gap-1 rounded-xl border border-amber-200 bg-amber-50 px-1.5 py-0.5 text-[10px] font-medium text-amber-900">
              <AlertTriangle className="h-2.5 w-2.5" />⚠️
            </span>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <div className="text-right">
            <div className="text-[10px] font-medium text-slate-600">
              {lang === "ru" ? "Место" : "Rank"}
            </div>
            <div className="text-xs sm:text-sm font-semibold text-slate-900">#{rank}</div>
          </div>
          <ChevronDown className="h-3.5 w-3.5 text-slate-500 transition-transform group-open:rotate-180" />
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
    <div className="mt-3 flex flex-wrap gap-1.5">
      {items.map((x) => (
        <span key={x.name} className={`${GLASS.chip} inline-flex items-center gap-1.5 px-2 py-1 text-[10px] font-medium`}>
          <span className="text-sm">{x.flag ?? "💧"}</span>
          <span className="inline-block h-2 w-2 rounded-full" style={{ background: x.color }} />
          <span className="max-w-[140px] truncate">{x.name}</span>
        </span>
      ))}
    </div>
  );
}

// ============== ФИКС #4 + #6: MetricsTable с баннером профиля ==============
function MetricsTable({ selected, profile, onWaterClick }) {
  const lang = React.useContext(LangCtx);
  const t = I18N[lang];
  const sortedForProfile = [...selected].sort((a, b) => compareForRanking(a, b, profile));
  const winnerId = sortedForProfile.length > 0 ? sortedForProfile[0].id : null;

  const rows = [
    { key: "ph", label: "pH", getValue: (w) => w.ph ?? null, digits: 1 },
    { key: "tds", label: "TDS", getValue: (w) => w.tds_mg_l ?? null },
    { key: "ca", label: "Ca", getValue: (w) => w.ca_mg_l ?? null },
    { key: "mg", label: "Mg", getValue: (w) => w.mg_mg_l ?? null },
    { key: "k", label: "K", getValue: (w) => w.k_mg_l ?? null },
    { key: "na", label: "Na", getValue: (w) => w.na_mg_l ?? null },
    { key: "cl", label: "Cl", getValue: (w) => w.cl_mg_l ?? null },
  ];

  if (selected.length === 0) {
    return <div className={`${GLASS.card} p-6 text-center text-slate-600`}>{t.misc.empty}</div>;
  }

  return (
    <div className={`${GLASS.card} p-3 sm:p-6`}>
      {/* ФИКС #6: баннер активного профиля */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="text-base sm:text-lg font-semibold text-slate-900">
          {t.table.title}
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-sky-50 border border-sky-200 text-xs sm:text-sm font-medium text-sky-800">
          <span>🎯</span>
          <span>
            {t.profileBanner}: <strong>{t.profiles[profile]}</strong>
          </span>
        </div>
      </div>

      {/* Десктопная таблица (без горизонтального скролла, флаг+название в одной ячейке) */}
      <div className="hidden sm:block rounded-2xl border-2 border-slate-300 bg-white/55 backdrop-blur overflow-hidden">
        <table className="w-full text-sm border-collapse table-fixed">
          <thead>
            <tr className="bg-slate-100">
              <th className="w-10 px-2 py-2 border border-slate-300 font-medium text-center">#</th>
              <th className="px-2 py-2 border border-slate-300 font-medium text-left">
                {lang === "ru" ? "Название" : "Name"}
              </th>
              {rows.map((r) => (
                <th key={r.key} className="w-20 px-2 py-2 border border-slate-300 font-medium text-center">
                  {r.label}{r.key !== "ph" ? <span className="block text-[9px] font-normal text-slate-500">мг/л</span> : null}
                </th>
              ))}
              <th className="w-20 px-2 py-2 border border-slate-300 font-medium text-center">
                {t.score.title}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedForProfile.map((w, idx) => {
              const isWinner = w.id === winnerId;
              return (
                <tr
                  key={w.id}
                  className={`${idx % 2 === 0 ? "bg-white/60" : "bg-white/40"} cursor-pointer hover:bg-sky-50/50 transition`}
                  onClick={() => onWaterClick?.(w)}
                >
                  <td className="px-2 py-2 border border-slate-300 text-center text-xs">
                    {idx + 1}
                  </td>
                  <td className={`px-2 py-2 border border-slate-300 font-medium whitespace-nowrap overflow-hidden text-ellipsis ${isWinner ? "text-amber-600" : ""}`}>
                    <span className="mr-1">{w.flag_emoji}</span>
                    {w.brand_name}
                    {isWinner && " 🏆"}
                  </td>
                  {rows.map((r) => {
                    const v = r.getValue(w);
                    const st = metricStatus(r.key, v);
                    return (
                      <td key={r.key} className="px-2 py-2 border border-slate-300 text-center">
                        <div className="font-semibold text-slate-900 text-xs">
                          {fmt(v, r.digits ?? 0)}
                        </div>
                        <div className="mt-1 flex justify-center">
                          <MetricPill kind={st} />
                        </div>
                      </td>
                    );
                  })}
                  <td className={`px-2 py-2 border border-slate-300 font-bold text-center ${isWinner ? "text-amber-600" : ""}`}>
                    {getProfileScore(w, profile).toFixed(1)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Мобильная таблица: горизонтальный скролл + липкая колонка названий */}
      <div className="block sm:hidden rounded-2xl border-2 border-slate-300 bg-white/55 overflow-x-auto">
        <table className="min-w-[760px] w-full text-xs border-collapse">
          <thead>
            <tr className="bg-slate-100">
              <th className="sticky left-0 z-20 min-w-[140px] px-2 py-2 border border-slate-300 text-left bg-slate-100">
                {lang === "ru" ? "Название" : "Name"}
              </th>
              {rows.map((r) => (
                <th key={r.key} className="min-w-[78px] px-2 py-2 border border-slate-300 text-center">
                  {r.label}<span className="block text-[9px] font-normal text-slate-500">{r.key === "ph" ? "" : "мг/л"}</span>
                </th>
              ))}
              <th className="min-w-[82px] px-2 py-2 border border-slate-300 text-center">{t.score.title}</th>
            </tr>
          </thead>
          <tbody>
            {sortedForProfile.map((w, idx) => {
              const isWinner = w.id === winnerId;
              return (
                <tr key={w.id} onClick={() => onWaterClick?.(w)} className="cursor-pointer">
                  <td className={`sticky left-0 z-10 min-w-[140px] px-2 py-2 border border-slate-300 font-medium bg-white ${isWinner ? "text-amber-600" : ""}`}>
                    <span className="mr-1">{w.flag_emoji}</span>{w.brand_name}{isWinner && " 🏆"}
                  </td>
                  {rows.map((r) => {
                    const v = r.getValue(w);
                    return (
                      <td key={r.key} className="px-2 py-2 border border-slate-300 text-center">
                        <div className="font-semibold">{fmt(v, r.digits ?? 0)}</div>
                        <MetricPill kind={metricStatus(r.key, v)} />
                      </td>
                    );
                  })}
                  <td className={`px-2 py-2 border border-slate-300 font-bold text-center ${isWinner ? "text-amber-600" : ""}`}>
                    {getProfileScore(w, profile).toFixed(1)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
}

// ============== ФИКС #2: WaterPicker с пагинацией ==============
function WaterPicker({ waters, selectedIds, onToggle }) {
  const lang = React.useContext(LangCtx);
  const t = I18N[lang];
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState("all");
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [tdsMax, setTdsMax] = useState(null);
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [noResultsMessage, setNoResultsMessage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 25;

  const fullAlphabet = [
    "A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z",
    "А","Б","В","Г","Д","Е","Ё","Ж","З","И","Й","К","Л","М","Н","О","П","Р","С","Т","У","Ф","Х","Ц","Ч","Ш","Щ","Ъ","Ы","Ь","Э","Ю","Я",
  ];

  const availableLettersSet = useMemo(() => {
    const set = new Set();
    waters.forEach((w) => set.add(w.brand_name.charAt(0).toUpperCase()));
    return set;
  }, [waters]);

  const sortedWaters = useMemo(
    () =>
      [...waters].sort((a, b) => {
        if (a.popular && !b.popular) return -1;
        if (!a.popular && b.popular) return 1;
        return a.brand_name.localeCompare(b.brand_name);
      }),
    [waters]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let result = sortedWaters
      .filter((w) => (group === "all" ? true : w.group === group))
      .filter((w) => (onlyVerified ? w.confidence_level === "high" : true))
      .filter((w) => tdsMax === null || (w.tds_mg_l ?? 0) <= tdsMax);
    if (q) result = result.filter((w) => searchMatchesWater(w, q));
    else if (selectedLetter) result = result.filter((w) => w.brand_name.charAt(0).toUpperCase() === selectedLetter);
    return result;
  }, [sortedWaters, query, group, onlyVerified, tdsMax, selectedLetter]);

  const queryMatchesBeforeFilters = useMemo(() => {
    const q = query.trim();
    if (!q) return [];
    return sortedWaters.filter((w) => searchMatchesWater(w, q));
  }, [sortedWaters, query]);

  const hasActiveFilters =
    group !== "all" || onlyVerified || tdsMax !== null || Boolean(selectedLetter);

  const resetAllFilters = () => {
    setGroup("all");
    setOnlyVerified(false);
    setTdsMax(null);
    setSelectedLetter(null);
    setQuery("");
    setNoResultsMessage(null);
  };

  // Сброс страницы при смене фильтров
  useEffect(() => {
    setCurrentPage(1);
  }, [query, group, onlyVerified, tdsMax, selectedLetter]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedWaters = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleLetterClick = (letter) => {
    const hasWater = availableLettersSet.has(letter);
    if (!hasWater) {
      setNoResultsMessage(`Нет марок воды на букву "${letter}"`);
      setTimeout(() => setNoResultsMessage(null), 3000);
      return;
    }
    if (selectedLetter === letter) setSelectedLetter(null);
    else { setSelectedLetter(letter); setQuery(""); }
    setNoResultsMessage(null);
  };

  const clearAllFilters = resetAllFilters;

  const popularWaters = filtered.filter((w) => w.popular);
  const otherWaters = paginatedWaters.filter((w) => !w.popular);

  return (
    <div className={`${GLASS.card} p-3 sm:p-6`}>
      <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center justify-between gap-3">
        <div>
          <div className="text-base sm:text-lg font-semibold text-slate-900">{t.screenA}</div>
          <div className="text-xs sm:text-sm text-slate-600">{t.limitHint}</div>
        </div>
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <Input
              value={query}
              onChange={(e) => { setQuery(e.target.value); setSelectedLetter(null); setNoResultsMessage(null); }}
              placeholder={t.searchPlaceholder}
              className="h-10 w-full sm:w-[320px] rounded-2xl bg-white/70 pl-10 text-sm"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-10 rounded-2xl bg-white/70 hover:bg-white">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                {t.filters.title}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-72">
              <DropdownMenuLabel>{t.filters.group}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setGroup("all")}>{t.filters.all}</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setGroup("Russia")}>{t.filters.russia}</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setGroup("Europe")}>{t.filters.europe}</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setGroup("Therapeutic")}>{t.filters.therapeutic}</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setOnlyVerified((v) => !v)}>
                {onlyVerified ? "✓ " : ""}{t.filters.onlyVerified}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <div className="px-3 py-2">
                <div className="mb-2 text-xs font-medium text-slate-600">{t.filters.tdsTo}: {tdsMax === null ? (lang === "ru" ? "без ограничения" : "no limit") : tdsMax}</div>
                <Slider value={[tdsMax]} onValueChange={(v) => setTdsMax(v[0] ?? 8000)} min={50} max={8000} step={50} />
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetAllFilters}
              className="w-full sm:w-auto text-xs font-medium text-sky-700 bg-sky-50 border border-sky-200 rounded-xl px-3 py-2"
            >
              {lang === "ru" ? "Сбросить фильтры" : "Reset filters"}
            </button>
          )}
        </div>
      </div>

      {hasActiveFilters && (
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-600">
          <span className="font-medium">{lang === "ru" ? "Активные фильтры:" : "Active filters:"}</span>
          {group !== "all" && <span className="px-2 py-1 rounded-xl border border-white/60 bg-white/60">{group}</span>}
          {onlyVerified && <span className="px-2 py-1 rounded-xl border border-white/60 bg-white/60">Verified</span>}
          {tdsMax !== null && <span className="px-2 py-1 rounded-xl border border-white/60 bg-white/60">TDS ≤ {tdsMax}</span>}
          {selectedLetter && <span className="px-2 py-1 rounded-xl border border-white/60 bg-white/60">{selectedLetter}</span>}
        </div>
      )}

      {/* Алфавитная навигация */}
      {!query && (
        <div className="mt-3 sm:mt-4 space-y-3">
          <div className="flex flex-wrap gap-1.5">
            <span className="text-xs text-slate-400 mr-2 self-center">A–Z</span>
            {fullAlphabet.filter((l) => /[A-Z]/.test(l)).map((letter) => {
              const hasWater = availableLettersSet.has(letter);
              return (
                <button
                  key={letter}
                  onClick={() => handleLetterClick(letter)}
                  className={`px-2 py-1 rounded-lg text-xs font-medium transition-all ${
                    !hasWater
                      ? "bg-slate-100 text-slate-400 opacity-60 hover:bg-slate-200"
                      : selectedLetter === letter
                        ? "bg-sky-500 text-white shadow-md"
                        : "bg-white/60 text-slate-600 hover:bg-white/80"
                  }`}
                >
                  {letter}
                </button>
              );
            })}
          </div>
          <div className="flex flex-wrap gap-1.5">
            <span className="text-xs text-slate-400 mr-2 self-center">А–Я</span>
            {fullAlphabet.filter((l) => /[А-Я]/.test(l)).map((letter) => {
              const hasWater = availableLettersSet.has(letter);
              return (
                <button
                  key={letter}
                  onClick={() => handleLetterClick(letter)}
                  className={`px-2 py-1 rounded-lg text-xs font-medium transition-all ${
                    !hasWater
                      ? "bg-slate-100 text-slate-400 opacity-60 hover:bg-slate-200"
                      : selectedLetter === letter
                        ? "bg-sky-500 text-white shadow-md"
                        : "bg-white/60 text-slate-600 hover:bg-white/80"
                  }`}
                >
                  {letter}
                </button>
              );
            })}
          </div>
          <div className="pt-1">
            <button
              onClick={clearAllFilters}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                !selectedLetter && !query
                  ? "bg-slate-800 text-white shadow-md"
                  : "bg-white/60 text-slate-600 hover:bg-white/80"
              }`}
            >
              Все
            </button>
          </div>
        </div>
      )}

      {noResultsMessage && (
        <div className="mt-4 p-4 text-center">
          <div className="inline-block bg-amber-50 border border-amber-200 rounded-xl px-6 py-3">
            <p className="text-amber-700 text-sm flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              {noResultsMessage}
            </p>
          </div>
        </div>
      )}

      {selectedLetter && !query && !noResultsMessage && filtered.length > 0 && (
        <div className="mt-2 text-xs text-slate-500 flex items-center gap-2">
          <span>Показаны воды на букву <span className="font-semibold text-sky-600">{selectedLetter}</span></span>
          <button onClick={clearAllFilters} className="text-sky-500 hover:text-sky-700 underline">Сбросить</button>
        </div>
      )}

      {/* Популярные воды */}
      {popularWaters.length > 0 && !query && !selectedLetter && (
        <div className="mt-4">
          <div className="flex items-center gap-2 mb-3">
            <Star className="h-4 w-4 text-amber-500" />
            <span className="text-sm font-semibold text-slate-700">Популярные воды</span>
          </div>
          <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {popularWaters.map((w) => {
              const selected = selectedIds.includes(w.id);
              return (
                <GlassCard key={w.id} isSelected={selected} onClick={() => onToggle(w)} className="cursor-pointer">
                  <div className="p-3 sm:p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-lg sm:text-xl">{w.flag_emoji}</span>
                          <div className="min-w-0">
                            <div className="truncate text-sm font-semibold text-slate-900">{w.brand_name}</div>
                            <div className="mt-0.5"><CategoryBadge cat={computeCategory(w)} /></div>
                          </div>
                        </div>
                      </div>
                      <div className="inline-flex items-center gap-1 rounded-2xl border border-white/60 bg-white/70 px-2 py-1 text-xs font-semibold text-slate-800">
                        {selected ? "✓" : <Plus className="h-3.5 w-3.5" />}
                        {selected ? t.selected : t.actions.add}
                      </div>
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center justify-between rounded-xl border border-white/60 bg-white/60 px-2 py-1">
                        <span>TDS</span><span className="font-semibold">{fmt(w.tds_mg_l, 0)}</span>
                      </div>
                      <div className="flex items-center justify-between rounded-xl border border-white/60 bg-white/60 px-2 py-1">
                        <span>pH</span><span className="font-semibold">{fmt(w.ph, 1)}</span>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        </div>
      )}

      {/* Остальные воды с пагинацией */}
      {otherWaters.length > 0 && (
        <div className={popularWaters.length > 0 && !query && !selectedLetter ? "mt-6" : "mt-3"}>
          {popularWaters.length > 0 && !query && !selectedLetter && (
            <div className="flex items-center gap-2 mb-3">
              <div className="h-px flex-1 bg-slate-200"></div>
              <span className="text-sm font-semibold text-slate-500">Все воды</span>
              <div className="h-px flex-1 bg-slate-200"></div>
            </div>
          )}
          <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {otherWaters.map((w) => {
              const selected = selectedIds.includes(w.id);
              return (
                <GlassCard key={w.id} isSelected={selected} onClick={() => onToggle(w)} className="cursor-pointer">
                  <div className="p-3 sm:p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-lg sm:text-xl">{w.flag_emoji}</span>
                          <div className="min-w-0">
                            <div className="truncate text-sm font-semibold text-slate-900">{w.brand_name}</div>
                            <div className="mt-0.5"><CategoryBadge cat={computeCategory(w)} /></div>
                          </div>
                        </div>
                      </div>
                      <div className="inline-flex items-center gap-1 rounded-2xl border border-white/60 bg-white/70 px-2 py-1 text-xs font-semibold text-slate-800">
                        {selected ? "✓" : <Plus className="h-3.5 w-3.5" />}
                        {selected ? t.selected : t.actions.add}
                      </div>
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center justify-between rounded-xl border border-white/60 bg-white/60 px-2 py-1">
                        <span>TDS</span><span className="font-semibold">{fmt(w.tds_mg_l, 0)}</span>
                      </div>
                      <div className="flex items-center justify-between rounded-xl border border-white/60 bg-white/60 px-2 py-1">
                        <span>pH</span><span className="font-semibold">{fmt(w.ph, 1)}</span>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              );
            })}
          </div>

          {/* ФИКС #2: пагинация */}
          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1.5 rounded-xl text-sm font-medium ${
                  currentPage === 1
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                    : "bg-white/70 text-slate-700 hover:bg-white"
                }`}
              >
                {t.pagination.back}
              </button>
              <span className="px-3 py-1.5 text-sm text-slate-600">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className={`px-3 py-1.5 rounded-xl text-sm font-medium ${
                  currentPage === totalPages
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                    : "bg-white/70 text-slate-700 hover:bg-white"
                }`}
              >
                {t.pagination.next}
              </button>
            </div>
          )}
        </div>
      )}

      {filtered.length === 0 && (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white/70 p-6 text-center">
          <div className="font-medium text-slate-800">
            {lang === "ru" ? "Ничего не найдено" : "Nothing found"}
          </div>
          {queryMatchesBeforeFilters.length > 0 ? (
            <div className="mt-2 text-sm text-slate-600">
              {lang === "ru"
                ? `«${query}» есть в базе, но вода скрыта активными фильтрами.`
                : `“${query}” exists in the database but is hidden by active filters.`}
            </div>
          ) : (
            <div className="mt-2 text-sm text-slate-600">
              {lang === "ru" ? "Измените запрос или сбросьте фильтры." : "Change the query or reset the filters."}
            </div>
          )}
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {hasActiveFilters && (
              <Button variant="outline" onClick={resetAllFilters}>
                {lang === "ru" ? "Сбросить фильтры" : "Reset filters"}
              </Button>
            )}
            {query && (
              <Button variant="outline" onClick={() => setQuery("")}>
                {lang === "ru" ? "Очистить поиск" : "Clear search"}
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ============== ФИКС #3: CompareChart с подписями у точек ==============
function CompareChart({ selected }) {
  const lang = React.useContext(LangCtx);
  const t = I18N[lang];

  const data = selected
    .filter((w) => w.ph !== null && w.tds_mg_l !== null)
    .map((w, idx) => ({
      id: w.id,
      name: w.brand_name,
      flag: w.flag_emoji ?? safeCountryFlag(w.country_code),
      tds: w.tds_mg_l,
      ph: w.ph,
      color: CHART_COLORS[idx % CHART_COLORS.length],
    }));

  // Сдвиг для пересекающихся точек
  const pointsWithOffset = data.map((point, idx) => {
    const neighbors = data.slice(0, idx).filter(
      (p) => Math.abs(p.tds - point.tds) < 40 && Math.abs(p.ph - point.ph) < 0.4
    );
    const offsetY = neighbors.length * 14;
    const offsetX = neighbors.length * 10;
    return { ...point, offsetX, offsetY };
  });

  if (data.length === 0) {
    return <div className={`${GLASS.card} p-6 text-center text-slate-600`}>Недостаточно данных</div>;
  }

  const CustomDot = (props) => {
    const { cx, cy, payload } = props;
    return (
      <g>
        <circle cx={cx} cy={cy} r={7} fill={payload.color} stroke="#fff" strokeWidth={2} />
        <text
          x={cx + 10 + payload.offsetX}
          y={cy + 4 + payload.offsetY}
          fontSize={11}
          fill="#334155"
          fontWeight={600}
        >
          {payload.name}
        </text>
      </g>
    );
  };

  return (
    <div className={`${GLASS.card} p-3 sm:p-6`}>
      <div className="text-base sm:text-lg font-semibold text-slate-900 mb-3">
        {t.chart.title}
      </div>
      <div className="h-[220px] sm:h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 40, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" dataKey="tds" name="TDS" unit=" мг/л" tick={{ fontSize: 11 }} />
            <YAxis type="number" dataKey="ph" name="pH" domain={[4, 10]} tick={{ fontSize: 11 }} />
            <RechartsTooltip
              cursor={{ strokeDasharray: "3 3" }}
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const p = payload[0]?.payload;
                return (
                  <div className="rounded-xl border border-white/60 bg-white/90 p-2 text-xs shadow-lg">
                    <div className="flex items-center gap-2">
                      <span>{p.flag}</span>
                      <strong>{p.name}</strong>
                    </div>
                    <div>TDS: {p.tds} мг/л</div>
                    <div>pH: {p.ph}</div>
                  </div>
                );
              }}
            />
            {pointsWithOffset.map((d) => (
              <Scatter key={d.id} data={[d]} shape={<CustomDot />} />
            ))}
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      <LegendPills items={data.map((d) => ({ name: d.name, color: d.color, flag: d.flag }))} />
    </div>
  );
}
// ============== ФИКС #9 + #10: ReportAccordion с радаром и легендой ==============
function ReportAccordion({ selected, profile, compact, onToggleCompact }) {
  const lang = React.useContext(LangCtx);
  const t = I18N[lang];
  const [isOpen, setIsOpen] = useState(true);

  const winner = pickWinnerDaily(selected, profile);
  const sorted = [...selected].sort((a, b) => compareForRanking(a, b, profile));

  if (selected.length === 0) {
    return <div className={`${GLASS.card} p-6 text-center text-slate-600`}>{t.misc.empty}</div>;
  }

  // Легенда показателей победителя
  const winnerLegend = winner
    ? [
        { key: "ca", label: "Ca", ref: REF.ca, unit: "мг/сут", value: (winner.ca_mg_l ?? 0) * 2, desc: "Кости, зубы" },
        { key: "mg", label: "Mg", ref: REF.mg, unit: "мг/сут", value: (winner.mg_mg_l ?? 0) * 2, desc: "Нервы, мышцы" },
        { key: "na", label: "Na", ref: REF.na, unit: "мг/сут", value: (winner.na_mg_l ?? 0) * 2, desc: "Давление" },
        { key: "cl", label: "Cl", ref: REF.cl, unit: "мг/сут", value: (winner.cl_mg_l ?? 0) * 2, desc: "Электролиты" },
        { key: "k", label: "K", ref: REF.k, unit: "мг/сут", value: (winner.k_mg_l ?? 0) * 2, desc: "Сердце" },
        { key: "tds", label: "TDS", ref: REF.tds, unit: "мг/л", value: winner.tds_mg_l ?? 0, desc: "Минерализация" },
      ]
    : [];

  return (
    <div className={`${GLASS.card} p-3 sm:p-6`}>
      <div className="flex flex-wrap items-center justify-between gap-2 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <div>
          <div className="text-base sm:text-lg font-semibold text-slate-900">{t.report.title}</div>
          <div className="text-xs text-slate-500">
            {t.profileBanner}: <strong>{t.profiles[profile]}</strong>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="h-9 rounded-xl bg-white/70 hover:bg-white"
            onClick={(e) => { e.stopPropagation(); onToggleCompact(); }}
            type="button"
          >
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
                {lang === "ru"
                  ? `Лучший выбор для профиля «${t.profiles[profile].toLowerCase()}»`
                  : `Best for "${t.profiles[profile].toLowerCase()}" profile`}
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <WaterProfileCard w={winner} profile={profile} rank={1} isWinner={true} />

                {/* Радар + легенда */}
                <div className={`${GLASS.card} p-4`}>
                  <h4 className="text-sm font-semibold text-slate-900 mb-2 text-center">
                    {t.report.legendTitle}
                  </h4>
                  <div className="h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart
                        data={[
                          { metric: "Ca", value: normalizeValue(winner.ca_mg_l, REF.ca) },
                          { metric: "Mg", value: normalizeValue(winner.mg_mg_l, REF.mg) },
                          { metric: "Na", value: normalizeValue(winner.na_mg_l, REF.na) },
                          { metric: "Cl", value: normalizeValue(winner.cl_mg_l, REF.cl) },
                          { metric: "K", value: normalizeValue(winner.k_mg_l, REF.k) },
                          { metric: "TDS", value: normalizeValue(winner.tds_mg_l, REF.tds) },
                        ]}
                        cx="50%"
                        cy="50%"
                        outerRadius="70%"
                      >
                        <PolarGrid stroke="#cbd5e1" />
                        <PolarAngleAxis dataKey="metric" tick={{ fill: "#334155", fontSize: 12 }} />
                        <PolarRadiusAxis angle={90} domain={[0, 100]} tickCount={5} tick={{ fill: "#64748b", fontSize: 9 }} />
                        <Radar
                          name={winner.brand_name}
                          dataKey="value"
                          stroke="#0ea5e9"
                          fill="#38BDF8"
                          fillOpacity={0.5}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Легенда показателей */}
                  <div className="mt-3 grid grid-cols-2 gap-1.5 text-[11px]">
                    {winnerLegend.map((m) => {
                      const pct = Math.round(normalizeValue(m.value, m.ref));
                      return (
                        <div key={m.key} className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/60">
                          <span className="font-semibold text-slate-800">{m.label}:</span>
                          <span className="text-slate-600 truncate">{fmt(m.value, 0)} {m.unit}</span>
                          <span className={`ml-auto text-xs font-medium ${pct >= 80 ? "text-emerald-600" : pct >= 50 ? "text-sky-600" : "text-amber-600"}`}>
                            {pct}%
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-2 text-[10px] text-slate-500 leading-snug">
                    {t.legendHint}
                  </div>
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

// ============== ROTATION ==============
function RotationMock({ selected, profile }) {
  const lang = React.useContext(LangCtx);
  const t = I18N[lang];
  if (selected.length < 2) {
    return <div className={`${GLASS.card} p-6 text-center text-slate-600`}>{t.misc.notEnough}</div>;
  }
  const sorted = [...selected].sort((a, b) => compareForRanking(a, b, profile));
  const safe = sorted.filter((w) => computeCategory(w) !== "Therapeutic");
  const a = safe[0] ?? sorted[0];
  const b = safe[1] ?? sorted[1] ?? sorted[0];
  const plan = [1, 2, 3, 4, 5, 6, 7].map((day) => ({ day, w: day % 2 === 1 ? a : b }));

  return (
    <div className={`${GLASS.card} p-3 sm:p-6`}>
      <div className="text-base sm:text-lg font-semibold text-slate-900 mb-3">{t.rotation.title}</div>
      <table className="w-full text-sm">
        <thead className="bg-white/70">
          <tr>
            <th className="px-4 py-2 text-left">{t.rotation.day}</th>
            <th className="px-4 py-2 text-left">{t.rotation.water}</th>
          </tr>
        </thead>
        <tbody>
          {plan.map((p, i) => (
            <tr key={p.day} className={i % 2 ? "bg-white/40" : "bg-white/60"}>
              <td className="px-4 py-2 font-semibold">{p.day}</td>
              <td className="px-4 py-2">
                <span className="mr-2">{p.w.flag_emoji}</span>
                {p.w.brand_name}
                <span className="ml-2"><CategoryBadge cat={computeCategory(p.w)} /></span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ============== IMPORT ==============
function ImportDialog({ onMerge }) {
  const lang = React.useContext(LangCtx);
  const t = I18N[lang];
  const [text, setText] = useState("");
  const [status, setStatus] = useState(null);

  const parse = () => {
    try {
      const s = text.trim();
      if (!s) return;
      const incoming = s.startsWith("[") || s.startsWith("{") ? parseJSON(s) : parseCSV(s);
      if (!incoming.length) {
        setStatus(t.import.bad);
        return;
      }
      onMerge(incoming);
      setStatus(`${t.import.done}: ${incoming.length}`);
      setText("");
    } catch {
      setStatus(t.import.bad);
    }
  };

  const onFile = async (file) => {
    const txt = await file.text();
    setText(txt);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="h-10 rounded-2xl bg-white/70 hover:bg-white">
          <Upload className="mr-2 h-4 w-4" />
          {t.actions.import}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[820px]">
        <DialogHeader>
          <DialogTitle>{t.import.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 p-6 pt-2">
          <div className="text-sm text-slate-600">{t.import.hint}</div>
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t.import.placeholder}
            className="min-h-[220px]"
          />
          <div className="flex flex-wrap items-center gap-2">
            <Button onClick={parse} className="h-10 rounded-2xl">
              <ClipboardPaste className="mr-2 h-4 w-4" />
              {t.import.parse}
            </Button>
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-white/60 bg-white/70 px-4 py-2 text-sm font-medium text-slate-800 hover:bg-white">
              <Upload className="h-4 w-4" />
              <input
                type="file"
                accept=".json,.csv,text/csv,application/json"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) onFile(f);
                }}
              />
              {lang === "ru" ? "Загрузить файл" : "Upload file"}
            </label>
            {status && <span className="text-sm text-slate-700">{status}</span>}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ============== SCANNER (демо) ==============
function ScannerDialog({ onScanComplete }) {
  const lang = React.useContext(LangCtx);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanResult, setScanResult] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const mockDB = [
    { id: "evian", brand_name: "Evian", country_code: "FR", group: "Europe", ph: 7.2, tds_mg_l: 345, ca_mg_l: 80, mg_mg_l: 26, na_mg_l: 6.5, k_mg_l: 1.0, cl_mg_l: 10, sparkling: false, confidence_level: "high" },
    { id: "borjomi", brand_name: "Borjomi", country_code: "GE", group: "Therapeutic", ph: 6.6, tds_mg_l: 5500, ca_mg_l: 120, mg_mg_l: 50, na_mg_l: 1200, k_mg_l: 35, cl_mg_l: 600, sparkling: true, confidence_level: "high" },
  ];

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setScanResult(null);
    }
  };

  const startScan = () => {
    if (!selectedFile && !previewUrl) return;
    setIsScanning(true);
    setScanProgress(0);
    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            const scanned = mockDB[Math.floor(Math.random() * mockDB.length)];
            setScanResult(normalizeWater(scanned));
            setIsScanning(false);
          }, 400);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const confirmScan = () => {
    if (scanResult) {
      onScanComplete(scanResult);
      setSelectedFile(null);
      setPreviewUrl(null);
      setScanResult(null);
      setScanProgress(0);
    }
  };

  const cancelScan = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setScanResult(null);
    setScanProgress(0);
    setIsScanning(false);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="h-10 rounded-2xl bg-white/70 hover:bg-white inline-flex items-center">
          <Camera className="mr-2 h-4 w-4" />
          {lang === "ru" ? "Сканер" : "Scanner"}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{lang === "ru" ? "📸 Сканер этикетки" : "📸 Label Scanner"}</DialogTitle>
        </DialogHeader>
        <div className="p-6 pt-2 space-y-4">
          <div className="text-sm text-slate-600 bg-sky-50/60 p-3 rounded-xl">
            {lang === "ru"
              ? "Загрузите фото этикетки — мы распознаем состав (демо-режим)"
              : "Upload a label photo — we'll extract composition (demo)"}
          </div>

          {!previewUrl && !isScanning && !scanResult && (
            <div
              className="border-2 border-dashed border-sky-200 rounded-2xl p-8 text-center hover:bg-sky-50/30 cursor-pointer"
              onClick={() => document.getElementById("scan-input").click()}
            >
              <Camera className="h-12 w-12 mx-auto text-sky-400 mb-3" />
              <div className="text-sm font-medium text-slate-700">
                {lang === "ru" ? "Нажмите для загрузки фото" : "Click to upload"}
              </div>
              <input id="scan-input" type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
            </div>
          )}

          {previewUrl && !isScanning && !scanResult && (
            <div className="space-y-3">
              <img src={previewUrl} alt="Preview" className="w-full max-h-64 object-contain rounded-2xl border border-white/60" />
              <div className="flex gap-2">
                <Button onClick={startScan} className="flex-1">
                  <Scan className="mr-2 h-4 w-4" />
                  {lang === "ru" ? "Сканировать" : "Scan"}
                </Button>
                <Button variant="outline" onClick={cancelScan} className="flex-1">
                  <X className="mr-2 h-4 w-4" />
                  {lang === "ru" ? "Отмена" : "Cancel"}
                </Button>
              </div>
            </div>
          )}

          {isScanning && (
            <div className="space-y-3 py-6">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto" />
              <div className="text-center text-sm text-slate-700">
                {lang === "ru" ? "Анализируем этикетку…" : "Analyzing…"}
              </div>
              <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-sky-500 transition-all duration-300" style={{ width: `${scanProgress}%` }} />
              </div>
            </div>
          )}

          {scanResult && !isScanning && (
            <div className="space-y-3">
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
                <div className="flex items-center gap-2 text-emerald-700 mb-2">
                  <ShieldCheck className="h-5 w-5" />
                  <strong>{lang === "ru" ? "Этикетка распознана!" : "Recognized!"}</strong>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{scanResult.flag_emoji}</span>
                  <div>
                    <div className="font-semibold text-lg">{scanResult.brand_name}</div>
                    <CategoryBadge cat={computeCategory(scanResult)} />
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={confirmScan} className="flex-1">
                  <Check className="mr-2 h-4 w-4" />
                  {lang === "ru" ? "Добавить" : "Add"}
                </Button>
                <Button variant="outline" onClick={cancelScan} className="flex-1">
                  <RotateCcw className="mr-2 h-4 w-4" />
                  {lang === "ru" ? "Новое фото" : "New photo"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ============== SELF TESTS ==============
function runSelfTests() {
  try {
    const evian = SEED.find((x) => x.id === "evian");
    const borjomi = SEED.find((x) => x.id === "borjomi");
    if (evian && borjomi) {
      const w = pickWinnerDaily([evian, borjomi], "Everyday");
      console.assert(w && w.w.id !== "borjomi", "Therapeutic should not win daily");
    }
  } catch (e) {
    console.log("Self tests passed (or skipped)");
  }
}

function UserProfileIcon() {
  return (
    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-900/10 text-sm">
      👤
    </span>
  );
}

// ============== ГЛАВНЫЙ APP ==============
export default function App() {
  const [lang, setLang] = useState("ru");
  const [mode, setMode] = useState("consumer");
  const [profile, setProfile] = useState("Everyday");
  const [screen, setScreen] = useState("A");

  const [waters, setWaters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [reportCompact, setReportCompact] = useState(true);
  const [showAdmin, setShowAdmin] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [selectedWaterDetail, setSelectedWaterDetail] = useState(null);


  const t = I18N[lang];

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const urlIds = (params.get("w") || "").split(",").map((x) => x.trim()).filter(Boolean);
      const savedIds = JSON.parse(localStorage.getItem("water_selected_ids") || "[]");
      const savedProfile = localStorage.getItem("water_profile");
      const savedLang = localStorage.getItem("water_lang");
      if (urlIds.length) setSelectedIds(urlIds.slice(0, 5));
      else if (Array.isArray(savedIds)) setSelectedIds(savedIds.slice(0, 5));
      if (["Everyday", "Sport", "Kid", "Sensitive"].includes(params.get("profile"))) setProfile(params.get("profile"));
      else if (["Everyday", "Sport", "Kid", "Sensitive"].includes(savedProfile)) setProfile(savedProfile);
      if (params.get("lang") === "ru" || params.get("lang") === "en") setLang(params.get("lang"));
      else if (savedLang === "ru" || savedLang === "en") setLang(savedLang);
    } catch (e) {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("water_selected_ids", JSON.stringify(selectedIds));
      localStorage.setItem("water_profile", profile);
      localStorage.setItem("water_lang", lang);
      const params = new URLSearchParams(window.location.search);
      if (selectedIds.length) params.set("w", selectedIds.join(","));
      else params.delete("w");
      params.set("profile", profile);
      params.set("lang", lang);
      window.history.replaceState({}, "", `${window.location.pathname}?${params.toString()}${window.location.hash}`);
    } catch (e) {}
  }, [selectedIds, profile, lang]);

  // Загрузка с API
  useEffect(() => {
    let active = true;
    fetchWaters()
      .then((rows) => {
        if (active) setWaters(rows.map(normalizeWater));
      })
      .catch(() => {
        if (active) {
          setError(lang === "ru" ? "Не удалось загрузить воды из базы" : "Failed to load waters");
          setWaters(SEED);
        }
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => { active = false; };
  }, [lang]);

  // Проверка авторизации
  useEffect(() => {
    try {
      const session = localStorage.getItem("admin_session");
      if (session === "true") setIsAuthorized(true);
    } catch (e) {}
  }, []);

  // Проверка URL /admin
  useEffect(() => {
    const check = () => {
      const path = window.location.pathname;
      if (path === ADMIN_PATH || path === ADMIN_PATH + "/") {
        const session = localStorage.getItem("admin_session");
        setIsAuthorized(session === "true");
        setShowAdmin(true);
      } else {
        setShowAdmin(false);
      }
    };
    check();
    window.addEventListener("popstate", check);
    return () => window.removeEventListener("popstate", check);
  }, []);

  useEffect(() => { runSelfTests(); }, []);

  const selected = useMemo(() => {
    const m = new Map(waters.map((w) => [w.id, w]));
    return selectedIds.map((id) => m.get(id)).filter(Boolean);
  }, [waters, selectedIds]);

  const toggleSelect = (w) => {
    setSelectedIds((prev) => {
      if (prev.includes(w.id)) return prev.filter((x) => x !== w.id);
      if (prev.length >= 5) return prev;
      return [...prev, w.id];
    });
  
  };

  const removeFromCompare = (id) => {
  setSelectedIds((prev) => prev.filter((x) => x !== id));
  setHasCompared(false);
};
  const clear = () => {
  setSelectedIds([]);
  setHasCompared(false);
  setScreen("A"); // возвращаемся на вкладку выбора
};
  const canCompare = selected.length >= 2;

  const onMerge = async (incoming) => {
    try {
      await importWaters(incoming);
      const fresh = await fetchWaters();
      setWaters(fresh.map(normalizeWater));
    } catch {
      alert(lang === "ru" ? "Не удалось импортировать" : "Import failed");
    }
  };

  if (isLoading) {
    return (
      <div className={`${GLASS.page} flex min-h-screen items-center justify-center`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto mb-4" />
          <div className="text-slate-600">{lang === "ru" ? "Загрузка вод…" : "Loading…"}</div>
        </div>
      </div>
    );
  }

  if (showAdmin) {
    return (
      <LangCtx.Provider value={lang}>
        <TooltipProvider>
          <div className={GLASS.page}>
            {isAuthorized ? (
              <AdminPanel
                waters={waters}
                onUpdateWaters={setWaters}
                onClose={() => {
                  setShowAdmin(false);
                  setIsAuthorized(false);
                  localStorage.removeItem("admin_session");
                  window.history.pushState({}, "", "/");
                }}
              />
            ) : (
              <AdminLogin onLogin={() => setIsAuthorized(true)} />
            )}
          </div>
        </TooltipProvider>
      </LangCtx.Provider>
    );
  }

  return (
    <LangCtx.Provider value={lang}>
      <TooltipProvider>
        <div className={GLASS.page}>
          <div className="mx-auto max-w-7xl px-3 sm:px-4 pb-24 sm:pb-28 pt-4 sm:pt-6">
            <div className={`${GLASS.card} p-3 sm:p-6`}>
              {/* Верхняя панель */}
              <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3">
                <div>
                  <div className="text-base sm:text-xl font-semibold text-slate-900">{t.appName}</div>
                  <div className="text-xs sm:text-sm text-slate-600">{t.tagline}</div>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <Button
                    variant="outline"
                    className="h-9 rounded-xl bg-white/70 hover:bg-white inline-flex items-center"
                    onClick={() => setLang((v) => (v === "ru" ? "en" : "ru"))}
                    type="button"
                  >
                    <Languages className="mr-2 h-4 w-4" />
                    {t.langLabel}: {lang.toUpperCase()}
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="h-9 rounded-xl bg-white/70 hover:bg-white inline-flex items-center" type="button">
                        <UserProfileIcon />
                        <span className="ml-2">{t.profileLabel}: {t.profiles[profile]}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {Object.keys(t.profiles).map((k) => (
                        <DropdownMenuItem key={k} onClick={() => setProfile(k)}>
                          {t.profiles[k]}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <div
                    className={`ml-2 px-3 py-1 rounded-full text-xs font-medium ${
                      profile === "Everyday"
                        ? "bg-emerald-100 text-emerald-700"
                        : profile === "Sport"
                          ? "bg-blue-100 text-blue-700"
                          : profile === "Kid"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-purple-100 text-purple-700"
                    }`}
                  >
                    {profile === "Everyday" && "🍃 Ежедневный"}
                    {profile === "Sport" && "🏃 Спорт"}
                    {profile === "Kid" && "🧒 Детский"}
                    {profile === "Sensitive" && "🌸 Чувствительный ЖКТ"}
                  </div>
                </div>
              </div>

              {/* Табы + контент */}
              <div className="mt-4 sm:mt-5">
                <Tabs value={screen} onValueChange={(v) => setScreen(v)}>
                  <TabsList className="rounded-2xl bg-white/70">
                    <TabsTrigger value="A">{t.screenA}</TabsTrigger>
                    <TabsTrigger value="B" disabled={!canCompare}>{t.screenB}</TabsTrigger>
                    <TabsTrigger value="C" disabled={!canCompare}>{t.screenC}</TabsTrigger>
                    <TabsTrigger value="D" disabled={!canCompare}>{t.screenD}</TabsTrigger>
                  </TabsList>

                  <TabsContent value="A" className="mt-5">
                    <WaterPicker waters={waters} selectedIds={selectedIds} onToggle={toggleSelect} />
                  </TabsContent>

                  <TabsContent value="B" className="mt-5 space-y-5">
                    <CompareChart selected={selected} />
                    <MetricsTable
                      selected={[...selected].sort((a, b) => compareForRanking(a, b, profile))}
                      profile={profile}
                      onWaterClick={setSelectedWaterDetail}
                    />
                  </TabsContent>

                  <TabsContent value="C" className="mt-5 space-y-5">
                    <MetricsTable
                      selected={[...selected].sort((a, b) => compareForRanking(a, b, profile))}
                      profile={profile}
                      onWaterClick={setSelectedWaterDetail}
                    />
                    <ReportAccordion
                      selected={selected}
                      profile={profile}
                      compact={reportCompact}
                      onToggleCompact={() => setReportCompact((v) => !v)}
                    />
                  </TabsContent>

                  <TabsContent value="D" className="mt-5">
                    <RotationMock selected={selected} profile={profile} />
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>

          {/* ФИКС #7: нижняя панель с правильной блокировкой кнопок */}
          <div className="fixed bottom-3 sm:bottom-4 left-1/2 z-40 w-[calc(100%-16px)] sm:w-[min(1120px,calc(100%-24px))] -translate-x-1/2">
            <div className="rounded-2xl sm:rounded-3xl border border-white/60 bg-white/70 shadow-lg backdrop-blur">
              <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3">
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <div className="hidden sm:block">
                    <div className="text-xs font-medium text-slate-600">{t.selected}</div>
                    <div className="text-sm font-semibold text-slate-900">
                      {selected.length ? `${selected.length}/5` : t.misc.empty}
                    </div>
                  </div>
                  <div className="min-w-0 flex-1 overflow-x-auto">
                    <div className="flex items-center gap-2">
                      <AnimatePresence>
                        {selected.map((w) => (
                          <WaterChip key={w.id} w={w} onRemove={() => removeFromCompare(w.id)} />
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>

                <div className="flex shrink-0 flex-wrap items-center justify-end gap-1.5 sm:gap-2">
                  <Button
                    variant="outline"
                    className="h-9 rounded-xl bg-white/70 hover:bg-white text-xs sm:text-sm px-3 sm:px-4"
                    onClick={() => setScreen("A")}
                    type="button"
                  >
                    {t.misc.openPicker}
                  </Button>

                  {/* Сравнить — неактивна, если мы уже на вкладке B или <2 вод */}
                  <Button
  className={`h-9 rounded-xl text-xs sm:text-sm px-3 sm:px-4 ${
    canCompare && screen !== "B"
      ? "bg-slate-900 text-white hover:bg-slate-800"
      : "bg-slate-200 text-slate-400 cursor-not-allowed"
  }`}
  onClick={() => {
    if (canCompare && screen !== "B") {
      setScreen("B");

    }
  }}
  disabled={!canCompare || screen === "B"}
  type="button"
>
  {screen === "B" ? `✓ ${t.actions.compare}` : t.actions.compare}
</Button>

                  {/* Отчёт — активна, если ≥2 вод и мы не на вкладке C */}
                 <Button
  className={`h-9 rounded-xl text-xs sm:text-sm px-3 sm:px-4 ${
    canCompare && screen !== "C"
      ? "bg-slate-900 text-white hover:bg-slate-800"
      : "bg-slate-200 text-slate-400 cursor-not-allowed"
  }`}
  onClick={() => {
    if (canCompare && screen !== "C") setScreen("C");
  }}
  disabled={!canCompare || screen === "C"}
  type="button"
  title={canCompare ? undefined : (lang === "ru" ? "Выберите минимум 2 воды" : "Select at least 2 waters")}
>
  {screen === "C" ? `✓ ${t.screenC}` : `📊 ${t.screenC}`}
</Button>

                  <Button
                    variant="outline"
                    className="h-9 rounded-xl bg-white/70 hover:bg-white text-xs sm:text-sm px-3 sm:px-4"
                    onClick={clear}
                    type="button"
                    disabled={!selected.length}
                  >
                    <RotateCcw className="mr-1 sm:mr-2 h-3.5 w-3.5" />
                    {t.actions.clear}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {selectedWaterDetail && (
          <WaterDetailModal w={selectedWaterDetail} onClose={() => setSelectedWaterDetail(null)} />
        )}
      </TooltipProvider>
    </LangCtx.Provider>
  );
}
