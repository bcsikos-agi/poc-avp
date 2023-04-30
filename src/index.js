import React from 'react';
import * as ReactDOM from 'react-dom/client';
import { Auth0Provider } from "@auth0/auth0-react";

import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(<Auth0Provider
    domain="dev-xz37043p.eu.auth0.com"
    clientId="C7nIFoL3d02yG0jnkbMZ3Iw6M4xmG8M5"
    authorizationParams={{
        redirect_uri: window.location.origin,
        audience: 'https://tvzgphknyd.execute-api.us-east-1.amazonaws.com/'
    }}
>
    <App />
</Auth0Provider>)