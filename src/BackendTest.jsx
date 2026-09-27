import { useEffect, useState } from "react";

function BackendTest() {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
      });
  }, []);

 return (
  <div>
    {products.map((product) => (
      <div key={product.name}>
        <h2>{product.name}</h2>
        <p>{product.price}</p>
      </div>
    ))}
  </div>
);
}

export default BackendTest;
