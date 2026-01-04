# MSAL Multi-Environment Configuration

```mermaid
graph LR
    subgraph Environments["Multi-Environment Setup"]
        direction TB
        
        subgraph Dev["Development"]
            DevConfig["Config:<br/>tenantId: dev-tenant<br/>clientId: dev-client<br/>redirectUri: localhost:3000"]
            DevAzure["Azure AD<br/>Dev Tenant"]
        end
        
        subgraph Staging["Staging"]
            StagingConfig["Config:<br/>tenantId: staging-tenant<br/>clientId: staging-client<br/>redirectUri: staging.app.com"]
            StagingAzure["Azure AD<br/>Staging Tenant"]
        end
        
        subgraph Prod["Production"]
            ProdConfig["Config:<br/>tenantId: prod-tenant<br/>clientId: prod-client<br/>redirectUri: app.com"]
            ProdAzure["Azure AD<br/>Production Tenant"]
        end
    end
    
    DevConfig --> DevAzure
    StagingConfig --> StagingAzure
    ProdConfig --> ProdAzure
    
    EnvVar["Environment Variables<br/>NODE_ENV=development|staging|production"]
    
    EnvVar -.->|Selects| DevConfig
    EnvVar -.->|Selects| StagingConfig
    EnvVar -.->|Selects| ProdConfig
    
    style DevAzure fill:#81c784,stroke:#388e3c
    style StagingAzure fill:#ffb74d,stroke:#f57c00
    style ProdAzure fill:#0078d4,stroke:#004578,color:#fff
    style EnvVar fill:#ff9,stroke:#333,stroke-width:3px
```

## Environment Configuration Example

### Frontend (.env files)

**Development (.env.development)**
```env
REACT_APP_ENV=development
REACT_APP_AZURE_CLIENT_ID_DEV=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
REACT_APP_AZURE_TENANT_ID_DEV=yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy
```

**Staging (.env.staging)**
```env
REACT_APP_ENV=staging
REACT_APP_AZURE_CLIENT_ID_STAGING=aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa
REACT_APP_AZURE_TENANT_ID_STAGING=bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb
```

**Production (.env.production)**
```env
REACT_APP_ENV=production
REACT_APP_AZURE_CLIENT_ID_PROD=cccccccc-cccc-cccc-cccc-cccccccccccc
REACT_APP_AZURE_TENANT_ID_PROD=dddddddd-dddd-dddd-dddd-dddddddddddd
```

### Backend (.env files)

**Development**
```env
NODE_ENV=development
AZURE_TENANT_ID_DEV=yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy
AZURE_CLIENT_ID_DEV=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

**Staging**
```env
NODE_ENV=staging
AZURE_TENANT_ID_STAGING=bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb
AZURE_CLIENT_ID_STAGING=aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa
```

**Production**
```env
NODE_ENV=production
AZURE_TENANT_ID_PROD=dddddddd-dddd-dddd-dddd-dddddddddddd
AZURE_CLIENT_ID_PROD=cccccccc-cccc-cccc-cccc-cccccccccccc
```
