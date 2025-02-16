import React from 'react';
import './index.css'
import VMOptions from './vm-options';
import VMForm from './vm-form';
import VMList from './vm-list';
import VMHooks from './vm-hooks';
import MiddlewareAuth from '../auth/middleware.js';
import Progress from '../components/progress/index.js';

function VM() {
  MiddlewareAuth();
  const {
    os, setOs, software, setSoftware, extensions, setExtensions,
    userName, setUserName, userPassword, setUserPassword, vmList,
    loading, progress, message, error, handleCreateVm, fetchWindowsCredentials, handleDownloadSSH, handleDownloadVPN, handleDeleteVm
  } = VMHooks();

  const availableExtensions = [
    { name: 'Python', value: 'ms-python.python' },
    { name: 'Prettier', value: 'esbenp.prettier-vscode' },
    { name: 'ESLint', value: 'dbaeumer.vscode-eslint' },
    { name: 'Docker', value: 'ms-azuretools.vscode-docker' },
    { name: 'GitLens', value: 'eamodio.gitlens' },
    { name: 'Java', value: 'vscjava.vscode-java-pack' },
    { name: 'Jest', value: 'dsznajder.es7-react-js-snippets' },
    { name: 'GitHub', value: 'GitHub.copilot' },
    { name: 'vscode-icons', value: 'vscode-icons-team.vscode-icons' },
    { name: 'Visual Studio Code Git Graph', value: 'mhutchie.git-graph' },
    { name: 'Path Intellisense', value: 'christian-kohler.path-intellisense' },
    { name: 'Prettier ESLint Integration', value: 'esbenp.prettier-vscode-eslint' },
    { name: 'TabNine', value: 'codota.tabnine-vscode' },
    { name: 'vscode-npm-script', value: 'formulahendry.vscode-npm-script' },
    { name: 'Jupyter', value: 'ms-toolsai.jupyter' },
    { name: 'Visual Studio IntelliCode', value: 'VisualStudioExptTeam.vscodeintellicode' },
    { name: 'vscode-html-css', value: 'ecmel.vscode-html-css' },
    { name: 'Bracket Pair Colorizer', value: 'coenraads.bracket-pair-colorizer' },
    { name: 'Prettier for GraphQL', value: 'GraphQL.vscode-graphql' },
    { name: 'Live Server', value: 'ritwickdey.LiveServer' },
    { name: 'EditorConfig for VS Code', value: 'EditorConfig.EditorConfig' },
    { name: 'Material Icon Theme', value: 'PKief.material-icon-theme' },
    { name: 'JavaScript (ES6) code snippets', value: 'xabikos.JavaScriptSnippets' },
    { name: 'SQL Server', value: 'ms-mssql.mssql' },
    { name: 'Azure Functions', value: 'ms-azuretools.vscode-azurefunctions' },
    { name: 'Rust', value: 'rust-lang.rust' },
    { name: 'XML', value: 'DotJoshJohnson.xml' },
    { name: 'Dart', value: 'Dart-Code.flutter' },
    { name: 'Kubernetes', value: 'ms-kubernetes-tools.vscode-kubernetes-tools' },
    { name: 'JavaScript (ES6) snippets', value: 'xabikos.JavaScriptSnippets' },
    { name: 'Debugger for Chrome', value: 'msjsdiag.debugger-for-chrome' },
    { name: 'Java Language Support', value: 'redhat.java' },
    { name: 'C#', value: 'ms-dotnettools.csharp' },
    { name: 'JavaScript (ES6) snippets', value: 'xabikos.JavaScriptSnippets' }
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

  if(progress !== "" && loading){
    return (<Progress progress={progress}/>);
  }

  return (
    <div className="VM">
      <h1>Gestionnaire de VMs AWS</h1>
      <VMOptions {...{ os, setOs, software, setSoftware, extensions, availableExtensions, handleAddExtension, handleRemoveExtension, loading }} />
      <VMForm {...{ userName, setUserName, userPassword, setUserPassword, handleCreateVm, loading }} />
      <h2>Liste des VMs</h2>
      <VMList {...{ vmList, os, fetchWindowsCredentials, handleDownloadSSH, handleDownloadVPN, handleDeleteVm, loading }} />
      {message && <div className='message'><p style={{ color: 'green' }}>{message}</p></div>}
      {error && <div className='error'><p style={{ color: 'red' }}>Erreur : {error}</p></div>}
    </div>
  );
}

export default VM;
