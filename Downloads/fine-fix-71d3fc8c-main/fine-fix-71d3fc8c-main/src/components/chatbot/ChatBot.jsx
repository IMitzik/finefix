import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Send, X, Loader2, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User } from "@/api/entities";

const ChatMessage = ({ message, isUser }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}
  >
    <div
      className={`px-4 py-2 rounded-xl max-w-xs sm:max-w-md ${
        isUser ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800"
      }`}
    >
      {message}
    </div>
  </motion.div>
);

export default function ChatBot({ onInputSubmit, isMinimized = false, onToggle }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState('he'); // Default to Hebrew
  const messagesEndRef = useRef(null);

  // Load user language preference
  useEffect(() => {
    const loadLanguagePreference = async () => {
      try {
        const user = await User.me();
        if (user.language_preference) {
          setLanguage(user.language_preference);
        } else {
          const storedLang = localStorage.getItem('languagePreference');
          if (storedLang) {
            setLanguage(storedLang);
          }
        }
      } catch (error) {
        // User not logged in, check localStorage
        const storedLang = localStorage.getItem('languagePreference');
        if (storedLang) {
          setLanguage(storedLang);
        }
      }
    };
    
    loadLanguagePreference();
  }, []);

  // Set initial welcome message based on language
  useEffect(() => {
    const welcomeMessage = language === 'en' 
      ? "Hello! We're here to help you fill out the appeal form. How can we assist you?"
      : "שלום! אנחנו כאן לעזור לכם למלא את טופס הערעור. במה נוכל לסייע?";
    
    setMessages([{ text: welcomeMessage, isUser: false }]);
  }, [language]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput("");
    setMessages((prev) => [...prev, { text: userMessage, isUser: true }]);
    
    setIsLoading(true);
    
    // Simulate AI processing
    setTimeout(() => {
      let response;
      
      if (language === 'en') {
        // English responses
        if (userMessage.toLowerCase().includes("ticket") || userMessage.toLowerCase().includes("appeal") || userMessage.toLowerCase().includes("parking")) {
          response = "We're happy to help with your appeal process. Please fill in your vehicle and ticket details in the form above, and we'll guide you through the rest of the process.";
        } else if (userMessage.toLowerCase().includes("time") || userMessage.toLowerCase().includes("how long")) {
          response = "The appeal process through our system takes just a few minutes. After payment, the letter is immediately sent to the authorities.";
        } else if (userMessage.toLowerCase().includes("success") || userMessage.toLowerCase().includes("chance")) {
          response = "Our appeals have a very high success rate. The system analyzes similar cases and builds an appeal tailored to your situation optimally.";
        } else if (userMessage.toLowerCase().includes("money") || userMessage.toLowerCase().includes("payment") || userMessage.toLowerCase().includes("cost")) {
          response = "The cost is only $20, and payment is made only after you've seen the letter that our system has generated for you.";
        } else {
          response = "We're happy to answer any additional questions you have about the appeal process. How can we assist you?";
        }
      } else {
        // Hebrew responses
        if (userMessage.includes("דוח") || userMessage.includes("חניה") || userMessage.includes("ערעור")) {
          response = "אנחנו שמחים לעזור לכם בתהליך הערעור. אנא מלאו את פרטי הרכב והדוח בטופס למעלה, ואנחנו נלווה אתכם בהמשך התהליך.";
        } else if (userMessage.includes("זמן") || userMessage.includes("כמה זמן")) {
          response = "תהליך הערעור באמצעות המערכת שלנו אורך דקות ספורות. לאחר התשלום, המכתב נשלח מיידית לרשויות.";
        } else if (userMessage.includes("הצלחה") || userMessage.includes("סיכוי")) {
          response = "אחוז ההצלחה של הערעורים שלנו גבוה מאוד. המערכת מנתחת מקרים דומים ובונה ערעור המותאם למקרה שלכם באופן מיטבי.";
        } else if (userMessage.includes("כסף") || userMessage.includes("תשלום") || userMessage.includes("מחיר")) {
          response = "העלות היא 80₪ בלבד, והתשלום מתבצע רק לאחר שתראו את נוסח המכתב שהמערכת ייצרה עבורכם.";
        } else {
          response = "אנחנו שמחים לענות על כל שאלה נוספת שיש לכם לגבי תהליך הערעור. במה נוכל לסייע לכם?";
        }
      }
      
      setMessages((prev) => [...prev, { text: response, isUser: false }]);
      setIsLoading(false);
      
      if (onInputSubmit) {
        onInputSubmit(userMessage, response);
      }
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getTranslations = () => {
    if (language === 'en') {
      return {
        supportChat: "Support Chat",
        typeYourQuestion: "Type your question here...",
        send: "Send"
      };
    } else {
      return {
        supportChat: "צ'אט תמיכה",
        typeYourQuestion: "הקלידו את שאלתכם כאן...",
        send: "שלח"
      };
    }
  };

  const t = getTranslations();

  return (
    <div className={`fixed bottom-4 ${language === 'en' ? 'right-4' : 'left-4'} z-50 w-80 md:w-96`}>
      <Button
        onClick={onToggle}
        className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 absolute -top-16 right-4 shadow-lg"
      >
        {isMinimized ? (
          <MessageSquare className="h-5 w-5" />
        ) : (
          <X className="h-5 w-5" />
        )}
      </Button>
      
      <AnimatePresence>
        {!isMinimized && (
          <motion.div
            initial={{ opacity: 0, y: 20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: 20, height: 0 }}
            className="bg-white rounded-xl shadow-xl overflow-hidden border"
          >
            <div className="bg-blue-600 text-white p-3 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                <span className="font-medium">{t.supportChat}</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-blue-700"
                onClick={onToggle}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="h-80 overflow-y-auto p-4">
              {messages.map((msg, i) => (
                <ChatMessage key={i} message={msg.text} isUser={msg.isUser} />
              ))}
              {isLoading && (
                <div className="flex justify-start mb-4">
                  <div className="px-4 py-2 rounded-xl bg-gray-100 text-gray-800">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            
            <div className="p-3 border-t flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={t.typeYourQuestion}
                className="flex-1"
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}