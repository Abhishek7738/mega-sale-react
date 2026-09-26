import { useEffect } from "react";

function BackendTest() {
  useEffect(() => {
    fetch("http://localhost:5000/api/health")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      });
  }, []);

  return <h2>Backend Test</h2>;
}

export default BackendTest;