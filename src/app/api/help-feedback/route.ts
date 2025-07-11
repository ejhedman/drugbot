import { NextRequest, NextResponse } from 'next/server';

export interface HelpFeedbackRequest {
  message: string;
  userId?: string;
  userEmail?: string;
  userName?: string;
  timestamp: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: HelpFeedbackRequest = await request.json();
    
    // Validate the request
    if (!body.message || typeof body.message !== 'string' || body.message.trim().length < 10) {
      return NextResponse.json({
        success: false,
        message: 'Message is required and must be at least 10 characters long',
        error: 'Invalid input'
      }, { status: 400 });
    }
    
    // Server-side logging - in a real implementation, this would be sent to
    // a logging service, database, email system, or ticketing system
    console.log('=== HELP/FEEDBACK REQUEST RECEIVED ===');
    console.log('Timestamp:', new Date().toISOString());
    console.log('User ID:', body.userId || 'Not provided');
    console.log('User Email:', body.userEmail || 'Not provided');
    console.log('User Name:', body.userName || 'Not provided');
    console.log('Message Length:', body.message.length);
    console.log('Request Data:', JSON.stringify(body, null, 2));
    console.log('Client IP:', request.headers.get('x-forwarded-for') || 'unknown');
    console.log('User Agent:', request.headers.get('user-agent') || 'unknown');
    console.log('=======================================');
    
    // In a real implementation, you might:
    // - Save to database with user association
    // - Send email notification to support team with user context
    // - Create support ticket linked to user account
    // - Log to external service like Slack, Discord, etc. with user info
    // - Store in customer feedback system with user attribution
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return NextResponse.json({
      success: true,
      message: 'Feedback received successfully',
      requestId: `feedback-${Date.now()}`, // In real app, use proper UUID
      userId: body.userId,
      timestamp: new Date().toISOString()
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error processing help/feedback request:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to process feedback request',
      error: 'Internal server error'
    }, { status: 500 });
  }
} 