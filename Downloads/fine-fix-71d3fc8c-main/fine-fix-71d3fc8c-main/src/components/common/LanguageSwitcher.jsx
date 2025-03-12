import React from "react";
import { useNavigate } from "react-router-dom";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "@/api/entities";

export default function LanguageSwitcher({ className }) {
  const navigate = useNavigate();
  
  const setLanguagePreference = async (language) => {
    try {
      // Try to save user preference if logged in
      try {
        const user = await User.me();
        await User.updateMyUserData({ 
          language_preference: language
        });
      } catch (error) {
        // User not logged in, just use local storage
        console.log("User not logged in, saving preference to localStorage");
      }
      
      // Always save to localStorage for non-logged in users and as a backup
      localStorage.setItem('languagePreference', language);
      
      // Reload the current page to apply language change
      window.location.reload();
    } catch (error) {
      console.error("Error setting language preference:", error);
    }
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className={className}>
          <Globe className="h-5 w-5" />
          <span className="sr-only">Toggle language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setLanguagePreference('en')}>
          🇺🇸 English
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguagePreference('he')}>
          🇮🇱 עברית
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}