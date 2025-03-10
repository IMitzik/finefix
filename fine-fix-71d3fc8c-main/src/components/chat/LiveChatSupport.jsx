
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageCircle, 
  Send, 
  X as XIcon, 
  Loader2, 
  User as UserIcon, 
  UserCheck, 
  ChevronDown, 
  ChevronUp, 
  Phone, 
  Mail,
  Clock,
  CheckCircle2,
  Image,
  Paperclip,
  Mic,
  Smile,
  FileText,
  MinusCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User } from "@/api/entities";
import { ChatMessage } from "@/api/entities";
import { format } from "date-fns";

export default function LiveChatSupport() {
  const [isMinimized, setIsMinimized] = useState(true);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [agent, setAgent] = useState(null);
  const [typingIndicator, setTypingIndicator] = useState(false);
  const [userTyping, setUserTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [user, setUser] = useState(null);
  const [chatStarted, setChatStarted] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const chatHistoryInterval = useRef(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await User.me();
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUser();

    return () => {
      if (chatHistoryInterval.current) {
        clearInterval(chatHistoryInterval.current);
      }
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const toggleChat = () => {
    setIsMinimized(!isMinimized);
    
    if (isMinimized && !chatStarted && messages.length === 0) {
      addSystemMessage(
        "ברוכים הבאים לצ'אט התמיכה של FineFix. כיצד נוכל לעזור לכם?"
      );
    }
  };

  const startChat = async () => {
    if (!user) {
      addSystemMessage(
        "אנא התחברו למערכת כדי להשתמש בצ'אט התמיכה החי"
      );
      return;
    }

    setChatStarted(true);
    setIsConnecting(true);
    addSystemMessage("מתחבר לנציג שירות, אנא המתינו...");

    setTimeout(() => {
      const agents = [
        { 
          id: 1, 
          name: "יעל כהן", 
          image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100",
          title: "נציגת שירות לקוחות",
          experience: "3 שנים"
        },
        { 
          id: 2, 
          name: "אורן לוי", 
          image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=100",
          title: "מומחה ערעורים",
          experience: "5 שנים"
        },
        { 
          id: 3, 
          name: "מיכל ברקת", 
          image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=100",
          title: "ראש צוות תמיכה",
          experience: "7 שנים"
        }
      ];

      const selectedAgent = agents[Math.floor(Math.random() * agents.length)];
      setAgent(selectedAgent);
      setIsConnecting(false);
      setIsConnected(true);

      addAgentMessage(`שלום ${user?.full_name || "לקוח יקר"}, שמי ${selectedAgent.name} ואני כאן לעזור לך עם הערעור שלך. במה אוכל לסייע לך היום?`);

      chatHistoryInterval.current = setInterval(fetchChatHistory, 5000);
    }, 2000);
  };

  const addSystemMessage = (text) => {
    const newMessage = {
      id: Date.now(),
      text,
      sender: "system",
      timestamp: new Date()
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const addAgentMessage = (text) => {
    setTypingIndicator(true);
    
    setTimeout(() => {
      const newMessage = {
        id: Date.now(),
        text,
        sender: "agent",
        agent: agent,
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, newMessage]);
      setTypingIndicator(false);
      
      if (isConnected) {
        try {
          ChatMessage.create({
            content: text,
            sender_type: "agent",
            sender_id: agent.id.toString(), // Convert number to string
            sender_name: agent.name,
            user_email: user?.email
          });
        } catch (error) {
          console.error("Error saving chat message:", error);
        }
      }
    }, 1000);
  };

  const addUserMessage = (text) => {
    const newMessage = {
      id: Date.now(),
      text,
      sender: "user",
      timestamp: new Date()
    };
    setMessages((prev) => [...prev, newMessage]);
    
    if (isConnected && user) {
      try {
        ChatMessage.create({
          content: text,
          sender_type: "user",
          sender_id: user.id.toString(), // Convert user id to string 
          sender_name: user?.full_name,
          user_email: user?.email
        });
      } catch (error) {
        console.error("Error saving chat message:", error);
      }
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;
    
    addUserMessage(input);
    setInput("");
    
    if (!isConnected) {
      startChat();
      return;
    }

    setUserTyping(false);
    
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes("ערעור") || lowerInput.includes("דוח")) {
      setTimeout(() => {
        addAgentMessage("אני אשמח לעזור לך עם הערעור. האם כבר התחלת את תהליך הערעור במערכת שלנו?");
      }, 2000);
    } else if (lowerInput.includes("תשלום") || lowerInput.includes("מחיר") || lowerInput.includes("עלות")) {
      setTimeout(() => {
        addAgentMessage("התשלום עבור הגשת ערעור דרך המערכת שלנו הוא 20₪ בלבד. זה תשלום חד-פעמי, ואתם משלמים רק אם אתם מחליטים להגיש את הערעור שהמערכת ייצרה עבורכם.");
      }, 2000);
    } else if (lowerInput.includes("זמן")) {
      setTimeout(() => {
        addAgentMessage("בדרך כלל, תהליך ההגשה אורך כ-5-10 דקות. לאחר הגשת הערעור, זמן התגובה של הרשויות משתנה, אך בדרך כלל נע בין 14 ל-30 יום.");
      }, 2000);
    } else if (lowerInput.includes("תודה")) {
      setTimeout(() => {
        addAgentMessage("שמחתי לעזור! האם יש משהו נוסף שאוכל לסייע בו?");
      }, 2000);
    } else {
      setTimeout(() => {
        addAgentMessage("אני מבין. האם תוכל לספק מידע נוסף לגבי השאלה או הבעיה שלך? כך אוכל לעזור לך בצורה יעילה יותר.");
      }, 2000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    
    if (!userTyping) {
      setUserTyping(true);
    }
    
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
    
    setTypingTimeout(
      setTimeout(() => {
        setUserTyping(false);
      }, 1500)
    );
  };

  const endChat = () => {
    addSystemMessage("השיחה הסתיימה. תודה שפנית אלינו!");
    setIsConnected(false);
    setAgent(null);
    setChatStarted(false);
    
    if (chatHistoryInterval.current) {
      clearInterval(chatHistoryInterval.current);
    }
  };

  const uploadFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    addUserMessage(`שלחתי קובץ: ${file.name}`);
    
    setTimeout(() => {
      addAgentMessage(`תודה על שליחת הקובץ ${file.name}. אני אבדוק אותו ואחזור אליך בהקדם.`);
    }, 2000);
  };

  const fetchChatHistory = async () => {
    if (isConnected && Math.random() > 0.85) {
      const followUps = [
        "האם הצלחת להתקדם עם הערעור שלך?",
        "רק רציתי לבדוק אם אתה עדיין צריך עזרה כלשהי?",
        "האם המידע שסיפקתי היה מועיל עבורך?",
        "האם יש לך שאלות נוספות שאוכל לעזור בהן?"
      ];
      
      addAgentMessage(followUps[Math.floor(Math.random() * followUps.length)]);
    }
  };

  const MessageBubble = ({ message }) => {
    const isSystem = message.sender === "system";
    const isUser = message.sender === "user";
    const isAgent = message.sender === "agent";
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}
      >
        {isAgent && (
          <Avatar className="w-8 h-8 mr-2">
            <AvatarImage src={message.agent?.image} />
            <AvatarFallback>{message.agent?.name.charAt(0)}</AvatarFallback>
          </Avatar>
        )}
        
        <div className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}>
          {isAgent && (
            <span className="text-xs text-gray-500 mb-1">{message.agent?.name}</span>
          )}
          
          <div
            className={`px-4 py-2 rounded-xl max-w-xs sm:max-w-md ${
              isSystem
                ? "bg-gray-200 text-gray-800"
                : isUser
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {message.text}
          </div>
          
          <span className="text-xs text-gray-500 mt-1">
            {format(message.timestamp, "HH:mm")}
          </span>
        </div>
        
        {isUser && (
          <Avatar className="w-8 h-8 ml-2">
            <AvatarFallback>{user?.full_name?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
        )}
      </motion.div>
    );
  };

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <AnimatePresence>
        {!isMinimized && (
          <motion.div
            initial={{ opacity: 0, y: 20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: 20, height: 0 }}
            className="bg-white rounded-xl shadow-xl overflow-hidden border w-80 md:w-96 mb-4"
          >
            <div className="bg-blue-600 text-white p-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  <span className="font-medium">צ'אט תמיכה חי</span>
                </div>
                <div className="flex items-center gap-1">
                  {isConnected && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:bg-blue-700 h-8 w-8"
                      onClick={endChat}
                    >
                      <MinusCircle className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-blue-700 h-8 w-8"
                    onClick={toggleChat}
                  >
                    <XIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {isConnected && agent && (
                <div className="mt-2 flex items-center">
                  <Avatar className="h-10 w-10 border-2 border-white">
                    <AvatarImage src={agent.image} />
                    <AvatarFallback>{agent.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="mr-3">
                    <div className="flex items-center">
                      <span className="font-medium">{agent.name}</span>
                      <div className="flex items-center mr-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-xs text-green-200 mr-1">מחובר</span>
                      </div>
                    </div>
                    <p className="text-xs text-blue-100">{agent.title}</p>
                  </div>
                </div>
              )}
            </div>
            
            <Tabs defaultValue="chat" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full rounded-none border-b">
                <TabsTrigger value="chat" className="flex-1">צ'אט</TabsTrigger>
                {isConnected && (
                  <TabsTrigger value="info" className="flex-1">פרטי נציג</TabsTrigger>
                )}
              </TabsList>
              
              <TabsContent value="chat" className="m-0 p-0">
                <div className="h-80 overflow-y-auto p-4">
                  {messages.map((message) => (
                    <MessageBubble key={message.id} message={message} />
                  ))}
                  
                  {typingIndicator && (
                    <div className="flex items-center mb-3">
                      <Avatar className="w-8 h-8 mr-2">
                        <AvatarImage src={agent?.image} />
                        <AvatarFallback>{agent?.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="px-4 py-2 rounded-xl bg-gray-100 flex">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
                
                <div className="border-t p-3">
                  {!isConnected && !isConnecting ? (
                    <Button 
                      onClick={startChat} 
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      התחברו לנציג שירות
                      <UserCheck className="mr-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <>
                      {isConnecting ? (
                        <div className="flex justify-center items-center py-2">
                          <Loader2 className="h-5 w-5 animate-spin text-blue-600 mr-2" />
                          <span>מתחבר לנציג שירות...</span>
                        </div>
                      ) : (
                        <>
                          <div className="flex gap-2 items-center mb-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={uploadFile}
                              className="h-8 w-8 rounded-full hover:bg-gray-100"
                            >
                              <Paperclip className="h-4 w-4 text-gray-500" />
                            </Button>
                            <input
                              type="file"
                              ref={fileInputRef}
                              onChange={handleFileUpload}
                              className="hidden"
                            />
                            
                            <div className="flex-1 relative">
                              <Input
                                value={input}
                                onChange={handleInputChange}
                                onKeyPress={handleKeyPress}
                                placeholder="הקלידו הודעה..."
                                className="pl-10"
                              />
                              {userTyping && (
                                <div className="absolute left-2 bottom-0 text-xs text-gray-500">
                                  מקליד...
                                </div>
                              )}
                            </div>
                            
                            <Button
                              onClick={handleSend}
                              className="bg-blue-600 hover:bg-blue-700 h-9 w-9 p-0 rounded-full"
                              disabled={!input.trim()}
                            >
                              <Send className="h-4 w-4" />
                            </Button>
                          </div>
                        </>
                      )}
                    </>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="info" className="m-0 p-0">
                {agent && (
                  <div className="p-4">
                    <div className="flex flex-col items-center mb-4">
                      <Avatar className="h-24 w-24 mb-3">
                        <AvatarImage src={agent.image} />
                        <AvatarFallback>{agent.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <h3 className="text-lg font-bold">{agent.name}</h3>
                      <p className="text-gray-500">{agent.title}</p>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                          <Clock className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">ניסיון</p>
                          <p className="font-medium">{agent.experience}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                          <CheckCircle2 className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">התמחות</p>
                          <p className="font-medium">ערעורי דוחות חניה</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                          <Mail className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">דוא"ל</p>
                          <p className="font-medium">{agent.name.replace(" ", ".").toLowerCase()}@finefix.co.il</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <Button 
                        onClick={() => setActiveTab("chat")}
                        className="w-full bg-blue-600 hover:bg-blue-700"
                      >
                        חזרה לצ'אט
                      </Button>
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.button
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleChat}
        className={`${
          isMinimized ? "bg-blue-600" : "bg-red-500"
        } text-white rounded-full p-3 shadow-lg flex items-center`}
      >
        {isMinimized ? (
          <>
            <MessageCircle className="h-6 w-6" />
            <span className="mr-2 font-medium">צ'אט לייב</span>
          </>
        ) : (
          <XIcon className="h-6 w-6" />
        )}
      </motion.button>
    </div>
  );
}
