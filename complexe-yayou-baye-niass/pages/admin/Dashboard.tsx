import React, { useEffect, useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import { Users, DollarSign, ShoppingBag, TrendingUp, Activity, Package } from 'lucide-react';
import api from '../../services/api';

const StatCard = ({ title, value, icon: Icon, color, subValue }: any) => (
  <div className="bg-white overflow-hidden shadow-sm hover:shadow-lg transition-shadow rounded-2xl border border-gray-100">
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div>
           <p className="text-sm font-medium text-gray-500 truncate mb-1">{title}</p>
           <div className="text-2xl font-bold text-gray-900">{value}</div>
        </div>
        <div className={`rounded-xl p-3 ${color} bg-opacity-10`}>
           <Icon className={`h-6 w-6 ${color.replace('bg-', 'text-')}`} />
        </div>
      </div>
      <div className="mt-4">
        <span className="text-sm text-gray-500">{subValue}</span>
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    revenue: 0,
    users: 0,
    orders: 0,
    products: 0
  });
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, ordersRes, productsRes] = await Promise.all([
          api.get('/users'),
          api.get('/orders'),
          api.get('/products')
        ]);

        const orders = ordersRes.data;
        
        // Calculate Total Revenue (ignoring cancelled)
        const totalRevenue = orders
          .filter((o: any) => o.status !== 'Cancelled')
          .reduce((acc: number, curr: any) => acc + curr.total, 0);

        setStats({
          revenue: totalRevenue,
          users: usersRes.data.length,
          orders: orders.length,
          products: productsRes.data.length
        });

        // Prepare Chart Data (Revenue by Date - Last 7 entries or grouped)
        // Simple grouping by date for demo
        const groupedOrders: Record<string, number> = {};
        orders.forEach((o: any) => {
            const date = new Date(o.date).toLocaleDateString('fr-FR', { weekday: 'short' });
            if (o.status !== 'Cancelled') {
                groupedOrders[date] = (groupedOrders[date] || 0) + o.total;
            }
        });

        // Convert to array
        const chart = Object.keys(groupedOrders).map(key => ({
            name: key,
            sales: groupedOrders[key]
        })).slice(-7); // Keep last 7

        // If empty, fill with dummy for visual
        if (chart.length === 0) {
            setChartData([
                { name: 'Lun', sales: 0 },
                { name: 'Mar', sales: 0 },
                { name: 'Mer', sales: 0 },
                { name: 'Jeu', sales: 0 },
                { name: 'Ven', sales: 0 },
                { name: 'Sam', sales: 0 },
                { name: 'Dim', sales: 0 },
            ]);
        } else {
            setChartData(chart);
        }

        setLoading(false);
      } catch (error) {
        console.error("Dashboard data fetch error", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
      return <div className="p-10 text-center text-gray-500">Chargement des données...</div>;
  }

  return (
    <div className="py-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
        <div className="text-sm text-gray-500">Mise à jour en temps réel</div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Chiffre d'affaires" 
          value={`${stats.revenue.toLocaleString()} FCFA`} 
          icon={DollarSign} 
          color="bg-indigo-600"
          subValue="Total des ventes validées"
        />
        <StatCard 
          title="Clients Inscrits" 
          value={stats.users} 
          icon={Users} 
          color="bg-blue-500"
          subValue="Utilisateurs actifs"
        />
        <StatCard 
          title="Commandes Totales" 
          value={stats.orders} 
          icon={ShoppingBag} 
          color="bg-pink-500"
          subValue="En attente et livrées"
        />
        <StatCard 
          title="Produits en catalogue" 
          value={stats.products} 
          icon={Package} 
          color="bg-amber-500"
          subValue="Référencés sur le site"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-indigo-600" />
              Performance des ventes
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af'}} />
                <Tooltip 
                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}}
                    formatter={(value: any) => [`${value.toLocaleString()} FCFA`, 'Ventes']}
                />
                <Area type="monotone" dataKey="sales" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Mini Stats / Targets */}
        <div className="bg-gradient-to-br from-gray-900 to-indigo-900 p-6 rounded-2xl shadow-lg text-white flex flex-col justify-between">
          <div>
              <h3 className="text-lg font-bold mb-2">Objectifs Mensuels</h3>
              <p className="text-indigo-200 text-sm mb-6">Progression vers les objectifs de vente</p>
              
              <div className="space-y-6">
                  <div>
                      <div className="flex justify-between text-sm mb-1">
                          <span>Chiffre d'affaires</span>
                          <span className="font-bold">75%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                          <div className="bg-indigo-400 h-2 rounded-full" style={{width: '75%'}}></div>
                      </div>
                  </div>
                  <div>
                      <div className="flex justify-between text-sm mb-1">
                          <span>Nouveaux Clients</span>
                          <span className="font-bold">45%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                          <div className="bg-pink-400 h-2 rounded-full" style={{width: '45%'}}></div>
                      </div>
                  </div>
                  <div>
                      <div className="flex justify-between text-sm mb-1">
                          <span>Commandes</span>
                          <span className="font-bold">90%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                          <div className="bg-green-400 h-2 rounded-full" style={{width: '90%'}}></div>
                      </div>
                  </div>
              </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-700">
              <div className="flex items-center justify-between">
                  <div>
                      <p className="text-xs text-indigo-300 uppercase font-bold tracking-wider">Meilleur Produit</p>
                      <p className="font-medium mt-1">Bazin Riche XL</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-400" />
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;