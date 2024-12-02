import { useEffect, useState } from "react";
import { fetchData, getData, postData } from "../services/api.js";

export default function VMHooks() {
    const [os, setOs] = useState(localStorage.getItem("new-vm-os") || "");
    const [software, setSoftware] = useState(JSON.parse(localStorage.getItem("new-vm-software")) || []);
    const [extensions, setExtensions] = useState(JSON.parse(localStorage.getItem("new-vm-extensions")) || []);
    const [userName, setUserName] = useState("");
    const [userPassword, setUserPassword] = useState("");
    const [vmList, setVmList] = useState(() => {
        const storedVmList = localStorage.getItem("vmList");
        return storedVmList ? JSON.parse(storedVmList) : [];
    });    
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    // Sauvegarde des sélections dans le localStorage dès qu'elles changent
    useEffect(() => {
        localStorage.setItem("new-vm-os", os);
        localStorage.setItem("new-vm-software", JSON.stringify(software));
        localStorage.setItem("new-vm-extensions", JSON.stringify(extensions));
    }, [os, software, extensions]);

    // Récupération des VMs au chargement initial
    useEffect(() => {
        const getVMs = async () => {
            setLoading(true);
            try {
                const data = await getData("api/vm/get-vm");
                if (data && Array.isArray(data.vmList)) {
                    setVmList(data.vmList);
                    localStorage.setItem("vmList", JSON.stringify(data.vmList));
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des VMs : ", error.message);
                setError("Impossible de récupérer les VMs." + error.message);
            } finally {
                setLoading(false);
            }
        };

        getVMs();
    }, []);

    const saveVMsToLocalStorage = (vms) => {
        localStorage.setItem("vmList", JSON.stringify(vms));
    };

    const handleCreateVm = async () => {
        if (!os) {
            setError("Veuillez sélectionner un OS.");
            return;
        }

        if (os.startsWith("Windows") && (!userName || !userPassword)) {
            setError("Veuillez fournir un nom d'utilisateur et un mot de passe pour Windows.");
            return;
        }

        const normalizedSoftware = Array.isArray(software) ? software : [software];
        const normalizedExtensions = Array.isArray(extensions) ? extensions : [extensions];

        setLoading(true);
        try {
            const data = await postData("api/vm/create", {
                os,
                software: normalizedSoftware,
                extensions: normalizedExtensions,
                user_name: userName,
                user_password: userPassword,
            });

            if (!data.ip || !data.ssh_private_key) {
                setError("Réponse invalide de l’API.");
                return;
            }

            const newVm = {
                vm_id: data.vm_id,
                user_id: data.user_id,
                user_email: data.user_email,
                instance_id: data.instance_id,
                ip: data.ip,
                ssh_private_key: data.ssh_private_key,
                message: data.message,
            };

            const updatedVmList = [...vmList, newVm];
            setVmList(updatedVmList);
            saveVMsToLocalStorage(updatedVmList);

            setMessage("VM créée avec succès.");
        } catch (error) {
            console.error("Erreur lors de la création de la VM : ", error.message);
            setError("Erreur lors de la création de la VM : " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchWindowsCredentials = async (index) => {
        const vm = vmList[index];
        if (!vm || !vm.instance_id || !vm.ssh_private_key) {
            setError("VM invalide pour le téléchargement du VPN.");
            return;
        }

        setLoading(true);
        try {
            const data = await postData("api/vm/windows-password", {
                instance_id: vm.instance_id,
                privateKeyPath: vm.ssh_private_key,
            });

            if (!data || !data.ip || !data.username || !data.password) {
                setError("Réponse invalide de l'API.");
            }

            setMessage(`Accès RDP :\nIP : ${data.ip}\nUtilisateur : ${data.username}\nMot de passe : ${data.password}`);
        } catch (error) {
            console.error("Impossible de récupérer les identifiants RDP : ", error.message);
            setError("Impossible de récupérer les identifiants RDP : " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadSSH = async (index) => {
        const vm = vmList[index];
        if (!vm || !vm.vm_id || !vm.user_id) {
            setError("VM invalide pour le téléchargement du SSH.");
            return;
        }
    
        setLoading(true);
    
        try {
            // Passer expectBlob à true pour récupérer le fichier comme Blob
            const blob = await fetchData(`api/vm/download-ssh/${vm.user_id}/${vm.vm_id}`, 'GET', null, null, null, {}, true);

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${vm.user_email}-vm-${vm.instance_id}-id_rsa.key`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            
            setMessage("Téléchargement du SSH réussi.");
        } catch (error) {
            console.error("Erreur lors du téléchargement du fichier SSH :", error.message);
            setError("Une erreur est survenue lors du téléchargement : " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadVPN = async (index) => {
        const vm = vmList[index];
        if (!vm || !vm.vm_id || !vm.user_id) {
            setError("VM invalide pour le téléchargement du VPN.");
            return;
        }
    
        setLoading(true);
    
        try {
            // Passer expectBlob à true pour récupérer le fichier comme Blob
            const blob = await fetchData(`api/vm/download-vpn/${vm.user_id}/${vm.vm_id}`, 'GET', null, null, null, {}, true);

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${vm.user_email}-vm-${vm.instance_id}.ovpn`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            
            setMessage("Téléchargement du VPN réussi.");
        } catch (error) {
            console.error("Erreur lors du téléchargement du fichier VPN :", error.message);
            setError("Une erreur est survenue lors du téléchargement : " + error.message);
        } finally {
            setLoading(false);
        }
    };
    
    const handleDeleteVm = async (index) => {
        const vm = vmList[index];
        if (!vm || !vm.vm_id) {
            setError("VM invalide.");
            return;
        }

        setLoading(true);
        try {
            await postData("api/vm/delete", { vm_id: vm.vm_id });

            const updatedVmList = vmList.filter((_, i) => i !== index);
            setVmList(updatedVmList);
            saveVMsToLocalStorage(updatedVmList);
            setMessage("VM supprimée avec succès.");
        } catch (error) {
            console.error("Erreur lors de la suppression de la VM : ", error.message);
            setError("Erreur lors de la suppression de la VM : " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return {
        os,
        setOs,
        software,
        setSoftware,
        extensions,
        setExtensions,
        userName,
        setUserName,
        userPassword,
        setUserPassword,
        vmList,
        setVmList,
        loading,
        message,
        error,
        setLoading,
        handleCreateVm,
        fetchWindowsCredentials,
        handleDownloadSSH,
        handleDownloadVPN,
        handleDeleteVm
    };
}
