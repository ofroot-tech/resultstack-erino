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
    const [expandedUserId, setExpandedUserId] = useState<number | null>(null);

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
            console.log("Fetch error:", error);
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

    const toggleDetails = (userId: number) => {
        setExpandedUserId(expandedUserId === userId ? null : userId);
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
                        <li key={user.id} className="result-item">
                            <div className="user-info">
                                <img src={user.avatar_url} alt={`${user.login}'s avatar`} />
                                <a href={user.html_url} target="_blank" rel="noopener noreferrer">{user.login}</a>
                                <button onClick={() => toggleDetails(user.id)} className="dropdown-button">
                                    {expandedUserId === user.id ? '▲' : '▼'}
                                </button>
                            </div>

                            {expandedUserId === user.id && (
                                <div className="user-details">
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

            <div className="pagination">
                <button onClick={handlePrevPage} disabled={page === 1}>Previous</button>
                <span>Page {page}</span>
                <button onClick={handleNextPage} disabled={page * RESULTS_PER_PAGE >= totalCount}>Next</button>
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
                    max-width: 1200px;
                    margin-top: 20px;
                }

                .error {
                    color: red;
                    font-size: 14px;
                    margin-top: 5px;
                }

                ul {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }

                .result-item {
                    display: flex;
                    flex-direction: column;
                    padding: 15px 20px;
                    border-radius: 999px;
                    background-color: #ffffff;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    margin-bottom: 15px;
                    font-size: 18px;
                    position: relative;
                }

                .user-info {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .user-info img {
                    border-radius: 50%;
                    width: 50px;
                    height: 50px;
                }

                .user-info a {
                    color: #007bff;
                    text-decoration: none;
                    font-weight: bold;
                    flex-grow: 1;
                }

                .user-info a:hover {
                    text-decoration: underline;
                }

                .dropdown-button {
                    background: none;
                    border: none;
                    font-size: 18px;
                    cursor: pointer;
                }

                .user-details {
                    margin-top: 10px;
                    padding: 10px;
                    background-color: #f9f9f9;
                    border-radius: 8px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                }

                .user-details p {
                    margin: 5px 0;
                    font-size: 14px;
                }

                .pagination {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin-top: 20px;
                }

                .pagination button {
                    padding: 8px 16px;
                    font-size: 16px;
                    color: white;
                    background-color: #007bff;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                }

                .pagination button:disabled {
                    background-color: #ddd;
                    cursor: not-allowed;
                }
            `}</style>
        </div>
    );
}
