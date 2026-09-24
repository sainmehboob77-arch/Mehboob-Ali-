import React, { useState } from 'react';
import { AdmissionsApplication, GuardianContact, AdmissionDocument } from '../types';
import { 
  FileText, 
  Search, 
  Upload, 
  CheckCircle2, 
  Clock, 
  UserCheck, 
  AlertCircle, 
  Building2, 
  Download, 
  Printer, 
  ChevronRight, 
  Calendar, 
  ShieldCheck, 
  UserPlus, 
  Eye, 
  X,
  Phone,
  Mail,
  MapPin,
  Sparkles
} from 'lucide-react';

interface AdmissionsPortalProps {
  admissions: AdmissionsApplication[];
  onAddAdmission: (app: AdmissionsApplication) => void;
  onUpdateAdmission: (app: AdmissionsApplication) => void;
  onConvertToStudent: (appId: string, assignedRollNo: string, section: string) => void;
}

export const AdmissionsPortal: React.FC<AdmissionsPortalProps> = ({
  admissions,
  onAddAdmission,
  onUpdateAdmission,
  onConvertToStudent,
}) => {
  const [activeTab, setActiveTab] = useState<'apply' | 'track' | 'adminReview' | 'eligibility'>('apply');
  
  // Tracking State
  const [searchTrackingId, setSearchTrackingId] = useState('');
  const [searchedApplication, setSearchedApplication] = useState<AdmissionsApplication | null>(null);
  const [trackError, setTrackError] = useState('');

  // Admin Review Filters
  const [adminStatusFilter, setAdminStatusFilter] = useState<string>('All');
  const [adminSearchTerm, setAdminSearchTerm] = useState<string>('');
  const [selectedAppForModal, setSelectedAppForModal] = useState<AdmissionsApplication | null>(null);
  const [enrollRollNo, setEnrollRollNo] = useState('');
  const [enrollSection, setEnrollSection] = useState('A');
  const [interviewDateInput, setInterviewDateInput] = useState('');
  const [interviewVenueInput, setInterviewVenueInput] = useState('Principal Office, Main Academic Block');

  // Multi-step Application Form State
  const [formStep, setFormStep] = useState<number>(1);
  const [formData, setFormData] = useState({
    applicantName: '',
    gender: 'Male' as 'Male' | 'Female',
    dateOfBirth: '',
    gradeApplyingFor: 'Grade 9',
    bFormNumber: '',
    previousSchool: '',
    previousMarksPercentage: 80,
    bloodGroup: 'B+',
    medicalConditions: 'None',
    // Guardian
    fatherName: '',
    fatherOccupation: '',
    fatherCnic: '',
    motherName: '',
    primaryPhone: '',
    whatsappNumber: '',
    email: '',
    residentialAddress: 'Adam Doki, Sindh',
    emergencyContact: '',
    relation: 'Father',
  });

  // Mock Uploaded Documents
  const [uploadedDocs, setUploadedDocs] = useState<{
    photo?: AdmissionDocument;
    bForm?: AdmissionDocument;
    fatherCnic?: AdmissionDocument;
    marksheet?: AdmissionDocument;
  }>({
    photo: {
      id: 'doc-p-1',
      name: 'Passport Photo',
      type: 'photo',
      fileName: 'applicant_recent_photo.jpg',
      fileSize: '320 KB',
      fileUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      uploadDate: new Date().toISOString().split('T')[0],
      verified: true,
    }
  });

  const [submissionSuccess, setSubmissionSuccess] = useState<AdmissionsApplication | null>(null);

  // Handle Document Upload Simulation
  const handleDocUpload = (type: 'photo' | 'bForm' | 'fatherCnic' | 'marksheet', file: File) => {
    const newDoc: AdmissionDocument = {
      id: `doc-${Date.now()}`,
      name: type === 'photo' ? 'Passport Size Photograph' :
            type === 'bForm' ? 'NADRA B-Form Certificate' :
            type === 'fatherCnic' ? "Father's CNIC Card" : 'Previous School Leaving Marksheet',
      type,
      fileName: file.name,
      fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      fileUrl: type === 'photo' ? URL.createObjectURL(file) : undefined,
      uploadDate: new Date().toISOString().split('T')[0],
      verified: false,
    };

    setUploadedDocs(prev => ({ ...prev, [type]: newDoc }));
  };

  const handleSubmitApplication = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `APP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newApp: AdmissionsApplication = {
      id: newId,
      submissionDate: new Date().toISOString().split('T')[0],
      applicantName: formData.applicantName,
      gender: formData.gender,
      dateOfBirth: formData.dateOfBirth,
      gradeApplyingFor: formData.gradeApplyingFor,
      bFormNumber: formData.bFormNumber,
      previousSchool: formData.previousSchool || 'Home / Previous Local School',
      previousMarksPercentage: Number(formData.previousMarksPercentage) || 75,
      bloodGroup: formData.bloodGroup,
      medicalConditions: formData.medicalConditions,
      guardian: {
        fatherName: formData.fatherName,
        fatherOccupation: formData.fatherOccupation,
        fatherCnic: formData.fatherCnic,
        motherName: formData.motherName,
        primaryPhone: formData.primaryPhone,
        whatsappNumber: formData.whatsappNumber || formData.primaryPhone,
        email: formData.email,
        residentialAddress: formData.residentialAddress,
        emergencyContact: formData.emergencyContact || formData.primaryPhone,
        relation: formData.relation,
      },
      documents: uploadedDocs,
      status: 'Under Review',
      adminNotes: 'Application submitted through online admission portal. Initial documents uploaded.',
    };

    onAddAdmission(newApp);
    setSubmissionSuccess(newApp);
    setFormStep(1);
  };

  const handleTrackSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setTrackError('');
    const query = searchTrackingId.trim().toUpperCase();
    const found = admissions.find(a => 
      a.id.toUpperCase() === query || 
      a.guardian.primaryPhone.includes(query) ||
      a.guardian.fatherCnic.includes(query)
    );

    if (found) {
      setSearchedApplication(found);
    } else {
      setSearchedApplication(null);
      setTrackError(`No application record found for "${searchTrackingId}". Please verify your Application ID (e.g. APP-2025-0819) or phone number.`);
    }
  };

  // Filtered applications for staff
  const filteredApps = admissions.filter(app => {
    const matchesFilter = adminStatusFilter === 'All' || app.status === adminStatusFilter;
    const matchesSearch = adminSearchTerm === '' || 
      app.applicantName.toLowerCase().includes(adminSearchTerm.toLowerCase()) ||
      app.id.toLowerCase().includes(adminSearchTerm.toLowerCase()) ||
      app.guardian.fatherName.toLowerCase().includes(adminSearchTerm.toLowerCase()) ||
      app.gradeApplyingFor.toLowerCase().includes(adminSearchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="relative rounded-2xl bg-gradient-to-r from-emerald-900 via-teal-950 to-slate-900 text-white p-6 sm:p-8 overflow-hidden shadow-xl border border-emerald-800/40">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30 mb-3">
            <Building2 className="w-3.5 h-3.5" />
            Admissions Open for Academic Year 2024-2025
          </span>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
            Indus Bright Future School Online Admissions Portal
          </h1>
          <p className="text-emerald-100/80 text-sm sm:text-base mt-2.5 leading-relaxed">
            Register your child at Adam Doki’s leading educational institute. Apply online, upload required documents, track application progress in real time, and access verified enrollment vouchers.
          </p>
        </div>
      </div>

      {/* Portal Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-700/60 pb-3">
        <button
          onClick={() => setActiveTab('apply')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all cursor-pointer ${
            activeTab === 'apply'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
          }`}
        >
          <UserPlus className="w-4 h-4" />
          Apply Online (Student Application)
        </button>

        <button
          onClick={() => setActiveTab('track')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all cursor-pointer ${
            activeTab === 'track'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
          }`}
        >
          <Search className="w-4 h-4" />
          Track Application Status
        </button>

        <button
          onClick={() => setActiveTab('adminReview')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all cursor-pointer ${
            activeTab === 'adminReview'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          Staff Admissions Desk
          <span className="bg-emerald-500/30 text-emerald-200 text-[11px] px-2 py-0.5 rounded-full font-bold">
            {admissions.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('eligibility')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all cursor-pointer ${
            activeTab === 'eligibility'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4" />
          Seats & Criteria Matrix
        </button>
      </div>

      {/* TAB 1: APPLY ONLINE */}
      {activeTab === 'apply' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden text-white">
          {submissionSuccess ? (
            <div className="p-8 sm:p-12 text-center max-w-xl mx-auto space-y-6">
              <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/40">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-white">Application Submitted Successfully!</h3>
                <p className="text-slate-300 text-sm">
                  Your admission registration for <strong className="text-emerald-300">{submissionSuccess.applicantName}</strong> has been logged in the Indus Bright Future School registrar database.
                </p>
              </div>

              <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-4 text-left space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between border-b border-slate-700 pb-2">
                  <span className="text-slate-400">Application Tracking ID:</span>
                  <strong className="text-emerald-400 text-base">{submissionSuccess.id}</strong>
                </div>
                <div className="flex justify-between border-b border-slate-700 pb-2">
                  <span className="text-slate-400">Grade Applied:</span>
                  <span className="text-white font-semibold">{submissionSuccess.gradeApplyingFor}</span>
                </div>
                <div className="flex justify-between border-b border-slate-700 pb-2">
                  <span className="text-slate-400">Father/Guardian:</span>
                  <span className="text-white">{submissionSuccess.guardian.fatherName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Current Status:</span>
                  <span className="bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded text-xs font-semibold">
                    {submissionSuccess.status}
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                <button
                  onClick={() => {
                    setSearchTrackingId(submissionSuccess.id);
                    setSearchedApplication(submissionSuccess);
                    setActiveTab('track');
                  }}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  Track This Application
                </button>
                <button
                  onClick={() => {
                    setSubmissionSuccess(null);
                    setFormStep(1);
                  }}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs sm:text-sm font-semibold transition-all"
                >
                  Submit Another Application
                </button>
              </div>
            </div>
          ) : (
            <div>
              {/* Stepper Navigation */}
              <div className="p-4 sm:p-6 bg-slate-950/50 border-b border-slate-800 flex items-center justify-between overflow-x-auto">
                <div className="flex items-center gap-4 sm:gap-8 min-w-max">
                  <button
                    onClick={() => setFormStep(1)}
                    className={`flex items-center gap-2 text-xs sm:text-sm font-semibold cursor-pointer ${
                      formStep === 1 ? 'text-emerald-400' : 'text-slate-400'
                    }`}
                  >
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                      formStep === 1 ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
                    }`}>1</span>
                    Student Information
                  </button>
                  <ChevronRight className="w-4 h-4 text-slate-600" />
                  <button
                    onClick={() => setFormStep(2)}
                    className={`flex items-center gap-2 text-xs sm:text-sm font-semibold cursor-pointer ${
                      formStep === 2 ? 'text-emerald-400' : 'text-slate-400'
                    }`}
                  >
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                      formStep === 2 ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
                    }`}>2</span>
                    Parents & Guardian Contact
                  </button>
                  <ChevronRight className="w-4 h-4 text-slate-600" />
                  <button
                    onClick={() => setFormStep(3)}
                    className={`flex items-center gap-2 text-xs sm:text-sm font-semibold cursor-pointer ${
                      formStep === 3 ? 'text-emerald-400' : 'text-slate-400'
                    }`}
                  >
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                      formStep === 3 ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
                    }`}>3</span>
                    Document Uploads
                  </button>
                  <ChevronRight className="w-4 h-4 text-slate-600" />
                  <button
                    onClick={() => setFormStep(4)}
                    className={`flex items-center gap-2 text-xs sm:text-sm font-semibold cursor-pointer ${
                      formStep === 4 ? 'text-emerald-400' : 'text-slate-400'
                    }`}
                  >
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                      formStep === 4 ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
                    }`}>4</span>
                    Review & Submit
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmitApplication} className="p-6 sm:p-8 space-y-6">
                {/* STEP 1: Student Details */}
                {formStep === 1 && (
                  <div className="space-y-4">
                    <h3 className="text-base font-bold text-emerald-400 flex items-center gap-2">
                      <UserPlus className="w-5 h-5" />
                      Prospective Student Profile
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Student Full Name *</label>
                        <input
                          type="text"
                          required
                          value={formData.applicantName}
                          onChange={e => setFormData({ ...formData, applicantName: e.target.value })}
                          placeholder="e.g. Asadullah Mahar"
                          className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Gender *</label>
                        <select
                          value={formData.gender}
                          onChange={e => setFormData({ ...formData, gender: e.target.value as 'Male' | 'Female' })}
                          className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Date of Birth *</label>
                        <input
                          type="date"
                          required
                          value={formData.dateOfBirth}
                          onChange={e => setFormData({ ...formData, dateOfBirth: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Grade Applying For *</label>
                        <select
                          value={formData.gradeApplyingFor}
                          onChange={e => setFormData({ ...formData, gradeApplyingFor: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500"
                        >
                          <option value="Nursery">Nursery</option>
                          <option value="Prep">Prep</option>
                          <option value="Grade 1">Grade 1</option>
                          <option value="Grade 2">Grade 2</option>
                          <option value="Grade 3">Grade 3</option>
                          <option value="Grade 4">Grade 4</option>
                          <option value="Grade 5">Grade 5</option>
                          <option value="Grade 6">Grade 6</option>
                          <option value="Grade 7">Grade 7</option>
                          <option value="Grade 8">Grade 8</option>
                          <option value="Grade 9">Grade 9 (Science / CS)</option>
                          <option value="Grade 10">Grade 10 (Science / CS)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">NADRA B-Form / Bay-Form Number *</label>
                        <input
                          type="text"
                          required
                          value={formData.bFormNumber}
                          onChange={e => setFormData({ ...formData, bFormNumber: e.target.value })}
                          placeholder="e.g. 45203-XXXXXXX-X"
                          className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Blood Group</label>
                        <select
                          value={formData.bloodGroup}
                          onChange={e => setFormData({ ...formData, bloodGroup: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500"
                        >
                          <option value="A+">A+</option>
                          <option value="A-">A-</option>
                          <option value="B+">B+</option>
                          <option value="B-">B-</option>
                          <option value="O+">O+</option>
                          <option value="O-">O-</option>
                          <option value="AB+">AB+</option>
                          <option value="AB-">AB-</option>
                        </select>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Previous School Attended</label>
                        <input
                          type="text"
                          value={formData.previousSchool}
                          onChange={e => setFormData({ ...formData, previousSchool: e.target.value })}
                          placeholder="e.g. Govt High School Adam Doki / Private Academy"
                          className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Previous Marks / Percentage (%)</label>
                        <input
                          type="number"
                          min="33"
                          max="100"
                          value={formData.previousMarksPercentage}
                          onChange={e => setFormData({ ...formData, previousMarksPercentage: Number(e.target.value) })}
                          className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          if (!formData.applicantName || !formData.dateOfBirth || !formData.bFormNumber) {
                            alert('Please fill out student full name, date of birth, and B-form number.');
                            return;
                          }
                          setFormStep(2);
                        }}
                        className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-xs sm:text-sm flex items-center gap-2"
                      >
                        Next: Guardian Details <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 2: Guardian Details */}
                {formStep === 2 && (
                  <div className="space-y-4">
                    <h3 className="text-base font-bold text-emerald-400 flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5" />
                      Parents & Guardian Contact Details
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Father Full Name *</label>
                        <input
                          type="text"
                          required
                          value={formData.fatherName}
                          onChange={e => setFormData({ ...formData, fatherName: e.target.value })}
                          placeholder="e.g. Dr. Rafique Ahmed Memon"
                          className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Father CNIC Number *</label>
                        <input
                          type="text"
                          required
                          value={formData.fatherCnic}
                          onChange={e => setFormData({ ...formData, fatherCnic: e.target.value })}
                          placeholder="e.g. 45203-1234567-1"
                          className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Father Profession / Occupation</label>
                        <input
                          type="text"
                          value={formData.fatherOccupation}
                          onChange={e => setFormData({ ...formData, fatherOccupation: e.target.value })}
                          placeholder="e.g. Govt Officer, Agriculture, Businessman"
                          className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Mother Name</label>
                        <input
                          type="text"
                          value={formData.motherName}
                          onChange={e => setFormData({ ...formData, motherName: e.target.value })}
                          placeholder="e.g. Naseem Akhtar"
                          className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Primary Phone Number (SMS Alerts) *</label>
                        <input
                          type="tel"
                          required
                          value={formData.primaryPhone}
                          onChange={e => setFormData({ ...formData, primaryPhone: e.target.value })}
                          placeholder="e.g. +92 300 1234567"
                          className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">WhatsApp Alert Number</label>
                        <input
                          type="tel"
                          value={formData.whatsappNumber}
                          onChange={e => setFormData({ ...formData, whatsappNumber: e.target.value })}
                          placeholder="e.g. +92 300 1234567"
                          className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Guardian Email Address</label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={e => setFormData({ ...formData, email: e.target.value })}
                          placeholder="e.g. guardian@example.com"
                          className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Residential Address (Adam Doki / Region) *</label>
                        <input
                          type="text"
                          required
                          value={formData.residentialAddress}
                          onChange={e => setFormData({ ...formData, residentialAddress: e.target.value })}
                          placeholder="e.g. Mohalla Qazi, Near Jamia Masjid, Adam Doki"
                          className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>

                    <div className="pt-4 flex justify-between">
                      <button
                        type="button"
                        onClick={() => setFormStep(1)}
                        className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-xs sm:text-sm"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (!formData.fatherName || !formData.fatherCnic || !formData.primaryPhone || !formData.residentialAddress) {
                            alert('Please fill out father name, CNIC, phone number, and residential address.');
                            return;
                          }
                          setFormStep(3);
                        }}
                        className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-xs sm:text-sm flex items-center gap-2"
                      >
                        Next: Upload Documents <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 3: Document Uploads */}
                {formStep === 3 && (
                  <div className="space-y-5">
                    <div>
                      <h3 className="text-base font-bold text-emerald-400 flex items-center gap-2">
                        <Upload className="w-5 h-5" />
                        Required Document Uploads
                      </h3>
                      <p className="text-slate-400 text-xs mt-1">
                        Please upload clear scanned copies or smartphone photos. Supported formats: JPG, PNG, PDF (Max 5MB per file).
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Doc 1: Photo */}
                      <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-white text-xs sm:text-sm">1. Student Passport Photograph</h4>
                            {uploadedDocs.photo ? (
                              <span className="text-emerald-400 text-xs font-semibold flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Uploaded
                              </span>
                            ) : (
                              <span className="text-amber-400 text-xs">Required</span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400 mt-1">Recent blue or white background passport size photo</p>
                        </div>
                        <div className="mt-3 flex items-center gap-2">
                          <label className="cursor-pointer px-3 py-1.5 bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/40 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors">
                            <Upload className="w-3.5 h-3.5" />
                            {uploadedDocs.photo ? 'Change File' : 'Select Photo'}
                            <input 
                              type="file" 
                              accept="image/*" 
                              className="hidden" 
                              onChange={e => e.target.files?.[0] && handleDocUpload('photo', e.target.files[0])} 
                            />
                          </label>
                          {uploadedDocs.photo && (
                            <span className="text-xs text-slate-300 truncate max-w-[180px]">
                              {uploadedDocs.photo.fileName}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Doc 2: B-Form */}
                      <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-white text-xs sm:text-sm">2. NADRA B-Form / Birth Certificate</h4>
                            {uploadedDocs.bForm ? (
                              <span className="text-emerald-400 text-xs font-semibold flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Uploaded
                              </span>
                            ) : (
                              <span className="text-amber-400 text-xs">Required</span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400 mt-1">Official computerized NADRA registration certificate</p>
                        </div>
                        <div className="mt-3 flex items-center gap-2">
                          <label className="cursor-pointer px-3 py-1.5 bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/40 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors">
                            <Upload className="w-3.5 h-3.5" />
                            {uploadedDocs.bForm ? 'Change File' : 'Select File'}
                            <input 
                              type="file" 
                              accept="image/*,.pdf" 
                              className="hidden" 
                              onChange={e => e.target.files?.[0] && handleDocUpload('bForm', e.target.files[0])} 
                            />
                          </label>
                          {uploadedDocs.bForm && (
                            <span className="text-xs text-slate-300 truncate max-w-[180px]">
                              {uploadedDocs.bForm.fileName}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Doc 3: Father CNIC */}
                      <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-white text-xs sm:text-sm">3. Father / Guardian CNIC Card</h4>
                            {uploadedDocs.fatherCnic ? (
                              <span className="text-emerald-400 text-xs font-semibold flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Uploaded
                              </span>
                            ) : (
                              <span className="text-amber-400 text-xs">Required</span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400 mt-1">Clear copy of computerized National Identity Card</p>
                        </div>
                        <div className="mt-3 flex items-center gap-2">
                          <label className="cursor-pointer px-3 py-1.5 bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/40 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors">
                            <Upload className="w-3.5 h-3.5" />
                            {uploadedDocs.fatherCnic ? 'Change File' : 'Select File'}
                            <input 
                              type="file" 
                              accept="image/*,.pdf" 
                              className="hidden" 
                              onChange={e => e.target.files?.[0] && handleDocUpload('fatherCnic', e.target.files[0])} 
                            />
                          </label>
                          {uploadedDocs.fatherCnic && (
                            <span className="text-xs text-slate-300 truncate max-w-[180px]">
                              {uploadedDocs.fatherCnic.fileName}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Doc 4: Marksheet */}
                      <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-white text-xs sm:text-sm">4. Previous School Marksheet / SLC</h4>
                            {uploadedDocs.marksheet ? (
                              <span className="text-emerald-400 text-xs font-semibold flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Uploaded
                              </span>
                            ) : (
                              <span className="text-slate-400 text-xs">Optional for Nursery</span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400 mt-1">Latest academic progress report or School Leaving Certificate</p>
                        </div>
                        <div className="mt-3 flex items-center gap-2">
                          <label className="cursor-pointer px-3 py-1.5 bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/40 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors">
                            <Upload className="w-3.5 h-3.5" />
                            {uploadedDocs.marksheet ? 'Change File' : 'Select File'}
                            <input 
                              type="file" 
                              accept="image/*,.pdf" 
                              className="hidden" 
                              onChange={e => e.target.files?.[0] && handleDocUpload('marksheet', e.target.files[0])} 
                            />
                          </label>
                          {uploadedDocs.marksheet && (
                            <span className="text-xs text-slate-300 truncate max-w-[180px]">
                              {uploadedDocs.marksheet.fileName}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 flex justify-between">
                      <button
                        type="button"
                        onClick={() => setFormStep(2)}
                        className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-xs sm:text-sm"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormStep(4)}
                        className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-xs sm:text-sm flex items-center gap-2"
                      >
                        Next: Review & Submit <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 4: Review & Submit */}
                {formStep === 4 && (
                  <div className="space-y-6">
                    <h3 className="text-base font-bold text-emerald-400 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5" />
                      Final Review of Admission Application
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
                      <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 space-y-2">
                        <h4 className="font-bold text-slate-200 border-b border-slate-700 pb-1.5">Student Details</h4>
                        <p><span className="text-slate-400">Name:</span> <strong>{formData.applicantName || 'Not entered'}</strong></p>
                        <p><span className="text-slate-400">Grade:</span> {formData.gradeApplyingFor}</p>
                        <p><span className="text-slate-400">Gender:</span> {formData.gender}</p>
                        <p><span className="text-slate-400">Date of Birth:</span> {formData.dateOfBirth}</p>
                        <p><span className="text-slate-400">B-Form:</span> {formData.bFormNumber}</p>
                        <p><span className="text-slate-400">Previous School:</span> {formData.previousSchool || 'N/A'}</p>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 space-y-2">
                        <h4 className="font-bold text-slate-200 border-b border-slate-700 pb-1.5">Guardian Contact</h4>
                        <p><span className="text-slate-400">Father Name:</span> <strong>{formData.fatherName || 'Not entered'}</strong></p>
                        <p><span className="text-slate-400">Father CNIC:</span> {formData.fatherCnic}</p>
                        <p><span className="text-slate-400">Phone:</span> {formData.primaryPhone}</p>
                        <p><span className="text-slate-400">WhatsApp:</span> {formData.whatsappNumber || formData.primaryPhone}</p>
                        <p><span className="text-slate-400">Address:</span> {formData.residentialAddress}</p>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-800/50 text-xs text-emerald-200 flex items-start gap-2.5">
                      <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                      <p>
                        <strong>Declaration:</strong> I hereby certify that all information provided above is true and authentic according to NADRA records. I agree to abide by the academic rules and code of conduct of Indus Bright Future School Adam Doki.
                      </p>
                    </div>

                    <div className="pt-4 flex justify-between">
                      <button
                        type="button"
                        onClick={() => setFormStep(3)}
                        className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-xs sm:text-sm"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl text-sm shadow-lg shadow-emerald-950 flex items-center gap-2 cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Confirm & Submit Application
                      </button>
                    </div>
                  </div>
                )}
              </form>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: TRACK STATUS */}
      {activeTab === 'track' && (
        <div className="space-y-6">
          {/* Tracking Search Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl text-white">
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <Search className="w-5 h-5 text-emerald-400" />
              Check Admission Application Status
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm mb-4">
              Enter the unique Application ID issued upon submission (e.g., <span className="text-emerald-400 font-mono">APP-2025-0819</span>) or Father’s Mobile / CNIC number:
            </p>

            <form onSubmit={handleTrackSearch} className="flex flex-col sm:flex-row gap-3 max-w-2xl">
              <input
                type="text"
                required
                value={searchTrackingId}
                onChange={e => setSearchTrackingId(e.target.value)}
                placeholder="Enter Application ID (e.g. APP-2025-0819) or Phone Number"
                className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <Search className="w-4 h-4" />
                Track Status
              </button>
            </form>

            {trackError && (
              <div className="mt-4 p-3.5 bg-rose-950/40 border border-rose-800/60 rounded-xl text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                {trackError}
              </div>
            )}
          </div>

          {/* Searched Result Details */}
          {searchedApplication && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl text-white space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-400">APPLICATION ID:</span>
                    <span className="font-mono text-emerald-400 font-bold text-base">{searchedApplication.id}</span>
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                      searchedApplication.status === 'Approved' ? 'bg-emerald-950 text-emerald-300 border-emerald-700' :
                      searchedApplication.status === 'Enrolled' ? 'bg-sky-950 text-sky-300 border-sky-700' :
                      searchedApplication.status === 'Interview Scheduled' ? 'bg-purple-950 text-purple-300 border-purple-700' :
                      'bg-amber-950 text-amber-300 border-amber-700'
                    }`}>
                      {searchedApplication.status}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mt-1">{searchedApplication.applicantName}</h3>
                  <p className="text-xs text-slate-400">
                    Applying for: <strong className="text-slate-200">{searchedApplication.gradeApplyingFor}</strong> • Submitted on {searchedApplication.submissionDate}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs rounded-xl font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    Print Application Slip
                  </button>
                </div>
              </div>

              {/* Progress Timeline */}
              <div>
                <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-4">Admissions Stage Tracker</h4>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-xl bg-slate-800/80 border border-emerald-600/50">
                    <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold mb-1">
                      <CheckCircle2 className="w-4 h-4" /> 1. Submitted
                    </div>
                    <p className="text-[11px] text-slate-300">Registration received online with bio-data</p>
                  </div>

                  <div className={`p-3.5 rounded-xl border ${
                    searchedApplication.status !== 'Under Review' ? 'bg-slate-800/80 border-emerald-600/50 text-emerald-400' : 'bg-amber-950/30 border-amber-700 text-amber-300'
                  }`}>
                    <div className="flex items-center gap-2 text-xs font-bold mb-1">
                      {searchedApplication.status !== 'Under Review' ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                      2. Document Audit
                    </div>
                    <p className="text-[11px] text-slate-300">B-Form & Marksheet verification by Registrar</p>
                  </div>

                  <div className={`p-3.5 rounded-xl border ${
                    searchedApplication.interviewDate || searchedApplication.status === 'Approved' || searchedApplication.status === 'Enrolled'
                      ? 'bg-slate-800/80 border-emerald-600/50 text-emerald-400' 
                      : 'bg-slate-800/40 border-slate-700 text-slate-500'
                  }`}>
                    <div className="flex items-center gap-2 text-xs font-bold mb-1">
                      <Calendar className="w-4 h-4" /> 3. Assessment / Interview
                    </div>
                    <p className="text-[11px] text-slate-300">
                      {searchedApplication.interviewDate ? searchedApplication.interviewDate : 'Pending evaluation'}
                    </p>
                  </div>

                  <div className={`p-3.5 rounded-xl border ${
                    searchedApplication.status === 'Enrolled' 
                      ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300' 
                      : searchedApplication.status === 'Approved'
                        ? 'bg-sky-950/30 border-sky-600 text-sky-300'
                        : 'bg-slate-800/40 border-slate-700 text-slate-500'
                  }`}>
                    <div className="flex items-center gap-2 text-xs font-bold mb-1">
                      <UserCheck className="w-4 h-4" /> 4. Final Enrollment
                    </div>
                    <p className="text-[11px] text-slate-300">
                      {searchedApplication.assignedStudentId ? `Student ID: ${searchedApplication.assignedStudentId}` : 'Awaiting confirmation'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Assessment Venue Notice if scheduled */}
              {searchedApplication.interviewDate && (
                <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-800/60 flex items-start gap-3 text-xs sm:text-sm">
                  <Calendar className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-purple-200">Scheduled Interview & Entrance Assessment</h5>
                    <p className="text-purple-300/90 mt-0.5">
                      Date & Time: <strong className="text-white">{searchedApplication.interviewDate}</strong>
                    </p>
                    <p className="text-purple-300/80 mt-0.5">
                      Venue: {searchedApplication.interviewVenue || 'Principal Academic Block, Adam Doki Campus'}
                    </p>
                    <p className="text-[11px] text-purple-400 mt-1">
                      * Please bring original NADRA B-Form and Father's original CNIC card.
                    </p>
                  </div>
                </div>
              )}

              {/* Details Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
                <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/80 space-y-2">
                  <h4 className="font-bold text-slate-200 border-b border-slate-700 pb-1">Applicant Data</h4>
                  <div className="flex justify-between"><span className="text-slate-400">Date of Birth:</span> <span>{searchedApplication.dateOfBirth}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">B-Form No:</span> <span className="font-mono">{searchedApplication.bFormNumber}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Blood Group:</span> <span>{searchedApplication.bloodGroup}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Previous School:</span> <span>{searchedApplication.previousSchool}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Previous Marks:</span> <span className="text-emerald-400 font-bold">{searchedApplication.previousMarksPercentage}%</span></div>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/80 space-y-2">
                  <h4 className="font-bold text-slate-200 border-b border-slate-700 pb-1">Parents Contact</h4>
                  <div className="flex justify-between"><span className="text-slate-400">Father Name:</span> <span>{searchedApplication.guardian.fatherName}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Father CNIC:</span> <span className="font-mono">{searchedApplication.guardian.fatherCnic}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Primary Phone:</span> <span>{searchedApplication.guardian.primaryPhone}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">WhatsApp Alerts:</span> <span>{searchedApplication.guardian.whatsappNumber}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Address:</span> <span>{searchedApplication.guardian.residentialAddress}</span></div>
                </div>
              </div>

              {/* Uploaded Documents List */}
              <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700">
                <h4 className="font-bold text-xs uppercase text-slate-400 tracking-wider mb-2">Submitted Supporting Documents</h4>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(searchedApplication.documents).map(([key, doc]) => doc && (
                    <div key={key} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs">
                      <FileText className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-slate-200 font-medium">{doc.name}</span>
                      <span className="text-[10px] text-slate-400">({doc.fileSize})</span>
                      {doc.verified && (
                        <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-950 px-1.5 py-0.2 rounded border border-emerald-800">
                          Verified
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: STAFF ADMISSIONS DESK */}
      {activeTab === 'adminReview' && (
        <div className="space-y-6">
          {/* Action & Filter Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 text-white">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                Admissions Registrar & Enrollment Management
              </h3>
              <p className="text-xs text-slate-400">
                Review prospective student applications, verify credentials, schedule assessments, and enroll into school records.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search applicant or ID..."
                  value={adminSearchTerm}
                  onChange={e => setAdminSearchTerm(e.target.value)}
                  className="pl-9 pr-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <select
                value={adminStatusFilter}
                onChange={e => setAdminStatusFilter(e.target.value)}
                className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="All">All Statuses</option>
                <option value="Under Review">Under Review</option>
                <option value="Interview Scheduled">Interview Scheduled</option>
                <option value="Approved">Approved</option>
                <option value="Enrolled">Enrolled</option>
              </select>
            </div>
          </div>

          {/* Applications Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden text-white">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-semibold uppercase text-[11px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4">App ID</th>
                    <th className="py-3 px-4">Applicant Student</th>
                    <th className="py-3 px-4">Grade</th>
                    <th className="py-3 px-4">Guardian & Contact</th>
                    <th className="py-3 px-4">Prev. %</th>
                    <th className="py-3 px-4">Documents</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/70">
                  {filteredApps.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 font-mono text-emerald-400 font-semibold text-xs">
                        {app.id}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-white">{app.applicantName}</div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                          <span>{app.gender}</span> • <span>DOB: {app.dateOfBirth}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="bg-slate-800 px-2 py-0.5 rounded text-xs text-slate-300 font-medium">
                          {app.gradeApplyingFor}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-slate-200">{app.guardian.fatherName}</div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1">
                          <Phone className="w-3 h-3 text-sky-400" />
                          {app.guardian.primaryPhone}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-semibold text-emerald-400">
                        {app.previousMarksPercentage}%
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-xs text-slate-300 bg-slate-800 px-2 py-0.5 rounded">
                          {Object.keys(app.documents).length} uploaded
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                          app.status === 'Enrolled' ? 'bg-sky-950 text-sky-300 border-sky-700' :
                          app.status === 'Approved' ? 'bg-emerald-950 text-emerald-300 border-emerald-700' :
                          app.status === 'Interview Scheduled' ? 'bg-purple-950 text-purple-300 border-purple-700' :
                          'bg-amber-950 text-amber-300 border-amber-700'
                        }`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedAppForModal(app);
                            setEnrollRollNo(`${app.gradeApplyingFor.replace('Grade ', '').padStart(2, '0')}-${Math.floor(10 + Math.random() * 40)}`);
                            setInterviewDateInput(app.interviewDate || '2024-10-12 at 10:00 AM');
                          }}
                          className="px-3 py-1.5 bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/40 rounded-lg text-xs font-semibold flex items-center gap-1 ml-auto cursor-pointer transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Review & Enroll
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredApps.length === 0 && (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-500 text-xs">
                        No admissions applications matching this criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SEATS & ELIGIBILITY */}
      {activeTab === 'eligibility' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl text-white space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-xl font-bold text-white">Class Capacities, Age Matrix & Fee Structure (2024-25)</h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              General admissions guidelines, age requirements, and fee schedules approved by the Board of Governors for Indus Bright Future School.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 space-y-3">
              <h4 className="font-bold text-emerald-400 text-sm flex items-center gap-2">
                <Building2 className="w-4 h-4" /> Primary Wing (Nursery - Grade 5)
              </h4>
              <ul className="text-xs text-slate-300 space-y-2">
                <li>• <strong>Nursery / Prep:</strong> Age 3.5 - 5 Years (Montessori method)</li>
                <li>• <strong>Grade 1 to 5:</strong> Age 6 - 10 Years</li>
                <li>• <strong>Monthly Tuition Fee:</strong> PKR 3,500 - 4,000</li>
                <li>• <strong>Class Strength:</strong> Max 25 students per section</li>
                <li>• <strong>Focus:</strong> Literacy, Numeracy, Urdu/Sindhi, Morals</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 space-y-3">
              <h4 className="font-bold text-sky-400 text-sm flex items-center gap-2">
                <Building2 className="w-4 h-4" /> Middle School (Grade 6 - Grade 8)
              </h4>
              <ul className="text-xs text-slate-300 space-y-2">
                <li>• <strong>Eligibility:</strong> Passing certificate of Grade 5</li>
                <li>• <strong>Monthly Tuition Fee:</strong> PKR 4,000 - 4,200</li>
                <li>• <strong>Special Facilities:</strong> Science Labs, Computer Coding</li>
                <li>• <strong>Languages:</strong> English, Sindhi, Urdu, Arabic basics</li>
                <li>• <strong>Seats Available:</strong> 12 seats remaining</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 space-y-3">
              <h4 className="font-bold text-purple-400 text-sm flex items-center gap-2">
                <Building2 className="w-4 h-4" /> Matric Secondary Wing (Grade 9 & 10)
              </h4>
              <ul className="text-xs text-slate-300 space-y-2">
                <li>• <strong>Streams:</strong> Science (Biology / Computer Science)</li>
                <li>• <strong>Monthly Tuition Fee:</strong> PKR 4,500</li>
                <li>• <strong>Board Affiliation:</strong> BISE Board with Board Exam preparation</li>
                <li>• <strong>Merit Scholarships:</strong> 50% waiver for &gt;85% scorers</li>
                <li>• <strong>Seats Available:</strong> 8 seats remaining in Science stream</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Review & Enroll Action Modal for Admin */}
      {selectedAppForModal && (
        <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-white animate-in fade-in zoom-in duration-150">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900">
              <div>
                <h3 className="font-bold text-base text-white">Application Review & Enrollment Action</h3>
                <p className="text-xs text-slate-400">Application ID: {selectedAppForModal.id}</p>
              </div>
              <button
                onClick={() => setSelectedAppForModal(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5 text-xs sm:text-sm">
              <div className="flex items-center gap-4 bg-slate-800/60 p-4 rounded-xl border border-slate-700">
                <div className="w-14 h-14 rounded-full bg-slate-700 overflow-hidden shrink-0 border-2 border-emerald-500/50">
                  <img 
                    src={selectedAppForModal.documents.photo?.fileUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'} 
                    alt={selectedAppForModal.applicantName} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-white text-base">{selectedAppForModal.applicantName}</h4>
                  <p className="text-slate-300">Applying for: <strong className="text-emerald-400">{selectedAppForModal.gradeApplyingFor}</strong></p>
                  <p className="text-slate-400 text-xs">Father: {selectedAppForModal.guardian.fatherName} • {selectedAppForModal.guardian.primaryPhone}</p>
                </div>
              </div>

              {/* Action 1: Schedule Interview */}
              <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700 space-y-3">
                <h4 className="font-bold text-purple-300 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" /> Action 1: Schedule Assessment Interview
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Interview Date & Time</label>
                    <input
                      type="text"
                      value={interviewDateInput}
                      onChange={e => setInterviewDateInput(e.target.value)}
                      placeholder="e.g. 2024-10-15 at 10:00 AM"
                      className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Venue</label>
                    <input
                      type="text"
                      value={interviewVenueInput}
                      onChange={e => setInterviewVenueInput(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-xs"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const updated = {
                      ...selectedAppForModal,
                      status: 'Interview Scheduled' as const,
                      interviewDate: interviewDateInput,
                      interviewVenue: interviewVenueInput,
                    };
                    onUpdateAdmission(updated);
                    setSelectedAppForModal(updated);
                    alert(`Interview scheduled for ${selectedAppForModal.applicantName}. An SMS alert has been dispatched to ${selectedAppForModal.guardian.primaryPhone}.`);
                  }}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-semibold transition-colors"
                >
                  Save & Notify Guardian
                </button>
              </div>

              {/* Action 2: Formal Enrollment & Student ID Generation */}
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-800/50 space-y-3">
                <h4 className="font-bold text-emerald-300 flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4" /> Action 2: Approve & Convert to Enrolled Student
                </h4>
                <p className="text-xs text-slate-300">
                  This will generate an official permanent Student Registration ID (<span className="text-emerald-400 font-mono">IBFS-2024-XXXX</span>), register them in the grade roster, and grant parent portal access.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Assign Class Roll Number</label>
                    <input
                      type="text"
                      value={enrollRollNo}
                      onChange={e => setEnrollRollNo(e.target.value)}
                      placeholder="e.g. 09-25"
                      className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Section</label>
                    <select
                      value={enrollSection}
                      onChange={e => setEnrollSection(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-xs"
                    >
                      <option value="A">Section A</option>
                      <option value="B">Section B</option>
                    </select>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onConvertToStudent(selectedAppForModal.id, enrollRollNo, enrollSection);
                    setSelectedAppForModal(null);
                    alert(`Congratulations! ${selectedAppForModal.applicantName} is now officially registered as an active student.`);
                  }}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all shadow-md shadow-emerald-950"
                >
                  Confirm Enrollment & Issue Student ID
                </button>
              </div>
            </div>

            <div className="p-4 border-t border-slate-800 bg-slate-900 flex justify-end">
              <button
                onClick={() => setSelectedAppForModal(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
