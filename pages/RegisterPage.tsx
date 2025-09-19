import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const validationErrors = useMemo(() => {
        const errors: { [key: string]: string } = {};
        if (name && (name.length < 3 || name.length > 60)) {
            errors.name = 'Name must be between 3 and 60 characters.';
        }
        if (address && address.length > 400) {
            errors.address = 'Address must not exceed 400 characters.';
        }
        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errors.email = 'Please enter a valid email address.';
        }
        if (password && (password.length < 8 || password.length > 16)) {
            errors.password = 'Password must be 8-16 characters long.';
        } else if (password && !/(?=.*[A-Z])/.test(password)) {
            errors.password = 'Password must include at least one uppercase letter.';
        } else if (password && !/(?=.*[!@#$%^&*])/.test(password)) {
            errors.password = 'Password must include at least one special character.';
        }
        return errors;
    }, [name, email, address, password]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (Object.keys(validationErrors).length > 0) {
            setError("Please fix the errors before submitting.");
            return;
        }
        setError('');
        try {
            await register({ name, email, password, address });
            navigate('/dashboard/user');
        } catch (err: any) {
            setError(err.message || 'Failed to register. Please try again.');
        }
    };
    
    type FieldStates = { name: string; email: string; address: string; password: string };
    const fieldStates: FieldStates = { name, email, address, password };

    const getInputBorderClass = (field: keyof FieldStates) => {
        if (!fieldStates[field]) return 'border-gray-300';
        return validationErrors[field] ? 'border-red-500' : 'border-green-500';
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Create a new account
                    </h2>
                </div>
                <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
                    {error && <p className="text-center bg-red-100 text-red-700 p-3 rounded-md">{error}</p>}
                    <div>
                        <label htmlFor="name">Name</label>
                        <input id="name" name="name" type="text" required value={name} onChange={(e) => setName(e.target.value)}
                            className={`w-full px-3 py-2 border ${getInputBorderClass('name')} rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`} />
                        {name && validationErrors.name && <p className="text-red-500 text-xs mt-1">{validationErrors.name}</p>}
                    </div>
                    <div>
                        <label htmlFor="email">Email address</label>
                        <input id="email" name="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                            className={`w-full px-3 py-2 border ${getInputBorderClass('email')} rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`} />
                        {email && validationErrors.email && <p className="text-red-500 text-xs mt-1">{validationErrors.email}</p>}
                    </div>
                    <div>
                        <label htmlFor="address">Address</label>
                        <textarea id="address" name="address" required value={address} onChange={(e) => setAddress(e.target.value)}
                            className={`w-full px-3 py-2 border ${getInputBorderClass('address')} rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`} />
                        {address && validationErrors.address && <p className="text-red-500 text-xs mt-1">{validationErrors.address}</p>}
                    </div>
                    <div>
                        <label htmlFor="password">Password</label>
                        <input id="password" name="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                            className={`w-full px-3 py-2 border ${getInputBorderClass('password')} rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`} />
                        {password && validationErrors.password && <p className="text-red-500 text-xs mt-1">{validationErrors.password}</p>}
                    </div>
                    <div>
                        <button type="submit" disabled={Object.keys(validationErrors).length > 0}
                            className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300">
                            Sign up
                        </button>
                    </div>
                </form>
                <div className="text-sm text-center">
                    <p>
                        Already have an account?{' '}
                        <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                            Sign in
                        </Link>
                    </p>
                </div>
                 <div className="text-sm text-center">
                    <Link to="/" className="font-medium text-indigo-600 hover:text-indigo-500">
                       &larr; Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;