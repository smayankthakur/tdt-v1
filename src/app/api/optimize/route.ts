import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { code } = await req.json();

  // Send to your AI provider async (queue or background)
  // NEVER block response

  return NextResponse.json({
    suggestion: "Refactor large components into smaller hooks for performance.",
  });
}