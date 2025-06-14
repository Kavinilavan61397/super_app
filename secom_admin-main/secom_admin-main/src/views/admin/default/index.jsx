import MiniCalendar from "components/calendar/MiniCalendar";
import WeeklyRevenue from "views/admin/default/components/WeeklyRevenue";
import TotalSpent from "views/admin/default/components/TotalSpent";
import PieChartCard from "views/admin/default/components/PieChartCard";
import { IoMdHome } from "react-icons/io";
import { IoDocuments } from "react-icons/io5";
import { MdBarChart, MdDashboard } from "react-icons/md";

import { useEffect } from "react";
import Navbar from "components/navbar";



import { columnsDataCheck, columnsDataComplex } from "./variables/columnsData";

import Widget from "components/widget/Widget";
import CheckTable from "views/admin/default/components/CheckTable";
import ComplexTable from "views/admin/default/components/ComplexTable";
import DailyTraffic from "views/admin/default/components/DailyTraffic";
import TaskCard from "views/admin/default/components/TaskCard";
import tableDataCheck from "./variables/tableDataCheck.json";
import tableDataComplex from "./variables/tableDataComplex.json";

import { useNavigate } from "react-router-dom";

    const Dashboard = () => {
      const navigate = useNavigate();
    
      useEffect(() => {
        const checkTokenExpiration = () => {
          const token = localStorage.getItem("OnlineShop-accessToken");
          const expirationTime = localStorage.getItem("OnlineShop-tokenExpiration");
    
          if (!token) {
            navigate("/");
            return;
          }
    
          if (expirationTime && Date.now() > expirationTime) {
            localStorage.removeItem("OnlineShop-accessToken");
            localStorage.removeItem("OnlineShop-tokenExpiration");
            navigate("/"); 
          }
        };
    
        checkTokenExpiration(); 
      }, [navigate]);
    
      return (
        <div className="pt-6">
           <Navbar brandText={"Dashboard"} />
          {/* Card widget */}
          <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 3xl:grid-cols-6">
            {/* Widget components go here */}
          </div>
          
          {/* Charts */}
          <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
            <TotalSpent />
            <WeeklyRevenue />
          </div>
    
          {/* Tables & Charts */}
          <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">
            {/* Check Table */}
            <div>
              <CheckTable
                columnsData={columnsDataCheck}
                tableData={tableDataCheck}
              />
            </div>
    
            {/* Traffic chart & Pie Chart */}
            <div className="grid grid-cols-1 gap-5 rounded-[20px] md:grid-cols-2">
              <DailyTraffic />
              <PieChartCard />
            </div>
    
            {/* Complex Table , Task & Calendar */}
            <ComplexTable
              columnsData={columnsDataComplex}
              tableData={tableDataComplex}
            />
    
            {/* Task chart & Calendar */}
            <div className="grid grid-cols-1 gap-5 rounded-[20px] md:grid-cols-2">
              <TaskCard />
              <div className="grid grid-cols-1 rounded-[20px]">
                <MiniCalendar />
              </div>
            </div>
          </div>
        </div>
      );
    };
    
    export default Dashboard;
    