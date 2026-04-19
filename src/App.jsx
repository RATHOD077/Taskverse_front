import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Public Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

// User Pages
import Dashboard from "./pages/Dashboard";

// Emp Pages
import EmpDashboard from './pages/Emp/Dashboard';
import Cases from './pages/Emp/CasesManage/Cases';
import CaseDetails from './pages/Emp/CasesManage/CaseDetails';
import Hearings from './pages/Emp/CasesManage/Hearings';
import EmpMediaLibrary from './pages/Emp/EmpMediaLibrary';
import EmpClients from './pages/Emp/Clients';
import EmpClientDetails from './pages/Emp/ClientDetails';
import EmpCalendarPage from './pages/Emp/EmpCalendarPage';

import EmpTasks from './pages/Emp/Tasks';

// Admin Pages
import AdminLogin from "./pages/Admin/AdminLogin";
import AdminDashboard from "./pages/Admin/Dashboard";
import Roles from "./pages/admin/Roles";
import Users from "./pages/Admin/Users/User";
import UserTasks from "./pages/Admin/Users/UserTask";


// Task Management
import AdminTasks from "./pages/Admin/task/Tasks";
import TaskStages from "./pages/Admin/task/TaskStages";

import TaskTypes from "./pages/Admin/task/TaskType";

// Document Management
import Documents from "./pages/Admin/document/Documents";
import PhysicalFiles from "./pages/Admin/document/PhysicalFiles";

// Customer Management
import Customers from "./pages/Admin/customer/Customers";


// --- Admin -> User Sub-Pages --------------------------------------------------
import UserPage from './pages/Admin/Users/User';
import UserTask from './pages/Admin/Users/UserTask';
import UserRole from './pages/Admin/Users/UserRole';


// --- Layouts ------------------------------------------------------------------

import AdminLayout from "./components/AdminLayout";
import UserLayout from "./components/UserLayout";
import CustomerTypes from "./pages/Admin/customer/CustomerTypes";
import DocumentCategories from "./pages/Admin/document/DocumentCategories";
import TaskStatuses from "./pages/Admin/task/TaskStatuses";
import DocumentVersions from "./pages/Admin/document/DocumentVersions";
import DocumentPermissions from "./pages/Admin/document/DocumentPermissions";
import MediaLibrary from "./pages/Admin/MediaLibrary";
import NotificationTemplates from "./pages/Admin/NotificationTemplates";

import SharedDocument from "./pages/Shared/SharedDocument";
import Clients from "./pages/Emp/Client/Clients";
import EmailTemplates from "./pages/Admin/Notification/EmailTemplates";
import SendEmail from "./pages/Admin/Notification/SendEmail";
import EmailLogs from "./pages/Admin/Notification/EmailLogs";
import SendSMS from "./pages/Admin/Notification/SendSMS";
import SmsLogs from "./pages/Admin/Notification/SmsLogs";
import BirthdayReminders from "./pages/Admin/Notification/Reminders/BirthdayReminders";
import ReminderLogs from "./pages/Admin/Notification/Reminders/ReminderLogs";

// --- Route Guards ------------------------------------------------------------
function AdminRoute({ children }) {
  const token = localStorage.getItem('token');
  const admin = localStorage.getItem('admin');
  if (!token || !admin) return <Navigate to="/admin" replace />;
  return children;
}

function UserRoute({ children }) {
  const token = localStorage.getItem('token');
  const user  = localStorage.getItem('user');
  if (!token || !user) return <Navigate to="/login" replace />;
  return children;
}

// --- App ----------------------------------------------------------------------
function App() {
  return (
    <Router>
      <Routes>
        {/* --- Public Routes --- */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/shared/:token" element={<SharedDocument />} />

        {/* --- Admin Protected Routes --- */}
       <Route path="/admin/dashboard" element={<AdminRoute><AdminLayout><AdminDashboard /></AdminLayout></AdminRoute>} />
        <Route path="/admin/users"     element={<AdminRoute><AdminLayout><UserPage /></AdminLayout></AdminRoute>} />
        <Route path="/admin/users/tasks" element={<AdminRoute><AdminLayout><UserTask /></AdminLayout></AdminRoute>} />
        <Route path="/admin/users/roles" element={<AdminRoute><AdminLayout><UserRole /></AdminLayout></AdminRoute>} />
       
        
        {/* Task Management */}
        <Route path="/admin/tasks" element={<AdminRoute><AdminLayout><AdminTasks /></AdminLayout></AdminRoute>} />
        <Route path="/admin/task-stages" element={<AdminRoute><AdminLayout><TaskStages /></AdminLayout></AdminRoute>} />
        
        <Route path="/admin/task-types" element={<AdminRoute><AdminLayout><TaskTypes /></AdminLayout></AdminRoute>} />
        <Route path="/admin/task-status" element={<AdminRoute><AdminLayout><TaskStatuses /></AdminLayout></AdminRoute>} />



        {/* Document Management */}
        <Route path="/admin/documents" element={<AdminRoute><AdminLayout><Documents /></AdminLayout></AdminRoute>} />
        <Route path="/admin/physical-files" element={<AdminRoute><AdminLayout><PhysicalFiles /></AdminLayout></AdminRoute>} />
        <Route path="/admin/documents-categories" element={<AdminRoute><AdminLayout><DocumentCategories /></AdminLayout></AdminRoute>} />
        <Route path="/admin/document-versions" element={<AdminRoute><AdminLayout><DocumentVersions /></AdminLayout></AdminRoute>} />
        <Route path="/admin/documents-permissions" element={<AdminRoute><AdminLayout><DocumentPermissions /></AdminLayout></AdminRoute>} />
       

       




        {/* Customer Management */}
        <Route path="/admin/customers" element={<AdminRoute><AdminLayout><Customers /></AdminLayout></AdminRoute>} />
        <Route path="/admin/customers-types" element={<AdminRoute><AdminLayout><CustomerTypes /></AdminLayout></AdminRoute>} />
       
       

        {/* --- User / Employee Protected Routes --- */}
        <Route path="/dashboard" element={<UserRoute><UserLayout><EmpDashboard /></UserLayout></UserRoute>} />
        <Route path="/emp/dashboard" element={<UserRoute><UserLayout><EmpDashboard/></UserLayout></UserRoute>} />
        <Route path="/emp/cases" element={<UserRoute><UserLayout><Cases/></UserLayout></UserRoute>} />
        <Route path="/emp/cases/:id" element={<UserRoute><UserLayout><CaseDetails/></UserLayout></UserRoute>} />
        <Route path="/emp/hearings" element={<UserRoute><UserLayout><Hearings/></UserLayout></UserRoute>} />
        <Route path="/emp/clients" element={<UserRoute><UserLayout><Clients/></UserLayout></UserRoute>} />

        <Route path="/emp/media" element={<UserRoute><UserLayout><EmpMediaLibrary/></UserLayout></UserRoute>} />
        <Route path="/emp/clients/:id" element={<UserRoute><UserLayout><EmpClientDetails/></UserLayout></UserRoute>} />
        <Route path="/emp/calendar" element={<UserRoute><UserLayout><EmpCalendarPage/></UserLayout></UserRoute>} />
        <Route path="/emp/tasks" element={<UserRoute><UserLayout><EmpTasks/></UserLayout></UserRoute>} />
        <Route path="/admin/media" element={<AdminRoute><AdminLayout><MediaLibrary /></AdminLayout></AdminRoute>} />
        <Route path="/admin/notification" element={<AdminRoute><AdminLayout><NotificationTemplates/></AdminLayout></AdminRoute>} />
        <Route path="/admin/notifications/email/templates" element={<AdminRoute><AdminLayout><EmailTemplates/></AdminLayout></AdminRoute>} />
        <Route path="/admin/notifications/email/send" element={<AdminRoute><AdminLayout><SendEmail/></AdminLayout></AdminRoute>} />
        <Route path="/admin/notifications/email/history" element={<AdminRoute><AdminLayout><EmailLogs/></AdminLayout></AdminRoute>} />
        <Route path="/admin/notifications/sms/send" element={<AdminRoute><AdminLayout><SendSMS/></AdminLayout></AdminRoute>} />
        <Route path="/admin/notifications/sms/history" element={<AdminRoute><AdminLayout><SmsLogs/></AdminLayout></AdminRoute>} />
        <Route path="/admin/notifications/reminders" element={<AdminRoute><AdminLayout><BirthdayReminders/></AdminLayout></AdminRoute>} />
        <Route path="/admin/notifications/reminders/history" element={<AdminRoute><AdminLayout><ReminderLogs/></AdminLayout></AdminRoute>} />







        {/* --- 404 & Redirects --- */}
        <Route path="*" element={
          <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a', color: '#94a3b8', fontSize: '1.5rem' }}>
            404 - Page Not Found
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;
