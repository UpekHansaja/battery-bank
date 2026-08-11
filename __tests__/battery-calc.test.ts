import {
  DischargeCapacity,
  findBracketingRates,
  interpolateCapacity,
  calculateRequiredBatteries,
  calculateActualReserveHours
} from '../src/lib/battery-calc';

const sampleData: DischargeCapacity[] = [
  { hourRate: 1, ahCapacity: 368, whCapacity: 702 },
  { hourRate: 2, ahCapacity: 495, whCapacity: 952 },
  { hourRate: 3, ahCapacity: 584, whCapacity: 1126 },
  { hourRate: 4, ahCapacity: 666, whCapacity: 1292 },
  { hourRate: 5, ahCapacity: 684, whCapacity: 1331 },
  { hourRate: 8, ahCapacity: 786, whCapacity: 1533 },
  { hourRate: 10, ahCapacity: 862, whCapacity: 1685 },
  { hourRate: 12, ahCapacity: 909, whCapacity: 1787 },
  { hourRate: 24, ahCapacity: 1055, whCapacity: 2083 },
  { hourRate: 48, ahCapacity: 1235, whCapacity: 2458 }
];

describe('battery-calc', () => {
  describe('findBracketingRates', () => {
    it('should find exact match or correct brackets', () => {
      const rates = sampleData.map(d => d.hourRate);
      expect(findBracketingRates(rates, 2.5)).toEqual([2, 3]);
      expect(findBracketingRates(rates, 4)).toEqual([3, 4]);
      expect(findBracketingRates(rates, 4.5)).toEqual([4, 5]);
      
      // Extrapolation below minimum
      expect(findBracketingRates(rates, 0.5)).toEqual([1, 2]);
      
      // Extrapolation above maximum
      expect(findBracketingRates(rates, 50)).toEqual([24, 48]);
    });
  });

  describe('interpolateCapacity', () => {
    it('should interpolate linearly between two points', () => {
      // Between 2H (952) and 3H (1126) at 2.5H
      const result = interpolateCapacity(2, 952, 3, 1126, 2.5);
      expect(result).toBeCloseTo(952 + (1126 - 952) * 0.5); // 1039
    });
  });

  describe('calculateRequiredBatteries', () => {
    it('should calculate strings needed accurately with derating factor', () => {
      // 500W load for 2.5 hours
      const { requiredWh, deratedWhPerCell, stringsNeeded, isExtrapolating } = 
        calculateRequiredBatteries(500, 2.5, sampleData, 0.8);
      
      expect(requiredWh).toBe(1250);
      expect(isExtrapolating).toBe(false);
      
      const interpolatedWh = 952 + (1126 - 952) * 0.5; // 1039
      const expectedDerated = interpolatedWh * 0.8; // 831.2
      expect(deratedWhPerCell).toBeCloseTo(expectedDerated);
      
      expect(stringsNeeded).toBe(Math.ceil(1250 / 831.2)); // 2
    });

    it('should flag extrapolation', () => {
      const result = calculateRequiredBatteries(500, 50, sampleData, 0.8);
      expect(result.isExtrapolating).toBe(true);
    });
  });

  describe('calculateActualReserveHours', () => {
    it('should calculate actual reserve hours accurately', () => {
      // We know 2 strings at 500W with 0.8 derating gives us what reserve?
      // 2 * interpolatedWh(H) * 0.8 = 500 * H
      const { actualReserveHours, isExtrapolating } = 
        calculateActualReserveHours(2, 500, sampleData, 0.8);
      
      expect(isExtrapolating).toBe(false);
      
      // Verify the equation holds for the result
      const H = actualReserveHours;
      const [lower, upper] = findBracketingRates(sampleData.map(d=>d.hourRate), H);
      const capL = sampleData.find(d => d.hourRate === lower)!.whCapacity;
      const capU = sampleData.find(d => d.hourRate === upper)!.whCapacity;
      
      const capacityAtH = interpolateCapacity(lower, capL, upper, capU, H);
      const leftSide = 500 * H;
      const rightSide = 2 * capacityAtH * 0.8;
      
      expect(leftSide).toBeCloseTo(rightSide, 1); // allow minor float imprecision
    });
  });
});
