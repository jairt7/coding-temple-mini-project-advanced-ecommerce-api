import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import CustomerList from "./components/CustomerList";
import OrderForm from "./components/PlaceOrder";
import ProductList from "./components/ProductList";
import ProductDetail from "./components/ProductDetail";
import CustomerFormWrapper from "./components/CustomerFormWrapper";
import CustomerFormWrapper2 from "./components/CustomerFormWrapper2";
import ProductForm from "./components/ProductForm";
import NavigationBar from "./components/NavBar";
import Home from "./components/Home";
import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';

const App = () => {
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  return (
    <div className="appContainer">
      <NavigationBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add-customer" element={<CustomerFormWrapper />} />
        <Route path="/customers" element={<CustomerList />} />
        <Route path="/add-product" element={<ProductForm />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/products/:id" element={<ProductForm />} />
        <Route path="/product-detail/:id" element={<ProductDetail />} />
        <Route path="/customers/:id" element={<CustomerFormWrapper2 />} />
        <Route path="/place-order" element={<OrderForm />} />
      </Routes>
    </div>
  );
};

export default App;
