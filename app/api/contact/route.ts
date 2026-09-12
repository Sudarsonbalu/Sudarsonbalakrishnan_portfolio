import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { name, email, subject, message } = await req.json()

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required.' },
        { status: 400 }
      )
    }

    const targetEmail = 'sudarsonbalu@gmail.com'
    const formSubmitUrl = `https://formsubmit.co/ajax/${targetEmail}`

    // Pass Origin and Referer headers required by FormSubmit
    const origin = req.headers.get('origin') || 'http://localhost:3000'
    const referer = req.headers.get('referer') || `${origin}/contact`

    const response = await fetch(formSubmitUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Origin: origin,
        Referer: referer,
      },
      body: JSON.stringify({
        name,
        email,
        subject: subject || 'General Enquiry',
        message,
        _subject: `[Portfolio Inquiry] ${subject || 'General Enquiry'} from ${name}`,
        _replyto: email,
        _template: 'table',
        _captcha: 'false',
      }),
    })

    const data = await response.json().catch(() => ({}))

    if (data.success === 'true' || data.success === true) {
      return NextResponse.json({
        success: true,
        message: 'Your message has been delivered to Sudarson Balakrishnan.',
      })
    } else if (data.message && data.message.toLowerCase().includes('activation')) {
      return NextResponse.json({
        success: false,
        needsActivation: true,
        message:
          "FormSubmit has sent an 'Activate Form' link to sudarsonbalu@gmail.com. Please check your Gmail (including Spam folder) and click 'Activate Form' once.",
      })
    } else {
      return NextResponse.json(
        {
          error: data.message || 'Failed to dispatch transmission.',
        },
        { status: 400 }
      )
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Internal error processing transmission.'
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
