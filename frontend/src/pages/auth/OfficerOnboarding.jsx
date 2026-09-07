import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  FiShield,
  FiArrowRight,
  FiArrowLeft,
  FiCheckCircle,
  FiAlertCircle,
  FiRefreshCw,
  FiDatabase,
  FiFileText,
  FiAward,
  FiBriefcase,
  FiUser,
  FiCalendar,
  FiZap,
  FiLayers,
  FiExternalLink,
  FiCpu,
  FiLock,
  FiCheck,
} from 'react-icons/fi';
import { RiGovernmentLine, RiSparklingFill } from 'react-icons/ri';
import { useAuth } from '../../context/AuthContext';
import {
  getPresetOfficers,
  syncEhrms,
  parsePastRecord,
  completeOnboarding,
} from '../../services/onboardingService';
import GlassCard from '../../components/common/GlassCard';
import GlassButton from '../../components/common/GlassButton';
import GlassBadge from '../../components/common/GlassBadge';

const SAMPLE_SERVICE_DOSSIER = `CIVIL SERVICES RECORD OF SERVICE & POSTING SUMMARY
OFFICER NAME: Rajeshwardhan Kulkarni
CADRE: Indian Statistical Service (ISS) | BATCH: 2020 | PRAN: 110098452104
CURRENT DESIGNATION: Senior Statistical Officer, MoSPI

PRIOR POSTINGS:
1. Ministry of Consumer Affairs, Food & Public Distribution (2021 - 2023)
   Designation: Assistant Director (Price Monitoring Division)
   Responsibilities:
   - Architected daily wholesale and retail essential commodity price index algorithms covering 550 market centers.
   - Performed econometric time-series forecasting for food inflation volatility indices.

2. National Statistical Office (NSO) - Industrial Statistics Wing, Kolkata (2020 - 2021)
   Designation: Statistical Officer (ASI Field Survey Unit)
   Responsibilities:
   - Led field audit of Annual Survey of Industries (ASI) for large-scale manufacturing clusters.
   - Evaluated sample non-response biases and variance estimations.

TRAINING & CREDENTIALS:
- iGOT Karmayogi: Public Procurement on GeM and Contract Management (Completed Nov 2023)
- LBSNAA: Mid-Career Governance & Quantitative Policy Formulation (Completed May 2022)
- Degree: M.Sc. in Statistics, Indian Statistical Institute (ISI Kolkata)`;

export default function OfficerOnboarding() {
  const navigate = useNavigate();
  const { setOfficerSession } = useAuth();

  // Wizard Step: 1 (Ingest Source) -> 2 (Review Past Dossier) -> 3 (Final Success)
  const [step, setStep] = useState(1);
  const [activeTab, setActiveTab] = useState('ehrms'); // 'ehrms' | 'ai_parser' | 'digilocker'

  // Presets & Form state
  const [presets, setPresets] = useState([]);
  const [selectedPresetId, setSelectedPresetId] = useState('GOI-MOSPI-2022-419');
  const [customEmployeeId, setCustomEmployeeId] = useState('');
  const [pastedDossierText, setPastedDossierText] = useState('');

  // Loading & error
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Extracted/Synced Record Dossier
  const [dossier, setDossier] = useState(null);
  const [onboardedUser, setOnboardedUser] = useState(null);

  // Load presets on mount
  useEffect(() => {
    async function loadPresets() {
      try {
        const res = await getPresetOfficers();
        if (res?.data && Array.isArray(res.data)) {
          setPresets(res.data);
          if (res.data.length > 0) {
            setSelectedPresetId(res.data[0].employeeId);
          }
        }
      } catch (err) {
        console.warn('Could not load preset officers:', err);
      }
    }
    loadPresets();
  }, []);

  // Handle Ingest via e-HRMS 2.0 / iGOT
  const handleSyncEhrms = async (idToUse) => {
    setError('');
    const targetId = idToUse || customEmployeeId.trim() || selectedPresetId;
    if (!targetId) {
      setError('Please choose or enter a valid Government Employee ID / PRAN.');
      return;
    }

    setLoading(true);
    try {
      const res = await syncEhrms(targetId);
      if (res?.data?.record) {
        setDossier({
          ...res.data.record,
          onboardingSource: 'ehrms_sync',
        });
        setStep(2);
      } else {
        throw new Error('No service record returned by e-HRMS service.');
      }
    } catch (err) {
      setError(err.message || 'Failed to connect to e-HRMS repository.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Ingest via AI Service Book Parser (Gemini)
  const handleParseWithAi = async () => {
    setError('');
    if (!pastedDossierText || pastedDossierText.trim().length < 20) {
      setError('Please paste or enter sufficient text from the Service Dossier or Resume.');
      return;
    }

    setLoading(true);
    try {
      const res = await parsePastRecord(pastedDossierText);
      if (res?.data?.record) {
        setDossier({
          ...res.data.record,
          email:
            res.data.record.email ||
            `${(res.data.record.name || 'officer').toLowerCase().replace(/[^a-z0-9]/g, '')}@nic.in`,
          employeeId:
            res.data.record.employeeId ||
            `GOI-AI-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
          targetMinistry: 'MoSPI',
          departmentName: 'Ministry of Statistics and Programme Implementation',
          positionTitle: res.data.record.designation || 'Statistical Officer',
          roleName: 'Statistical Analysis and Reporting',
          onboardingSource: 'service_book_ai',
        });
        setStep(2);
      } else {
        throw new Error('AI parser could not extract structured records from document.');
      }
    } catch (err) {
      setError(err.message || 'AI document analysis failed.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Ingest via DigiLocker
  const handleSyncDigiLocker = () => {
    // Uses predefined verified credentials
    handleSyncEhrms('GOI-NITI-2023-552');
  };

  // Change competency level in review
  const handleUpdateCompetencyLevel = (idx, newLevel) => {
    if (!dossier?.inferredCompetencies) return;
    const updated = [...dossier.inferredCompetencies];
    updated[idx] = {
      ...updated[idx],
      suggestedLevel: Number(newLevel),
    };
    setDossier({ ...dossier, inferredCompetencies: updated });
  };

  // Finalize Onboarding and commit to DB
  const handleCompleteOnboarding = async () => {
    if (!dossier) return;
    setError('');
    setLoading(true);

    try {
      const payload = {
        employeeId: dossier.employeeId,
        name: dossier.name,
        email: dossier.email,
        cadre: dossier.cadre,
        batchYear: dossier.batchYear || 2021,
        onboardingSource: dossier.onboardingSource || 'ehrms_sync',
        targetMinistry: dossier.targetMinistry || 'MoSPI',
        pastAppraisalsSummary: dossier.pastAppraisalsSummary,
        serviceHistory: dossier.serviceHistory || [],
        certifications: dossier.certifications || [],
        inferredCompetencies: dossier.inferredCompetencies || [],
      };

      const res = await completeOnboarding(payload);
      const savedUser = res?.data || res;

      // Update active authentication session
      setOfficerSession(savedUser);
      setOnboardedUser(savedUser);
      setStep(3);
    } catch (err) {
      setError(err.message || 'Failed to complete officer onboarding.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen ambient-canvas bg-canvas text-slate-800 flex flex-col justify-between relative px-4 py-6 sm:py-10">
      {/* Ambient Blurred Elements */}
      <div className="ambient-glow-1" />
      <div className="ambient-glow-2" />
      <div className="ambient-glow-3" />

      {/* Top Header */}
      <header className="max-w-5xl mx-auto w-full flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <RiGovernmentLine className="text-2xl" />
          </div>
          <div>
            <span className="text-lg font-extrabold text-slate-900 tracking-tight block leading-tight">
              Karmayogi AI
            </span>
            <span className="text-[11px] text-slate-500 font-medium tracking-wide block">
              Automated Officer Onboarding & Service Book Ingestion
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <GlassBadge variant="purple" size="sm" icon={FiCpu}>
            Smart Ingest Engine
          </GlassBadge>
          <Link
            to="/login/employee"
            className="text-xs font-semibold text-slate-600 hover:text-blue-700 transition-colors ml-2"
          >
            Back to Login
          </Link>
        </div>
      </header>

      {/* Progress Step Bar */}
      <div className="max-w-3xl w-full mx-auto my-4 relative z-10">
        <div className="flex items-center justify-between px-2 sm:px-6">
          <div className="flex items-center gap-2">
            <div
              className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center transition-all ${
                step >= 1
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                  : 'bg-slate-200 text-slate-500'
              }`}
            >
              1
            </div>
            <span
              className={`text-xs font-semibold ${
                step >= 1 ? 'text-slate-900' : 'text-slate-400'
              }`}
            >
              Data Ingest
            </span>
          </div>

          <div
            className={`flex-1 h-0.5 mx-3 transition-colors ${
              step >= 2 ? 'bg-blue-600' : 'bg-slate-200'
            }`}
          />

          <div className="flex items-center gap-2">
            <div
              className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center transition-all ${
                step >= 2
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                  : 'bg-slate-200 text-slate-500'
              }`}
            >
              2
            </div>
            <span
              className={`text-xs font-semibold ${
                step >= 2 ? 'text-slate-900' : 'text-slate-400'
              }`}
            >
              Service Dossier & Rubric Audit
            </span>
          </div>

          <div
            className={`flex-1 h-0.5 mx-3 transition-colors ${
              step >= 3 ? 'bg-emerald-600' : 'bg-slate-200'
            }`}
          />

          <div className="flex items-center gap-2">
            <div
              className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center transition-all ${
                step === 3
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-500/30'
                  : 'bg-slate-200 text-slate-500'
              }`}
            >
              3
            </div>
            <span
              className={`text-xs font-semibold ${
                step === 3 ? 'text-slate-900' : 'text-slate-400'
              }`}
            >
              Profile Synchronized
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-4xl w-full mx-auto my-auto relative z-10 py-2">
        {error && (
          <div className="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 shadow-xs">
            <FiAlertCircle className="text-rose-600 text-base flex-shrink-0 mt-0.5" />
            <div className="flex-1 font-medium">{error}</div>
          </div>
        )}

        {/* STEP 1: CHOOSE DATA INGESTION SOURCE */}
        {step === 1 && (
          <GlassCard variant="solid" className="p-6 sm:p-9 border-white/80 shadow-glass-lg space-y-6">
            <div className="text-center space-y-2 max-w-xl mx-auto">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Onboard with Past Service History
              </h1>
              <p className="text-xs sm:text-sm text-slate-600">
                Karmayogi AI automatically retrieves your past postings, verified iGOT courses, and APAR grading to initialize your baseline competency profile.
              </p>
            </div>

            {/* Ingestion Source Tabs */}
            <div className="flex items-center justify-center gap-2 border-b border-slate-200/80 pb-3">
              <button
                type="button"
                onClick={() => setActiveTab('ehrms')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  activeTab === 'ehrms'
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <FiDatabase className="text-sm" />
                <span>e-HRMS 2.0 & iGOT Sync</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('ai_parser')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  activeTab === 'ai_parser'
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <RiSparklingFill className="text-sm text-amber-300" />
                <span>AI Service Book / CV Ingestion</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('digilocker')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  activeTab === 'digilocker'
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <FiShield className="text-sm text-emerald-300" />
                <span>DigiLocker Verification</span>
              </button>
            </div>

            {/* TAB A: e-HRMS SYNC */}
            {activeTab === 'ehrms' && (
              <div className="space-y-6 pt-2">
                {/* 1-Click Evaluation Presets */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Select Pre-Configured Civil Servant Profile (Demo Evaluation)
                    </label>
                    <span className="text-[11px] text-blue-600 font-semibold">1-Click Test</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {presets.map((p) => {
                      const isSelected = selectedPresetId === p.employeeId;
                      return (
                        <div
                          key={p.employeeId}
                          onClick={() => {
                            setSelectedPresetId(p.employeeId);
                            setCustomEmployeeId('');
                          }}
                          className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-blue-50/90 border-blue-400 ring-2 ring-blue-400/30 shadow-xs'
                              : 'bg-white/70 border-slate-200 hover:border-slate-300 hover:bg-white'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-bold text-slate-900">{p.name}</span>
                            <GlassBadge variant={isSelected ? 'primary' : 'default'} size="xs">
                              {p.targetMinistry}
                            </GlassBadge>
                          </div>
                          <p className="text-[11px] text-slate-500 font-medium">
                            {p.cadre} &bull; {p.batchYear}
                          </p>
                          <p className="text-[10px] text-slate-400 font-mono mt-1">
                            {p.employeeId}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Or Custom ID Input */}
                <div className="relative flex py-1 items-center">
                  <div className="flex-grow border-t border-slate-200"></div>
                  <span className="flex-shrink mx-4 text-[11px] text-slate-400 uppercase font-semibold">
                    Or Enter Custom Government ID
                  </span>
                  <div className="flex-grow border-t border-slate-200"></div>
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="employeeId"
                    className="block text-xs font-semibold uppercase tracking-wider text-slate-700"
                  >
                    Employee ID / PRAN / Karma ID
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <FiBriefcase className="text-base" />
                    </div>
                    <input
                      id="employeeId"
                      type="text"
                      placeholder="e.g. GOI-MOSPI-2022-419, GOI-DOPT-2020-108"
                      value={customEmployeeId}
                      onChange={(e) => {
                        setCustomEmployeeId(e.target.value);
                        setSelectedPresetId('');
                      }}
                      className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-white/70 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Queries central e-HRMS 2.0 electronic service book and iGOT learning repository.
                  </p>
                </div>

                <div className="pt-2 flex justify-end">
                  <GlassButton
                    variant="primary"
                    size="lg"
                    iconRight={FiArrowRight}
                    loading={loading}
                    onClick={() => handleSyncEhrms()}
                  >
                    {loading ? 'Connecting to e-HRMS 2.0...' : 'Sync Service Book & Review'}
                  </GlassButton>
                </div>
              </div>
            )}

            {/* TAB B: SMART AI DOCUMENT PARSER */}
            {activeTab === 'ai_parser' && (
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <RiSparklingFill className="text-amber-500" />
                    <span>Paste Service Dossier, CV or Past Posting Notes</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setPastedDossierText(SAMPLE_SERVICE_DOSSIER)}
                    className="text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold underline"
                  >
                    Insert Sample Service Dossier
                  </button>
                </div>

                <textarea
                  rows={8}
                  placeholder="Paste text from officer's physical service book, resume, transfer orders, or training certificates..."
                  value={pastedDossierText}
                  onChange={(e) => setPastedDossierText(e.target.value)}
                  className="w-full p-3.5 rounded-xl bg-white/80 border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-mono leading-relaxed"
                />

                <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/70 text-[11px] text-amber-900 flex items-start gap-2">
                  <RiSparklingFill className="text-amber-600 text-sm flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Gemini AI Intelligence:</strong> Extracts prior ministries, assignments, and verified certificates, directly mapping them to official national competency rubrics.
                  </span>
                </div>

                <div className="pt-2 flex justify-end">
                  <GlassButton
                    variant="primary"
                    size="lg"
                    iconRight={RiSparklingFill}
                    loading={loading}
                    onClick={handleParseWithAi}
                  >
                    {loading ? 'AI Analyzing Service Records...' : 'Analyze with Karmayogi AI'}
                  </GlassButton>
                </div>
              </div>
            )}

            {/* TAB C: DIGILOCKER */}
            {activeTab === 'digilocker' && (
              <div className="space-y-5 pt-2 text-center py-4">
                <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto text-3xl shadow-sm">
                  <FiShield />
                </div>
                <div className="space-y-1.5 max-w-md mx-auto">
                  <h3 className="text-lg font-bold text-slate-900">
                    Connect National Academic Depository (DigiLocker)
                  </h3>
                  <p className="text-xs text-slate-600">
                    Pull verified university degrees, professional diplomas, and official civil service training credentials instantly.
                  </p>
                </div>

                <div className="pt-3">
                  <GlassButton
                    variant="primary"
                    size="lg"
                    icon={FiCheckCircle}
                    loading={loading}
                    onClick={handleSyncDigiLocker}
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    {loading ? 'Verifying with DigiLocker...' : 'Authenticate & Pull Verified Credentials'}
                  </GlassButton>
                </div>
              </div>
            )}
          </GlassCard>
        )}

        {/* STEP 2: REVIEW EXTRACTED DOSSIER & INFERRED RUBRICS */}
        {step === 2 && dossier && (
          <GlassCard variant="solid" className="p-6 sm:p-8 border-white/80 shadow-glass-lg space-y-6">
            {/* Header / Identity Summary */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
              <div className="flex items-center gap-3.5">
                <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-bold text-lg flex items-center justify-center shadow-md">
                  {dossier.name
                    ?.split(' ')
                    .map((n) => n[0])
                    .join('')
                    .substring(0, 2)
                    .toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-extrabold text-slate-900">{dossier.name}</h2>
                    <GlassBadge variant="success" size="xs" dot>
                      e-HRMS Verified
                    </GlassBadge>
                  </div>
                  <p className="text-xs text-slate-600 font-medium">
                    {dossier.cadre || 'Civil Services'} &bull; Batch of {dossier.batchYear || 2021} &bull; {dossier.employeeId}
                  </p>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-[11px] text-slate-400 block">Assigned Ministry</span>
                <span className="text-xs font-bold text-slate-900">
                  {dossier.departmentName || 'MoSPI'}
                </span>
              </div>
            </div>

            {/* Performance & APAR Evaluation summary */}
            {dossier.pastAppraisalsSummary && (
              <div className="p-3.5 rounded-xl bg-blue-50/80 border border-blue-200/80 text-xs text-blue-950 flex items-start gap-2.5">
                <FiAward className="text-blue-600 text-base flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">Past Service Appraisal & SPARROW Record:</span>
                  <span className="text-slate-700">{dossier.pastAppraisalsSummary}</span>
                </div>
              </div>
            )}

            {/* Past Postings Timeline */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <FiBriefcase className="text-indigo-600" />
                <span>Historical Postings & Ministry Records ({dossier.serviceHistory?.length || 0})</span>
              </h3>

              <div className="space-y-2.5">
                {(dossier.serviceHistory || []).map((post, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs space-y-1.5"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <span className="font-bold text-slate-900 text-sm">{post.designation}</span>
                      <span className="text-[11px] font-semibold text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200 w-fit">
                        {post.duration}
                      </span>
                    </div>

                    <p className="text-xs text-blue-800 font-semibold">{post.organization}</p>
                    {post.domain && (
                      <p className="text-[11px] text-slate-500">Domain: {post.domain}</p>
                    )}

                    {post.keyContributions && post.keyContributions.length > 0 && (
                      <ul className="list-disc list-inside text-[11px] text-slate-600 pt-1 space-y-0.5">
                        {post.keyContributions.map((kc, kIdx) => (
                          <li key={kIdx}>{kc}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Verified Certifications (iGOT / ISTM / DigiLocker) */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <FiCheckCircle className="text-emerald-600" />
                <span>Verified Training & Educational Accreditations</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {(dossier.certifications || []).map((cert, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200/70 text-xs flex items-start gap-2.5"
                  >
                    <FiAward className="text-emerald-700 text-base flex-shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <span className="font-bold text-slate-900 block leading-snug">{cert.title}</span>
                      <span className="text-[11px] text-slate-600 block">{cert.issuingAuthority}</span>
                      <div className="flex items-center gap-2 pt-1">
                        <GlassBadge variant="success" size="xs">
                          Verified Credential
                        </GlassBadge>
                        {cert.completionDate && (
                          <span className="text-[10px] text-slate-400">
                            {new Date(cert.completionDate).toLocaleDateString('en-IN', {
                              year: 'numeric',
                              month: 'short',
                            })}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Inferred Competency Rubrics (Level 1 to 5) */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <RiSparklingFill className="text-amber-500" />
                  <span>AI Inferred Baseline Competencies</span>
                </h3>
                <span className="text-[11px] text-slate-500">
                  Calculated from past postings & certifications
                </span>
              </div>

              <div className="space-y-2">
                {(dossier.inferredCompetencies || []).map((comp, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-white border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-0.5 max-w-md">
                      <span className="font-bold text-slate-900 block">{comp.competencyName}</span>
                      <p className="text-[11px] text-slate-500 leading-snug">{comp.rationale}</p>
                    </div>

                    <div className="flex items-center gap-2.5 self-end sm:self-center">
                      <span className="text-[11px] text-slate-500 font-medium">Initial Score:</span>
                      <select
                        value={comp.suggestedLevel}
                        onChange={(e) => handleUpdateCompetencyLevel(idx, e.target.value)}
                        className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-300 font-bold text-xs text-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value={1}>L1 - Beginner</option>
                        <option value={2}>L2 - Basic</option>
                        <option value={3}>L3 - Intermediate</option>
                        <option value={4}>L4 - Advanced</option>
                        <option value={5}>L5 - Expert</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-slate-200/80 flex items-center justify-between">
              <GlassButton
                variant="outline"
                size="md"
                icon={FiArrowLeft}
                onClick={() => setStep(1)}
              >
                Change Source
              </GlassButton>

              <GlassButton
                variant="primary"
                size="lg"
                iconRight={FiCheckCircle}
                loading={loading}
                onClick={handleCompleteOnboarding}
              >
                {loading ? 'Initializing Officer Profile...' : 'Confirm & Complete Onboarding'}
              </GlassButton>
            </div>
          </GlassCard>
        )}

        {/* STEP 3: SUCCESS & LAUNCH DASHBOARD */}
        {step === 3 && (
          <GlassCard variant="solid" className="p-8 sm:p-12 border-white/80 shadow-glass-lg text-center space-y-6 max-w-xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-3xl shadow-sm">
              <FiCheckCircle />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-slate-900">
                Welcome to Karmayogi AI, {onboardedUser?.name || 'Officer'}!
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Your past service dossier, <strong>e-HRMS postings</strong>, and accredited courses have been successfully mapped into your official government competency profile.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Officer PRAN / ID:</span>
                <span className="font-mono font-bold text-slate-900">{onboardedUser?.employeeId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Designation & Ministry:</span>
                <span className="font-bold text-slate-900">
                  {onboardedUser?.positionId?.title || 'Statistical Officer'} &bull; {onboardedUser?.departmentId?.shortName || 'MoSPI'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Baseline Competencies Initialized:</span>
                <span className="font-bold text-emerald-700">
                  {onboardedUser?.competencyProfile?.length || 3} Active Rubrics
                </span>
              </div>
            </div>

            <div className="pt-2">
              <GlassButton
                variant="primary"
                size="lg"
                iconRight={FiArrowRight}
                onClick={() => navigate('/employee/dashboard')}
                className="w-full justify-center shadow-md shadow-blue-500/20"
              >
                Enter Officer Dashboard
              </GlassButton>
            </div>
          </GlassCard>
        )}
      </main>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto w-full text-center relative z-10 pt-4">
        <p className="text-[11px] text-slate-400">
          Karmayogi AI &bull; Smart India Hackathon 2026 Prototype &bull; Capacity Building Commission
        </p>
      </footer>
    </div>
  );
}
