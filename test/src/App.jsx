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
