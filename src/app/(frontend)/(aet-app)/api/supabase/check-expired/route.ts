import { createClient } from '../../../utils/supabase/server'
import { NextResponse } from 'next/server'
import { PAYMENT_DEADLINE } from '../../../components/StatusCheck/utils'
import { headers } from 'next/headers'

const GITHUB_ACTIONS_API_KEY = process.env.GITHUB_ACTIONS_API_KEY

export async function POST() {
  console.log('Received check-expired request')

  try {
    // Validate API key
    const headersList = await headers()
    const authHeader = headersList.get('authorization')
    const token = authHeader?.split(' ')[1]

    if (!GITHUB_ACTIONS_API_KEY || token !== GITHUB_ACTIONS_API_KEY) {
      console.warn('Unauthorized access attempt to check-expired API')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const client = await createClient()
    const now = new Date()
    const deadline = new Date(now.getTime() - PAYMENT_DEADLINE * 60 * 60 * 1000)

    console.log('Checking for expired applications:', {
      currentTime: now.toISOString(),
      deadline: deadline.toISOString(),
      paymentDeadlineHours: PAYMENT_DEADLINE,
    })

    // Find applications that are:
    // 1. Status is either 'submitted' or 'cancelled'
    // 2. Payment status is pending
    // 3. Submitted more than PAYMENT_DEADLINE hours ago
    const { data: expiredApplications, error } = await client
      .from('fce_applications')
      .select('id, submitted_at, payment_status, status')
      .in('status', ['submitted', 'cancelled'])
      .eq('payment_status', 'pending')
      .lt('submitted_at', deadline.toISOString())

    if (error) {
      console.error('Error fetching expired applications:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log('Found applications:', {
      count: expiredApplications?.length || 0,
      applications: expiredApplications?.map((app) => ({
        id: app.id,
        submitted_at: app.submitted_at,
        payment_status: app.payment_status,
      })),
    })

    if (!expiredApplications || expiredApplications.length === 0) {
      return NextResponse.json({ message: 'No applications to expire' })
    }

    // Update expired applications
    const { error: updateError } = await client
      .from('fce_applications')
      .update({ payment_status: 'expired' })
      .in(
        'id',
        expiredApplications.map((app) => app.id)
      )

    if (updateError) {
      console.error('Error updating expired applications:', updateError)
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    console.log(`Successfully marked ${expiredApplications.length} applications as expired`)
    return NextResponse.json({
      message: `Successfully marked ${expiredApplications.length} applications as expired`,
      expiredApplications,
    })
  } catch (error) {
    console.error('Unexpected error in check-expired API:', error)
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 })
  }
}
