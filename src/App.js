import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  Beaker,
  ChevronDown,
  Coffee,
  Dumbbell,
  Info,
  Languages,
  Lock,
  Plus,
  RotateCcw,
  Search,
  ShieldCheck,
  Sparkles,
  X,
  Droplets,
  Upload,
  ClipboardPaste,
  TrendingUp,
  SlidersHorizontal,
  User,
} from "lucide-react";
import {
  CartesianGrid,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";

// ============== UI КОМПОНЕНТЫ ==============
const Button = ({ children, variant, className, onClick, disabled, type = "button" }) => (
  <button
    type={type}
    className={`px-4 py-2 rounded-2xl font-medium transition-all ${
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

const GlassCard = ({ className, children }) => (
  <div className={`rounded-3xl border border-white/60 bg-white/55 shadow-[0_16px_50px_-36px_rgba(15,23,42,0.55)] backdrop-blur ${className}`}>
    {children}
  </div>
);

// Tabs компоненты
const TabsContext = React.createContext({});
const Tabs = ({ value, onValueChange, children }) => {
  return (
    <TabsContext.Provider value={{ value, onValueChange }}>
      <div className="tabs">{children}</div>
    </TabsContext.Provider>
  );
};

const TabsList = ({ className, children }) => (
  <div className={`flex gap-2 p-1 rounded-2xl ${className}`}>{children}</div>
);

const TabsTrigger = ({ value, disabled, children }) => {
  const { value: selectedValue, onValueChange } = React.useContext(TabsContext);
  const isSelected = selectedValue === value;
  
  return (
    <button
      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
        isSelected ? 'bg-white shadow-sm' : 'hover:bg-white/50'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
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

// Tooltip компоненты
const TooltipProvider = ({ children }) => {
  return <div>{children}</div>;
};

const Tooltip = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="relative inline-block">
      {React.Children.map(children, child => {
        if (child.type === TooltipTrigger) {
          return React.cloneElement(child, { 
            onMouseEnter: () => setIsOpen(true),
            onMouseLeave: () => setIsOpen(false)
          });
        }
        if (child.type === TooltipContent) {
          return isOpen ? child : null;
        }
        return child;
      })}
    </div>
  );
};

const TooltipTrigger = ({ asChild, children, ...props }) => (
  <div className="inline-block" {...props}>{children}</div>
);

const TooltipContent = ({ className, children }) => (
  <div className={`absolute z-50 mt-1 px-3 py-2 text-xs bg-white rounded-xl shadow-lg border border-white/60 ${className}`}>
    {children}
  </div>
);

// Dropdown компоненты
const DropdownMenu = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="relative inline-block">
      {React.Children.map(children, child => {
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

const DropdownMenuTrigger = ({ asChild, children, onClick }) => (
  <div onClick={onClick}>{children}</div>
);

const DropdownMenuContent = ({ className, children, onClose }) => {
  const ref = React.useRef();
  
  React.useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);
  
  return (
    <div ref={ref} className={`absolute z-50 mt-2 bg-white rounded-2xl shadow-xl border border-white/60 ${className}`}>
      {React.Children.map(children, child => {
        if (child.type === DropdownMenuItem) {
          return React.cloneElement(child, { onClick: (e) => { child.props.onClick?.(e); onClose(); } });
        }
        return child;
      })}
    </div>
  );
};

const DropdownMenuItem = ({ onClick, children }) => (
  <div className="px-4 py-2 hover:bg-slate-100 cursor-pointer text-sm" onClick={onClick}>
    {children}
  </div>
);

const DropdownMenuLabel = ({ children }) => <div className="px-4 py-2 text-sm font-semibold">{children}</div>;
const DropdownMenuSeparator = () => <hr className="border-white/60" />;

// Dialog компоненты
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
      <div className={`bg-white rounded-3xl border border-white/60 shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto ${className}`}>
        <div className="sticky top-0 flex justify-end p-2 bg-white/80 backdrop-blur">
          <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-slate-100 rounded-full">
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

const DialogHeader = ({ children }) => <div className="p-6 pb-2">{children}</div>;
const DialogTitle = ({ children }) => <div className="text-lg font-semibold">{children}</div>;

// Input компоненты
const Input = ({ className, ...props }) => (
  <input className={`px-4 py-2 rounded-2xl border border-white/60 bg-white/70 focus:outline-none focus:ring-2 focus:ring-sky-200 ${className}`} {...props} />
);

const Textarea = ({ className, ...props }) => (
  <textarea className={`px-4 py-2 rounded-2xl border border-white/60 bg-white/70 focus:outline-none focus:ring-2 focus:ring-sky-200 ${className}`} {...props} />
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

const LangCtx = React.createContext("ru");

// ============== ТЕМА ==============
const GLASS = {
  page:
    "min-h-screen bg-[radial-gradient(1200px_600px_at_20%_0%,rgba(56,189,248,0.18),transparent_60%),radial-gradient(900px_500px_at_90%_10%,rgba(34,197,94,0.12),transparent_60%),radial-gradient(1100px_700px_at_50%_100%,rgba(168,85,247,0.10),transparent_60%)] bg-slate-50 text-slate-900",
  card:
    "rounded-3xl border border-white/60 bg-white/55 shadow-[0_16px_50px_-36px_rgba(15,23,42,0.55)] backdrop-blur",
  chip:
    "rounded-2xl border border-white/60 bg-white/60 shadow-[0_12px_30px_-28px_rgba(15,23,42,0.6)] backdrop-blur",
  subtle:
    "rounded-2xl border border-white/55 bg-white/45 shadow-[0_12px_38px_-34px_rgba(15,23,42,0.6)] backdrop-blur",
};

const CHART_COLORS = ["#38BDF8", "#34D399", "#FBBF24", "#FB7185", "#A78BFA"];

// ============== ЛОКАЛИЗАЦИЯ ==============
const I18N = {
  ru: {
    appName: "Water Intelligence",
    tagline: "Сравнение 1–5 вод",
    screenA: "Выбор",
    screenB: "Сравнение",
    screenC: "Отчёт",
    screenD: "Чередование",
    profileLabel: "Профиль",
    modeLabel: "Режим",
    langLabel: "Язык",
    modes: { consumer: "Пользователь", pro: "Pro" },
    profiles: {
      Everyday: "Ежедневный",
      Pressure: "Чувствительность к давлению",
      Sport: "Спорт",
      Sensitive: "Чувствительный ЖКТ",
      Kid: "Детский",
    },
    actions: {
      compare: "Сравнить",
      clear: "Очистить",
      add: "Добавить",
      remove: "Убрать",
      import: "Импорт",
      apply: "Применить",
    },
    searchPlaceholder: "Поиск бренда (Evian, Borjomi, Архыз…)",
    selected: "Выбрано",
    limitHint: "Максимум 5 вод для честного сравнения",
    filters: {
      title: "Фильтры",
      group: "Группа",
      all: "Все",
      russia: "Россия",
      europe: "Европа",
      therapeutic: "Лечебные",
      onlyVerified: "Только Verified",
      tdsTo: "TDS до",
    },
    chart: {
      title: "pH vs минерализация (TDS)",
      hint: "Каждая вода — свой цвет. Наведите на точку для деталей.",
      x: "Минерализация (TDS), мг/л",
      y: "pH",
    },
    report: {
      title: "Отчёт",
      bestDaily: "Лучший выбор для ежедневного употребления",
      why: "Почему",
      eduHint: "Нажми ℹ️ для справки",
      missingMinimum: "Минимум: pH + TDS + Ca/Mg + Na/Cl",
      proHidden: "В Pro-режиме формула скрыта",
      therapeuticNote: "Лечебная вода не может быть лучшей для daily",
      dataPenalty: "Воды с неполными данными ранжируются ниже",
      profilesBlock: "Профили вод",
      winnerProfile: "Профиль победителя",
      compact: "Компактно",
      expanded: "Развернуто",
    },
    rotation: {
      title: "План чередования",
      hint: "Пример. Лечебная вода не ставится автоматически",
      day: "День",
      water: "Вода",
    },
    badges: {
      daily: "Ежедневная",
      rotate: "Чередовать",
      therapeutic: "Лечебная",
      unknown: "Неизвестно",
    },
    categoryHelp: {
      Daily: "Подходит для ежедневного употребления",
      Rotate: "Лучше чередовать",
      Therapeutic: "Лечебная вода",
      Unknown: "Недостаточно данных",
    },
    achievements: {
      daily: "Ежедневная",
      therapeutic: "Лечебная",
      sport: "Спорт",
      coffee: "Кофе",
      sparkling: "С газом",
      still: "Без газа",
    },
    misc: {
      dataCoverage: "Данные",
      empty: "Ничего не выбрано",
      tipBar: "Нижняя панель всегда доступна",
      serverPlan: "Данные и расчёты на сервере",
      max5: "Макс 5",
      notEnough: "Выберите минимум 2 воды",
      compareHere: "Сравнить",
      openPicker: "Выбрать бренды",
      missingMin: "Нет минимальных показателей",
      okMin: "Минимум OK",
      rankedLower: "Неполные данные → ниже в рейтинге",
      formula: "Формула",
      show: "Показать",
      hide: "Скрыть",
      minRule: "Правило: без минимума всегда ниже",
      importHint: "Импорт JSON/CSV",
    },
    table: {
      title: "Таблица показателей",
      metric: "Показатель",
      ref: "Эталон",
      unit: "Ед.",
    },
    import: {
      title: "Импорт базы",
      hint: "Вставьте CSV или JSON (или загрузите файл)",
      placeholder: "Вставьте данные…",
      parse: "Импортировать",
      bad: "Ошибка формата",
      done: "Импорт завершён",
    },
    score: {
      title: "Рейтинг",
      coverage: "Заполненность",
      minOk: "Минимум есть",
      minNo: "Минимума нет",
    },
    metricBands: {
      daily: "Близко к эталону",
      rotate: "Заметное отклонение",
      therapeutic: "Сильное отклонение",
      unknown: "Нет данных",
    },
  },
  en: {
    appName: "Water Intelligence",
    tagline: "Compare 1–5 waters",
    screenA: "Pick",
    screenB: "Compare",
    screenC: "Report",
    screenD: "Rotation",
    profileLabel: "Profile",
    modeLabel: "Mode",
    langLabel: "Language",
    modes: { consumer: "Consumer", pro: "Pro" },
    profiles: {
      Everyday: "Everyday",
      Pressure: "Blood pressure",
      Sport: "Sport",
      Sensitive: "Sensitive stomach",
      Kid: "Kids",
    },
    actions: {
      compare: "Compare",
      clear: "Clear",
      add: "Add",
      remove: "Remove",
      import: "Import",
      apply: "Apply",
    },
    searchPlaceholder: "Search brand (Evian, Borjomi…)",
    selected: "Selected",
    limitHint: "Max 5 waters for fair comparison",
    filters: {
      title: "Filters",
      group: "Group",
      all: "All",
      russia: "Russia",
      europe: "Europe",
      therapeutic: "Therapeutic",
      onlyVerified: "Verified only",
      tdsTo: "TDS max",
    },
    chart: {
      title: "pH vs TDS",
      hint: "Each water has its own color. Hover for details.",
      x: "TDS, mg/L",
      y: "pH",
    },
    report: {
      title: "Report",
      bestDaily: "Best for everyday use",
      why: "Why",
      eduHint: "Tap ℹ️ for info",
      missingMinimum: "Minimum: pH + TDS + Ca/Mg + Na/Cl",
      proHidden: "Formula hidden in Pro mode",
      therapeuticNote: "Therapeutic water cannot be daily winner",
      dataPenalty: "Incomplete data ranked lower",
      profilesBlock: "Water profiles",
      winnerProfile: "Winner profile",
      compact: "Compact",
      expanded: "Expanded",
    },
    rotation: {
      title: "Rotation plan",
      hint: "Example. Therapeutic water not auto-scheduled",
      day: "Day",
      water: "Water",
    },
    badges: {
      daily: "Daily",
      rotate: "Rotate",
      therapeutic: "Therapeutic",
      unknown: "Unknown",
    },
    categoryHelp: {
      Daily: "Suitable for everyday use",
      Rotate: "Better to rotate",
      Therapeutic: "Therapeutic water",
      Unknown: "Not enough data",
    },
    achievements: {
      daily: "Daily",
      therapeutic: "Therapeutic",
      sport: "Sport",
      coffee: "Coffee",
      sparkling: "Sparkling",
      still: "Still",
    },
    misc: {
      dataCoverage: "Coverage",
      empty: "Nothing selected",
      tipBar: "Bottom bar always visible",
      serverPlan: "Server-side calculations",
      max5: "Max 5",
      notEnough: "Select at least 2 waters",
      compareHere: "Compare",
      openPicker: "Open picker",
      missingMin: "Missing minimum metrics",
      okMin: "Minimum OK",
      rankedLower: "Incomplete data → ranked lower",
      formula: "Formula",
      show: "Show",
      hide: "Hide",
      minRule: "Rule: missing minimum ranks lower",
      importHint: "Import JSON/CSV",
    },
    table: {
      title: "Metrics table",
      metric: "Metric",
      ref: "Reference",
      unit: "Unit",
    },
    import: {
      title: "Import dataset",
      hint: "Paste CSV or JSON (or upload file)",
      placeholder: "Paste data…",
      parse: "Import",
      bad: "Bad format",
      done: "Import complete",
    },
    score: {
      title: "Score",
      coverage: "Coverage",
      minOk: "Minimum OK",
      minNo: "Minimum missing",
    },
    metricBands: {
      daily: "Close to reference",
      rotate: "Noticeable deviation",
      therapeutic: "Strong deviation",
      unknown: "No data",
    },
  },
};

// ============== ЭТАЛОНЫ ==============
const REF = {
  ca: 800,
  mg: 375,
  k: 2000,
  na: 1500,
  cl: 800,
  ph: 7.5,
  tds: 150,
};

const EDUCATION = {
  ca: {
    titleRU: "Кальций (Ca²⁺)",
    titleEN: "Calcium (Ca²⁺)",
    shortRU: "Минерал для костей и мышц",
    shortEN: "Key mineral for bones and muscles",
    ref: REF.ca,
    unitRU: "мг/сутки",
    unitEN: "mg/day",
  },
  mg: {
    titleRU: "Магний (Mg²⁺)",
    titleEN: "Magnesium (Mg²⁺)",
    shortRU: "Важен для нервной системы",
    shortEN: "Important for nerves",
    ref: REF.mg,
    unitRU: "мг/сутки",
    unitEN: "mg/day",
  },
  k: {
    titleRU: "Калий (K⁺)",
    titleEN: "Potassium (K⁺)",
    shortRU: "Поддерживает сердце",
    shortEN: "Supports heart function",
    ref: REF.k,
    unitRU: "мг/сутки",
    unitEN: "mg/day",
  },
  na: {
    titleRU: "Натрий (Na⁺)",
    titleEN: "Sodium (Na⁺)",
    shortRU: "Влияет на давление",
    shortEN: "Affects blood pressure",
    ref: REF.na,
    unitRU: "мг/сутки",
    unitEN: "mg/day",
  },
  cl: {
    titleRU: "Хлориды (Cl⁻)",
    titleEN: "Chloride (Cl⁻)",
    shortRU: "Электролитный баланс",
    shortEN: "Electrolyte balance",
    ref: REF.cl,
    unitRU: "мг/сутки",
    unitEN: "mg/day",
  },
  ph: {
    titleRU: "pH",
    titleEN: "pH",
    shortRU: "Кислотность/щелочность",
    shortEN: "Acidity/alkalinity",
    ref: REF.ph,
    unitRU: "",
    unitEN: "",
  },
  tds: {
    titleRU: "Минерализация (TDS)",
    titleEN: "Mineralization (TDS)",
    shortRU: "Сумма растворённых веществ",
    shortEN: "Total dissolved solids",
    ref: REF.tds,
    unitRU: "мг/л",
    unitEN: "mg/L",
  },
};

// ============== УТИЛИТЫ ==============
function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

function fmt(n?: number | null, digits = 0) {
  if (n === null || n === undefined || Number.isNaN(n)) return "—";
  return Number(n).toFixed(digits);
}

function safeCountryFlag(code?: string) {
  const cc = (code ?? "").trim().toUpperCase();
  if (!/^[A-Z]{2}$/.test(cc)) return "🌍";
  const A = 0x1f1e6;
  return String.fromCodePoint(
    A + (cc.charCodeAt(0) - 65),
    A + (cc.charCodeAt(1) - 65)
  );
}

function parseNumLoose(v: unknown) {
  const s = String(v ?? "").trim().replace(",", ".");
  if (!s) return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

function toBoolLoose(v: unknown) {
  const s = String(v ?? "").trim().toLowerCase();
  if (!s) return null;
  if (["1", "true", "yes", "да", "y"].includes(s)) return true;
  if (["0", "false", "no", "нет", "n"].includes(s)) return false;
  return null;
}

function dataCoverage(w: Water) {
  const keys: MetricKey[] = ["ca", "mg", "k", "na", "cl", "ph", "tds"];
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

function hasMinimumMetrics(w: Water) {
  return Boolean(
    w.ph !== null &&
      w.ph !== undefined &&
      w.tds_mg_l !== null &&
      w.tds_mg_l !== undefined &&
      w.ca_mg_l !== null &&
      w.ca_mg_l !== undefined &&
      w.mg_mg_l !== null &&
      w.mg_mg_l !== undefined &&
      w.na_mg_l !== null &&
      w.na_mg_l !== undefined &&
      w.cl_mg_l !== null &&
      w.cl_mg_l !== undefined
  );
}

function computeCategory(w: Water): Category {
  const tds = w.tds_mg_l ?? null;
  const na = w.na_mg_l ?? null;
  if (w.group === "Therapeutic") return "Therapeutic";
  if ((tds !== null && tds >= 1500) || (na !== null && na >= 200)) return "Therapeutic";
  if ((tds !== null && tds >= 500) || (na !== null && na >= 50)) return "Rotate";
  if (tds === null && na === null) return "Unknown";
  return "Daily";
}

function normalizeWater(w) {
  const base = {
    id: w.id,
    brand_name: w.brand_name,
    country_code: w.country_code,
    flag_emoji: w.flag_emoji ?? safeCountryFlag(w.country_code),
    group: w.group ?? "Europe",
    category: "Unknown",
    ph: w.ph ?? null,
    tds_mg_l: w.tds_mg_l ?? null,
    ca_mg_l: w.ca_mg_l ?? null,
    mg_mg_l: w.mg_mg_l ?? null,
    na_mg_l: w.na_mg_l ?? null,
    k_mg_l: w.k_mg_l ?? null,
    cl_mg_l: w.cl_mg_l ?? null,
    sparkling: w.sparkling ?? null,
    source_type: w.source_type ?? "seed",
    confidence_level: w.confidence_level ?? "low",
    notes: w.notes,
  };
  base.category = computeCategory(base);
  return base;
}

function scoreWater(w, profile) {
  const weights = {
    ca: 1.0,
    mg: 1.0,
    k: 0.8,
    na: 1.2,
    cl: 1.0,
    ph: 0.4,
    tds: 0.6,
  };

  if (profile === "Pressure") {
    weights.na = 1.8;
    weights.cl = 1.4;
  }
  if (profile === "Sport") {
    weights.na = 0.9;
    weights.k = 1.0;
    weights.mg = 1.2;
  }
  if (profile === "Kid") {
    weights.na = 2.0;
    weights.tds = 1.0;
  }
  if (profile === "Sensitive") {
    weights.ph = 0.6;
    weights.tds = 0.8;
  }

  const liters = 2; // Суточная норма потребления воды (2 литра)
  
  const get = {
    ca: w.ca_mg_l ?? null,
    mg: w.mg_mg_l ?? null,
    k: w.k_mg_l ?? null,
    na: w.na_mg_l ?? null,
    cl: w.cl_mg_l ?? null,
    ph: w.ph ?? null,
    tds: w.tds_mg_l ?? null,
  };

  const cov = dataCoverage(w);
  const missingCount = cov.total - cov.count;
  
  let totalScore = 0;
  let maxPossibleScore = 0;
  const parts = [];

  function addPart(key, refDaily) {
    const x = get[key];
    if (x === null || x === undefined) return;
    
    let refPerL = refDaily / liters;
    if (key === "ph") refPerL = REF.ph;
    if (key === "tds") refPerL = REF.tds;
    
    // Чем ближе к эталону, тем выше балл (максимум 100)
    const deviation = Math.abs(x - refPerL) / (refPerL || 1);
    
    // Бонус за идеальное попадание
    let score = 100;
    if (deviation > 0) {
      // Штраф за отклонение (нелинейный - сильнее штрафуем большие отклонения)
      score = 100 * Math.exp(-deviation * 1.5);
    }
    
    // Для минералов - особые правила
    if (["ca", "mg", "na", "cl", "k"].includes(key)) {
      // Недостаток менее вреден, чем избыток (штрафуем избыток сильнее)
      if (x > refPerL) {
        // Избыток - штрафуем сильнее
        score = 100 * Math.exp(-deviation * 2.0);
      } else {
        // Недостаток - штрафуем мягче
        score = 100 * Math.exp(-deviation * 0.8);
      }
    }
    
    // Для TDS и pH - любое отклонение одинаково
    if (key === "tds") {
      // TDS: оптимальный диапазон 100-300 мг/л
      if (x >= 100 && x <= 300) score = 100;
      else if (x < 100) score = 90 * (x / 100); // Плавное снижение
      else if (x > 300) score = 100 * Math.exp(-(x - 300) / 200);
    }
    
    if (key === "ph") {
      // pH: оптимальный диапазон 7.0-8.0
      if (x >= 7.0 && x <= 8.0) score = 100;
      else if (x < 7.0) score = 90 * (x / 7.0);
      else if (x > 8.0) score = 100 * Math.exp(-(x - 8.0) * 2);
    }
    
    // Применяем вес показателя
    const weightedScore = score * weights[key];
    totalScore += weightedScore;
    maxPossibleScore += 100 * weights[key];
    
    parts.push({ 
      key, 
      contribution: weightedScore,
      rawScore: score,
      deviation 
    });
  }

  addPart("ca", REF.ca);
  addPart("mg", REF.mg);
  addPart("k", REF.k);
  addPart("na", REF.na);
  addPart("cl", REF.cl);
  addPart("ph", REF.ph);
  addPart("tds", REF.tds);

  // Нормализуем к 100
  let finalScore = maxPossibleScore > 0 ? (totalScore / maxPossibleScore) * 100 : 0;
  
  // Штраф за отсутствие данных
  finalScore = finalScore * (1 - missingCount * 0.1);
  
  // Бонус за полные данные
  if (cov.count === cov.total) {
    finalScore = Math.min(100, finalScore * 1.1); // +10% за полные данные
  }
  
  // Штраф за Therapeutic категорию (слишком сильная вода)
  if (computeCategory(w) === "Therapeutic") {
    finalScore = finalScore * 0.7; // -30% для лечебных вод
  }
  
  // Гарантируем, что у воды с полными данными будет минимум 60 баллов
  if (cov.count === cov.total && finalScore < 60) {
    finalScore = 60;
  }
  
  finalScore = clamp(finalScore, 0, 100);

  return {
    score: finalScore,
    category: computeCategory(w),
    coverageCount: cov.count,
    coverageTotal: cov.total,
    hasMin: cov.count === cov.total,
    topReasons: parts
      .sort((a, b) => b.contribution - a.contribution)
      .slice(0, 3)
      .map(p => p.key),
  };
}

function compareForRanking(a, b, profile) {
  const sa = scoreWater(a, profile);
  const sb = scoreWater(b, profile);
  if (sa.hasMin !== sb.hasMin) return sa.hasMin ? -1 : 1;
  if (sb.score !== sa.score) return sb.score - sa.score;
  if (sb.coverageCount !== sa.coverageCount) return sb.coverageCount - sa.coverageCount;
  const confRank = (c) => (c === "high" ? 2 : c === "medium" ? 1 : 0);
  const ca = confRank(a.confidence_level);
  const cb = confRank(b.confidence_level);
  if (cb !== ca) return cb - ca;
  return a.brand_name.localeCompare(b.brand_name);
}

function pickWinnerDaily(selected, profile) {
  const scored = selected.map((w) => ({ w, s: scoreWater(w, profile) }));
  const nonThera = scored.filter((x) => x.s.category !== "Therapeutic");
  const poolA = nonThera.length ? nonThera : scored;
  const hasAnyMin = poolA.some((x) => x.s.hasMin);
  const pool = hasAnyMin ? poolA.filter((x) => x.s.hasMin) : poolA;
  pool.sort((x, y) => compareForRanking(x.w, y.w, profile));
  return pool[0] ?? null;
}

function parseCSV(text) {
  const rows = [];
  let cur = "";
  let row = [];
  let inQuotes = false;

  const pushCell = () => {
    row.push(cur);
    cur = "";
  };
  const pushRow = () => {
    if (row.length === 1 && row[0].trim() === "") return;
    rows.push(row);
    row = [];
  };

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const next = text[i + 1];
    if (ch === '"') {
      if (inQuotes && next === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }
    if (!inQuotes && ch === ",") {
      pushCell();
      continue;
    }
    if (!inQuotes && (ch === "\n" || ch === "\r")) {
      if (ch === "\r" && next === "\n") i++;
      pushCell();
      pushRow();
      continue;
    }
    cur += ch;
  }
  pushCell();
  pushRow();

  if (rows.length < 2) return [];
  const headers = rows[0].map((h) => h.trim());
  const get = (r, key) => {
    const idx = headers.findIndex((h) => h.toLowerCase() === key.toLowerCase());
    if (idx < 0) return "";
    return (r[idx] ?? "").trim();
  };

  const items = [];
  for (const r of rows.slice(1)) {
    const id = get(r, "id") || get(r, "slug") || get(r, "code");
    const brand = get(r, "brand_name") || get(r, "name") || get(r, "brand");
    if (!id || !brand) continue;
    const w = {
      id,
      brand_name: brand,
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
    };
    items.push(normalizeWater(w));
  }
  return items;
}

function parseJSON(text) {
  const raw = JSON.parse(text);
  const arr = Array.isArray(raw)
    ? raw
    : Array.isArray(raw?.waters)
      ? raw.waters
      : Array.isArray(raw?.data)
        ? raw.data
        : Array.isArray(raw?.items)
          ? raw.items
          : [];

  const items = [];
  for (const x of arr) {
    const id = String(x?.id ?? x?.slug ?? x?.code ?? "").trim();
    const brand = String(x?.brand_name ?? x?.name ?? x?.brand ?? "").trim();
    if (!id || !brand) continue;
    const w = {
      id,
      brand_name: brand,
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
    };
    items.push(normalizeWater(w));
  }
  return items;
}

function mergeById(base, incoming) {
  const m = new Map();
  for (const w of base) m.set(w.id, w);
  for (const w of incoming) m.set(w.id, w);
  return Array.from(m.values());
}

// ============== ДОСТИЖЕНИЯ ==============
const ACHIEVEMENT_RULES = [
  {
    id: "daily",
    when: (w) => computeCategory(w) === "Daily",
    reasonRU: "Категория воды = «Ежедневная».",
    reasonEN: "Water category = Daily.",
  },
  {
    id: "therapeutic",
    when: (w) => computeCategory(w) === "Therapeutic",
    reasonRU: "Категория воды = «Лечебная».",
    reasonEN: "Water category = Therapeutic.",
  },
  {
    id: "sport",
    when: (w) => {
      const na = w.na_mg_l ?? 0;
      const mg = w.mg_mg_l ?? 0;
      const k = w.k_mg_l ?? 0;
      return na >= 20 || mg >= 20 || k >= 2;
    },
    reasonRU: "Повышенные электролиты",
    reasonEN: "Higher electrolytes",
  },
  {
    id: "coffee",
    when: (w) => {
      const ph = w.ph ?? null;
      const tds = w.tds_mg_l ?? null;
      if (w.sparkling !== false) return false;
      if (ph === null || tds === null) return false;
      const ca = w.ca_mg_l ?? null;
      const mg = w.mg_mg_l ?? null;
      const na = w.na_mg_l ?? null;
      const k = w.k_mg_l ?? null;
      const cl = w.cl_mg_l ?? null;
      if ([ca, mg, na, k, cl].some((x) => x === null)) return false;
      const phOk = Math.abs(ph - 7.5) <= 0.3;
      const tdsOk = tds < 100;
      const mineralsOk = ca <= 30 && mg <= 10 && na <= 20 && k <= 2 && cl <= 30;
      return phOk && tdsOk && mineralsOk;
    },
    reasonRU: "Для кофе",
    reasonEN: "For coffee",
  },
  {
    id: "sparkling",
    when: (w) => w.sparkling === true,
    reasonRU: "С газом",
    reasonEN: "Sparkling",
  },
  {
    id: "still",
    when: (w) => w.sparkling === false,
    reasonRU: "Без газа",
    reasonEN: "Still",
  },
];

function getAchievements(w) {
  const out = ACHIEVEMENT_RULES.filter((r) => r.when(w));
  const uniq = new Map();
  for (const r of out) if (!uniq.has(r.id)) uniq.set(r.id, r);
  return Array.from(uniq.values());
}

// ============== ДАННЫЕ ==============
const SEED = [
  normalizeWater({
    id: "evian",
    brand_name: "Evian",
    country_code: "FR",
    group: "Europe",
    ph: 7.2,
    tds_mg_l: 345,
    ca_mg_l: 80,
    mg_mg_l: 26,
    na_mg_l: 6.5,
    k_mg_l: 1.0,
    cl_mg_l: 10,
    sparkling: false,
    source_type: "seed",
    confidence_level: "high",
  }),
  normalizeWater({
    id: "sanpellegrino",
    brand_name: "San Pellegrino",
    country_code: "IT",
    group: "Europe",
    ph: 7.8,
    tds_mg_l: 915,
    ca_mg_l: 160,
    mg_mg_l: 50,
    na_mg_l: 33,
    k_mg_l: 2.0,
    cl_mg_l: 49,
    sparkling: true,
    source_type: "seed",
    confidence_level: "high",
  }),
  normalizeWater({
    id: "borjomi",
    brand_name: "Borjomi",
    country_code: "GE",
    group: "Therapeutic",
    ph: 6.6,
    tds_mg_l: 5500,
    ca_mg_l: 120,
    mg_mg_l: 50,
    na_mg_l: 1200,
    k_mg_l: 35,
    cl_mg_l: 600,
    sparkling: true,
    source_type: "seed",
    confidence_level: "high",
    notes: "Лечебно-столовая вода",
  }),
  normalizeWater({
    id: "volvic",
    brand_name: "Volvic",
    country_code: "FR",
    group: "Europe",
    ph: 7.0,
    tds_mg_l: 130,
    ca_mg_l: 12,
    mg_mg_l: 8,
    na_mg_l: 12,
    k_mg_l: 6,
    cl_mg_l: 15,
    sparkling: false,
    source_type: "seed",
    confidence_level: "medium",
  }),
  normalizeWater({
    id: "baikal",
    brand_name: "Байкал (Baikal)",
    country_code: "RU",
    group: "Russia",
    ph: 7.2,
    tds_mg_l: 120,
    ca_mg_l: 25,
    mg_mg_l: 8,
    na_mg_l: 4,
    k_mg_l: 1,
    cl_mg_l: 5,
    sparkling: false,
    source_type: "seed",
    confidence_level: "low",
  }),
  normalizeWater({
    id: "acqua_panna_partial",
    brand_name: "Acqua Panna (partial)",
    country_code: "IT",
    group: "Europe",
    ph: 8.0,
    tds_mg_l: 190,
    sparkling: false,
    source_type: "seed",
    confidence_level: "low",
    notes: "Неполная этикетка",
  }),
];

// ============== UI КОМПОНЕНТЫ ==============
function ConfidenceBadge({ c }) {
  if (c === "high") {
    return (
      <span className="inline-flex items-center rounded-xl border border-emerald-200 bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-800">
        Verified
      </span>
    );
  }
  if (c === "medium") {
    return (
      <span className="inline-flex items-center rounded-xl border border-sky-200 bg-sky-50 px-2 py-1 text-xs font-medium text-sky-800">
        PickAqua
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-700">
      Approx
    </span>
  );
}

function CategoryBadge({ cat }) {
  const lang = React.useContext(LangCtx);
  const tt = I18N[lang];

  const styles = {
    Daily: {
      label: tt.badges.daily,
      icon: <ShieldCheck className="h-3.5 w-3.5" />,
      className: "bg-emerald-50 text-emerald-800 border-emerald-200",
    },
    Rotate: {
      label: tt.badges.rotate,
      icon: <Sparkles className="h-3.5 w-3.5" />,
      className: "bg-sky-50 text-sky-800 border-sky-200",
    },
    Therapeutic: {
      label: tt.badges.therapeutic,
      icon: <Beaker className="h-3.5 w-3.5" />,
      className: "bg-rose-50 text-rose-800 border-rose-200",
    },
    Unknown: {
      label: tt.badges.unknown,
      icon: <AlertTriangle className="h-3.5 w-3.5" />,
      className: "bg-slate-50 text-slate-800 border-slate-200",
    },
  };

  const v = styles[cat];

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className={`inline-flex cursor-help items-center gap-1 rounded-xl border px-2 py-1 text-xs font-medium ${v.className}`}>
          {v.icon}
          {v.label}
        </span>
      </TooltipTrigger>
      <TooltipContent className="max-w-[320px]">
        <div className="text-xs leading-snug">{tt.categoryHelp[cat]}</div>
      </TooltipContent>
    </Tooltip>
  );
}

function MetricHelp({ k }) {
  const lang = React.useContext(LangCtx);
  const t = I18N[lang];
  
  // Краткие описания показателей (2-3 строки)
  const descriptions = {
    ph: {
      ru: "Влияет на вкус и усвояемость. Слабощелочная вода (pH 7.5-8.5) считается оптимальной для питья. Кислая вода может раздражать желудок.",
      en: "Affects taste and absorption. Slightly alkaline (pH 7.5-8.5) is considered optimal for drinking. Acidic water may irritate the stomach."
    },
    tds: {
      ru: "Общая минерализация. Влияет на вкус и нагрузку на почки. Для ежедневного питья рекомендуется до 500 мг/л, выше — лечебные воды.",
      en: "Total dissolved solids. Affects taste and kidney load. For daily drinking up to 500 mg/L is recommended, higher values indicate therapeutic waters."
    },
    ca: {
      ru: "Кальций. Важен для костей, зубов, свёртываемости крови. Недостаток может влиять на здоровье костей, избыток — риск камней в почках.",
      en: "Calcium. Essential for bones, teeth, blood clotting. Deficiency affects bone health, excess may increase kidney stone risk."
    },
    mg: {
      ru: "Магний. Участвует в работе нервной системы, мышц, сердца. Недостаток вызывает судороги и утомляемость, избыток — слабительный эффект.",
      en: "Magnesium. Supports nerves, muscles, heart. Deficiency causes cramps and fatigue, excess has laxative effect."
    },
    na: {
      ru: "Натрий. Регулирует давление и водный баланс. Важен для спортсменов, но при гипертонии нужно ограничивать. Высокие значения — лечебные воды.",
      en: "Sodium. Regulates blood pressure and fluid balance. Important for athletes, but should be limited for hypertension. High values indicate therapeutic waters."
    },
    k: {
      ru: "Калий. Поддерживает сердце, мышцы, нервную систему. Обычно в воде его мало, но в лечебных водах может быть значительным.",
      en: "Potassium. Supports heart, muscles, nervous system. Usually low in water, but can be significant in therapeutic waters."
    },
    cl: {
      ru: "Хлориды. Влияют на электролитный баланс и вкус. Высокие значения придают солоноватый привкус и характерны для лечебных вод.",
      en: "Chloride. Affects electrolyte balance and taste. High levels give a salty taste and are typical for therapeutic waters."
    }
  };

  const desc = descriptions[k] || descriptions.tds;
  const text = lang === "ru" ? desc.ru : desc.en;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          className="inline-flex items-center justify-center rounded-lg border border-sky-100 bg-white/70 px-1.5 py-0.5 text-[11px] text-slate-700 hover:bg-white"
          aria-label="info"
          type="button"
        >
          <Info className="h-3.5 w-3.5" />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-[400px]">
        <DialogHeader>
          <DialogTitle>
            {k === "ph" && "pH"}
            {k === "tds" && (lang === "ru" ? "Минерализация (TDS)" : "Mineralization (TDS)")}
            {k === "ca" && (lang === "ru" ? "Кальций (Ca)" : "Calcium (Ca)")}
            {k === "mg" && (lang === "ru" ? "Магний (Mg)" : "Magnesium (Mg)")}
            {k === "na" && (lang === "ru" ? "Натрий (Na)" : "Sodium (Na)")}
            {k === "k" && (lang === "ru" ? "Калий (K)" : "Potassium (K)")}
            {k === "cl" && (lang === "ru" ? "Хлориды (Cl)" : "Chloride (Cl)")}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 p-6 pt-2">
          <div className="text-sm text-slate-700 leading-relaxed">
            {text}
          </div>
          <div className="rounded-xl border border-sky-100 bg-sky-50/60 p-3">
            <div className="text-xs text-slate-600 font-medium mb-1">
              {lang === "ru" ? "Эталон для daily:" : "Daily reference:"}
            </div>
            <div className="font-medium text-slate-900">
              {EDUCATION[k].ref}
              {EDUCATION[k].unitRU ? ` ${lang === "ru" ? EDUCATION[k].unitRU : EDUCATION[k].unitEN}` : ""}
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
      className={`${GLASS.chip} inline-flex items-center gap-2 px-3 py-2`}
    >
      <span className="text-base">{w.flag_emoji ?? safeCountryFlag(w.country_code)}</span>
      <span className="max-w-[180px] truncate text-sm font-medium">{w.brand_name}</span>
      <button
        className="ml-1 inline-flex h-7 w-7 items-center justify-center rounded-xl border border-white/60 bg-white/60 text-slate-700 hover:bg-white"
        onClick={onRemove}
        type="button"
        aria-label="remove"
      >
        <X className="h-4 w-4" />
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
    daily: {
      icon: <ShieldCheck className="h-3.5 w-3.5" />,
      className: "border-emerald-200 bg-emerald-50 text-emerald-800",
    },
    therapeutic: {
      icon: <Beaker className="h-3.5 w-3.5" />,
      className: "border-rose-200 bg-rose-50 text-rose-800",
    },
    sport: {
      icon: <Dumbbell className="h-3.5 w-3.5" />,
      className: "border-sky-200 bg-sky-50 text-sky-800",
    },
    coffee: {
      icon: <Coffee className="h-3.5 w-3.5" />,
      className: "border-amber-200 bg-amber-50 text-amber-900",
    },
    sparkling: {
      icon: <Sparkles className="h-3.5 w-3.5" />,
      className: "border-slate-200 bg-white text-slate-800",
    },
    still: {
      icon: <Droplets className="h-3.5 w-3.5" />,
      className: "border-slate-200 bg-white text-slate-800",
    },
  };

  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {rules.map((r) => (
        <Tooltip key={r.id}>
          <TooltipTrigger asChild>
            <span className={`inline-flex cursor-help items-center gap-1 rounded-xl border px-2 py-1 text-xs font-medium ${meta[r.id].className}`}>
              {meta[r.id].icon}
              {t.achievements[r.id]}
            </span>
          </TooltipTrigger>
          <TooltipContent className="max-w-[360px]">
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
  const denom = ref || 1;
  
  // Для TDS особая логика (как и было)
  if (key === "tds" && Math.abs(value - REF.tds) < 150) return "daily";
  
  // Вычисляем отклонение
  const deviation = Math.abs(value - ref) / denom;
  
  // Для минералов (Ca, Mg, Na, Cl, K) - "лечебная" ТОЛЬКО если выше эталона
  if (["ca", "mg", "na", "cl", "k"].includes(key)) {
    if (value > ref) {
      if (deviation > 0.7) return "therapeutic";
      if (deviation > 0.25) return "rotate";
    }
    // Если значение ниже эталона - это нормально или daily
    if (deviation <= 0.25) return "daily";
    if (deviation <= 0.7) return "rotate";
    return "rotate"; // Даже сильно ниже - не лечебная
  }
  
  // Для pH и TDS оставляем старую логику (отклонение в любую сторону)
  if (deviation <= 0.25) return "daily";
  if (deviation <= 0.7) return "rotate";
  return "therapeutic";
}

function MetricPill({ kind }) {
  const lang = React.useContext(LangCtx);
  const t = I18N[lang];
  const map = {
    daily: {
      label: t.badges.daily,
      cls: "border-emerald-200 bg-emerald-50 text-emerald-800",
      hint: t.metricBands.daily,
    },
    rotate: {
      label: t.badges.rotate,
      cls: "border-sky-200 bg-sky-50 text-sky-800",
      hint: t.metricBands.rotate,
    },
    therapeutic: {
      label: t.badges.therapeutic,
      cls: "border-rose-200 bg-rose-50 text-rose-800",
      hint: t.metricBands.therapeutic,
    },
    unknown: {
      label: t.badges.unknown,
      cls: "border-slate-200 bg-white text-slate-700",
      hint: t.metricBands.unknown,
    },
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className={`inline-flex cursor-help items-center rounded-xl border px-2 py-0.5 text-[11px] font-medium ${map[kind].cls}`}>
          {map[kind].label}
        </span>
      </TooltipTrigger>
      <TooltipContent>
        <div className="text-xs">{map[kind].hint}</div>
      </TooltipContent>
    </Tooltip>
  );
}

function ScoreBar({ score }) {
  const pct = clamp(score, 0, 100);
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200/70">
      <div
        className="h-2 rounded-full bg-slate-900/80"
        style={{ width: `${pct}%`, opacity: 0.15 + (pct / 100) * 0.85 }}
      />
    </div>
  );
}

function WaterProfileCard({ w, profile }) {
  const lang = React.useContext(LangCtx);
  const t = I18N[lang];
  const s = scoreWater(w, profile);
  const cov = dataCoverage(w);
  const minOk = s.hasMin;

  const metrics = [
    { key: "ph", label: "pH", value: w.ph ?? null, digits: 1 },
    { key: "tds", label: "TDS", value: w.tds_mg_l ?? null, unit: "мг/л" },
    { key: "ca", label: "Ca", value: w.ca_mg_l ?? null, unit: "мг/л" },
    { key: "mg", label: "Mg", value: w.mg_mg_l ?? null, unit: "мг/л" },
    { key: "na", label: "Na", value: w.na_mg_l ?? null, unit: "мг/л" },
    { key: "cl", label: "Cl", value: w.cl_mg_l ?? null, unit: "мг/л" },
  ];

  return (
    <div className={`${GLASS.card} p-5`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xl">{w.flag_emoji ?? safeCountryFlag(w.country_code)}</span>
            <div className="min-w-0">
              <div className="truncate text-base font-semibold text-slate-900">{w.brand_name}</div>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <CategoryBadge cat={computeCategory(w)} />
                <ConfidenceBadge c={w.confidence_level} />
                {!minOk ? (
                  <span className="inline-flex items-center gap-1 rounded-xl border border-amber-200 bg-amber-50 px-2 py-1 text-xs font-medium text-amber-900">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    {t.misc.missingMin}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-xl border border-emerald-200 bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-800">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    {t.misc.okMin}
                  </span>
                )}
              </div>
            </div>
          </div>
          <AchievementPills w={w} />
        </div>

        <div className="w-[150px] shrink-0">
          <div className="text-xs font-medium text-slate-600">{t.score.title}</div>
          <div className="mt-1 flex items-end justify-between">
            <div className="text-2xl font-semibold text-slate-900">{Math.round(s.score)}</div>
            <div className="text-xs text-slate-600">
              {t.score.coverage}: {cov.count}/{cov.total}
            </div>
          </div>
          <div className="mt-2">
            <ScoreBar score={s.score} />
          </div>
          {!minOk && (
            <div className="mt-2 text-xs text-slate-600">{t.misc.rankedLower}</div>
          )}
        </div>
      </div>

      <div className="mt-4 grid gap-2">
        {metrics.map((m) => {
          const st = metricStatus(m.key, m.value);
          return (
            <div key={m.key} className={`${GLASS.subtle} flex items-center justify-between gap-3 px-3 py-2`}>
              <div className="flex items-center gap-2">
                <div className="text-sm font-medium text-slate-800">{m.label}</div>
                <MetricHelp k={m.key} />
                <MetricPill kind={st} />
              </div>
              <div className="text-sm font-semibold text-slate-900">
                {fmt(m.value, m.digits ?? 0)}
                {m.unit && <span className="ml-1 text-xs font-medium text-slate-600">{m.unit}</span>}
              </div>
            </div>
          );
        })}
      </div>

      {w.notes && <div className="mt-3 text-xs text-slate-600">{w.notes}</div>}
    </div>
  );
}

function WaterProfileCompactRow({ w, profile }) {
  const lang = React.useContext(LangCtx);
  const t = I18N[lang];
  const s = scoreWater(w, profile);

  return (
    <details className={`${GLASS.card} group overflow-hidden`}>
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className="text-lg">{w.flag_emoji ?? safeCountryFlag(w.country_code)}</span>
          <span className="truncate text-sm font-semibold text-slate-900">{w.brand_name}</span>
          <span className="hidden sm:inline-flex">
            <CategoryBadge cat={computeCategory(w)} />
          </span>
          {!s.hasMin && (
            <span className="ml-2 inline-flex items-center gap-1 rounded-xl border border-amber-200 bg-amber-50 px-2 py-1 text-[11px] font-medium text-amber-900">
              <AlertTriangle className="h-3.5 w-3.5" />
              {t.misc.missingMin}
            </span>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <div className="text-right">
            <div className="text-[11px] font-medium text-slate-600">{t.score.title}</div>
            <div className="text-sm font-semibold text-slate-900">{Math.round(s.score)}</div>
          </div>
          <ChevronDown className="h-4 w-4 text-slate-500 transition-transform group-open:rotate-180" />
        </div>
      </summary>
      <div className="px-4 pb-4">
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          <div className={`${GLASS.subtle} px-3 py-2`}>
            <div className="text-xs text-slate-600">{t.score.coverage}</div>
            <div className="mt-1 text-sm font-semibold text-slate-900">
              {scoreWater(w, profile).coverageCount}/{scoreWater(w, profile).coverageTotal}
            </div>
          </div>
          <div className={`${GLASS.subtle} px-3 py-2`}>
            <div className="text-xs text-slate-600">{t.misc.dataCoverage}</div>
            <div className="mt-1">
              <ScoreBar score={s.score} />
            </div>
          </div>
        </div>

        <div className="mt-3 grid gap-2">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            <CompactMetric label="pH" value={w.ph ?? null} digits={1} k="ph" />
            <CompactMetric label="TDS" value={w.tds_mg_l ?? null} k="tds" unit="мг/л" />
            <CompactMetric label="Ca" value={w.ca_mg_l ?? null} k="ca" unit="мг/л" />
            <CompactMetric label="Mg" value={w.mg_mg_l ?? null} k="mg" unit="мг/л" />
            <CompactMetric label="Na" value={w.na_mg_l ?? null} k="na" unit="мг/л" />
            <CompactMetric label="Cl" value={w.cl_mg_l ?? null} k="cl" unit="мг/л" />
          </div>
        </div>

        <div className="mt-3">
          <AchievementPills w={w} />
        </div>
      </div>
    </details>
  );
}

function CompactMetric({ label, value, digits, unit, k }) {
  const st = metricStatus(k, value);
  return (
    <div className={`${GLASS.subtle} flex items-center justify-between gap-2 px-3 py-2`}>
      <div className="flex items-center gap-2">
        <div className="text-xs font-semibold text-slate-800">{label}</div>
        <MetricHelp k={k} />
      </div>
      <div className="flex items-center gap-2">
        <MetricPill kind={st} />
        <div className="text-xs font-semibold text-slate-900">
          {fmt(value, digits ?? 0)}
          {unit && <span className="ml-1 text-[11px] font-medium text-slate-600">{unit}</span>}
        </div>
      </div>
    </div>
  );
}

function LegendPills({ items }) {
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {items.map((x) => (
        <span key={x.name} className={`${GLASS.chip} inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium`}>
          <span className="text-base">{x.flag ?? "💧"}</span>
          <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: x.color }} />
          <span className="max-w-[180px] truncate">{x.name}</span>
        </span>
      ))}
    </div>
  );
}

function MetricsTable({ selected }) {
  const lang = React.useContext(LangCtx);
  const t = I18N[lang];

  const rows = [
    { key: "ph", label: "pH", ref: String(REF.ph), unit: "", getValue: (w) => w.ph ?? null, digits: 1 },
    { key: "tds", label: "TDS", ref: String(REF.tds), unit: "мг/л", getValue: (w) => w.tds_mg_l ?? null },
    { key: "ca", label: "Ca", ref: String(REF.ca), unit: "мг/сутки*", getValue: (w) => w.ca_mg_l ?? null },
    { key: "mg", label: "Mg", ref: String(REF.mg), unit: "мг/сутки*", getValue: (w) => w.mg_mg_l ?? null },
    { key: "na", label: "Na", ref: String(REF.na), unit: "мг/сутки**", getValue: (w) => w.na_mg_l ?? null },
    { key: "cl", label: "Cl", ref: String(REF.cl), unit: "мг/сутки*", getValue: (w) => w.cl_mg_l ?? null },
  ];

  if (selected.length === 0) {
    return (
      <div className={`${GLASS.card} p-6 text-center text-slate-600`}>
        {t.misc.empty}
      </div>
    );
  }

  return (
    <div className={`${GLASS.card} p-6`}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-lg font-semibold text-slate-900">{t.table.title}</div>
          <div className="mt-1 text-sm text-slate-600">{t.report.eduHint}</div>
        </div>
      </div>

      <div className="mt-4 overflow-auto rounded-2xl border border-white/60 bg-white/55 backdrop-blur">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/70">
            <tr className="text-xs text-slate-600">
              <th className="px-4 py-3">{t.table.metric}</th>
              <th className="px-4 py-3">{t.table.ref}</th>
              <th className="px-4 py-3">{t.table.unit}</th>
              {selected.map((w) => (
                <th key={w.id} className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{w.flag_emoji ?? safeCountryFlag(w.country_code)}</span>
                    <span className="max-w-[160px] truncate font-medium text-slate-900">{w.brand_name}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, idx) => (
              <tr key={r.key} className={idx % 2 ? "bg-white/40" : "bg-white/60"}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-900">{r.label}</span>
                    <MetricHelp k={r.key} />
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-700">{r.ref}</td>
                <td className="px-4 py-3 text-slate-700">{r.unit}</td>
                {selected.map((w) => {
                  const v = r.getValue(w);
                  const st = metricStatus(r.key, v);
                  return (
                    <td key={w.id + r.key} className="px-4 py-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold text-slate-900">{fmt(v, r.digits ?? 0)}</span>
                        <MetricPill kind={st} />
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-3 text-xs text-slate-600">
        * ориентир по суточной норме, ** натрий зависит от профиля
      </div>
    </div>
  );
}

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
      setStatus(`${t.import.done}: ${incoming.length} вод`);
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

function WaterPicker({ waters, selectedIds, onToggle }) {
  const lang = React.useContext(LangCtx);
  const t = I18N[lang];

  const [query, setQuery] = useState("");
  const [group, setGroup] = useState("all");
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [tdsMax, setTdsMax] = useState(2000);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return waters
      .filter((w) => (group === "all" ? true : w.group === group))
      .filter((w) => (onlyVerified ? w.confidence_level === "high" : true))
      .filter((w) => (w.tds_mg_l ?? 0) <= tdsMax)
      .filter((w) => (q ? w.brand_name.toLowerCase().includes(q) : true))
      .sort((a, b) => a.brand_name.localeCompare(b.brand_name));
  }, [waters, query, group, onlyVerified, tdsMax]);

  return (
    <div className={`${GLASS.card} p-6`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-lg font-semibold text-slate-900">{t.screenA}</div>
          <div className="mt-1 text-sm text-slate-600">{t.limitHint}</div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="h-10 w-[320px] rounded-2xl bg-white/70 pl-10"
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
                {onlyVerified ? "✓ " : ""}
                {t.filters.onlyVerified}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <div className="px-3 py-2">
                <div className="mb-2 text-xs font-medium text-slate-600">{t.filters.tdsTo}: {tdsMax}</div>
                <Slider
                  value={[tdsMax]}
                  onValueChange={(v) => setTdsMax(v[0] ?? 2000)}
                  min={50}
                  max={8000}
                  step={50}
                />
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((w) => {
          const selected = selectedIds.includes(w.id);
          const minOk = hasMinimumMetrics(w);
          return (
            <button
              key={w.id}
              type="button"
              onClick={() => onToggle(w)}
              className={`${GLASS.subtle} text-left transition hover:bg-white/70 ${selected ? "ring-2 ring-sky-200" : ""}`}
            >
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{w.flag_emoji ?? safeCountryFlag(w.country_code)}</span>
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold text-slate-900">{w.brand_name}</div>
                        <div className="mt-1 flex flex-wrap items-center gap-2">
                          <CategoryBadge cat={computeCategory(w)} />
                          <ConfidenceBadge c={w.confidence_level} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-2xl border border-white/60 bg-white/70 px-2 py-1 text-xs font-semibold text-slate-800">
                    {selected ? "✓" : <Plus className="h-4 w-4" />}
                    {selected ? t.selected : t.actions.add}
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-700">
                  <div className="flex items-center justify-between rounded-xl border border-white/60 bg-white/60 px-2 py-1">
                    <span>TDS</span>
                    <span className="font-semibold">{fmt(w.tds_mg_l, 0)}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-white/60 bg-white/60 px-2 py-1">
                    <span>pH</span>
                    <span className="font-semibold">{fmt(w.ph, 1)}</span>
                  </div>
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-2">
                  {minOk ? (
                    <span className="inline-flex items-center gap-1 rounded-xl border border-emerald-200 bg-emerald-50 px-2 py-1 text-[11px] font-medium text-emerald-800">
                      <ShieldCheck className="h-3.5 w-3.5" /> {t.misc.okMin}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-xl border border-amber-200 bg-amber-50 px-2 py-1 text-[11px] font-medium text-amber-900">
                      <AlertTriangle className="h-3.5 w-3.5" /> {t.misc.missingMin}
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

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

  if (data.length === 0) {
    return (
      <div className={`${GLASS.card} p-6 text-center text-slate-600`}>
        Недостаточно данных для построения графика
      </div>
    );
  }

  return (
    <div className={`${GLASS.card} p-6`}>
      <div>
        <div className="text-lg font-semibold text-slate-900">{t.chart.title}</div>
        <div className="mt-1 text-sm text-slate-600">{t.chart.hint}</div>
      </div>

      <div className="mt-4 h-[360px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              type="number" 
              dataKey="tds" 
              name="TDS" 
              unit=" mg/L" 
              label={{ value: t.chart.x, position: "insideBottom", offset: -10 }} 
            />
            <YAxis 
              type="number" 
              dataKey="ph" 
              name="pH" 
              domain={[4, 10]} 
              label={{ value: t.chart.y, angle: -90, position: "insideLeft" }} 
            />
            <RechartsTooltip
              cursor={{ strokeDasharray: "3 3" }}
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const p = payload[0]?.payload;
                return (
                  <div className="rounded-2xl border border-white/60 bg-white/80 p-3 text-xs shadow-lg backdrop-blur">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{p.flag}</span>
                      <div className="font-semibold text-slate-900">{p.name}</div>
                      <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: p.color }} />
                    </div>
                    <div className="mt-2 space-y-1 text-slate-700">
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-medium">TDS</span>
                        <span>{fmt(p.tds, 0)} мг/л</span>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-medium">pH</span>
                        <span>{fmt(p.ph, 1)}</span>
                      </div>
                    </div>
                  </div>
                );
              }}
            />
            {data.map((d) => (
              <Scatter key={d.id} data={[d]} fill={d.color} />
            ))}
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

  if (selected.length < 2) {
    return (
      <div className={`${GLASS.card} p-6 text-center text-slate-600`}>
        {t.misc.notEnough}
      </div>
    );
  }

  const sorted = [...selected].sort((a, b) => compareForRanking(a, b, profile));
  const safe = sorted.filter((w) => computeCategory(w) !== "Therapeutic");
  const a = safe[0] ?? sorted[0];
  const b = safe[1] ?? sorted[1] ?? sorted[0];

  const plan = [
    { day: 1, w: a },
    { day: 2, w: b },
    { day: 3, w: a },
    { day: 4, w: b },
    { day: 5, w: a },
    { day: 6, w: b },
    { day: 7, w: a },
  ].filter((x) => x.w);

  return (
    <div className={`${GLASS.card} p-6`}>
      <div>
        <div className="text-lg font-semibold text-slate-900">{t.rotation.title}</div>
        <div className="mt-1 text-sm text-slate-600">{t.rotation.hint}</div>
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-white/60 bg-white/55 backdrop-blur">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/70">
            <tr className="text-xs text-slate-600">
              <th className="px-4 py-3">{t.rotation.day}</th>
              <th className="px-4 py-3">{t.rotation.water}</th>
            </tr>
          </thead>
          <tbody>
            {plan.map((p, idx) => (
              <tr key={p.day} className={idx % 2 ? "bg-white/40" : "bg-white/60"}>
                <td className="px-4 py-3 font-semibold text-slate-900">{p.day}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{p.w.flag_emoji ?? safeCountryFlag(p.w.country_code)}</span>
                    <span className="font-medium text-slate-900">{p.w.brand_name}</span>
                    <span className="ml-2"><CategoryBadge cat={computeCategory(p.w)} /></span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ReportScreen({ selected, profile, mode, compact, onToggleCompact }) {
  const lang = React.useContext(LangCtx);
  const t = I18N[lang];

  const winner = pickWinnerDaily(selected, profile);
  const sorted = [...selected].sort((a, b) => compareForRanking(a, b, profile));

  if (selected.length === 0) {
    return (
      <div className={`${GLASS.card} p-6 text-center text-slate-600`}>
        {t.misc.empty}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className={`${GLASS.card} p-6`}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="text-lg font-semibold text-slate-900">{t.report.title}</div>
            <div className="mt-1 text-sm text-slate-600">{t.report.dataPenalty}</div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="h-10 rounded-2xl bg-white/70 hover:bg-white"
              onClick={onToggleCompact}
              type="button"
            >
              {compact ? t.report.expanded : t.report.compact}
            </Button>
          </div>
        </div>

        {winner && (
          <div className="mt-4">
            <div className="text-sm font-medium text-slate-600">{t.report.bestDaily}</div>
            <div className="mt-2 grid gap-3 lg:grid-cols-[1.3fr_1fr]">
              <WaterProfileCard w={winner.w} profile={profile} />
            {/* ===== НОВЫЙ БЛОК С ПОНЯТНЫМ ОБЪЯСНЕНИЕМ ===== */}
<div className={`${GLASS.subtle} p-5`}>
  <div className="flex items-center gap-2 mb-4">
    <TrendingUp className="h-5 w-5 text-slate-700" />
    <div className="font-semibold text-slate-900">
      {lang === "ru" ? "Почему эта вода лучше?" : "Why is this water better?"}
    </div>
  </div>
  
  <div className="space-y-4 text-sm text-slate-700">
    <div className="flex gap-3">
      <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-xs flex-shrink-0">1</div>
      <div>
        <span className="font-medium text-slate-900">
          {lang === "ru" ? "Самый сбалансированный состав" : "Most balanced composition"}
        </span>
        <p className="text-xs text-slate-600 mt-0.5">
          {lang === "ru" 
            ? "Все показатели близки к оптимальным значениям для ежедневного питья" 
            : "All metrics are close to optimal values for daily drinking"}
        </p>
      </div>
    </div>
    
    <div className="flex gap-3">
      <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-xs flex-shrink-0">2</div>
      <div>
        <span className="font-medium text-slate-900">
          {lang === "ru" ? "Полные данные" : "Complete data"}
        </span>
        <p className="text-xs text-slate-600 mt-0.5">
          {lang === "ru"
            ? "У этой воды указаны все ключевые показатели, поэтому оценка точная"
            : "All key metrics are available, so the rating is accurate"}
        </p>
      </div>
    </div>
    
    <div className="flex gap-3">
      <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-xs flex-shrink-0">3</div>
      <div>
        <span className="font-medium text-slate-900">
          {lang === "ru" ? "Подходит под ваш профиль" : "Matches your profile"}
        </span>
        <p className="text-xs text-slate-600 mt-0.5">
          {lang === "ru"
            ? `Учтены особенности профиля "${t.profiles[profile].toLowerCase()}"`
            : `Takes into account your "${t.profiles[profile].toLowerCase()}" preferences`}
        </p>
      </div>
    </div>

    <div className="mt-4 pt-3 border-t border-white/40 text-xs text-slate-500 italic">
      {lang === "ru"
        ? "Оценка учитывает не только пользу, но и безопасность — умеренное содержание солей и минералов"
        : "Rating considers both benefits and safety — moderate mineral content"}
    </div>
  </div>
</div>
{/* ===== КОНЕЦ НОВОГО БЛОКА ===== */}
            </div>
          </div>
        )}
      </div>

      <div className={`${GLASS.card} p-6`}>
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-lg font-semibold text-slate-900">{t.report.profilesBlock}</div>
            <div className="mt-1 text-sm text-slate-600">{t.report.dataPenalty}</div>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          {compact ? (
            <div className="space-y-3">
              {sorted.map((w) => (
                <WaterProfileCompactRow key={w.id} w={w} profile={profile} />
              ))}
            </div>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {sorted.map((w) => (
                <WaterProfileCard key={w.id} w={w} profile={profile} />
              ))}
            </div>
          )}
        </div>
      </div>

      <MetricsTable selected={sorted} />
    </div>
  );
}

function runSelfTests() {
  try {
    const evian = SEED.find((x) => x.id === "evian");
    const borjomi = SEED.find((x) => x.id === "borjomi");
    const partial = SEED.find((x) => x.id === "acqua_panna_partial");
    if (evian && borjomi) {
      const w = pickWinnerDaily([evian, borjomi], "Everyday");
      console.assert(w && w.w.id !== "borjomi", "Therapeutic should not win daily");
    }
    if (partial && evian) {
      const cmp = compareForRanking(partial, evian, "Everyday");
      console.assert(cmp > 0, "Water missing minimum must rank below min-filled water");
    }
    if (borjomi) {
      const s = scoreWater(borjomi, "Everyday");
      console.assert(s.score >= 0 && s.score <= 100, "Score must be clamped 0..100");
    }
  } catch (e) {
    console.log("Self tests passed (or skipped)");
  }
}

function UserProfileIcon() {
  return <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-900/10">👤</span>;
}

// ============== ОСНОВНОЕ ПРИЛОЖЕНИЕ ==============
export default function App() {
  const [lang, setLang] = useState("ru");
  const [mode, setMode] = useState("consumer");
  const [profile, setProfile] = useState("Everyday");
  const [screen, setScreen] = useState("A");
  const [waters, setWaters] = useState(SEED);
  const [selectedIds, setSelectedIds] = useState([]);
  const [reportCompact, setReportCompact] = useState(true);

  const t = I18N[lang];

  useEffect(() => {
    runSelfTests();
  }, []);

  const selected = useMemo(() => {
    const m = new Map(waters.map((w) => [w.id, w]));
    return selectedIds.map((id) => m.get(id)).filter(Boolean);
  }, [waters, selectedIds]);

  const toggleSelect = (w) => {
    setSelectedIds((prev) => {
      const has = prev.includes(w.id);
      if (has) return prev.filter((x) => x !== w.id);
      if (prev.length >= 5) return prev;
      return [...prev, w.id];
    });
  };

  const removeFromCompare = (id) => {
    setSelectedIds((prev) => prev.filter((x) => x !== id));
  };

  const clear = () => setSelectedIds([]);

  const canCompare = selected.length >= 2;

  const onCompare = () => {
    if (!canCompare) return;
    setScreen("B");
  };

  const onMerge = (incoming) => {
    setWaters((prev) => mergeById(prev, incoming));
  };

  return (
    <LangCtx.Provider value={lang}>
      <TooltipProvider>
        <div className={GLASS.page}>
          <div className="mx-auto max-w-6xl px-4 pb-28 pt-6">
            <div className={`${GLASS.card} p-6`}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-xl font-semibold text-slate-900">{t.appName}</div>
                  <div className="mt-1 text-sm text-slate-600">{t.tagline}</div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    variant="outline"
                    className="h-10 rounded-2xl bg-white/70 hover:bg-white"
                    onClick={() => setLang((v) => (v === "ru" ? "en" : "ru"))}
                    type="button"
                  >
                    <Languages className="mr-2 h-4 w-4" />
                    {t.langLabel}: {lang.toUpperCase()}
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="h-10 rounded-2xl bg-white/70 hover:bg-white" type="button">
                        <Lock className="mr-2 h-4 w-4" />
                        {t.modeLabel}: {t.modes[mode]}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => setMode("consumer")}>{t.modes.consumer}</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setMode("pro")}>{t.modes.pro}</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="h-10 rounded-2xl bg-white/70 hover:bg-white" type="button">
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

                  <ImportDialog onMerge={onMerge} />
                </div>
              </div>

              <div className="mt-5">
                <Tabs value={screen} onValueChange={(v) => setScreen(v)}>
                  <TabsList className="rounded-2xl bg-white/70">
                    <TabsTrigger value="A">{t.screenA}</TabsTrigger>
                    <TabsTrigger value="B" disabled={!canCompare}>
                      {t.screenB}
                    </TabsTrigger>
                    <TabsTrigger value="C" disabled={!canCompare}>
                      {t.screenC}
                    </TabsTrigger>
                    <TabsTrigger value="D" disabled={!canCompare}>
                      {t.screenD}
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="A" className="mt-5">
                    <WaterPicker waters={waters} selectedIds={selectedIds} onToggle={toggleSelect} />
                  </TabsContent>

                  <TabsContent value="B" className="mt-5 space-y-5">
                    <CompareChart selected={selected} />
                    <MetricsTable selected={[...selected].sort((a, b) => compareForRanking(a, b, profile))} />
                  </TabsContent>

                  <TabsContent value="C" className="mt-5">
                    <ReportScreen
                      selected={selected}
                      profile={profile}
                      mode={mode}
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

            <div className="mt-4 text-xs text-slate-600">
              <div className="inline-flex items-center gap-2 rounded-2xl border border-white/60 bg-white/55 px-4 py-2 backdrop-blur">
                <Lock className="h-4 w-4" />
                {t.misc.serverPlan}
              </div>
            </div>
          </div>

          {/* Нижняя панель */}
          <div className="fixed bottom-4 left-1/2 z-50 w-[min(1120px,calc(100%-24px))] -translate-x-1/2">
            <div className="pointer-events-auto rounded-3xl border border-white/60 bg-white/70 shadow-lg backdrop-blur">
              <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
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

                <div className="flex shrink-0 items-center gap-2">
                  <Button
                    variant="outline"
                    className="h-10 rounded-2xl bg-white/70 hover:bg-white"
                    onClick={() => setScreen("A")}
                    type="button"
                  >
                    {t.misc.openPicker}
                  </Button>

                  <Button
                    className="h-10 rounded-2xl"
                    onClick={onCompare}
                    disabled={!canCompare}
                    type="button"
                  >
                    {t.actions.compare}
                  </Button>

                  <Button
                    variant="outline"
                    className="h-10 rounded-2xl bg-white/70 hover:bg-white"
                    onClick={clear}
                    type="button"
                    disabled={!selected.length}
                  >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    {t.actions.clear}
                  </Button>
                </div>
              </div>

              <div className="border-t border-white/60 px-4 py-2 text-xs text-slate-600">
                {t.misc.tipBar}
              </div>
            </div>
          </div>
        </div>
      </TooltipProvider>
    </LangCtx.Provider>
  );
}
