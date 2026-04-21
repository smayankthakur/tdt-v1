import { NextRequest, NextResponse } from 'next/server'
import { translations } from '@/translations'

/**
 * GET /api/translations
 * Returns all translations (merged with fallback)
 */
export async function GET() {
  try {
    // Return translations from local store (synced from i18n-sync.js)
    // In future, this will fetch from Supabase
    return NextResponse.json(translations)
  } catch (error) {
    console.error('[translations GET]', error)
    return NextResponse.json(
      { error: 'Failed to fetch translations' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/translations
 * Admin-only: Update/Create translations
 * Requires admin auth (TODO: Add authentication)
 */
export async function POST(request: NextRequest) {
  try {
    // TODO: Add admin authentication check
    const body = await request.json()
    const { key, english, hinglish, hindi } = body

    if (!key || !english) {
      return NextResponse.json(
        { error: 'Key and english text are required' },
        { status: 400 }
      )
    }

    // TODO: Update Supabase or local file via API
    // For now, we'll just respond with success
    // The actual persistence should be handled by the CMS admin panel
    
    return NextResponse.json({ success: true, key })
  } catch (error) {
    console.error('[translations POST]', error)
    return NextResponse.json(
      { error: 'Failed to update translation' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/translations
 * Batch update translations
 */
export async function PUT(request: NextRequest) {
  try {
    // TODO: Admin auth
    const body = await request.json()
    const { updates } = body // Array of { key, english, hinglish, hindi }

    if (!Array.isArray(updates)) {
      return NextResponse.json(
        { error: 'Updates must be an array' },
        { status: 400 }
      )
    }

    // TODO: Batch update in Supabase
    return NextResponse.json({ success: true, count: updates.length })
  } catch (error) {
    console.error('[translations PUT]', error)
    return NextResponse.json(
      { error: 'Failed to batch update' },
      { status: 500 }
    )
  }
}
