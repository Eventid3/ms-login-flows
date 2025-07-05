
export default function Home() {
  return (
      <div className="p-8">
          <h1 className="text-3xl font-bold mb-6">Microsoft Entra ID Configuration</h1>
          <div className="bg-gray-700 p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Environment Variables</h2>
              <div className="space-y-4 text-black">
                  <div>
                      <p className="font-medium">Client ID:</p>
                      <p className="bg-white p-2 rounded border">{process.env.NEXT_PUBLIC_CLIENT_ID || 'Not set'}</p>
                  </div>
                  <div>
                      <p className="font-medium">Tenant ID:</p>
                      <p className="bg-white p-2 rounded border">{process.env.NEXT_PUBLIC_TENANT_ID || 'Not set'}</p>
                  </div>
                  <div>
                      <p className="font-medium">Redirect URI:</p>
                      <p className="bg-white p-2 rounded border">{process.env.NEXT_PUBLIC_REDIRECT_URI || 'Not set'}</p>
                  </div>
                  <div>
                      <p className="font-medium">Authority:</p>
                      <p className="bg-white p-2 rounded border">{process.env.NEXT_PUBLIC_AUTHORITY || 'Not set'}</p>
                  </div>
                  <div>
                      <p className="font-medium">Scopes:</p>
                      <p className="bg-white p-2 rounded border">{process.env.NEXT_PUBLIC_SCOPES || 'Not set'}</p>
                  </div>
              </div>
              <div className="mt-6">
                  <p className="text-sm text-gray-600">
                      Note: These values are loaded from your .env file. Make sure to set them correctly for your Microsoft Entra ID application.
                  </p>
              </div>
          </div>
      </div>
  );
}
