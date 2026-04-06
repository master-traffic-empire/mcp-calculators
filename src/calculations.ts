/**
 * Pure calculation functions for all calculator tools.
 * No dependencies — these can be reused anywhere.
 */

// ── TDEE ──────────────────────────────────────────────────────────────────────

export type Gender = "male" | "female";
export type ActivityLevel =
  | "sedentary"
  | "lightly_active"
  | "moderately_active"
  | "very_active"
  | "extremely_active";

const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  lightly_active: 1.375,
  moderately_active: 1.55,
  very_active: 1.725,
  extremely_active: 1.9,
};

export function calculateBMR(
  weightKg: number,
  heightCm: number,
  age: number,
  gender: Gender
): number {
  // Mifflin-St Jeor equation
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return gender === "male" ? base + 5 : base - 161;
}

export function calculateTDEE(
  weightKg: number,
  heightCm: number,
  age: number,
  gender: Gender,
  activity: ActivityLevel
): { bmr: number; tdee: number; activity_multiplier: number } {
  const bmr = calculateBMR(weightKg, heightCm, age, gender);
  const multiplier = ACTIVITY_MULTIPLIERS[activity];
  return {
    bmr: Math.round(bmr),
    tdee: Math.round(bmr * multiplier),
    activity_multiplier: multiplier,
  };
}

// ── BMI ───────────────────────────────────────────────────────────────────────

export type BMICategory =
  | "Underweight"
  | "Normal weight"
  | "Overweight"
  | "Obese (Class I)"
  | "Obese (Class II)"
  | "Obese (Class III)";

export function calculateBMI(
  weightKg: number,
  heightCm: number
): { bmi: number; category: BMICategory } {
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  let category: BMICategory;

  if (bmi < 18.5) category = "Underweight";
  else if (bmi < 25) category = "Normal weight";
  else if (bmi < 30) category = "Overweight";
  else if (bmi < 35) category = "Obese (Class I)";
  else if (bmi < 40) category = "Obese (Class II)";
  else category = "Obese (Class III)";

  return { bmi: Math.round(bmi * 10) / 10, category };
}

// ── Mortgage ──────────────────────────────────────────────────────────────────

export function calculateMortgage(
  principal: number,
  annualRate: number,
  years: number
): {
  monthly_payment: number;
  total_payment: number;
  total_interest: number;
} {
  const monthlyRate = annualRate / 100 / 12;
  const numPayments = years * 12;

  if (monthlyRate === 0) {
    const monthly = principal / numPayments;
    return {
      monthly_payment: Math.round(monthly * 100) / 100,
      total_payment: principal,
      total_interest: 0,
    };
  }

  const monthly =
    (principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments))) /
    (Math.pow(1 + monthlyRate, numPayments) - 1);

  const totalPayment = monthly * numPayments;

  return {
    monthly_payment: Math.round(monthly * 100) / 100,
    total_payment: Math.round(totalPayment * 100) / 100,
    total_interest: Math.round((totalPayment - principal) * 100) / 100,
  };
}

// ── Compound Interest ─────────────────────────────────────────────────────────

export function calculateCompoundInterest(
  principal: number,
  annualRate: number,
  years: number,
  monthlyContribution: number = 0,
  compoundingFrequency: number = 12
): {
  final_balance: number;
  total_contributions: number;
  total_interest_earned: number;
  yearly_breakdown: Array<{ year: number; balance: number }>;
} {
  const rate = annualRate / 100;
  const n = compoundingFrequency;
  let balance = principal;
  const yearly: Array<{ year: number; balance: number }> = [];

  for (let year = 1; year <= years; year++) {
    for (let period = 0; period < n; period++) {
      balance = balance * (1 + rate / n) + monthlyContribution * (12 / n);
    }
    yearly.push({ year, balance: Math.round(balance * 100) / 100 });
  }

  const totalContributions = principal + monthlyContribution * 12 * years;

  return {
    final_balance: Math.round(balance * 100) / 100,
    total_contributions: Math.round(totalContributions * 100) / 100,
    total_interest_earned: Math.round((balance - totalContributions) * 100) / 100,
    yearly_breakdown: yearly,
  };
}

// ── Take-Home Pay ─────────────────────────────────────────────────────────────

export type FilingStatus = "single" | "married_jointly" | "married_separately" | "head_of_household";

// 2025 federal tax brackets (simplified)
const FEDERAL_BRACKETS_SINGLE = [
  { min: 0, max: 11600, rate: 0.10 },
  { min: 11600, max: 47150, rate: 0.12 },
  { min: 47150, max: 100525, rate: 0.22 },
  { min: 100525, max: 191950, rate: 0.24 },
  { min: 191950, max: 243725, rate: 0.32 },
  { min: 243725, max: 609350, rate: 0.35 },
  { min: 609350, max: Infinity, rate: 0.37 },
];

const FEDERAL_BRACKETS_MARRIED = [
  { min: 0, max: 23200, rate: 0.10 },
  { min: 23200, max: 94300, rate: 0.12 },
  { min: 94300, max: 201050, rate: 0.22 },
  { min: 201050, max: 383900, rate: 0.24 },
  { min: 383900, max: 487450, rate: 0.32 },
  { min: 487450, max: 731200, rate: 0.35 },
  { min: 731200, max: Infinity, rate: 0.37 },
];

// State income tax rates (flat rate approximation for top states)
const STATE_TAX_RATES: Record<string, number> = {
  AL: 0.05, AK: 0, AZ: 0.025, AR: 0.047, CA: 0.0930, CO: 0.044, CT: 0.0699,
  DE: 0.066, FL: 0, GA: 0.0549, HI: 0.11, ID: 0.058, IL: 0.0495, IN: 0.0305,
  IA: 0.06, KS: 0.057, KY: 0.04, LA: 0.0425, ME: 0.0715, MD: 0.0575,
  MA: 0.05, MI: 0.0425, MN: 0.0985, MS: 0.05, MO: 0.048, MT: 0.0675,
  NE: 0.0664, NV: 0, NH: 0, NJ: 0.1075, NM: 0.059, NY: 0.109, NC: 0.045,
  ND: 0.0195, OH: 0.0399, OK: 0.0475, OR: 0.099, PA: 0.0307, RI: 0.0599,
  SC: 0.065, SD: 0, TN: 0, TX: 0, UT: 0.0465, VT: 0.0875, VA: 0.0575,
  WA: 0, WV: 0.0512, WI: 0.0765, WY: 0, DC: 0.1075,
};

function computeFederalTax(taxableIncome: number, filing: FilingStatus): number {
  const brackets =
    filing === "married_jointly"
      ? FEDERAL_BRACKETS_MARRIED
      : FEDERAL_BRACKETS_SINGLE;

  let tax = 0;
  for (const bracket of brackets) {
    if (taxableIncome <= bracket.min) break;
    const taxable = Math.min(taxableIncome, bracket.max) - bracket.min;
    tax += taxable * bracket.rate;
  }
  return tax;
}

export function calculateTakeHomePay(
  grossAnnualSalary: number,
  state: string,
  filingStatus: FilingStatus = "single"
): {
  gross_annual: number;
  federal_tax: number;
  state_tax: number;
  fica_social_security: number;
  fica_medicare: number;
  total_deductions: number;
  net_annual: number;
  net_monthly: number;
  net_biweekly: number;
  effective_tax_rate: number;
} {
  const stateCode = state.toUpperCase();
  const standardDeduction = filingStatus === "married_jointly" ? 29200 : 14600;
  const taxableIncome = Math.max(0, grossAnnualSalary - standardDeduction);

  const federalTax = computeFederalTax(taxableIncome, filingStatus);
  const stateTaxRate = STATE_TAX_RATES[stateCode] ?? 0.05;
  const stateTax = grossAnnualSalary * stateTaxRate;

  // FICA
  const ssWageCap = 168600;
  const socialSecurity = Math.min(grossAnnualSalary, ssWageCap) * 0.062;
  const medicare = grossAnnualSalary * 0.0145;
  const additionalMedicare = Math.max(0, grossAnnualSalary - 200000) * 0.009;

  const totalDeductions =
    federalTax + stateTax + socialSecurity + medicare + additionalMedicare;
  const netAnnual = grossAnnualSalary - totalDeductions;

  return {
    gross_annual: grossAnnualSalary,
    federal_tax: Math.round(federalTax * 100) / 100,
    state_tax: Math.round(stateTax * 100) / 100,
    fica_social_security: Math.round(socialSecurity * 100) / 100,
    fica_medicare: Math.round((medicare + additionalMedicare) * 100) / 100,
    total_deductions: Math.round(totalDeductions * 100) / 100,
    net_annual: Math.round(netAnnual * 100) / 100,
    net_monthly: Math.round((netAnnual / 12) * 100) / 100,
    net_biweekly: Math.round((netAnnual / 26) * 100) / 100,
    effective_tax_rate:
      Math.round((totalDeductions / grossAnnualSalary) * 10000) / 100,
  };
}

// ── Percentage ────────────────────────────────────────────────────────────────

export function calculatePercentage(
  operation: "of" | "change" | "is_what_percent",
  x: number,
  y: number
): { result: number; explanation: string } {
  switch (operation) {
    case "of":
      return {
        result: Math.round((x / 100) * y * 10000) / 10000,
        explanation: `${x}% of ${y} = ${(x / 100) * y}`,
      };
    case "change":
      if (y === 0) return { result: 0, explanation: "Cannot calculate change from 0" };
      const change = ((x - y) / Math.abs(y)) * 100;
      return {
        result: Math.round(change * 100) / 100,
        explanation: `Change from ${y} to ${x} = ${Math.round(change * 100) / 100}%`,
      };
    case "is_what_percent":
      if (y === 0) return { result: 0, explanation: "Cannot divide by 0" };
      const pct = (x / y) * 100;
      return {
        result: Math.round(pct * 100) / 100,
        explanation: `${x} is ${Math.round(pct * 100) / 100}% of ${y}`,
      };
  }
}

// ── Loan Payment ──────────────────────────────────────────────────────────────

export function calculateLoanPayment(
  amount: number,
  annualRate: number,
  termMonths: number
): {
  monthly_payment: number;
  total_payment: number;
  total_interest: number;
  amortization_first_12: Array<{
    month: number;
    payment: number;
    principal: number;
    interest: number;
    balance: number;
  }>;
} {
  const monthlyRate = annualRate / 100 / 12;

  if (monthlyRate === 0) {
    const monthly = amount / termMonths;
    return {
      monthly_payment: Math.round(monthly * 100) / 100,
      total_payment: amount,
      total_interest: 0,
      amortization_first_12: [],
    };
  }

  const monthly =
    (amount * (monthlyRate * Math.pow(1 + monthlyRate, termMonths))) /
    (Math.pow(1 + monthlyRate, termMonths) - 1);

  let balance = amount;
  const amortization: Array<{
    month: number;
    payment: number;
    principal: number;
    interest: number;
    balance: number;
  }> = [];

  for (let m = 1; m <= Math.min(termMonths, 12); m++) {
    const interest = balance * monthlyRate;
    const principalPaid = monthly - interest;
    balance -= principalPaid;
    amortization.push({
      month: m,
      payment: Math.round(monthly * 100) / 100,
      principal: Math.round(principalPaid * 100) / 100,
      interest: Math.round(interest * 100) / 100,
      balance: Math.round(Math.max(0, balance) * 100) / 100,
    });
  }

  const totalPayment = monthly * termMonths;

  return {
    monthly_payment: Math.round(monthly * 100) / 100,
    total_payment: Math.round(totalPayment * 100) / 100,
    total_interest: Math.round((totalPayment - amount) * 100) / 100,
    amortization_first_12: amortization,
  };
}

// ── Unit Converter ────────────────────────────────────────────────────────────

type UnitCategory = "length" | "weight" | "volume" | "area";

interface ConversionResult {
  converted: number;
  factor: number;
  category: UnitCategory;
  error?: never;
}

interface ConversionError {
  error: string;
  converted?: never;
  factor?: never;
  category?: never;
}

// All values stored as SI base unit (m, kg, m³, m²)
const LENGTH_TO_METERS: Record<string, number> = {
  mm: 0.001,
  cm: 0.01,
  m: 1,
  km: 1000,
  in: 0.0254,
  ft: 0.3048,
  yd: 0.9144,
  mi: 1609.344,
};

const WEIGHT_TO_KG: Record<string, number> = {
  mg: 0.000001,
  g: 0.001,
  kg: 1,
  t: 1000,
  oz: 0.028349523125,
  lb: 0.45359237,
  st: 6.35029318,
};

const VOLUME_TO_LITERS: Record<string, number> = {
  ml: 0.001,
  l: 1,
  fl_oz: 0.0295735296,
  cup: 0.2365882365,
  pt: 0.473176473,
  qt: 0.946352946,
  gal: 3.785411784,
};

const AREA_TO_M2: Record<string, number> = {
  mm2: 0.000001,
  cm2: 0.0001,
  m2: 1,
  km2: 1000000,
  in2: 0.00064516,
  ft2: 0.09290304,
  yd2: 0.83612736,
  acre: 4046.8564224,
  ha: 10000,
};

function detectCategory(unit: string): { category: UnitCategory; table: Record<string, number> } | null {
  if (unit in LENGTH_TO_METERS) return { category: "length", table: LENGTH_TO_METERS };
  if (unit in WEIGHT_TO_KG) return { category: "weight", table: WEIGHT_TO_KG };
  if (unit in VOLUME_TO_LITERS) return { category: "volume", table: VOLUME_TO_LITERS };
  if (unit in AREA_TO_M2) return { category: "area", table: AREA_TO_M2 };
  return null;
}

export function convertUnit(
  value: number,
  fromUnit: string,
  toUnit: string
): ConversionResult | ConversionError {
  const from = detectCategory(fromUnit);
  const to = detectCategory(toUnit);

  if (!from) return { error: `Unknown unit: "${fromUnit}". Supported: ${Object.keys(LENGTH_TO_METERS).concat(Object.keys(WEIGHT_TO_KG)).concat(Object.keys(VOLUME_TO_LITERS)).concat(Object.keys(AREA_TO_M2)).join(", ")}` };
  if (!to) return { error: `Unknown unit: "${toUnit}".` };
  if (from.category !== to.category) return { error: `Cannot convert ${from.category} unit "${fromUnit}" to ${to.category} unit "${toUnit}"` };

  const factor = from.table[fromUnit] / to.table[toUnit];
  const converted = Math.round(value * factor * 1e10) / 1e10;

  return { converted, factor: Math.round(factor * 1e10) / 1e10, category: from.category };
}

export function convertTemperature(
  value: number,
  from: "C" | "F" | "K",
  to: "C" | "F" | "K"
): { converted: number } {
  if (from === to) return { converted: Math.round(value * 1e6) / 1e6 };

  // Convert to Celsius first
  let celsius: number;
  if (from === "C") celsius = value;
  else if (from === "F") celsius = (value - 32) * (5 / 9);
  else celsius = value - 273.15;

  // Convert from Celsius to target
  let result: number;
  if (to === "C") result = celsius;
  else if (to === "F") result = celsius * (9 / 5) + 32;
  else result = celsius + 273.15;

  return { converted: Math.round(result * 1e6) / 1e6 };
}

// ── Statistics ────────────────────────────────────────────────────────────────

export function calculateStatistics(
  values: number[],
  customPercentiles?: number[]
): {
  count: number;
  sum: number;
  min: number;
  max: number;
  range: number;
  mean: number;
  median: number;
  mode: number[];
  std_dev_sample: number;
  std_dev_population: number;
  variance_sample: number;
  variance_population: number;
  q1: number;
  q2: number;
  q3: number;
  iqr: number;
  percentiles?: Array<{ percentile: number; value: number }>;
} {
  const sorted = [...values].sort((a, b) => a - b);
  const n = sorted.length;

  const sum = sorted.reduce((acc, v) => acc + v, 0);
  const mean = sum / n;

  // Median
  const median =
    n % 2 === 0
      ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2
      : sorted[Math.floor(n / 2)];

  // Mode (all values with maximum frequency)
  const freq = new Map<number, number>();
  for (const v of sorted) freq.set(v, (freq.get(v) ?? 0) + 1);
  const maxFreq = Math.max(...freq.values());
  const mode = maxFreq > 1 ? [...freq.entries()].filter(([, f]) => f === maxFreq).map(([v]) => v) : [];

  // Variance
  const squaredDiffs = sorted.map((v) => Math.pow(v - mean, 2));
  const sumSquaredDiffs = squaredDiffs.reduce((acc, v) => acc + v, 0);
  const variancePop = sumSquaredDiffs / n;
  const varianceSample = n > 1 ? sumSquaredDiffs / (n - 1) : 0;

  const round = (v: number) => Math.round(v * 1e8) / 1e8;

  // Percentile helper (linear interpolation)
  function percentile(p: number): number {
    if (n === 1) return sorted[0];
    const rank = (p / 100) * (n - 1);
    const lower = Math.floor(rank);
    const upper = Math.ceil(rank);
    const frac = rank - lower;
    return round(sorted[lower] * (1 - frac) + sorted[upper] * frac);
  }

  const q1 = percentile(25);
  const q2 = percentile(50);
  const q3 = percentile(75);

  const result: ReturnType<typeof calculateStatistics> = {
    count: n,
    sum: round(sum),
    min: sorted[0],
    max: sorted[n - 1],
    range: round(sorted[n - 1] - sorted[0]),
    mean: round(mean),
    median: round(median),
    mode,
    std_dev_sample: round(Math.sqrt(varianceSample)),
    std_dev_population: round(Math.sqrt(variancePop)),
    variance_sample: round(varianceSample),
    variance_population: round(variancePop),
    q1,
    q2,
    q3,
    iqr: round(q3 - q1),
  };

  if (customPercentiles && customPercentiles.length > 0) {
    result.percentiles = customPercentiles.map((p) => ({ percentile: p, value: percentile(p) }));
  }

  return result;
}

// ── Password Generator ────────────────────────────────────────────────────────

export function generatePassword(
  length: number = 16,
  options: {
    uppercase?: boolean;
    lowercase?: boolean;
    numbers?: boolean;
    symbols?: boolean;
  } = {}
): { password: string; strength: string; entropy_bits: number } {
  const {
    uppercase = true,
    lowercase = true,
    numbers = true,
    symbols = true,
  } = options;

  let chars = "";
  if (lowercase) chars += "abcdefghijklmnopqrstuvwxyz";
  if (uppercase) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (numbers) chars += "0123456789";
  if (symbols) chars += "!@#$%^&*()_+-=[]{}|;:,.<>?";

  if (chars.length === 0) chars = "abcdefghijklmnopqrstuvwxyz";

  const randomBytes = new Uint8Array(length);
  crypto.getRandomValues(randomBytes);

  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars[randomBytes[i] % chars.length];
  }

  const entropy = Math.round(length * Math.log2(chars.length));
  let strength: string;
  if (entropy < 36) strength = "Very Weak";
  else if (entropy < 60) strength = "Weak";
  else if (entropy < 80) strength = "Moderate";
  else if (entropy < 120) strength = "Strong";
  else strength = "Very Strong";

  return { password, strength, entropy_bits: entropy };
}
