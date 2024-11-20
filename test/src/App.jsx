import { phantomPut } from "phantom-request"; // Import the hook

function App() {
  const { put, loading, error, response } = phantomPut({
    baseURL: "http://localhost:3000/", // Base URL for your API
    route: "driver/update", // The API route for the PATCH request
  });

  const handlePatch = () => {
    put({
      first_name: "bam mn", // The data you want to patch
      id: "673d31b498e6ebb73305e6fd",

    });
  };

  return (
    <div>
      <button onClick={handlePatch}>Update Driver</button>

      {loading && <p>Updating...</p>} {/* Show loading state while the PATCH request is in progress */}
      {error && <p>Error: {error.message}</p>} {/* Display error if the PATCH request fails */}
      {response && <pre>{JSON.stringify(response, null, 2)}</pre>} {/* Display the latest data after the PATCH request */}
    </div>
  );
}

export default App;
