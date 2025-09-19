import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { SortableTable } from '../SortableTable';
import { Rating } from '../../types';
import DashboardCard from '../DashboardCard';
import RatingStars from '../RatingStars';
import { Modal } from '../ui';
import UpdatePasswordForm from '../forms/UpdatePasswordForm';

const API_URL = 'http://localhost:4000/api';

interface UserRatingData {
    id: number;
    userName: string;
    userEmail: string;
    value: number;
}

const StoreOwnerDashboard: React.FC = () => {
    const { user, token } = useAuth();
    const [storeRatings, setStoreRatings] = useState<UserRatingData[]>([]);
    const [averageRating, setAverageRating] = useState(0);
    const [showPasswordModal, setShowPasswordModal] = useState(false);

    useEffect(() => {
        if (user?.storeId && token) {
            const fetchStoreData = async () => {
                try {
                    const response = await fetch(`${API_URL}/ratings/store/${user.storeId}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    const data = await response.json();
                    if (response.ok) {
                        setStoreRatings(data.ratings);
                        setAverageRating(data.averageRating);
                    } else {
                        throw new Error(data.message || "Failed to fetch store data");
                    }
                } catch (error) {
                    console.error(error);
                }
            };
            fetchStoreData();
        }
    }, [user, token]);
    
    const columns = [
        { header: 'User Name', accessor: 'userName' as keyof UserRatingData },
        { header: 'User Email', accessor: 'userEmail' as keyof UserRatingData },
        { 
            header: 'Rating', 
            accessor: 'value' as keyof UserRatingData, 
            render: (item: UserRatingData) => (
                <div className="flex items-center">
                    <RatingStars count={5} rating={item.value} readonly={true} />
                </div>
            )
        },
    ];

    if (!user?.storeId) {
        return <div className="text-center p-8 bg-white rounded-lg shadow-md">You are not assigned to any store.</div>;
    }

    return (
        <>
            <Modal isOpen={showPasswordModal} onClose={() => setShowPasswordModal(false)} title="Change Your Password">
                <UpdatePasswordForm onCancel={() => setShowPasswordModal(false)} />
            </Modal>
            <div className="space-y-8">
                 <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Store Owner Dashboard</h2>
                        <p className="text-gray-500">Welcome, {user.name}!</p>
                    </div>
                    <button onClick={() => setShowPasswordModal(true)} className="px-4 py-2 bg-white border border-gray-300 text-gray-800 rounded-md hover:bg-gray-50 text-sm font-medium self-start sm:self-center">
                        Change Password
                    </button>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-bold mb-4">Your Store's Performance</h3>
                    <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start text-center sm:text-left gap-6 p-4 bg-indigo-50 rounded-lg">
                        <div className="flex-shrink-0">
                             <p className="text-5xl font-bold text-indigo-600">{averageRating.toFixed(1)}</p>
                             <RatingStars count={5} rating={averageRating} readonly={true} size={7} />
                        </div>
                        <div>
                             <p className="text-lg text-gray-700">Average rating based on <span className="font-bold">{storeRatings.length}</span> user review(s).</p>
                             <p className="text-sm text-gray-500 mt-1">Keep up the great work and encourage more customers to leave a rating!</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-bold mb-4">User Ratings Received</h3>
                    <SortableTable<UserRatingData> columns={columns} data={storeRatings} />
                </div>
            </div>
        </>
    );
};

export default StoreOwnerDashboard;