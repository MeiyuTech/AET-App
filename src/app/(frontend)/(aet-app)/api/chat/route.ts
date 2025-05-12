import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
if (!supabaseUrl) {
  throw new Error('Supabase URL is not set')
}
if (!supabaseKey) {
  throw new Error('Supabase key is not set')
}
const supabase = createClient(supabaseUrl, supabaseKey)

export async function POST(req: Request) {
  try {
    const { message } = await req.json()

    // Store the message in Supabase
    const { data: messageData, error: messageError } = await supabase
      .from('chat_messages')
      .insert([
        {
          role: 'user',
          content: message,
        },
      ])
      .select()

    if (messageError) throw messageError

    // TODO: Implement your AI logic here
    // This is a placeholder response
    const aiResponse = "I'm your AI assistant. How can I help you today?"

    // Store the AI response in Supabase
    const { data: responseData, error: responseError } = await supabase
      .from('chat_messages')
      .insert([
        {
          role: 'assistant',
          content: aiResponse,
        },
      ])
      .select()

    if (responseError) throw responseError

    return NextResponse.json({ message: aiResponse })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
