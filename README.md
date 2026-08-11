# Battery Bank Sizing Calculator

A modern Next.js web application for sizing battery banks based on manufacturer discharge tables. It calculates the required number of battery strings for a given load and autonomy duration, and performs a reverse validation check for proposed installed batteries.

## Features

- Linear interpolation of battery discharge rates to accurately determine capacity for any duration.
- Clean, responsive UI with real-time calculations.
- Reverse calculation to find exact reserve hours for a given string count.
- Powered by MySQL.

## Prerequisites

- Node.js (v20+)
- MySQL Server running locally (or remote)

## Getting Started

1. **Database Setup**
   - Ensure your MySQL server is running.
   - Run the provided schema script to create the database and tables:
     ```bash
     mysql -u root -p < db/schema.sql
     ```
   *(Adjust username `-u root` as needed)*

2. **Environment Variables**
   Create a `.env` file in the root of the project with your MySQL connection details:
   ```env
   MYSQL_HOST=localhost
   MYSQL_USER=root
   MYSQL_PASSWORD=your_password
   MYSQL_DATABASE=battery_calc
   ```

3. **Install Dependencies**
   ```bash
   npm install
   ```

4. **Seed Database**
   Load the example `SunGEL Ultra 2SGU1400` data into the database:
   ```bash
   npx tsx db/seed.ts
   ```

5. **Run the Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Adding New Battery Models

To add a new battery model, you will need to insert it into the `BatteryModel` table, and insert its discharge hour-rate mappings into the `DischargeCapacity` table. 
You can modify `db/seed.ts` and run it again to load more models programmatically.

## Unit Tests

Run the mathematical interpolation logic tests using Jest:
```bash
npm test
```
