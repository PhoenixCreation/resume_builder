import React from 'react';

const Editor = ({ data, onChange }) => {
    const handleChange = (section, field, value) => {
        onChange(section, field, value);
    };

    const handleArrayChange = (section, index, field, value) => {
        // For arrays of objects like employmentHistory
        const newArray = [...data[section]];
        newArray[index] = { ...newArray[index], [field]: value };
        onChange(section, null, newArray); // passing null as field means replace whole section
    };

    const handleDeepArrayChange = (section, index, subField, subIndex, value) => {
        // For arrays inside arrays (like description in employmentHistory)
        const newArray = [...data[section]];
        const newSubArray = [...newArray[index][subField]];
        newSubArray[subIndex] = value;
        newArray[index] = { ...newArray[index], [subField]: newSubArray };
        onChange(section, null, newArray);
    };

    const handleSimpleArrayChange = (section, index, value) => {
        // For simple arrays like skills
        const newArray = [...data[section]];
        newArray[index] = value;
        onChange(section, null, newArray);
    };

    const addItem = (section, itemTemplate) => {
        const newArray = [...data[section], itemTemplate];
        onChange(section, null, newArray);
    };

    const removeItem = (section, index) => {
        const newArray = data[section].filter((_, i) => i !== index);
        onChange(section, null, newArray);
    };

    // Specific handlers for nested objects like header
    const handleHeaderChange = (field, value) => {
        onChange('header', field, value);
    };

    const handleDetailsChange = (field, value) => {
        onChange('details', field, value);
    };

    return (
        <div className="editor-form">
            <h2>Resume Editor</h2>

            {/* Header Info */}
            <h3 className="section-title">Header Info</h3>
            <div className="input-group">
                <label className="input-label">Name</label>
                <input
                    type="text"
                    value={data.header.name}
                    onChange={(e) => handleHeaderChange('name', e.target.value)}
                />
            </div>
            <div className="input-group">
                <label className="input-label">Title</label>
                <input
                    type="text"
                    value={data.header.title}
                    onChange={(e) => handleHeaderChange('title', e.target.value)}
                />
            </div>

            {/* Details */}
            <h3 className="section-title">Personal Details</h3>
            <div className="input-group">
                <label className="input-label">Address</label>
                <textarea
                    value={data.details.address}
                    onChange={(e) => handleDetailsChange('address', e.target.value)}
                />
            </div>
            <div className="input-group">
                <label className="input-label">Phone</label>
                <input
                    type="text"
                    value={data.details.phone}
                    onChange={(e) => handleDetailsChange('phone', e.target.value)}
                />
            </div>
            <div className="input-group">
                <label className="input-label">Email</label>
                <input
                    type="text"
                    value={data.details.email}
                    onChange={(e) => handleDetailsChange('email', e.target.value)}
                />
            </div>

            {/* Profile */}
            <h3 className="section-title">Profile</h3>
            <div className="input-group">
                <textarea
                    rows="6"
                    value={data.profile}
                    onChange={(e) => onChange('profile', null, e.target.value)}
                />
            </div>

            {/* Skills */}
            <h3 className="section-title">Skills</h3>
            {data.skills.map((skill, index) => (
                <div key={index} className="input-group" style={{ display: 'flex' }}>
                    <input
                        type="text"
                        value={skill}
                        onChange={(e) => handleSimpleArrayChange('skills', index, e.target.value)}
                    />
                    <button className="remove-btn" onClick={() => removeItem('skills', index)}>X</button>
                </div>
            ))}
            <button className="add-btn" onClick={() => addItem('skills', "")}>+ Add Skill</button>

            {/* Links */}
            <h3 className="section-title">Links</h3>
            {data.links.map((link, index) => (
                <div key={index} style={{ marginBottom: '10px', borderBottom: '1px solid #eee', paddingBottom: '5px' }}>
                    <div className="input-group">
                        <label className="input-label">Label</label>
                        <input
                            type="text"
                            value={link.label}
                            onChange={(e) => handleArrayChange('links', index, 'label', e.target.value)}
                        />
                    </div>
                    <div className="input-group">
                        <label className="input-label">URL</label>
                        <input
                            type="text"
                            value={link.url}
                            onChange={(e) => handleArrayChange('links', index, 'url', e.target.value)}
                        />
                    </div>
                    <button className="remove-btn" onClick={() => removeItem('links', index)}>Remove Link</button>
                </div>
            ))}
            <button className="add-btn" onClick={() => addItem('links', { label: 'New Link', url: '#' })}>+ Add Link</button>


            {/* Employment History */}
            <h3 className="section-title">Employment History</h3>
            {data.employmentHistory.map((job, index) => (
                <div key={job.id} style={{ marginBottom: '20px', border: '1px solid #eee', padding: '10px' }}>
                    <div className="input-group">
                        <label className="input-label">Title</label>
                        <input type="text" value={job.title} onChange={(e) => handleArrayChange('employmentHistory', index, 'title', e.target.value)} />
                    </div>
                    <div className="input-group">
                        <label className="input-label">Company</label>
                        <input type="text" value={job.company} onChange={(e) => handleArrayChange('employmentHistory', index, 'company', e.target.value)} />
                    </div>
                    <div className="input-group">
                        <label className="input-label">Date</label>
                        <input type="text" value={job.date} onChange={(e) => handleArrayChange('employmentHistory', index, 'date', e.target.value)} />
                    </div>
                    <div className="input-group">
                        <label className="input-label">Location</label>
                        <input type="text" value={job.location} onChange={(e) => handleArrayChange('employmentHistory', index, 'location', e.target.value)} />
                    </div>

                    <label className="input-label">Descriptions</label>
                    {job.description.map((desc, i) => (
                        <div key={i} style={{ display: 'flex', marginBottom: '5px' }}>
                            <textarea rows="2" value={desc} onChange={(e) => handleDeepArrayChange('employmentHistory', index, 'description', i, e.target.value)} />
                            <button className="remove-btn" onClick={() => {
                                const newArray = [...data.employmentHistory];
                                newArray[index].description = newArray[index].description.filter((_, di) => di !== i);
                                onChange('employmentHistory', null, newArray);
                            }}>X</button>
                        </div>
                    ))}
                    <button className="add-btn" onClick={() => {
                        const newArray = [...data.employmentHistory];
                        newArray[index].description.push("New description item");
                        onChange('employmentHistory', null, newArray);
                    }}>+ Add Description</button>

                    <div style={{ marginTop: '10px' }}>
                        <button className="remove-btn" style={{ width: '100%' }} onClick={() => removeItem('employmentHistory', index)}>Remove Job</button>
                    </div>
                </div>
            ))}
            <button className="add-btn" onClick={() => addItem('employmentHistory', {
                id: Date.now(),
                title: "New Role",
                company: "Company",
                date: "Date - Date",
                location: "Location",
                description: ["Description"]
            })}>+ Add Job</button>

            {/* Education */}
            <h3 className="section-title">Education</h3>
            {data.education.map((edu, index) => (
                <div key={edu.id} style={{ marginBottom: '20px', border: '1px solid #eee', padding: '10px' }}>
                    <div className="input-group">
                        <label className="input-label">Degree</label>
                        <input type="text" value={edu.degree} onChange={(e) => handleArrayChange('education', index, 'degree', e.target.value)} />
                    </div>
                    <div className="input-group">
                        <label className="input-label">School</label>
                        <input type="text" value={edu.school} onChange={(e) => handleArrayChange('education', index, 'school', e.target.value)} />
                    </div>
                    <div className="input-group">
                        <label className="input-label">Date</label>
                        <input type="text" value={edu.date} onChange={(e) => handleArrayChange('education', index, 'date', e.target.value)} />
                    </div>
                    <button className="remove-btn" style={{ width: '100%' }} onClick={() => removeItem('education', index)}>Remove Education</button>
                </div>
            ))}
            <button className="add-btn" onClick={() => addItem('education', {
                id: Date.now(),
                degree: "Degree",
                school: "School",
                date: "Date"
            })}>+ Add Education</button>

            <div style={{ height: '50px' }}></div>
        </div>
    );
};

export default Editor;
