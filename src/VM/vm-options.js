import React from 'react';

function VMOptions({ os, setOs, software, setSoftware, extensions, availableExtensions, handleAddExtension, handleRemoveExtension, loading }) {
  const osOptions = ['Ubuntu', 'Debian', 'Kali', 'Windows 10', 'Windows 11'];
  const softwareOptions = [
    'Node.js',
    'MySQL',
    'Python',
    'XAMPP',
    'Docker',
    'Java',
    'Maven',
    'C/C++ development tools',
    '.NET SDK',
    'Docker Compose',
    'Apache web server',
    'PHP',
    'Composer',
    'Slack',
    'Discord',
    'VirtualBox',
    'Ansible',
    'Zoom',
    'Android Studio',
    'Postman',
    'IntelliJ IDEA',
    'Jenkins'
  ];
  
  return (
    <div className="options">
      <h3>Choisissez l'OS :</h3>
      <div className="buttons-group">
        {osOptions.map((option) => (
          <button key={option} className={`btn ${os === option ? 'active' : ''}`} onClick={() => setOs(option)} disabled={loading}>
            {option}
          </button>
        ))}
      </div>

      <h3>Choisissez des Logiciels :</h3>
      <div className="buttons-group">
        {softwareOptions.map((option) => (
          <button
            key={option}
            className={`btn ${software.includes(option) ? 'active' : ''}`}
            onClick={() => setSoftware(software.includes(option) ? software.filter((s) => s !== option) : [...software, option])}
            disabled={loading}
          >
            {option}
          </button>
        ))}
      </div>

      <h3>Choisissez les Extensions VSCode :</h3>
      <div className="buttons-group">
        {availableExtensions.map((ext) => (
          <button
            key={ext.value}
            className={`btn ${extensions.includes(ext.value) ? 'active' : ''}`}
            onClick={() => (extensions.includes(ext.value) ? handleRemoveExtension(ext.value) : handleAddExtension(ext.value))}
            disabled={loading}
          >
            {ext.name}
          </button>
        ))}
      </div>
    </div>
  );
}

export default VMOptions;
