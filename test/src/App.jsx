import { phantomPatch } from "phantom-request"; // Import the hook

function App() {
  const { patch, loading, error, response } = phantomPatch({
    baseURL: "http://localhost:3000/", // Base URL for your API
    route: "driver/update", // The API route for the PATCH request
    id: "673d31b498e6ebb73305e6fd",
    getLatestData: "driver", // Will refetch this data after the PATCH request
  });

  const handlePatch = () => {
    patch({
      first_name: "phantom", // The data you want to patch
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
