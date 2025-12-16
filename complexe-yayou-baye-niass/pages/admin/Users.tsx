import React, { useState, useEffect } from 'react';
import { Trash, Mail, User as UserIcon, Plus, Edit, X, Lock } from 'lucide-react';
import api from '../../services/api';
import { User, UserRole } from '../../types';

const Users = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Form state
    const initialFormState = {
        name: '',
        email: '',
        password: '',
        role: UserRole.CLIENT as UserRole
    };
    const [formData, setFormData] = useState(initialFormState);

    const fetchUsers = () => {
        setLoading(true);
        api.get('/users')
           .then(res => {
               setUsers(res.data.map((u:any) => ({...u, id: u._id})));
               setLoading(false);
           })
           .catch(err => {
               console.error(err);
               setLoading(false);
           });
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = async (id: string) => {
        if(window.confirm('Voulez-vous vraiment supprimer cet utilisateur ?')) {
            try {
                await api.delete(`/users/${id}`);
                setUsers(users.filter(u => u.id !== id));
            } catch (err) {
                alert("Erreur lors de la suppression");
            }
        }
    };

    const handleEdit = (user: User) => {
        setEditingId(user.id || user._id);
        setFormData({
            name: user.name,
            email: user.email,
            password: '', // Password not filled for security
            role: user.role
        });
        setIsModalOpen(true);
    };

    const openAddModal = () => {
        setEditingId(null);
        setFormData(initialFormState);
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingId) {
                // Update
                const updateData: any = { 
                    name: formData.name, 
                    email: formData.email,
                    role: formData.role
                };
                // Only send password if provided (assuming backend handles logic to ignore empty)
                // Note: The backend snippet provided earlier handles update, but not password update via updateRoute easily.
                // It had a separate change-password route. We will update info here.
                await api.put(`/users/${editingId}`, updateData);
            } else {
                // Create (using Signup endpoint but ignoring the login token side effect)
                await api.post('/auth/signup', formData);
            }
            fetchUsers();
            setIsModalOpen(false);
        } catch (error: any) {
            alert(error.response?.data?.message || 'Une erreur est survenue');
        }
    };

    return (
        <div className="py-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Gestion des Clients</h1>
                <button 
                    onClick={openAddModal}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter un client
                </button>
            </div>
            
            <div className="bg-white shadow-sm overflow-hidden border border-gray-200 rounded-xl">
                {loading ? <div className="p-8 text-center text-gray-500">Chargement...</div> : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Nom</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Email</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Rôle</th>
                                <th scope="col" className="relative px-6 py-4 text-right"><span className="sr-only">Actions</span></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">
                                                {user.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-bold text-gray-900">{user.name}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-600 flex items-center">
                                            <Mail className="h-4 w-4 mr-2 text-gray-400" /> {user.email}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {user.joinDate ? new Date(user.joinDate).toLocaleDateString() : '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2.5 py-0.5 inline-flex text-xs font-bold rounded-full ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={() => handleEdit(user)} className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 p-2 rounded-lg mr-2 transition-colors">
                                            <Edit className="h-4 w-4" />
                                        </button>
                                        <button onClick={() => handleDelete(user.id!)} className="text-red-600 hover:text-red-900 bg-red-50 p-2 rounded-lg transition-colors">
                                            <Trash className="h-4 w-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" onClick={() => setIsModalOpen(false)}>
                            <div className="absolute inset-0 bg-gray-900 opacity-75"></div>
                        </div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="flex justify-between items-center mb-5">
                                    <h3 className="text-xl font-bold text-gray-900">
                                        {editingId ? 'Modifier Utilisateur' : 'Ajouter Utilisateur'}
                                    </h3>
                                    <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-500 bg-gray-100 rounded-full p-1">
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <UserIcon className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input 
                                                type="text" 
                                                required
                                                value={formData.name}
                                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                                className="block w-full pl-10 border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2.5 border"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Mail className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input 
                                                type="email" 
                                                required
                                                value={formData.email}
                                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                                className="block w-full pl-10 border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2.5 border"
                                            />
                                        </div>
                                    </div>
                                    {!editingId && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <Lock className="h-5 w-5 text-gray-400" />
                                                </div>
                                                <input 
                                                    type="password" 
                                                    required={!editingId}
                                                    value={formData.password}
                                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                                    className="block w-full pl-10 border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2.5 border"
                                                />
                                            </div>
                                        </div>
                                    )}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Rôle</label>
                                        <select 
                                            value={formData.role}
                                            onChange={(e) => setFormData({...formData, role: e.target.value as UserRole})}
                                            className="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2.5 border"
                                        >
                                            <option value={UserRole.CLIENT}>Client</option>
                                            <option value={UserRole.ADMIN}>Administrateur</option>
                                        </select>
                                    </div>
                                    <div className="pt-4">
                                        <button
                                            type="submit"
                                            className="w-full inline-flex justify-center rounded-xl border border-transparent shadow-lg px-4 py-3 bg-indigo-600 text-base font-bold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all hover:-translate-y-0.5"
                                        >
                                            {editingId ? 'Mettre à jour' : 'Créer le compte'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Users;