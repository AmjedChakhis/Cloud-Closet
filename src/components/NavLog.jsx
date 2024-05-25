import { useLocation } from "react-router-dom";
import { disablePageScroll, enablePageScroll } from "scroll-lock";
import { Link } from "react-router-dom";
import { useState } from "react";
import { auth } from "./firebase";
import { logo } from "../assets";
import MenuSvg from "../assets/svg/MenuSvg";
import Button from "./Button";

const NavLog = () => {
  async function handleLogout() {
    try {
      await auth.signOut();
      window.location.href = "/login";
      console.log("User logged out successfully!");
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  }

  const pathname = useLocation();
  const [openNavigation, setOpenNavigation] = useState(false);

  const toggleNavigation = () => {
    if (openNavigation) {
      setOpenNavigation(false);
      enablePageScroll();
    } else {
      setOpenNavigation(true);
      disablePageScroll();
    }
  };

  const handleClick = () => {
    if (!openNavigation) return;

    enablePageScroll();
    setOpenNavigation(false);
  };

  return (
    <div
      className={`fixed top-0 left-0 w-full z-50 border-b border-n-6 bg-n-8/90 backdrop-blur-sm ${
        openNavigation ? "bg-n-8" : "bg-n-8/90 backdrop-blur-sm"
      }`}
    >
      <div className="flex items-center justify-between px-5 py-2 lg:px-10">
        <Link className="block w-40" to="/">
          <img src={logo} alt="CloudCloset" />
        </Link>

        <nav
          className={`${
            openNavigation ? "flex" : "hidden"
          } fixed top-[3.5rem] left-0 right-0 bottom-0 bg-n-8 lg:static lg:flex lg:bg-transparent`}
        >
          <div className="flex flex-col items-center justify-center lg:flex-row lg:space-x-4">
            <Link
              to="/edit-profile"
              className="font-code text-2xl lg:text-base uppercase text-n-1 transition-colors hover:text-color-1 py-2 lg:py-0"
            >
              Edit Profile
            </Link>
            <Link
              to="/login"
              onClick={handleLogout}
              className="font-code text-2xl lg:text-base uppercase text-n-1 transition-colors hover:text-color-1 py-2 lg:py-0"
            >
              Sign Out
            </Link>
          </div>
        </nav>

        <Button
          className="ml-auto lg:hidden"
          px="px-3"
          onClick={toggleNavigation}
        >
          <MenuSvg openNavigation={openNavigation} />
        </Button>
      </div>
    </div>
  );
};

export default NavLog;
