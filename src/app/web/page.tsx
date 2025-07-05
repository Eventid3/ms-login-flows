
"use client";

import { useState, useEffect } from 'react';

interface TokenInfo {
    accessToken: string;
    idToken: string;
    account: {
        homeAccountId: string;
        environment: string;
        tenantId: string;
        username: string;
    };
    expiresOn: string;
    tokenType: string;
}

export default function Web() {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [tokenData, setTokenData] = useState<TokenInfo | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Check if there's token information in the URL
        const urlParams = new URLSearchParams(window.location.search);
        const tokenInfoParam = urlParams.get('tokenInfo');

        if (tokenInfoParam) {
            try {
                // Parse the token information
                const tokenInfo = JSON.parse(decodeURIComponent(tokenInfoParam));
                setTokenData(tokenInfo);
                setIsAuthenticated(true);

                // Remove the token information from the URL (for security)
                window.history.replaceState({}, document.title, window.location.pathname);
            } catch (error) {
                console.error("Error parsing token information:", error);
                setError("Failed to parse token information");
            }
        }
    }, []);

    const handleLogin = () => {
        // Redirect to the login API route
        window.location.href = '/api/auth/login';
    };

    const handleLogout = () => {
        // Clear the token information and authentication state
        setTokenData(null);
        setIsAuthenticated(false);
    };

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">Web Authentication Flow</h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    <p><strong>Error:</strong> {error}</p>
                </div>
            )}

            <div className="bg-gray-700 p-6 rounded-lg shadow-md mb-6">
                <h2 className="text-xl font-semibold mb-4">Authentication Status</h2>
                <p className="mb-4">
                    Status: <span className={`font-bold ${isAuthenticated ? 'text-green-600' : 'text-red-600'}`}>
                        {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
                    </span>
                </p>

                {!isAuthenticated ? (
                    <button
                        onClick={handleLogin}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Sign in with Microsoft (Web Flow)
                    </button>
                ) : (
                    <div>
                        <p className="mb-2">Signed in as: <span className="font-semibold">{tokenData?.account?.username}</span></p>
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Sign Out
                        </button>
                    </div>
                )}
            </div>

            {tokenData && (
                <div className="bg-gray-700 p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Token Information</h2>
                    <div className="space-y-4">
                        <div>
                            <p className="font-medium">Access Token:</p>
                            <p className="bg-white text-black p-2 rounded border overflow-x-auto whitespace-pre-wrap break-all">
                                {tokenData.accessToken}
                            </p>
                        </div>
                        <div>
                            <p className="font-medium">ID Token:</p>
                            <p className="bg-white text-black p-2 rounded border overflow-x-auto whitespace-pre-wrap break-all">
                                {tokenData.idToken}
                            </p>
                        </div>
                        <div>
                            <p className="font-medium">Token Type:</p>
                            <p className="bg-white text-black p-2 rounded border">{tokenData.tokenType}</p>
                        </div>
                        <div>
                            <p className="font-medium">Expires:</p>
                            <p className="bg-white text-black p-2 rounded border">
                                {new Date(tokenData.expiresOn).toLocaleString()}
                            </p>
                        </div>
                        <div>
                            <p className="font-medium">Account Information:</p>
                            <div className="bg-white text-black p-2 rounded border">
                                <p><strong>Username:</strong> {tokenData.account?.username}</p>
                                <p><strong>Tenant ID:</strong> {tokenData.account?.tenantId}</p>
                                <p><strong>Home Account ID:</strong> {tokenData.account?.homeAccountId}</p>
                                <p><strong>Environment:</strong> {tokenData.account?.environment}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
