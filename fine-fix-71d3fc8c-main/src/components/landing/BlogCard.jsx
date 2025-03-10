import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Calendar, Clock, User, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createPageUrl } from "@/utils";

export default function BlogCard({ post, delay = 0 }) {
  // Get language from localStorage, default to Hebrew if not set
  const language = localStorage.getItem('languagePreference') || 'he';
  const isRTL = language === 'he';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
    >
      <Card className="overflow-hidden hover:shadow-md transition-shadow h-full flex flex-col">
        <div className="relative h-48 w-full overflow-hidden">
          <img
            src={post.image || "https://images.unsplash.com/photo-1588421357574-87938a86fa28?auto=format&fit=crop&q=80&w=600"}
            alt={post.title}
            className="h-full w-full object-cover transition-transform hover:scale-105"
          />
          <Badge className="absolute top-3 right-3 bg-blue-600">{post.category}</Badge>
        </div>
        
        <CardContent className="py-5 flex-grow">
          <div className={`flex items-center text-sm text-gray-500 mb-3 ${isRTL ? 'space-x-reverse' : 'space-x-2'}`}>
            <div className="flex items-center">
              <Calendar className={`h-3.5 w-3.5 ${isRTL ? 'ml-1' : 'mr-1'}`} />
              <span>{post.publishDate}</span>
            </div>
            <div className="mx-2">•</div>
            <div className="flex items-center">
              <Clock className={`h-3.5 w-3.5 ${isRTL ? 'ml-1' : 'mr-1'}`} />
              <span>{post.readTime}</span>
            </div>
          </div>
          
          <h3 className="font-bold text-xl mb-2 line-clamp-2">{post.title}</h3>
          <p className="text-gray-600 text-sm line-clamp-3 mb-3">{post.summary}</p>
          
          <div className="flex items-center">
            <img
              src={post.authorImage || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=50"}
              alt={post.author}
              className={`h-8 w-8 rounded-full object-cover ${isRTL ? 'ml-2' : 'mr-2'}`}
            />
            <span className="text-sm font-medium">{post.author}</span>
          </div>
        </CardContent>
        
        <CardFooter className="border-t pt-4 pb-4">
          <Button
            variant="ghost"
            className="text-blue-600 p-0 h-auto font-medium hover:bg-transparent hover:text-blue-800"
            onClick={() => {
              // Instead of navigating to a dedicated blog post page, we'll alert a message
              alert(isRTL 
                ? `המאמר המלא יהיה זמין בקרוב: ${post.title}`
                : `Full article coming soon: ${post.title}`
              );
            }}
          >
            {isRTL ? 'המשך קריאה' : 'Continue Reading'}
            {isRTL 
              ? <ChevronLeft className="h-4 w-4 mr-1" />
              : <ChevronRight className="h-4 w-4 ml-1" />
            }
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}