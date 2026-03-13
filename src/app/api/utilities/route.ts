import { NextRequest, NextResponse } from 'next/server';
import { buildUtilityReport } from '@/lib/aggregator';

export async function POST(req: NextRequest) {
  try {
    const { address } = await req.json();
    if (!address || typeof address !== 'string' || address.trim().length < 5) {
      return NextResponse.json({ error: 'A valid US address is required.' }, { status: 400 });
    }

    const report = await buildUtilityReport(address.trim());
    return NextResponse.json(report);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
