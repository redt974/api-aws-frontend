import React from 'react';
import './index.css'
import VMOptions from './vm-options';
import VMForm from './vm-form';
import VMList from './vm-list';
import VMHooks from './vm-hooks';
import MiddlewareAuth from '../auth/middleware.js';

function VM() {
  MiddlewareAuth();
  const {
    os, setOs, software, setSoftware, extensions, setExtensions,
    userName, setUserName, userPassword, setUserPassword, vmList,
    loading, handleCreateVm, fetchWindowsCredentials, handleDeleteVm
  } = VMHooks();

  const availableExtensions = [
    { name: 'Python', value: 'ms-python.python' },
    { name: 'Prettier', value: 'esbenp.prettier-vscode' },
    { name: 'ESLint', value: 'dbaeumer.vscode-eslint' },
    { name: 'Docker', value: 'PeterJausovec.vscode-docker' },
    { name: 'GitLens', value: 'eamodio.gitlens' },
  ];

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
      <VMOptions {...{ os, setOs, software, setSoftware, extensions, availableExtensions, handleAddExtension, handleRemoveExtension, loading }} />
      <VMForm {...{ os, userName, setUserName, userPassword, setUserPassword, handleCreateVm, loading }} />
      <h2>Liste des VMs</h2>
      <VMList {...{ vmList, fetchWindowsCredentials, handleDeleteVm, loading }} />
    </div>
  );
}

export default VM;
