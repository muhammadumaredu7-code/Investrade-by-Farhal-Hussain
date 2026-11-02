import { Toaster } from "react-hot-toast";
import Home from './pages/client/Home.jsx';
import Dashboard from './pages/client/Dashboard/Dashboard.jsx';
import ClientVipGroups from './components/client/Dashboard/ClientVipGroups.jsx';
import ClientCourses from './components/client/Dashboard/ClientCourses.jsx';
import ClientSignals from './components/client/Dashboard/ClientSignals.jsx';
import ClientSubscribedProducts from './components/client/Dashboard/ClientSubscribedProducts.jsx';
import EditProfile from './pages/EditProfile.jsx';
import VerifyCode from './pages/VerifyCode.jsx';
import Header from './components/client/Header.jsx';
import About from './components/client/subComponent/AboutDetails.jsx';
import BlogDetail from './components/client/subComponent/BlogDetails.jsx';
import AccountOpening from './components/client/Services/AccountOpening.jsx';
import AccountManagement from './components/client/Services/AccountManagement.jsx';
import PsxRegistration from './components/client/Services/PsxRegistration.jsx';
import VipGroups from './components/client/Services/VipGroups.jsx';
import Products from './components/client/Products/Products.jsx';
import ProductDetail from './components/client/Products/ProductDetail.jsx';
import Academy from './components/client/Academy/Academy.jsx';
import CourseDetail from './components/client/Academy/CourseDetail.jsx';
import MarketWatch from './components/client/MarketWatch/MarketWatch.jsx';
import Community from './components/client/Community/Community.jsx';
import MainBlog from './components/client/mainBlog.jsx';
import Reviews from './components/client/Reviews.jsx';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import Footer from './components/client/Footer.jsx';
import AdminWorkspace from './pages/admin/AdminWorkspace.jsx';

const ClientLayout = () => (
  <>
    <Header />
    <Outlet />
    <Footer />
  </>
);

const App = () => {
  return (
    <div>
      <Toaster />
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route element={<ClientLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/blog/:id" element={<BlogDetail />} />
          <Route path="/account-opening" element={<AccountOpening />} />
          <Route path="/account-management" element={<AccountManagement />} />
          <Route path="/psx-registration" element={<PsxRegistration />} />
          <Route path="/vip-groups" element={<VipGroups />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/academy" element={<Academy />} />
          <Route path="/academy/:id" element={<CourseDetail />} />
          <Route path="/market-watch" element={<MarketWatch />} />
          <Route path="/community" element={<Community />} />
          <Route path="/blogs" element={<MainBlog />} />
          <Route path="/reviews" element={<Reviews />} />
        </Route>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/vip-groups" element={<ClientVipGroups />} />
        <Route path="/dashboard/courses" element={<ClientCourses />} />
        <Route path="/dashboard/signals" element={<ClientSignals />} />
        <Route path="/dashboard/products" element={<ClientSubscribedProducts />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/dashboard/edit-profile" element={<Navigate to="/edit-profile" replace />} />
        <Route path="/admin/settings" element={<Navigate to="/edit-profile" replace />} />
        <Route path="/dashboard/verify-code" element={<VerifyCode />} />
        <Route path="/admin/*" element={<AdminWorkspace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default App
