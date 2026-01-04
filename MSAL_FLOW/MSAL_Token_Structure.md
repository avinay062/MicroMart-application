# MSAL Token Structure

```mermaid
graph TB
    subgraph MSALToken["MSAL JWT Token"]
        Token["eyJhbGciOiJSUzI1NiIsImtpZCI6IjFMVE16YWtpUWZ..."]
        
        subgraph Header["HEADER (Base64)"]
            H1["alg: RS256<br/>typ: JWT<br/>kid: 1LTMzakiQfU4pCR..."]
        end
        
        subgraph Payload["PAYLOAD (Base64)"]
            P1["aud: client-id-123<br/>iss: https://login.microsoftonline.com/tenant/v2.0<br/>iat: 1640000000<br/>exp: 1640003600<br/>oid: user-object-id<br/>email: user@company.com<br/>name: John Doe<br/>roles: [User, Admin]<br/>tid: tenant-id"]
        end
        
        subgraph Signature["SIGNATURE"]
            S1["RSA-SHA256<br/>Signed with Microsoft's<br/>Private Key"]
        end
    end
    
    Token --> Header
    Token --> Payload
    Token --> Signature
    
    PrivateKey["Microsoft Private Key<br/>(Secret - Microsoft Only)"]
    PublicKey["Microsoft Public Key<br/>(Available via JWKS)"]
    
    PrivateKey -.->|Signs| Signature
    PublicKey -.->|Verifies| Signature
    
    JWKS["JWKS Endpoint<br/>https://login.microsoftonline.com/<br/>tenant/discovery/v2.0/keys"]
    
    PublicKey --> JWKS
    
    style Token fill:#e1f5ff,stroke:#01579b,stroke-width:2px
    style PrivateKey fill:#ffcdd2,stroke:#c62828,stroke-width:3px
    style PublicKey fill:#c8e6c9,stroke:#2e7d32,stroke-width:3px
    style JWKS fill:#fff9c4,stroke:#f57f17,stroke-width:2px
```

## MSAL Token Claims Explained

### Header
- **alg**: Algorithm used (RS256 - RSA with SHA-256)
- **typ**: Token type (JWT)
- **kid**: Key ID used to sign the token

### Payload
- **aud**: Audience (your application's client ID)
- **iss**: Issuer (Microsoft Azure AD)
- **iat**: Issued at timestamp
- **exp**: Expiration timestamp
- **oid**: Object ID (unique user identifier in Azure AD)
- **email**: User's email address
- **name**: User's display name
- **roles**: User's assigned roles
- **tid**: Tenant ID

### Signature
- Signed using Microsoft's private RSA key
- Verified using Microsoft's public key (from JWKS endpoint)
