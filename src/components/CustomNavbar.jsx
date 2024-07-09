import React, { Fragment, useEffect, useState } from "react";
import { NavLink as ReactLink } from "react-router-dom";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  NavbarText,
} from "reactstrap";
import { doLogout,getToken, isTokenExpired,getCurrentUserDetail, isLoggedIn } from "../auth/Index";
import { Link, useNavigate } from "react-router-dom";
import ContextUserProvider from "../context/ContextUserProvider";
import { toast } from "react-toastify";

function CustomNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const [login, setLogin] = useState(false);
  const [user, setUser] = useState(undefined);
  const toggle = () => setIsOpen(!isOpen);
  const [isHovered, setIsHovered] = useState(false);
  const [isHelpCenterHovered, setIsHelpCenterHovered] = useState(false);
  const [isLogoutHovered, setIsLogoutHovered] = useState(false);
  const [isUserHovered, setIsUserHovered] = useState(false);
  const [isSaveFeedHovered, setIsSaveFeedHovered] = useState(false);
  const [isNewFeedHovered, setIsNewFeedHovered] = useState(false);
  const [isUserFeedHovered, setIsUserFeedHovered] = useState(false);
  const [isAddFeedHovered, setIsAddFeedHovered] = useState(false);
  const [isAboutHovered, setIsAboutHovered] = useState(false);
  const [isMoreHovered, setIsMoreHovered] = useState(false);
  const [isLoginHovered, setIsLoginHovered] = useState(false);
  const handleHelpCenterMouseEnter = () => {
    setIsHelpCenterHovered(true);
  };
  
  const handleHelpCenterMouseLeave = () => {
    setIsHelpCenterHovered(false);
  };
  const handleMoreMouseEnter = () => {
    setIsMoreHovered(true);
  };
  
  const handleMoreMouseLeave = () => {
    setIsMoreHovered(false);
  };

  const handleNewFeedMouseEnter = () => {
    setIsNewFeedHovered(true);
  };
  
  const handleNewFeedMouseLeave = () => {
    setIsNewFeedHovered(false);
  };
  const handleLoginMouseEnter = () => {
    setIsLoginHovered(true);
  };
  
  const handleLoginMouseLeave = () => {
    setIsLoginHovered(false);
  };
  const handleSaveFeedMouseEnter = () => {
    setIsSaveFeedHovered(true);
  };
  
  const handleSaveFeedMouseLeave = () => {
    setIsSaveFeedHovered(false);
  };

  const handleAboutMouseEnter = () => {
    setIsAboutHovered(true);
  };
  
  const handleAboutMouseLeave = () => {
    setIsAboutHovered(false);
  };
  const handleAddFeedMouseEnter = () => {
    setIsAddFeedHovered(true);
  };
  
  const handleAddFeedMouseLeave = () => {
    setIsAddFeedHovered(false);
  };
  
  const handleUserFeedMouseEnter = () => {
    setIsUserFeedHovered(true);
  };
  
  const handleUserFeedMouseLeave = () => {
    setIsUserFeedHovered(false);
  };
  const handleLogoutMouseEnter = () => {
    setIsLogoutHovered(true);
  };
  
  const handleLogoutMouseLeave = () => {
    setIsLogoutHovered(false);
  };
  const handleUserMouseEnter = () => {
    setIsUserHovered(true);
  };
  
  const handleUserMouseLeave = () => {
    setIsUserHovered(false);
  };
  useEffect(() => {
    
    const userDetail = getCurrentUserDetail();
    
    if (typeof userDetail !== "undefined") {

      const checkTokenExpiration = () => {
        const accessToken = getToken();
        
        if (isTokenExpired(accessToken)) {
          console.log("Access token expired");
  
          logout(true); // Call the logout function
        }
  
      };

      const intervalId = setInterval(checkTokenExpiration, 5000);

      // Cleanup interval on component unmount
      return () => clearInterval(intervalId);
    }
  }, [login]);
  useEffect(() => {
    if (typeof getCurrentUserDetail() !== "undefined") 
    {
    setLogin(isLoggedIn());
    setUser(getCurrentUserDetail());
  }
  }, [login]);

  const logout = (sessionExpire) => {
   console.log("Seeesiosn",sessionExpire)

    setTimeout(() => {
      if(sessionExpire==true)
{
      toast.error("Session expired, Please do login again to continue using BloggerHub.",
      {
        style: {
          width: "580px",
        },
        autoClose: 12000, // Display the toast for 8 seconds
      }
      
      );
    }
      doLogout(() => {
        console.log("LOGOUT Boom");
        setLogin(false);
        navigate("/login");
      });
    }); // Adjust delay time as needed (in milliseconds)
  };
  
  return (
    <div>
      <ContextUserProvider userName={user?.name}>
        <Navbar
          style={{ backgroundColor: "rgba(0, 0,  0.5, 0.6)" }}
          light
          expand="md"
        >
          <NavbarBrand
            style={{
              color: "#e6e6e6",
              fontWeight: "bold",
              fontFamily: "Montserrat, sans-serif",
            }}
          >
            BloggerHub
          </NavbarBrand>
          <NavbarToggler onClick={toggle} />
          <Collapse isOpen={isOpen} navbar>
            <Nav className="mr-auto" navbar>
              <NavItem>
                <NavLink
                  tag={ReactLink}
                  to="/about"
                  onMouseEnter={handleAboutMouseEnter}
                  onMouseLeave={handleAboutMouseLeave}
                  style={{
                    color: "#e6e6e6",
                    fontWeight: "bold",
                    fontFamily: "Montserrat, sans-serif",
                    border: "1px solid #e6e6e6",
                    borderRadius: "5px",
                    padding: "8px 12px",
                    transition: "all 0.2s ease-in-out",
                    backgroundColor: isAboutHovered ? "#e6e6e6" : "transparent",
                    color: isAboutHovered ? "#333" : "#e6e6e6",
                    marginRight: "10px", // Add margin-right for spacing
                  }}
                >
                  About
                </NavLink>
              </NavItem>
              {login && (
                <Fragment>
                  <NavItem>
                    <NavLink
                      tag={ReactLink}
                      to="/user/dashboard"
                      onMouseEnter={handleAddFeedMouseEnter}
                      onMouseLeave={handleAddFeedMouseLeave}
                      style={{
                        color: "#e6e6e6",
                        fontWeight: "bold",
                        fontFamily: "Montserrat, sans-serif",
                        border: "1px solid #e6e6e6",
                        borderRadius: "5px",
                        padding: "8px 12px",
                        transition: "all 0.2s ease-in-out",
                        backgroundColor: isAddFeedHovered ? "#e6e6e6" : "transparent",
                        color: isAddFeedHovered ? "#333" : "#e6e6e6",
                        marginRight: "10px", // Add margin-right for spacing
                      }}
                    >
                      AddFeed
                    </NavLink>
                  </NavItem>
                  <NavItem>
                <NavLink
                  tag={ReactLink}
                  to="/user/Feed"
                  onMouseEnter={handleUserFeedMouseEnter}
                  onMouseLeave={handleUserFeedMouseLeave}
                  style={{
                    color: "#e6e6e6",
                    fontWeight: "bold",
                    fontFamily: "Montserrat, sans-serif",
                    border: "1px solid #e6e6e6",
                    borderRadius: "5px",
                    padding: "8px 12px",
                    transition: "all 0.2s ease-in-out",
                    backgroundColor: isUserFeedHovered ? "#e6e6e6" : "transparent",
                    color: isUserFeedHovered ? "#333" : "#e6e6e6",
                    marginRight: "10px", // Add margin-right for spacing
                  }}
                >
                  UserFeed
                </NavLink>
              </NavItem>
                </Fragment>
              )}

              <NavItem>
                <NavLink
                  tag={ReactLink}
                  to="/home?pageNumber=0"
                  onMouseEnter={handleNewFeedMouseEnter}
                  onMouseLeave={handleNewFeedMouseLeave}
                  style={{
                    color: "#e6e6e6",
                    fontWeight: "bold",
                    fontFamily: "Montserrat, sans-serif",
                    border: "1px solid #e6e6e6",
                    borderRadius: "5px",
                    padding: "8px 12px",
                    transition: "all 0.2s ease-in-out",
                    backgroundColor: isNewFeedHovered ? "#e6e6e6" : "transparent",
                    color: isNewFeedHovered ? "#333" : "#e6e6e6",
                    marginRight: "10px", // Add margin-right for spacing
                  }}
                >
                  AllFeed
                </NavLink>
              </NavItem>
              {login && (
              <NavItem>
                <NavLink
                  tag={ReactLink}
                  to="/user/save"
                  onMouseEnter={handleSaveFeedMouseEnter}
                  onMouseLeave={handleSaveFeedMouseLeave}
                  style={{
                    color: "#e6e6e6",
                    fontWeight: "bold",
                    fontFamily: "Montserrat, sans-serif",
                    border: "1px solid #e6e6e6",
                    borderRadius: "5px",
                    padding: "8px 12px",
                    transition: "all 0.2s ease-in-out",
                    backgroundColor: isSaveFeedHovered ? "#e6e6e6" : "transparent",
                    color: isSaveFeedHovered ? "#333" : "#e6e6e6",
                    marginRight: "10px", // Add margin-right for spacing
                  }}
                >
                  SaveFeed
                </NavLink>
              </NavItem>
              )
}
              <NavItem></NavItem>

              <UncontrolledDropdown nav inNavbar>
                <DropdownToggle
                  nav
                  caret
                  onMouseEnter={handleMoreMouseEnter}
                  onMouseLeave={handleMoreMouseLeave}
                  style={{
                    color: "#e6e6e6",
                    fontWeight: "bold",
                    fontFamily: "Montserrat, sans-serif",
                    border: "1px solid #e6e6e6",
                    borderRadius: "5px",
                    padding: "8px 12px",
                    transition: "all 0.2s ease-in-out",
                    backgroundColor: isMoreHovered ? "#e6e6e6" : "transparent",
                    color: isMoreHovered ? "#333" : "#e6e6e6",
                    marginRight: "10px", // Add margin-right for spacing
                  }}
                >
                  More
                </DropdownToggle>

                <DropdownMenu right>
                  <DropdownItem
                    tag={ReactLink}
                    to="/services"
                    style={{
                      color: "#222222",
                      fontWeight: "bold",
                      fontFamily: "Montserrat, sans-serif",
                    }}
                  >
                    Services
                  </DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem
                    tag={ReactLink}
                    to="/contactus"
                    style={{
                      color: "#222222",
                      fontWeight: "bold",
                      fontFamily: "Montserrat, sans-serif",
                    }}
                  >
                    Contact Us
                  </DropdownItem>
                
              
                </DropdownMenu>
              </UncontrolledDropdown>
            </Nav>
            <Nav navbar>
              {login && (
                <Fragment>
        <NavItem>
  <NavLink
    tag={ReactLink}
    to="/user/help"
    onMouseEnter={handleHelpCenterMouseEnter}
    onMouseLeave={handleHelpCenterMouseLeave}
    style={{
      color: "#e6e6e6",
      fontWeight: "bold",
      fontFamily: "Montserrat, sans-serif",
      border: "1px solid #e6e6e6",
      borderRadius: "5px",
      padding: "8px 12px",
      transition: "all 0.2s ease-in-out",
      backgroundColor: isHelpCenterHovered ? "#e6e6e6" : "transparent",
      color: isHelpCenterHovered ? "#333" : "#e6e6e6",
      marginRight: "10px", // Add margin-right for spacing
    }}
  >
    Help Center
  </NavLink>
</NavItem>
<NavItem>
  <NavLink
    onClick={logout}
    onMouseEnter={handleLogoutMouseEnter}
    onMouseLeave={handleLogoutMouseLeave}
    style={{
      color: "#e6e6e6",
      fontWeight: "bold",
      fontFamily: "Montserrat, sans-serif",
      border: "1px solid #e6e6e6",
      borderRadius: "5px",
      padding: "8px 12px",
      transition: "all 0.2s ease-in-out",
      backgroundColor: isLogoutHovered ? "#e6e6e6" : "transparent",
      color: isLogoutHovered ? "#333" : "#e6e6e6",
      marginRight: "10px", // Add margin-right for spacing
    }}
  >
    Logout
  </NavLink>
</NavItem>



                  <NavItem>
                    <UncontrolledDropdown nav inNavbar>
                      <DropdownToggle
                        nav
                        caret
                        onMouseEnter={handleUserMouseEnter}
                        onMouseLeave={handleUserMouseLeave}
                        style={{
                          color: "#e6e6e6",
                          fontWeight: "bold",
                          fontFamily: "Montserrat, sans-serif",
                          border: "1px solid #e6e6e6",
                          borderRadius: "5px",
                          padding: "8px 12px",
                          transition: "all 0.2s ease-in-out",
                          backgroundColor: isUserHovered ? "#e6e6e6" : "transparent",
                          color: isUserHovered ? "#333" : "#e6e6e6",
                          marginRight: "10px", // Add margin-right for spacing
                        }}
                      >
                        {user.name}
                      </DropdownToggle>

                      <DropdownMenu right>
                        <DropdownItem
                         tag={ReactLink}
                         to={`/user/viewprofile/${user.id}`}
                          style={{
                            color: "#222222",
                            fontWeight: "bold",
                            fontFamily: "Montserrat, sans-serif",
                          }}
                        >
                          View Profile
                        </DropdownItem>
                        <DropdownItem divider />
                        <DropdownItem
                          tag={ReactLink}
                          to="/user/updatepassword"
                          style={{
                            color: "#222222",
                            fontWeight: "bold",
                            fontFamily: "Montserrat, sans-serif",
                          }}
                        >
                          Update Passwords
                        </DropdownItem>
                      </DropdownMenu>
                    </UncontrolledDropdown>
                  </NavItem>
                </Fragment>
              )}
              {!login && (
                <NavItem>
                  <NavLink
                    tag={ReactLink}
                    to="/login"
                    onMouseEnter={handleLoginMouseEnter}
                    onMouseLeave={handleLoginMouseLeave}
                    style={{
                      color: "#e6e6e6",
                      fontWeight: "bold",
                      fontFamily: "Montserrat, sans-serif",
                      border: "1px solid #e6e6e6",
                      borderRadius: "5px",
                      padding: "8px 12px",
                      transition: "all 0.2s ease-in-out",
                      backgroundColor: isLoginHovered ? "#e6e6e6" : "transparent",
                      color: isLoginHovered ? "#333" : "#e6e6e6",
                      marginRight: "10px", // Add margin-right for spacing
                    }}
                  >
                    Login
                  </NavLink>
                </NavItem>
              )}
            </Nav>
          </Collapse>
        </Navbar>
      </ContextUserProvider>
    </div>
  );
}

export default CustomNavbar;
