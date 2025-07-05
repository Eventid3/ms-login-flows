
'use client';

import { useState, useEffect } from 'react';
import {
    PublicClientApplication,
    AuthenticationResult,
    AccountInfo,
    InteractionRequiredAuthError
} from '@azure/msal-browser';

export default function Pkce() {
    // MSAL configuration
    const msalConfig = {
        auth: {
            clientId: process.env.NEXT_PUBLIC_CLIENT_ID || '',
            authority: `${process.env.NEXT_PUBLIC_AUTHORITY}${process.env.NEXT_PUBLIC_TENANT_ID}`,
            redirectUri: process.env.NEXT_PUBLIC_REDIRECT_URI,
        },
        cache: {
            cacheLocation: "sessionStorage", // This configures where your cache will be stored
            storeAuthStateInCookie: false, // Set this to "true" if you are having issues with IE11 or Edge
        }
    };

    const [msalInstance] = useState(() => new PublicClientApplication(msalConfig));
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [account, setAccount] = useState<AccountInfo | null>(null);
    const [tokenData, setTokenData] = useState<AuthenticationResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Scopes for the token request
    const loginScopes = (process.env.NEXT_PUBLIC_SCOPES || '').split(' ');

    useEffect(() => {
        msalInstance.initialize()
            .then(() => {
                // Handle the redirect promise when the page loads
                msalInstance.handleRedirectPromise()
                    .then(response => {
                        // Check if response is null (no redirect) or contains auth result
                        if (response !== null) {
                            setTokenData(response);
                            setAccount(response.account);
                            setIsAuthenticated(true);
                        } else {
                            // Check if user is already signed in
                            const currentAccounts = msalInstance.getAllAccounts();
                            if (currentAccounts.length > 0) {
                                setAccount(currentAccounts[0]);
                                setIsAuthenticated(true);
                                // Get token silently if user is already signed in
                                acquireToken();
                            }
                        }
                    })
                    .catch(error => {
                        console.error("Error during redirect handling:", error);
                        setError(error.message);
                    });
            });
    }, []);

    const acquireToken = async () => {
        const currentAccounts = msalInstance.getAllAccounts();
        if (currentAccounts.length === 0) {
            return;
        }

        const request = {
            scopes: loginScopes,
            account: currentAccounts[0]
        };

        try {
            const response = await msalInstance.acquireTokenSilent(request);
            setTokenData(response);
        } catch (error) {
            if (error instanceof InteractionRequiredAuthError) {
                // fallback to interaction when silent call fails
                try {
                    await msalInstance.acquireTokenRedirect(request);
                } catch (interactiveError) {
                    console.error("Error during interactive token acquisition:", interactiveError);
                    setError(interactiveError.message);
                }
            } else {
                console.error("Error during silent token acquisition:", error);
                setError(error.message);
            }
        }
    };

    const handleLogin = async () => {
        try {
            await msalInstance.loginRedirect({
                scopes: loginScopes
            });
        } catch (error) {
            console.error("Error during login:", error);
            setError(error.message);
        }
    };

    const handleLogout = () => {
        msalInstance.logoutRedirect();
    };

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">PKCE Authentication Flow</h1>

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
                        Sign in with Microsoft
                    </button>
                ) : (
                    <div>
                        <p className="mb-2">Signed in as: <span className="font-semibold">{account?.username}</span></p>
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
                            <p className="bg-white p-2 rounded border overflow-x-auto whitespace-pre-wrap break-all">
                                {tokenData.accessToken}
                            </p>
                        </div>
                        <div>
                            <p className="font-medium">ID Token:</p>
                            <p className="bg-white p-2 rounded border overflow-x-auto whitespace-pre-wrap break-all">
                                {tokenData.idToken}
                            </p>
                        </div>
                        <div>
                            <p className="font-medium">Token Type:</p>
                            <p className="bg-white p-2 rounded border">{tokenData.tokenType}</p>
                        </div>
                        <div>
                            <p className="font-medium">Expires:</p>
                            <p className="bg-white p-2 rounded border">
                                {new Date(tokenData.expiresOn).toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
