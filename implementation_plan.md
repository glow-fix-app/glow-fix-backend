## Public Business Profile Endpoint

### Scope
- Add one new public endpoint only:
  - `GET /api/v1/businesses/:businessId/public-profile`
- Work inside:
  - `server/src/modules/businesses/businesses.controller.ts`
  - `server/src/modules/businesses/businesses.service.ts`
  - `server/src/modules/businesses/entities/`
  - `server/src/modules/businesses/__tests__/`
- Add `businesses.presenter.ts` if it keeps response mapping out of the service.
- Do not change schema, create migrations, or modify existing endpoint behavior.
- Do not implement bookings, payments, dashboard, admin flows, or change the services registration flow beyond safe reuse if absolutely needed.

### Current Findings
- `businesses` already has public endpoints for:
  - listing approved businesses
  - fetching one approved business by id
- `businesses.service.ts` already contains useful helpers for:
  - latest business status
  - business coordinates loading from PostGIS
  - approved-business validation patterns
- `businesses` currently has no presenter file.
- Existing public business responses use camelCase, but this new endpoint explicitly needs `snake_case`.
- `Business` has direct relations for:
  - `statusHistory`
  - `operatingHours`
  - `businessServices`
- `Review` is not directly related to `Business`; review summary must be derived through bookings if included.

### Planned Work
1. Add new response entities under `server/src/modules/businesses/entities/`:
   - `public-business-profile.entity.ts`
   - `public-business-service-category.entity.ts`
   - `public-business-service.entity.ts`
   - `public-business-operating-hour.entity.ts`
   - update `entities/index.ts`
2. Add `server/src/modules/businesses/businesses.presenter.ts`:
   - convert Prisma camelCase data to the required `snake_case`
   - group active business services by category
   - convert `BigInt price` safely to number using the same convention already used by services APIs
   - map operating hours
   - compute `services_count`
   - compute `is_closed`
   - compute `is_open` and `today_hours` with simple server-time logic
   - exclude manager/user sensitive fields
3. Add a new service method:
   - `getPublicBusinessProfile(businessId: string)`
   - fetch business by id with:
     - latest `statusHistory`
     - `operatingHours`
     - active `businessServices`
     - nested `service.category`
   - attach coordinates
   - reject with `NotFoundException` if:
     - business does not exist
     - latest status is not `APPROVED`
   - fetch rating summary if feasible through existing review/bookings relations without widening scope
4. Add controller endpoint:
   - `@Public()`
   - `@Get(':businessId/public-profile')`
   - `@ApiOperation({ summary: 'Get public business profile with services and operating hours' })`
   - `@ApiParam({ name: 'businessId', type: String })`
   - `@ApiResponse({ status: 200, type: PublicBusinessProfileEntity })`
   - `@ApiResponse({ status: 404, description: 'Business not found' })`
5. Add/update tests in `server/src/modules/businesses/__tests__/`:
   - approved business returns public profile
   - missing business -> `NotFoundException`
   - non-approved business -> `NotFoundException`
   - only active services returned
   - services grouped by category
   - operating hours included
   - BigInt price converted safely
   - no sensitive manager/user data exposed
6. Validation after implementation:
   - `npx prisma validate`
   - `npx nest build`
   - `npm run build` if possible
   - if workspace build fails only on Windows Prisma `query_engine` EPERM rename lock, report it as environmental

### Expected Response Shape
- Top-level response remains dedicated to this endpoint and uses `snake_case`, including:
  - `business_name`
  - `contact_phone`
  - `contact_email`
  - `created_at`
  - `updated_at`
  - `categories`
  - `about.operating_hours`
  - `is_open`
  - `today_hours`
  - `rating`
  - `reviews_count`

### Notes To Preserve
- Do not alter existing `GET /api/v1/businesses/:id` behavior.
- Do not move business logic into the presenter.
- Keep this endpoint public only for businesses whose latest status is `APPROVED`.
