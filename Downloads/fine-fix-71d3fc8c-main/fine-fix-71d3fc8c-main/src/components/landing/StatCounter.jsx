import React from "react";
import { motion } from "framer-motion";

export default function StatCounter({ icon, value, label, suffix = "", decimals = 0, iconColor = "blue-600" }) {
  const Icon = icon;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="flex flex-col items-center text-center"
    >
      <Icon className={`w-10 h-10 md:w-12 md:h-12 mb-4 text-${iconColor}`} />
      <div className="text-4xl md:text-5xl font-bold mb-2">
        {typeof value === 'number' 
          ? value.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ",") 
          : value}
        {suffix}
      </div>
      <div className="text-lg md:text-xl text-blue-200">{label}</div>
    </motion.div>
  );
}