import nodemailer from 'nodemailer';

export const contactLandlord = async (req, res) => {
  const { landlordEmail, userEmail, message, listingName , listingType } = req.body;

  if (!landlordEmail || !userEmail || !message || !listingName || !listingType) {
    return res.status(400).json({ success: false, message: 'Missing fields' });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"RPEstate Rental Service" <${process.env.EMAIL_USER}>`, 
      to: landlordEmail,
      cc: userEmail,
      replyTo: userEmail,
      subject: `Regarding ${listingType}ing for ${listingName}`,
      text: message,
    });

    res.status(200).json({ success: true, message: 'Email sent!' });
  } catch (err) {
    console.error('Nodemailer error:', err);
    res.status(500).json({ success: false, message: 'Failed to send email.' });
  }
};