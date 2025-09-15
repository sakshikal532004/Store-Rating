import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import RatingStars from '../RatingStars';
import { Store, Rating } from '../../types';
import { Modal } from '../ui';
import UpdatePasswordForm from '../forms/UpdatePasswordForm';

const API_URL = 'http://localhost:4000/api';

const UserDashboard: React.FC = () => {
    const { user, token } = useAuth();
    const [search, setSearch] = useState({ name: '', address: '' });
    const [stores, setStores] = useState<Store[]>([]);
    const [ratings, setRatings] = useState<Rating[]>([]);
    const [showPasswordModal, setShowPasswordModal] = useState(false);

    const fetchStores = useCallback(async () => {
        try {
            const response = await fetch(`${API_URL}/stores`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setStores(await response.json());
        } catch (error) {
            console.error("Failed to fetch stores", error);
        }
    }, [token]);
    
    useEffect(() => {
        const fetchUserRatings = async () => {
            try {
                const response = await fetch(`${API_URL}/ratings/user`, {
                     headers: { 'Authorization': `Bearer ${token}` }
                });
                setRatings(await response.json());
            } catch (error) {
                 console.error("Failed to fetch user ratings", error);
            }
        };
        
        fetchStores();
        fetchUserRatings();
    }, [token, fetchStores]);

    const handleRatingChange = async (storeId: number, value: number) => {
        try {
            const response = await fetch(`${API_URL}/ratings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ storeId, value })
            });
            const updatedRating = await response.json();
            if (!response.ok) throw new Error(updatedRating.message || 'Failed to submit rating');
            
            setRatings(prevRatings => {
                const existingIndex = prevRatings.findIndex(r => r.id === updatedRating.id);
                if (existingIndex > -1) {
                    const newRatings = [...prevRatings];
                    newRatings[existingIndex] = updatedRating;
                    return newRatings;
                }
                return [...prevRatings, updatedRating];
            });
            
            // Refetch stores to update the average rating in the UI
            await fetchStores();

        } catch (error) {
            console.error(error);
            alert(`Error: ${(error as Error).message}`);
        }
    };

    const getUserRating = (store: Store) => {
        return ratings.find(r => r.storeId === store.id)?.value || 0;
    };

    const filteredStores = useMemo(() => {
        return stores.filter(store =>
            store.name.toLowerCase().includes(search.name.toLowerCase()) &&
            store.address.toLowerCase().includes(search.address.toLowerCase())
        );
    }, [search, stores]);

    return (
        <>
            <Modal isOpen={showPasswordModal} onClose={() => setShowPasswordModal(false)} title="Change Your Password">
                <UpdatePasswordForm onCancel={() => setShowPasswordModal(false)} />
            </Modal>
            <div className="space-y-6">
                <div className="bg-white p-4 rounded-lg shadow-md">
                     <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">Find Stores</h2>
                        <button onClick={() => setShowPasswordModal(true)} className="px-4 py-2 text-sm bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
                            Change Password
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input 
                            type="text" 
                            placeholder="Search by store name..."
                            value={search.name}
                            onChange={e => setSearch(prev => ({ ...prev, name: e.target.value }))}
                            className="p-2 border rounded-md" 
                        />
                        <input 
                            type="text" 
                            placeholder="Search by address..."
                            value={search.address}
                            onChange={e => setSearch(prev => ({ ...prev, address: e.target.value }))}
                            className="p-2 border rounded-md" 
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredStores.map(store => {
                        const userRating = getUserRating(store);
                        return (
                            <div key={store.id} className="bg-white p-6 rounded-lg shadow-md space-y-4">
                                <div>
                                    <h3 className="text-lg font-bold text-indigo-700">{store.name}</h3>
                                    <p className="text-sm text-gray-500">{store.address}</p>
                                </div>
                                <div className="space-y-2">
                                     <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium">Overall Rating:</span>
                                        <span className="text-sm text-gray-500">{store.averageRating ? `${Number(store.averageRating).toFixed(1)} / 5.0` : 'No Ratings'}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium">Your Rating:</span>
                                        <RatingStars 
                                            count={5} 
                                            rating={userRating}
                                            onRatingChange={(newRating) => handleRatingChange(store.id, newRating)}
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                     {filteredStores.length === 0 && <p className="text-center text-gray-500 col-span-full">No stores found.</p>}
                </div>
            </div>
        </>
    );
};

export default UserDashboard;