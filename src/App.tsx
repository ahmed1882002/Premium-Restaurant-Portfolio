import { Routes, Route } from 'react-router-dom';
import Home from '@/pages/Home';
import Restaurant1 from '@/pages/Restaurant1';
import Restaurant2 from '@/pages/Restaurant2';
import Restaurant3 from '@/pages/Restaurant3';
import Restaurant4 from '@/pages/Restaurant4';
import Restaurant5 from '@/pages/Restaurant5';
import Cafe1 from '@/pages/Cafe1';
import Cafe2 from '@/pages/Cafe2';
import Cafe3 from '@/pages/Cafe3';
import Cafe4 from '@/pages/Cafe4';
import Cafe5 from '@/pages/Cafe5';
import DishDetailPage from '@/components/DishDetailPage';
import CategoryDetailPage from '@/components/CategoryDetailPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/sakura" element={<Restaurant1 />} />
      <Route path="/trattoria" element={<Restaurant2 />} />
      <Route path="/grillhouse" element={<Restaurant3 />} />
      <Route path="/lamaison" element={<Restaurant4 />} />
      <Route path="/spiceroute" element={<Restaurant5 />} />
      <Route path="/morningbrew" element={<Cafe1 />} />
      <Route path="/booknook" element={<Cafe2 />} />
      <Route path="/sunlitgarden" element={<Cafe3 />} />
      <Route path="/urbangrind" element={<Cafe4 />} />
      <Route path="/seasidemornings" element={<Cafe5 />} />
      
      {/* Category Detail Page - Simplified Route */}
      <Route path="/category/:categoryId" element={<CategoryDetailPage />} />
      
      {/* Dish Detail Page - Simplified Route */}
      <Route path="/item/:itemId" element={<DishDetailPage />} />
    </Routes>
  );
}

export default App;
