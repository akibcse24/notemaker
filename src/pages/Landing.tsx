import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/Button';
import { FileText, Sparkles, Zap, Image as ImageIcon } from 'lucide-react';

export const Landing: React.FC = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = async () => {
    if (user) {
      navigate('/dashboard');
    } else {
      try {
        await login();
        navigate('/dashboard');
      } catch (err) {
        // Error handled in context/service
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <header className="bg-slate-50 border-b border-slate-100">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl text-indigo-600">
            <FileText /> NoteScanner AI
          </div>
          <div>
            <Button variant="ghost" onClick={handleGetStarted}>
              {user ? 'Go to Dashboard' : 'Sign In'}
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl font-extrabold text-slate-900 mb-6">
          Transform Handwritten Notes <br/>
          <span className="text-indigo-600">Into Digital Intelligence</span>
        </h1>
        <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
          Capture your ideas on paper, and let our AI digitize, summarize, and enhance them into beautiful, editable documents with perfect diagrams.
        </p>
        <Button size="lg" onClick={handleGetStarted} className="rounded-full px-8">
          {user ? 'Go to My Notes' : 'Get Started with Google'}
        </Button>
      </div>

      {/* Features */}
      <div className="bg-slate-50 py-20">
        <div className="container mx-auto px-6 grid md:grid-cols-3 gap-10">
          <FeatureCard
            icon={<ImageIcon className="w-8 h-8 text-indigo-600" />}
            title="Instant Capture"
            description="Snap a photo or upload an image. Our advanced vision AI reads even the messiest handwriting."
          />
          <FeatureCard
            icon={<Zap className="w-8 h-8 text-indigo-600" />}
            title="Smart Digitization"
            description="Converts text to Markdown and sketches to editable SVG vector graphics automatically."
          />
          <FeatureCard
            icon={<Sparkles className="w-8 h-8 text-indigo-600" />}
            title="AI Enhancement"
            description="Summarizes key points, organizes structure, and beautifies your rough notes instantly."
          />
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: any) => (
  <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center hover:shadow-md transition-shadow">
    <div className="bg-indigo-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
    <p className="text-slate-600 leading-relaxed">{description}</p>
  </div>
);
