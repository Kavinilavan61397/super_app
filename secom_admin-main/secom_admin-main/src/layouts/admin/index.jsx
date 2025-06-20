import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "components/navbar";
import Sidebar from "components/sidebar/Sidebar";
import Footer from "components/footer/Footer";
import routes from "routes.js";
import adminRoutes from "routes/admin.routes.js";
import axios from "axios";

export default function Admin(props) {
  const { ...rest } = props;
  const location = useLocation();
  const [open, setOpen] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [currentRoute, setCurrentRoute] = useState("Main Dashboard");
  
  const handleSidenavToggle = () => {
    if (window.innerWidth < 1200) {
      setOpen(!open);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };
  
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1200) {
        setOpen(false);
        setIsCollapsed(false);
      } else {
        setOpen(true);
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    getActiveRoute(routes);
  }, [location.pathname]);

  const getActiveRoute = (routes) => {
    for (let route of routes) {
      if (window.location.href.includes(route.layout + "/" + route.path)) {
        setCurrentRoute(route.name);
      }
    }
  };

  const getRoutes = (routes) => {
    return routes.flatMap((prop, key) => {
      let routeComponents = [];
      if (prop.layout === "/admin") {
        routeComponents.push(
          <Route path={`/${prop.path}`} element={prop.component} key={key} />
        );
        if (prop.subNav) {
          prop.subNav.forEach((sub, subKey) => {
            routeComponents.push(
              <Route path={`/${sub.path}`} element={sub.component} key={`${key}-${subKey}`} />
            );
            if (sub.subNav) {
              sub.subNav.forEach((nested, nestedKey) => {
                routeComponents.push(
                  <Route path={`/${nested.path}`} element={nested.component} key={`${key}-${subKey}-${nestedKey}`} />
                );
              });
            }
          });
        }
      }
      return routeComponents;
    });
  };

  const getAdminRoutes = (routes) => {
    return routes.map((prop, key) => {
      return (
        <Route path={prop.path} element={prop.element} key={key} />
      );
    });
  };

  return (
    <div className="flex h-full w-full bg-gray-50">
      <Sidebar 
        isCollapsed={isCollapsed} 
        open={open} 
        onClose={() => setOpen(false)}
        onSidenavToggle={handleSidenavToggle}
      /> 
      <div className={`relative h-full w-full transition-all duration-300 ease-in-out
          ${isCollapsed ? "xl:ml-20" : "xl:ml-64"}`}>
        <main className="mx-auto h-full p-4">
          <Navbar
            logoText={currentRoute}
            brandText={currentRoute}
            secondary={true}
            {...rest}
          />
          <div className="pt-5 mx-auto mb-auto h-full min-h-[84vh]">
            <Routes>
              {getRoutes(routes)}
              {getAdminRoutes(adminRoutes)}
              <Route
                path="/"
                element={<Navigate to="/admin/default" replace />}
              />
            </Routes>
          </div>
          <div className="p-3">
            <Footer />
          </div>
        </main>
      </div>
    </div>
  );
}
