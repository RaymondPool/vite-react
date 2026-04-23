export default function Landing() {
  return (
    <div style={{ background: 'var(--navy)', color: 'var(--white)', fontFamily: "'Manrope', sans-serif", overflowX: 'hidden' }}>
      <style>{`
        :root {
          --navy: #0d1b2a;
          --navy2: #112030;
          --teal: #1ee8c0;
          --teal2: #0fb99a;
          --red: #e84040;
          --white: #f0f6ff;
          --muted: #7a9ab5;
          --card: rgba(255,255,255,0.04);
          --border: rgba(30,232,192,0.18);
        }

        html { scroll-behavior: smooth; }
        body { background: var(--navy); color: var(--white); font-family: 'Manrope', sans-serif; overflow-x: hidden; }

        /* NOISE OVERLAY */
        body::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 0;
          opacity: 0.4;
        }

        /* HERO */
        .hero {
          position: relative;
          min-height: 100vh;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          text-align: center;
          padding: 140px 24px 80px;
          overflow: hidden;
        }

        .blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(90px);
          pointer-events: none;
          opacity: 0.22;
        }
        .blob-1 { width: 500px; height: 500px; background: var(--teal); top: -100px; left: -150px; }
        .blob-2 { width: 400px; height: 400px; background: #1a3f6f; bottom: 0; right: -100px; }
        .blob-3 { width: 300px; height: 300px; background: var(--red); top: 40%; left: 60%; opacity: 0.12; }

        .badge {
          display: inline-flex; align-items: center; gap: 8px;
          border: 1.5px solid var(--border);
          border-radius: 50px;
          padding: 8px 20px;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: var(--teal);
          margin-bottom: 32px;
          animation: fadeDown 0.7s ease both;
        }
        .badge-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--red); animation: pulse 1.4s infinite; }

        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes fadeDown { from{opacity:0;transform:translateY(-16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }

        h1 {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(3.2rem, 9vw, 7rem);
          line-height: 0.95;
          letter-spacing: 1px;
          margin-bottom: 28px;
          animation: fadeUp 0.8s 0.15s ease both;
        }
        h1 span { color: var(--teal); }
        h1 .loss { color: var(--red); }

        .hero-sub {
          max-width: 560px;
          font-size: clamp(1rem, 2.5vw, 1.15rem);
          color: var(--muted);
          line-height: 1.7;
          margin-bottom: 44px;
          animation: fadeUp 0.8s 0.3s ease both;
        }

        .hero-btns {
          display: flex; flex-wrap: wrap; gap: 14px; justify-content: center;
          animation: fadeUp 0.8s 0.45s ease both;
        }

        .btn-primary {
          background: var(--teal);
          color: var(--navy);
          font-weight: 800;
          font-size: 0.9rem;
          letter-spacing: 0.5px;
          padding: 16px 36px;
          border-radius: 50px;
          text-decoration: none;
          transition: transform 0.2s, box-shadow 0.2s;
          display: flex; align-items: center; gap: 8px;
          border: none;
          cursor: pointer;
        }
        .btn-primary:hover { transform: translateY(-3px); box-shadow: 0 12px 32px rgba(30,232,192,0.4); }

        .btn-secondary {
          border: 1.5px solid var(--border);
          color: var(--white);
          font-weight: 700;
          font-size: 0.9rem;
          padding: 16px 36px;
          border-radius: 50px;
          text-decoration: none;
          transition: border-color 0.2s, background 0.2s;
          background: transparent;
          cursor: pointer;
        }
        .btn-secondary:hover { border-color: var(--teal); background: rgba(30,232,192,0.06); }

        .proof-strip {
          margin-top: 64px;
          display: flex; flex-wrap: wrap; gap: 32px; justify-content: center; align-items: center;
          animation: fadeUp 0.8s 0.6s ease both;
          opacity: 0.75;
        }
        .proof-item { display: flex; align-items: center; gap: 10px; font-size: 0.82rem; color: var(--muted); }
        .proof-num { font-family: 'Bebas Neue'; font-size: 1.6rem; color: var(--teal); }

        /* SECTIONS */
        .section { padding: 100px 24px; position: relative; z-index: 1; }
        .section-inner { max-width: 1100px; margin: 0 auto; }

        .section-label {
          font-size: 0.72rem; font-weight: 700; letter-spacing: 3px; text-transform: uppercase;
          color: var(--teal); margin-bottom: 16px;
        }
        .section-title {
          font-family: 'Bebas Neue';
          font-size: clamp(2.2rem, 5vw, 4rem);
          line-height: 1;
          margin-bottom: 20px;
        }
        .section-sub { color: var(--muted); line-height: 1.8; max-width: 580px; font-size: 1rem; }

        /* Pain cards */
        .pain-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 20px;
          margin-top: 52px;
        }

        .pain-card {
          background: var(--card);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 18px;
          padding: 32px 28px;
          transition: border-color 0.3s, transform 0.3s;
        }
        .pain-card:hover { border-color: var(--border); transform: translateY(-4px); }

        .pain-icon {
          width: 48px; height: 48px; border-radius: 12px;
          background: rgba(30,232,192,0.1);
          display: flex; align-items: center; justify-content: center;
          font-size: 1.5rem; margin-bottom: 20px;
        }
        .pain-card h3 { font-size: 1rem; font-weight: 800; margin-bottom: 10px; }
        .pain-card p { font-size: 0.88rem; color: var(--muted); line-height: 1.7; }
        .pain-stat { font-family: 'Bebas Neue'; font-size: 2.4rem; color: var(--red); display: block; margin-top: 14px; }

        /* HOW IT WORKS */
        .steps {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 32px;
          margin-top: 56px;
          counter-reset: steps;
        }
        .step { position: relative; }
        .step-num {
          font-family: 'Bebas Neue';
          font-size: 5rem;
          color: rgba(30,232,192,0.08);
          line-height: 1;
          margin-bottom: -12px;
        }
        .step h3 { font-size: 1rem; font-weight: 800; margin-bottom: 10px; }
        .step p { font-size: 0.88rem; color: var(--muted); line-height: 1.7; }

        /* TESTIMONIALS */
        .testi-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
          margin-top: 52px;
        }
        .testi-card {
          background: var(--card);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 18px;
          padding: 32px;
        }
        .stars { color: #ffc857; font-size: 0.85rem; letter-spacing: 2px; margin-bottom: 16px; }
        .testi-text { font-size: 0.92rem; color: var(--muted); line-height: 1.8; margin-bottom: 20px; font-style: italic; }
        .testi-author { display: flex; align-items: center; gap: 12px; }
        .testi-avatar {
          width: 42px; height: 42px; border-radius: 50%;
          background: linear-gradient(135deg, var(--teal), #1a8fff);
          display: flex; align-items: center; justify-content: center;
          font-weight: 800; font-size: 1rem; color: var(--navy);
        }
        .testi-name { font-size: 0.88rem; font-weight: 700; }
        .testi-role { font-size: 0.75rem; color: var(--muted); }

        /* FINAL CTA */
        .final-cta {
          text-align: center;
          padding: 100px 24px 120px;
          position: relative; z-index: 1;
        }
        .final-cta h2 { font-family: 'Bebas Neue'; font-size: clamp(2.5rem, 6vw, 5rem); margin-bottom: 20px; line-height: 1; }
        .final-cta h2 span { color: var(--teal); }
        .final-cta p { color: var(--muted); max-width: 480px; margin: 0 auto 40px; line-height: 1.8; }

        /* FOOTER */
        footer {
          text-align: center; padding: 28px 24px;
          border-top: 1px solid rgba(255,255,255,0.06);
          font-size: 0.78rem; color: var(--muted);
          position: relative; z-index: 1;
        }
        footer span { color: var(--teal); }

        @media(max-width: 600px) {
          .btn-primary { font-size: 0.8rem; padding: 14px 28px; }
        }
      `}</style>

      {/* HERO */}
      <section className="hero">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>

        <div className="badge"><span className="badge-dot"></span> Free · No Credit Card · 60 Seconds</div>

        <h1>
          Calculate How Much<br/>
          Money You're<br/>
          <span className="loss">Losing Every Month</span><br/>
          <span>Without AI Automation</span>
        </h1>

        <p className="hero-sub">
          Our free calculator shows the exact dollar amount your business is wasting on manual tasks — and how AI automation from Bayou Bros can win it back.
        </p>

        <div className="hero-btns">
          <a href="/calculator" className="btn-primary">
            🎯 Calculate My ROI — It's Free
          </a>
          <a href="#how-it-works" className="btn-secondary">See How It Works →</a>
        </div>

        <div className="proof-strip">
          <div className="proof-item"><span className="proof-num">500+</span> Businesses Analyzed</div>
          <div className="proof-item"><span className="proof-num">$2.4M</span> Recovered Monthly</div>
          <div className="proof-item"><span className="proof-num">60s</span> To Your Results</div>
        </div>
      </section>

      {/* PAIN SECTION */}
      <section className="section">
        <div className="section-inner">
          <div className="section-label">The Problem</div>
          <h2 className="section-title">Your Team Is Spending Hours<br/>On Work AI Can Do In Seconds</h2>
          <p className="section-sub">Every hour spent on repetitive manual tasks is money walking out the door. Here's where businesses like yours are bleeding cash.</p>

          <div className="pain-grid">
            <div className="pain-card">
              <div className="pain-icon">📧</div>
              <h3>Manual Email & Follow-Ups</h3>
              <p>Your team drafts the same emails over and over. AI can handle this automatically, 24/7, with zero errors.</p>
              <span className="pain-stat">~8 hrs/week</span>
            </div>
            <div className="pain-card">
              <div className="pain-icon">📊</div>
              <h3>Data Entry & Reporting</h3>
              <p>Copying data between systems, building weekly reports — tasks that take hours but deliver zero strategic value.</p>
              <span className="pain-stat">~12 hrs/week</span>
            </div>
            <div className="pain-card">
              <div className="pain-icon">💬</div>
              <h3>Customer Support Tickets</h3>
              <p>Answering the same FAQs repeatedly when an AI chat agent could handle 80% of inquiries instantly.</p>
              <span className="pain-stat">~15 hrs/week</span>
            </div>
            <div className="pain-card">
              <div className="pain-icon">📅</div>
              <h3>Scheduling & Coordination</h3>
              <p>Back-and-forth booking emails, appointment reminders, and calendar juggling eating into billable time.</p>
              <span className="pain-stat">~5 hrs/week</span>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section" id="how-it-works">
        <div className="section-inner">
          <div className="section-label">How It Works</div>
          <h2 className="section-title">Get Your ROI Report<br/>In 3 Simple Steps</h2>

          <div className="steps">
            <div className="step">
              <div className="step-num">01</div>
              <h3>Enter Your Business Details</h3>
              <p>Tell us your team size, average hourly cost, and how many hours go to manual tasks each week.</p>
            </div>
            <div className="step">
              <div className="step-num">02</div>
              <h3>See Your Loss Calculated</h3>
              <p>Our calculator instantly shows how much money you're losing monthly — and annually — to manual work.</p>
            </div>
            <div className="step">
              <div className="step-num">03</div>
              <h3>Get Your Free AI Strategy</h3>
              <p>Receive a personalized report showing exactly which AI automations would deliver the highest ROI for your business.</p>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section">
        <div className="section-inner">
          <div className="section-label">Results</div>
          <h2 className="section-title">What Businesses Are Saying</h2>

          <div className="testi-grid">
            <div className="testi-card">
              <div className="stars">★★★★★</div>
              <p className="testi-text">"I honestly didn't believe the calculator at first. It said we were losing $11K/month. After Bayou Bros set up our AI automations, we got most of that back within 60 days."</p>
              <div className="testi-author">
                <div className="testi-avatar">MR</div>
                <div>
                  <div className="testi-name">Marcus R.</div>
                  <div className="testi-role">Owner, Gulf Coast Realty</div>
                </div>
              </div>
            </div>
            <div className="testi-card">
              <div className="stars">★★★★★</div>
              <p className="testi-text">"The ROI calculator was eye-opening. We were spending 40+ hours a week on tasks that AI now handles automatically. Our team finally focuses on growth."</p>
              <div className="testi-author">
                <div className="testi-avatar">TL</div>
                <div>
                  <div className="testi-name">Tanya L.</div>
                  <div className="testi-role">CEO, Southern Skin Studio</div>
                </div>
              </div>
            </div>
            <div className="testi-card">
              <div className="stars">★★★★★</div>
              <p className="testi-text">"Simple, fast, accurate. Bayou Bros showed us the money we were hemorrhaging, then fixed it. That's all you can ask for."</p>
              <div className="testi-author">
                <div className="testi-avatar">DJ</div>
                <div>
                  <div className="testi-name">DeShawn J.</div>
                  <div className="testi-role">Director, Crescent City Logistics</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="final-cta">
        <div className="blob blob-1" style={{ top: 'auto', bottom: '-200px', left: '50%', transform: 'translateX(-50%)', opacity: 0.15 }}></div>
        <div className="section-label">Stop The Bleeding</div>
        <h2>Ready To <span>Stop Losing Money</span><br/>Every Single Month?</h2>
        <p>Run the free calculator now and find out exactly how much AI automation could save your business — no strings attached.</p>
        <a href="/calculator" className="btn-primary" style={{ display: 'inline-flex', fontSize: '1rem', padding: '18px 44px' }}>
          🎯 Calculate My ROI — It's Free
        </a>
      </section>

      {/* FOOTER */}
      <footer>
        <p>© 2025 <span>Bayou Bros</span> · SEO · Website · AI · All rights reserved</p>
      </footer>
    </div>
  );
}
