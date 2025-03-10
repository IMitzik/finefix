import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle } from "lucide-react";

export default function CaseStudyCard({ title, description, type, amount, success, image, delay = 0 }) {
  const renderSuccessBadge = () => {
    if (success === true) {
      return (
        <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" />
          <span>Fully Cancelled</span>
        </Badge>
      );
    } else if (success === "partial") {
      return (
        <Badge className="bg-yellow-100 text-yellow-800 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          <span>Partially Reduced</span>
        </Badge>
      );
    }
    return null;
  };

  const getViolationTypeName = (type) => {
    switch (type) {
      case "red_white": return "Red-White Zone";
      case "forbidden": return "Forbidden Area";
      case "handicapped": return "Handicapped Space";
      case "unmarked": return "Unmarked Parking";
      default: return type;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
    >
      <Card className="overflow-hidden h-full">
        <div className="relative h-48 overflow-hidden">
          <img 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
          <div className="absolute top-3 right-3 flex flex-col gap-2 items-end">
            <Badge className="bg-blue-600 hover:bg-blue-700">
              {getViolationTypeName(type)}
            </Badge>
            {renderSuccessBadge()}
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
            <div className="text-2xl font-bold">${amount.toLocaleString()}</div>
            <div className="text-sm">Original Ticket Amount</div>
          </div>
        </div>
        
        <CardContent className="pt-5 pb-5">
          <h3 className="text-xl font-bold mb-3">{title}</h3>
          <p className="text-gray-600">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}