# MSAL vs Custom JWT Comparison

```mermaid
graph TB
    subgraph CustomJWT["Custom JWT Authentication"]
        direction TB
        CLogin[User Login] --> CAuth[Your Auth Service]
        CAuth --> CDB[(Your User DB)]
        CAuth --> CToken[Create JWT<br/>jwt.sign data, SECRET]
        CToken --> CCookie[Set Cookie]
        
        CRequest[API Request] --> CMiddleware[Auth Middleware]
        CMiddleware --> CVerify[jwt.verify token, SECRET]
        CVerify --> CSuccess[req.user = decoded]
        
        CSecret[ONE SECRET KEY<br/>Symmetric HS256]
        CSecret -.->|Sign| CToken
        CSecret -.->|Verify| CVerify
    end
    
    subgraph MSAL["MSAL Authentication"]
        direction TB
        MLogin[User Login] --> MMSALB[MSAL Browser Library]
        MMSALB --> MAzure[Microsoft Azure AD]
        MAzure --> MToken[Issue JWT<br/>Signed with Microsoft's<br/>Private Key]
        MToken --> MCache[Token Cache]
        
        MRequest[API Request] --> MMW[MSAL Middleware]
        MMW --> MJWKS[Fetch Public Keys<br/>from JWKS endpoint]
        MJWKS --> MVerify[jwt.verify token,<br/>Microsoft Public Key]
        MVerify --> MSuccess[req.user = decoded]
        
        MPrivate[Microsoft Private Key<br/>Asymmetric RS256<br/>Kept Secret]
        MPublic[Microsoft Public Keys<br/>Publicly Available]
        
        MPrivate -.->|Sign| MToken
        MPublic -.->|Verify| MVerify
    end
    
    style CSecret fill:#ffccbc,stroke:#bf360c,stroke-width:2px
    style MPrivate fill:#ffcdd2,stroke:#c62828,stroke-width:2px
    style MPublic fill:#c8e6c9,stroke:#2e7d32,stroke-width:2px
    style MAzure fill:#0078d4,stroke:#004578,stroke-width:2px,color:#fff
```

## Key Differences

| Feature | Custom JWT | MSAL |
|---------|-----------|------|
| **Token Issuer** | Your auth-service | Microsoft Azure AD |
| **Algorithm** | HS256 (Symmetric) | RS256 (Asymmetric) |
| **Secret Key** | Your JWT_SECRET | Microsoft's Private Key |
| **Verification** | jwt.verify(token, SECRET) | jwt.verify(token, PublicKey) |
| **User Management** | Your MongoDB | Azure AD |
| **MFA Support** | Manual implementation | Built-in |
| **SSO** | Manual implementation | Built-in |
| **Token Storage** | Cookies | sessionStorage/localStorage |
