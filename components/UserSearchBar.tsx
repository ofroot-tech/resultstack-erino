'use client';

import React, { useState, useEffect, ChangeEvent, useCallback } from 'react';
import axios from 'axios';

// Interface for GitHub user data structure
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
    // State Management
    // Stores the current search input
    const [query, setQuery] = useState<string>('');
    // Holds the list of GitHub users fetched from the API
    const [results, setResults] = useState<GitHubUser[]>([]);
    // Indicates if a fetch request is in progress
    const [loading, setLoading] = useState<boolean>(false);
    // Stores error messages in case the API call fails
    const [error, setError] = useState<string | null>(null);
    // Tracks the current page of results for pagination
    const [page, setPage] = useState<number>(1);
    // Keeps track of the total number of users found
    const [totalCount, setTotalCount] = useState<number>(0);
    // Identifies the user currently being hovered over to display additional information
    const [hoveredUserId, setHoveredUserId] = useState<number | null>(null);

    // Set the number of results per page to 5 for pagination
    const RESULTS_PER_PAGE = 5;

    // Debounced function to fetch results
    // Implements a debounce effect to limit API requests, waiting 300ms after typing to start a new search
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
                    q: `${query} in:login`, // Enable partial matching within username
                    per_page: RESULTS_PER_PAGE,
                    page,
                },
            });

            // Directly set items to avoid extra requests
            setResults(response.data.items);
            setTotalCount(response.data.total_count);
        } catch (error) {
            // If an API request fails, display an error message
            setError("Unable to fetch results.");
            setResults([]); // Reset to empty state on a failed fetch
            setTotalCount(0);
        } finally {
            setLoading(false);
        }
    }, [query, page]);

    // Debounce effect to reduce API calls while typing
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchResults();
        }, 300); // Delay API call by 300ms

        return () => clearTimeout(timer);
    }, [query, page, fetchResults]);

    // Updates query state on input change and resets page to 1 for new search
    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
        setPage(1);
        setError(null);
    };

    // Pagination controls to navigate through results
    const handleNextPage = () => {
        if (page * RESULTS_PER_PAGE < totalCount) setPage((prevPage) => prevPage + 1);
    };

    const handlePrevPage = () => {
        if (page > 1) setPage((prevPage) => prevPage - 1);
    };

    return (
        <div className="container">
            {/* Input field for search query */}
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
                            className="result-item"
                            onMouseEnter={() => setHoveredUserId(user.id)}
                            onMouseLeave={() => setHoveredUserId(null)}
                        >
                            <img src={user.avatar_url} alt={`${user.login}'s avatar`} />
                            <a href={user.html_url} target="_blank" rel="noopener noreferrer">{user.login}</a>

                            {/* Hover Card for User Details */}
                            {hoveredUserId === user.id && (
                                <div className="hover-card">
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

            {/* Pagination buttons */}
            <div className="pagination">
                <button onClick={handlePrevPage} disabled={page === 1}>
                    Previous
                </button>
                <span>Page {page}</span>
                <button onClick={handleNextPage} disabled={page * RESULTS_PER_PAGE >= totalCount}>
                    Next
                </button>
            </div>

            {/* Styling for the component */}
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
                    animation: glow 1.5s infinite alternate;
                    transition: box-shadow 0.3s ease, border-color 0.3s ease;
                }

                .search-input:hover {
                    animation: none;
                    box-shadow: 0 0 12px rgba(0, 123, 255, 0.5);
                    border-color: #007bff;
                }

                @keyframes glow {
                    from {
                        box-shadow: 0 0 10px rgba(0, 123, 255, 0.5);
                        border-color: #007bff;
                    }
                    to {
                        box-shadow: 0 0 20px rgba(0, 123, 255, 1);
                        border-color: #0056b3;
                    }
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
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 15px;
                    font-size: 18px;
                    position: relative;
                    cursor: pointer;
                }

                .result-item img {
                    border-radius: 50%;
                    width: 50px;
                    height: 50px;
                }

                .result-item a {
                    color: #007bff;
                    text-decoration: none;
                }

                .result-item a:hover {
                    text-decoration: underline;
                }

                .hover-card {
                    position: absolute;
                    top: 100%;
                    left: 0;
                    background-color: white;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    padding: 10px;
                    margin-top: 5px;
                    width: 250px;
                    z-index: 10;
                }

                .hover-card p {
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
                    transition: background-color 0.3s;
                }

                .pagination button:hover {
                    background-color: #0056b3;
                }

                .pagination button:disabled {
                    background-color: #ddd;
                    cursor: not-allowed;
                }
            `}</style>
        </div>
    );
}
