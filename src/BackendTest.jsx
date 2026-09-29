import { useEffect, useState } from "react";
import ProductCard from "./components/ProductCard";

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
      <ProductCard key={product._id} {...product} />
    ))}
  </div>
);
}


export default BackendTest;
