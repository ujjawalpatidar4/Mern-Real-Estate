import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export default function Contact({ listing }) {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const {currentUser} = useSelector((state) => state.user);

  const onChange = (e) => {
    setMessage(e.target.value);
  };

  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        const res = await fetch(`/api/users/${listing.userRef}`);
        const data = await res.json();
        setLandlord(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchLandlord();
  }, [listing.userRef]);

  const handleSend = async () => {
    setSending(true);
    setError('');
    setSent(false);
    try {
      const res = await fetch('/api/contact/contact-landlord', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          landlordEmail: landlord.email,
          userEmail: currentUser.email || 'noreply@yourapp.com',
          message,
          listingName: listing.name,
          listingType: listing.type,
        }),
      });
      const data = await res.json();
      console.log(currentUser.email);
      console.log(data);
      if (data.success) {
        setSent(true);
        setMessage('');
      } else {
        setError(data.message || 'Failed to send email');
      }
    } catch (err) {
      setError('Failed to send email');
    }
    setSending(false);
  };

  return (
    <>
      {landlord && (
        <div className='flex flex-col gap-2'>
          <p>
            Contact <span className='font-semibold'>{landlord.username}</span>{' '}
            for{' '}
            <span className='font-semibold'>{listing.name.toLowerCase()}</span>
          </p>
          <textarea
            name='message'
            id='message'
            rows='2'
            value={message}
            onChange={onChange}
            placeholder='Enter your message here...'
            className='w-full border p-3 rounded-lg'
          ></textarea>

           <button
            onClick={handleSend}
            disabled={sending || !message}
            className='bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95 disabled:opacity-80'
          >
            {sending ? 'Sending...' : 'Send Message'}
          </button>
          {sent && <p className='text-green-700'>Message sent!</p>}
          {error && <p className='text-red-700'>{error}</p>}
        </div>
      )}
    </>
  );
}