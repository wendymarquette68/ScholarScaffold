import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import PageWrapper from '../components/layout/PageWrapper';
import SectionAlert from '../components/common/SectionAlert';
import { researchDesigns, analyticStrategies, quizQuestions } from '../data/mockData';
import { ChevronDown, ChevronUp, CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import GuidanceBanner from '../components/common/GuidanceBanner';

type TabId = 'quantitative' | 'qualitative' | 'synthesis' | 'analytic' | 'hierarchy' | 'quiz';

export default function DesignLiteracyPage() {
  const { user, completeDesignLiteracy } = useUser();
  const [activeTab, setActiveTab] = useState<TabId>('quantitative');
  const [expandedDesign, setExpandedDesign] = useState<string | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number | null>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const tabs: { id: TabId; label: string }[] = [
    { id: 'quantitative', label: 'Quantitative' },
    { id: 'qualitative', label: 'Qualitative' },
    { id: 'synthesis', label: 'Evidence Synthesis' },
    { id: 'analytic', label: 'Analytic Strategies' },
    { id: 'hierarchy', label: 'Evidence Hierarchy' },
    { id: 'quiz', label: 'Quiz' },
  ];

  const filteredDesigns = researchDesigns.filter(d => d.category === activeTab);

  const quizScore = quizQuestions.reduce((score, q) => {
    return score + (quizAnswers[q.id] === q.correctAnswer ? 1 : 0);
  }, 0);
  const quizPercentage = Math.round((quizScore / quizQuestions.length) * 100);
  const quizPassed = quizPercentage >= 70;

  const handleQuizSubmit = () => {
    setQuizSubmitted(true);
    if (quizPassed) {
      completeDesignLiteracy();
    }
  };

  const allAnswered = quizQuestions.every(q => quizAnswers[q.id] !== undefined && quizAnswers[q.id] !== null);

  return (
    <PageWrapper title="Research Design Literacy Module" subtitle="Learn research designs before reviewing articles">
      {user?.designLiteracyComplete && (
        <div className="mb-6">
          <SectionAlert type="info" message="You have completed this module. Article Reviews are now unlocked!" />
        </div>
      )}

      {!user?.designLiteracyComplete && (
        <GuidanceBanner
          title="What to do here"
          storageKey="design_literacy_guide"
          steps={[
            'Browse the tabs (Quantitative, Qualitative, Evidence Synthesis) to learn about different research designs.',
            'Check the Analytic Strategies and Evidence Hierarchy tabs for additional context.',
            'Click the Quiz tab and answer all questions. You need 70% or higher to pass.',
            'Once you pass, Article Reviews will unlock so you can start reviewing research articles.',
          ]}
        />
      )}

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-primary-600 text-white'
                : tab.id === 'quiz' && !user?.designLiteracyComplete
                ? 'bg-amber-100 text-amber-700 hover:bg-amber-200 ring-1 ring-amber-300'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {tab.id === 'quiz' && !user?.designLiteracyComplete ? '★ Quiz (Required)' : tab.label}
          </button>
        ))}
      </div>

      {/* Design Cards */}
      {['quantitative', 'qualitative', 'synthesis'].includes(activeTab) && (
        <div className="space-y-3">
          {filteredDesigns.map(design => (
            <div key={design.name} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setExpandedDesign(expandedDesign === design.name ? null : design.name)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
              >
                <div>
                  <h3 className="font-semibold text-gray-900">{design.name}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    design.category === 'quantitative' ? 'bg-blue-100 text-blue-700' :
                    design.category === 'qualitative' ? 'bg-purple-100 text-purple-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {design.category}
                  </span>
                </div>
                {expandedDesign === design.name ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
              </button>
              {expandedDesign === design.name && (
                <div className="px-4 pb-4 space-y-3 border-t border-gray-100 pt-3">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Description</h4>
                    <p className="text-sm text-gray-700">{design.description}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">When Used</h4>
                    <p className="text-sm text-gray-700">{design.whenUsed}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Evidence Strength</h4>
                    <p className="text-sm text-gray-700">{design.evidenceStrength}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Analytic Strategies */}
      {activeTab === 'analytic' && (
        <div className="space-y-3">
          {analyticStrategies.map(strategy => (
            <div key={strategy.name} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setExpandedDesign(expandedDesign === strategy.name ? null : strategy.name)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
              >
                <h3 className="font-semibold text-gray-900">{strategy.name}</h3>
                {expandedDesign === strategy.name ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
              </button>
              {expandedDesign === strategy.name && (
                <div className="px-4 pb-4 space-y-3 border-t border-gray-100 pt-3">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Description</h4>
                    <p className="text-sm text-gray-700">{strategy.description}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">When Used</h4>
                    <p className="text-sm text-gray-700">{strategy.whenUsed}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Evidence Hierarchy */}
      {activeTab === 'hierarchy' && (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Evidence Hierarchy Pyramid</h2>
          <div className="flex flex-col items-center space-y-1">
            {[
              { level: 'Systematic Reviews & Meta-Analyses', width: 'w-48', color: 'bg-green-600' },
              { level: 'Randomized Controlled Trials', width: 'w-56', color: 'bg-green-500' },
              { level: 'Cohort Studies', width: 'w-64', color: 'bg-yellow-500' },
              { level: 'Case-Control Studies', width: 'w-72', color: 'bg-yellow-400' },
              { level: 'Cross-Sectional Studies', width: 'w-80', color: 'bg-orange-400' },
              { level: 'Case Reports / Descriptive', width: 'w-88', color: 'bg-orange-300' },
              { level: 'Expert Opinion / Editorials', width: 'w-96', color: 'bg-red-300' },
            ].map((item, i) => (
              <div
                key={i}
                className={`${item.color} ${item.width} text-white text-center py-2.5 rounded text-xs font-medium`}
                style={{ width: `${30 + i * 10}%` }}
              >
                {item.level}
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-gray-500 mt-4">Higher levels = stronger evidence for clinical decisions</p>
        </div>
      )}

      {/* Quiz */}
      {activeTab === 'quiz' && (
        <div className="space-y-6">
          {quizQuestions.map((q, qi) => (
            <div key={q.id} className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-3">
                {qi + 1}. {q.question}
              </h3>
              <div className="space-y-2">
                {q.options.map((option, oi) => {
                  const isSelected = quizAnswers[q.id] === oi;
                  const isCorrect = oi === q.correctAnswer;
                  const showResult = quizSubmitted;

                  return (
                    <button
                      key={oi}
                      onClick={() => !quizSubmitted && setQuizAnswers({ ...quizAnswers, [q.id]: oi })}
                      disabled={quizSubmitted}
                      className={`w-full text-left p-3 rounded-lg border transition-colors flex items-center gap-3 ${
                        showResult && isCorrect
                          ? 'border-green-500 bg-green-50'
                          : showResult && isSelected && !isCorrect
                          ? 'border-red-500 bg-red-50'
                          : isSelected
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {showResult && isCorrect && <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />}
                      {showResult && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />}
                      {!showResult && (
                        <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 ${
                          isSelected ? 'border-primary-500 bg-primary-500' : 'border-gray-300'
                        }`}>
                          {isSelected && <div className="w-full h-full rounded-full bg-white scale-50" />}
                        </div>
                      )}
                      <span className="text-sm text-gray-700">{option}</span>
                    </button>
                  );
                })}
              </div>
              {quizSubmitted && (
                <div className={`mt-3 p-3 rounded-lg text-sm ${
                  quizAnswers[q.id] === q.correctAnswer ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                }`}>
                  {q.explanation}
                </div>
              )}
            </div>
          ))}

          {!quizSubmitted ? (
            <button
              onClick={handleQuizSubmit}
              disabled={!allAnswered}
              className="w-full bg-primary-600 text-white py-3 rounded-xl font-semibold hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Submit Quiz
            </button>
          ) : (
            <div className={`p-6 rounded-xl text-center ${quizPassed ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <div className={`text-3xl font-bold ${quizPassed ? 'text-green-600' : 'text-red-600'}`}>
                {quizPercentage}%
              </div>
              <p className={`text-sm mt-1 ${quizPassed ? 'text-green-700' : 'text-red-700'}`}>
                {quizPassed ? 'Congratulations! You passed. Article Reviews are now unlocked.' : 'You need 70% to pass. Review the materials and try again.'}
              </p>
              {quizPassed && (
                <Link to="/articles" className="mt-4 flex items-center justify-between bg-primary-50 border border-primary-200 rounded-xl p-4 hover:bg-primary-100 transition-colors group">
                  <div className="text-left">
                    <div className="text-xs font-semibold text-primary-500 uppercase tracking-wide">Next Step</div>
                    <div className="text-sm font-bold text-primary-800 mt-0.5">Start Your Article Reviews</div>
                    <div className="text-xs text-primary-600 mt-0.5">Add your first article and begin reviewing. You need 10 reviews total (5 Include, 2 Exclude).</div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-primary-400 group-hover:translate-x-1 transition-transform flex-shrink-0" />
                </Link>
              )}
              {!quizPassed && (
                <button
                  onClick={() => { setQuizSubmitted(false); setQuizAnswers({}); }}
                  className="mt-4 bg-primary-600 text-white px-6 py-2 rounded-xl font-medium hover:bg-primary-700 transition-colors"
                >
                  Retry Quiz
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </PageWrapper>
  );
}
