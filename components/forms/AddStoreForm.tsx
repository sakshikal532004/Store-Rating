import React, { useState, useMemo } from 'react';
import { Store, User, UserRole } from '../../types';

interface AddStoreFormProps {
  onAddStore: (store: Omit<Store, 'id' | 'averageRating'>) => void;
  onCancel: () => void;
  users: User[];
}

const AddStoreForm: React.FC<AddStoreFormProps> = ({ onAddStore, onCancel, users }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [ownerId, setOwnerId] = useState<number | undefined>(undefined);
    
    const canSubmit = name && email && address;

    const potentialOwners = useMemo(() => {
        return users.filter(u => u.role === UserRole.StoreOwner && !u.storeId);
    }, [users]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!canSubmit) return;
        onAddStore({ name, email, address, ownerId });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="store-name" className="block text-sm font-medium text-gray-700">Store Name</label>
                <input type="text" id="store-name" value={name} onChange={e => setName(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div>
                <label htmlFor="store-email" className="block text-sm font-medium text-gray-700">Contact Email</label>
                <input type="email" id="store-email" value={email} onChange={e => setEmail(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div>
                <label htmlFor="store-address" className="block text-sm font-medium text-gray-700">Address</label>
                <textarea id="store-address" value={address} onChange={e => setAddress(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div>
                <label htmlFor="ownerId" className="block text-sm font-medium text-gray-700">Assign Owner (Optional)</label>
                <select
                    id="ownerId"
                    value={ownerId || ''}
                    onChange={e => setOwnerId(e.target.value ? parseInt(e.target.value) : undefined)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white"
                >
                    <option value="">No Owner</option>
                    {potentialOwners.map(owner => (
                        <option key={owner.id} value={owner.id}>{owner.name} ({owner.email})</option>
                    ))}
                </select>
            </div>
             <div className="flex justify-end gap-4 pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
                <button type="submit" disabled={!canSubmit} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-300">Add Store</button>
            </div>
        </form>
    );
};

export default AddStoreForm;
