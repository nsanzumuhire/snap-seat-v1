import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// ErrorBoundary component (implementation needed)
const ErrorBoundary = ({ children }) => {
  const [error, setError] = React.useState(null);
  const [errorInfo, setErrorInfo] = React.useState(null);

  React.useEffect(() => {
    if(error){
      console.error("Error in component:", error, errorInfo)
    }
  }, [error, errorInfo]);

  const onError = (err, info) => {
    setError(err);
    setErrorInfo(info);
  }

  if (error) {
    return (
      <div>
        <h1>Something went wrong.</h1>
        <details style={{ whiteSpace: 'pre-wrap' }}>
          {error && error.toString()}
          <br />
          {errorInfo && errorInfo.componentStack}
        </details>
      </div>
    );
  }

  return children;
};


createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);