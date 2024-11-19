
import { useRef, useState } from "react";
import { phantomPost } from "phantom-request"; // Import the hook

const App = () => {
  const fileInputRef = useRef(null); // Create a ref for the file input
  const [errorMessage, setErrorMessage] = useState(null); // For client-side error handling

  const { response, error, loading, post } = phantomPost({
    baseURL: "http://localhost:3000/",
    route: "driver/create",
    token: "your-auth-token",
    contentType: "multipart/form-data", // Set content type for file upload
  });

  const handleUpload = () => {
    const file = fileInputRef.current?.files?.[0]; // Access the file from the ref
    if (file) {
      const formData = new FormData();
      formData.append("first_name", "Fred"); // Append first name
      formData.append("last_name", "Flintstone"); // Append last name
      formData.append("image", file); // Append the file

      post(formData); // Send the FormData directly
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
