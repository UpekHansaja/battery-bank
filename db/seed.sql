-- Seed data for BatteryBankCalc
-- Realistic UPS/telecom battery models with manufacturer discharge tables

-- ============================================================
-- Model 1: Generic 12V 100Ah AGM (Deep Cycle)
-- ============================================================
INSERT INTO BatteryModel (id, name, nominalVoltage, endVpc) VALUES
('agm-12v-100ah', '12V 100Ah AGM Deep Cycle', 12.00, 1.75);

INSERT INTO DischargeCapacity (batteryModelId, hourRate, ahCapacity, whCapacity) VALUES
('agm-12v-100ah', 1,   52.00,  624.00),
('agm-12v-100ah', 2,   64.00,  768.00),
('agm-12v-100ah', 3,   72.00,  864.00),
('agm-12v-100ah', 4,   78.00,  936.00),
('agm-12v-100ah', 5,   82.00,  984.00),
('agm-12v-100ah', 8,   90.00, 1080.00),
('agm-12v-100ah', 10,  95.00, 1140.00),
('agm-12v-100ah', 20, 100.00, 1200.00);

-- ============================================================
-- Model 2: 12V 200Ah GEL (Solar/Telecom)
-- ============================================================
INSERT INTO BatteryModel (id, name, nominalVoltage, endVpc) VALUES
('gel-12v-200ah', '12V 200Ah GEL Solar/Telecom', 12.00, 1.80);

INSERT INTO DischargeCapacity (batteryModelId, hourRate, ahCapacity, whCapacity) VALUES
('gel-12v-200ah', 1,  100.00, 1200.00),
('gel-12v-200ah', 2,  130.00, 1560.00),
('gel-12v-200ah', 3,  148.00, 1776.00),
('gel-12v-200ah', 4,  160.00, 1920.00),
('gel-12v-200ah', 5,  168.00, 2016.00),
('gel-12v-200ah', 8,  184.00, 2208.00),
('gel-12v-200ah', 10, 192.00, 2304.00),
('gel-12v-200ah', 20, 200.00, 2400.00);

-- ============================================================
-- Model 3: 2V 500Ah OPzV (Tubular GEL - Telecom/UPS)
-- ============================================================
INSERT INTO BatteryModel (id, name, nominalVoltage, endVpc) VALUES
('opzv-2v-500ah', '2V 500Ah OPzV Tubular GEL', 2.00, 1.80);

INSERT INTO DischargeCapacity (batteryModelId, hourRate, ahCapacity, whCapacity) VALUES
('opzv-2v-500ah', 1,  275.00,  550.00),
('opzv-2v-500ah', 2,  330.00,  660.00),
('opzv-2v-500ah', 3,  370.00,  740.00),
('opzv-2v-500ah', 4,  400.00,  800.00),
('opzv-2v-500ah', 5,  420.00,  840.00),
('opzv-2v-500ah', 8,  460.00,  920.00),
('opzv-2v-500ah', 10, 480.00,  960.00),
('opzv-2v-500ah', 20, 500.00, 1000.00);

-- ============================================================
-- Model 4: 12V 55Ah VRLA (Standard UPS)
-- ============================================================
INSERT INTO BatteryModel (id, name, nominalVoltage, endVpc) VALUES
('vrla-12v-55ah', '12V 55Ah VRLA UPS Battery', 12.00, 1.75);

INSERT INTO DischargeCapacity (batteryModelId, hourRate, ahCapacity, whCapacity) VALUES
('vrla-12v-55ah', 1,  28.00,  336.00),
('vrla-12v-55ah', 2,  35.00,  420.00),
('vrla-12v-55ah', 3,  40.00,  480.00),
('vrla-12v-55ah', 4,  43.00,  516.00),
('vrla-12v-55ah', 5,  45.50,  546.00),
('vrla-12v-55ah', 8,  50.00,  600.00),
('vrla-12v-55ah', 10, 52.00,  624.00),
('vrla-12v-55ah', 20, 55.00,  660.00);

-- ============================================================
-- Model 5: 2V 1000Ah OPzS (Flooded Tubular - Industrial)
-- ============================================================
INSERT INTO BatteryModel (id, name, nominalVoltage, endVpc) VALUES
('opzs-2v-1000ah', '2V 1000Ah OPzS Flooded Tubular', 2.00, 1.80);

INSERT INTO DischargeCapacity (batteryModelId, hourRate, ahCapacity, whCapacity) VALUES
('opzs-2v-1000ah', 1,   550.00, 1100.00),
('opzs-2v-1000ah', 2,   660.00, 1320.00),
('opzs-2v-1000ah', 3,   740.00, 1480.00),
('opzs-2v-1000ah', 4,   800.00, 1600.00),
('opzs-2v-1000ah', 5,   840.00, 1680.00),
('opzs-2v-1000ah', 8,   920.00, 1840.00),
('opzs-2v-1000ah', 10,  950.00, 1900.00),
('opzs-2v-1000ah', 20, 1000.00, 2000.00);

-- ============================================================
-- Model 6: 12V 150Ah LiFePO4 (Lithium Iron Phosphate)
-- ============================================================
INSERT INTO BatteryModel (id, name, nominalVoltage, endVpc) VALUES
('lifepo4-12v-150ah', '12V 150Ah LiFePO4 Lithium', 12.80, 2.50);

INSERT INTO DischargeCapacity (batteryModelId, hourRate, ahCapacity, whCapacity) VALUES
('lifepo4-12v-150ah', 1,  142.00, 1817.60),
('lifepo4-12v-150ah', 2,  145.00, 1856.00),
('lifepo4-12v-150ah', 3,  147.00, 1881.60),
('lifepo4-12v-150ah', 4,  148.00, 1894.40),
('lifepo4-12v-150ah', 5,  148.50, 1900.80),
('lifepo4-12v-150ah', 8,  149.00, 1907.20),
('lifepo4-12v-150ah', 10, 149.50, 1913.60),
('lifepo4-12v-150ah', 20, 150.00, 1920.00);
