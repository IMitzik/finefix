import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserFeedback } from "@/api/entities";
import { User } from "@/api/entities";
import { Star, ThumbsUp, ArrowLeft, ArrowRight, BarChart3, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import FeedbackSummary from "./FeedbackSummary";

export default function FeedbackDisplay() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [view, setView] = useState("testimonials");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const loadFeedbacks = async () => {
      try {
        setLoading(true);
        
        // Load all feedbacks
        const allFeedbacks = await UserFeedback.list('-created_date');
        
        // For each feedback, try to get the user's name
        const enrichedFeedbacks = await Promise.all(
          allFeedbacks.map(async (feedback) => {
            try {
              const creator = await User.get(feedback.created_by);
              
              return {
                ...feedback,
                user_name: creator ? creator.full_name : "משתמש/ת"
              };
            } catch (error) {
              return {
                ...feedback,
                user_name: "משתמש/ת"
              };
            }
          })
        );
        
        setFeedbacks(enrichedFeedbacks);
      } catch (error) {
        console.error("Error loading feedbacks:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadFeedbacks();
  }, []);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : filteredFeedbacks.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < filteredFeedbacks.length - 1 ? prev + 1 : 0));
  };

  // Apply filters
  const filteredFeedbacks = feedbacks.filter(feedback => {
    // Only show feedbacks with good ratings for testimonials
    if (view === "testimonials" && !feedback.is_displayed) {
      return false;
    }
    
    // Apply result filter
    if (filter !== "all" && feedback.appeal_result !== filter) {
      return false;
    }
    
    return true;
  });

  const renderStars = (rating) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`w-4 h-4 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} 
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-40">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-opacity-10 border-t-blue-600"></div>
      </div>
    );
  }

  if (feedbacks.length === 0) {
    return (
      <div className="text-center p-6 bg-gray-50 rounded-lg">
        <MessageSquare className="w-12 h-12 mx-auto text-gray-400 mb-3" />
        <h3 className="text-lg font-medium mb-1">אין משובים עדיין</h3>
        <p className="text-gray-500">
          המשובים והדירוגים של המשתמשים שלנו יופיעו כאן בקרוב
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs value={view} onValueChange={setView} className="w-full">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="testimonials" className="flex items-center gap-1">
              <MessageSquare className="w-4 h-4" />
              <span>עדויות</span>
            </TabsTrigger>
            <TabsTrigger value="statistics" className="flex items-center gap-1">
              <BarChart3 className="w-4 h-4" />
              <span>סטטיסטיקות</span>
            </TabsTrigger>
          </TabsList>
          
          {view === "testimonials" && (
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFilter("all")}
                className={filter === "all" ? "bg-blue-50" : ""}
              >
                הכל
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFilter("בוטל לחלוטין")}
                className={filter === "בוטל לחלוטין" ? "bg-green-50" : ""}
              >
                בוטל
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFilter("הופחת")}
                className={filter === "הופחת" ? "bg-blue-50" : ""}
              >
                הופחת
              </Button>
            </div>
          )}
        </div>
        
        <TabsContent value="testimonials" className="mt-0">
          {filteredFeedbacks.length > 0 ? (
            <div className="relative">
              <div className="overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-xl p-6 shadow border border-gray-100"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                          {filteredFeedbacks[currentIndex].user_name.charAt(0)}
                        </div>
                      </div>
                      
                      <div className="flex-grow">
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="font-medium">{filteredFeedbacks[currentIndex].user_name}</h3>
                          <div className="flex gap-1 items-center">
                            {renderStars(filteredFeedbacks[currentIndex].rating)}
                          </div>
                        </div>
                        
                        <div className="flex gap-2 mb-3">
                          <Badge className={`
                            ${filteredFeedbacks[currentIndex].appeal_result === "בוטל לחלוטין" ? "bg-green-100 text-green-800" : 
                              filteredFeedbacks[currentIndex].appeal_result === "הופחת" ? "bg-blue-100 text-blue-800" :
                              filteredFeedbacks[currentIndex].appeal_result === "נדחה" ? "bg-red-100 text-red-800" :
                              "bg-gray-100 text-gray-800"}
                          `}>
                            {filteredFeedbacks[currentIndex].appeal_result}
                          </Badge>
                          
                          {filteredFeedbacks[currentIndex].amount_saved > 0 && (
                            <Badge variant="outline">
                              חסך ₪{filteredFeedbacks[currentIndex].amount_saved}
                            </Badge>
                          )}
                          
                          {filteredFeedbacks[currentIndex].would_recommend && (
                            <Badge className="bg-blue-100 text-blue-800 flex items-center gap-1">
                              <ThumbsUp className="h-3 w-3" /> ממליץ
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-gray-700">
                          {filteredFeedbacks[currentIndex].feedback_text || 
                            `${filteredFeedbacks[currentIndex].user_name} דירג את השירות שלנו ב-${filteredFeedbacks[currentIndex].rating} כוכבים והיה ${filteredFeedbacks[currentIndex].satisfaction_level} מהשירות.`}
                        </p>
                        
                        <div className="text-sm text-gray-500 mt-3">
                          {new Date(filteredFeedbacks[currentIndex].created_date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
              
              {filteredFeedbacks.length > 1 && (
                <div className="flex justify-center mt-4 gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handlePrevious}
                    className="rounded-full w-8 h-8"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  
                  <div className="text-sm text-gray-500 flex items-center">
                    {currentIndex + 1} / {filteredFeedbacks.length}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleNext}
                    className="rounded-full w-8 h-8"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-medium mb-1">לא נמצאו עדויות</h3>
              <p className="text-gray-500">
                אין עדויות העונות לקריטריוני הסינון שבחרת
              </p>
              <Button
                variant="outline"
                className="mt-3"
                onClick={() => setFilter("all")}
              >
                הצג הכל
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="statistics" className="mt-0">
          <FeedbackSummary feedbacks={feedbacks} />
        </TabsContent>
      </Tabs>
    </div>
  );
}