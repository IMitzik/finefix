import React from "react";
import { motion } from "framer-motion";
import { UserFeedback } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Award, Users, Percent, DollarSign, ThumbsUp, Clock } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function FeedbackSummary({ feedbacks = [] }) {
  // Calculate statistics
  const calculateStats = () => {
    if (!feedbacks || feedbacks.length === 0) {
      return {
        averageRating: 0,
        ratingCounts: [0, 0, 0, 0, 0],
        satisfactionBreakdown: {
          "מרוצה מאוד": 0,
          "מרוצה": 0,
          "ניטרלי": 0,
          "לא מרוצה": 0,
          "לא מרוצה בכלל": 0
        },
        resultBreakdown: {
          "בוטל לחלוטין": 0,
          "הופחת": 0,
          "נדחה": 0,
          "ממתין להחלטה": 0
        },
        totalSaved: 0,
        averageProcessingTime: 0,
        recommendPercentage: 0
      };
    }

    const ratingSum = feedbacks.reduce((sum, feedback) => sum + feedback.rating, 0);
    const ratingCounts = [0, 0, 0, 0, 0]; // For 1-5 stars
    
    feedbacks.forEach(feedback => {
      if (feedback.rating >= 1 && feedback.rating <= 5) {
        ratingCounts[feedback.rating - 1]++;
      }
    });
    
    const satisfactionBreakdown = {
      "מרוצה מאוד": 0,
      "מרוצה": 0,
      "ניטרלי": 0,
      "לא מרוצה": 0,
      "לא מרוצה בכלל": 0
    };
    
    feedbacks.forEach(feedback => {
      if (feedback.satisfaction_level in satisfactionBreakdown) {
        satisfactionBreakdown[feedback.satisfaction_level]++;
      }
    });
    
    const resultBreakdown = {
      "בוטל לחלוטין": 0,
      "הופחת": 0,
      "נדחה": 0,
      "ממתין להחלטה": 0
    };
    
    feedbacks.forEach(feedback => {
      if (feedback.appeal_result in resultBreakdown) {
        resultBreakdown[feedback.appeal_result]++;
      }
    });
    
    const totalSaved = feedbacks.reduce((sum, feedback) => sum + (feedback.amount_saved || 0), 0);
    
    const validTimeFeedbacks = feedbacks.filter(f => f.time_to_process && f.time_to_process > 0);
    const avgProcessingTime = validTimeFeedbacks.length > 0 ? 
      validTimeFeedbacks.reduce((sum, f) => sum + f.time_to_process, 0) / validTimeFeedbacks.length : 
      0;
    
    const recommenders = feedbacks.filter(f => f.would_recommend).length;
    
    return {
      averageRating: feedbacks.length > 0 ? ratingSum / feedbacks.length : 0,
      ratingCounts,
      satisfactionBreakdown,
      resultBreakdown,
      totalSaved,
      averageProcessingTime: avgProcessingTime,
      recommendPercentage: feedbacks.length > 0 ? (recommenders / feedbacks.length) * 100 : 0
    };
  };

  const stats = calculateStats();

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;
    
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`w-5 h-5 ${i < fullStars ? "text-yellow-400 fill-yellow-400" : (i === fullStars && hasHalfStar) ? "text-yellow-400 fill-yellow-400 opacity-50" : "text-gray-300"}`} 
          />
        ))}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Average rating */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">דירוג ממוצע</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-3xl font-bold ml-2">{stats.averageRating.toFixed(1)}</div>
              {renderStars(stats.averageRating)}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              מתוך {feedbacks.length} משובים
            </div>
          </CardContent>
        </Card>
        
        {/* Success rate */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">אחוזי הצלחה</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Award className="text-green-500 w-8 h-8 ml-2" />
              <div className="text-3xl font-bold">
                {Math.round((stats.resultBreakdown["בוטל לחלוטין"] + stats.resultBreakdown["הופחת"]) / 
                  (feedbacks.length - stats.resultBreakdown["ממתין להחלטה"]) * 100 || 0)}%
              </div>
            </div>
            <div className="text-sm text-gray-500 mt-1">
              {stats.resultBreakdown["בוטל לחלוטין"]} ביטולים מלאים, {stats.resultBreakdown["הופחת"]} הפחתות
            </div>
          </CardContent>
        </Card>
        
        {/* Total saved */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">סה״כ כסף שנחסך</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <DollarSign className="text-blue-500 w-7 h-7 ml-2" />
              <div className="text-3xl font-bold">₪{stats.totalSaved.toLocaleString()}</div>
            </div>
            <div className="text-sm text-gray-500 mt-1">
              חיסכון ממוצע של ₪{Math.round(stats.totalSaved / feedbacks.length || 0).toLocaleString()} לערעור
            </div>
          </CardContent>
        </Card>
        
        {/* Would recommend */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">ימליצו לחברים</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <ThumbsUp className="text-green-500 w-7 h-7 ml-2" />
              <div className="text-3xl font-bold">{Math.round(stats.recommendPercentage)}%</div>
            </div>
            <div className="text-sm text-gray-500 mt-1">
              מהמשתמשים ימליצו על השירות שלנו
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Star breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">התפלגות דירוגים</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats.ratingCounts.map((count, index) => {
              const starNumber = 5 - index;
              const percentage = feedbacks.length > 0 ? (count / feedbacks.length) * 100 : 0;
              
              return (
                <div key={starNumber} className="flex items-center">
                  <div className="w-12 text-sm font-medium">{starNumber} כוכבים</div>
                  <Progress value={percentage} className="h-2 mx-2 flex-grow" />
                  <div className="w-12 text-sm text-right">{percentage.toFixed(0)}%</div>
                </div>
              );
            })}
          </CardContent>
        </Card>
        
        {/* Result breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">תוצאות ערעורים</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(stats.resultBreakdown).filter(([key]) => key !== "ממתין להחלטה").map(([result, count]) => {
                const total = feedbacks.length - stats.resultBreakdown["ממתין להחלטה"];
                const percentage = total > 0 ? (count / total) * 100 : 0;
                
                let bgColor = "bg-gray-100";
                let textColor = "text-gray-700";
                
                switch (result) {
                  case "בוטל לחלוטין":
                    bgColor = "bg-green-100";
                    textColor = "text-green-700";
                    break;
                  case "הופחת":
                    bgColor = "bg-blue-100";
                    textColor = "text-blue-700";
                    break;
                  case "נדחה":
                    bgColor = "bg-red-100";
                    textColor = "text-red-700";
                    break;
                }
                
                return (
                  <div key={result} className={`${bgColor} rounded-lg p-4`}>
                    <div className={`text-2xl font-bold ${textColor}`}>{percentage.toFixed(0)}%</div>
                    <div className="text-sm text-gray-700">{result}</div>
                    <div className="text-xs text-gray-500 mt-1">{count} ערעורים</div>
                  </div>
                );
              })}
            </div>
            
            {stats.resultBreakdown["ממתין להחלטה"] > 0 && (
              <div className="mt-4 text-sm text-gray-500 text-center">
                {stats.resultBreakdown["ממתין להחלטה"]} ערעורים עדיין ממתינים להחלטה
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}