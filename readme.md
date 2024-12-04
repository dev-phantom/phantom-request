# phantom-request

## Table of Contents

1. [Overview](#overview)  
2. [Features](#features)  
3. [Installation](#installation)  
4. [Usage](#usage)  
   - [GET Request](#get-request)  
   - [POST Request](#post-request)  
   - [PATCH Request](#patch-request)  
   - [PUT Request](#put-request)  
   - [DELETE Request](#delete-request)  
5. [API](#api)  
   - [`phantomGet`](#phantomget)  
6. [Customizing Requests](#customizing-requests)  
7. [Contributing](#contributing)  
8. [License](#license)

## Overview

The **goal** of `phantom-request` is to simplify making API requests with minimal code. This package allows you to make HTTP requests in a single line of code, leveraging the power of **[Axios](https://axios-http.com/)**. It is designed for developers who want to quickly perform requests with built-in support for things like token management, headers, and parameters—without worrying about boilerplate code like handling `useEffect` for data fetching (though it can be used for more control).

---

## Features

- **Single-Line Requests:** Makes API requests in just one line of code.  
- **Automatic Axios Integration:** Leverages **[Axios](https://axios-http.com/)** for powerful and flexible HTTP requests.  
- **Error Handling:** Automatically handles common errors like unauthorized access with custom handlers.  
- **Token and Header Management:** Supports automatic token injection and custom headers.  
- **Manual Refetch:** Allows manual triggering of a refetch without needing additional `useEffect` hooks.  
- **Logout and Redirection:** Provides built-in methods to clear cookies and local storage with optional redirection.  
- **Standard JSON POST Requests:** Simplifies sending JSON payloads in POST requests.  
- **File Uploads:** Upload files (e.g., images, videos, PDFs) using `multipart/form-data`.  
- **Cloudinary Integration:** Includes support for media uploads to Cloudinary.  
- **Real-Time Data Fetching:** Automatically fetch the latest data after a POST request.  
- **Authorization Support:** Handles custom headers and authorization seamlessly.  
- **Flexible ID Handling:** Collects `id` as a parameter for PUT and PATCH requests.  
- **DELETE Requests:** Accepts `id` either in the request body or as a parameter for DELETE requests.  

---

## Installation

Install the package via npm or yarn:

```bash
npm install phantom-request
```

or

```bash
yarn add phantom-request
```


### Making Requests

### GET Request

You can use `phantomGet` to perform API requests without needing to manually manage `useEffect` for fetching data. Here’s an example:

```tsx
import React from "react";
import { phantomGet } from "phantom-request";
import { logout, logoutRedirect } from "phantom-request";

function App() {
  const { data, loading, error } = phantomGet({
    baseURL: "http://localhost:3000/",
    route: "customers",
    // token: "your-auth-token", // Optional
    onUnauthorized: logout, // Clear local storage and cookies
    // initialState: null, // Optional, default is `null`
    // params: { page: 3, limit: 20 }, // Optional query parameters
    // restHeader: { "X-Custom-Header": "CustomValue" }, // Optional headers
    // asyncAwait: true, // Optional, default is `true`
    // restOptions: { timeout: 5000 }, // Optional Axios config
    // fetchOnMount: true, // Optional, default is `true`
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}

export default App;
```

### Example with Manual Refetch

You can trigger a manual refetch using the `refetch` method:

```tsx
import React from "react";
import { phantomGet } from "phantom-request";

function App() {
  const { data, loading, error, refetch } = phantomGet({
    baseURL: "http://localhost:3000/",
    route: "product",
    fetchOnMount: true, // Automatically fetches data on mount
  });

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {data && <div>{JSON.stringify(data)}</div>}
      <button onClick={refetch}>Refresh Data</button>
    </div>
  );
}

export default App;
```

### Logout and Redirection

- **`logout`**: Clears all local storage and cookies.

  ```js
  logout();
  ```

- **`logoutRedirect`**: Clears all local storage and cookies, and redirects the user to `/`.

  ```js
  logoutRedirect();
  ```

## API

### `phantomGet`

#### Parameters

| Parameter        | Type                           | Default        | Description                                                                                 |
| ---------------- | ------------------------------ | -------------- | ------------------------------------------------------------------------------------------- |
| **`baseURL`**     | `string`                       | -              | **(Required)** Base URL of the API.                                                         |
| **`route`**       | `string`                       | -              | **(Required)** API route to request.                                                        |
| **`token`**       | `string`                       | -              | **(Optional)** Authorization token (e.g., for Bearer token).                               |
| **`onUnauthorized`** | `() => void`                | -              | **(Optional)** Callback triggered on a 401 Unauthorized response (e.g., `logout`).          |
| **`initialState`** | `T | null`                    | `null`         | **(Optional)** Initial state for the response data.                                          |
| **`params`**      | `Record<string, any>`          | -              | **(Optional)** Query parameters for the request.                                            |
| **`restHeader`**  | `Record<string, string>`       | -              | **(Optional)** Custom headers for the request.                                              |
| **`asyncAwait`**  | `boolean`                      | `true`         | **(Optional)** If `true`, the request will be made with `async/await`. If `false`, it will use promises. |
| **`restOptions`** | `AxiosRequestConfig`           | -              | **(Optional)** Additional Axios config options, like timeouts, etc.                         |
| **`fetchOnMount`** | `boolean`                     | `true`         | **(Optional)** Whether to fetch data immediately upon component mount (default is `true`).  |

#### Returns

| **Return**   | **Type**            | **Description**                                                                           |
|--------------|---------------------|-------------------------------------------------------------------------------------------|
| `data`       | `T \| null`         | The fetched data or `null` if no data has been fetched yet.                              |
| `res`        | `T \| null`         | The fetched response.                                                                    |
| `error`      | `any`               | Any error that occurred during the request.                                              |
| `loading`    | `boolean`           | Indicates whether the request is still loading.                                          |
| `refetch`    | `() => void`        | A function to manually trigger a refetch of the data.                                    |

## Optional Parameters

- **`fetchOnMount`** (default: `true`): If set to `false`, the request will not be automatically made when the component mounts. This is useful if you need more control over when the request happens (e.g., based on user interaction).
  
### Customizing Requests

If you prefer to add `useEffect` manually for more complex behaviors, you can still do so, but it is not required for basic usage:

```tsx
import React, { useEffect } from "react";
import { phantomGet } from "phantom-request";

function App() {
  const { data, loading, error, refetch } = phantomGet({
    baseURL: "http://localhost:3000/",
    route: "product",
    fetchOnMount: false, // Control when to fetch data
  });

  useEffect(() => {
    refetch(); // Manually trigger refetch
  }, []); // Can be customized to refetch based on other dependencies

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {data && <div>{JSON.stringify(data)}</div>}
    </div>
  );
}

export default App;
```

---

### POST Request

- Supports various content types (`application/json`, `multipart/form-data`, etc.)
- Automatic Cloudinary file uploads
- Customizable headers and token-based authorization
- Automatic refetching of latest data after a successful POST
- Error handling for unauthorized requests (`401`) with a callback

---

## Examples

### 1. **Basic JSON POST Request**
```jsx
import { phantomPost } from "phantom-request";

const App = () => {
  const { response, error, loading, post } = phantomPost({
    baseURL: "http://localhost:3000/",
    route: "driver/create",
  });

  const handleSubmit = () => {
    post({ first_name: "Fred", last_name: "Flintstone" });
  };

  return (
    <div>
      <button onClick={handleSubmit}>Submit</button>
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error.message}</div>}
      {response && <pre>{JSON.stringify(response, null, 2)}</pre>}
    </div>
  );
};

export default App;
```

---

### 2. **File Upload with `multipart/form-data`**
**Backend Requirement:** Use a library like `Multer` to handle file uploads on the server.
```jsx
import { useRef, useState } from "react";
import { phantomPost } from "phantom-request";

const App = () => {
  const fileInputRef = useRef(null);
  const { response, error, loading, post } = phantomPost({
    baseURL: "http://localhost:3000/",
    route: "driver/create",
    contentType: "multipart/form-data",
  });

  const handleUpload = () => {
    const file = fileInputRef.current?.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("first_name", "Fred");
      formData.append("last_name", "Flintstone");

      post(formData);
    }
  };

  return (
    <div>
      <input type="file" ref={fileInputRef} />
      <button onClick={handleUpload}>Upload</button>
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error.message}</div>}
      {response && <pre>{JSON.stringify(response, null, 2)}</pre>}
    </div>
  );
};

export default App;
```

---

### 3. **Cloudinary File Upload**
```jsx
import { useRef, useState } from "react";
import { phantomPost } from "phantom-request"; // Import the hook

const App = () => {
  const fileInputRef = useRef(null); // Create a ref for the file input
  const [errorMessage, setErrorMessage] = useState(null); // For client-side error handling

  const { response, error, loading, post } = phantomPost({
    baseURL: "http://localhost:3000/",
    route: "driver/create",
    cloudinaryUpload: {
      cloud_base_url: "https://api.cloudinary.com/v1_1/your_username",
      cloud_route: "/upload", 
      upload_preset: "your upload preset e.g h2bjt9bc",
    },
  });

  const handleUpload = () => {
    const file = fileInputRef.current?.files?.[0]; // Access the file from the ref

    if (file) {
      const data = {
        first_name: "phantom", // Add first name
        last_name: "Flintstone", // Add last name
        image: { value: file, CloudinaryImage: true }, // Tag the image for Cloudinary upload
      };

      post(data); // Send the data object with tagged image
    } else {
      setErrorMessage("Please select a file before uploading.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <input type="file" ref={fileInputRef} /> {/* Use ref to access the file input */}
      <button onClick={handleUpload}>Upload</button>

      {/* Display client-side error if any */}
      {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}

      {/* Display the response data */}
      {response && (
        <div>
          <h3>Response:</h3>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default App;

```

## API

### `phantomPost`

#### Parameters
| Parameter        | Type                                  | Default                | Description                                                                                                   |
|------------------|---------------------------------------|------------------------|---------------------------------------------------------------------------------------------------------------|
| `baseURL`        | `string`                             | **Required**           | Base URL of the API.                                                                                          |
| `route`          | `string`                             | **Required**           | API endpoint for the POST request.                                                                            |
| `token`          | `string`                             | `undefined`            | Authorization token, included as a `Bearer` token in the headers.                                             |
| `onUnauthorized` | `() => void`                         | `() => {}`             | Callback executed when the server returns a `401 Unauthorized` response.                                      |
| `initialState`   | `R` or `null`                        | `null`                 | Initial state for the response data.                                                                          |
| `headers`        | `Record<string, string>`             | `{}`                   | Additional headers to include in the request.                                                                |
| `contentType`    | `"application/json" \| "multipart/form-data" \| "application/x-www-form-urlencoded"` | `"application/json"` | Content-Type of the request body.                                                                             |
| `axiosOptions`   | `AxiosRequestConfig`                 | `{}`                   | Additional configuration options for Axios.                                                                   |
| `cloudinaryUpload`| `CloudinaryUploadOptions`           | `undefined`            | Configuration for Cloudinary integration, enabling media uploads.                                             |
| `getLatestData`  | `string`                             | `undefined`            | API route to fetch the latest data after a successful POST request.                                           |

---

### Return Value

The hook returns an object with the following:

| Property      | Type                  | Description                                                                 |
|---------------|-----------------------|-----------------------------------------------------------------------------|
| `response`    | `R \| null`           | The server response data.                                                   |
| `res`    | `R \| null`           | The server response                                                    |
| `error`       | `any`                 | Error object if the request fails.                                          |
| `loading`     | `boolean`             | Indicates if the request is in progress.                                    |
| `post`        | `(data: any) => void` | Function to send a POST request. Accepts the request body as its parameter. |
| `latestData`  | `R \| null`           | The latest data fetched after a successful POST (if `getLatestData` is set).|

---

### PATCH request


Here’s an example of using `phantomPatch` with an ID, headers, token, and refetching the latest data after a successful patch:

```tsx
import { phantomPatch } from "phantom-request"; // Import the hook

function App() {
  const { patch, latestData, loading, error, response } = phantomPatch({
    baseURL: "http://localhost:3000/", // Base URL for your API
    route: "driver/update", // API route for the PATCH request
    id: "673d31b498e6ebb73305e6fd", // ID of the resource to update
    getLatestData: "driver", // Will refetch this data after the PATCH request
    token: "your-auth-token", // Authorization token
    onUnauthorized: () => {
      alert("Unauthorized! Please log in.");
    }, // Callback when the server returns a 401 error
    headers: {
      "X-Custom-Header": "CustomValue",
    }, // Additional custom headers
    contentType: "application/json", // Content-Type of the request body
  });

  const handlePatch = () => {
    patch({
      first_name: "phantom", // The data you want to patch
      last_name: "request",
    });
  };

  return (
    <div>
      <button onClick={handlePatch}>Update Driver</button>

      {loading && <p>Updating...</p>} {/* Show loading state while the PATCH request is in progress */}
      {error && <p>Error: {error.message}</p>} {/* Display error if the PATCH request fails */}
      {latestData && <pre>{JSON.stringify(latestData, null, 2)}</pre>} {/* Display the latest data after the PATCH request */}
      {response && <pre>{JSON.stringify(response, null, 2)}</pre>} {/* Display response from the PATCH request */}
    </div>
  );
}

export default App;
```

### Example with Cloudinary

```tsx
const App = () => {
  const { patch, latestData, loading, error } = phantomPatch({
    baseURL: "http://localhost:3000/",
    route: "media/update",
    id: "673d31b498e6ebb73305e6fd",
    cloudinaryUpload: {
      cloud_base_url: "https://api.cloudinary.com/v1_1/your-cloud-name",
      upload_preset: "your-upload-preset",
    },
    getLatestData: "media",
  });

  const handlePatch = () => {
    patch({
      image: { value: "path/to/image.jpg", CloudinaryImage: true },
    });
  };

  return (
    <div>
      <button onClick={handlePatch}>Update Image</button>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {latestData && <pre>{JSON.stringify(latestData, null, 2)}</pre>}
    </div>
  );
};
```

---

### Parameters in `phantomPatch`

Below are the parameters you can pass to `phantomPatch` and their descriptions:

| Parameter          | Type                              | Description                                                                                                                                 |
|--------------------|-----------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------|
| `baseURL`          | `string`                         | Base URL for your API, e.g., `http://localhost:3000/`.                                                                                      |
| `route`            | `string`                         | API endpoint route for the `PATCH` request, e.g., `driver/update`.                                                                          |
| `id`               | `string` (optional)              | ID of the resource to be updated. Will be appended to the route, e.g., `driver/update/:id`.                                                 |
| `token`            | `string` (optional)              | Authorization token to be sent in the `Authorization` header as `Bearer <token>`.                                                           |
| `onUnauthorized`   | `() => void` (optional)          | Callback function to handle 401 Unauthorized responses, such as redirecting to a login page.                                                |
| `initialState`     | `R \| null` (optional)            | Initial state for the `response`. Useful for setting a default value.                                                                       |
| `headers`          | `Record<string, string>` (optional) | Custom headers to include in the request, e.g., `{ "X-Custom-Header": "value" }`.                                                           |
| `contentType`      | `"application/json" \| "multipart/form-data" \| "application/x-www-form-urlencoded"` | Content type of the request. Default is `application/json`.                                          |
| `axiosOptions`     | `AxiosRequestConfig` (optional)  | Additional Axios options, such as timeouts or custom response handling.                                                                     |
| `cloudinaryUpload` | `CloudinaryUploadOptions` (optional) | Configuration for uploading files to Cloudinary.                                                                                            |
| `getLatestData`    | `string` (optional)              | API route to fetch the latest data after a successful patch. Uses `phantomGet` internally to retrieve this data.                           |

---

### Explanation of Features

- **`id`**: Allows appending an identifier to the endpoint, useful for updating specific resources. For example, if `id` is `673d31b498e6ebb73305e6fd`, the final route will be `driver/update/673d31b498e6ebb73305e6fd`.
  
- **`token`**: Useful for secured endpoints. Automatically sets the `Authorization` header with `Bearer <token>`.

- **`onUnauthorized`**: Executes a callback (e.g., redirect to login) if the server returns a 401 Unauthorized response.

- **`headers`**: Add any additional headers, such as `X-Custom-Header`.

- **`getLatestData`**: Refetches data from the provided route after a successful patch operation. For instance, after updating a driver, you can retrieve the updated driver data.

- **`contentType`**: Allows selecting the content type for the request body. Supports `application/json`, `multipart/form-data`, and `application/x-www-form-urlencoded`.

- **`cloudinaryUpload`**: If included, processes data containing Cloudinary image uploads. Images are uploaded to Cloudinary before sending the patch request.

---

### Return Parameters for `phantomPatch`

| Parameter         | Type                         | Description                                                                                              |
|-------------------|------------------------------|----------------------------------------------------------------------------------------------------------|
| `response`        | `R \| null`                    | The data returned from the API after a successful PATCH request. This contains the updated resource data. |
| `res`        | `R \| null`                    | The response returned from the API after a successful PATCH request. |
| `error`           | `any`                         | The error object if the PATCH request fails. Can contain error message, status code, or other details.    |
| `loading`         | `boolean`                     | Indicates whether the PATCH request is in progress. `true` when loading, `false` when the request is complete. |
| `patch`           | `(data: any) => void`         | A function that you call to trigger the PATCH request with the specified `data`. It sends the data to the server to be updated. |
| `latestData`      | `R \| null`                    | Contains the most recent data fetched from the server (if `getLatestData` was provided and refetched). This value is updated after a successful PATCH request. |

---

### PUT Request

```tsx
import { phantomPut } from "phantom-request"; // Import the hook

function App() {
  const { put, latestData, loading, error, response } = phantomPut({
    baseURL: "http://localhost:3000/", // Base URL for your API
    route: "user/update", // API route for the PUT request
    id: "12345", // ID of the resource to update (optional)
    getLatestData: "user", // Refetch this route after the PUT request
    token: "your-auth-token", // Authorization token
    onUnauthorized: () => {
      alert("Session expired. Please log in again.");
    }, // Handle 401 errors
    headers: {
      "X-Custom-Header": "MyValue",
    }, // Custom headers
    contentType: "application/json", // Content-Type of the request body
  });

  const handleUpdate = () => {
    put({
      username: "newUsername", // Updated data
      email: "newEmail@example.com",
    });
  };

  return (
    <div>
      <button onClick={handleUpdate}>Update User</button>
      {loading && <p>Loading...</p>} {/* Show a loading indicator */}
      {error && <p>Error: {error.message}</p>} {/* Display errors */}
      {latestData && <pre>{JSON.stringify(latestData, null, 2)}</pre>} {/* Display the latest fetched data */}
      {response && <pre>{JSON.stringify(response, null, 2)}</pre>} {/* Display the API response */}
    </div>
  );
}

export default App;
```

### Example with File Upload (e.g., Profile Picture)

```tsx
const App = () => {
  const { put, latestData, loading, error } = phantomPut({
    baseURL: "http://localhost:3000/",
    route: "profile/update",
    id: "12345",
    cloudinaryUpload: {
      cloud_base_url: "https://api.cloudinary.com/v1_1/your-cloud-name",
      
      upload_preset: "preset-name",
    },
    getLatestData: "profile",
  });

  const handleUpdate = () => {
    put({
      avatar: { value: "path/to/profile.jpg", CloudinaryImage: true },
    });
  };

  return (
    <div>
      <button onClick={handleUpdate}>Update Profile</button>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {latestData && <pre>{JSON.stringify(latestData, null, 2)}</pre>}
    </div>
  );
};
```

---

### Features and Parameters

| Parameter          | Type                              | Description                                                                 |
|--------------------|-----------------------------------|-----------------------------------------------------------------------------|
| `baseURL`          | `string`                         | Base URL for your API, e.g., `http://localhost:3000/`.                      |
| `route`            | `string`                         | API endpoint route for the `PUT` request, e.g., `user/update`.              |
| `id`               | `string` (optional)              | Resource ID to append to the route, e.g., `user/update/:id`.                |
| `token`            | `string` (optional)              | Authorization token sent in `Authorization: Bearer <token>`.                |
| `onUnauthorized`   | `() => void` (optional)          | Callback for 401 Unauthorized responses, e.g., redirecting to login.        |
| `headers`          | `Record<string, string>` (optional) | Additional headers for the request.                                        |
| `contentType`      | `"application/json" \| "multipart/form-data" \| "application/x-www-form-urlencoded"` | Content-Type of the request. Default is `application/json`.|
| `getLatestData`    | `string` (optional)              | Refetch the latest data from this route after a successful PUT.             |

---

### Return Parameters

| Parameter         | Type                  | Description                                                                 |
|-------------------|-----------------------|-----------------------------------------------------------------------------|
| `response`        | `R \| null`           | Response from the PUT request, e.g., updated resource data.                |
| `error`           | `any`                | Error object if the PUT request fails.                                     |
| `loading`         | `boolean`            | Indicates whether the PUT request is in progress.                          |
| `put`             | `(data: any) => void` | Function to trigger the PUT request with the provided data.                |
| `latestData`      | `R \| null`           | Refreshed data fetched after a successful PUT request (if `getLatestData`).|


---
### DELETE Request

- **Dynamic Routing:** You can pass `id` dynamically in the request or configure it globally when initializing the hook.
- **Error Handling:** Handle server errors gracefully with the `error` property.
- **Global State:** Use `getLatestData` for automatic updates to global or shared data after a delete.



### DELETE Request Using Params

```tsx
import { phantomDelete } from "phantom-request";

function App() {
  const { deleteRequest, loading, error, response, latestData } = phantomDelete({
    baseURL: "http://localhost:3000/",
    route: "driver/delete", // Base route
    id: "673d19b1017652a1564ff2ca", // ID to delete
    getLatestData: "driver", // Optional route to fetch the latest data after delete
  });

  const handleDelete = () => {
    deleteRequest(); // ID from the hook configuration is used
  };

  return (
    <div>
      <button onClick={handleDelete}>Delete Driver</button>
      {loading && <p>Deleting...</p>}
      {error && <p>Error: {error.message}</p>}
      {response && <pre>{JSON.stringify(latestData, null, 2)}</pre>}
    </div>
  );
}

export default App;
```

---

### DELETE Request Using Body

```tsx
import { phantomDelete } from "phantom-request";

function App() {
  const { deleteRequest, loading, error, response, latestData } = phantomDelete({
    baseURL: "http://localhost:3000/",
    route: "driver/delete",
    getLatestData: "driver", // Optional route to fetch updated data
  });

  const handleDelete = () => {
    deleteRequest({
      body: { id: "673d292c8b1d5b094f5eb2df" }, // Send ID in the body
    });
  };

  return (
    <div>
      <button onClick={handleDelete}>Delete Driver</button>
      {loading && <p>Deleting...</p>}
      {error && <p>Error: {error.message}</p>}
      {response && <pre>{JSON.stringify(latestData, null, 2)}</pre>}
    </div>
  );
}

export default App;
```

---

### `phantomDelete`

The `phantomDelete` hook provides an interface for handling DELETE requests. It supports dynamic routing, token-based authentication, custom headers, and additional options.

### Hook Parameters

| Parameter        | Type                     | Default       | Description                                                                 |
|------------------|--------------------------|---------------|-----------------------------------------------------------------------------|
| `baseURL`        | `string`                | **Required**  | The base URL for the API.                                                  |
| `route`          | `string`                | **Required**  | The endpoint for the DELETE request.                                       |
| `id`             | `string`                | `undefined`   | Default ID for the request (used for dynamic routes).                      |
| `token`          | `string`                | `undefined`   | Token for `Authorization` header (Bearer token).                           |
| `onUnauthorized` | `() => void`            | `() => {}`    | Callback triggered when a `401 Unauthorized` error occurs.                 |
| `initialState`   | `any`                   | `null`        | Initial state for the response data.                                       |
| `headers`        | `Record<string, string>`| `{}`          | Additional headers for the request.                                        |
| `axiosOptions`   | `AxiosRequestConfig`    | `{}`          | Custom Axios configuration for advanced use cases.                         |
| `getLatestData`  | `string`                | `undefined`   | Endpoint to fetch updated data after a successful delete.                  |

---

### Return Values

The hook returns the following properties:

| Property        | Type                                | Description                                                       |
|------------------|-------------------------------------|-------------------------------------------------------------------|
| `deleteRequest`  | `(options?: { id?: string; body?: Record<string, any>; }) => void` | Function to trigger the DELETE request.                         |
| `loading`        | `boolean`                          | Indicates if the request is in progress.                         |
| `error`          | `any`                              | Error object from the request (if any).                          |
| `response`       | `any`                              | Response data from the DELETE request.                           |
| `res`       | `any`                              | Response from the DELETE request.                           |
| `latestData`     | `any`                              | Data from the `getLatestData` route (if configured).             |

---

## Additional Parameters

### Token Header
- **Type:** `string`
- **Description:** A Bearer token for authentication. Automatically added to the `Authorization` header.
  
### Custom Headers
- **Type:** `Record<string, string>`
- **Description:** Additional headers to include in the request. Example:

  ```jsx
  headers: {
    "Content-Type": "application/json",
    "X-Custom-Header": "customValue",
  }
  ```

### `onUnauthorized`
- **Type:** `() => void`
- **Description:** Callback invoked when a `401 Unauthorized` response is received.

### `axiosOptions`
- **Type:** `AxiosRequestConfig`
- **Description:** Advanced Axios configurations such as timeouts or interceptors.

---


### Explanation of **Cloudinary Upload Options**

The `cloudinaryUpload` parameter allows seamless integration with Cloudinary for file uploads. Below are the supported options:

| Parameter        | Type                  | Description                                                                                               |
|------------------|-----------------------|-----------------------------------------------------------------------------------------------------------|
| `cloud_base_url` | `string`             | The base URL for your Cloudinary account, e.g., `https://api.cloudinary.com/v1_1/your-cloud-name`.        |
| `cloud_route`    | `string` (optional)  | The Cloudinary API endpoint route. Defaults to `/upload`.                                                |
| `upload_preset`  | `string`             | A preset configured in your Cloudinary account for handling uploads.                                     |

---

### How Cloudinary Upload Works

1. **Detection of Cloudinary Fields**: If any field in your patch request contains an object with `CloudinaryImage: true` and a `value` property, the hook uploads it to Cloudinary.
   
2. **Upload to Cloudinary**: 
   - The file (`value`) is uploaded to the Cloudinary endpoint (`cloud_base_url + cloud_route`) using the specified `upload_preset`.
   - The upload returns the URL of the uploaded asset.

3. **Replace Field Value**: 
   - The original field is replaced with the Cloudinary URL returned from the upload.
   - Example: `{ profile_image: { value: "path/to/image.jpg", CloudinaryImage: true } }` becomes `{ profile_image: "https://cloudinary-url.com/image.jpg" }`.

4. **Send Updated Data**: The modified data is sent in the `PATCH` or `POST` or `PUT` request body.

---

### Example with Multiple Cloudinary Fields

```tsx
const App = () => {
  const { patch, latestData, loading, error } = phantomPatch({
    baseURL: "http://localhost:3000/",
    route: "media/update",
    cloudinaryUpload: {
      cloud_base_url: "https://api.cloudinary.com/v1_1/your-cloud-name",
      upload_preset: "your-upload-preset",
    },
    getLatestData: "media",
  });

  const handlePatch = () => {
    patch({
      profile_image: { value: "path/to/profile.jpg", CloudinaryImage: true }, // Upload to Cloudinary
      cover_image: { value: "path/to/cover.jpg", CloudinaryImage: true }, // Upload to Cloudinary
      name: "User Name", // Regular field
    });
  };

  return (
    <div>
      <button onClick={handlePatch}>Update Media</button>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {latestData && <pre>{JSON.stringify(latestData, null, 2)}</pre>}
    </div>
  );
};
```

## Contributing

Feel free to contribute by opening issues or submitting pull requests! Improvements and new features are always welcome.

## License

This project is licensed under the MIT License.

---
