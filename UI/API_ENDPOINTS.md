# Number Association API - List of Endpoints

⚙️ **Backend Configuration**

- A local NestJS backend is used.
- All requests are directed to `http://localhost:3000`.
- This document reflects the current endpoints available in the local development environment.

## 🔢 **Number Association API**

### **1. Generating Associations**

#### POST `/number-associations/:number/generate`
- **Description**: Generates a new association for a specific number
- **Parameters**: 
  - `number` (in URL) - a number from 0 to 99
- **Response**: `NumberAssociation`
- **Example**: `POST /number-associations/42/generate`

#### POST `/number-associations/generate-all`
- **Description**: Generates associations for all numbers 0-99 (only missing ones)
- **Response**: `{message: string, count: number}`
- **Example**: `POST /number-associations/generate-all`

### **2. Retrieving Associations**

#### GET `/number-associations/:number`
- **Description**: Retrieves the primary association for a specific number
- **Parameters**: 
  - `number` (in URL) - a number from 0 to 99
- **Response**: `NumberAssociation` or 404
- **Example**: `GET /number-associations/42`

#### GET `/number-associations/all/primary`
- **Description**: Retrieves all primary associations (0-99)
- **Response**: `NumberAssociation[]`
- **Example**: `GET /number-associations/all/primary`

### **3. Rating Associations**

#### POST `/number-associations/:id/rate`
- **Description**: Rates an existing association
- **Parameters**: 
  - `id` (in URL) - association ID
- **Request Body**: `{"rating": 5}`
- **Response**: `NumberAssociation`
- **Example**: `POST /number-associations/1/rate`

### **4. Managing Duplicates**

#### POST `/number-associations/check-duplicates`
- **Description**: Checks and resolves duplicates by hero/action/object
- **Response**: 
  ```json
  {
    "duplicates": [
      {
        "number": 5,
        "hero": "Superman",
        "action": "flies",
        "object": "sky"
      }
    ],
    "regenerated": [15, 23, 45],
    "message": "Found 1 duplicate patterns, regenerated 3 associations"
  }
  ```
- **Example**: `POST /number-associations/check-duplicates`

---

## 📊 **Data Structure**

### NumberAssociation
```typescript
{
  id: number;                    // Unique ID
  number: number;                // Number (0-99)
  hero: string;                  // Hero
  action: string;                // Action
  object: string;                // Object
  explanation: string;           // Explanation
  is_primary: boolean;           // Primary association
  rating: number;                // Average rating
  total_votes: number;           // Number of votes
  created_at: Date;              // Creation date
}
```

---

## 🎯 **Usage Examples**

### cURL commands

#### Generate an association for number 42:
```bash
curl -X POST http://localhost:3000/number-associations/42/generate
```

#### Get all associations:
```bash
curl http://localhost:3000/number-associations/all/primary
```

#### Rate an association:
```bash
curl -X POST http://localhost:3000/number-associations/1/rate \
  -H "Content-Type: application/json" \
  -d '{"rating": 5}'
```

#### Generate all missing associations:
```bash
curl -X POST http://localhost:3000/number-associations/generate-all
```

#### Resolve duplicates:
```bash
curl -X POST http://localhost:3000/number-associations/check-duplicates
```

---

## 🔧 **Setup**

### Environment variables
- `baseUrl`: http://localhost:3000
- `OPEN_API_BASE_URL`: URL for OpenAI API
- `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME`: Database settings

### Headers
- `Content-Type: application/json` (for POST requests)

---

## 📝 **Notes**

- All associations are generated in Polish
- Duplicates are searched for in each part separately (hero, action, object)
- Ratings should be from 1 to 5
- The API automatically sets `is_primary = true` for new associations
