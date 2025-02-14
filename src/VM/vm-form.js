import React from 'react';

function VMForm({ userName, setUserName, userPassword, setUserPassword, handleCreateVm, loading }) {
  return (
    <>
      <div className='user-form'>
        <h3>Nom d'utilisateur :</h3>
        <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="Nom d'utilisateur" disabled={loading} />
        <h3>Mot de passe :</h3>
        <input type="password" value={userPassword} onChange={(e) => setUserPassword(e.target.value)} placeholder="Mot de passe" disabled={loading} />
      </div>
      <button className="btn primary" onClick={handleCreateVm} disabled={loading}>
        {loading ? 'Création en cours...' : 'Créer une VM'}
      </button>
    </>
  );
}

export default VMForm;
