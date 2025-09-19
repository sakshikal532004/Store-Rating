import React, { useState, useMemo } from 'react';
import { User, UserRole, Store } from '../../types';

interface AddUserFormProps {
  onAddUser: (user: Omit<User, 'id'>) => void;
  onCancel: () => void;
  stores: Store[];
  users: User[];
}

const AddUserForm: React.FC<AddUserFormProps> = ({ onAddUser, onCancel, stores, users }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [address, setAddress] = useState('');
    const [role, setRole] = useState<UserRole>(UserRole.Normal);
    const [storeId, setStoreId] = useState<number | undefined>(undefined);

    const canSubmit = name && email && password && address;

    const availableStores = useMemo(() => {
        const assignedStoreIds = users
            .filter(u => u.role === UserRole.StoreOwner && u.storeId)
            .map(u => u.storeId);
        return stores.filter(s => !assignedStoreIds.includes(s.id));
    }, [stores, users]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!canSubmit) return;
        
        const userData: Omit<User, 'id'> = { name, email, password, address, role };
        if (role === UserRole.StoreOwner && storeId) {
            userData.storeId = storeId;
        }
        
        onAddUser(userData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
             <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                <input type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                <textarea id="address" value={address} onChange={e => setAddress(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
                <select id="role" value={role} onChange={e => setRole(e.target.value as UserRole)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white">
                    {Object.values(UserRole).map(r => <option key={r} value={r}>{r}</option>)}
                </select>
            </div>
            
            {role === UserRole.StoreOwner && (
                <div>
                    <label htmlFor="storeId" className="block text-sm font-medium text-gray-700">Assign to Store (Optional)</label>
                    <select 
                        id="storeId" 
                        value={storeId || ''} 
                        onChange={e => setStoreId(e.target.value ? parseInt(e.target.value) : undefined)} 
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white"
                    >
                        <option value="">Select a store...</option>
                        {availableStores.map(store => <option key={store.id} value={store.id}>{store.name}</option>)}
                    </select>
                </div>
            )}

            <div className="flex justify-end gap-4 pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
                <button type="submit" disabled={!canSubmit} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-300">Add User</button>
            </div>
        </form>
    );
};

export default AddUserForm;