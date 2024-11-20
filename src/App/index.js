import React, { useState } from 'react';
import './index.css';

function App() {
  const [os, setOs] = useState('');
  const [software, setSoftware] = useState([]);
  const [extensions, setExtensions] = useState([]);
  const [vmList, setVmList] = useState([]);
  const [loading, setLoading] = useState(false);

  const osOptions = ['Ubuntu', 'Debian', 'Kali', 'Windows 10', 'Windows 11'];
  const softwareOptions = ['Node.js', 'MySQL', 'Python'];

  const availableExtensions = [
    { name: 'Python', value: 'ms-python.python' },
    { name: 'Prettier', value: 'esbenp.prettier-vscode' },
    { name: 'ESLint', value: 'dbaeumer.vscode-eslint' },
    { name: 'Docker', value: 'PeterJausovec.vscode-docker' },
    { name: 'GitLens', value: 'eamodio.gitlens' },
  ];

  const handleCreateVm = async () => {
    if (!os) {
      alert('Veuillez sélectionner un OS.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/vm/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          os,
          software,
          extensions,
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création de la VM.');
      }

      const data = await response.json();

      if (!data.public_ip || !data.ssh_private_key) {
        throw new Error('Réponse invalide de l’API.');
      }

      alert('VM créée avec succès.');
      setVmList([
        ...vmList,
        {
          ip: data.public_ip,
          ssh_private_key_path: data.ssh_private_key,
          output: data.message,
        },
      ]);
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la création de la VM : ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVm = async (index) => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/vm/delete`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression de la VM.');
      }

      alert('VM supprimée avec succès.');
      const updatedVmList = [...vmList];
      updatedVmList.splice(index, 1);
      setVmList(updatedVmList);
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la suppression de la VM : ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddExtension = (extension) => {
    setExtensions((prevExtensions) => {
      if (!prevExtensions.includes(extension)) {
        return [...prevExtensions, extension];
      }
      return prevExtensions;
    });
  };

  const handleRemoveExtension = (extension) => {
    setExtensions(extensions.filter((ext) => ext !== extension));
  };

  return (
    <div className="app">
      <h1>Gestionnaire de VMs AWS</h1>

      <div className="options">
        <h3>Choisissez un OS :</h3>
        <div className="buttons-group">
          {osOptions.map((option) => (
            <button
              key={option}
              className={`btn ${os === option ? 'active' : ''}`}
              onClick={() => setOs(option)}
              disabled={loading}
            >
              {option}
            </button>
          ))}
        </div>

        <h3>Choisissez des logiciels :</h3>
        <div className="buttons-group">
          {softwareOptions.map((option) => (
            <button
              key={option}
              className={`btn ${software.includes(option) ? 'active' : ''}`}
              onClick={() =>
                setSoftware(
                  software.includes(option)
                    ? software.filter((s) => s !== option)
                    : [...software, option]
                )
              }
              disabled={loading}
            >
              {option}
            </button>
          ))}
        </div>

        <h3>Extensions VSCode :</h3>
        <div className="buttons-group">
          {availableExtensions.map((ext) => (
            <button
              key={ext.value}
              className={`btn ${extensions.includes(ext.value) ? 'active' : ''}`}
              onClick={() =>
                extensions.includes(ext.value)
                  ? handleRemoveExtension(ext.value)
                  : handleAddExtension(ext.value)
              }
              disabled={loading}
            >
              {ext.name}
            </button>
          ))}
        </div>

        <button className="btn primary" onClick={handleCreateVm} disabled={loading}>
          {loading ? 'Création en cours...' : 'Créer une VM'}
        </button>
      </div>

      <h2>Liste des VMs</h2>
      <ul className="vm-list">
        {vmList.map((vm, index) => (
          <li key={index} className="vm-item">
            <div>
              <strong>IP :</strong>{' '}
              <a href={`http://${vm.ip}`} target="_blank" rel="noopener noreferrer">
                {vm.ip}
              </a>
              <button
                className="btn secondary"
                onClick={() => {
                  window.location.href = `${process.env.REACT_APP_API_URL}/api/download-key?keyPath=${encodeURIComponent(
                    vm.ssh_private_key_path
                  )}`;
                }}
                disabled={loading}
              >
                Télécharger la clé privée
              </button>
              <p>{vm.output}</p>
            </div>
            <button
              className="btn danger"
              onClick={() => handleDeleteVm(index)}
              disabled={loading}
            >
              Supprimer
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
