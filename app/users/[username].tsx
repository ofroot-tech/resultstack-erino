// pages/users/[username].tsx
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

interface User {
    login: string;
    avatar_url: string;
    name: string;
    location: string | null;
    email: string | null;
    public_repos: number;
    created_at: string;
    updated_at: string;
}

const UserProfile = () => {
    const router = useRouter();
    const { username } = router.query;
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserDetails = async () => {
            if (!username) return;
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get<User>(`https://api.github.com/users/${username}`);
                setUser(response.data);
            } catch (error) {
                setError('Failed to load user data');
            } finally {
                setLoading(false);
            }
        };

        fetchUserDetails();
    }, [username]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return user ? (
        <div className="user-profile">
            <img src={user.avatar_url} alt={user.login} />
            <h2>{user.name || user.login}</h2>
            <p>Location: {user.location || 'N/A'}</p>
            <p>Email: {user.email || 'N/A'}</p>
            <p>Public Repositories: {user.public_repos}</p>
            <p>Account Created: {new Date(user.created_at).toLocaleDateString()}</p>
            <p>Last Updated: {new Date(user.updated_at).toLocaleDateString()}</p>
        </div>
    ) : (
        <p>User not found.</p>
    );
};

export default UserProfile;
