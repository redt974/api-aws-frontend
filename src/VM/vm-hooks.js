import { useState } from 'react';
import { postData } from '../services/api.js';

export default function VMHooks() {
    const [os, setOs] = useState('');
    const [software, setSoftware] = useState([]);
    const [extensions, setExtensions] = useState([]);
    const [userName, setUserName] = useState('');
    const [userPassword, setUserPassword] = useState('');
    const [vmList, setVmList] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleCreateVm = async () => {
        if (!os) {
            alert('Veuillez sélectionner un OS.');
            return;
        }

        if (os.startsWith('Windows') && (!userName || !userPassword)) {
            alert('Veuillez fournir un nom d\'utilisateur et un mot de passe pour Windows.');
            return;
        }

        setLoading(true);
        try {

            const data = os.startsWith('Windows') ? await postData('api/vm/create', { os, software, extensions, user_name: userName, user_password: userPassword }) : await postData('api/vm/create', { os, software, extensions });

            if (!data.public_ip || !data.ssh_private_key) {
                throw new Error('Réponse invalide de l’API.');
            }

            alert('VM créée avec succès.');
            setVmList([
                ...vmList,
                {
                    ip: data.public_ip,
                    ssh_private_key_path: data.ssh_private_key,
                    output: data.message,
                    instanceId: data.instance_id, // Ajout de l'instanceId pour Windows
                    os: os,
                },
            ]);
        } catch (err) {
            console.error(err);
            alert('Erreur lors de la création de la VM : ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchWindowsCredentials = async (vm) => {
        try {
            const data = await postData(
                'api/vm/windows-password', // URL de l'API pour récupérer le mot de passe Windows
                {
                    instanceId: vm.instanceId, // ID de l'instance EC2
                    privateKeyPath: vm.ssh_private_key_path, // Chemin vers la clé privée
                }
            );

            if (!data || !data.ip || !data.username || !data.password) {
                throw new Error('Réponse invalide de l’API.');
            }

            alert(
                `Accès RDP :\nIP : ${data.ip}\nUtilisateur : ${data.username}\nMot de passe : ${data.password}`
            );
        } catch (error) {
            console.error(error);
            alert('Impossible de récupérer les identifiants RDP.');
        }
    };

    const handleDeleteVm = async (index) => {
        setLoading(true);
        try {
            await postData(
                'api/vm/delete',
                {},
                null,
                null
            );

            alert('VM supprimée avec succès.');
            const updatedVmList = [...vmList];
            updatedVmList.splice(index, 1);
            setVmList(updatedVmList);
        } catch (err) {
            console.error(err);
            alert('Erreur lors de la suppression de la VM : ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    return {
        os, setOs, software, setSoftware, extensions, setExtensions,
        userName, setUserName, userPassword, setUserPassword, vmList, setVmList,
        loading, setLoading, handleCreateVm, fetchWindowsCredentials, handleDeleteVm
    };
}
