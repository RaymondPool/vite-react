import { useState } from 'react';

// Extend Window interface for gtag
declare global {
  interface Window {
    gtag?: (command: string, ...args: any[]) => void;
  }
}

interface Results {
  weeklyLoss: number;
  monthlyLoss: number;
  yearlyLoss: number;
  hoursPerYear: number;
}

const trackEvent = (eventName: string, eventParams: Record<string, any> = {}) => {
  if (window.gtag) {
    window.gtag('event', eventName, eventParams);
  }
};

function App() {
  const [step, setStep] = useState<'calculator' | 'results'>('calculator');
  const [email, setEmail] = useState('');
  const [formData, setFormData] = useState({
    taskName: '',
    industry: '',
    employees: '1',
    hoursPerWeek: '10',
    hourlyRate: '',
  });
  const [results, setResults] = useState<Results | null>(null);

  const calculateROI = () => {
    const hours = parseFloat(formData.hoursPerWeek);
    const employees = parseFloat(formData.employees);
    const rate = parseFloat(formData.hourlyRate);
    
    const weeklyLoss = hours * employees * rate;
    const monthlyLoss = weeklyLoss * 4.33;
    const yearlyLoss = monthlyLoss * 12;
    
    setResults({
      weeklyLoss,
      monthlyLoss,
      yearlyLoss,
      hoursPerYear: hours * employees * 52,
    });
    
    setStep('results');
  };

  const handleCalculatorSubmit = async () => {
    if (email && formData.taskName && formData.industry && formData.hourlyRate) {
      trackEvent('calculation_completed', {
        email: email,
        task_name: formData.taskName,
        industry: formData.industry,
        employees: formData.employees,
        hours_per_week: formData.hoursPerWeek,
        hourly_rate: formData.hourlyRate
      });
      
      calculateROI();
      
      // Send completed calculation to Google Forms
      const hours = parseFloat(formData.hoursPerWeek);
      const employees = parseFloat(formData.employees);
      const rate = parseFloat(formData.hourlyRate);
      const yearlyLoss = hours * employees * rate * 4.33 * 12;
      
      const googleFormData = new FormData();
      googleFormData.append('entry.56006190', email);
      googleFormData.append('entry.1413275017', formData.taskName);
      googleFormData.append('entry.163271857', formData.hoursPerWeek);
      googleFormData.append('entry.703334186', formData.hourlyRate);
      googleFormData.append('entry.97022571', yearlyLoss.toFixed(2));
      googleFormData.append('entry.340418493', new Date().toISOString());
      googleFormData.append('entry.586988015', 'calculation_completed');
      // Assuming new entries for industry and employees
      googleFormData.append('entry.111111111', formData.industry);
      googleFormData.append('entry.222222222', formData.employees);
      
      try {
        await fetch('https://docs.google.com/forms/d/e/1FAIpQLSdyI_K4RT0thZu9YWR4psocMxGiHR4MOQ9WWLkGbZmys2tjzA/formResponse', {
          method: 'POST',
          mode: 'no-cors',
          body: googleFormData
        });
      } catch (error) {
        console.log('Form submission error:', error);
      }
    }
  };

  if (step === 'calculator') {
    return (
      <div style={{minHeight: '100vh', background: 'linear-gradient(135deg, #1a2332 0%, #2d3e50 100%)'}}>
        <div style={{maxWidth: '700px', margin: '0 auto', padding: '40px 20px'}}>
          
          {/* Progress Bar */}
          <div style={{marginBottom: '40px'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px'}}>
              <span style={{fontSize: '14px', color: '#40E0D0', fontWeight: '600'}}>Step 1 of 2</span>
              <span style={{fontSize: '14px', color: '#a8b8d0'}}>Just one step!</span>
            </div>
            <div style={{width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', overflow: 'hidden'}}>
              <div style={{width: '50%', height: '100%', background: 'linear-gradient(90deg, #40E0D0, #00CED1)', borderRadius: '10px'}}></div>
            </div>
          </div>

          <div style={{background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', borderRadius: '20px', padding: '48px', border: '1px solid rgba(64, 224, 208, 0.2)'}}>
            <h2 style={{fontSize: '32px', fontWeight: 'bold', color: '#fff', marginBottom: '12px', textAlign: 'center'}}>
              Let's Calculate Your Loss
            </h2>
            <p style={{color: '#a8b8d0', textAlign: 'center', marginBottom: '40px'}}>
              Answer 4 quick questions about your manual work
            </p>

            <div style={{marginBottom: '28px'}}>
              <label style={{display: 'block', color: '#fff', fontWeight: '600', marginBottom: '12px', fontSize: '15px'}}>
                Your email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                style={{width: '100%', padding: '16px', fontSize: '16px', border: '2px solid rgba(64, 224, 208, 0.3)', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', color: '#fff', outline: 'none'}}
              />
            </div>

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
                Which industry are you in?
              </label>
              <select
                value={formData.industry}
                onChange={(e) => setFormData({...formData, industry: e.target.value})}
                style={{width: '100%', padding: '16px', fontSize: '16px', border: '2px solid rgba(64, 224, 208, 0.3)', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', color: '#fff', outline: 'none'}}
              >
                <option value="">Select your industry</option>
                <option value="Accounting">Accounting</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
                <option value="HR">HR</option>
                <option value="Operations">Operations</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div style={{marginBottom: '28px'}}>
              <label style={{display: 'block', color: '#fff', fontWeight: '600', marginBottom: '12px', fontSize: '15px'}}>
                How many employees perform this task?
              </label>
              <input
                type="number"
                value={formData.employees}
                onChange={(e) => setFormData({...formData, employees: e.target.value})}
                placeholder="e.g., 2"
                min="1"
                style={{width: '100%', padding: '16px', fontSize: '16px', border: '2px solid rgba(64, 224, 208, 0.3)', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', color: '#fff', outline: 'none'}}
              />
            </div>

            <div style={{marginBottom: '28px'}}>
              <label style={{display: 'block', color: '#fff', fontWeight: '600', marginBottom: '12px', fontSize: '15px'}}>
                How many hours per week does this take? ({formData.hoursPerWeek} hours)
              </label>
              <input
                type="range"
                value={formData.hoursPerWeek}
                onChange={(e) => setFormData({...formData, hoursPerWeek: e.target.value})}
                min="1"
                max="40"
                step="1"
                style={{width: '100%', accentColor: '#40E0D0'}}
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
              onMouseOver={(e) => {
                const target = e.target as HTMLAnchorElement;
                target.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                const target = e.target as HTMLAnchorElement;
                target.style.transform = 'translateY(0)';
              }}
            >
              🎯 Book Your Free Consultation
              <div style={{fontSize: '14px', fontWeight: 'normal', marginTop: '8px', opacity: 0.9}}>
                Only 3 slots left this week
              </div>
            </a>
            
            
            <p style={{color: '#a8b8d0', fontSize: '14px', marginTop: '24px'}}>
              No sales pitch. Just a real conversation about your automation options.
            </p>
            <a
              href={`/report.html?task=${encodeURIComponent(formData.taskName)}&monthly=${Math.round(results.monthlyLoss)}&yearly=${Math.round(results.yearlyLoss)}&hours=${results.hoursPerYear}&weekly=${Math.round(results.weeklyLoss)}`}
              style={{display: 'inline-block', marginTop: '16px', padding: '16px 40px', background: 'transparent', color: '#40E0D0', fontSize: '16px', fontWeight: 'bold', border: '2px solid #40E0D0', textDecoration: 'none', borderRadius: '12px'}}
            >
              📄 View Your Full AI Automation Report →
            </a>

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
