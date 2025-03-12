import React from "react";
import { Card, CardContent } from "@/components/ui/card";

export default function AIInsightCard({ 
  title, 
  description, 
  icon: Icon, 
  iconColor = "text-blue-500",
  bgColor = "bg-blue-50",
  borderColor = "border-blue-200",
  footer = null
}) {
  return (
    <Card className={`${bgColor} ${borderColor}`}>
      <CardContent className="pt-6">
        <div className="flex items-start gap-3">
          <div className={`${iconColor} p-2 rounded-full bg-white`}>
            <Icon className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h4 className="font-medium mb-1">{title}</h4>
            <p className="text-gray-700 text-sm">{description}</p>
            {footer && (
              <div className="mt-3 pt-3 border-t text-sm font-medium">
                {footer}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}