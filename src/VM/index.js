import React, { useState } from 'react';
import './index.css';
import DownloadVPNConfig from '../components/download';
import { postData } from '../services/api.js';
import MiddlewareAuth from '../auth/middleware.js';

function VM() {
  // Rediriger si l'utilisateur est déjà connecté
  MiddlewareAuth();

  const [os, setOs] = useState('');
  const [software, setSoftware] = useState([]);
  const [extensions, setExtensions] = useState([]);
  const [userName, setUserName] = useState('');
  const [userPassword, setUserPassword] = useState('');
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

    if (os.startsWith('Windows') && (!userName || !userPassword)) {
      alert('Veuillez fournir un nom d\'utilisateur et un mot de passe pour Windows.');
      return;
    }

    setLoading(true);
    try {
      const data = await postData(
        'api/vm/create',
        { os, software, extensions, user_name: userName, user_password: userPassword }
      );

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
          instanceId: data.instance_id, // Ajout de l'instanceId pour Windows
          os: os,
        },
      ]);
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la création de la VM : ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchWindowsCredentials = async (vm) => {
    try {
      const data = await postData(
        'api/vm/windows-password', // URL de l'API pour récupérer le mot de passe Windows
        {
          instanceId: vm.instanceId, // ID de l'instance EC2
          privateKeyPath: vm.ssh_private_key_path, // Chemin vers la clé privée
        }
      );

      if (!data || !data.ip || !data.username || !data.password) {
        throw new Error('Réponse invalide de l’API.');
      }

      alert(
        `Accès RDP :\nIP : ${data.ip}\nUtilisateur : ${data.username}\nMot de passe : ${data.password}`
      );
    } catch (error) {
      console.error(error);
      alert('Impossible de récupérer les identifiants RDP.');
    }
  };

  const handleDeleteVm = async (index) => {
    setLoading(true);
    try {
      await postData(
        'api/vm/delete',
        {},
        null,
        null
      );

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
    <div className="VM">
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

        {os.startsWith('Windows') && (
          <>
            <h3>Nom d'utilisateur (Windows) :</h3>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Nom d'utilisateur"
              disabled={loading}
            />
            <h3>Mot de passe (Windows) :</h3>
            <input
              type="password"
              value={userPassword}
              onChange={(e) => setUserPassword(e.target.value)}
              placeholder="Mot de passe"
              disabled={loading}
            />
          </>
        )}

        <button className="btn primary" onClick={handleCreateVm} disabled={loading}>
          {loading ? 'Création en cours...' : 'Créer une VM'}
        </button>
      </div>

      <h2>Liste des VMs</h2>
      <ul className="vm-list">
        {vmList.map((vm, index) => (
          <li key={index} className="vm-item">
            <div>
              <strong>IP :</strong>{vm.ip}
              <button
                className="btn secondary"
                onClick={() => {
                  window.location.href = `http://${process.env.REACT_APP_API_URL}/api/download-key?keyPath=${encodeURIComponent(
                    vm.ssh_private_key_path
                  )}`;
                }}
                disabled={loading}
              >
                Télécharger la clé privée
              </button>
              {vm.os.startsWith("Windows") && (
                <button
                  className="btn secondary"
                  onClick={() => fetchWindowsCredentials(vm)}
                  disabled={loading}
                >
                  Récupérer les identifiants RDP
                </button>
              )}
              <DownloadVPNConfig vm={vm} />
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

export default VM;
