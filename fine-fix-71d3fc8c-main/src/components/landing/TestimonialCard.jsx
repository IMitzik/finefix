import React from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

export default function TestimonialCard({ testimonial }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl p-6 md:p-8 shadow-xl border border-gray-100"
    >
      <div className="flex flex-col md:flex-row gap-6 md:gap-8">
        <div className="md:w-1/3 flex flex-col items-center text-center">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden mb-4 border-4 border-blue-100">
            <img 
              src={testimonial.image} 
              alt={testimonial.name} 
              className="w-full h-full object-cover"
            />
          </div>
          <h3 className="text-lg md:text-xl font-bold">{testimonial.name}</h3>
          {testimonial.position && (
            <p className="text-blue-600 text-sm mb-1">{testimonial.position}</p>
          )}
          <p className="text-gray-500">{testimonial.location}</p>
          <div className="flex mt-3">
            {[...Array(testimonial.rating || 5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
            ))}
          </div>
        </div>
        <div className="md:w-2/3">
          <div className="text-4xl text-blue-300 mb-3 md:mb-4">"</div>
          <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-4 md:mb-6">
            {testimonial.text}
          </p>
          <p className="italic text-gray-500">
            Satisfied customer, {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </motion.div>
  );
}