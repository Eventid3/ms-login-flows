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
    // Get the authorization code from the query parameters
    const url = new URL(request.url);
    const code = url.searchParams.get('code');
    console.log(url.searchParams)
    url.searchParams.get('state');
    if (!code) {
      return NextResponse.json({ error: 'No authorization code provided' }, { status: 400 });
    }

    // Exchange the authorization code for tokens
    const tokenRequest = {
      code: code,
      scopes: (process.env.NEXT_PUBLIC_SCOPES || '').split(' '),
      redirectUri: process.env.NEXT_PUBLIC_REDIRECT_URI as string,
    };

    const tokenResponse = await cca.acquireTokenByCode(tokenRequest);

    // In a real application, you would store the tokens securely in a session or encrypted cookie
    // For this demo, we'll redirect to the web page with the token information in the URL
    // Note: In a production app, never pass tokens in the URL as it's not secure
    const tokenInfo = encodeURIComponent(JSON.stringify({
      accessToken: tokenResponse?.accessToken,
      idToken: tokenResponse?.idToken,
      account: tokenResponse?.account,
      expiresOn: tokenResponse?.expiresOn,
      tokenType: tokenResponse?.tokenType
    }));

    // Redirect back to the web page with the token information
    return NextResponse.redirect(`${url.origin}/web?tokenInfo=${tokenInfo}`);
  } catch (error) {
    console.error('Error during token acquisition:', error);
    return NextResponse.json({ error: 'Failed to acquire token' }, { status: 500 });
  }
}