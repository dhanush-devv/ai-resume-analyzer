import React, { useState, useEffect, useRef } from 'react'
import '../style/interview.scss'
import { useInterview } from '../hooks/useInterview.js'
import { useNavigate, useParams } from 'react-router'
import Navbar from '../../../components/Navbar'

const NAV_ITEMS = [
    { id: 'technical', label: 'Technical Questions', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>) },
    { id: 'behavioral', label: 'Behavioral Questions', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>) },
    { id: 'roadmap', label: 'Road Map', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11" /></svg>) },
]

// ── Sub-components ────────────────────────────────────────────────────────────
const QuestionCard = ({ item, index }) => {
    const [ open, setOpen ] = useState(false)
    const [ copiedQuestion, setCopiedQuestion ] = useState(false)
    const [ copiedAnswer, setCopiedAnswer ] = useState(false)

    const copyToClipboard = (text, type) => {
        navigator.clipboard.writeText(text)
        if (type === 'q') {
            setCopiedQuestion(true)
            setTimeout(() => setCopiedQuestion(false), 1500)
        } else {
            setCopiedAnswer(true)
            setTimeout(() => setCopiedAnswer(false), 1500)
        }
    }

    return (
        <div className={`q-card ${open ? 'q-card--open' : ''}`}>
            <div className='q-card__header' onClick={() => setOpen(o => !o)}>
                <span className='q-card__index'>Q{index + 1}</span>
                <p className='q-card__question'>{item.question}</p>
                <div className='q-card__actions'>
                    <button 
                        type="button" 
                        className="copy-btn-icon" 
                        title="Copy Question" 
                        onClick={(e) => {
                            e.stopPropagation()
                            copyToClipboard(item.question, 'q')
                        }}
                    >
                        {copiedQuestion ? (
                            <span className="copied-toast">Copied!</span>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                            </svg>
                        )}
                    </button>
                    <span className={`q-card__chevron ${open ? 'q-card__chevron--open' : ''}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                    </span>
                </div>
            </div>
            {open && (
                <div className='q-card__body'>
                    <div className='q-card__section'>
                        <span className='q-card__tag q-card__tag--intention'>Evaluation Intent</span>
                        <p>{item.intention}</p>
                    </div>
                    <div className='q-card__section'>
                        <div className="section-header-row">
                            <span className='q-card__tag q-card__tag--answer'>Key Talking Points &amp; Answer</span>
                            <button 
                                type="button" 
                                className="copy-text-btn" 
                                onClick={() => copyToClipboard(item.answer, 'a')}
                            >
                                {copiedAnswer ? 'Copied Model Answer!' : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                                        </svg>
                                        Copy Answer
                                    </>
                                )}
                            </button>
                        </div>
                        <p className="answer-text">{item.answer}</p>
                    </div>
                </div>
            )}
        </div>
    )
}

const RoadMapDay = ({ day, dayIndex, checkedTasks, onToggleTask }) => (
    <div className='roadmap-day'>
        <div className='roadmap-day__header'>
            <span className='roadmap-day__badge'>Day {day.day}</span>
            <h3 className='roadmap-day__focus'>{day.focus}</h3>
        </div>
        <ul className='roadmap-day__tasks'>
            {day.tasks.map((task, i) => {
                const isChecked = !!checkedTasks[`${dayIndex}-${i}`]
                return (
                    <li 
                        key={i} 
                        className={`roadmap-task-item ${isChecked ? 'completed' : ''}`}
                        onClick={() => onToggleTask(dayIndex, i)}
                    >
                        <span className={`roadmap-task-checkbox ${isChecked ? 'checked' : ''}`}>
                            {isChecked && (
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="check-svg">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                            )}
                        </span>
                        <span className="roadmap-task-text">{task}</span>
                    </li>
                )
            })}
        </ul>
    </div>
)

// ── Main Component ────────────────────────────────────────────────────────────
const Interview = () => {
    const [ activeNav, setActiveNav ] = useState('technical')
    const { report, getReportById, loading, getResumePdf } = useInterview()
    const { interviewId } = useParams()
    const navigate = useNavigate()

    const [checkedTasks, setCheckedTasks] = useState({})
    const contentRef = useRef(null)

    // Load persistent checklist state for this report
    useEffect(() => {
        if (interviewId) {
            const saved = localStorage.getItem(`prep_tasks_${interviewId}`)
            if (saved) {
                try {
                    setCheckedTasks(JSON.parse(saved))
                } catch (e) {
                    console.error("Failed to parse checklist", e)
                }
            } else {
                setCheckedTasks({})
            }
        }
    }, [interviewId])

    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId)
        }
    }, [ interviewId ])

    // Scroll back to top on tab change so roadmap or long lists don't start scrolled down
    useEffect(() => {
        if (contentRef.current) {
            contentRef.current.scrollTop = 0
            // Fallbacks to handle asynchronous rendering/painting across layout updates
            const t1 = setTimeout(() => {
                if (contentRef.current) contentRef.current.scrollTop = 0
            }, 0)
            const t2 = setTimeout(() => {
                if (contentRef.current) contentRef.current.scrollTop = 0
            }, 50)
            const t3 = setTimeout(() => {
                if (contentRef.current) contentRef.current.scrollTop = 0
            }, 150)
            return () => {
                clearTimeout(t1)
                clearTimeout(t2)
                clearTimeout(t3)
            }
        }
    }, [ activeNav, report ])

    const toggleTask = (dayIndex, taskIndex) => {
        const key = `${dayIndex}-${taskIndex}`
        const updated = { ...checkedTasks, [key]: !checkedTasks[key] }
        setCheckedTasks(updated)
        localStorage.setItem(`prep_tasks_${interviewId}`, JSON.stringify(updated))
    }

    if (loading || !report) {
        return (
            <div className='loading-screen'>
                <div className='loader-container'>
                    <div className='spinner'></div>
                    <h2>Fetching Your Strategy Program...</h2>
                    <p>Preparing the customized breakdown of interview modules, ATS alignment match ratings, and timeline tracker.</p>
                </div>
            </div>
        )
    }

    // Radial Gauge variables
    const score = report.matchScore || 0
    const radius = 38
    const strokeWidth = 6
    const circumference = 2 * Math.PI * radius
    const strokeDashoffset = circumference - (score / 100) * circumference
    const scoreColorClass = score >= 80 ? 'high' : score >= 60 ? 'mid' : 'low'
    const scoreHex = score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444'

    return (
        <div className="interview-wrapper">
            <Navbar />
            
            <div className='interview-page'>
                <div className='interview-layout'>

                    {/* ── Left Nav ── */}
                    <nav className='interview-nav'>
                        <div className="nav-content">
                            <button onClick={() => navigate('/')} className="home-btn">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '0.4rem'}}>
                                    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                                    <polyline points="9 22 9 12 15 12 15 22" />
                                </svg>
                                Dashboard
                            </button>
                            
                            <p className='interview-nav__label'>Modules</p>
                            {NAV_ITEMS.map(item => (
                                <button
                                    key={item.id}
                                    className={`interview-nav__item ${activeNav === item.id ? 'interview-nav__item--active' : ''}`}
                                    onClick={() => setActiveNav(item.id)}
                                >
                                    <span className='interview-nav__icon'>{item.icon}</span>
                                    {item.label}
                                </button>
                            ))}
                        </div>
                        
                        <div className="resume-download">
                            <p className='download-text'>ATS Optimized Resume</p>
                            <button
                                onClick={() => { getResumePdf(interviewId) }}
                                className='button primary-button download-btn'
                            >
                                <svg width="14" height="14" style={{ marginRight: "0.5rem" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                    <polyline points="7 10 12 15 17 10" />
                                    <line x1="12" y1="15" x2="12" y2="3" />
                                </svg>
                                Download Resume
                            </button>
                        </div>
                    </nav>

                    <div className='interview-divider' />

                    {/* ── Center Content ── */}
                    <main ref={contentRef} className='interview-content'>
                        {activeNav === 'technical' && (
                            <section>
                                <div className='content-header'>
                                    <h2>Technical Questions</h2>
                                    <span className='content-header__count'>{report.technicalQuestions.length} Questions</span>
                                </div>
                                <div className='q-list'>
                                    {report.technicalQuestions.map((q, i) => (
                                        <QuestionCard key={i} item={q} index={i} />
                                    ))}
                                </div>
                            </section>
                        )}

                        {activeNav === 'behavioral' && (
                            <section>
                                <div className='content-header'>
                                    <h2>Behavioral Questions</h2>
                                    <span className='content-header__count'>{report.behavioralQuestions.length} Questions</span>
                                </div>
                                <div className='q-list'>
                                    {report.behavioralQuestions.map((q, i) => (
                                        <QuestionCard key={i} item={q} index={i} />
                                    ))}
                                </div>
                            </section>
                        )}

                        {activeNav === 'roadmap' && (
                            <section>
                                <div className='content-header'>
                                    <h2>Preparation Roadmap</h2>
                                    <span className='content-header__count'>{report.preparationPlan.length} Days</span>
                                </div>
                                <div className='roadmap-list'>
                                    {report.preparationPlan.map((day, idx) => (
                                        <RoadMapDay 
                                            key={day.day} 
                                            day={day} 
                                            dayIndex={idx}
                                            checkedTasks={checkedTasks}
                                            onToggleTask={toggleTask}
                                        />
                                    ))}
                                </div>
                            </section>
                        )}
                    </main>

                    <div className='interview-divider' />

                    {/* ── Right Sidebar ── */}
                    <aside className='interview-sidebar'>
                        {/* Match Score */}
                        <div className='match-score-section'>
                            <p className='match-score-section__label'>Job Alignment</p>
                            
                            <div className="radial-progress-wrapper">
                                <svg width="110" height="110" viewBox="0 0 100 100">
                                    <circle 
                                        className="radial-bg" 
                                        cx="50" 
                                        cy="50" 
                                        r={radius} 
                                        stroke="rgba(255, 255, 255, 0.03)" 
                                        strokeWidth={strokeWidth} 
                                        fill="transparent" 
                                    />
                                    <circle 
                                        className={`radial-fill radial-fill--${scoreColorClass}`} 
                                        cx="50" 
                                        cy="50" 
                                        r={radius} 
                                        stroke={scoreHex} 
                                        strokeWidth={strokeWidth} 
                                        fill="transparent" 
                                        strokeDasharray={circumference}
                                        strokeDashoffset={strokeDashoffset}
                                        strokeLinecap="round"
                                        transform="rotate(-90 50 50)"
                                    />
                                </svg>
                                <div className="radial-value-container">
                                    <span className="score-val">{score}</span>
                                    <span className="score-pct">%</span>
                                </div>
                            </div>
                            
                            <p className='match-score-section__sub' style={{color: scoreHex}}>
                                {score >= 80 ? 'Strong Match Profile' : score >= 60 ? 'Moderate Match Profile' : 'Gap Realignment Suggested'}
                            </p>
                        </div>

                        <div className='sidebar-divider' />

                        {/* Skill Gaps */}
                        <div className='skill-gaps'>
                            <p className='skill-gaps__label'>Identified Gaps</p>
                            {report.skillGaps && report.skillGaps.length > 0 ? (
                                <div className='skill-gaps__list'>
                                    {report.skillGaps.map((gap, i) => (
                                        <span key={i} className={`skill-tag skill-tag--${gap.severity}`}>
                                            <span className="bullet-indicator" />
                                            {gap.skill}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <p className="no-gaps-text">No significant gaps detected! Perfect alignment.</p>
                            )}
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    )
}

export default Interview