import React from 'react';
import DownloadVPNConfig from '../components/download';

function VMList({ vmList, fetchWindowsCredentials, handleDeleteVm, loading }) {
  return (
    <ul className="vm-list">
      {vmList.map((vm, index) => (
        <li key={index} className="vm-item">
          <div>
            <strong>IP :</strong> {vm.ip}
            <button className="btn secondary" onClick={() => fetchWindowsCredentials(vm)} disabled={loading}>
              Récupérer les identifiants RDP
            </button>
            <DownloadVPNConfig vm={vm} />
            <p>{vm.output}</p>
          </div>
          <button className="btn danger" onClick={() => handleDeleteVm(index)} disabled={loading}>
            Supprimer
          </button>
        </li>
      ))}
    </ul>
  );
}

export default VMList;
