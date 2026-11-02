import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  FileText,
  Upload,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  UserCheck,
  Building2,
  FileCheck,
  X
} from 'lucide-react';
import { useAppContext } from '../../../context/AppContext';

const PsxRegistration = () => {
  const { addAccountRequest, siteContent } = useAppContext();
  const registrationConfig = siteContent.accountOpeningPage.psxRegistration;
  const documentUploadGuidelines = registrationConfig.documentUploadGuidelines;
  const registrationFields = registrationConfig.formFields || [];
  const documentUploads = registrationConfig.documentUploads || [];
  const [searchParams] = useSearchParams();
  const accountType = searchParams.get('type') === 'normal' ? 'normal' : 'sahulat';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [accountType]);

  const [formData, setFormData] = useState(() => Object.fromEntries(
    registrationFields.map((field) => [
      field.key,
      field.key === 'occupation' && accountType === 'sahulat' ? 'Student / Household' : ''
    ])
  ));
  const [files, setFiles] = useState(() => Object.fromEntries(documentUploads.map((upload) => [upload.key, null])));

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleFileChange = (e, key) => {
    if (e.target.files && e.target.files[0]) {
      setFiles((prev) => ({ ...prev, [key]: e.target.files[0] }));
    }
  };

  const removeFile = (key) => {
    setFiles((prev) => ({ ...prev, [key]: null }));
  };

  const getRegistrationValue = (fieldId) => {
    const field = registrationFields.find((item) => item.id === fieldId);
    return field ? formData[field.key] || '' : '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      try {
        addAccountRequest({
          market: 'Pakistan Stock Exchange (PSX)',
          marketId: 'psx',
          accountType: accountType === 'sahulat' ? 'PSX Saahulat' : 'PSX Normal / Standard',
          fullName: getRegistrationValue('fullName').trim(),
          email: getRegistrationValue('email').trim(),
          phone: getRegistrationValue('mobileNumber').trim(),
          occupation: getRegistrationValue('occupation') || 'Not provided',
          source: 'PSX registration form'
        });
        setIsSubmitted(true);
        toast.success('Application received. Our team will contact you.');
      } catch (error) {
        console.error('Unable to submit PSX account request.', error);
        toast.error('Your application could not be saved. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }, 2500);
  };

  return (
    <div className="bg-[#020602] text-white font-sans min-h-screen overflow-hidden selection:bg-[#a3e635] selection:text-black">
      <main className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 relative select-none">
        
        {/* Background Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[900px] h-[450px] bg-gradient-to-tr from-[#84cc16]/20 via-[#a3e635]/15 to-transparent rounded-full blur-[180px] pointer-events-none animate-pulse"></div>

        {/* Cyber Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0c1d06_1px,transparent_1px),linear-gradient(to_bottom,#0c1d06_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_30%,#000_70%,transparent_100%)] opacity-35 pointer-events-none"></div>

        <div className="max-w-4xl mx-auto relative z-10 space-y-10">
          
          {/* ---------------- 1. PAGE HEADER ---------------- */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#a3e635]/10 border border-[#a3e635]/30 text-[#a3e635] text-xs font-black uppercase tracking-wider">
              <Building2 className="w-3.5 h-3.5" />
              <span>Pakistan Stock Exchange (PSX) Portal</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              {accountType === 'sahulat' ? (
                <>PSX <span className="text-[#a3e635]">Saahulat Trading</span> Account</>
              ) : (
                <>PSX <span className="text-sky-400">Normal / Standard</span> Account</>
              )}
            </h1>

            <p className="text-xs sm:text-sm text-gray-400 max-w-xl mx-auto">
              {accountType === 'sahulat'
                ? "Tailored for Students, Household, & Housewives. Simplified onboarding with low document requirements."
                : "Institutional grade account for Businessmen & Salaried Individuals with full trading volume limits."}
            </p>
          </div>

          {/* ---------------- 2. SCAN QUALITY WARNING BANNER ---------------- */}
          <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/40 flex items-start gap-3 shadow-xl backdrop-blur-md">
            <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0 mt-0.5 animate-pulse" />
            <div className="text-xs space-y-1">
              <span className="font-extrabold text-amber-300 block uppercase tracking-wider">
                Document Upload Guidelines
              </span>
              <p className="text-gray-300 leading-relaxed">
                {documentUploadGuidelines}
              </p>
            </div>
          </div>

          {/* ---------------- 3. REGISTRATION FORM ---------------- */}
          {isSubmitted ? (
            <div className="p-10 rounded-3xl bg-[#040e04] border border-[#a3e635]/50 text-center space-y-4 shadow-[0_0_50px_rgba(163,230,53,0.3)]">
              <CheckCircle2 className="w-16 h-16 text-[#a3e635] mx-auto animate-bounce" />
              <h2 className="text-2xl font-black text-white">Application Successfully Submitted!</h2>
              <p className="text-xs sm:text-sm text-gray-300 max-w-md mx-auto leading-relaxed">
                Thank you for submitting your form. If you have any query, please contact us.
              </p>
              <div className="pt-4">
                <Link
                  to="/home"
                  className="px-8 py-3 rounded-2xl bg-[#a3e635] text-black font-black text-xs inline-flex items-center gap-2 hover:bg-[#84cc16] transition-colors"
                >
                  <span>Return to Homepage</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 sm:p-10 rounded-3xl bg-[#040e04]/90 border border-[#a3e635]/30 shadow-2xl backdrop-blur-xl space-y-8">
              
              {/* SECTION A: BASIC APPLICANT DETAILS */}
              <div className="space-y-4 border-b border-[#a3e635]/15 pb-6">
                <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-[#a3e635]" />
                  {registrationConfig.applicantSectionHeading || 'Applicant Basic Information'}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {registrationFields.filter((field) => field.section === 'applicant' && field.visibleFor?.includes(accountType)).map((field) => (
                    <div key={field.id || field.key} className={`space-y-1 ${field.key === 'ibanNumber' || field.type === 'textarea' ? 'sm:col-span-2' : ''}`}>
                      <label className="text-xs font-bold text-gray-300">{field.label} {field.required ? '*' : '(Optional)'}</label>
                      {field.type === 'select' ? (
                        <select
                          required={field.required}
                          value={formData[field.key] || ''}
                          onChange={(event) => setFormData((current) => ({ ...current, [field.key]: event.target.value }))}
                          className="w-full bg-[#081806] border border-[#a3e635]/30 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#a3e635]"
                        >
                          <option value="" disabled>{field.placeholder || 'Select an option'}</option>
                          {(field.options || []).map((option) => <option key={option} value={option}>{option}</option>)}
                        </select>
                      ) : (
                        <input
                          type={['text', 'email', 'tel', 'date'].includes(field.type) ? field.type : 'text'}
                          required={field.required}
                          placeholder={field.placeholder}
                          value={formData[field.key] || ''}
                          onChange={(event) => setFormData((current) => ({ ...current, [field.key]: event.target.value }))}
                          className="w-full bg-[#081806] border border-[#a3e635]/30 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#a3e635]"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION B: NOMINEE DETAILS */}
              <div className="space-y-4 border-b border-[#a3e635]/15 pb-6">
                <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-violet-300" />
                  {registrationConfig.nomineeSectionHeading || 'Nominee Information'}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {registrationFields.filter((field) => field.section === 'nominee' && field.visibleFor?.includes(accountType)).map((field) => (
                    <div key={field.id || field.key} className={`space-y-1 ${field.type === 'textarea' ? 'sm:col-span-2' : ''}`}>
                      <label className="text-xs font-bold text-gray-300">{field.label} {field.required ? '*' : '(Optional)'}</label>
                      {field.type === 'select' ? (
                        <select
                          required={field.required}
                          value={formData[field.key] || ''}
                          onChange={(event) => setFormData((current) => ({ ...current, [field.key]: event.target.value }))}
                          className="w-full bg-[#081806] border border-violet-300/20 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-violet-300 transition-colors"
                        >
                          <option value="" disabled>{field.placeholder || 'Select an option'}</option>
                          {(field.options || []).map((option) => <option key={option} value={option}>{option}</option>)}
                        </select>
                      ) : (
                        <input
                          type={['text', 'email', 'tel', 'date'].includes(field.type) ? field.type : 'text'}
                          required={field.required}
                          autoComplete="off"
                          placeholder={field.placeholder}
                          value={formData[field.key] || ''}
                          onChange={(event) => setFormData((current) => ({ ...current, [field.key]: event.target.value }))}
                          className="w-full bg-[#081806] border border-violet-300/20 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-violet-300 transition-colors"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION C: DOCUMENT UPLOADS */}
              <div className="space-y-6">
                <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#a3e635]" />
                  {registrationConfig.documentSectionHeading || 'Required Scanned Documents Upload'}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {documentUploads.filter((upload) => upload.visibleFor?.includes(accountType)).map((upload) => (
                    <FileUploadBox
                      key={upload.id || upload.key}
                      label={upload.label}
                      required={upload.required || (upload.requiredForOccupation && getRegistrationValue('occupation') === upload.requiredForOccupation)}
                      file={files[upload.key]}
                      onFileSelect={(event) => handleFileChange(event, upload.key)}
                      onRemove={() => removeFile(upload.key)}
                    />
                  ))}

                </div>
              </div>

              {/* SUBMIT BUTTON */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#a3e635] via-[#84cc16] to-[#a3e635] text-black font-extrabold text-sm flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(163,230,53,0.4)] hover:shadow-[0_0_45px_rgba(163,230,53,0.7)] transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Encrypting & Submitting Scanned Documents...</span>
                  ) : (
                    <>
                      <span>Submit PSX Registration Documents</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

            </form>
          )}

        </div>
      </main>

    </div>
  );
};

// Reusable Custom File Upload Box Component
const FileUploadBox = ({ label, file, onFileSelect, onRemove, required = true }) => {
  return (
    <div className="space-y-1">
      <label className="text-xs font-bold text-gray-300 block truncate">
        {label} {required ? '*' : '(Optional)'}
      </label>
      
      {file ? (
        <div className="p-3 rounded-xl bg-[#a3e635]/15 border border-[#a3e635]/50 flex items-center justify-between text-xs text-white">
          <div className="flex items-center gap-2 truncate">
            <FileCheck className="w-4 h-4 text-[#a3e635] shrink-0" />
            <span className="truncate font-semibold">{file.name}</span>
          </div>
          <button
            type="button"
            onClick={onRemove}
            className="p-1 rounded-lg bg-black/40 hover:bg-black text-gray-300 hover:text-white cursor-pointer shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <label className="p-3.5 rounded-xl bg-[#081806] border border-dashed border-[#a3e635]/30 hover:border-[#a3e635]/60 flex items-center justify-between cursor-pointer transition-colors group">
          <div className="flex items-center gap-2 text-xs text-gray-400 group-hover:text-gray-200">
            <Upload className="w-4 h-4 text-[#a3e635]" />
            <span className="text-[11px]">Upload Scan Quality File</span>
          </div>
          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-[#a3e635]/10 text-[#a3e635] border border-[#a3e635]/20">
            Select
          </span>
          <input type="file" required={required} accept="image/*,.pdf" onChange={onFileSelect} className="hidden" />
        </label>
      )}
    </div>
  );
};

export default PsxRegistration;