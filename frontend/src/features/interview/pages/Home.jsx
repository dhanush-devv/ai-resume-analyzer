import React, { useState, useRef } from 'react'
import "../style/home.scss"
import { useInterview } from '../hooks/useInterview.js'
import { useNavigate } from 'react-router'
import Navbar from '../../../components/Navbar'

const Home = () => {
    const { loading, generateReport, reports } = useInterview()
    const [ jobDescription, setJobDescription ] = useState("")
    const [ selfDescription, setSelfDescription ] = useState("")
    const [ resumeFile, setResumeFile ] = useState(null)
    const resumeInputRef = useRef()

    const navigate = useNavigate()

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setResumeFile(e.target.files[0])
        }
    }

    const handleClearFile = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setResumeFile(null)
        if (resumeInputRef.current) {
            resumeInputRef.current.value = ""
        }
    }

    const handleLoadExample = () => {
        setJobDescription(
            "Senior Frontend Engineer (React)\n\nWe are looking for a Senior React Developer with:\n- 4+ years of professional experience with React, JavaScript, and CSS\n- High proficiency in TypeScript and State Management (Redux/Zustand)\n- Experience optimizing client performance and building reusable design system components\n- Solid understanding of CI/CD, Git workflows, and Jest/React Testing Library"
        )
        setSelfDescription(
            "Frontend Engineer with 4 years of experience building scalable web applications. Proficient in React, TypeScript, and modern CSS-in-JS. Dedicated to clean codebase practices, building component libraries, and optimizing performance. Looking for a high-impact senior frontend role."
        )
    }

    const handleGenerateReport = async () => {
        if (!resumeFile && !selfDescription.trim()) {
            alert("Please upload a resume or provide a quick self-description to generate a strategy.")
            return
        }
        if (!jobDescription.trim()) {
            alert("Please provide a target job description.")
            return
        }

        const data = await generateReport({ jobDescription, selfDescription, resumeFile })
        if (data && data._id) {
            navigate(`/interview/${data._id}`)
        }
    }

    if (loading) {
        return (
            <div className='loading-screen'>
                <div className='loader-container'>
                    <div className='spinner'></div>
                    <h2>Structuring Your Strategic Interview Plan...</h2>
                    <p>Our AI is analyzing the job description, cross-referencing your profile, identifying gaps, and curating your custom preparation program. This usually takes around 20–30 seconds.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="home-wrapper">
            <Navbar />
            
            <div className='home-page'>
                {/* Page Header */}
                <header className='page-header'>
                    <div className="badge-promo">AI-Powered Prep Partner</div>
                    <h1>Forge Your Winning <span className='highlight'>Interview Strategy</span></h1>
                    <p>Align your resume with any target job description. Get custom questions, gap analyses, and a personalized timeline.</p>
                    
                    <button type="button" onClick={handleLoadExample} className="try-example-link">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '0.4rem'}}><polygon points="5 3 19 12 5 21 5 3"/></svg>
                        Try with Example Template
                    </button>
                </header>

                {/* Steps Section */}
                <section className="steps-section">
                    <div className="step-card">
                        <span className="step-number">01</span>
                        <div className="step-content">
                            <h3>Paste Target Job</h3>
                            <p>Copy details of the role you're applying for.</p>
                        </div>
                    </div>
                    <div className="step-arrow">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                    </div>
                    <div className="step-card">
                        <span className="step-number">02</span>
                        <div className="step-content">
                            <h3>Provide Profile</h3>
                            <p>Upload a resume or write a quick summary.</p>
                        </div>
                    </div>
                    <div className="step-arrow">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                    </div>
                    <div className="step-card">
                        <span className="step-number">03</span>
                        <div className="step-content">
                            <h3>Get AI Strategy</h3>
                            <p>Unlock custom prep guides and milestones.</p>
                        </div>
                    </div>
                </section>

                {/* Main Card */}
                <div className='interview-card'>
                    <div className='interview-card__body'>

                        {/* Left Panel - Job Description */}
                        <div className='panel panel--left'>
                            <div className='panel__header'>
                                <span className='panel__icon'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
                                </span>
                                <h2>Target Job Description</h2>
                                <span className='badge badge--required'>Required</span>
                            </div>
                            <textarea
                                value={jobDescription}
                                onChange={(e) => { setJobDescription(e.target.value) }}
                                className='panel__textarea'
                                placeholder={`Paste the full job description here...\ne.g. 'Senior Frontend Engineer at Google. Requires proficiency in React, TypeScript, state management, and large-scale system design...'`}
                                maxLength={5000}
                            />
                            <div className='char-counter'>{jobDescription.length} / 5000 chars</div>
                        </div>

                        {/* Vertical Divider */}
                        <div className='panel-divider' />

                        {/* Right Panel - Profile */}
                        <div className='panel panel--right'>
                            <div className='panel__header'>
                                <span className='panel__icon'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                                </span>
                                <h2>Your Profile</h2>
                            </div>

                            {/* Upload Resume */}
                            <div className='upload-section'>
                                <label className='section-label'>
                                    Upload Resume
                                    <span className='badge badge--best'>Best Results</span>
                                </label>
                                
                                {resumeFile ? (
                                    <div className="selected-file-card">
                                        <div className="file-info">
                                            <svg className="file-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                                                <polyline points="14 2 14 8 20 8" />
                                            </svg>
                                            <div className="file-details">
                                                <p className="file-name">{resumeFile.name}</p>
                                                <p className="file-size">{(resumeFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                                            </div>
                                        </div>
                                        <button type="button" onClick={handleClearFile} className="clear-file-btn" title="Remove file">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="clear-icon">
                                                <line x1="18" y1="6" x2="6" y2="18" />
                                                <line x1="6" y1="6" x2="18" y2="18" />
                                            </svg>
                                        </button>
                                    </div>
                                ) : (
                                    <label className='dropzone' htmlFor='resume'>
                                        <span className='dropzone__icon'>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" /><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" /></svg>
                                        </span>
                                        <p className='dropzone__title'>Click to upload or drag &amp; drop</p>
                                        <p className='dropzone__subtitle'>PDF or DOCX (Max 5MB)</p>
                                        <input ref={resumeInputRef} onChange={handleFileChange} hidden type='file' id='resume' name='resume' accept='.pdf,.docx' />
                                    </label>
                                )}
                            </div>

                            {/* OR Divider */}
                            <div className='or-divider'><span>OR</span></div>

                            {/* Quick Self-Description */}
                            <div className='self-description'>
                                <label className='section-label' htmlFor='selfDescription'>Quick Self-Description</label>
                                <textarea
                                    value={selfDescription}
                                    onChange={(e) => { setSelfDescription(e.target.value) }}
                                    id='selfDescription'
                                    name='selfDescription'
                                    className='panel__textarea panel__textarea--short'
                                    placeholder="Describe your background, skills, and experience if you don't have a resume file..."
                                />
                            </div>

                            {/* Info Box */}
                            <div className='info-box'>
                                <span className='info-box__icon'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
                                </span>
                                <p>Provide either a <strong>Resume</strong> or <strong>Self Description</strong> to start generating your custom strategy.</p>
                            </div>
                        </div>
                    </div>

                    {/* Card Footer */}
                    <div className='interview-card__footer'>
                        <span className='footer-info'>AI-Powered Analysis &bull; ~30 seconds</span>
                        <button
                            onClick={handleGenerateReport}
                            className='generate-btn'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '0.4rem'}}><polygon points="12 2 2 22 22 22 12 2"/><line x1="12" y1="9" x2="12" y2="17"/></svg>
                            Generate My Strategy
                        </button>
                    </div>
                </div>

                {/* Recent Reports List */}
                {reports.length > 0 ? (
                    <section className='recent-reports'>
                        <h2>Your Active Strategy Programs</h2>
                        <ul className='reports-list'>
                            {reports.map(report => (
                                <li key={report._id} className='report-item' onClick={() => navigate(`/interview/${report._id}`)}>
                                    <div className="report-card-header">
                                        <h3 className="report-title">{report.title || 'Target Role Strategy'}</h3>
                                    </div>
                                    <div className="report-card-body">
                                        <p className='report-meta'>Analyzed {new Date(report.createdAt).toLocaleDateString()}</p>
                                        <div className={`match-score ${report.matchScore >= 80 ? 'score--high' : report.matchScore >= 60 ? 'score--mid' : 'score--low'}`}>
                                            Match: {report.matchScore}%
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </section>
                ) : (
                    <div className="recent-reports-empty">
                        <svg className="empty-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                            <line x1="8" y1="21" x2="16" y2="21"/>
                            <line x1="12" y1="17" x2="12" y2="21"/>
                        </svg>
                        <h3>No strategies generated yet</h3>
                        <p>Fill out the forms above to create your first target interview strategy.</p>
                    </div>
                )}

                {/* Page Footer */}
                <footer className='page-footer'>
                    <a href='#'>Privacy Policy</a>
                    <a href='#'>Terms of Service</a>
                    <a href='#'>Help Center</a>
                </footer>
            </div>
        </div>
    )
}

export default Home