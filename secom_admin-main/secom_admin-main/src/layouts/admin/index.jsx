import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation, Link } from "react-router-dom";
import Navbar from "components/navbar";
import Footer from "components/footer/Footer";
import routes from "routes.js";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import axios from "axios";

export default function Admin(props) {
  const { ...rest } = props;
  const location = useLocation();
  const [open, setOpen] = useState(true);
  const [currentRoute, setCurrentRoute] = useState("Main Dashboard");
  const [dropdowns, setDropdowns] = useState({});

  const toggleDropdown = (key) => {
    setDropdowns((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  useEffect(() => {
    window.addEventListener("resize", () => setOpen(window.innerWidth >= 1200));
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



  const [adminName, setAdminName] = useState("");

  useEffect(() => {
    axios
      .get("https://yrpitsolutions.com/ecom_backend/api/admin/profiles")
      .then((response) => {
        // if (response.data && response.data.business_name) {
        //   setAdminName(response.data.business_name);
        //   console.log(response);
        // } else {
        //   setAdminName("");
        // }
      })

      .catch((error) => {
        console.error("Error fetching admin profile:", error);
        setAdminName("");
      });
  }, []);

  return (
    // <div className="flex h-full w-full">
    //   <div className={`w-64 bg-white text-gray-600 font-bold ${open ? "block" : "hidden"} h-screen overflow-y-auto fixed`}>
    //     {/* <div className="p-4 font-bold text-xl">Admin Panel</div> */}
    //     <div className="p-4 font-bold text-xl">{adminName} Panel</div>
    //     <nav>
    //       {routes.map((item, index) => (
    //         <div key={index}>
    //           {item.subNav ? (
    //             <div className="flex items-center justify-between p-3 cursor-pointer hover:text-[#4318ff]" onClick={() => toggleDropdown(index)}>
    //               <div className="flex items-center">{item.icon}<span className="ml-2">{item.name}</span></div>
    //               {dropdowns[index] ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
    //             </div>
    //           ) : (
    //             <Link to={`/admin/${item.path}`} className={`flex items-center p-3 ${location.pathname === `/admin/${item.path}` ? "text-[#4318ff] font-bold" : "hover:text-[#4318ff]"}`}>
    //               {item.icon}<span className="ml-2">{item.name}</span>
    //             </Link>
    //           )}

    //           {dropdowns[index] && item.subNav && (
    //             <div className="ml-4">
    //               {item.subNav.map((subItem, subIndex) => (
    //                 <div key={subIndex}>
    //                   {subItem.subNav ? (
    //                     <div className="flex items-center justify-between p-2 cursor-pointer hover:text-[#4318ff]" onClick={() => toggleDropdown(`${index}-${subIndex}`)}>
    //                       <div className="flex items-center">{subItem.icon}<span className="ml-2">{subItem.name}</span></div>
    //                       {dropdowns[`${index}-${subIndex}`] ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
    //                     </div>
    //                   ) : (
    //                     <Link to={`/admin/${subItem.path}`} className={`ml-4 flex items-center p-2 ${location.pathname === `/admin/${subItem.path}` ? "text-[#4318ff] font-bold" : "hover:text-[#4318ff]"}`}>
    //                       {subItem.icon}<span className="ml-2">{subItem.name}</span>
    //                     </Link>
    //                   )}

    //                   {dropdowns[`${index}-${subIndex}`] && subItem.subNav && (
    //                     <div className="ml-6">
    //                       {subItem.subNav.map((nestedItem, nestedIndex) => (
    //                         <div key={nestedIndex}>
    //                           {nestedItem.subNav ? (
    //                             <div className="flex items-center justify-between p-2 cursor-pointer hover:text-[#4318ff]" onClick={() => toggleDropdown(`${index}-${subIndex}-${nestedIndex}`)}>
    //                               <div className="flex items-center">{nestedItem.icon}<span className="ml-2">{nestedItem.name}</span></div>
    //                               {dropdowns[`${index}-${subIndex}-${nestedIndex}`] ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
    //                             </div>
    //                           ) : (
    //                             <Link to={`/admin/${nestedItem.path}`} className={`ml-4 flex items-center p-2 ${location.pathname === `/admin/${nestedItem.path}` ? "text-[#4318ff] font-bold" : "hover:text-[#4318ff]"}`}>
    //                               {nestedItem.icon}<span className="ml-2">{nestedItem.name}</span>
    //                             </Link>
    //                           )}
    //                         </div>
    //                       ))}
    //                     </div>
    //                   )}
                      
    //                 </div>
    //               ))}
    //             </div>
    //           )}
    //         </div>
    //       ))}
    //     </nav>
    //   </div>
    //   <div className="h-full w-full bg-lightPrimary dark:!bg-navy-900">
    //     <main className="mx-[2px] h-full flex-none transition-all md:pr-2 xl:ml-[300px]">
    //       <div className="pt-5 mx-auto mb-auto h-full min-h-[84vh] p-2 md:pr-2">
    //         <Routes>{getRoutes(routes)}<Route path="/" element={<Navigate to="/admin/default" replace />} /></Routes>
    //       </div>
    //       <div className="p-3"><Footer /></div>
    //     </main>
    //   </div>
    // </div>
    <div className="flex h-full w-full">
    <div className={`w-64 bg-white font-bold ${open ? "block" : "hidden"} h-screen overflow-y-auto fixed`}>
      {/* <div className="p-4 font-bold text-xl">Admin Panel</div> */}
      <div className="p-4 font-bold text-xl">{adminName} Panel</div>
      <nav>
        {routes.map((item, index) => (
          <div key={index}>
            {item.subNav ? (
              <div className="flex items-center justify-between p-3 cursor-pointer text-black hover:text-[#4318ff]" onClick={() => toggleDropdown(index)}>
                <div className="flex items-center">{item.icon}<span className="ml-2">{item.name}</span></div>
                {dropdowns[index] ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
              </div>
            ) : (
              <Link to={`/admin/${item.path}`} className={`flex items-center p-3 text-black${location.pathname === `/admin/${item.path}` ? "text-[#4318ff] font-bold" : "hover:text-[#4318ff]"}`}>
                {item.icon}<span className="ml-2">{item.name}</span>
              </Link>
            )}

            {dropdowns[index] && item.subNav && (
              <div className="ml-4">
                {item.subNav.map((subItem, subIndex) => (
                  <div key={subIndex}>
                    {subItem.subNav ? (
                      <div className="flex items-center justify-between text-gray-600 p-2 cursor-pointer hover:text-[#4318ff]" onClick={() => toggleDropdown(`${index}-${subIndex}`)}>
                        <div className="flex items-center">{subItem.icon}<span className="text-gray-600 ml-2">{subItem.name}</span></div>
                        {dropdowns[`${index}-${subIndex}`] ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
                      </div>
                    ) : (
                      <Link to={`/admin/${subItem.path}`} className={`ml-4 flex items-center text-gray-600 p-2 ${location.pathname === `/admin/${subItem.path}` ? "text-[#4318ff] font-bold" : "hover:text-[#4318ff]"}`}>
                        {subItem.icon}<span className="ml-2">{subItem.name}</span>
                      </Link>
                    )}

                    {dropdowns[`${index}-${subIndex}`] && subItem.subNav && (
                      <div className="ml-6">
                        {subItem.subNav.map((nestedItem, nestedIndex) => (
                          <div key={nestedIndex}>
                            {nestedItem.subNav ? (
                              <div className="flex items-center justify-between p-2 cursor-pointer hover:text-[#4318ff]" onClick={() => toggleDropdown(`${index}-${subIndex}-${nestedIndex}`)}>
                                <div className="flex items-center">{nestedItem.icon}<span className="ml-2">{nestedItem.name}</span></div>
                                {dropdowns[`${index}-${subIndex}-${nestedIndex}`] ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
                              </div>
                            ) : (
                              <Link to={`/admin/${nestedItem.path}`} className={`ml-4 flex text-gray-600 items-center p-2 ${location.pathname === `/admin/${nestedItem.path}` ? "text-[#4318ff] font-bold" : "hover:text-[#4318ff]"}`}>
                                {nestedItem.icon}<span className="ml-2">{nestedItem.name}</span>
                              </Link>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
    <div className="h-full w-full bg-lightPrimary dark:!bg-navy-900">
      <main className="mx-[2px] h-full flex-none transition-all md:pr-2 xl:ml-[300px]">
        <div className="pt-5 mx-auto mb-auto h-full min-h-[84vh] p-2 md:pr-2">
          <Routes>{getRoutes(routes)}<Route path="/" element={<Navigate to="/admin/default" replace />} /></Routes>
        </div>
        <div className="p-3"><Footer /></div>
      </main>
    </div>
  </div>
  );
}

// -----------------------------------new code 15/2/25------------------------------------------------------
// import React, { useState } from "react";
// import { Link, useLocation } from "react-router-dom";
// import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
// import routes from "routes.js";

// export default function Sidebar() {
//   const location = useLocation();
//   const [dropdowns, setDropdowns] = useState({});

//   const toggleDropdown = (index) => {
//     setDropdowns((prev) => ({
//       ...prev,
//       [index]: !prev[index], // Toggle main menu
//     }));
//   };

//   const toggleSubDropdown = (parentIndex, subIndex) => {
//     setDropdowns((prev) => ({
//       ...prev,
//       [`${parentIndex}-${subIndex}`]: !prev[`${parentIndex}-${subIndex}`], // Toggle sub-menu
//     }));
//   };

//   return (
//     <div className="w-64 bg-white text-gray-600 font-bold h-screen overflow-y-auto fixed">
//       <div className="p-4 font-bold text-xl">Admin Panel</div>
//       <nav>
//         {routes.map((item, index) => (
//           <div key={index}>
//             {item.subNav ? (
//               // If menu has a subNav, make it toggleable
//               <div
//                 className="flex items-center justify-between p-3 cursor-pointer hover:text-[#4318ff]"
//                 onClick={() => toggleDropdown(index)}
//               >
//                 <div className="flex items-center">
//                   {item.icon}
//                   <span className="ml-2">{item.name}</span>
//                 </div>
//                 {dropdowns[index] ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
//               </div>
//             ) : (
//               <Link
//                 to={`/admin/${item.path}`}
//                 className={`flex items-center p-3 ${
//                   location.pathname === `/admin/${item.path}` ? "text-[#4318ff] font-bold" : "hover:text-[#4318ff]"
//                 }`}
//               >
//                 {item.icon}
//                 <span className="ml-2">{item.name}</span>
//               </Link>
//             )}

//             {/* Subnav (Dropdown) */}
//             {dropdowns[index] && item.subNav && (
//               <div className="ml-4">
//                 {item.subNav.map((subItem, subIndex) => (
//                   <div key={subIndex}>
//                     {subItem.subNav ? (
//                       // Handle nested submenus
//                       <div
//                         className="flex items-center justify-between p-2 cursor-pointer hover:text-[#4318ff]"
//                         onClick={() => toggleSubDropdown(index, subIndex)}
//                       >
//                         <div className="flex items-center">
//                           {subItem.icon}
//                           <span className="ml-2">{subItem.name}</span>
//                         </div>
//                         {dropdowns[`${index}-${subIndex}`] ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
//                       </div>
//                     ) : (
//                       <Link
//                         to={`/admin/${subItem.path}`}
//                         className={`ml-4 flex items-center p-2 ${
//                           location.pathname === `/admin/${subItem.path}` ? "text-[#4318ff] font-bold" : "hover:text-[#4318ff]"
//                         }`}
//                       >
//                         {subItem.icon}
//                         <span className="ml-2">{subItem.name}</span>
//                       </Link>
//                     )}

//                     {/* Render Nested Subnav */}
//                     {dropdowns[`${index}-${subIndex}`] && subItem.subNav && (
//                       <div className="ml-6">
//                         {subItem.subNav.map((nestedItem, nestedIndex) => (
//                           <Link
//                             key={nestedIndex}
//                             to={`/admin/${nestedItem.path}`}
//                             className={`ml-4 flex items-center p-2 ${
//                               location.pathname === `/admin/${nestedItem.path}` ? "text-[#4318ff] font-bold" : "hover:text-[#4318ff]"
//                             }`}
//                           >
//                             {nestedItem.icon}
//                             <span className="ml-2">{nestedItem.name}</span>
//                           </Link>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         ))}
//       </nav>
//     </div>
//   );
// }
