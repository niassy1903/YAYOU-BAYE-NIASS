import React, { useState, useEffect } from 'react';
import { Eye, Truck, CheckCircle, XCircle, Clock, X, ShoppingBag } from 'lucide-react';
import api from '../../services/api';
import { Order, OrderItem } from '../../types';

const Orders = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    useEffect(() => {
        api.get('/orders')
           .then(res => {
               setOrders(res.data.map((o:any) => ({...o, id: o._id})));
               setLoading(false);
           })
           .catch(err => {
               console.error(err);
               setLoading(false);
           });
    }, []);

    const updateStatus = async (id: string, newStatus: string) => {
        try {
            await api.put(`/orders/${id}/status`, { status: newStatus });
            setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus as any } : o));
            if (selectedOrder && selectedOrder.id === id) {
                setSelectedOrder({ ...selectedOrder, status: newStatus as any });
            }
        } catch (error) {
            alert('Erreur lors de la mise à jour');
        }
    };

    const getStatusBadge = (status: string) => {
        switch(status) {
            case 'Delivered': return <span className="flex items-center text-green-700 bg-green-100 px-3 py-1 rounded-full text-xs font-bold"><CheckCircle className="h-3 w-3 mr-1"/> Livré</span>;
            case 'Shipped': return <span className="flex items-center text-blue-700 bg-blue-100 px-3 py-1 rounded-full text-xs font-bold"><Truck className="h-3 w-3 mr-1"/> Expédié</span>;
            case 'Pending': return <span className="flex items-center text-yellow-700 bg-yellow-100 px-3 py-1 rounded-full text-xs font-bold"><Clock className="h-3 w-3 mr-1"/> En attente</span>;
            case 'Cancelled': return <span className="flex items-center text-red-700 bg-red-100 px-3 py-1 rounded-full text-xs font-bold"><XCircle className="h-3 w-3 mr-1"/> Annulé</span>;
            default: return status;
        }
    };

    const getItemName = (item: OrderItem) => {
        // Handle populated vs non-populated products
        if (typeof item.productId === 'object' && item.productId !== null) {
            return (item.productId as any).name;
        }
        return "Produit";
    };

    return (
        <div className="py-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Suivi des Commandes</h1>
            
            <div className="bg-white shadow-sm overflow-hidden border border-gray-200 rounded-xl">
                {loading ? <div className="p-8 text-center text-gray-500">Chargement...</div> : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Client</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Total</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Statut</th>
                                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {orders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">#{order.id?.substring(0,8)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {(order.userId as any)?.name || 'Client'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(order.date).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{order.total.toLocaleString()} FCFA</td>
                                    <td className="px-6 py-4 whitespace-nowrap cursor-pointer" onClick={() => updateStatus(order.id!, order.status === 'Pending' ? 'Shipped' : 'Delivered')}>
                                        {getStatusBadge(order.status)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button 
                                            onClick={() => setSelectedOrder(order)}
                                            className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 px-3 py-1.5 rounded-lg flex items-center justify-center ml-auto transition-colors"
                                        >
                                            <Eye className="h-4 w-4 mr-1" /> Voir
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                )}
            </div>

            {/* Order Details Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" onClick={() => setSelectedOrder(null)}>
                            <div className="absolute inset-0 bg-gray-900 opacity-75"></div>
                        </div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 flex items-center">
                                            <ShoppingBag className="mr-2 h-5 w-5 text-indigo-600" />
                                            Commande #{selectedOrder.id?.substring(0,8)}
                                        </h3>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Passée le {new Date(selectedOrder.date).toLocaleDateString()} par <span className="font-medium text-gray-900">{(selectedOrder.userId as any)?.name || 'Client'}</span>
                                        </p>
                                    </div>
                                    <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-gray-500 bg-gray-100 rounded-full p-1">
                                        <X className="h-6 w-6" />
                                    </button>
                                </div>

                                <div className="border-t border-gray-100 py-4">
                                    <h4 className="font-bold text-gray-700 mb-3">Articles</h4>
                                    <ul className="divide-y divide-gray-100">
                                        {selectedOrder.items.map((item, index) => (
                                            <li key={index} className="py-3 flex justify-between items-center">
                                                <div className="flex items-center">
                                                    <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 mr-3">
                                                        <ShoppingBag className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900">{getItemName(item)}</p>
                                                        <p className="text-sm text-gray-500">Quantité: {item.quantity}</p>
                                                    </div>
                                                </div>
                                                <p className="font-medium text-gray-900">
                                                    {(item.price * item.quantity).toLocaleString()} FCFA
                                                </p>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="border-t border-gray-100 pt-4 mt-2 bg-gray-50 -mx-6 -mb-4 px-6 pb-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-gray-600 font-medium">Total Commande</span>
                                        <span className="text-2xl font-bold text-indigo-600">{selectedOrder.total.toLocaleString()} FCFA</span>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-3">
                                        {selectedOrder.status !== 'Cancelled' && (
                                            <button 
                                                onClick={() => updateStatus(selectedOrder.id!, 'Cancelled')}
                                                className="w-full py-2 border border-red-200 text-red-600 rounded-lg font-medium hover:bg-red-50 transition-colors"
                                            >
                                                Annuler la commande
                                            </button>
                                        )}
                                        {selectedOrder.status === 'Pending' && (
                                            <button 
                                                onClick={() => updateStatus(selectedOrder.id!, 'Shipped')}
                                                className="w-full py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-colors"
                                            >
                                                Marquer comme expédiée
                                            </button>
                                        )}
                                        {selectedOrder.status === 'Shipped' && (
                                            <button 
                                                onClick={() => updateStatus(selectedOrder.id!, 'Delivered')}
                                                className="w-full py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-colors"
                                            >
                                                Marquer comme livrée
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Orders;