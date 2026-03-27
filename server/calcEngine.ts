export interface DealData {
  property: {
    landArea: number; // sqm
    buildingArea: number; // sqm
    builtYear: number;
    structure: string; // RC, S, W
    residentialRatio: number; // 0-1
  };
  rentRoll: {
    totalRentMonthly: number; // JPY
    vacancyRate: number; // 0-1
  };
  expenses: {
    managementFeeRate: number; // 0-1 (of effective rent)
    repairFundMonthly: number; // JPY
    propertyTaxAnnual: number; // JPY
    otherExpensesAnnual: number; // JPY
  };
  transaction: {
    purchasePrice: number; // JPY
    brokerageFeeRate: number; // 0-1
    registrationFee: number; // JPY
    acquisitionTax: number; // JPY
    consultingFee: number; // JPY
    renovationCost: number; // JPY
  };
  financing: {
    loanAmount: number; // JPY
    interestRate: number; // 0-1
    loanTermYears: number; // Years
    amortizationYears: number; // Years
    loanAdminFee: number; // JPY
  };
  investmentParams: {
    targetCapRate: number; // 0-1
    exitCapRate: number; // 0-1
    holdingPeriodYears: number; // Years
  };
}

export function calculateSimulation(data: DealData) {
  // 3.1 Basic Variables
  const tsuboToSqm = 3.305785;
  const landAreaTsubo = data.property.landArea / tsuboToSqm;
  const buildingAreaTsubo = data.property.buildingArea / tsuboToSqm;

  // 3.2 Rent Roll Aggregation
  const grossPotentialRentAnnual = data.rentRoll.totalRentMonthly * 12;
  const effectiveGrossIncomeAnnual = grossPotentialRentAnnual * (1 - data.rentRoll.vacancyRate);

  // 3.3 Annual Expenses
  const managementFeeAnnual = effectiveGrossIncomeAnnual * data.expenses.managementFeeRate;
  const repairFundAnnual = data.expenses.repairFundMonthly * 12;
  const totalOperatingExpensesAnnual = managementFeeAnnual + repairFundAnnual + data.expenses.propertyTaxAnnual + data.expenses.otherExpensesAnnual;

  // 3.4 NOI (Net Operating Income)
  const noi = effectiveGrossIncomeAnnual - totalOperatingExpensesAnnual;

  // 3.5 Income Approach Value (Cap Rate Valuation)
  const incomeApproachValue = noi / data.investmentParams.targetCapRate;

  // 3.6 Purchase Cost
  // Brokerage fee (3% + 60,000 JPY + Tax)
  const brokerageFee = (data.transaction.purchasePrice * data.transaction.brokerageFeeRate) + 60000;
  const brokerageFeeTaxInc = brokerageFee * 1.1;
  const totalPurchaseCost = data.transaction.purchasePrice + brokerageFeeTaxInc + data.transaction.registrationFee + data.transaction.acquisitionTax + data.transaction.consultingFee + data.transaction.renovationCost + data.financing.loanAdminFee;

  // 3.7 Amortization (PMT)
  const monthlyInterestRate = data.financing.interestRate / 12;
  const amortizationMonths = data.financing.amortizationYears * 12;
  
  let monthlyPayment = 0;
  if (monthlyInterestRate > 0) {
    monthlyPayment = data.financing.loanAmount * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, amortizationMonths)) / (Math.pow(1 + monthlyInterestRate, amortizationMonths) - 1);
  } else {
    monthlyPayment = data.financing.loanAmount / amortizationMonths;
  }
  const annualDebtService = monthlyPayment * 12;

  // Cash Flow Before Tax (CFBT)
  const cfbt = noi - annualDebtService;

  // 3.8 Capital Gain / Gross Profit
  // Assume exit price based on NOI and Exit Cap Rate
  const exitPrice = noi / data.investmentParams.exitCapRate;
  
  // Calculate remaining loan balance at exit
  const exitMonth = data.investmentParams.holdingPeriodYears * 12;
  let remainingLoanBalance = data.financing.loanAmount;
  for (let i = 0; i < exitMonth; i++) {
    const interestPayment = remainingLoanBalance * monthlyInterestRate;
    const principalPayment = monthlyPayment - interestPayment;
    remainingLoanBalance -= principalPayment;
  }

  const salesProceedsBeforeTax = exitPrice - remainingLoanBalance;
  const capitalGain = exitPrice - data.transaction.purchasePrice; // Simplified

  // 3.9 Yields
  const grossYield = grossPotentialRentAnnual / data.transaction.purchasePrice;
  const fcr = noi / totalPurchaseCost; // Free and Clear Return
  const equity = totalPurchaseCost - data.financing.loanAmount;
  const ccr = equity > 0 ? cfbt / equity : 0; // Cash on Cash Return

  // 3.10 IRR Calculation (Simplified Annual IRR)
  const cashFlows = [-equity];
  for (let i = 0; i < data.investmentParams.holdingPeriodYears; i++) {
    cashFlows.push(cfbt);
  }
  cashFlows[cashFlows.length - 1] += salesProceedsBeforeTax;
  
  const irr = calculateIRR(cashFlows);

  // 3.11 Sensitivity Analysis (Cap Rate vs Vacancy Rate)
  const sensitivityMatrix = [];
  const capRates = [
    data.investmentParams.targetCapRate - 0.01,
    data.investmentParams.targetCapRate - 0.005,
    data.investmentParams.targetCapRate,
    data.investmentParams.targetCapRate + 0.005,
    data.investmentParams.targetCapRate + 0.01,
  ];
  const vacancyRates = [
    Math.max(0, data.rentRoll.vacancyRate - 0.05),
    data.rentRoll.vacancyRate,
    data.rentRoll.vacancyRate + 0.05,
    data.rentRoll.vacancyRate + 0.10,
  ];

  for (const vRate of vacancyRates) {
    const row = { vacancyRate: vRate, values: [] as number[] };
    const egi = grossPotentialRentAnnual * (1 - vRate);
    const mFee = egi * data.expenses.managementFeeRate;
    const opex = mFee + repairFundAnnual + data.expenses.propertyTaxAnnual + data.expenses.otherExpensesAnnual;
    const currentNoi = egi - opex;

    for (const cRate of capRates) {
      row.values.push(currentNoi / cRate);
    }
    sensitivityMatrix.push(row);
  }

  // 3.12 Cost Approach Value (Simplified)
  // Mock values based on structure
  let unitCost = 200000; // JPY/sqm
  if (data.property.structure === "RC") unitCost = 300000;
  const buildingCostValue = data.property.buildingArea * unitCost;
  const landCostValue = data.property.landArea * 500000; // Mock land price
  const costApproachValue = buildingCostValue + landCostValue;

  return {
    kpis: {
      grossPotentialRentAnnual,
      effectiveGrossIncomeAnnual,
      totalOperatingExpensesAnnual,
      noi,
      incomeApproachValue,
      totalPurchaseCost,
      annualDebtService,
      cfbt,
      exitPrice,
      capitalGain,
      grossYield,
      fcr,
      ccr,
      irr,
      costApproachValue
    },
    sensitivityMatrix: {
      capRates,
      vacancyRates,
      matrix: sensitivityMatrix
    }
  };
}

// Simple IRR approximation using Newton-Raphson
function calculateIRR(cashFlows: number[], guess = 0.1): number {
  const maxIter = 100;
  const tol = 1e-6;
  let rate = guess;

  for (let i = 0; i < maxIter; i++) {
    let npv = 0;
    let dNpv = 0;
    for (let t = 0; t < cashFlows.length; t++) {
      npv += cashFlows[t] / Math.pow(1 + rate, t);
      if (t > 0) {
        dNpv -= t * cashFlows[t] / Math.pow(1 + rate, t + 1);
      }
    }
    if (Math.abs(npv) < tol) return rate;
    rate = rate - npv / dNpv;
  }
  return rate;
}
