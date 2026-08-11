export interface DischargeCapacity {
  hourRate: number;
  ahCapacity: number;
  whCapacity: number;
}

export interface BatteryModel {
  id: string;
  name: string;
  nominalVoltage: number;
  endVpc: number;
  capacities: DischargeCapacity[];
}

export function findBracketingRates(rates: number[], target: number): [number, number] {
  // Assuming rates are sorted in ascending order
  const sortedRates = [...rates].sort((a, b) => a - b);
  
  if (target <= sortedRates[0]) {
    return [sortedRates[0], sortedRates[1] || sortedRates[0]];
  }
  
  if (target >= sortedRates[sortedRates.length - 1]) {
    return [sortedRates[sortedRates.length - 2] || sortedRates[sortedRates.length - 1], sortedRates[sortedRates.length - 1]];
  }

  let lower = sortedRates[0];
  let upper = sortedRates[sortedRates.length - 1];

  for (let i = 0; i < sortedRates.length - 1; i++) {
    if (target >= sortedRates[i] && target <= sortedRates[i + 1]) {
      lower = sortedRates[i];
      upper = sortedRates[i + 1];
      break;
    }
  }

  return [lower, upper];
}

export function interpolateCapacity(
  lowerRate: number,
  lowerCap: number,
  upperRate: number,
  upperCap: number,
  targetRate: number
): number {
  if (lowerRate === upperRate) return lowerCap;
  
  const slope = (upperCap - lowerCap) / (upperRate - lowerRate);
  return lowerCap + slope * (targetRate - lowerRate);
}

export function calculateRequiredBatteries(
  loadW: number,
  requiredHours: number,
  batteryData: DischargeCapacity[],
  deratingFactor: number = 0.8
): { requiredWh: number, deratedWhPerCell: number, stringsNeeded: number, isExtrapolating: boolean } {
  const rates = batteryData.map(d => d.hourRate);
  const isExtrapolating = requiredHours < Math.min(...rates) || requiredHours > Math.max(...rates);
  
  const [lowerRate, upperRate] = findBracketingRates(rates, requiredHours);
  
  const lowerData = batteryData.find(d => d.hourRate === lowerRate)!;
  const upperData = batteryData.find(d => d.hourRate === upperRate)!;
  
  const interpolatedWh = interpolateCapacity(
    lowerRate, lowerData.whCapacity,
    upperRate, upperData.whCapacity,
    requiredHours
  );
  
  const deratedWhPerCell = interpolatedWh * deratingFactor;
  const requiredWh = loadW * requiredHours;
  const stringsNeeded = Math.ceil(requiredWh / deratedWhPerCell);
  
  return { requiredWh, deratedWhPerCell, stringsNeeded, isExtrapolating };
}

export function calculateActualReserveHours(
  installedBatteries: number,
  loadW: number,
  batteryData: DischargeCapacity[],
  deratingFactor: number = 0.8
): { actualReserveHours: number, isExtrapolating: boolean } {
  const rates = batteryData.map(d => d.hourRate).sort((a, b) => a - b);
  
  let lowerRate = -1;
  let upperRate = -1;
  
  for (let i = 0; i < rates.length - 1; i++) {
    const H1 = rates[i];
    const H2 = rates[i+1];
    
    const cap1 = batteryData.find(d => d.hourRate === H1)!.whCapacity;
    const cap2 = batteryData.find(d => d.hourRate === H2)!.whCapacity;
    
    const f1 = installedBatteries * cap1 * deratingFactor - loadW * H1;
    const f2 = installedBatteries * cap2 * deratingFactor - loadW * H2;
    
    if ((f1 >= 0 && f2 <= 0) || (f1 <= 0 && f2 >= 0)) { // Should cross zero
      lowerRate = H1;
      upperRate = H2;
      break;
    }
  }
  
  let isExtrapolating = false;
  
  if (lowerRate === -1) {
    isExtrapolating = true;
    const minH = rates[0];
    const maxH = rates[rates.length - 1];
    const capMin = batteryData.find(d => d.hourRate === minH)!.whCapacity;
    const capMax = batteryData.find(d => d.hourRate === maxH)!.whCapacity;
    
    const fMin = installedBatteries * capMin * deratingFactor - loadW * minH;
    const fMax = installedBatteries * capMax * deratingFactor - loadW * maxH;
    
    if (fMin < 0) {
      lowerRate = rates[0];
      upperRate = rates[1];
    } else if (fMax > 0) {
      lowerRate = rates[rates.length - 2];
      upperRate = rates[rates.length - 1];
    } else {
      // Fallback
      lowerRate = rates[0];
      upperRate = rates[1];
    }
  }
  
  const H1 = lowerRate;
  const H2 = upperRate;
  const cap1 = batteryData.find(d => d.hourRate === H1)!.whCapacity;
  const cap2 = batteryData.find(d => d.hourRate === H2)!.whCapacity;
  
  const num = installedBatteries * deratingFactor * cap1 - loadW * H1;
  const den = loadW * (H2 - H1) - installedBatteries * deratingFactor * (cap2 - cap1);
  
  let t = 0;
  if (den !== 0) {
    t = num / den;
  }
  
  const actualReserveHours = H1 + t * (H2 - H1);
  
  return { actualReserveHours, isExtrapolating };
}
