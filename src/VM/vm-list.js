import React from 'react';

function VMList({ vmList, os, fetchWindowsCredentials, handleDownloadSSH, handleDownloadVPN, handleDeleteVm, loading }) {

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <ul className="vm-list">
      {vmList.map((vm, index) => {
        const sshCommand = `ssh -i "Downloads\\${vm.user_email}-vm-${vm.instance_id}-id_rsa.pem" ${vm.user_name}@ec2-${vm.ip.replace(/\./g, '-')}.${process.env.REACT_APP_AWS_REGION}.compute.amazonaws.com`;

        return (
          <div className='vm-item'>
            <li key={index} className="vm-info">
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
              </>
              <button
                className="btn danger"
                onClick={() => handleDeleteVm(index)}
                disabled={loading}
              >
                {loading ? "Suppression en cours..." : "Supprimer"}
              </button>
            </li>
            {/* Affichage de la commande SSH */}
            <div className="ssh-command"
              onClick={() => copyToClipboard(sshCommand)}
            >
              <p>SSH :</p>
              <pre>{sshCommand}</pre>
            </div>
          </div>
        );
      })}
    </ul>
  );
}

export default VMList;
