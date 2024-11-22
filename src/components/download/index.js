import React, { useState } from "react";
import { getData } from "../../services/api";

function DownloadVPNConfig({ vm }) {
  const [loading, setLoading] = useState(false);

  const handleDownloadVPNConfig = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Vous devez être connecté pour télécharger la configuration VPN.");
      return;
    }

    setLoading(true);

    try {
      const response = await getData(`api/vm/download-vpn/${vm.userId}/${vm.vmId}`);
      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${vm.userEmail}-vpn-config.ovpn`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erreur lors du téléchargement du fichier VPN :", error);
      alert("Une erreur est survenue lors du téléchargement.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className="btn secondary"
      onClick={handleDownloadVPNConfig}
      disabled={loading}
    >
      {loading ? "Téléchargement en cours..." : "Télécharger le fichier VPN"}
    </button>
  );
}

export default DownloadVPNConfig;
