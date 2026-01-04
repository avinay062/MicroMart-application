# MSAL Authentication Documentation

This folder contains comprehensive documentation and flow diagrams for implementing Microsoft Authentication Library (MSAL) in your MicroMart application.

## 📁 Documentation Files

1. **[MSAL_Complete_Architecture.md](MSAL_Complete_Architecture.md)**
   - Overall system architecture
   - Component interactions
   - Service communication flow

2. **[MSAL_Login_Flow.md](MSAL_Login_Flow.md)**
   - Detailed login sequence
   - Authorization code flow
   - Token acquisition process

3. **[MSAL_Token_Validation.md](MSAL_Token_Validation.md)**
   - Token verification process
   - JWKS key fetching
   - Claims validation

4. **[MSAL_vs_Custom_JWT.md](MSAL_vs_Custom_JWT.md)**
   - Comparison between MSAL and Custom JWT
   - Symmetric vs Asymmetric encryption
   - Pros and cons of each approach

5. **[MSAL_Token_Structure.md](MSAL_Token_Structure.md)**
   - JWT token anatomy
   - Header, Payload, and Signature explained
   - Claims documentation

6. **[MSAL_Multi_Environment.md](MSAL_Multi_Environment.md)**
   - Multi-environment configuration
   - Dev, Staging, Production setup
   - Environment variables

7. **[MSAL_Token_Refresh.md](MSAL_Token_Refresh.md)**
   - Token refresh mechanism
   - Silent vs Interactive refresh
   - Token lifetime management

## 🎨 Viewing Diagrams

### Option 1: GitHub/GitLab
- Push files to your repository
- Diagrams will render automatically

### Option 2: VS Code
1. Install extension: **"Markdown Preview Mermaid Support"**
2. Open any `.md` file
3. Press `Ctrl+Shift+V` to preview

### Option 3: Online Editor
1. Visit https://mermaid.live/
2. Copy the mermaid code from any file
3. Paste and view/export

### Option 4: Export as Images
1. Open https://mermaid.live/
2. Paste diagram code
3. Click "Export" → PNG/SVG

## 🚀 Implementation Steps

### Frontend (React)
```bash
npm install @azure/msal-browser @azure/msal-react
```

### Backend (Express)
```bash
npm install jwks-rsa jsonwebtoken
```

### Configuration
1. Set up Azure AD app registration
2. Configure environment variables
3. Update middleware in shared-utils
4. Implement MSAL in React app

## 📚 Quick Reference

### Token Flow
```
User Login → Azure AD → Access Token → API Request → Token Validation → Response
```

### Key Concepts
- **Access Token**: Used for API authentication (1 hour lifetime)
- **Refresh Token**: Used to get new access tokens (90 days inactive)
- **JWKS**: JSON Web Key Set (public keys for verification)
- **kid**: Key ID (identifies which public key to use)

## 🔐 Security Best Practices

1. ✅ Always use HTTPS in production
2. ✅ Validate token audience (aud)
3. ✅ Validate token issuer (iss)
4. ✅ Check token expiration (exp)
5. ✅ Use httpOnly cookies when possible
6. ✅ Implement proper CORS policies
7. ✅ Cache JWKS keys (24 hours)
8. ✅ Use different tenant/client IDs per environment

## 📖 Related Files in Project

- `shared-utils/src/middleware/authMiddleware.js` - Current JWT middleware
- `services/user-service/` - User authentication service
- `services/product-service/` - Example of protected endpoints
- `client/` - React frontend

## 🤝 Support

For questions about MSAL implementation:
- Microsoft MSAL Docs: https://docs.microsoft.com/en-us/azure/active-directory/develop/msal-overview
- MSAL.js GitHub: https://github.com/AzureAD/microsoft-authentication-library-for-js
