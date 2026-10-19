import { useState } from 'react';
import { supabase } from '@/lib/supabase';

type FormState = 'idle' | 'loading' | 'success' | 'error';

export default function FinaleFooter() {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<FormState>('idle');
  const [message, setMessage] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setState('error');
      setMessage('Please enter a valid email address.');
      return;
    }

    setState('loading');
    const { error: err } = await supabase
      .from('newsletter_subscribers')
      .insert({ email: trimmed });

    if (err) {
      if (err.code === '23505') {
        setState('success');
        setMessage('You are already on the list.');
      } else {
        setState('error');
        setMessage('Something went wrong. Please try again.');
      }
      return;
    }

    setState('success');
    setMessage('Welcome. Your private access is confirmed.');
    setEmail('');
  };

  return (
    <footer className="finale-footer">
      <div className="footer-grid">
        <div className="footer-col" style={{ maxWidth: 250 }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
            Redefining luxury footwear through restraint, material excellence, and architectural
            precision.
          </p>
        </div>
        <div className="footer-col" style={{ display: 'flex', gap: '4rem' }}>
          <div>
            <h4>Explore</h4>
            <ul>
              <li><a href="#store">New Arrivals</a></li>
              <li><a href="#sneaker-lab">Sneaker Lab</a></li>
              <li><a href="#collections">Categories</a></li>
              <li><a href="#">Shoe Care</a></li>
            </ul>
          </div>
          <div>
            <h4>Maison</h4>
            <ul>
              <li><a href="#about">Heritage</a></li>
              <li><a href="#">Sustainability</a></li>
              <li><a href="#">Boutiques</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-col">
          <h4>Client Services</h4>
          <div style={{ background: 'var(--bg-base)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-soft)' }}>
            <p style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>
              Receive exclusive access to private allocations.
            </p>
            <form onSubmit={handleSubscribe} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (state !== 'idle') setState('idle');
                }}
                placeholder="Email address"
                disabled={state === 'loading'}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-pill)',
                  border: '1px solid var(--border-soft)',
                  background: 'var(--surface)',
                  fontFamily: 'inherit',
                  fontSize: '0.875rem',
                  outline: 'none',
                }}
              />
              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%' }}
                disabled={state === 'loading'}
              >
                {state === 'loading' ? 'Subscribing…' : 'Subscribe'}
              </button>
              {message && (
                <p
                  style={{
                    fontSize: '0.75rem',
                    lineHeight: 1.5,
                    color: state === 'error' ? '#b3261e' : 'var(--text-muted)',
                  }}
                >
                  {message}
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
      <div className="footer-wordmark">AMARNI</div>
      <div className="footer-legal">
        <span>&copy; 2026 Amarni. All rights reserved.</span>
        <div style={{ display: 'flex', gap: '2rem' }}>
          <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Privacy</a>
          <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Terms</a>
        </div>
      </div>
    </footer>
  );
}
