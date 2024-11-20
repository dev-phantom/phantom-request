import { phantomPost } from "phantom-request"; // Import the hook

function App() {
  const { post, latestData, loading, error } = phantomPost({
    baseURL: "http://localhost:3000/",
    route: "driver/create",
    getLatestData: "driver", // Will refetch this after post
  });

  return (
    <div>
      <button onClick={() => post({
        first_name: "phantom", // Add first name
        last_name: "oghena", // Add last name
      })}>Create Product</button>

      {loading && <p>Posting...</p>}
      {error && <p>Error: {error.message}</p>}
      {latestData && <pre>{JSON.stringify(latestData, null, 2)}</pre>}
    </div>
  );
}

export default App;
