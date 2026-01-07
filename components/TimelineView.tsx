import React from 'react';
import { TIMELINE_EVENTS } from '../constants';
import { TimelineEvent } from '../types';
import { Flag, User, Clock, MapPin } from 'lucide-react';
import { motion, useScroll, useSpring } from 'framer-motion';

export const TimelineView: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="h-full overflow-y-auto overflow-x-hidden relative bg-[#F9F7F0]">
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-2 bg-vn-red origin-left z-50"
        style={{ scaleX }}
      />

      <div className="p-4 md:p-12 pb-24 max-w-5xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-vn-red mb-4 uppercase tracking-widest drop-shadow-sm">
            Dòng Chảy Lịch Sử
          </h2>
          <p className="text-ink/70 text-lg font-serif italic max-w-2xl mx-auto">
            "Dân ta phải biết sử ta, cho tường gốc tích nước nhà Việt Nam." <br/>
            Kết nối quá khứ hào hùng với hiện tại vươn mình.
          </p>
        </motion.div>
        
        <div className="relative">
          {/* Central Line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-vn-red/20 via-vn-red/50 to-vn-red/20 transform md:-translate-x-1/2 rounded-full"></div>

          {TIMELINE_EVENTS.map((event: TimelineEvent, index) => {
            const isLeft = index % 2 === 0;
            return (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, y: 50, filter: 'blur(10px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className={`mb-20 relative flex flex-col md:flex-row items-center ${
                  isLeft ? 'md:flex-row-reverse' : ''
                }`}
              >
                {/* Content Side */}
                <div className="flex-1 w-full md:w-1/2 pl-12 md:pl-0 md:px-8 z-10">
                  <div className={`bg-white p-6 rounded-2xl shadow-xl border border-parchment-dark/50 hover:border-vn-red/50 transition-all duration-300 group overflow-hidden relative ${
                     event.type === 'historical' ? 'hover:shadow-vn-red/20' : 'hover:shadow-blue-500/20'
                  }`}>
                    {/* Decorative Background Icon */}
                    <div className="absolute -right-6 -bottom-6 opacity-5 z-0 transform rotate-12 group-hover:scale-110 transition-transform duration-500">
                       {event.type === 'historical' ? <Flag size={120} /> : <User size={120} />}
                    </div>

                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-3">
                        <span className={`px-4 py-1.5 rounded-full text-sm font-bold shadow-sm ${
                          event.type === 'historical' 
                            ? 'bg-vn-red text-white' 
                            : 'bg-blue-600 text-white'
                        }`}>
                          {event.year}
                        </span>
                        <span className="flex items-center text-xs font-bold uppercase tracking-wider text-gray-400">
                          {event.type === 'historical' ? <MapPin size={14} className="mr-1"/> : <Clock size={14} className="mr-1"/>}
                          {event.type === 'historical' ? 'Di sản' : 'Hiện tại'}
                        </span>
                      </div>
                      
                      <h3 className={`text-2xl font-serif font-bold mb-3 ${
                        event.type === 'historical' ? 'text-vn-red' : 'text-blue-800'
                      }`}>
                        {event.title}
                      </h3>
                      
                      <p className="text-gray-700 font-sans leading-relaxed text-base text-justify">
                        {event.description}
                      </p>
                    </div>

                    {event.image && (
                      <motion.div 
                        className="mt-4 rounded-lg overflow-hidden border border-parchment-dark shadow-inner h-48 w-full"
                        whileHover={{ scale: 1.02 }}
                      >
                        <img 
                          src={event.image} 
                          alt={event.title} 
                          className="w-full h-full object-cover sepia-[0.3] hover:sepia-0 transition-all duration-700"
                        />
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Center Point */}
                <div className="absolute left-4 md:left-1/2 transform -translate-x-1/2 flex items-center justify-center z-20">
                  <motion.div 
                    whileHover={{ scale: 1.2, rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className={`w-12 h-12 rounded-full border-4 border-[#F9F7F0] shadow-lg flex items-center justify-center ${
                      event.type === 'historical' ? 'bg-vn-red text-vn-gold' : 'bg-blue-600 text-white'
                    }`}
                  >
                    {event.type === 'historical' ? <Flag size={20} fill="currentColor" /> : <User size={20} />}
                  </motion.div>
                </div>

                {/* Empty Side for Layout Balance */}
                <div className="hidden md:block flex-1 w-1/2"></div>
              </motion.div>
            );
          })}
          
          {/* End of Line Indicator */}
          <div className="absolute left-4 md:left-1/2 bottom-0 transform -translate-x-1/2 translate-y-full pt-4">
             <div className="w-4 h-4 bg-vn-red rounded-full animate-bounce opacity-50"></div>
          </div>
        </div>
      </div>
    </div>
  );
};