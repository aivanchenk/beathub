import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import Link from "../low_level/link";
import Logo from "../../assests/icons/logo.png";
import RegisterModal from "../../modals/register";
import LoginModal from "../../modals/login";
import SearchBar from "../low_level/searchbar";

import { useAuth } from "../../contexts/auth_context";
import "./navbar.scss";

function Navbar() {
  const [isRegisterModalOpen, setRegisterModalOpen] = useState(false);
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const { isLoggedIn } = useAuth();

  return (
    <>
      <nav>
        <img className="logo" src={Logo} alt="Logo" />
        <div className="menu">
          {!isLoggedIn ? (
            <>
              <Link href="#discover">Discover</Link>
              <div className="vertical-divider"></div>
              <Link href="#" onClick={() => setRegisterModalOpen(true)}>
                Sign Up
              </Link>
              <Link href="#" onClick={() => setLoginModalOpen(true)}>
                Log In
              </Link>
            </>
          ) : (
            <SearchBar />
          )}
        </div>
      </nav>
      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setRegisterModalOpen(false)}
      />
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setLoginModalOpen(false)}
      />
    </>
  );
}

export default Navbar;
