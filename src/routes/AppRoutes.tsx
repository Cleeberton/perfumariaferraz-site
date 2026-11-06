import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Home } from '../pages/Home';
import { Catalog } from '../pages/Catalog';
import { ProductDetails } from '../pages/ProductDetails';
import { PerfumeMatch } from '../pages/PerfumeMatch';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/catalogo" element={<Catalog />} />
      <Route path="/perfume-match" element={<PerfumeMatch />} />
      <Route path="/produto/:id" element={<ProductDetails />} />
    </Routes>
  );
};
