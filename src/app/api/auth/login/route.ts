import { NextRequest, NextResponse } from 'next/server';
import { ConfidentialClientApplication } from '@azure/msal-node';

// MSAL configuration for server-side authentication
const msalConfig = {
  auth: {
    clientId: process.env.NEXT_PUBLIC_CLIENT_ID || '',
    authority: `${process.env.NEXT_PUBLIC_AUTHORITY}${process.env.NEXT_PUBLIC_TENANT_ID}`,
    clientSecret: process.env.CLIENT_SECRET,
  }
};

// Initialize MSAL instance
const cca = new ConfidentialClientApplication(msalConfig);

export async function GET(request: NextRequest) {
  try {
    // Generate a random state parameter to prevent CSRF attacks
    const state = Math.random().toString(36).substring(2, 15);

    // Store the state in the session (in a real app, you'd use a more secure method)
    const redirectUri = `${process.env.NEXT_PUBLIC_REDIRECT_URI}`;

    // Generate the authorization URL
    const authCodeUrlParameters = {
      scopes: (process.env.NEXT_PUBLIC_SCOPES || '').split(' '),
      redirectUri: redirectUri,
      state: state,
    };

    const authUrl = await cca.getAuthCodeUrl(authCodeUrlParameters);

    // Redirect the user to the authorization URL
    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error('Error during login:', error);
    return NextResponse.json({ error: 'Failed to initiate login' }, { status: 500 });
  }
}