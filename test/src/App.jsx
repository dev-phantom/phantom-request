import { phantomGet, logout } from 'phantom-request';
function App() {

  
  const { data, loading, error } = useAxiosGet({
    baseURL: "http://localhost:3000/",
    route: "customers",
    // token: "your-auth-token", // Optional
    onUnauthorized: () => logout, // Optional
    // initialState: null, // Optional, default is `null`
    // params: { page: 3, limit: 20 }, // Optional query parameters
    // restHeader: { "X-Custom-Header": "CustomValue" }, // Optional headers
    // asyncAwait: true, // Optional, default is `true`
    // restOptions: { timeout: 5000 }, // Optional Axios config
    // fetchOnMount: true, // Optional, default is `true`
  });
  
  if(!loading) console.log(data)
  if(error) console.log(error)
  

}

export default App
