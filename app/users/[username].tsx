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
                // Replace 'YOUR_GITHUB_PERSONAL_ACCESS_TOKEN' with your actual GitHub token if needed
                const response = await axios.get<User>(`https://api.github.com/users/${username}`, {
                    headers: {
                        Authorization: `token YOUR_GITHUB_PERSONAL_ACCESS_TOKEN`, // Optional: add GitHub token if you have one
                    },
                });

                console.log("API Response:", response.data); // Log API response for debugging
                setUser(response.data);
            } catch (error) {
                console.error("Fetch error:", error); // Log the error for debugging
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
            <p>Location: {user.location ?? 'Not provided'}</p>
            <p>Email: {user.email ?? 'Not provided'}</p>
            <p>Public Repositories: {user.public_repos ?? 'N/A'}</p>
            <p>Account Created: {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</p>
            <p>Last Updated: {user.updated_at ? new Date(user.updated_at).toLocaleDateString() : 'N/A'}</p>

            {/* Optional JSON output for debugging */}
            <pre>{JSON.stringify(user, null, 2)}</pre>
        </div>
    ) : (
        <p>User not found.</p>
    );
};

export default UserProfile;
