import OpenAI from 'openai';
import { VideoScript, generateScript, formatScriptForTTS, getScheduledScripts } from './video-scripts';

export type { VideoScript };

const openai = process.env.OPENAI_API_KEY || process.env.OPENAI_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_KEY })
  : null;

export interface VideoAsset {
  script: string;
  audioUrl?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  subtitlesUrl?: string;
}

export interface GeneratedVideo {
  id: string;
  platform: 'youtube' | 'instagram' | 'tiktok';
  script: VideoScript;
  assets: VideoAsset;
  status: 'draft' | 'rendering' | 'ready' | 'published';
  scheduledTime?: Date;
}

const DAILY_VIDEO_COUNT = 3;

export async function generateVideoScript(
  type: 'curiosity' | 'emotional' | 'zodiac',
  category: 'love' | 'career' | 'breakup' | 'confusion' | 'general',
  zodiacSign?: string
): Promise<VideoScript> {
  if (openai && Math.random() > 0.5) {
    try {
      const aiScript = await generateAIScript(type, category, zodiacSign);
      if (aiScript) return aiScript;
    } catch (e) {
      console.error('[VideoGen] AI script generation failed, using template');
    }
  }
  
  return generateScript(type, category, zodiacSign);
}

async function generateAIScript(
  type: string,
  category: string,
  zodiacSign?: string
): Promise<VideoScript | null> {
  if (!openai) return null;

  const signText = zodiacSign ? ` for ${zodiacSign}` : '';
  
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: 'You are a mystical tarot video script writer. Create short, emotional, curiosity-driven scripts for social media. Keep it under 40 words total. Include hook, build, insight, and CTA.'
      },
      {
        role: 'user',
        content: `Create a ${type} tarot video script${signText} about ${category}. Make it emotional and curiosity-driven.`
      }
    ],
    temperature: 0.8,
    max_tokens: 150,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) return null;

  const parts = content.split('\n').filter(p => p.trim());
  if (parts.length >= 3) {
    return {
      hook: parts[0] || '',
      build: parts[1] || '',
      insight: parts.slice(2, -1).join(' '),
      cta: parts[parts.length - 1] || '',
    };
  }

  return null;
}

export async function generateDailyVideos(): Promise<VideoScript[]> {
  const scripts: VideoScript[] = [];
  const scheduled = getScheduledScripts(new Date());
  
  for (let i = 0; i < DAILY_VIDEO_COUNT; i++) {
    const type = scheduled[i % scheduled.length] ? 'emotional' : 'curiosity';
    const categories: ('love' | 'career' | 'breakup' | 'confusion' | 'general')[] = [
      'love', 'career', 'breakup', 'confusion', 'general'
    ];
    const category = categories[i % categories.length];
    
    const script = await generateVideoScript(type, category);
    scripts.push(script);
  }

  return scripts;
}

export function generateVideoAsset(script: VideoScript): VideoAsset {
  const ttsText = formatScriptForTTS(script);
  
  return {
    script: ttsText,
    audioUrl: undefined,
    videoUrl: undefined,
    thumbnailUrl: undefined,
    subtitlesUrl: undefined,
  };
}

export async function textToSpeech(text: string): Promise<Buffer | null> {
  if (!process.env.ELEVENLABS_API_KEY) {
    console.log('[VideoGen] TTS not configured, would generate:', text.substring(0, 50));
    return null;
  }

  try {
    const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM', {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': process.env.ELEVENLABS_API_KEY,
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.4,
          similarity_boost: 0.75,
        },
      }),
    });

    if (response.ok) {
      const buffer = Buffer.from(await response.arrayBuffer());
      return buffer;
    }
  } catch (error) {
    console.error('[VideoGen] TTS error:', error);
  }

  return null;
}

export function extractKeywordsFromScript(script: VideoScript): string[] {
  const text = `${script.hook} ${script.build} ${script.insight}`.toLowerCase();
  
  const keywords: string[] = [];
  
  if (text.includes('love') || text.includes('heart') || text.includes('ex')) {
    keywords.push('love', 'tarot');
  }
  if (text.includes('career') || text.includes('job') || text.includes('work')) {
    keywords.push('career', 'work');
  }
  if (text.includes('heal') || text.includes('pain') || text.includes('hurt')) {
    keywords.push('healing');
  }
  
  return [...keywords, 'tarot', 'spiritual'];
}

export interface VideoMetadata {
  title: string;
  description: string;
  tags: string[];
  category: string;
  privacyStatus: 'public' | 'private' | 'unlisted';
}

export function generateVideoMetadata(script: VideoScript): VideoMetadata {
  const scriptText = formatScriptForTTS(script);
  const title = `${script.hook.substring(0, 50)}... #tarot #spiritual`;
  
  const description = `${scriptText}

🔮 Get your personal tarot reading: thedivinetarot.com/reading

#TarotReading #Spiritual #Astrology #DailyGuidance`;

  const tags = extractKeywordsFromScript(script);

  return {
    title,
    description,
    tags,
    category: 'Entertainment',
    privacyStatus: 'public',
  };
}

export async function uploadToYouTube(
  videoPath: string,
  metadata: VideoMetadata
): Promise<{ videoId?: string; error?: string }> {
  console.log('[VideoGen] Would upload to YouTube:', metadata.title);
  return { error: 'YouTube API not configured' };
}

export async function uploadToInstagram(
  videoPath: string,
  caption: string
): Promise<{ mediaId?: string; error?: string }> {
  console.log('[VideoGen] Would upload to Instagram:', caption.substring(0, 50));
  return { error: 'Instagram API not configured' };
}

export async function processAndPublish(
  platform: 'youtube' | 'instagram'
): Promise<GeneratedVideo> {
  const scripts = await generateDailyVideos();
  const script = scripts[0];
  const asset = generateVideoAsset(script);
  const metadata = generateVideoMetadata(script);

  return {
    id: `vid_${Date.now()}`,
    platform,
    script,
    assets: asset,
    status: 'ready',
  };
}