// import { Route, Routes } from "react-router-dom";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import Home from "./pages/Home";
// import Collection from "./pages/Collection";
// import About from "./pages/About";
// import Contact from "./pages/Contact";
// import Product from "./pages/Product";
// import Cart from "./pages/Cart";
// import Login from "./pages/Login";
// import PlaceOrder from "./pages/PlaceOrder";
// import Orders from "./pages/Orders";
// import Navbar from "./components/Navbar";
// import Footer from "./components/Footer";
// import Verify from "./pages/Verify";
// import SearchBar from "./components/SearchBar";
// import Artists from "./pages/Artists"; 
// import Artisitsi from "./pages/Artisitsi";
// import { assets } from "./assets/assets";
// const App = () => {
//   return (
//     <div className="relative min-h-screen">
//       {/* Background Image */}
//       <div 
//         className="fixed inset-0 bg-cover bg-center bg-no-repeat"
//         style={{ backgroundImage: `url(${assets.bgimage})` }} // ✅ Corrected
//       ></div>

//       {/* Content Layer */}
//       <div className="relative z-10 text-[#D6D6C7]">
//         <ToastContainer />
//         <Navbar />
//         <SearchBar />

//         <div className="w-full max-w-[100vw] px-2 sm:px-5 md:px-7 lg:px-9 mx-auto">
//           <Routes>
//             <Route path="/" element={<Home />} />
//             <Route path="/collection" element={<Collection />} />
//             <Route path="/about" element={<About />} />
//             <Route path="/artist" element={<Artists />} />
//             <Route path="/Artistsi" element={<Artisitsi />} />
//             <Route path="/contact" element={<Contact />} />
//             <Route path="/product/:productId" element={<Product />} />
//             <Route path="/Cart" element={<Cart />} />
//             <Route path="/login" element={<Login />} />
//             <Route path="/place-order" element={<PlaceOrder />} />
//             <Route path="/orders" element={<Orders />} />
//             <Route path="/verify" element={<Verify />} />
//           </Routes>
//         </div>

//         <Footer />
//       </div>
//     </div>
//   );
// };

// export default App;
import { Route, Routes, useLocation } from "react-router-dom"; // ✅ Import useLocation
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./pages/Home";
import Collection from "./pages/Collection";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import PlaceOrder from "./pages/PlaceOrder";
import Orders from "./pages/Orders";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Verify from "./pages/Verify";
import SearchBar from "./components/SearchBar";
import Artists from "./pages/Artists"; 
import Artisitsi from "./pages/Artisitsi";
import { assets } from "./assets/assets";
import Wishlist from "./pages/WishList";
import ShopContextProvider from "./context/ShopContext";
import Blog from "./pages/Blog";
import SingleBlog from "./pages/SingleBlog";
import Razorproducts from "./pages/Razorproducts";
import BuyNow from "./pages/BuyNow";
//import ParticleBackground from "./components/ParticleBackground";

const App = () => {
  const location = useLocation(); // ✅ Get current route

  // ✅ Hide Navbar & Footer for login and verify pages
  const hideNavFooter = ["/login", "/verify"].includes(location.pathname);

  return (
    <div className="relative min-h-screen">
      {/* Background Image */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${assets.bgimage})` }}
      ></div>

      {/* Content Layer */}
      <div className="relative z-10 text-[#D6D6C7]">
      {/* <ParticleBackground /> */}

        <ToastContainer />

        {/* ✅ Show Navbar only when not on login/verify */}
        {!hideNavFooter && <Navbar />}
        {!hideNavFooter && <SearchBar />}

        <div className="w-full max-w-[100vw] px-2 sm:px-3 md:px-4 lg:px-9 mx-auto">
        
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/buynow" element={<BuyNow/>}/>
            <Route path="/collection" element={<Collection />} />
            <Route path="/Razorproducts" element={<Razorproducts/>}/>
            <Route path="/about" element={<About />} />
            <Route path="/artist" element={<Artists />} />
            <Route path="/Artistsi" element={<Artisitsi />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/product/:productId" element={<Product />} />
          <Route path="/blog" element={<Blog/>}/>
          <Route path="/blog/:blogId" element={<SingleBlog/>}/>
            <Route path="/cart" element={<Cart />} />
            
            <Route path="/login" element={<Login />} />
            <Route path="/place-order" element={<PlaceOrder />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/verify" element={<Verify />} />
            <Route path="/wishlist" element={<Wishlist />} />

          </Routes>
          
        </div>

        {/* ✅ Show Footer only when not on login/verify */}
        {!hideNavFooter && <Footer />}
      </div>
    </div>
  );
};

export default App;

