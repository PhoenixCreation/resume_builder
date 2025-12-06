import React, { useState, useEffect } from 'react';
import ResumePreview from './components/ResumePreview';
import Editor from './components/Editor';
import { initialResumeState } from './initialState';

// Load all profiles from the profile directory
const profileModules = import.meta.glob('./profile/*.js', { eager: true });

const profiles = {};
Object.keys(profileModules).forEach((path) => {
  // Extract filename without extension as key (e.g., 'default', 'ai-ml')
  const name = path.match(/\/([^/]+)\.js$/)[1];
  // Get the exported value from the module
  const module = profileModules[path];

  // Try to find the correct export
  let data = module.default; // Check default export

  if (!data) {
    // Check named exports for a valid resume object
    const values = Object.values(module);
    data = values.find(val => val && typeof val === 'object' && val.header && val.details);

    // Fallback to first export if still not found
    if (!data && values.length > 0) {
      data = values[0];
    }
  }

  if (data) {
    profiles[name] = data;
  } else {
    console.warn(`Could not find valid resume data in ${path}`);
  }
});

// Ensure we have at least the initial state if no profiles found
if (Object.keys(profiles).length === 0) {
  profiles['initial'] = initialResumeState;
}

function App() {
  // Initialize profile name from storage or default
  const [currentProfileName, setCurrentProfileName] = useState(() => {
    const saved = localStorage.getItem('currentProfileName');
    return (saved && profiles[saved]) ? saved : Object.keys(profiles)[0];
  });

  // Initialize resume data from storage or default profile
  const [resumeData, setResumeData] = useState(() => {
    // We need to use the profile name we just determined
    const saved = localStorage.getItem('currentProfileName');
    const profileName = (saved && profiles[saved]) ? saved : Object.keys(profiles)[0];

    const savedData = localStorage.getItem(`resume_data_${profileName}`);
    if (savedData) {
      try {
        return JSON.parse(savedData);
      } catch (e) {
        console.error("Failed to parse saved data", e);
      }
    }
    return profiles[profileName];
  });

  // Save to localStorage whenever data or profile changes
  useEffect(() => {
    localStorage.setItem('currentProfileName', currentProfileName);
    localStorage.setItem(`resume_data_${currentProfileName}`, JSON.stringify(resumeData));
  }, [currentProfileName, resumeData]);

  const handleProfileChange = (e) => {
    const newProfileName = e.target.value;
    setCurrentProfileName(newProfileName);

    // Attempt to load saved data for the new profile
    const savedData = localStorage.getItem(`resume_data_${newProfileName}`);
    if (savedData) {
      try {
        setResumeData(JSON.parse(savedData));
      } catch (e) {
        setResumeData(profiles[newProfileName]);
      }
    } else {
      setResumeData(profiles[newProfileName]);
    }
  };

  const handleDataChange = (section, field, value) => {
    setResumeData((prev) => {
      if (field === null) {
        return { ...prev, [section]: value };
      }
      return {
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      };
    });
  };

  const handlePrint = () => {
    window.print();
  };



  return (
    <div className="app-container">
      <div className="editor-panel">
        <div className="profile-selector" style={{ marginBottom: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '4px', border: '1px solid #ddd' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Select Profile:</label>
          <select
            value={currentProfileName}
            onChange={handleProfileChange}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          >
            {Object.keys(profiles).map((name) => (
              <option key={name} value={name}>
                {name.charAt(0).toUpperCase() + name.slice(1).replace('-', ' ')}
              </option>
            ))}
          </select>
        </div>
        <Editor data={resumeData} onChange={handleDataChange} />
      </div>
      <div className="preview-panel">
        <ResumePreview data={resumeData} />
      </div>
      <button className="print-btn" onClick={handlePrint}>
        Download PDF
      </button>
    </div>
  );
}

export default App;
