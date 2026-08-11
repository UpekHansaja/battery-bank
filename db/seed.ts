import 'dotenv/config';
import mysql from 'mysql2/promise';

async function seed() {
  const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST || 'localhost',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || 'battery_calc',
  });

  try {
    console.log('Seeding Database...');

    // Clean existing data
    await connection.execute('DELETE FROM DischargeCapacity');
    await connection.execute('DELETE FROM BatteryModel');

    // Insert BatteryModel
    const batteryId = 'sungel-ultra-2sgu1400';
    await connection.execute(
      'INSERT INTO BatteryModel (id, name, nominalVoltage, endVpc) VALUES (?, ?, ?, ?)',
      [batteryId, 'SunGEL Ultra 2SGU1400', 2.0, 1.85]
    );

    // Insert DischargeCapacity Data
    const capacities = [
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

    for (const cap of capacities) {
      await connection.execute(
        'INSERT INTO DischargeCapacity (batteryModelId, hourRate, ahCapacity, whCapacity) VALUES (?, ?, ?, ?)',
        [batteryId, cap.hourRate, cap.ahCapacity, cap.whCapacity]
      );
    }

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await connection.end();
  }
}

seed();
