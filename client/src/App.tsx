import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import Layout from "./Layout/Layout.tsx";
import Home from "./Components/Home/Home.tsx";
import RegisterAgent from "./Components/Register/RegisterAgent/RegisterAgent.tsx";
import "./App.css";
import Payment from './Components/PaymentPage/Payment.tsx';
import LoginAgent from './Components/Login/LoginAgent/LoginAgent.tsx';
import AgenceDashboadLayout from './Components/AgenceDashboadLayout/AgenceDashboadLayout.tsx';
import AdminDashboard from './Components/AgentDashboard/AdminDashboard.tsx';
import AgenceAdminProfile from './Components/AgenceAdminProfile/AgenceAdminProfile.tsx';
import AgenceAdminVehicules from './Components/AgenceAdminVehicules/AgenceAdminVehicules.tsx';
import CheckState from './Components/checkState/CheckState.tsx';
import CreateListing from './Components/CreateListing/CreateListing.tsx';
import EditVehicule from './Components/EditVehicule/EditVehicule.tsx';
import SingleCar from './Components/SingleCar/SingleCar.tsx';
import Register from './Components/Register/Register/Register.tsx';
import Login from './Components/Login/UserLogin/Login.tsx';
import UserReservations from './Components/UserReservations/UserReservations.tsx';
import UserProfile from './Components/UserProfile/UserProfile.tsx';


function App() {
  const router = createBrowserRouter(createRoutesFromElements(
    <Route element={<CheckState />}>

      {/* For the Agency Admin Routes*/}
      <Route path="/agence-dashboard" element={<AgenceDashboadLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="profile" element={<AgenceAdminProfile />}></Route>
        <Route path="vehicules" element={<AgenceAdminVehicules />}></Route>
        <Route path="create-listing" element={<CreateListing />}></Route>
        <Route path="edit-vehicule/:id" element={<EditVehicule />}></Route>
      </Route>

      {/* For the user routes */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />}></Route>
        <Route path="register-agent" element={<RegisterAgent />}></Route>
        <Route path="login-agent" element={<LoginAgent />}></Route>
        <Route path="register" element={<Register />}></Route>
        <Route path="login" element={<Login />}></Route>
        <Route path="mes-reservations" element={<UserReservations />} />
        <Route path="profile" element={<UserProfile />} />



        <Route element={null}>
        <Route path="cars/:id" element={<SingleCar />}></Route>
          <Route path="payment" element={<Payment />}></Route>
        </Route>
      </Route>
    </Route>
  ));
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App;