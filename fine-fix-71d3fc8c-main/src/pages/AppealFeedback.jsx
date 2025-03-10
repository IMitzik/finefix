
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { CheckCircle2, ThumbsUp, Star, DollarSign, ArrowLeft, BarChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Appeal } from "@/api/entities";
import { UserFeedback } from "@/api/entities";
import FeedbackForm from "../components/feedback/FeedbackForm";
import FeedbackSummary from "../components/feedback/FeedbackSummary";
import LiveChatSupport from "../components/chat/LiveChatSupport";

export default function AppealFeedback() {
  const [appealId, setAppealId] = useState("");
  const [appeal, setAppeal] = useState(null);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [recentFeedbacks, setRecentFeedbacks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get("id");
        
        if (id) {
          setAppealId(id);
          
          try {
            const appealData = await Appeal.get(id);
            setAppeal(appealData);
            
            const feedbacks = await UserFeedback.filter({ appeal_id: id });
            setFeedbackSubmitted(feedbacks && feedbacks.length > 0);
          } catch (error) {
            console.error("Error loading appeal:", error);
          }
        }
        
        const allFeedbacks = await UserFeedback.list('-created_date', 50);
        setRecentFeedbacks(allFeedbacks);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  const handleFeedbackSuccess = () => {
    setFeedbackSubmitted(true);
    
    const loadFeedbacks = async () => {
      try {
        const allFeedbacks = await UserFeedback.list('-created_date', 50);
        setRecentFeedbacks(allFeedbacks);
      } catch (error) {
        console.error("Error loading feedbacks:", error);
      }
    };
    
    loadFeedbacks();
  };

  const handleBackToHome = () => {
    navigate(createPageUrl("Landing"));
  };

  const handleBackToAppeals = () => {
    navigate(createPageUrl("UserDashboard"));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-opacity-10 border-t-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {feedbackSubmitted ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-6"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
                <CheckCircle2 className="h-10 w-10 text-green-600" />
              </div>
              
              <h1 className="text-3xl font-bold">תודה על המשוב שלכם!</h1>
              <p className="text-xl text-gray-600 max-w-lg mx-auto">
                המשוב שלכם עוזר לנו להשתפר ולספק חוויה טובה יותר למשתמשים שלנו.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button 
                  onClick={handleBackToAppeals}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <BarChart className="mr-2 h-5 w-5" />
                  לדף הערעורים שלי
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={handleBackToHome}
                >
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  לדף הבית
                </Button>
              </div>
              
              <div className="mt-12 pt-8 border-t">
                <h2 className="text-2xl font-bold mb-6">הסטטיסטיקות שלנו</h2>
                <FeedbackSummary feedbacks={recentFeedbacks} />
              </div>
            </motion.div>
          ) : (
            <>
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-2">משוב והערכה</h1>
                <p className="text-gray-600">
                  המשוב שלכם חשוב לנו ועוזר לנו לשפר את השירות. אנא שתפו אותנו בחוויה שלכם.
                </p>
              </div>
              
              {appeal ? (
                <FeedbackForm 
                  appealId={appealId} 
                  onSuccess={handleFeedbackSuccess} 
                  onCancel={handleBackToAppeals}
                />
              ) : (
                <Card className="text-center p-6">
                  <CardContent className="pt-6">
                    <div className="mb-4">לא נמצא ערעור תואם</div>
                    <Button onClick={handleBackToAppeals}>
                      לדף הערעורים שלי
                    </Button>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </div>
      <LiveChatSupport />
    </div>
  );
}
