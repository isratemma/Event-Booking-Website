const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const sendOtpEmail = async (email, otp, type) => {
  const title = type === 'account_verification' ? 'Account Verification' : 'Event Booking';
  const msg = type === 'account_verification'
    ? 'Use the OTP below to verify your account:'
    : 'Use the OTP below to confirm your booking:';

  try {
    await resend.emails.send({
      from: 'EventVenue <onboarding@resend.dev>',
      to: email,
      subject: `Your EventVenue OTP Code`,
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;border-radius:12px;border:1px solid #e5e7eb;">
          <h2 style="color:#7C3AED;margin-bottom:8px;">EventVenue</h2>
          <h3 style="color:#1E1B4B;">${title}</h3>
          <p style="color:#6B7280;">${msg}</p>
          <div style="background:#F5F3FF;border-radius:12px;padding:24px;text-align:center;margin:24px 0;">
            <span style="font-size:36px;font-weight:800;letter-spacing:12px;color:#7C3AED;">${otp}</span>
          </div>
          <p style="color:#9CA3AF;font-size:13px;">This OTP expires in 5 minutes. Do not share it with anyone.</p>
        </div>
      `,
    });
    console.log(`OTP email sent to ${email}`);
  } catch (error) {
    console.error('Error sending OTP email:', error);
  }
};

const sendBookingEmail = async (userEmail, userName, eventDetails) => {
  try {
    await resend.emails.send({
      from: 'EventVenue <onboarding@resend.dev>',
      to: userEmail,
      subject: `Booking Confirmation — ${eventDetails.eventName}`,
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;border-radius:12px;border:1px solid #e5e7eb;">
          <h2 style="color:#7C3AED;">EventVenue</h2>
          <h3 style="color:#1E1B4B;">Hi ${userName}, your booking is confirmed! 🎉</h3>
          <div style="background:#F5F3FF;border-radius:12px;padding:20px;margin:20px 0;">
            <p><strong>Event:</strong> ${eventDetails.eventName}</p>
            <p><strong>Date:</strong> ${eventDetails.eventDate}</p>
            <p><strong>Time:</strong> ${eventDetails.eventTime}</p>
            <p><strong>Venue:</strong> ${eventDetails.venue}</p>
            <p><strong>Tickets:</strong> ${eventDetails.numberOfTickets}</p>
          </div>
          <p style="color:#9CA3AF;font-size:13px;">Thank you for booking with EventVenue!</p>
        </div>
      `,
    });
    console.log(`Booking email sent to ${userEmail}`);
  } catch (error) {
    console.error('Error sending booking email:', error);
  }
};

module.exports = { sendOtpEmail, sendBookingEmail };
