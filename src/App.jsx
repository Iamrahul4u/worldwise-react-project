import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import Homepage from "./pages/Homepage"
import Pricing from "./pages/Pricing"
import Product from "./pages/Product"
import PageNotFound from "./pages/PageNotFound"
import Login from "./pages/Login"
import AppLayout from "./pages/AppLayout"
import CityList from "./components/CityList"
import City from "./components/City"
import CountryList from "./components/CountryList"
import Form from "./components/Form"
import { ProviderCities } from "./Contexts/ProviderCities"
import { AuthProvider } from "./Contexts/AuthProvider"
function App() {
  return (
    <AuthProvider>
      <ProviderCities>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="pricing" element={<Pricing />} />
            <Route path="Product" element={<Product />} />
            <Route path="/login" element={<Login />} />
            <Route path="app" element={<AppLayout />} >
              <Route index element={<Navigate replace to='cities' />} />
              <Route path="cities" element={<CityList />} />
              <Route path="cities/:id" element={<City />} />
              <Route path="country" element={<CountryList />} />
              <Route path="form" element={<Form />} />
            </Route>
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </BrowserRouter>
      </ProviderCities>
    </AuthProvider>
  )
}

export default App
