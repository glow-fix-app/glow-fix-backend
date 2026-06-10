# 🔴 ERROR ANALYSIS - What Was Wrong

## The Problem You Had

When you sent request to create business with:
```json
{
  "name": "عيادة الجمال",
  "description": "...",
  "phone": "+20...",
  "email": "...",
  "city": "القاهرة",
  "country": "مصر",
  "website": "...",
  "taxNumber": "...",
  "commercialRegistration": "...",
  "location": { "latitude": 30, "longitude": 31 }
}
```

**You got**: 400 Bad Request
```json
{
  "success": false,
  "error": {
    "code": "Bad Request",
    "message": [
      "property name should not exist",
      "property description should not exist",
      "property phone should not exist",
      "property email should not exist",
      "property city should not exist",
      "property country should not exist",
      "property website should not exist",
      "property taxNumber should not exist",
      "property commercialRegistration should not exist",
      "property location should not exist"
    ]
  }
}
```

## Why This Happened

The **CreateBusinessDto** class does NOT accept those fields!

```typescript
// server/src/modules/businesses/dto/create-business.dto.ts

export class CreateBusinessDto {
  @ApiProperty()
  businessName: string;           // ← NOT "name"
  
  @ApiProperty()
  address: string;                // ← NOT "city/country" separately
  
  @ApiProperty()
  latitude: number;               // ← NOT in "location" object
  
  @ApiProperty()
  longitude: number;              // ← NOT in "location" object
  
  @ApiPropertyOptional()
  contactPhone?: string;          // ← NOT "phone"
  
  @ApiPropertyOptional()
  contactEmail?: string;          // ← NOT "email"
  
  @ApiPropertyOptional()
  operatingHours?: OperatingHourDto[];
}
```

---

## ✅ The Solution

### Before (400 Error)
```json
{
  "name": "عيادة",
  "description": "...",
  "phone": "+20...",
  "email": "...",
  "city": "...",
  "country": "...",
  "website": "...",
  "taxNumber": "...",
  "commercialRegistration": "...",
  "location": {
    "latitude": 30,
    "longitude": 31
  }
}
```

### After (201 Success)
```json
{
  "businessName": "عيادة",
  "address": "شارع النيل، القاهرة، مصر",
  "latitude": 30,
  "longitude": 31,
  "contactPhone": "+20...",
  "contactEmail": "..."
}
```

---

## 📊 All Field Name Changes

### Auth Endpoints
```
❌ firstName        → ✅ fullName
❌ lastName         → ✅ (combined in fullName)
❌ email (login)    → ✅ identifier
❌ password + confirmPassword  → ✅ (same)
```

### User Endpoints
```
❌ firstName        → ✅ full_name
❌ lastName         → ✅ (combined in full_name)
❌ avatar           → ✅ avatar_url
```

### Business Creation
```
❌ name             → ✅ businessName
❌ description      → ✅ (REMOVED - not valid)
❌ phone            → ✅ contactPhone
❌ email            → ✅ contactEmail
❌ city             → ✅ (in address)
❌ country          → ✅ (in address)
❌ website          → ✅ (REMOVED - not valid)
❌ taxNumber        → ✅ (REMOVED - not valid)
❌ commercialRegistration → ✅ (REMOVED - not valid)
❌ location: {lat, lon} → ✅ latitude, longitude (separate)
```

### Document Upload
```
❌ type: "LICENSE"              → ✅ type: "BUSINESS_REGISTRATION"
❌ type: "CERTIFICATE"          → ✅ type: "INSURANCE_CERTIFICATE"
❌ type: "INSURANCE"            → ✅ type: "TAX_CARD"
❌ type: "PERMIT"               → ✅ (NOT VALID)
❌ type: "OTHER"                → ✅ (NOT VALID)
```

### Admin Status Update
```
❌ rejectionReason  → ✅ reason
```

---

## 🎯 Key Insights

### 1. Naming Conventions
- **Backend uses**: camelCase (businessName, contactPhone)
- **Not**: snake_case for most, except Users (full_name)
- **Not**: object nesting for coordinates

### 2. Removed Fields
These fields are **NOT** in the DTO and **cannot** be sent:
- description
- website
- taxNumber
- commercialRegistration
- city (use address)
- country (use address)

### 3. Structure Changes
- **location: {lat, lon}** → Separate **latitude, longitude**
- **operatingHours: "09:00-18:00"** → Array of objects with dayOfWeek, openTime, closeTime

---

## 🔍 How to Avoid This

### Step 1: Check the DTO Class
```typescript
// Look at: server/src/modules/businesses/dto/create-business.dto.ts
export class CreateBusinessDto {
  businessName: string;        // ← This is what you need
  address: string;
  latitude: number;
  longitude: number;
  contactPhone?: string;
  contactEmail?: string;
}
```

### Step 2: Use Exact Field Names
Only use fields that exist in DTO:
- businessName ✅
- address ✅
- latitude ✅
- longitude ✅
- contactPhone ✅
- contactEmail ✅

### Step 3: Check Postman Collection
All endpoints now have **correct field names** and descriptions.

---

## 📚 Reference All DTOs

### CreateBusinessDto
```typescript
businessName: string (required, 3-100 chars)
address: string (required)
latitude: number (required, -90 to 90)
longitude: number (required, -180 to 180)
contactPhone?: string (optional)
contactEmail?: string (optional)
operatingHours?: OperatingHourDto[] (optional)
```

### UpdateBusinessDto
```typescript
// All fields are optional!
businessName?: string
address?: string
latitude?: number
longitude?: number
contactPhone?: string
contactEmail?: string
```

### UploadDocumentDto
```typescript
type: string (required)
// Allowed: BUSINESS_REGISTRATION, INSURANCE_CERTIFICATE, TAX_CARD
```

### AdminSetBusinessStatusDto
```typescript
status: string (required)
// Allowed: APPROVED, REJECTED, SUSPENDED
reason?: string (optional, required for REJECTED/SUSPENDED)
```

### AdminSetDocumentStatusDto
```typescript
status: string (required)
// Allowed: APPROVED, REJECTED
reason?: string (optional, required for REJECTED)
```

---

## ✅ Validation Checklist

**Before sending ANY request**, verify:

- [ ] Field names match DTO exactly (case-sensitive)
- [ ] No extra fields not in DTO
- [ ] Required fields all present
- [ ] Data types correct (string, number, array, etc.)
- [ ] Enum values from allowed list only
- [ ] No spaces or special characters in field names
- [ ] Correct API path
- [ ] Correct HTTP method

---

## 🚀 Fixed & Ready

✅ **Postman Collection**: All field names corrected
✅ **Documentation**: Complete reference provided
✅ **Examples**: Copy-paste ready
✅ **Quick Guides**: Fast lookup available

**Start with**: Read `ISSUES_FIXED_SUMMARY.md`, then use updated Postman collection!

No more 400 errors! 🎉
