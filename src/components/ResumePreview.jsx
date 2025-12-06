import React, { useLayoutEffect, useRef, useState } from 'react';

const ResumePreview = ({ data }) => {
    const [scale, setScale] = useState(1);
    const containerRef = useRef(null);
    const contentRef = useRef(null);

    useLayoutEffect(() => {
        if (containerRef.current && contentRef.current) {
            const pageHeight = containerRef.current.clientHeight;
            // Measure actual rendered height logic to avoid loop
            // We use simple condition: if current rendered height > pageHeight, just shrink.
            // We don't try to be too smart about 'unscaledHeight' because width changes affect it.

            const renderedHeight = contentRef.current.scrollHeight;
            const visualHeight = renderedHeight * scale;

            if (visualHeight > pageHeight) {
                // If its already scaled, renderedHeight is TALL because width is SMALL? 
                // No, we are using width: 100/scale % -> Width matches page.
                // So renderedHeight is the 'correct' height for that width.
                // If visualHeight > pageHeight, it means it doesn't fit.

                // We need to scale down.
                // Target Scale = PageHeight / renderedHeight.
                const newScale = (pageHeight - 20) / renderedHeight;

                // Only verify we are shrinking significantly to avoid jitter
                if (scale - newScale > 0.001) {
                    setScale(newScale);
                }
            }
        }
    }, [data, scale]);

    return (
        <div className="resume-page" id="resume-content" ref={containerRef}>

            {/* Scalable Content Wrapper */}
            <div
                className="resume-scale-wrapper"
                ref={contentRef}
                style={{
                    transform: `scale(${scale})`,
                    transformOrigin: 'top left',
                    width: `${100 / scale}%`,
                    height: 'auto',
                    minHeight: '100%'
                }}
            >
                {/* Header - Positioned Absolute but inside wrapper to scale */}
                <div className="header-box">
                    <h1 className="header-name">{data.header.name}</h1>
                    <h2 className="header-title">{data.header.title}</h2>
                </div>

                {/* Sidebar */}
                <aside className="resume-sidebar">
                    {/* Details */}
                    <div className="details-section">
                        <h3 className="section-title">DETAILS</h3>

                        <div className="details-item">
                            <h4>ADDRESS</h4>
                            <p className="text-small" style={{ whiteSpace: 'pre-line' }}>{data.details.address}</p>
                        </div>

                        <div className="details-item">
                            <h4>PHONE</h4>
                            <p className="text-small">{data.details.phone}</p>
                        </div>

                        <div className="details-item">
                            <h4>EMAIL</h4>
                            <p className="text-small">{data.details.email}</p>
                        </div>
                    </div>

                    {/* Links */}
                    <div className="links-section">
                        <h3 className="section-title">LINKS</h3>
                        {data.links.map((link, index) => (
                            <a key={index} href={link.url} className="link-item">{link.label}</a>
                        ))}
                    </div>

                    {/* Skills */}
                    <div className="skills-section">
                        <h3 className="section-title">SKILLS</h3>
                        <ul className="skill-list">
                            {data.skills.map((skill, index) => (
                                <li key={index} className="skill-item">{skill}</li>
                            ))}
                        </ul>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="resume-main">

                    {/* Profile */}
                    <section className="profile-section">
                        <h3 className="section-title">PROFILE</h3>
                        <p>{data.profile}</p>
                    </section>

                    {/* Employment History */}
                    <section className="history-section">
                        <h3 className="section-title">EMPLOYMENT HISTORY</h3>
                        {data.employmentHistory.map((job) => (
                            <div key={job.id} style={{ marginBottom: '20px' }}>
                                <div className="item-title">
                                    {job.title}, {job.company}
                                </div>
                                <div className="item-subtitle">
                                    <span>{job.date}</span>
                                    <span>{job.location}</span>
                                </div>
                                <ul>
                                    {job.description.map((desc, i) => (
                                        <li key={i}>{desc}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </section>

                    {/* Education */}
                    <section className="education-section">
                        <h3 className="section-title">EDUCATION</h3>
                        {data.education.map((edu) => (
                            <div key={edu.id}>
                                <div className="item-title">
                                    {edu.degree}, {edu.school}
                                </div>
                                <div className="item-subtitle">
                                    <span>{edu.date}</span>
                                </div>
                            </div>
                        ))}
                    </section>
                </main>
            </div>
        </div>
    );
};

export default ResumePreview;
