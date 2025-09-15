import React, { useState, useMemo, useEffect, useCallback } from 'react';
import DashboardCard from '../DashboardCard';
import { SortableTable } from '../SortableTable';
import { User, Store, UserRole, Rating } from '../../types';
import { Modal } from '../ui';
import AddUserForm from '../forms/AddUserForm';
import AddStoreForm from '../forms/AddStoreForm';
import { useAuth } from '../../context/AuthContext';

const API_URL = 'http://localhost:4000/api';

const AdminDashboard: React.FC = () => {
    const { token } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [stores, setStores] = useState<Store[]>([]);
    const [ratings, setRatings] = useState<Rating[]>([]);
    
    const [showAddUserModal, setShowAddUserModal] = useState(false);
    const [showAddStoreModal, setShowAddStoreModal] = useState(false);

    const [userFilter, setUserFilter] = useState({ name: '', email: '', address: '', role: '' });
    const [storeFilter, setStoreFilter] = useState({ name: '', email: '', address: '' });

    const fetchData = useCallback(async () => {
        const fetchResource = async (endpoint: string, setter: React.Dispatch<React.SetStateAction<any[]>>) => {
            try {
                const response = await fetch(`${API_URL}/${endpoint}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();
                setter(data);
            } catch (error) {
                console.error(`Failed to fetch ${endpoint}:`, error);
            }
        };

        await Promise.all([
            fetchResource('users', setUsers),
            fetchResource('stores', setStores),
            fetchResource('ratings', setRatings)
        ]);
    }, [token]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleAddUser = async (newUserData: Omit<User, 'id'>) => {
        try {
            const response = await fetch(`${API_URL}/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newUserData)
            });
            const newUser = await response.json();
            if (!response.ok) throw new Error(newUser.message || 'Failed to add user');
            
            setShowAddUserModal(false);
            fetchData(); // Refetch all data to ensure consistency
        } catch (error) {
            console.error(error);
            alert(`Error: ${(error as Error).message}`);
        }
    };

    const handleAddStore = async (newStoreData: Omit<Store, 'id' | 'averageRating'>) => {
         try {
            const response = await fetch(`${API_URL}/stores`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newStoreData)
            });
            const newStore = await response.json();
            if (!response.ok) throw new Error(newStore.message || 'Failed to add store');
            
            setShowAddStoreModal(false);
            fetchData(); // Refetch all data to ensure consistency
        } catch (error) {
            console.error(error);
            alert(`Error: ${(error as Error).message}`);
        }
    };

    const filteredUsers = useMemo(() => {
        return users.filter(user =>
            user.name.toLowerCase().includes(userFilter.name.toLowerCase()) &&
            user.email.toLowerCase().includes(userFilter.email.toLowerCase()) &&
            user.address.toLowerCase().includes(userFilter.address.toLowerCase()) &&
            (userFilter.role === '' || user.role === userFilter.role)
        );
    }, [userFilter, users]);

    const filteredStores = useMemo(() => {
        return stores.filter(store =>
            store.name.toLowerCase().includes(storeFilter.name.toLowerCase()) &&
            store.email.toLowerCase().includes(storeFilter.email.toLowerCase()) &&
            store.address.toLowerCase().includes(storeFilter.address.toLowerCase())
        );
    }, [storeFilter, stores]);

    const getStoreOwnerRating = (user: User) => {
        if (user.role !== UserRole.StoreOwner || !user.storeId) return 'N/A';
        const store = stores.find(s => s.id === user.storeId);
        if (!store || store.averageRating === null || typeof store.averageRating === 'undefined') {
            return 'No Ratings';
        }
        return `${Number(store.averageRating).toFixed(1)} / 5.0`;
    };

    const userColumns = [
        { header: 'Name', accessor: 'name' as keyof User },
        { header: 'Email', accessor: 'email' as keyof User },
        { header: 'Address', accessor: 'address' as keyof User },
        { header: 'Role', accessor: 'role' as keyof User },
        { header: 'Rating (Store Owner)', accessor: 'storeId' as keyof User, render: (user: User) => getStoreOwnerRating(user) },
    ];

    const storeColumns = [
        { header: 'Name', accessor: 'name' as keyof Store },
        { header: 'Email', accessor: 'email' as keyof Store },
        { header: 'Address', accessor: 'address' as keyof Store },
        { 
            header: 'Rating', 
            accessor: 'averageRating' as keyof Store, 
            render: (store: Store) => store.averageRating ? `${Number(store.averageRating).toFixed(1)} / 5.0` : 'No Ratings' 
        },
    ];
    
    const handleUserFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setUserFilter(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };
    
    const handleStoreFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setStoreFilter(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    return (
        <>
            <Modal isOpen={showAddUserModal} onClose={() => setShowAddUserModal(false)} title="Add New User">
                <AddUserForm onAddUser={handleAddUser} onCancel={() => setShowAddUserModal(false)} stores={stores} users={users} />
            </Modal>
            <Modal isOpen={showAddStoreModal} onClose={() => setShowAddStoreModal(false)} title="Add New Store">
                <AddStoreForm onAddStore={handleAddStore} onCancel={() => setShowAddStoreModal(false)} users={users} />
            </Modal>

            <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <DashboardCard title="Total Users" value={users.length} icon={<UserIcon />} />
                    <DashboardCard title="Total Stores" value={stores.length} icon={<StoreIcon />} />
                    <DashboardCard title="Total Submitted Ratings" value={ratings.length} icon={<StarIcon />} />
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">Manage Users</h2>
                        <button onClick={() => setShowAddUserModal(true)} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm font-medium">
                            + Add User
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <input type="text" name="name" placeholder="Filter by Name..." value={userFilter.name} onChange={handleUserFilterChange} className="p-2 border rounded-md" />
                        <input type="text" name="email" placeholder="Filter by Email..." value={userFilter.email} onChange={handleUserFilterChange} className="p-2 border rounded-md" />
                        <input type="text" name="address" placeholder="Filter by Address..." value={userFilter.address} onChange={handleUserFilterChange} className="p-2 border rounded-md" />
                        <select name="role" value={userFilter.role} onChange={handleUserFilterChange} className="p-2 border rounded-md bg-white">
                            <option value="">All Roles</option>
                            {Object.values(UserRole).map(role => <option key={role} value={role}>{role}</option>)}
                        </select>
                    </div>
                    <SortableTable<User> columns={userColumns} data={filteredUsers} />
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">Manage Stores</h2>
                         <button onClick={() => setShowAddStoreModal(true)} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm font-medium">
                            + Add Store
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <input type="text" name="name" placeholder="Filter by Name..." value={storeFilter.name} onChange={handleStoreFilterChange} className="p-2 border rounded-md" />
                        <input type="text" name="email" placeholder="Filter by Email..." value={storeFilter.email} onChange={handleStoreFilterChange} className="p-2 border rounded-md" />
                        <input type="text" name="address" placeholder="Filter by Address..." value={storeFilter.address} onChange={handleStoreFilterChange} className="p-2 border rounded-md" />
                    </div>
                    <SortableTable<Store> columns={storeColumns} data={filteredStores} />
                </div>
            </div>
        </>
    );
};

const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
const StoreIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M5 6h14M5 10h14M5 14h14M5 18h14" /></svg>;
const StarIcon = () => <svg xmlns="http://www.w.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.539 1.118l-3.975-2.888a1 1 0 00-1.175 0l-3.976 2.888c-.783.57-1.838-.196-1.539-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>;

export default AdminDashboard;