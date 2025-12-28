import { useState } from 'react';

const trackEvent = (eventName, eventParams = {}) => {
  if (window.gtag) {
    window.gtag('event', eventName, eventParams);
  }
};

function App() {
  const [step, setStep] = useState('landing');
  const [email, setEmail] = useState('');
  const [formData, setFormData] = useState({
    taskName: '',
    hoursPerWeek: '',
    hourlyRate: '',
  });
  const [results, setResults] = useState(null);
  const [showExitPopup, setShowExitPopup] = useState(false);

  const handleEmailSubmit = () => {
    if (email) {
      trackEvent('calculator_started', { email: email });
      setStep('calculator');
    }
  };

  const calculateROI = () => {
    const hours = parseFloat(formData.hoursPerWeek);
    const rate = parseFloat(formData.hourlyRate);
    
    const weeklyLoss = hours * rate;
    const monthlyLoss = weeklyLoss * 4.33;
    const yearlyLoss = monthlyLoss * 12;
    
    setResults({
      weeklyLoss,
      monthlyLoss,
      yearlyLoss,
      hoursPerYear: hours * 52,
    });
    
    setStep('results');
  };

  const handleCalculatorSubmit = () => {
    if (formData.hoursPerWeek && formData.hourlyRate) {
      trackEvent('calculation_completed', {
        hours_per_week: formData.hoursPerWeek,
        hourly_rate: formData.hourlyRate
      });
      calculateROI();
    }
  };

  if (step === 'landing') {
    return (
      <div style={{minHeight: '100vh', background: 'linear-gradient(135deg, #1a2332 0%, #2d3e50 100%)'}}>
        {/* Header */}
        <div style={{background: 'rgba(26, 35, 50, 0.95)', padding: '20px 0', borderBottom: '3px solid #40E0D0'}}>
          <div style={{maxWidth: '1200px', margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', gap: '15px'}}>
            <div style={{width: '50px', height: '50px', background: '#40E0D0', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <div style={{width: '20px', height: '20px', background: '#1a2332', borderRadius: '2px', transform: 'rotate(45deg)'}}></div>
            </div>
            <div>
              <h1 style={{margin: 0, fontSize: '28px', fontWeight: 'bold', color: '#fff', letterSpacing: '-0.5px'}}>
                Bayou Bros
              </h1>
              <p style={{margin: 0, fontSize: '14px', color: '#40E0D0'}}>SEO · Website · AI</p>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div style={{maxWidth: '1100px', margin: '0 auto', padding: '80px 20px 60px'}}>
          <div style={{textAlign: 'center', marginBottom: '60px'}}>
            <div style={{display: 'inline-block', background: 'rgba(64, 224, 208, 0.1)', border: '1px solid #40E0D0', borderRadius: '30px', padding: '8px 20px', marginBottom: '30px'}}>
              <span style={{color: '#40E0D0', fontSize: '14px', fontWeight: '600'}}>🎯 FREE ROI CALCULATOR</span>
            </div>
            
            <h1 style={{fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 'bold', color: '#fff', marginBottom: '24px', lineHeight: '1.2'}}>
              Calculate How Much Money<br/>
              <span style={{color: '#40E0D0'}}>You're Losing Every Month</span><br/>
              Without AI Automation
            </h1>
            
            <p style={{fontSize: '20px', color: '#a8b8d0', maxWidth: '700px', margin: '0 auto 40px', lineHeight: '1.6'}}>
              60-second calculator shows exactly how much you're losing right now on manual tasks
            </p>

            {/* Email Capture */}
            <div style={{maxWidth: '500px', margin: '0 auto'}}>
              <div style={{background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', borderRadius: '16px', padding: '40px', border: '1px solid rgba(64, 224, 208, 0.2)', boxShadow: '0 20px 60px rgba(0,0,0,0.3)'}}>
                <h3 style={{color: '#fff', fontSize: '20px', marginBottom: '20px', fontWeight: '600'}}>
                  Enter your email to see the results
                </h3>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  style={{width: '100%', padding: '16px', fontSize: '16px', border: '2px solid rgba(64, 224, 208, 0.3)', borderRadius: '12px', marginBottom: '16px', background: 'rgba(255,255,255,0.05)', color: '#fff', outline: 'none', transition: 'all 0.3s'}}
                  onFocus={(e) => e.target.style.borderColor = '#40E0D0'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(64, 224, 208, 0.3)'}
                />
                <button
                  onClick={handleEmailSubmit}
                  style={{width: '100%', padding: '18px', background: 'linear-gradient(135deg, #40E0D0 0%, #00CED1 100%)', color: '#1a2332', fontSize: '18px', fontWeight: 'bold', border: 'none', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.3s', boxShadow: '0 8px 24px rgba(64, 224, 208, 0.3)'}}
                  onMouseOver={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 12px 32px rgba(64, 224, 208, 0.4)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 8px 24px rgba(64, 224, 208, 0.3)';
                  }}
                >
                  Calculate My ROI →
                </button>
                <p style={{color: '#a8b8d0', fontSize: '13px', marginTop: '16px', marginBottom: 0}}>
                  No spam. Just your personalized ROI calculation.
                </p>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginTop: '80px'}}>
            {[
              {icon: '⏱️', title: 'See Your Time Loss', desc: 'Find out exactly how many hours you\'re wasting monthly'},
              {icon: '💰', title: 'Calculate Real Costs', desc: 'Get the dollar amount your manual processes are costing'},
              {icon: '📈', title: 'Get Your ROI Plan', desc: 'See your payback period and automation roadmap'}
            ].map((feature, i) => (
              <div key={i} style={{background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', border: '1px solid rgba(64, 224, 208, 0.15)', borderRadius: '16px', padding: '32px', textAlign: 'center', transition: 'all 0.3s'}}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.borderColor = '#40E0D0';
                  e.currentTarget.style.boxShadow = '0 12px 32px rgba(64, 224, 208, 0.2)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'rgba(64, 224, 208, 0.15)';
                  e.currentTarget.style.boxShadow = 'none';
                }}>
                <div style={{fontSize: '48px', marginBottom: '16px'}}>{feature.icon}</div>
                <h3 style={{color: '#fff', fontSize: '20px', fontWeight: '600', marginBottom: '12px'}}>{feature.title}</h3>
                <p style={{color: '#a8b8d0', fontSize: '15px', lineHeight: '1.6', margin: 0}}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (step === 'calculator') {
    return (
      <div style={{minHeight: '100vh', background: 'linear-gradient(135deg, #1a2332 0%, #2d3e50 100%)'}}>
        <div style={{maxWidth: '700px', margin: '0 auto', padding: '40px 20px'}}>
          
          {/* Progress Bar */}
          <div style={{marginBottom: '40px'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px'}}>
              <span style={{fontSize: '14px', color: '#40E0D0', fontWeight: '600'}}>Step 2 of 3</span>
              <span style={{fontSize: '14px', color: '#a8b8d0'}}>Almost there!</span>
            </div>
            <div style={{width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', overflow: 'hidden'}}>
              <div style={{width: '66%', height: '100%', background: 'linear-gradient(90deg, #40E0D0, #00CED1)', borderRadius: '10px'}}></div>
            </div>
          </div>

          <div style={{background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', borderRadius: '20px', padding: '48px', border: '1px solid rgba(64, 224, 208, 0.2)'}}>
            <h2 style={{fontSize: '32px', fontWeight: 'bold', color: '#fff', marginBottom: '12px', textAlign: 'center'}}>
              Let's Calculate Your Loss
            </h2>
            <p style={{color: '#a8b8d0', textAlign: 'center', marginBottom: '40px'}}>
              Answer 3 quick questions about your manual work
            </p>

            <div style={{marginBottom: '28px'}}>
              <label style={{display: 'block', color: '#fff', fontWeight: '600', marginBottom: '12px', fontSize: '15px'}}>
                What's one manual task your team does repeatedly?
              </label>
              <input
                type="text"
                value={formData.taskName}
                onChange={(e) => setFormData({...formData, taskName: e.target.value})}
                placeholder="e.g., Data entry, report generation..."
                style={{width: '100%', padding: '16px', fontSize: '16px', border: '2px solid rgba(64, 224, 208, 0.3)', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', color: '#fff', outline: 'none'}}
              />
            </div>

            <div style={{marginBottom: '28px'}}>
              <label style={{display: 'block', color: '#fff', fontWeight: '600', marginBottom: '12px', fontSize: '15px'}}>
                How many hours per week does this take?
              </label>
              <input
                type="number"
                value={formData.hoursPerWeek}
                onChange={(e) => setFormData({...formData, hoursPerWeek: e.target.value})}
                placeholder="e.g., 10"
                style={{width: '100%', padding: '16px', fontSize: '16px', border: '2px solid rgba(64, 224, 208, 0.3)', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', color: '#fff', outline: 'none'}}
              />
            </div>

            <div style={{marginBottom: '32px'}}>
              <label style={{display: 'block', color: '#fff', fontWeight: '600', marginBottom: '12px', fontSize: '15px'}}>
                What's the average hourly rate for this work?
              </label>
              <input
                type="number"
                value={formData.hourlyRate}
                onChange={(e) => setFormData({...formData, hourlyRate: e.target.value})}
                placeholder="e.g., 50"
                style={{width: '100%', padding: '16px', fontSize: '16px', border: '2px solid rgba(64, 224, 208, 0.3)', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', color: '#fff', outline: 'none'}}
              />
              <p style={{color: '#a8b8d0', fontSize: '13px', marginTop: '8px'}}>
                Include salary, benefits, and overhead costs
              </p>
            </div>

            <button
              onClick={handleCalculatorSubmit}
              style={{width: '100%', padding: '18px', background: 'linear-gradient(135deg, #40E0D0 0%, #00CED1 100%)', color: '#1a2332', fontSize: '18px', fontWeight: 'bold', border: 'none', borderRadius: '12px', cursor: 'pointer', boxShadow: '0 8px 24px rgba(64, 224, 208, 0.3)'}}
            >
              Show Me What I'm Losing
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'results' && results) {
    return (
      <div style={{minHeight: '100vh', background: 'linear-gradient(135deg, #1a2332 0%, #2d3e50 100%)'}}>
        <div style={{maxWidth: '900px', margin: '0 auto', padding: '60px 20px'}}>
          
          <div style={{textAlign: 'center', marginBottom: '48px'}}>
            <div style={{fontSize: '64px', marginBottom: '16px'}}>😱</div>
            <h1 style={{fontSize: '42px', fontWeight: 'bold', color: '#fff', marginBottom: '16px'}}>
              Here's What You're Losing
            </h1>
            <p style={{fontSize: '18px', color: '#a8b8d0'}}>
              On <strong style={{color: '#40E0D0'}}>{formData.taskName}</strong> alone
            </p>
          </div>

          {/* Results Cards */}
          <div style={{display: 'grid', gap: '20px', marginBottom: '48px'}}>
            <div style={{background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', border: '2px solid #40E0D0', borderRadius: '16px', padding: '32px', textAlign: 'center'}}>
              <div style={{color: '#a8b8d0', fontSize: '14px', fontWeight: '600', marginBottom: '8px'}}>ANNUAL COST</div>
              <div style={{fontSize: '56px', fontWeight: 'bold', color: '#40E0D0', marginBottom: '8px'}}>
                ${results.yearlyLoss.toLocaleString()}
              </div>
              <div style={{color: '#fff', fontSize: '16px'}}>
                That's {results.hoursPerYear} hours per year wasted
              </div>
            </div>

            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px'}}>
              <div style={{background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', border: '1px solid rgba(64, 224, 208, 0.2)', borderRadius: '16px', padding: '24px', textAlign: 'center'}}>
                <div style={{color: '#a8b8d0', fontSize: '13px', marginBottom: '8px'}}>MONTHLY</div>
                <div style={{fontSize: '32px', fontWeight: 'bold', color: '#fff'}}>
                  ${results.monthlyLoss.toLocaleString()}
                </div>
              </div>
              <div style={{background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', border: '1px solid rgba(64, 224, 208, 0.2)', borderRadius: '16px', padding: '24px', textAlign: 'center'}}>
                <div style={{color: '#a8b8d0', fontSize: '13px', marginBottom: '8px'}}>WEEKLY</div>
                <div style={{fontSize: '32px', fontWeight: 'bold', color: '#fff'}}>
                  ${results.weeklyLoss.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div style={{background: 'linear-gradient(135deg, rgba(64, 224, 208, 0.1), rgba(0, 206, 209, 0.1))', backdropFilter: 'blur(10px)', border: '2px solid #40E0D0', borderRadius: '20px', padding: '48px', textAlign: 'center'}}>
            <h3 style={{fontSize: '28px', fontWeight: 'bold', color: '#fff', marginBottom: '16px'}}>
              Ready to Stop the Bleeding?
            </h3>
            <p style={{fontSize: '18px', color: '#a8b8d0', marginBottom: '32px', maxWidth: '600px', margin: '0 auto 32px'}}>
              Let's talk about automating your processes and putting that money back in your pocket
            </p>
            <a
              href="https://bayoubiz.systeme.io/c8ac11b7"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent('booking_clicked', { 
                email: email,
                roi_calculated: 'yes',
                yearly_loss: results.yearlyLoss
              })}
              style={{display: 'inline-block', padding: '20px 48px', background: 'linear-gradient(135deg, #40E0D0 0%, #00CED1 100%)', color: '#1a2332', fontSize: '20px', fontWeight: 'bold', textDecoration: 'none', borderRadius: '12px', boxShadow: '0 12px 32px rgba(64, 224, 208, 0.4)', transition: 'all 0.3s'}}
              onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
            >
              🎯 Book Your Free Consultation
              <div style={{fontSize: '14px', fontWeight: 'normal', marginTop: '8px', opacity: 0.9}}>
                Only 3 slots left this week
              </div>
            </a>
            <p style={{color: '#a8b8d0', fontSize: '14px', marginTop: '24px'}}>
              No sales pitch. Just a real conversation about your automation options.
            </p>
          </div>

          {/* Email Confirmation */}
          <div style={{textAlign: 'center', marginTop: '32px', padding: '24px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '12px', border: '1px solid rgba(64, 224, 208, 0.1)'}}>
            <p style={{color: '#a8b8d0', fontSize: '14px', margin: 0}}>
              📧 A copy of your results has been sent to <strong style={{color: '#40E0D0'}}>{email}</strong>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div style={{background: 'rgba(26, 35, 50, 0.95)', padding: '32px 20px', borderTop: '1px solid rgba(64, 224, 208, 0.2)', textAlign: 'center'}}>
          <p style={{color: '#a8b8d0', fontSize: '14px', margin: 0}}>
            Built with 💙 by <strong style={{color: '#40E0D0'}}>Bayou Bros</strong>
          </p>
        </div>
      </div>
    );
  }

  return null;
}

export default App;
