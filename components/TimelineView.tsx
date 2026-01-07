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
        className="fixed top-14 md:top-16 lg:top-0 left-0 right-0 h-2 bg-vn-red origin-left z-50"
        style={{ scaleX }}
      />

      <div className="p-4 sm:p-6 md:p-8 lg:p-12 pb-20 sm:pb-24 max-w-5xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8 sm:mb-12 md:mb-16 mt-4 sm:mt-0"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-vn-red mb-3 sm:mb-4 uppercase tracking-wider sm:tracking-widest drop-shadow-sm px-4">
            Dòng Chảy Lịch Sử
          </h2>
          <p className="text-ink/70 text-sm sm:text-base md:text-lg font-serif italic max-w-2xl mx-auto px-4">
            "Dân ta phải biết sử ta, cho tường gốc tích nước nhà Việt Nam." <br className="hidden sm:block"/>
            Kết nối quá khứ hào hùng với hiện tại vươn mình.
          </p>
        </motion.div>
        
        <div className="relative">
          {/* Central Line */}
          <div className="absolute left-4 sm:left-6 md:left-1/2 top-0 bottom-0 w-0.5 sm:w-1 bg-gradient-to-b from-vn-red/20 via-vn-red/50 to-vn-red/20 transform md:-translate-x-1/2 rounded-full"></div>

          {TIMELINE_EVENTS.map((event: TimelineEvent, index) => {
            const isLeft = index % 2 === 0;
            return (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, y: 50, filter: 'blur(10px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className={`mb-12 sm:mb-16 md:mb-20 relative flex flex-col lg:flex-row items-center ${
                  isLeft ? 'lg:flex-row-reverse' : ''
                }`}
              >
                {/* Content Side */}
                <div className="flex-1 w-full lg:w-1/2 pl-10 sm:pl-12 lg:pl-0 lg:px-6 xl:px-8 z-10">
                  <div className={`bg-white p-4 sm:p-5 md:p-6 rounded-xl md:rounded-2xl shadow-xl border border-parchment-dark/50 hover:border-vn-red/50 transition-all duration-300 group overflow-hidden relative ${
                     event.type === 'historical' ? 'hover:shadow-vn-red/20' : 'hover:shadow-blue-500/20'
                  }`}>
                    {/* Decorative Background Icon */}
                    <div className="absolute -right-4 sm:-right-6 -bottom-4 sm:-bottom-6 opacity-5 z-0 transform rotate-12 group-hover:scale-110 transition-transform duration-500">
                       {event.type === 'historical' ? <Flag className="w-[80px] h-[80px] sm:w-[120px] sm:h-[120px]" /> : <User className="w-[80px] h-[80px] sm:w-[120px] sm:h-[120px]" />}
                    </div>

                    <div className="relative z-10">
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3">
                        <span className={`px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-bold shadow-sm ${
                          event.type === 'historical' 
                            ? 'bg-vn-red text-white' 
                            : 'bg-blue-600 text-white'
                        }`}>
                          {event.year}
                        </span>
                        <span className="flex items-center text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gray-400">
                          {event.type === 'historical' ? <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1"/> : <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1"/>}
                          {event.type === 'historical' ? 'Di sản' : 'Hiện tại'}
                        </span>
                      </div>
                      
                      <h3 className={`text-lg sm:text-xl md:text-2xl font-serif font-bold mb-2 sm:mb-3 ${
                        event.type === 'historical' ? 'text-vn-red' : 'text-blue-800'
                      }`}>
                        {event.title}
                      </h3>
                      
                      <p className="text-gray-700 font-sans leading-relaxed text-sm sm:text-base text-justify">
                        {event.description}
                      </p>
                    </div>

                    {event.image && (
                      <motion.div 
                        className="mt-3 sm:mt-4 rounded-lg overflow-hidden border border-parchment-dark shadow-inner h-40 sm:h-48 w-full"
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
                <div className="absolute left-4 sm:left-6 lg:left-1/2 transform -translate-x-1/2 flex items-center justify-center z-20">
                  <motion.div 
                    whileHover={{ scale: 1.2, rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full border-3 sm:border-4 border-[#F9F7F0] shadow-lg flex items-center justify-center ${
                      event.type === 'historical' ? 'bg-vn-red text-vn-gold' : 'bg-blue-600 text-white'
                    }`}
                  >
                    {event.type === 'historical' ? <Flag className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" /> : <User className="w-4 h-4 sm:w-5 sm:h-5" />}
                  </motion.div>
                </div>

                {/* Empty Side for Layout Balance */}
                <div className="hidden lg:block flex-1 w-1/2"></div>
              </motion.div>
            );
          })}
          
          {/* End of Line Indicator */}
          <div className="absolute left-4 sm:left-6 lg:left-1/2 bottom-0 transform -translate-x-1/2 translate-y-full pt-4">
             <div className="w-3 h-3 sm:w-4 sm:h-4 bg-vn-red rounded-full animate-bounce opacity-50"></div>
          </div>
        </div>
      </div>
    </div>
  );
};