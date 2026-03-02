# Express Error Handling Stack

## File Structure
```
shared-utils/
  src/errors/AppError.js
  src/utils/catchAsync.js
  src/middleware/errorHandlers.js
  src/logger/index.js
services/user-service/src/app.js
README-error-handling.md
```

## Components
- **AppError**: Structured error model with helpers (`badRequest`, `unauthorized`, `forbidden`, `notFound`, `conflict`, `internal`) and a `createError` factory for catalog entries.
- **catchAsync**: Promise-aware wrapper to forward rejected controller handlers to Express.
- **Middleware**: `notFoundErrorHandler` builds a 404 AppError; `globalErrorHandler` normalizes known errors, logs with correlation ID, and hides internals in production for non-operational faults.
- **Logger Interface**: Simple console-backed logger (`logger` export). Replace by passing `{ logger: customLogger }` into `globalErrorHandler()`.

## Usage
1. **Register middleware in each service**:
   ```js
   const {
     AppError,
     catchAsync,
     notFoundErrorHandler,
     globalErrorHandler
   } = require('shared-utils');

   app.use(notFoundErrorHandler);
   app.use(globalErrorHandler({ logger: customLogger }));
   ```
2. **Wrap controllers**:
   ```js
   router.get('/users/:id', catchAsync(async (req, res, next) => {
     const user = await User.findById(req.params.id);
     if (!user) return next(AppError.notFound('User not found'));
     res.json(user);
   }));
   ```
3. **Third-party failures**:
   ```js
   try {
     await payProvider();
   } catch (err) {
     return next(AppError.internal('Payment unavailable', { providerMessage: err.message }, 'ERR_PAY_UPSTREAM'));
   }
   ```

## Extending the Error Catalog
- Add a new static helper in `AppError` or consume `createError(statusCode, message, { code, details, isOperational })`.
- Keep `isOperational` set to `false` for programming/unknown errors; set to `true` for expected business cases.

## Observability & Correlation IDs
- `globalErrorHandler` reads `req.traceId`, `req.id`, or `x-correlation-id` header and echoes it back.
- Add upstream middleware that stamps `req.traceId` (see `user-service/src/app.js`).
- Forward the ID to logging/monitoring platforms for distributed tracing.

## Adding New Error Types
1. Update `AppError` with a static helper (e.g., `static rateLimited(...)`).
2. Export the helper via `shared-utils/index.js`.
3. Use inside services: `return next(AppError.rateLimited('Slow down'));`.

## TypeScript Notes
- Convert files to `.ts` and export typings via `shared-utils/index.d.ts`.
- Annotate `AppError` implements `Error` and declare generics for `details` if needed.
- Use `express.RequestHandler` types for middleware factories.

## Testing
- `services/user-service/src/app.js` exposes `/test/operational`, `/test/programming`, `/test/external` routes to validate operational vs. programming behavior.
- Run `NODE_ENV=development npm run start:user-service` to inspect verbose payloads; set `NODE_ENV=production` to confirm stacks/details are hidden for non-operational errors.

## Adding to Other Services
1. Install/update `shared-utils` workspace via `npm install` at repo root.
2. Import helpers inside each service’s `app.js`.
3. Ensure every async route is wrapped with `catchAsync` (or `router.use(catchAsync(...))`).
4. Keep `notFoundErrorHandler` and `globalErrorHandler` last in the middleware chain.

```markdown
Headers like `x-correlation-id` are preserved and echoed so observability systems (e.g., OpenTelemetry, Datadog) can stitch traces together.
```
