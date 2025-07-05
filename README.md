# Microsoft Login Flows Test Application

This Next.js application demonstrates two different authentication flows with Microsoft Entra ID (formerly Azure AD):

1. **PKCE Flow** - For public clients like single-page applications
2. **Web Flow** - For confidential clients like web applications with a backend

## Overview

This application allows you to test Microsoft Entra ID authentication flows with your own Azure applications. It provides:

- A home page displaying your configuration values
- A PKCE page implementing the PKCE (Proof Key for Code Exchange) authentication flow
- A Web page implementing the Web authentication flow with server-side code
- Display of token information after successful authentication

## Setup

### Prerequisites

- Node.js and npm installed
- A Microsoft Entra ID (Azure AD) application registered in the Azure portal

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# Microsoft Entra ID (Azure AD) Configuration
NEXT_PUBLIC_CLIENT_ID=your-client-id
NEXT_PUBLIC_TENANT_ID=your-tenant-id
CLIENT_SECRET=your-client-secret
NEXT_PUBLIC_REDIRECT_URI=http://localhost:3000/.auth/login/aad/callback
NEXT_PUBLIC_AUTHORITY=https://login.microsoftonline.com/
NEXT_PUBLIC_SCOPES=openid profile email
```

Replace the placeholder values with your actual Microsoft Entra ID application details.

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Authentication Flows

### PKCE Flow

The PKCE (Proof Key for Code Exchange) flow is designed for public clients like single-page applications. It provides additional security for the authorization code flow by using a code verifier and code challenge.

To test the PKCE flow:

1. Navigate to the PKCE page at [http://localhost:3000/pkce](http://localhost:3000/pkce)
2. Click the "Sign in with Microsoft" button
3. Complete the authentication process
4. View the token information displayed on the page

This flow is implemented using the `@azure/msal-browser` package and runs entirely in the browser.

### Web Flow

The Web flow is designed for confidential clients like web applications with a backend. It uses server-side code to securely handle the client secret.

To test the Web flow:

1. Navigate to the Web page at [http://localhost:3000/web](http://localhost:3000/web)
2. Click the "Sign in with Microsoft (Web Flow)" button
3. Complete the authentication process
4. View the token information displayed on the page

This flow is implemented using the `@azure/msal-node` package for server-side authentication and API routes in Next.js.

## Azure Portal Configuration

To use this application with your own Microsoft Entra ID application:

1. Register a new application in the Azure portal
2. Configure the redirect URIs:
   - For PKCE flow: `http://localhost:3000`
   - For Web flow: `http://localhost:3000/.auth/login/aad/callback`
3. Generate a client secret (for the Web flow)
4. Update your `.env` file with the application details

## Learn More

- [Microsoft Authentication Library (MSAL) Documentation](https://docs.microsoft.com/en-us/azure/active-directory/develop/msal-overview)
- [Microsoft Entra ID Documentation](https://docs.microsoft.com/en-us/azure/active-directory/)
- [Next.js Documentation](https://nextjs.org/docs)
