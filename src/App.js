import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import About from "./pages/About";
import Services from "./pages/Services";
import ContactUs from "./pages/ContactUs";

import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import ResetPassword from "./pages/ResetPassword";
import ForgotPassword from "./pages/ForgotPassword";

import Privateroute from "./components/Privateroute";
import UserDashboard from "./user-routes/UserDashboard";
import ProfileInfo from "./user-routes/ProfileInfo";
import "./App.css";
import PostPage from "./pages/PostPage";

import ContextUserProvider from "./context/ContextUserProvider";
import Categories from "./pages/Categories";
import NewFeed from "./components/NewFeed";
import NewFeedForUser from "./components/NewFeedForUser";
import UserFeed from "./pages/UserFeed";
import { GlobalStateProvider } from "./context/GlobalState";
import Categorie from "./pages/Categorie";
import UpdateBlog from "./pages/UpdateBlog";
import UpdatePassword from "./pages/UpdatePassword";
import CustomCategory from "./pages/CustomCategory";
import HelpCenter from "./pages/HelpCenter";
import SaveFeed from "./pages/SaveFeed";
import Category from "./pages/Category";
import PublicProfileInfo from "./pages/PublicProfileInfo";
import UserPostPage from "./pages/UserPostPage";
import LinkPostPage from "./pages/LinkPostPage";
import PostPageByCategory from "./pages/PostPageByCategory";
import PostPageUserByCategory from "./pages/PostPageUserByCategory";
import SavePostPage from "./pages/SavePostPage";
import PostSavePageByCategory from "./pages/PostSavePageByCategory";
import UserSavePage from "./pages/UserSavePage";
import AdminLogin from "./admin/pages/AdminLogin";
import AdminSignup from "./admin/pages/AdminSignup";
import AdminForgotPassword from "./admin/pages/AdminForgotPassword";
import AdminRole from "./admin/pages/AdminRole";
import AdminDashboard from "./admin/pages/AdminDashboard";
function App() {
  return (
    <GlobalStateProvider>
      <BrowserRouter>
        <ToastContainer position="top-center" />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signup/admin" element={<AdminSignup />} />
          <Route path="/newFeed" element={<NewFeed />} />

          <Route path="/viewprofile/:userId" element={<PublicProfileInfo />} />

          <Route path="/login" element={<Login />} />
          <Route path="/login/admin" element={<AdminLogin />} />
          <Route path="/forgotpassword/admin" element={<AdminForgotPassword />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contactus" element={<ContactUs />} />
          <Route path="/resetpassword" element={<ResetPassword />} />
          <Route path="/grant/adminrole" element={<AdminRole />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />

          <Route path="/home" element={<Home />} />
          <Route
            path="/posts/:postId/pageNumber/:pageNumber/sortBy/:sortBy/keyword/:keyword"
            element={<PostPage />}
          />
 
          <Route
            path="/posts/:postId/categorie/:categorieId"
            element={<PostPageByCategory />}
          />
{/* //user/save/${post.postId}/categorie/${post.category.categoryId} */}
          <Route path="/posts/:postId" element={<LinkPostPage />} />
          <Route
            path="/userposts/:postId/pageNumber/:pageNumber/sortBy/:sortBy/keyword/:keyword"
            element={<UserPostPage />}
          />
          <Route path="/categories/:categoryId" element={<Categories />} />
          <Route path="/categorie/:categoryId" element={<Categorie />} />
          <Route path="/category/:categoryId" element={<Category />} />
          <Route path="/user" element={<Privateroute />}>
            <Route path="dashboard" element={<UserDashboard />} />
            <Route path="Feed" element={<UserFeed />} />
            <Route path="save" element={<SaveFeed />} />
            <Route path="custom/category" element={<CustomCategory />} />
            <Route path="viewprofile/:userId" element={<ProfileInfo />} />
            <Route path="updateblog/:blogId" element={<UpdateBlog />} />
            <Route path="updatepassword" element={<UpdatePassword />} />
            <Route path="help" element={<HelpCenter />} />
            <Route
              path="user/posts/:postId/categorie/:categorieId"
              element={<PostPageUserByCategory />}
            />
            
 <Route
              path="saved/:postId/categorie/:categorieId"
              element={<UserSavePage />}
            />
            <Route
              path="save/posts/:postId/categorie/:categorieId"
              element={<PostSavePageByCategory />}
            />
          </Route>
          <Route path="/admin" element={<Privateroute />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="Feed" element={<UserFeed />} />
   
          </Route>

        </Routes>
      </BrowserRouter>
    </GlobalStateProvider>
  );
}

export default App;
