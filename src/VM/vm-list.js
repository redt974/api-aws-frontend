import React from 'react';

function VMList({ vmList, os, fetchWindowsCredentials, handleDownloadSSH, handleDownloadVPN, handleDeleteVm, loading }) {

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
                Récupérer les identifiants RDP
              </button>
            ) : (
              <>
                <button
                  className="btn secondary"
                  onClick={() => handleDownloadSSH(index)}
                  disabled={loading}
                >
                  Télécharger la Clé SSH
                </button>
                <button
                  className="btn secondary"
                  onClick={() => handleDownloadVPN(index)}
                  disabled={loading}
                >
                  Télécharger le Client VPN
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
