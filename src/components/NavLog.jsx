import { useLocation } from "react-router-dom";
import { disablePageScroll, enablePageScroll } from "scroll-lock";
import { Link } from "react-router-dom";
import { logo } from "../assets";
import { navigation } from "../constants";
import Button from "./Button";
import MenuSvg from "../assets/svg/MenuSvg";
import { HamburgerMenu } from "./design/Header";
import { useState } from "react";
import { auth} from "./firebase";
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
      className={`fixed top-0 left-0 mt-5  w-full  z-50  border-b border-n-6 lg:bg-n-8/90 lg:backdrop-blur-sm ${
        openNavigation ? "bg-n-8" : "bg-n-8/90 backdrop-blur-sm"
      }`}
    >
      <div className="flex items-center px-5 lg:px-7.5 xl:px-10 max-lg:py-4">
      <Link className="block w-[15rem] mt-2 xl:mr-8" to="/">
          <img src={logo} alt="CloudCloset" />
        </Link>

        <nav
          className={`${
            openNavigation ? "flex" : "hidden"
          } fixed top-[5rem] left-0 right-0 bottom-0 bg-n-8 lg:static lg:flex lg:mx-auto lg:bg-transparent`}
        >
          <div className="relative z-2 flex flex-col items-center justify-center m-auto lg:flex-row">
            
              <Link
               
                to="/login"
                onClick={handleLogout}
                className={`block relative font-code text-2xl uppercase text-n-1 transition-colors hover:text-color-1 
                  lg:hidden
                 px-6 py-6 md:py-8 lg:-mr-0.25 lg:text-xs lg:font-semibold  lg:leading-5 lg:hover:text-n-1 xl:px-12`}
              >
                Sign Out
              </Link>
           
          </div>

          <HamburgerMenu />
        </nav>

        
        <Link to="/login">
        <Button className="hidden lg:flex mb-5" onClick={handleLogout}>
          Sign out
        </Button>
        </Link>
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
