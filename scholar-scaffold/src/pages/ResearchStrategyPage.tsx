import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import PageWrapper from '../components/layout/PageWrapper';
import SectionAlert from '../components/common/SectionAlert';
import { Copy, Check, Search, ArrowRight } from 'lucide-react';
import GuidanceBanner from '../components/common/GuidanceBanner';
import { saveSearchStrategy, markStrategyComplete } from '../services/api';

const suggestedDatabases = [
  { name: 'PubMed', description: 'Biomedical and life sciences literature' },
  { name: 'CINAHL', description: 'Nursing and allied health literature' },
  { name: 'PsycINFO', description: 'Behavioral and social sciences research' },
  { name: 'Cochrane Library', description: 'Systematic reviews and clinical trials' },
  { name: 'Web of Science', description: 'Multidisciplinary research across sciences' },
];

const filterOptions = ['Peer-reviewed only', 'Last 5 years', 'Last 10 years', 'English language', 'Full text available'];

export default function ResearchStrategyPage() {
  const { user, completeSearchStrategy } = useUser();
  const [step, setStep] = useState(1);
  const [topic, setTopic] = useState('');
  const [population, setPopulation] = useState('');
  const [keywords, setKeywords] = useState<string[]>([]);
  const [newKeyword, setNewKeyword] = useState('');
  const [operators, setOperators] = useState<string[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [selectedDatabases, setSelectedDatabases] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const toggleDatabase = (name: string) => {
    if (selectedDatabases.includes(name)) {
      setSelectedDatabases(selectedDatabases.filter(d => d !== name));
    } else {
      setSelectedDatabases([...selectedDatabases, name]);
    }
  };

  const populationVague = population.length > 0 && population.length < 10;

  const addKeyword = () => {
    if (newKeyword.trim() && !keywords.includes(newKeyword.trim())) {
      setKeywords([...keywords, newKeyword.trim()]);
      setNewKeyword('');
    }
  };

  const removeKeyword = (kw: string) => {
    setKeywords(keywords.filter(k => k !== kw));
  };

  const toggleOperator = (op: string) => {
    if (operators.includes(op)) {
      setOperators(operators.filter(o => o !== op));
    } else {
      setOperators([...operators, op]);
    }
  };

  const toggleFilter = (f: string) => {
    if (selectedFilters.includes(f)) {
      setSelectedFilters(selectedFilters.filter(sf => sf !== f));
    } else {
      setSelectedFilters([...selectedFilters, f]);
    }
  };

  const buildSearchString = () => {
    if (keywords.length === 0) return '';
    const op = operators.includes('AND') ? ' AND ' : operators.includes('OR') ? ' OR ' : ' AND ';
    let str = keywords.map(k => `"${k}"`).join(op);
    if (population) str += ` AND "${population}"`;
    return str;
  };

  const searchString = buildSearchString();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(searchString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleComplete = async () => {
    setSaving(true);
    setSaveError('');
    try {
      await saveSearchStrategy('', { topic, population, keywords, operators, filters: selectedFilters, searchString });
      await markStrategyComplete();
      completeSearchStrategy();
    } catch {
      setSaveError('Failed to save. Please check your connection and try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageWrapper title="Research Strategy Coach" subtitle="Build an effective database search strategy">
      <GuidanceBanner
        title="What to do here"
        storageKey="research_strategy_guide"
        steps={[
          'Define your research topic and target population.',
          'Build a list of keywords and select Boolean operators (AND, OR, NOT).',
          'Choose which databases you plan to search (PubMed, CINAHL, etc.).',
          'Review your generated search string, copy it, and mark this stage complete.',
        ]}
      />
      <div className="space-y-6">
        {/* Step Indicators */}
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4].map(s => (
            <button
              key={s}
              onClick={() => setStep(s)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                step === s
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 underline-offset-2 hover:underline'
              }`}
            >
              Step {s}
            </button>
          ))}
          <span className="text-xs text-gray-400 ml-2">Click any step to go back and edit</span>
        </div>

        {/* Step 1: Topic Input */}
        {step === 1 && (
          <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Step 1: Define Your Research Topic</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">What is your research topic?</label>
              <input
                type="text"
                value={topic}
                onChange={e => setTopic(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                placeholder="e.g., Mindfulness interventions for anxiety in college students"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Who is your population?</label>
              <input
                type="text"
                value={population}
                onChange={e => setPopulation(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                placeholder="e.g., Undergraduate students aged 18-24"
              />
            </div>
            {populationVague && (
              <SectionAlert type="warning" message="Your population description seems vague. Consider specifying age range, setting, or specific characteristics." />
            )}
            <button
              onClick={() => setStep(2)}
              disabled={!topic || !population}
              className="bg-primary-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next: Build Keywords
            </button>
          </div>
        )}

        {/* Step 2: Keyword Builder */}
        {step === 2 && (
          <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Step 2: Keyword Builder</h2>
            <div className="flex gap-2">
              <input
                type="text"
                value={newKeyword}
                onChange={e => setNewKeyword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addKeyword()}
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                placeholder="Add a keyword..."
              />
              <button onClick={addKeyword} className="bg-primary-600 text-white px-4 py-2.5 rounded-xl hover:bg-primary-700 transition-colors">
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {keywords.map(kw => (
                <span key={kw} className="bg-primary-100 text-primary-700 px-3 py-1.5 rounded-full text-sm flex items-center gap-2">
                  {kw}
                  <button onClick={() => removeKeyword(kw)} className="hover:text-red-600">&times;</button>
                </span>
              ))}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Boolean Operators</label>
              <div className="flex gap-2">
                {['AND', 'OR', 'NOT'].map(op => (
                  <button
                    key={op}
                    onClick={() => toggleOperator(op)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      operators.includes(op) ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {op}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter Recommendations</label>
              <div className="flex flex-wrap gap-2">
                {filterOptions.map(f => (
                  <button
                    key={f}
                    onClick={() => toggleFilter(f)}
                    className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                      selectedFilters.includes(f) ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setStep(1)} className="bg-gray-100 text-gray-700 px-6 py-2.5 rounded-xl font-medium hover:bg-gray-200 transition-colors">
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={keywords.length === 0}
                className="bg-primary-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next: Databases
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Database Suggestions */}
        {step === 3 && (
          <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Step 3: Recommended Databases</h2>
            <p className="text-sm text-gray-600">Select the databases you plan to search. This helps you keep track of where to run your search string.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {suggestedDatabases.map(db => {
                const isSelected = selectedDatabases.includes(db.name);
                return (
                  <button
                    key={db.name}
                    onClick={() => toggleDatabase(db.name)}
                    className={`border rounded-lg p-4 text-left transition-colors ${
                      isSelected
                        ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-200'
                        : 'border-gray-200 hover:border-primary-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Search className="w-4 h-4 text-primary-600" />
                      <h3 className="font-semibold text-gray-900">{db.name}</h3>
                      {isSelected && <span className="ml-auto text-primary-600 text-sm font-medium">Selected</span>}
                    </div>
                    <p className="text-sm text-gray-500">{db.description}</p>
                  </button>
                );
              })}
            </div>
            {selectedDatabases.length > 0 && (
              <p className="text-sm text-green-700 bg-green-50 px-3 py-2 rounded-lg">
                {selectedDatabases.length} database{selectedDatabases.length > 1 ? 's' : ''} selected: {selectedDatabases.join(', ')}
              </p>
            )}
            <div className="flex gap-2">
              <button onClick={() => setStep(2)} className="bg-gray-100 text-gray-700 px-6 py-2.5 rounded-xl font-medium hover:bg-gray-200 transition-colors">
                Back
              </button>
              <button onClick={() => setStep(4)} className="bg-primary-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-primary-700 transition-colors">
                Next: Search String
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Search String Generator */}
        {step === 4 && (
          <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Step 4: Your Search String</h2>
            <div className="bg-gray-50 rounded-xl p-4 font-mono text-sm text-gray-800 border border-gray-200">
              {searchString || 'No keywords added yet.'}
            </div>
            {selectedFilters.length > 0 && (
              <div className="text-sm text-gray-600">
                <strong>Applied filters:</strong> {selectedFilters.join(', ')}
              </div>
            )}
            <div className="flex gap-2">
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-2 bg-primary-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-primary-700 transition-colors"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy to Clipboard'}
              </button>
              <button onClick={() => setStep(3)} className="bg-gray-100 text-gray-700 px-6 py-2.5 rounded-xl font-medium hover:bg-gray-200 transition-colors">
                Back
              </button>
            </div>
            {!user?.searchStrategyComplete && (
              <div className="mt-4 space-y-2">
                {saveError && <SectionAlert type="warning" message={saveError} />}
                <button
                  onClick={handleComplete}
                  disabled={saving}
                  className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 disabled:opacity-50 transition-colors"
                >
                  {saving ? 'Saving...' : 'Mark Stage Complete'}
                </button>
              </div>
            )}
            {user?.searchStrategyComplete && (
              <div className="space-y-3 mt-4">
                <SectionAlert type="info" message="You have completed the Research Strategy Coach. You can still modify your search strategy." />
                <Link to="/design-literacy" className="flex items-center justify-between bg-primary-50 border border-primary-200 rounded-xl p-4 hover:bg-primary-100 transition-colors group">
                  <div>
                    <div className="text-xs font-semibold text-primary-500 uppercase tracking-wide">Next Step</div>
                    <div className="text-sm font-bold text-primary-800 mt-0.5">Research Design Literacy Module</div>
                    <div className="text-xs text-primary-600 mt-0.5">Learn about research designs and pass the quiz to unlock Article Reviews.</div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-primary-400 group-hover:translate-x-1 transition-transform flex-shrink-0" />
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
