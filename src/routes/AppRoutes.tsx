import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Home } from '../pages/Home';
import { Catalog } from '../pages/Catalog';
import { ProductDetails } from '../pages/ProductDetails';
import { Encomendas } from '../pages/Encomendas';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/catalogo" element={<Catalog />} />
      <Route path="/encomendas" element={<Encomendas />} />
      <Route path="/produto/:id" element={<ProductDetails />} />
    </Routes>
  );
};
