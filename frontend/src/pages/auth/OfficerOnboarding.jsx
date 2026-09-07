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
  FiAward,
  FiBriefcase,
  FiLayers,
  FiCpu,
  FiCheck,
} from 'react-icons/fi';
import { RiGovernmentLine, RiSparklingFill } from 'react-icons/ri';
import { useAuth } from '../../context/AuthContext';
import {
  getPresetOfficers,
  syncEhrms,
  parsePastRecord,
  completeOnboarding,
  SAMPLE_DOSSIERS,
  DIGILOCKER_PRESETS,
  DEMO_PRESET_OFFICERS,
} from '../../services/onboardingService';
import GlassCard from '../../components/common/GlassCard';
import GlassButton from '../../components/common/GlassButton';
import GlassBadge from '../../components/common/GlassBadge';

export default function OfficerOnboarding() {
  const navigate = useNavigate();
  const { setOfficerSession } = useAuth();

  const [step, setStep] = useState(1);
  const [activeTab, setActiveTab] = useState('ehrms'); // 'ehrms' | 'ai_parser' | 'digilocker'

  const [presets, setPresets] = useState(DEMO_PRESET_OFFICERS);
  const [selectedPresetId, setSelectedPresetId] = useState('GOI-MOSPI-2022-419');
  const [customEmployeeId, setCustomEmployeeId] = useState('');
  const [pastedDossierText, setPastedDossierText] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [dossier, setDossier] = useState(null);
  const [onboardedUser, setOnboardedUser] = useState(null);

  useEffect(() => {
    async function loadPresets() {
      try {
        const res = await getPresetOfficers();
        const list = Array.isArray(res)
          ? res
          : Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res?.record)
          ? res.record
          : null;
        if (list && list.length > 0) {
          setPresets(list);
          setSelectedPresetId(list[0].employeeId);
        } else {
          setPresets(DEMO_PRESET_OFFICERS);
          setSelectedPresetId(DEMO_PRESET_OFFICERS[0].employeeId);
        }
      } catch (err) {
        setPresets(DEMO_PRESET_OFFICERS);
        setSelectedPresetId(DEMO_PRESET_OFFICERS[0].employeeId);
      }
    }
    loadPresets();
  }, []);

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
      const record = res?.record || res?.data?.record || (res?.name ? res : null);
      if (record) {
        setDossier({
          ...record,
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

  const handleParseWithAi = async () => {
    setError('');
    if (!pastedDossierText || pastedDossierText.trim().length < 20) {
      setError('Please enter sufficient text from the Service Dossier.');
      return;
    }

    setLoading(true);
    try {
      const res = await parsePastRecord(pastedDossierText);
      const record = res?.record || res?.data?.record || (res?.name ? res : null);
      if (record) {
        setDossier({
          ...record,
          email:
            record.email ||
            `${(record.name || 'officer').toLowerCase().replace(/[^a-z0-9]/g, '')}@nic.in`,
          employeeId:
            record.employeeId ||
            `GOI-AI-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
          targetMinistry: record.targetMinistry || 'MoSPI',
          departmentName: record.departmentName || 'Ministry of Statistics and Programme Implementation',
          positionTitle: record.designation || record.positionTitle || 'Statistical Officer',
          roleName: record.roleName || 'Statistical Analysis and Reporting',
          onboardingSource: 'service_book_ai',
        });
        setStep(2);
      } else {
        throw new Error('AI parser could not extract structured records.');
      }
    } catch (err) {
      setError(err.message || 'AI document analysis failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleSyncDigiLocker = (employeeId) => {
    const idToSync = employeeId || 'GOI-NITI-2023-552';
    handleSyncEhrms(idToSync);
  };

  const handleUpdateCompetencyLevel = (idx, newLevel) => {
    if (!dossier?.inferredCompetencies) return;
    const updated = [...dossier.inferredCompetencies];
    updated[idx] = {
      ...updated[idx],
      suggestedLevel: Number(newLevel),
    };
    setDossier({ ...dossier, inferredCompetencies: updated });
  };

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
    <div className="min-h-screen bg-[#F4F1E9] text-[#171717] flex flex-col justify-between px-4 py-6 sm:py-10">
      {/* Top Header */}
      <header className="max-w-4xl mx-auto w-full flex items-center justify-between pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#111111] text-[#FFFDF8] flex items-center justify-center font-bold">
            <RiGovernmentLine className="text-xl" />
          </div>
          <div>
            <span className="text-sm font-bold text-[#111111] tracking-tight block">
              Karmayogi AI &middot; Service Ingestion
            </span>
            <span className="text-[10px] text-[#8A8882] block">
              Automated Officer Onboarding & e-HRMS 2.0 Ingestion
            </span>
          </div>
        </div>

        <Link
          to="/login/employee"
          className="text-xs font-medium text-[#62615D] hover:text-[#111111]"
        >
          &larr; Back to Login
        </Link>
      </header>

      {/* Progress Steps */}
      <div className="max-w-2xl w-full mx-auto my-3">
        <div className="flex items-center justify-between px-2 sm:px-6">
          <div className="flex items-center gap-2">
            <div
              className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${
                step >= 1 ? 'bg-[#111111] text-[#FFFDF8]' : 'bg-[#DDD9CF] text-[#8A8882]'
              }`}
            >
              1
            </div>
            <span className="text-xs font-medium text-[#111111]">Data Ingestion</span>
          </div>

          <div className={`flex-1 h-0.5 mx-3 ${step >= 2 ? 'bg-[#111111]' : 'bg-[#DDD9CF]'}`} />

          <div className="flex items-center gap-2">
            <div
              className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${
                step >= 2 ? 'bg-[#111111] text-[#FFFDF8]' : 'bg-[#DDD9CF] text-[#8A8882]'
              }`}
            >
              2
            </div>
            <span className={`text-xs font-medium ${step >= 2 ? 'text-[#111111]' : 'text-[#8A8882]'}`}>
              Dossier Audit
            </span>
          </div>

          <div className={`flex-1 h-0.5 mx-3 ${step >= 3 ? 'bg-[#52745D]' : 'bg-[#DDD9CF]'}`} />

          <div className="flex items-center gap-2">
            <div
              className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${
                step === 3 ? 'bg-[#52745D] text-white' : 'bg-[#DDD9CF] text-[#8A8882]'
              }`}
            >
              3
            </div>
            <span className={`text-xs font-medium ${step === 3 ? 'text-[#52745D]' : 'text-[#8A8882]'}`}>
              Initialized
            </span>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <main className="max-w-3xl w-full mx-auto my-auto py-2">
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-[#F8E9E7] border border-[#E8C2BF] text-[#A54C45] text-xs flex items-center gap-2">
            <FiAlertCircle className="text-sm flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* STEP 1 */}
        {step === 1 && (
          <div className="rounded-2xl bg-[#FFFDF8] border border-[#DDD9CF] p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="text-center space-y-1 max-w-lg mx-auto">
              <h1 className="text-xl sm:text-2xl font-bold text-[#111111] tracking-tight">
                Officer Service Book Ingestion
              </h1>
              <p className="text-xs text-[#62615D]">
                Synchronize past postings, iGOT Karmayogi certifications, and APAR grading to initialize your role competency baseline.
              </p>
            </div>

            {/* Ingestion Source Tabs */}
            <div className="flex items-center justify-center gap-2 border-b border-[#DDD9CF] pb-3">
              <button
                type="button"
                onClick={() => setActiveTab('ehrms')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                  activeTab === 'ehrms'
                    ? 'bg-[#111111] text-[#FFFDF8] font-semibold'
                    : 'text-[#62615D] hover:bg-[#F8F6F0]'
                }`}
              >
                <FiDatabase className="text-xs" />
                <span>e-HRMS 2.0 & iGOT</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('ai_parser')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                  activeTab === 'ai_parser'
                    ? 'bg-[#111111] text-[#FFFDF8] font-semibold'
                    : 'text-[#62615D] hover:bg-[#F8F6F0]'
                }`}
              >
                <RiSparklingFill className="text-xs text-amber-500" />
                <span>AI Service Book Parser</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('digilocker')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                  activeTab === 'digilocker'
                    ? 'bg-[#111111] text-[#FFFDF8] font-semibold'
                    : 'text-[#62615D] hover:bg-[#F8F6F0]'
                }`}
              >
                <FiShield className="text-xs text-emerald-600" />
                <span>DigiLocker Verification</span>
              </button>
            </div>

            {/* TAB: e-HRMS */}
            {activeTab === 'ehrms' && (
              <div className="space-y-4 pt-1">
                <div className="space-y-1.5">
                  <label
                    htmlFor="profilePresetSelect"
                    className="block text-xs font-bold uppercase tracking-wider text-[#111111]"
                  >
                    Select Civil Servant Record (e-HRMS 2.0 Repository)
                  </label>

                  <select
                    id="profilePresetSelect"
                    value={selectedPresetId}
                    onChange={(e) => {
                      const val = e.target.value;
                      setSelectedPresetId(val);
                      setCustomEmployeeId(val);
                    }}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-[#F8F6F0] border border-[#DDD9CF] text-[#111111] font-medium focus:outline-none focus:border-[#111111]"
                  >
                    <option value="">-- Choose Officer Record from e-HRMS 2.0 Database --</option>
                    {presets.map((p) => (
                      <option key={p.employeeId} value={p.employeeId}>
                        {p.name} — {p.cadre} ({p.targetMinistry} &bull; {p.employeeId})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Selected Officer Preview */}
                {(() => {
                  const activePreset = presets.find((p) => p.employeeId === (selectedPresetId || customEmployeeId));
                  if (!activePreset) return null;
                  return (
                    <div className="p-4 rounded-xl bg-[#F8F6F0] border border-[#DDD9CF] space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-bold text-[#111111]">{activePreset.name}</h3>
                          <p className="text-[11px] text-[#62615D]">
                            {activePreset.cadre} &bull; Batch {activePreset.batchYear} &bull; {activePreset.employeeId}
                          </p>
                        </div>
                        <GlassBadge variant="success" size="xs">
                          e-HRMS Synced
                        </GlassBadge>
                      </div>

                      {activePreset.pastAppraisalsSummary && (
                        <p className="text-[11px] text-[#62615D]">
                          <strong>APAR / SPARROW:</strong> {activePreset.pastAppraisalsSummary}
                        </p>
                      )}

                      <div className="flex items-center justify-between pt-1 border-t border-[#DDD9CF]/60 text-[11px] text-[#8A8882]">
                        <span>{activePreset.serviceHistory?.length || 0} Postings &bull; {activePreset.certifications?.length || 0} Certifications</span>
                        <GlassButton
                          variant="primary"
                          size="xs"
                          loading={loading}
                          onClick={() => handleSyncEhrms(activePreset.employeeId)}
                        >
                          Sync This Record &rarr;
                        </GlassButton>
                      </div>
                    </div>
                  );
                })()}

                {/* Manual PRAN */}
                <div className="pt-2 border-t border-[#DDD9CF] space-y-1">
                  <label htmlFor="employeeId" className="block text-xs text-[#62615D]">
                    Or enter Government Employee ID / PRAN manually
                  </label>
                  <input
                    id="employeeId"
                    type="text"
                    placeholder="e.g. GOI-MOSPI-2022-419"
                    value={customEmployeeId}
                    onChange={(e) => {
                      setCustomEmployeeId(e.target.value);
                      setSelectedPresetId(e.target.value);
                    }}
                    className="w-full px-3 py-1.5 text-xs rounded-lg bg-[#F8F6F0] border border-[#DDD9CF] text-[#111111] font-mono focus:outline-none focus:border-[#111111]"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <GlassButton
                    variant="primary"
                    size="md"
                    iconRight={FiArrowRight}
                    loading={loading}
                    onClick={() => handleSyncEhrms()}
                  >
                    Sync Service Book & Review
                  </GlassButton>
                </div>
              </div>
            )}

            {/* TAB: AI PARSER */}
            {activeTab === 'ai_parser' && (
              <div className="space-y-3 pt-1">
                <div className="space-y-1">
                  <label htmlFor="sampleDossierSelect" className="block text-xs font-semibold text-[#111111]">
                    Select Sample Dossier:
                  </label>
                  <select
                    id="sampleDossierSelect"
                    defaultValue=""
                    onChange={(e) => {
                      if (e.target.value) setPastedDossierText(e.target.value);
                    }}
                    className="w-full px-3 py-1.5 text-xs rounded-lg bg-[#F8F6F0] border border-[#DDD9CF] text-[#111111]"
                  >
                    <option value="">-- Choose Sample Document --</option>
                    {SAMPLE_DOSSIERS.map((s) => (
                      <option key={s.id} value={s.text}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-[#62615D] block">
                    Or paste text from service book / resume:
                  </label>
                  <textarea
                    rows={6}
                    placeholder="Paste service history, transfer orders, or training text here..."
                    value={pastedDossierText}
                    onChange={(e) => setPastedDossierText(e.target.value)}
                    className="w-full p-3 rounded-lg bg-[#F8F6F0] border border-[#DDD9CF] text-xs text-[#111111] font-mono focus:outline-none focus:border-[#111111]"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <GlassButton
                    variant="primary"
                    size="md"
                    iconRight={RiSparklingFill}
                    loading={loading}
                    onClick={handleParseWithAi}
                  >
                    Analyze with AI Parser
                  </GlassButton>
                </div>
              </div>
            )}

            {/* TAB: DIGILOCKER */}
            {activeTab === 'digilocker' && (
              <div className="space-y-4 pt-1">
                <div className="text-center space-y-1 max-w-sm mx-auto">
                  <h3 className="text-sm font-bold text-[#111111]">
                    DigiLocker / National Academic Depository
                  </h3>
                  <p className="text-xs text-[#62615D]">
                    Direct verification of degrees and educational credentials.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {DIGILOCKER_PRESETS.map((cert) => (
                    <div
                      key={cert.id}
                      className="p-3.5 rounded-xl bg-[#F8F6F0] border border-[#DDD9CF] space-y-1.5 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#111111]">{cert.name}</span>
                          <span className="text-[10px] text-[#52745D] font-semibold">Verified</span>
                        </div>
                        <p className="text-xs font-medium text-[#111111]">{cert.degree}</p>
                        <p className="text-[10px] text-[#62615D]">{cert.institution}</p>
                      </div>

                      <div className="pt-2 border-t border-[#DDD9CF] flex justify-end">
                        <GlassButton
                          variant="primary"
                          size="xs"
                          loading={loading}
                          onClick={() => handleSyncDigiLocker(cert.employeeId)}
                        >
                          Verify & Ingest
                        </GlassButton>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 2: REVIEW DOSSIER */}
        {step === 2 && dossier && (
          <div className="rounded-2xl bg-[#FFFDF8] border border-[#DDD9CF] p-6 sm:p-8 space-y-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#DDD9CF] pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-[#111111]">{dossier.name}</h2>
                  <GlassBadge variant="success" size="xs">
                    e-HRMS Verified
                  </GlassBadge>
                </div>
                <p className="text-xs text-[#62615D]">
                  {dossier.cadre || 'Civil Services'} &bull; Batch of {dossier.batchYear || 2021} &bull; {dossier.employeeId}
                </p>
              </div>

              <span className="text-xs font-semibold text-[#111111] bg-[#F8F6F0] px-2.5 py-1 rounded border border-[#DDD9CF]">
                {dossier.departmentName || 'MoSPI'}
              </span>
            </div>

            {dossier.pastAppraisalsSummary && (
              <div className="p-3 rounded-lg bg-[#F8F6F0] border border-[#DDD9CF] text-xs text-[#62615D]">
                <strong className="text-[#111111]">APAR Performance Record:</strong> {dossier.pastAppraisalsSummary}
              </div>
            )}

            {/* Postings */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#111111]">
                Service History ({dossier.serviceHistory?.length || 0})
              </h3>
              <div className="space-y-2">
                {(dossier.serviceHistory || []).map((post, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-[#F8F6F0] border border-[#DDD9CF] text-xs space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[#111111]">{post.designation}</span>
                      <span className="text-[10px] text-[#8A8882]">{post.duration}</span>
                    </div>
                    <p className="text-[11px] text-[#3348A8]">{post.organization}</p>
                    {post.domain && <p className="text-[10px] text-[#8A8882]">Domain: {post.domain}</p>}
                  </div>
                ))}
              </div>
            </div>

            {/* Inferred Competencies */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#111111]">
                Inferred Baseline Competencies
              </h3>
              <div className="space-y-2">
                {(dossier.inferredCompetencies || []).map((comp, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-[#F8F6F0] border border-[#DDD9CF] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                  >
                    <div>
                      <span className="font-semibold text-[#111111] block">{comp.competencyName}</span>
                      <p className="text-[11px] text-[#8A8882]">{comp.rationale}</p>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-[11px] text-[#62615D]">Baseline:</span>
                      <select
                        value={comp.suggestedLevel}
                        onChange={(e) => handleUpdateCompetencyLevel(idx, e.target.value)}
                        className="px-2 py-0.5 rounded bg-[#FFFDF8] border border-[#DDD9CF] font-bold text-xs text-[#111111]"
                      >
                        <option value={1}>L1 - Basic</option>
                        <option value={2}>L2 - Working</option>
                        <option value={3}>L3 - Proficient</option>
                        <option value={4}>L4 - Advanced</option>
                        <option value={5}>L5 - Expert</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-[#DDD9CF] flex items-center justify-between">
              <GlassButton
                variant="secondary"
                size="sm"
                icon={FiArrowLeft}
                onClick={() => setStep(1)}
              >
                Change Record
              </GlassButton>

              <GlassButton
                variant="primary"
                size="md"
                iconRight={FiCheckCircle}
                loading={loading}
                onClick={handleCompleteOnboarding}
              >
                Confirm & Complete Onboarding
              </GlassButton>
            </div>
          </div>
        )}

        {/* STEP 3: SUCCESS */}
        {step === 3 && (
          <div className="rounded-2xl bg-[#FFFDF8] border border-[#DDD9CF] p-8 sm:p-10 text-center space-y-5 max-w-lg mx-auto shadow-xs">
            <div className="w-12 h-12 rounded-full bg-[#EAF2EC] text-[#52745D] border border-[#C5DDCB] flex items-center justify-center mx-auto text-2xl">
              <FiCheckCircle />
            </div>

            <div className="space-y-1">
              <h2 className="text-xl font-bold text-[#111111]">
                Welcome to Karmayogi AI, {onboardedUser?.name || 'Officer'}!
              </h2>
              <p className="text-xs text-[#62615D]">
                Your service dossier has been mapped to your official government competency profile.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#F8F6F0] border border-[#DDD9CF] text-left text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-[#8A8882]">Officer ID:</span>
                <span className="font-mono font-semibold text-[#111111]">{onboardedUser?.employeeId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8A8882]">Designation:</span>
                <span className="font-semibold text-[#111111]">
                  {onboardedUser?.positionId?.title || 'Statistical Officer'} &bull; {onboardedUser?.departmentId?.shortName || 'MoSPI'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8A8882]">Competencies Initialized:</span>
                <span className="font-bold text-[#52745D]">
                  {onboardedUser?.competencyProfile?.length || 3} Active
                </span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              <GlassButton
                variant="secondary"
                size="md"
                onClick={() => {
                  setStep(1);
                  setDossier(null);
                  setOnboardedUser(null);
                }}
                className="w-full justify-center"
              >
                Onboard Another Officer
              </GlassButton>

              <GlassButton
                variant="primary"
                size="md"
                iconRight={FiArrowRight}
                onClick={() => navigate('/employee/dashboard')}
                className="w-full justify-center"
              >
                Enter Officer Dashboard
              </GlassButton>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto w-full text-center pt-4">
        <p className="text-[10px] text-[#8A8882]">
          Karmayogi AI &bull; National Civil Services Capacity Building Platform &bull; MoSPI
        </p>
      </footer>
    </div>
  );
}
