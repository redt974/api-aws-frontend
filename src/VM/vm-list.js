import React from 'react';

function VMList({ vmList, os, fetchWindowsCredentials, handleDownloadVPN, handleDownloadSSH, handleDeleteVm, loading }) {
  return (
    <ul className="vm-list">
      {vmList.map((vm, index) => (
        <li key={index} className="vm-item">
          <>
            <p>IP : <strong>{vm.ip}</strong></p>
            {os.startsWith('Windows') ? (
              <button
                className="btn secondary"
                onClick={() => fetchWindowsCredentials(index)}
                disabled={loading}
              >
                {loading ? "Récupération en cours..." : "Récupérer les identifiants RDP"}
              </button>
            ) : (
              <>
                <button
                  className="btn secondary"
                  onClick={() => handleDownloadSSH(index)}
                  disabled={loading}
                >
                  {loading ? "Téléchargement en cours..." : "Télécharger la Clé SSH"}
                </button>
                <button
                  className="btn secondary"
                  onClick={() => handleDownloadVPN(index)}
                  disabled={loading}
                >
                  {loading ? "Téléchargement en cours..." : "Télécharger le fichier VPN"}
                </button>
              </>
            )}
            <p>{vm.message}</p>
          </>
          <button
            className="btn danger"
            onClick={() => handleDeleteVm(index)}
            disabled={loading}
          >
            {loading ? "Suppression en cours..." : "Supprimer"}
          </button>
        </li>
      ))}
    </ul>
  );
}

export default VMList;
