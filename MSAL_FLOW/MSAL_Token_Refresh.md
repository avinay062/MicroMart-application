# MSAL Token Refresh Flow

```mermaid
sequenceDiagram
    participant U as User
    participant R as React App
    participant Cache as Token Cache
    participant AD as Azure AD
    participant API as Backend API
    
    Note over U,API: TOKEN REFRESH SCENARIO
    
    U->>R: Make API request
    R->>Cache: Get access token
    Cache-->>R: Token (expired)
    
    Note over R: Check token expiration<br/>Token is expired!
    
    R->>R: acquireTokenSilent({<br/>  scopes: ["user_impersonation"],<br/>  account: currentAccount<br/>})
    
    R->>Cache: Check refresh token
    Cache-->>R: Refresh token exists
    
    R->>AD: Silent token refresh<br/>POST /token<br/>{<br/>  grant_type: refresh_token,<br/>  refresh_token: xyz...<br/>}
    
    alt Refresh Token Valid
        AD-->>R: New tokens<br/>{<br/>  access_token: new_token,<br/>  refresh_token: new_refresh,<br/>  expires_in: 3600<br/>}
        
        R->>Cache: Update tokens
        
        R->>API: Retry API request<br/>Authorization: Bearer new_token
        API-->>R: 200 OK + Data
        R-->>U: Show data
        
    else Refresh Token Expired
        AD-->>R: Error: refresh_token expired
        
        Note over R: Fall back to interactive login
        
        R->>R: acquireTokenPopup() or<br/>acquireTokenRedirect()
        
        R->>AD: Redirect to login
        AD->>U: Show login page
        U->>AD: Re-authenticate
        AD-->>R: New tokens
        
        R->>Cache: Store new tokens
        R->>API: Retry with new token
        API-->>R: 200 OK + Data
        R-->>U: Show data
    end
```

## Token Refresh Strategies

### 1. Silent Token Acquisition (Preferred)
```javascript
try {
    const response = await msalInstance.acquireTokenSilent({
        scopes: ["user_impersonation"],
        account: accounts[0]
    });
    return response.accessToken;
} catch (error) {
    // Falls through to interactive method
}
```

### 2. Interactive Token Acquisition (Fallback)
```javascript
// Popup method
const response = await msalInstance.acquireTokenPopup({
    scopes: ["user_impersonation"],
    account: accounts[0]
});

// OR Redirect method
await msalInstance.acquireTokenRedirect({
    scopes: ["user_impersonation"],
    account: accounts[0]
});
```

## Token Lifetimes

| Token Type | Default Lifetime | Renewable? |
|------------|------------------|------------|
| **Access Token** | 1 hour | Yes (via refresh token) |
| **Refresh Token** | 90 days (inactive)<br/>24 hours (active) | Yes (rolling refresh) |
| **ID Token** | 1 hour | Yes (via refresh token) |
