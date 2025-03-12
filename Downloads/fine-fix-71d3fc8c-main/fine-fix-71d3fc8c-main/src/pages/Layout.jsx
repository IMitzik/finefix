
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { User, FileText, Home, LogOut, Menu, X } from "lucide-react";
import { User as UserEntity } from "@/api/entities";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import LanguageSwitcher from "../components/common/LanguageSwitcher";

export default function Layout({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [language, setLanguage] = useState('he'); // Default to Hebrew
  const location = useLocation();
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await UserEntity.me();
        setUser(userData);
        
        // Check user language preference
        if (userData.language_preference) {
          setLanguage(userData.language_preference);
        } else {
          // Check localStorage if no user preference
          const storedLang = localStorage.getItem('languagePreference');
          if (storedLang) {
            setLanguage(storedLang);
          }
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        
        // Check localStorage if no user is logged in
        const storedLang = localStorage.getItem('languagePreference');
        if (storedLang) {
          setLanguage(storedLang);
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUser();
  }, []);
  
  const handleLogout = async () => {
    try {
      await UserEntity.logout();
      window.location.href = createPageUrl("Landing");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };
  
  const isLandingPage = location.pathname === "/" || location.pathname === "/Landing";
  
  const getNavigationLabels = () => {
    if (language === 'en') {
      return {
        home: "Home",
        faq: "FAQ",
        appeal: "Submit Appeal",
        myAppeals: "My Appeals",
        profile: "Profile",
        myAccount: "My Account",
        login: "Login",
        logout: "Logout",
        startNow: "Start Now",
        contactUs: "Contact Us"
      };
    }
    
    return {
      home: "דף הבית",
      faq: "שאלות נפוצות",
      appeal: "הגשת ערעור",
      myAppeals: "הערעורים שלי",
      profile: "פרופיל",
      myAccount: "החשבון שלי",
      login: "התחברות",
      logout: "התנתקות",
      startNow: "התחילו עכשיו",
      contactUs: "צרו קשר"
    };
  };
  
  const labels = getNavigationLabels();

  return (
    <div dir={language === 'he' ? "rtl" : "ltr"} lang={language} className="min-h-screen">
      <style>{`
        :root {
          --primary: #2563eb;
          --primary-hover: #1d4ed8;
        }
        
        body {
          font-family: -apple, Arial, sans-serif;
        }

        /* RTL Support */
        [dir="rtl"] {
          text-align: right;
        }
        
        /* Custom Scrollbar */
        ::-webkit-scrollbar {
          width: 10px;
        }
        
        ::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #c5d2e7;
          border-radius: 5px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: #2563eb;
        }
      `}</style>

      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to={createPageUrl("Landing")} className="flex items-center">
              <div className={`w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center ${language === 'he' ? 'ml-2' : 'mr-2'}`}>
                <span className="text-white font-bold">FF</span>
              </div>
              <span className="text-2xl font-bold text-blue-600">FineFix</span>
            </Link>
            
            <div className={`hidden md:flex items-center ${language === 'he' ? 'space-x-4 space-x-reverse' : 'space-x-4'}`}>
              <Link 
                to={createPageUrl("Landing")}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                {labels.home}
              </Link>
              {isLandingPage && (
                <a 
                  href="#faq-section" 
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  {labels.faq}
                </a>
              )}
              <Link 
                to={createPageUrl("Appeal")}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                {labels.appeal}
              </Link>
              {user && (
                <Link 
                  to={createPageUrl("UserDashboard")}
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  {labels.myAppeals}
                </Link>
              )}
            </div>
            
            <div className={`flex items-center ${language === 'he' ? 'space-x-4 space-x-reverse' : 'space-x-4'}`}>
              <LanguageSwitcher />
              
              <div className="hidden md:block">
                {isLoading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
                ) : user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-blue-100 text-blue-600">
                            {user.full_name ? user.full_name.charAt(0) : "U"}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>{labels.myAccount}</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => window.location.href = createPageUrl("UserProfile")}
                      >
                        <User className={`h-4 w-4 ${language === 'he' ? 'ml-2' : 'mr-2'}`} />
                        <span>{labels.profile}</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => window.location.href = createPageUrl("UserDashboard")}
                      >
                        <FileText className={`h-4 w-4 ${language === 'he' ? 'ml-2' : 'mr-2'}`} />
                        <span>{labels.myAppeals}</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={handleLogout}
                      >
                        <LogOut className={`h-4 w-4 ${language === 'he' ? 'ml-2' : 'mr-2'}`} />
                        <span>{labels.logout}</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Button 
                    onClick={() => UserEntity.login()}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {labels.login}
                  </Button>
                )}
              </div>
              
              {!isLandingPage && !user && (
                <Button
                  className="hidden md:flex bg-blue-600 hover:bg-blue-700"
                  onClick={() => window.location.href = createPageUrl("Appeal")}
                >
                  {labels.startNow}
                </Button>
              )}
              
              {/* Mobile menu button */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side={language === 'he' ? "right" : "left"} className="sm:max-w-xs">
                  <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center">
                        <div className={`w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center ${language === 'he' ? 'ml-2' : 'mr-2'}`}>
                          <span className="text-white font-bold">FF</span>
                        </div>
                        <span className="text-xl font-bold text-blue-600">FineFix</span>
                      </div>
                    </div>
                    
                    {user && (
                      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-blue-100 text-blue-600">
                              {user.full_name ? user.full_name.charAt(0) : "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.full_name || (language === 'he' ? "משתמש" : "User")}</p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <nav className="flex-1 space-y-2">
                      <Link 
                        to={createPageUrl("Landing")}
                        className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                      >
                        <Home className={`h-5 w-5 ${language === 'he' ? 'ml-2' : 'mr-2'}`} />
                        {labels.home}
                      </Link>
                      
                      <Link 
                        to={createPageUrl("Appeal")}
                        className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                      >
                        <FileText className={`h-5 w-5 ${language === 'he' ? 'ml-2' : 'mr-2'}`} />
                        {labels.appeal}
                      </Link>
                      
                      {user && (
                        <>
                          <Link 
                            to={createPageUrl("UserDashboard")}
                            className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                          >
                            <FileText className={`h-5 w-5 ${language === 'he' ? 'ml-2' : 'mr-2'}`} />
                            {labels.myAppeals}
                          </Link>
                          
                          <Link 
                            to={createPageUrl("UserProfile")}
                            className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                          >
                            <User className={`h-5 w-5 ${language === 'he' ? 'ml-2' : 'mr-2'}`} />
                            {labels.profile}
                          </Link>
                        </>
                      )}
                    </nav>
                    
                    <div className="mt-auto pt-6 border-t">
                      {user ? (
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={handleLogout}
                        >
                          <LogOut className={`h-4 w-4 ${language === 'he' ? 'ml-2' : 'mr-2'}`} />
                          {labels.logout}
                        </Button>
                      ) : (
                        <Button 
                          className="w-full bg-blue-600 hover:bg-blue-700"
                          onClick={() => UserEntity.login()}
                        >
                          {labels.login}
                        </Button>
                      )}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </nav>
      </header>

      <main>
        {children}
      </main>

      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className={`w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center ${language === 'he' ? 'ml-2' : 'mr-2'}`}>
                  <span className="text-white font-bold">FF</span>
                </div>
                <span className="text-2xl font-bold">FineFix</span>
              </div>
              <p className="text-gray-400 mb-4">
                {language === 'he' 
                  ? "המערכת המתקדמת ביותר לערעור על דוחות חניה בישראל" 
                  : "The most advanced system for appealing parking tickets in the USA"
                }
              </p>
              <div className="text-gray-400">
                © {new Date().getFullYear()} FineFix - 
                {language === 'he' ? " כל הזכויות שמורות" : " All rights reserved"}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">
                {language === 'he' ? "ניווט מהיר" : "Quick Navigation"}
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link to={createPageUrl("Landing")} className="text-gray-400 hover:text-white">
                    {labels.home}
                  </Link>
                </li>
                <li>
                  <a href="#faq-section" className="text-gray-400 hover:text-white">
                    {labels.faq}
                  </a>
                </li>
                <li>
                  <Link to={createPageUrl("Appeal")} className="text-gray-400 hover:text-white">
                    {labels.appeal}
                  </Link>
                </li>
                {user && (
                  <li>
                    <Link to={createPageUrl("UserProfile")} className="text-gray-400 hover:text-white">
                      {labels.profile}
                    </Link>
                  </li>
                )}
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">
                {language === 'he' ? "קישורים שימושיים" : "Useful Links"}
              </h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    {language === 'he' ? "תנאי שימוש" : "Terms of Use"}
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    {language === 'he' ? "מדיניות פרטיות" : "Privacy Policy"}
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    {language === 'he' ? "צרו קשר" : "Contact Us"}
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">
                {language === 'he' ? "צרו קשר" : "Contact Us"}
              </h3>
              <ul className="space-y-2 text-gray-400">
                <li>{language === 'he' ? "דוא\"ל: info@finefix.co.il" : "Email: info@finefix.com"}</li>
                <li>{language === 'he' ? "טלפון: 03-1234567" : "Phone: 1-800-123-4567"}</li>
                <li>
                  {language === 'he' 
                    ? "כתובת: רחוב הטכנולוגיה 1, תל אביב" 
                    : "Address: 123 Tech Street, San Francisco"
                  }
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
