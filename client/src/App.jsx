import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { useIsCallerAdmin } from "./hooks/useQueries";
import About from "./pages/About";
import AdminDashboard from "./pages/AdminDashboard";
import BookAppointment from "./pages/BookAppointment";
import Contact from "./pages/Contact";
import Doctors from "./pages/Doctors";
import Home from "./pages/Home";
import Login from "./pages/Login";
import PatientDashboard from "./pages/PatientDashboard";
import Services from "./pages/Services";
import Signup from "./pages/Signup";

function AuthLoading({ message }) {
  return (
    <div className="page-section py-20">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-medium text-slate-600">{message}</p>
      </div>
    </div>
  );
}

function RequireAuth({ children }) {
  const location = useLocation();
  const { identity, isLoggingIn } = useInternetIdentity();

  if (isLoggingIn) {
    return <AuthLoading message="Completing secure sign-in..." />;
  }

  if (!identity) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}

function RequireAdmin({ children }) {
  const location = useLocation();
  const { identity, isLoggingIn } = useInternetIdentity();
  const { data: isAdmin, isLoading } = useIsCallerAdmin();

  if (isLoggingIn || isLoading) {
    return <AuthLoading message="Checking administrator access..." />;
  }

  if (!identity) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function App() {
  return (
    <div className="site-shell min-h-screen bg-background text-foreground">
      <Header />
      <main className="relative z-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/appointment" element={<BookAppointment />} />
          <Route
            path="/dashboard"
            element={
              <RequireAuth>
                <PatientDashboard />
              </RequireAuth>
            }
          />
          <Route
            path="/admin"
            element={
              <RequireAdmin>
                <AdminDashboard />
              </RequireAdmin>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/book" element={<Navigate to="/appointment" replace />} />
          <Route
            path="/patient-dashboard"
            element={<Navigate to="/dashboard" replace />}
          />
          <Route
            path="/admin-dashboard"
            element={<Navigate to="/admin" replace />}
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
