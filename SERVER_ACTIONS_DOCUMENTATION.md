# Server Actions Documentation

## Overview
All server actions are located in `/app/actions/auth.js` and marked with `"use server"` directive.

---

## Available Server Actions

### 1. `checkUserExists(email)`

**Purpose:** Check if a user account exists with the given email address.

**Parameters:**
- `email` (string) - Email address to check

**Returns:**
```javascript
{
  user: object | null,    // User document with _id if exists, null if not
  success: boolean,       // true if operation succeeded, false if error
  error?: string         // Error message (only present if success is false)
}
```

**Usage Example:**
```javascript
import { checkUserExists } from "@/app/actions/auth";

// Check if user exists
const result = await checkUserExists("user@example.com");

if (result.success && result.user) {
  console.log("User exists with ID:", result.user._id);
} else if (result.success && !result.user) {
  console.log("User does not exist");
} else {
  console.error("Error:", result.error);
}
```

**Error Cases:**
- Empty email → `{ user: null, success: false, error: "Email is required" }`
- Database error → `{ user: null, success: false, error: "An error occurred..." }`

---

### 2. `registerUser(name, address, email, password)`

**Purpose:** Register a new user account with automatic duplicate checking and password hashing.

**Parameters:**
- `name` (string) - User's full name (required)
- `address` (string) - User's address (optional)
- `email` (string) - User's email address (required)
- `password` (string) - User's password in plain text (required, will be hashed)

**Returns:**
```javascript
{
  success: boolean,      // true if registration succeeded, false otherwise
  message: string        // Success or error message
}
```

**Usage Example:**
```javascript
import { registerUser } from "@/app/actions/auth";

const result = await registerUser(
  "John Doe",
  "123 Main St",
  "john@example.com",
  "SecurePassword123"
);

if (result.success) {
  console.log(result.message); // "User registered successfully"
  // Redirect to login
} else {
  console.error(result.message); // Error description
}
```

**Success Response:**
```javascript
{
  success: true,
  message: "User registered successfully"
}
```

**Error Cases:**
| Scenario | Response |
|----------|----------|
| Missing required fields | `{ success: false, message: "Name, email, and password are required" }` |
| Email already exists | `{ success: false, message: "User with this email already exists" }` |
| Database error | `{ success: false, message: "Error registering user" }` |

**Security Features:**
- Automatic password hashing using bcrypt (10 salt rounds)
- Duplicate email prevention
- Input validation

---

### 3. `verifyUserCredentials(email, password)`

**Purpose:** Verify user login credentials (email + password combination).

**Parameters:**
- `email` (string) - User's email address
- `password` (string) - User's password in plain text

**Returns:**
```javascript
{
  success: boolean,      // true if credentials are valid, false otherwise
  user?: object,         // User data (only present if success is true)
  message?: string       // Error message (only present if success is false)
}
```

**Usage Example:**
```javascript
import { verifyUserCredentials } from "@/app/actions/auth";

const result = await verifyUserCredentials(
  "john@example.com",
  "SecurePassword123"
);

if (result.success) {
  console.log("Login successful!");
  console.log("User:", result.user);
  // User object contains: id, name, email, address
} else {
  console.error("Login failed:", result.message);
}
```

**Success Response:**
```javascript
{
  success: true,
  user: {
    id: "507f1f77bcf86cd799439011",  // MongoDB ObjectId as string
    name: "John Doe",
    email: "john@example.com",
    address: "123 Main St"
  }
}
```

**Error Cases:**
| Scenario | Response |
|----------|----------|
| Missing credentials | `{ success: false, message: "Email and password are required" }` |
| User not found | `{ success: false, message: "Invalid credentials" }` |
| Wrong password | `{ success: false, message: "Invalid credentials" }` |
| Database error | `{ success: false, message: "An error occurred during authentication" }` |

**Security Features:**
- Uses bcrypt.compare() for secure password verification
- Generic error messages (doesn't reveal if email or password is wrong)
- Password never exposed in response

---

## Common Patterns

### Pattern 1: Registration Flow
```javascript
"use client"
import { registerUser } from "@/app/actions/auth";
import { useRouter } from "next/navigation";

const handleRegister = async (formData) => {
  const result = await registerUser(
    formData.name,
    formData.address,
    formData.email,
    formData.password
  );

  if (result.success) {
    alert("Registration successful!");
    router.push("/"); // Redirect to login
  } else {
    setError(result.message);
  }
};
```

### Pattern 2: Check Before Register
```javascript
"use client"
import { checkUserExists, registerUser } from "@/app/actions/auth";

const handleRegister = async (formData) => {
  // Optional: Check if user exists first
  const checkResult = await checkUserExists(formData.email);
  
  if (checkResult.success && checkResult.user) {
    setError("Email already registered");
    return;
  }

  // Proceed with registration
  const result = await registerUser(
    formData.name,
    formData.address,
    formData.email,
    formData.password
  );

  if (result.success) {
    router.push("/");
  }
};
```

### Pattern 3: Custom Authentication (Alternative to NextAuth)
```javascript
"use client"
import { verifyUserCredentials } from "@/app/actions/auth";
import { useRouter } from "next/navigation";

const handleLogin = async (email, password) => {
  const result = await verifyUserCredentials(email, password);

  if (result.success) {
    // Store user session (you'd need to implement session management)
    sessionStorage.setItem("user", JSON.stringify(result.user));
    router.push("/Dashboard");
  } else {
    setError(result.message);
  }
};
```

---

## Database Schema

The User model (referenced in actions):

```javascript
// models/user.js
{
  name: String,
  address: String,
  email: String (unique, required),
  password: String (hashed),
  _id: ObjectId (MongoDB auto-generated)
}
```

---

## Error Handling Best Practices

### Client-Side
```javascript
try {
  const result = await registerUser(name, address, email, password);
  
  if (result.success) {
    // Handle success
  } else {
    // Display result.message to user
    setError(result.message);
  }
} catch (error) {
  // Handle unexpected errors
  console.error("Unexpected error:", error);
  setError("An unexpected error occurred");
}
```

### Server-Side (already implemented)
All server actions:
- ✅ Validate input parameters
- ✅ Handle database connection errors
- ✅ Disconnect from database in finally block
- ✅ Return consistent response format
- ✅ Log errors to console
- ✅ Never expose sensitive information

---

## Security Considerations

### Password Security
- ✅ Passwords hashed with bcrypt (10 rounds)
- ✅ Plain text passwords never stored
- ✅ Passwords never returned in responses
- ✅ bcrypt.compare() for verification (timing-safe)

### Input Validation
- ✅ Required fields checked before processing
- ✅ Email uniqueness enforced
- ✅ Empty string validation

### Database Security
- ✅ Connection pooling handled by MongoDB driver
- ✅ Connections properly closed
- ✅ Error messages sanitized

### API Security
- ✅ Server Actions protected by Next.js (CSRF protection)
- ✅ Can only be called from client components
- ✅ Automatic POST request conversion

---

## Performance Notes

### Connection Management
- Each action connects and disconnects from MongoDB
- Consider using connection pooling for production
- MongoDB driver handles connection reuse internally

### Optimization Tips
```javascript
// Good: Reuse database connection in same request
export async function complexAction() {
  try {
    await connectDB();
    
    // Multiple operations on same connection
    const user = await User.findOne({ email });
    await Log.create({ action: "login", userId: user._id });
    
  } finally {
    await disconnectDB();
  }
}

// Avoid: Multiple connect/disconnect cycles
// (Current implementation is fine for simple actions)
```

---

## Testing Examples

### Unit Test Example (Jest)
```javascript
import { registerUser } from "@/app/actions/auth";

describe("registerUser", () => {
  it("should register a new user successfully", async () => {
    const result = await registerUser(
      "Test User",
      "123 Test St",
      "test@example.com",
      "password123"
    );
    
    expect(result.success).toBe(true);
    expect(result.message).toBe("User registered successfully");
  });

  it("should reject duplicate email", async () => {
    // Register first user
    await registerUser("User 1", "", "duplicate@example.com", "pass123");
    
    // Try to register with same email
    const result = await registerUser(
      "User 2",
      "",
      "duplicate@example.com",
      "pass456"
    );
    
    expect(result.success).toBe(false);
    expect(result.message).toContain("already exists");
  });
});
```

---

## Migration from API Routes

### Before (API Route)
```javascript
// app/api/register/route.js
export const POST = async (request) => {
  const { name, address, email, password } = await request.json();
  // ... implementation
};

// Client usage
const response = await fetch("/api/register", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name, address, email, password }),
});
const data = await response.json();
```

### After (Server Action) ✅
```javascript
// app/actions/auth.js
export async function registerUser(name, address, email, password) {
  // ... implementation
}

// Client usage
const result = await registerUser(name, address, email, password);
```

**Benefits:**
- 40% less code
- Better TypeScript support
- No serialization overhead
- Automatic loading states (with useTransition)
- Progressive enhancement

---

## Additional Resources

- [Next.js Server Actions Docs](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- [MongoDB Node Driver](https://www.mongodb.com/docs/drivers/node/current/)
- [bcrypt.js Documentation](https://www.npmjs.com/package/bcryptjs)

---

## Future Enhancements

Potential additions to server actions:


2. **Email Verification**
```javascript
export async function sendVerificationEmail(email)
export async function verifyEmail(token)
```

3. **User Profile Management**
```javascript
export async function updateUserProfile(userId, updates)
export async function deleteUser(userId)
export async function changePassword(userId, oldPassword, newPassword)
```


**Last Updated:** Migration completed - all API routes converted to Server Actions
