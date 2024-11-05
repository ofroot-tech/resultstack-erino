'use client';

import React, { useState, useEffect, ChangeEvent, useCallback } from 'react';
import axios from 'axios';

interface GitHubUser {
    id: number;
    login: string;
    avatar_url: string;
    html_url: string;
    name: string;
    location: string | null;
    email: string | null;
    public_repos: number;
    created_at: string;
    updated_at: string;
}

export default function UserSearchBar() {
    const [query, setQuery] = useState<string>('');
    const [results, setResults] = useState<GitHubUser[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState<number>(1);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [extendedUserId, setExtendedUserId] = useState<number | null>(null);

    const RESULTS_PER_PAGE = 5;

    const fetchResults = useCallback(async () => {
        if (!query.trim()) {
            setResults([]);
            setTotalCount(0);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await axios.get(`https://api.github.com/search/users`, {
                params: {
                    q: `${query} in:login`,
                    per_page: RESULTS_PER_PAGE,
                    page,
                },
            });

            setResults(response.data.items);
            setTotalCount(response.data.total_count);
        } catch (error) {
            setError("Unable to fetch results.");
            setResults([]);
            setTotalCount(0);
        } finally {
            setLoading(false);
        }
    }, [query, page]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchResults();
        }, 300);

        return () => clearTimeout(timer);
    }, [query, page, fetchResults]);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
        setPage(1);
        setError(null);
    };

    const handleNextPage = () => {
        if (page * RESULTS_PER_PAGE < totalCount) setPage((prevPage) => prevPage + 1);
    };

    const handlePrevPage = () => {
        if (page > 1) setPage((prevPage) => prevPage - 1);
    };

    const toggleExtended = (userId: number) => {
        setExtendedUserId((prevId) => (prevId === userId ? null : userId));
    };

    return (
        <div className="container">
            <input
                type="text"
                placeholder="Search GitHub users by name or email"
                value={query}
                onChange={handleInputChange}
                className="search-input"
            />
            {loading && <p>Loading...</p>}
            {error && <p className="error">{error}</p>}
            <div className="results-container">
                <ul>
                    {results.map((user) => (
                        <li
                            key={user.id}
                            className={`pill ${extendedUserId === user.id ? 'extended' : ''}`}
                            onClick={() => toggleExtended(user.id)}
                        >
                            <img src={user.avatar_url} alt={`${user.login}'s avatar`} className="avatar" />
                            <span className="username">{user.login}</span>
                            <span className="arrow">▼</span>

                            {extendedUserId === user.id && (
                                <div className="extended-content">
                                    <p><strong>Name:</strong> {user.name ?? 'N/A'}</p>
                                    <p><strong>Location:</strong> {user.location ?? 'N/A'}</p>
                                    <p><strong>Email:</strong> {user.email ?? 'N/A'}</p>
                                    <p><strong>Public Repos:</strong> {user.public_repos}</p>
                                    <p><strong>Account Created:</strong> {new Date(user.created_at).toLocaleDateString()}</p>
                                    <p><strong>Last Updated:</strong> {new Date(user.updated_at).toLocaleDateString()}</p>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            </div>

            <style jsx>{`
                .container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding: 40px 20px;
                    background-color: #f3f4f6;
                    height: 100vh;
                    text-align: left;
                    font-family: 'Roboto', sans-serif;
                }

                .search-input {
                    width: 100%;
                    max-width: 1200px;
                    padding: 15px;
                    font-size: 18px;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    outline: none;
                    margin-bottom: 20px;
                }

                .results-container {
                    width: 100%;
                    max-width: 600px;
                }

                ul {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }

                .pill {
                    display: flex;
                    align-items: center;
                    padding: 10px;
                    margin-bottom: 10px;
                    font-size: 18px;
                    background-color: #fff;
                    border: 1px solid #ddd;
                    border-radius: 20px;
                    transition: max-width 0.3s ease, padding 0.3s ease;
                    cursor: pointer;
                    max-width: 250px;
                    position: relative;
                }

                .pill.extended {
                    max-width: 100%;
                    padding: 10px 20px;
                }

                .avatar {
                    border-radius: 50%;
                    width: 40px;
                    height: 40px;
                }

                .username {
                    color: #007bff;
                    font-weight: bold;
                    margin-left: 10px;
                }

                .arrow {
                    margin-left: auto;
                    color: #888;
                    font-size: 18px;
                    transition: transform 0.3s ease;
                }

                /* Rotate the arrow when the pill is extended */
                .pill.extended .arrow {
                    transform: rotate(180deg);
                }

                .extended-content {
                    display: flex;
                    flex-direction: column;
                    margin-left: 60px;
                    font-size: 14px;
                    color: #333;
                    opacity: 0;
                    max-height: 0;
                    overflow: hidden;
                    transition: opacity 0.3s ease, max-height 0.3s ease;
                }

                /* Reveal the extended content smoothly */
                .pill.extended .extended-content {
                    opacity: 1;
                    max-height: 300px;
                }
            `}</style>
        </div>
    );
}
