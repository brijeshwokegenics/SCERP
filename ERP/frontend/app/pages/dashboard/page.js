"use client";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "../../components/Header.js";
import Sidebar from "../../components/Sidebar.js";
import HomePage from "../home/page.js";
import AdmissionManagementPage from '../admission/page.js'
import StudentsManagementPage from '../students/page.js'
import StudentsPromotionPage from '../students/promotion/page.js'
import StudentIDCardsPage from "../students/id-card/page.js"
import SchoolManagementPage from "../school/page.js";
import TeachersPage from "../teacher/page.js";
import PaymentPage from '../payment/page.js';
import LibraryPage from '../library/page.js';
import BookTransactionPage  from '../library/BookIssue/page.js'
import SubjectPage from '../subject/page.js'
import ClassRoutinePage from '../classRoutine/page.js'
import AttendancePage from '../attendance/page.js';
import TransportPage from "../transport/page.js";
const Dashboard = () => {
  const { token, user } = useSelector((state) => state.auth);
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true); // Loader state for checking auth
  const [currentPage, setCurrentPage] = useState(() => {
    // Retrieve the last visited page from localStorage or default to 'home'
    return typeof window !== "undefined" && localStorage.getItem("currentPage")
      ? localStorage.getItem("currentPage")
      : "home";
  });

  // Save the current page in localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("currentPage", currentPage);
    }
  }, [currentPage]);

  // Redirect if token or user is missing, and update loading state
  useEffect(() => {
    if (!token || !user) {
      router.replace("/");
    } else {
      setIsLoading(false); // Stop showing the loader if authenticated
    }
  }, [token, user, router]);

  // Render loading state until authentication check is complete
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="loader border-t-transparent border-solid rounded-full border-orange-500 border-4 h-12 w-12 animate-spin"></div>
        <p className="ml-4 text-lg font-medium text-orange-500">Checking authentication...</p>
      </div>
    );
  }

  // Render nothing if user is not authenticated
  if (!token || !user) return null;

  // Handler for changing the main content view
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Dynamic content for main area based on the current page
  const renderContent = () => {
    switch (currentPage) {

      case "home":
        return <HomePage />;
      case "admission":
        return <AdmissionManagementPage />
      case "manage-school-admins":
        return <p>Manage School Admins Content Here.</p>;
      case "students":
        return <StudentsManagementPage />;
        case "students/id-card":
          return <StudentIDCardsPage />;
          case "students/promotion":
          return <StudentsPromotionPage />;
  
     case "school":
          return <SchoolManagementPage />;
      case "teachers":
        return <TeachersPage/>;
        case "payment":
          return <PaymentPage/>;
      case "library":
        return <LibraryPage />;
        case "library/issuebook":
          return <BookTransactionPage />;
          case "subject":
            return <SubjectPage />;

        case "classroutine":
              return <ClassRoutinePage />;

              case "attendance":
                return <AttendancePage />;

                case "transport":
                return <TransportPage />;
      default:
        return <p>Content for {currentPage} is not defined.</p>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold text-center py-4">Welcome to the Dashboard</h1>
      <p className="text-center mb-4">Your Role: {user.role}</p>

      {/* SUPER_ADMIN Section */}
      {user.role === "SUPER_ADMIN" && (
        <div className="flex justify-center">
          <button
            className="bg-green-500 text-white px-4 py-2 mt-4 rounded"
            onClick={() => handlePageChange("/pages/super-admin")}
          >
            Go to Super Admin Panel
          </button>
        </div>
      )}

      {/* SCHOOL_ADMIN Section */}
      {user.role === "SCHOOL_ADMIN" && (
        <div>
          <Header />
          <div className="flex">
            {/* Sidebar */}
            <div className="bg-orange-500">
              <Sidebar onPageChange={handlePageChange} />
            </div>

            {/* Main Content */}
            <div className="flex-1 p-4">
              {isLoading ? (
                <div className="flex justify-center items-center h-full">
                  {/* Loader */}
                  <div className="loader border-t-transparent border-solid rounded-full border-orange-500 border-4 h-12 w-12 animate-spin"></div>
                </div>
              ) : (
                <div>{renderContent()}</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* STAFF Section */}
      {user.role === "STAFF" && (
        <p className="mt-4 text-center">Staff have limited privileges.</p>
      )}
    </div>
  );
};

export default Dashboard;
