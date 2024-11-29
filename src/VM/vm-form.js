import React from 'react';

function VMForm({ os, userName, setUserName, userPassword, setUserPassword, handleCreateVm, loading }) {
  return (
    <>
      {os.startsWith('Windows') && (
        <>
          <h3>Nom d'utilisateur (Windows) :</h3>
          <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="Nom d'utilisateur" disabled={loading} />
          <h3>Mot de passe (Windows) :</h3>
          <input type="password" value={userPassword} onChange={(e) => setUserPassword(e.target.value)} placeholder="Mot de passe" disabled={loading} />
        </>
      )}
      <button className="btn primary" onClick={handleCreateVm} disabled={loading}>
        {loading ? 'Création en cours...' : 'Créer une VM'}
      </button>
    </>
  );
}

export default VMForm;
