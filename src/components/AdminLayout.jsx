// src/components/AdminLayout.jsx
import AdminSidebar from './AdminSidebar';

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-[#FDFDFD]">
      {/* 1. Sidebar Component (Inside this, the width is w-[18rem]) */}
      <AdminSidebar />

      {/* 2. Main Content 
          - lg:ml-[18rem]: Matches the sidebar width perfectly on desktop.
          - pt-[4rem] lg:pt-0: Adds space for the mobile header top-bar 
            you have in your sidebar component.
      */}
      <main className="flex-1 min-w-0 ml-0 lg:ml-[18rem] pt-[4rem] lg:pt-0 transition-all duration-300">
        <div className="w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
