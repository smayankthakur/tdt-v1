import OpenAI from 'openai'

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { prompt, text, targetLang } = body

    if (!prompt || !text || !targetLang) {
      return Response.json(
        { error: " Missing required fields: prompt text targetLang\ },
 { status: 400 }
 )
 }

 if (!process.env.OPENAI_API_KEY) {
 return Response.json({
 text: text,
 translation: text,
 source: \fallback\,
 note: \OpenAI API key not configured\,
 })
 }

 const response = await client.chat.completions.create({
 model: \gpt-4o-mini\,
 messages: [
 {
 role: \system\,
 content:
 \You are a professional translator for a tarot reading app. \ +
 \Translate UI text into the target language. \ +
 \Keep it short natural warm and spiritually appropriate. \ +
 \No explanations return only the translation.\\n\ +
 \Target language: \ + targetLang,
 },
 {
 role: \user\,
 content: prompt,
 },
 ],
 temperature: 0.3,
 max_tokens: 100,
 })

 const translated = response.choices[0].message.content?.trim() || text

 return Response.json({
 text: translated,
 translation: translated,
 source: \openai\,
 model: \gpt-4o-mini\,
 })
 } catch (error: any) {
 console.error(\[api/translate] Error:\, error)
 const body = await req.json().catch(() => ({}))
 return Response.json(
 {
 text: body.text || body.prompt || \\,
 translation: body.text || body.prompt || \\,
 source: \fallback\,
 error: error?.message || \Translation service unavailable\,
 },
 { status: 200 }
 )
 }
}
