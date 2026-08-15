-- CREATE DATABASE IF NOT EXISTS battery_calc;
-- USE battery_calc;

CREATE TABLE IF NOT EXISTS BatteryModel (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    nominalVoltage DECIMAL(5,2) NOT NULL,
    endVpc DECIMAL(5,2) NOT NULL
);

CREATE TABLE IF NOT EXISTS DischargeCapacity (
    id INT AUTO_INCREMENT PRIMARY KEY,
    batteryModelId VARCHAR(255) NOT NULL,
    hourRate DECIMAL(6,2) NOT NULL,
    ahCapacity DECIMAL(8,2) NOT NULL,
    whCapacity DECIMAL(8,2) NOT NULL,
    FOREIGN KEY (batteryModelId) REFERENCES BatteryModel(id) ON DELETE CASCADE
);
