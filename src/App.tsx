import { useState } from 'react';

// Simple emoji icons
const IconAlert = () => <span style={{fontSize: '2rem'}}>⚠️</span>;
const IconCalculator = () => <span style={{fontSize: '2rem'}}>🧮</span>;
const IconClock = () => <span style={{fontSize: '2rem'}}>⏰</span>;
const IconDollar = () => <span style={{fontSize: '2rem'}}>💰</span>;
const IconTrending = () => <span style={{fontSize: '2rem'}}>📈</span>;
const IconCheck = () => <span style={{fontSize: '1.5rem'}}>✅</span>;

interface Results {
  monthlyLoss: string;
  annualLoss: string;
  timeSavingsPerMonth: string;
  monthlySavings: string;
  annualSavings: string;
  roi: string;
  paybackMonths: string;
}

export default function AIROICalculator() {
  const [step, setStep] = useState('landing');
  const [email, setEmail] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('email') || '';
  });
  const [formData, setFormData] = useState({
    hoursPerWeek: '',
    hourlyRate: '',
    taskName: ''
  });
  const [results, setResults] = useState<Results | null>(null);

  const calculateROI = () => {
    const hours = parseFloat(formData.hoursPerWeek);
    const rate = parseFloat(formData.hourlyRate);
    
    const weeklyLoss = hours * rate;
    const monthlyLoss = weeklyLoss * 4.33;
    const annualLoss = monthlyLoss * 12;
    
    const automationCost = 2000;
    const timeSavings = hours * 0.8;
    const monthlySavings = timeSavings * rate * 4.33;
    const annualSavings = monthlySavings * 12;
    const roi = ((annualSavings - automationCost) / automationCost) * 100;
    const paybackMonths = automationCost / monthlySavings;
    
    setResults({
      monthlyLoss: monthlyLoss.toFixed(0),
      annualLoss: annualLoss.toFixed(0),
      timeSavingsPerMonth: (timeSavings * 4.33).toFixed(1),
      monthlySavings: monthlySavings.toFixed(0),
      annualSavings: annualSavings.toFixed(0),
      roi: roi.toFixed(0),
      paybackMonths: paybackMonths.toFixed(1)
    });
    setStep('results');
  };

  const handleEmailSubmit = () => {
    if (email) {
      setStep('calculator');
    }
  };

  const handleCalculatorSubmit = () => {
    if (formData.hoursPerWeek && formData.hourlyRate && formData.taskName) {
      calculateROI();
    }
  };

  if (step === 'landing') {
    return (
      <div style={{minHeight: '100vh', backgroundColor: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
       <div className="w-full max-w-4xl mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-red-100 rounded-full mb-6">
              <IconAlert />
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
               Calculate How Much Money You're Losing Every Month Without AI Automation
            </h1>
             
            <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
               60-second calculator shows exactly how much you're losing right now
            </p>
          </div>

          <div className="bg-gray-50 rounded-2xl shadow-xl p-8 mb-12 max-w-3xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-6 bg-white rounded-xl border border-gray-200">
                <div className="flex justify-center mb-3"><IconClock /></div>
                <h3 className="font-semibold text-gray-900 mb-2">Wasted Hours</h3>
                <p className="text-gray-600 text-sm">Your team spends 15-40 hours per week on repetitive tasks that AI could handle</p>
              </div>
              
              <div className="text-center p-6 bg-white rounded-xl border border-gray-200">
              <div className="flex justify-center mb-3"><IconDollar /></div>
                <h3 className="font-semibold text-gray-900 mb-2">Hidden Costs</h3>
                <p className="text-gray-600 text-sm">Manual processes cost 3-5x more than automated ones when you factor in errors and delays</p>
              </div>
              
              <div className="text-center p-6 bg-white rounded-xl border border-gray-200">
                <div className="flex justify-center mb-3"><IconTrending /></div>
                <h3 className="font-semibold text-gray-900 mb-2">Missed Growth</h3>
                <p className="text-gray-600 text-sm">While you're stuck in the weeds, competitors are scaling with automation</p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Here's What You'll Discover:
              </h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 mt-1"><IconCheck /></span>
                  <p className="text-gray-700">Exactly how much money you're hemorrhaging each month on manual processes that could be automated</p>
                </div>
                
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 mt-1"><IconCheck /></span>
                  <p className="text-gray-700">How many hours your team could reclaim for high-value work instead of mind-numbing repetition</p>
                </div>
                
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 mt-1"><IconCheck /></span>
                  <p className="text-gray-700">Your potential ROI and payback period so you can make a data-driven decision</p>
                </div>
                
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 mt-1"><IconCheck /></span>
                  <p className="text-gray-700">A personalized breakdown you can show your team or stakeholders to justify the investment</p>
                </div>
              </div>

              <div className="max-w-md mx-auto">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Enter your email to see your results:
                </label>
                <div className="flex gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none bg-white"
                  />
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={handleEmailSubmit}
                    className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
                  >
                    Start
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-3 text-center">
                  No spam. Just your personalized ROI calculation.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center text-gray-600">
            <p className="text-sm">
              🔒 Your information is secure. We respect your privacy and will never share your data.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'calculator') {
    return (
      <div style={{minHeight: '100vh', backgroundColor: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div className="w-full max-w-2xl mx-auto px-6 py-16">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4"><IconCalculator /></div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Let's Calculate Your Loss
            </h2>
            <p className="text-gray-600">
              Answer 3 quick questions about one repetitive task
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  What's one manual task your team does repeatedly?
                </label>
                <input
                  type="text"
                  value={formData.taskName}
                  onChange={(e) => setFormData({...formData, taskName: e.target.value})}
                  placeholder="e.g., Data entry, report generation, email responses"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none bg-white text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  How many hours per week does your team spend on this?
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={formData.hoursPerWeek}
                  onChange={(e) => setFormData({...formData, hoursPerWeek: e.target.value})}
                  placeholder="10"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none bg-white text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  What's the average hourly rate for people doing this work?
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="1"
                    value={formData.hourlyRate}
                    onChange={(e) => setFormData({...formData, hourlyRate: e.target.value})}
                    placeholder="50"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none bg-white text-gray-900 placeholder-gray-400"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Include salary, benefits, and overhead costs
                </p>
              </div>

              <button
                onClick={handleCalculatorSubmit}
                className="w-full py-4 bg-blue-600 text-white font-bold text-lg rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
              >
                Show Me What I'm Losing
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'results' && results) {
    return (
     <div style={{minHeight: '100vh', backgroundColor: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
       <div className="w-full max-w-4xl mx-auto px-6 py-16">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <IconAlert />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-2">
              Your Wake-Up Call
            </h2>
            <p className="text-xl text-gray-600">
              Here's what "{formData.taskName}" is really costing you
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500">
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Money Lost Per Month</h3>
              <p className="text-4xl font-bold text-red-600">${Number(results.monthlyLoss).toLocaleString()}</p>
              <p className="text-gray-600 mt-2">That's ${Number(results.annualLoss).toLocaleString()} per year going down the drain</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Hours Wasted Per Month</h3>
              <p className="text-4xl font-bold text-orange-600">{results.timeSavingsPerMonth}</p>
              <p className="text-gray-600 mt-2">Time your team could spend on strategic work instead</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-xl p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              What AI Automation Could Do For You
            </h3>

            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm font-semibold text-gray-600 mb-1">Monthly Savings</p>
                <p className="text-3xl font-bold text-green-600">${Number(results.monthlySavings).toLocaleString()}</p>
              </div>

              <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm font-semibold text-gray-600 mb-1">Annual ROI</p>
                <p className="text-3xl font-bold text-green-600">{results.roi}%</p>
              </div>

              <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm font-semibold text-gray-600 mb-1">Payback Period</p>
                <p className="text-3xl font-bold text-green-600">{results.paybackMonths} mo</p>
              </div>
            </div>

            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
              <h4 className="font-bold text-gray-900 mb-3">Bottom Line:</h4>
              <p className="text-gray-700 mb-4">
                By continuing to do "{formData.taskName}" manually, you're losing ${Number(results.monthlyLoss).toLocaleString()} every single month. That's money that could be reinvested in growth, innovation, or your bottom line.
              </p>
              <p className="text-gray-700 font-semibold">
                With AI automation, you'd break even in {results.paybackMonths} months and save ${Number(results.annualSavings).toLocaleString()} annually after that.
              </p>
            </div>
          </div>

          <div className="bg-blue-600 rounded-xl shadow-2xl p-8 text-center text-white">
            <h3 className="text-3xl font-bold mb-4">
              Ready to Stop the Bleeding?
            </h3>
            <p className="text-xl mb-6 text-blue-100">
              Let's talk about automating your processes and putting that money back in your pocket
            </p>
            <a
              href="https://bayoubiz.systeme.io/c8ac11b7"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-4 bg-white text-blue-600 font-bold text-lg rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
            >
              Schedule a Free Strategy Call
            </a>
            <p className="text-sm text-blue-100 mt-4">
              No sales pitch. Just a real conversation about what's possible for your business.
            </p>
          </div>

          <div className="text-center mt-8 text-gray-600">
            <p className="text-sm">
              A copy of your results has been sent to {email}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
