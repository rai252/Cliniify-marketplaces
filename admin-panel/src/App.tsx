import { Provider } from "react-redux";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import { store } from "./store/store";
import Dashboard from "./pages/dashboard";
import Layout from "./components/layout";
import Doctors from "./pages/doctor";
import DoctorForm from "./pages/doctor/AddDoctors";
import EditDoctorForm from "./pages/doctor/EditDoctor";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DoctorDetails from "./pages/doctor/doctordetails";
import AuthGuard from "./components/auth/AuthGuard";
import Patients from "./pages/patient";
import PatientForm from "./pages/patient/AddPatient";
import PatientDetails from "./pages/patient/PatientDetails";
import EditPatientForm from "./pages/patient/EditPatient";
import Blogs from "./pages/blogs";
import { BlogForm } from "./pages/blogs/AddBlogs";
import BlogPreview from "./pages/blogs/previewBlog";
import { EditBlogForm } from "./pages/blogs/EditBlog";
import Specalizations from "./pages/specalizations";
import { SpecalizationForm } from "./pages/specalizations/AddSpecalizations";
import { EditspecalizationsForm } from "./pages/specalizations/EditSpecalization";
import 'react-tooltip/dist/react-tooltip.css'
import Establishments from "./pages/establishments";
import EstablishmentDetails from "./pages/establishments/establishmentdetails";
import EstablishmentForm from "./pages/establishments/addestablishment";
import EditEstablishmentForm from "./pages/establishments/editestablishment";
import SaleUser from "./pages/sales";
import SaleForm from "./pages/sales/addsaleuser";
import EditSaleForm from "./pages/sales/editSaleuser";
import SaleUserDetails from "./pages/sales/saleuserDetail";


function App() {
  const protectedLayout = (
    <AuthGuard>
      <Layout children={[]} />
    </AuthGuard>
  );
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          {/* Public routes */}

          {/* Protected routes */}
          <Route path="/" element={protectedLayout}>
            <Route index element={<Dashboard />} />
            {/* Doctors */}
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/doctors/add/" element={<DoctorForm />} />
            <Route path="/doctors/details/:id" element={<DoctorDetails />} />
            <Route path="/doctors/:id/edit" element={<EditDoctorForm />} />
            {/* Patients */}
            <Route path="/patients" element={<Patients />} />
            <Route path="/patient/add" element={<PatientForm />} />
            <Route path="/patient/details/:id" element={<PatientDetails />} />
            <Route path="/patient/:id/edit" element={<EditPatientForm />} />

            <Route path="/blogs" element={<Blogs />} />
            <Route path="/blog/add" element={<BlogForm />} />
            <Route path="/blog/details/:id" element={<BlogPreview />} />
            <Route path="/blog/:id/edit" element={<EditBlogForm />} />

            <Route path="/specalizations" element={<Specalizations />} />
            <Route path="/specalization/add" element={<SpecalizationForm />} />
            <Route
              path="/specalization/:id/edit"
              element={<EditspecalizationsForm />}
            />

            <Route path="/establishments" element={<Establishments />} />
            <Route path="/establishment/add" element={<EstablishmentForm />} />
            <Route path="/establishment/details/:id" element={<EstablishmentDetails />} />
            <Route path="/establishment/:id/edit" element={<EditEstablishmentForm />} />

            <Route path="/sales-user" element={<SaleUser />} />
            <Route path="/sales-user/add" element={<SaleForm />} />
            <Route path="/sales-user/details/:id" element={<SaleUserDetails />} />
            <Route path="/sales-user/:id/edit" element={<EditSaleForm />} />

          </Route>

          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
      <ToastContainer />
    </Provider>
  );
}

export default App;
