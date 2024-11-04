'use client';

import React from 'react';
import UserSearchBar from '../components/UserSearchBar';

export default function Home() {
    return (
        <div className="container">
            <h1>Resultstack Profile Search</h1>
            <UserSearchBar />

            <style jsx>{`
                .container {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    padding: 10x;
                    font-family: 'Roboto', sans-serif;
                    text-align: center;
                    background-color: #f3f4f6;
                }

                h1 {
                    font-size: 2rem;
                    font-weight: bold;
                    color: #333;
                    margin-bottom: 20px;
                    padding-top: 20px;
                }

                @media (max-width: 600px) {
                    h1 {
                        font-size: 1.5rem;
                    }
                }
            `}</style>
        </div>
    );
}
