import { useNavigate } from "react-router-dom";


export const TokenExpiration = () => {
    const navigate = useNavigate();
    const accessToken = localStorage.getItem('OnlineShop-accessToken');
    const tokenExpiration = localStorage.getItem('OnlineShop-tokenExpiration');

    const abc=Date.now();
    console.log(abc);
    console.log(tokenExpiration);
  
    if (!accessToken || Date.now() > tokenExpiration) {
      localStorage.removeItem('OnlineShop-accessToken');
      localStorage.removeItem('OnlineShop-tokenExpiration');
      navigate("/signin");
      return false;
    }
  
    return true;
  };
  
