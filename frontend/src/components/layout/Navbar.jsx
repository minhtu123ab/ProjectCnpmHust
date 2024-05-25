import React from "react";
import "./Navbar.css";
import { IoPeople } from "react-icons/io5";
import { FaMoneyCheckAlt, FaHome } from "react-icons/fa";
import { MdOutlineApartment } from "react-icons/md";
import { Button } from "antd";
import { useNavigate, NavLink } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const check = sessionStorage.getItem("checkLogin");

  const logOut = () => {
    navigate("/login");
    sessionStorage.removeItem("checkLogin");
  };

  const logIn = () => {
    navigate("/login");
  };

  const handleNavigation = (event, path) => {
    event.preventDefault(); // ngăn hành vi mặc định của NavLink
    if (!check) {
      navigate("/login");
    } else {
      navigate(path);
    }
  };

  return (
    <div className="navbar">
      <div className="icon-nav-all">
        <IoPeople className="icon-nav" size={100} />
        <h1>Administrator</h1>
      </div>
      <ul className="option-nav">
        <NavLink
          to="/"
          className="nav-link"
          onClick={(e) => handleNavigation(e, "/")}
        >
          <li>
            <FaHome className="icon-nav-option" size={25} />
            Home
          </li>
        </NavLink>
        <NavLink
          to="/department"
          className="nav-link"
          onClick={(e) => handleNavigation(e, "/department")}
        >
          <li>
            <MdOutlineApartment size={25} className="icon-nav-option" />
            Căn hộ
          </li>
        </NavLink>
        <NavLink
          to="/people"
          className="nav-link"
          onClick={(e) => handleNavigation(e, "/people")}
        >
          <li>
            <IoPeople className="icon-nav-option" size={25} />
            Dân cư
          </li>
        </NavLink>
        <NavLink
          to="/fee"
          className="nav-link"
          onClick={(e) => handleNavigation(e, "/fee")}
        >
          <li>
            <FaMoneyCheckAlt className="icon-nav-option" size={25} />
            Thu phí
          </li>
        </NavLink>
      </ul>
      {check ? (
        <Button onClick={logOut} className="btn-nav logout" type="primary">
          Đăng xuất
        </Button>
      ) : (
        <Button onClick={logIn} className="btn-nav" type="primary">
          Đăng nhập
        </Button>
      )}
    </div>
  );
};

export default Navbar;
