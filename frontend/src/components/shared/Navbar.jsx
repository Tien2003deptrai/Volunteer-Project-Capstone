import { useState } from "react";
import { Button } from "../ui/button";
import { motion } from "framer-motion";
import { Menu, X, LogOut, User2, MessageSquare } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { toast } from "sonner";
import axios from "axios";
import { USER_API } from "@/utils/constant";
import { setUser } from "@/redux/authSlice";

const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const logOutHandler = async () => {
    try {
      const res = await axios.get(`${USER_API}/logout`, { withCredentials: true });
      if (res.data.success) {
        dispatch(setUser(null));
        navigate("/");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  return (
    <nav>
      <div className="flex items-center justify-between mx-auto max-w-7xl h-16 px-6">
        {/* Animated Gradient Logo */}
        <motion.h1
          className="text-2xl font-bold bg-clip-text text-transparent cursor-pointer"
          animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          style={{
            backgroundImage: "linear-gradient(to right, #6DA683, #467057, #345441)",
            backgroundSize: "200% 200%",
          }}
          onClick={() => navigate("/")}
        >
          Dtu
          <span className="text-transparent bg-gradient-to-r from-red-600 to-red-400 bg-clip-text">
            Volunteer
          </span>
        </motion.h1>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-12">
          <ul className="flex items-center text-gray-600 font-medium gap-5">
            {user && user.role === "admin" ? (
              <>
                <Link to="/admin/organizations"><li>Organizations</li></Link>
                <Link to="/admin/duties"><li>Duties</li></Link>
              </>
            ) : (
              <>
                <Link to="/"><li>Home</li></Link>
                <Link to="/duties"><li>Duties</li></Link>
                <Link to="/browse"><li>Browse</li></Link>
                <Link to="/upcoming"><li>Upcoming</li></Link>
                <Link to="/about"><li>About</li></Link>
                <Link to="/gallery"><li>Gallery</li></Link>
              </>
            )}
          </ul>

          {/* Messages Button */}
          {user && user.role === "user" && (
            <Link to="/messages">
              <Button variant="ghost" size="icon" className="relative h-10 w-10">
                <MessageSquare className="h-5 w-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </Button>
            </Link>
          )}

          {/* Authentication/Profile Section */}
          {!user ? (
            <div className="flex items-center gap-5">
              <Link to="/login">
                <Button className="text-gray-600" variant="outline">
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="text-white bg-[#467057] hover:bg-[#2A4B37]">Sign Up</Button>
              </Link>
            </div>
          ) : user ? (
            <Popover>
              <PopoverTrigger asChild>
                <button className="focus:outline-none focus:ring-2 focus:ring-[#467057] rounded-full">
                  <Avatar className="cursor-pointer w-10 h-10 border-2 border-[#467057] hover:border-[#2A4B37] transition-colors">
                    <AvatarImage
                      src={user?.profile?.profilePhoto || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400"}
                      alt={user?.fullname || "User"}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-[#467057] text-white font-semibold">
                      {user?.fullname?.charAt(0)?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-60">
                <div className="flex gap-4 items-center mb-4">
                  <Avatar className="w-12 h-12 border-2 border-[#467057]">
                    <AvatarImage
                      src={user?.profile?.profilePhoto || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400"}
                      alt={user?.fullname || "User"}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-[#467057] text-white font-semibold">
                      {user?.fullname?.charAt(0)?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 truncate">{user.fullname || "User"}</h4>
                    <p className="text-sm text-gray-600 truncate">{user?.profile?.bio || "No bio available"}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  {user.role === "user" && (
                    <Button variant="link" className="flex items-center gap-2 justify-start px-0" asChild>
                      <Link to="/profile">
                        <User2 className="h-4 w-4" /> View Profile
                      </Link>
                    </Button>
                  )}
                  <Button
                    onClick={logOutHandler}
                    variant="link"
                    className="flex items-center gap-2 justify-start px-0 text-red-600 hover:text-red-800"
                  >
                    <LogOut className="h-4 w-4" /> Logout
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          ) : null}
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden flex flex-col items-center gap-4 py-4 border-t bg-white shadow-lg">
          <ul className="flex flex-col items-center font-medium gap-4 w-full">
            {user && user.role === "admin" ? (
              <>
                <Link to="/admin/organizations" onClick={() => setIsOpen(false)}><li className="py-2">Organizations</li></Link>
                <Link to="/admin/duties" onClick={() => setIsOpen(false)}><li className="py-2">Duties</li></Link>
              </>
            ) : (
              <>
                <Link to="/" onClick={() => setIsOpen(false)}><li className="py-2">Home</li></Link>
                <Link to="/duties" onClick={() => setIsOpen(false)}><li className="py-2">Duties</li></Link>
                <Link to="/browse" onClick={() => setIsOpen(false)}><li className="py-2">Browse</li></Link>
                <Link to="/upcoming" onClick={() => setIsOpen(false)}><li className="py-2">Upcoming</li></Link>
                <Link to="/about" onClick={() => setIsOpen(false)}><li className="py-2">About</li></Link>
                <Link to="/gallery" onClick={() => setIsOpen(false)}><li className="py-2">Gallery</li></Link>
                {user && user.role === "user" && (
                  <Link to="/messages" onClick={() => setIsOpen(false)}>
                    <li className="py-2 flex items-center justify-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Messages
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    </li>
                  </Link>
                )}
              </>
            )}
          </ul>

          {/* Authentication/Profile Section in Mobile */}
          {!user ? (
            <div className="flex flex-col items-center gap-4 mt-4 w-full px-4">
              <Link to="/login" onClick={() => setIsOpen(false)} className="w-full">
                <Button variant="outline" className="w-full">Login</Button>
              </Link>
              <Link to="/signup" onClick={() => setIsOpen(false)} className="w-full">
                <Button className="bg-[#467057] hover:bg-[#2A4B37] text-white w-full">Sign Up</Button>
              </Link>
            </div>
          ) : user ? (
            <div className="flex flex-col items-center gap-4 mt-4 w-full px-4 border-t pt-4">
              <Avatar className="cursor-pointer w-20 h-20 border-4 border-[#467057] shadow-lg flex-shrink-0">
                <AvatarImage
                  src={user?.profile?.profilePhoto || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400"}
                  alt={user?.fullname || "User"}
                  className="object-cover"
                />
                <AvatarFallback className="bg-[#467057] text-white text-2xl font-bold">
                  {user?.fullname?.charAt(0)?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <h4 className="font-semibold text-lg text-gray-900">{user.fullname || "User"}</h4>
              <p className="text-sm text-gray-600 text-center px-4">{user?.profile?.bio || "No bio available"}</p>
              {user.role === "user" && (
                <Button variant="link" className="mt-2" asChild>
                  <Link to="/profile" onClick={() => setIsOpen(false)}>
                    <User2 className="h-4 w-4 mr-2" />
                    View Profile
                  </Link>
                </Button>
              )}
              <Button
                onClick={() => {
                  logOutHandler();
                  setIsOpen(false);
                }}
                variant="link"
                className="text-red-600 hover:text-red-800"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          ) : null}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
