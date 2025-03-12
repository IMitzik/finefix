import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { Appeal } from "@/api/entities";
import { User } from "@/api/entities";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AppealForm from "../components/appeal/AppealForm";
import PaymentForm from "../components/appeal/PaymentForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import ChatBot from "../components/chatbot/ChatBot";

export default function AppealPage() {
  const [activeTab, setActiveTab] = useState("form");
  const [appealData, setAppealData] = useState(null);
  const [showChatbot, setShowChatbot] = useState(true);
  const [language, setLanguage] = useState('he'); // Default to Hebrew
  const navigate = useNavigate();

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

  const handleFormSubmit = async (formData) => {
    try {
      // Create appeal in the database
      const appealRecord = await Appeal.create({
        car_number: formData.carNumber,
        ticket_number: formData.ticketNumber,
        violation_type: formData.violationType,
        appeal_reason: formData.appealReason,
        appeal_details: formData.otherReason,
        document_urls: formData.documents.map(doc => doc.url),
        generated_letter: formData.generated_letter,
        violation_date: formData.violationDate,
        violation_time: formData.violationTime,
        violation_location: formData.violationLocation,
        ticket_amount: formData.ticketAmount,
        was_driver: formData.wasDriver,
        correct_parking: formData.correctParking,
        visible_signage: formData.visibleSignage,
        payment_status: "pending",
        appeal_status: "draft"
      });
      
      // Go to payment tab
      setAppealData(appealRecord);
      setActiveTab("payment");
    } catch (error) {
      console.error("Error creating appeal:", error);
      throw error;
    }
  };

  const handlePaymentSuccess = (paymentData) => {
    navigate(createPageUrl("UserDashboard"));
  };

  const handleBackToHome = () => {
    navigate(createPageUrl("Landing"));
  };

  const getTranslations = () => {
    if (language === 'en') {
      return {
        pageTitle: "Submit Appeal",
        tabs: {
          form: "Appeal Form",
          payment: "Payment"
        },
        backToHome: "Back to Home",
        chatbot: {
          title: "Support Chat"
        }
      };
    } else {
      return {
        pageTitle: "הגשת ערעור",
        tabs: {
          form: "טופס ערעור",
          payment: "תשלום"
        },
        backToHome: "חזרה לדף הבית",
        chatbot: {
          title: "צ'אט תמיכה"
        }
      };
    }
  };

  const t = getTranslations();

  return (
    <div className={`min-h-screen bg-gray-50 p-4 md:p-8 ${language === 'he' ? 'rtl' : 'ltr'}`}>
      <div className="container mx-auto max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">{t.pageTitle}</h1>
          </div>
          <Button variant="outline" onClick={handleBackToHome}>
            {language === 'he' ? (
              <>
                {t.backToHome}
                <ArrowLeft className="mr-2 h-4 w-4" />
              </>
            ) : (
              <>
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t.backToHome}
              </>
            )}
          </Button>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full">
            <TabsTrigger value="form" className="flex-1" disabled={activeTab === "payment"}>
              {t.tabs.form}
            </TabsTrigger>
            <TabsTrigger value="payment" className="flex-1" disabled={!appealData}>
              {t.tabs.payment}
            </TabsTrigger>
          </TabsList>
          
          <div className="mt-6">
            <TabsContent value="form">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <AppealForm onSubmit={handleFormSubmit} />
              </motion.div>
            </TabsContent>
            
            <TabsContent value="payment">
              {appealData && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <PaymentForm appealData={appealData} onSuccess={handlePaymentSuccess} />
                </motion.div>
              )}
            </TabsContent>
          </div>
        </Tabs>
      </div>
      
      <ChatBot isMinimized={!showChatbot} onToggle={() => setShowChatbot(!showChatbot)} />
    </div>
  );
}