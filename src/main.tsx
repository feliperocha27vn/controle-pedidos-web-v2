/** biome-ignore-all lint/style/noNonNullAssertion: <explanation> */
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router'
import { App } from './App.tsx'
import './index.css'
import { Dashboard } from './pages/dashboard/Dashboard.tsx'
import { CreateNewRecipe } from './pages/recipes/CreateNewRecipe.tsx'
import { EditRecipe } from './pages/recipes/EditRecipe.tsx'
import { ManageRecipes } from './pages/recipes/ManageRecipes.tsx'
import { DetailSale } from './pages/sales/DetailSale.tsx'
import { ManageDelivery } from './pages/sales/ManageDelivery.tsx'
import { ManageSales } from './pages/sales/ManageSales.tsx'
import { NewSale } from './pages/sales/NewSale.tsx'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route index element={<App />} />
      <Route path='dashboard' element={<Dashboard />} />
      <Route path='new-sale' element={<NewSale />} />
      <Route path='new-recipe' element={<CreateNewRecipe />} />
      <Route path='manage-sales' element={<ManageSales />} />
      <Route path='manage-delivery' element={<ManageDelivery />} />
      <Route path='manage-recipes' element={<ManageRecipes />} />
      <Route path='recipes/edit/:idRecipe' element={<EditRecipe />} />
      <Route path='sale/:idSale' element={<DetailSale />} />
    </Routes>
  </BrowserRouter>,
)
