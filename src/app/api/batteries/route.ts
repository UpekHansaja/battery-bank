import { NextResponse } from 'next/server';
import { getDbConnection } from '@/lib/db';

export async function GET() {
  try {
    const db = getDbConnection();
    
    const [models] = await db.execute('SELECT * FROM BatteryModel');
    const [capacities] = await db.execute('SELECT * FROM DischargeCapacity');

    const result = (models as any[]).map(model => ({
      ...model,
      capacities: (capacities as any[]).filter(c => c.batteryModelId === model.id)
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching batteries:', error);
    return NextResponse.json({ error: 'Failed to fetch batteries' }, { status: 500 });
  }
}
