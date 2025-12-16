import React, { useState } from 'react';
import { Save, User, Lock, Globe } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Settings = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState({
        name: user?.name || 'Admin User',
        email: user?.email || 'admin@yayou.com',
        phone: '+221 77 000 00 00'
    });

    const [password, setPassword] = useState({
        current: '',
        new: '',
        confirm: ''
    });

    const [siteSettings, setSiteSettings] = useState({
        siteName: 'Complexe Yayou Baye Niass',
        contactEmail: 'contact@yayoubayeniass.com',
        maintenanceMode: false
    });

    const handleSaveProfile = (e: React.FormEvent) => {
        e.preventDefault();
        alert('Profil mis à jour avec succès (Simulation)');
    };

    const handleSavePassword = (e: React.FormEvent) => {
        e.preventDefault();
        alert('Mot de passe modifié avec succès (Simulation)');
        setPassword({ current: '', new: '', confirm: '' });
    };

    const handleSaveSite = (e: React.FormEvent) => {
        e.preventDefault();
        alert('Paramètres du site mis à jour (Simulation)');
    };

    return (
        <div className="py-6 space-y-8">
            <h1 className="text-2xl font-semibold text-gray-900">Paramètres</h1>

            {/* Profile Settings */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center mb-4">
                        <User className="h-5 w-5 mr-2 text-indigo-500" />
                        Profil Administrateur
                    </h3>
                    <form onSubmit={handleSaveProfile} className="space-y-4">
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Nom complet</label>
                                <input
                                    type="text"
                                    value={profile.name}
                                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <input
                                    type="email"
                                    value={profile.email}
                                    onChange={(e) => setProfile({...profile, email: e.target.value})}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Téléphone</label>
                                <input
                                    type="text"
                                    value={profile.phone}
                                    onChange={(e) => setProfile({...profile, phone: e.target.value})}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <button type="submit" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                                <Save className="h-4 w-4 mr-2" /> Enregistrer
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Security Settings */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center mb-4">
                        <Lock className="h-5 w-5 mr-2 text-indigo-500" />
                        Sécurité
                    </h3>
                    <form onSubmit={handleSavePassword} className="space-y-4">
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Mot de passe actuel</label>
                                <input
                                    type="password"
                                    value={password.current}
                                    onChange={(e) => setPassword({...password, current: e.target.value})}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Nouveau mot de passe</label>
                                <input
                                    type="password"
                                    value={password.new}
                                    onChange={(e) => setPassword({...password, new: e.target.value})}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Confirmer</label>
                                <input
                                    type="password"
                                    value={password.confirm}
                                    onChange={(e) => setPassword({...password, confirm: e.target.value})}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <button type="submit" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                                <Save className="h-4 w-4 mr-2" /> Modifier le mot de passe
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Site Settings */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center mb-4">
                        <Globe className="h-5 w-5 mr-2 text-indigo-500" />
                        Configuration du Site
                    </h3>
                    <form onSubmit={handleSaveSite} className="space-y-4">
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                             <div>
                                <label className="block text-sm font-medium text-gray-700">Nom du site</label>
                                <input
                                    type="text"
                                    value={siteSettings.siteName}
                                    onChange={(e) => setSiteSettings({...siteSettings, siteName: e.target.value})}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email de contact</label>
                                <input
                                    type="email"
                                    value={siteSettings.contactEmail}
                                    onChange={(e) => setSiteSettings({...siteSettings, contactEmail: e.target.value})}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>
                        </div>
                        <div className="flex items-center">
                            <input
                                id="maintenance"
                                type="checkbox"
                                checked={siteSettings.maintenanceMode}
                                onChange={(e) => setSiteSettings({...siteSettings, maintenanceMode: e.target.checked})}
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            />
                            <label htmlFor="maintenance" className="ml-2 block text-sm text-gray-900">
                                Mode Maintenance (Site inaccessible aux clients)
                            </label>
                        </div>
                        <div className="flex justify-end">
                            <button type="submit" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                                <Save className="h-4 w-4 mr-2" /> Enregistrer les paramètres
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Settings;