import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, TrendingUp, Zap } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';
import { useIsMobile } from '@/hooks/use-mobile';

export function LevelUpNotification({ isOpen, onClose, level }) {
  const { t } = useLanguage();
  const timerRef = useRef(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    // Clear any existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (isOpen && level) {
      // Auto close after 5 seconds - using ref to ensure proper cleanup
      timerRef.current = setTimeout(() => {
        if (typeof onClose === 'function') {
          onClose();
        }
      }, 5000);
    }

    // Cleanup function
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isOpen, level, onClose]);

  if (!isOpen || !level) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
        style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
        onClick={(e) => {
          // Close on overlay click (but not on modal click)
          if (e.target === e.currentTarget) {
            if (typeof onClose === 'function') {
              onClose();
            }
          }
        }}
      >
        <motion.div
          initial={{ scale: 0.3, opacity: 0, rotateY: -180 }}
          animate={{ scale: 1, opacity: 1, rotateY: 0 }}
          exit={{ scale: 0.3, opacity: 0, rotateY: 180 }}
          transition={{
            type: "spring",
            damping: 15,
            stiffness: 300,
            duration: 0.6
          }}
          className="relative bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-2 border-yellow-500/50 rounded-3xl shadow-2xl p-8 max-w-md w-full mx-4"
        >
          {/* Background Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-3xl blur-xl" />
          
          {/* Floating particles effect - reduced for mobile performance */}
          <div className="absolute inset-0 overflow-hidden rounded-3xl">
            {/* Reduce particles on mobile to prevent crashes */}
            {[...Array(isMobile ? 4 : 8)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  opacity: 0, 
                  scale: 0,
                  x: Math.random() * 200 - 100,
                  y: Math.random() * 150 - 75
                }}
                animate={{ 
                  opacity: [0, 1, 0], 
                  scale: [0, 1, 0],
                  x: Math.random() * 200 - 100,
                  y: Math.random() * 150 - 75
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.1,
                  repeat: Infinity,
                  repeatType: "loop",
                  ease: "linear" // Simpler easing for better mobile performance
                }}
                className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                style={{
                  left: '50%',
                  top: '50%',
                  willChange: 'transform', // Optimize for animations
                }}
              />
            ))}
          </div>

          <div className="relative z-10 text-center">
            {/* Level Up Icon with Animation */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mb-4 flex justify-center"
            >
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0"
                >
                  <Star className="w-16 h-16 text-yellow-400 drop-shadow-lg" />
                </motion.div>
                <Star className="w-16 h-16 text-yellow-500" />
              </div>
            </motion.div>

            {/* Level Up Text */}
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold text-yellow-400 mb-2 drop-shadow-lg"
            >
              🎉 {t('levelUp')}
            </motion.h2>

            {/* Level Number with Glow */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 150 }}
              className="mb-4"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full shadow-2xl mb-4">
                <span className="text-2xl font-bold text-white drop-shadow-lg">{level}</span>
              </div>
            </motion.div>

            {/* Congratulations Text */}
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-white text-lg mb-2 drop-shadow"
            >
              <div>
                {t('levelUpCongrats')} {level} {t('levelUpCongrats3')}!<br />
                {t('levelUpCongrats2')}
              </div>
            </motion.p>

            {/* New Abilities Text */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex items-center justify-center space-x-2 text-yellow-200"
            >
              <Zap className="w-4 h-4" />
              <span className="text-sm">{t('newAbilitiesUnlocked')}</span>
              <TrendingUp className="w-4 h-4" />
            </motion.div>

            {/* Progress indicator (5 second timer) */}
            <motion.div
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: 5, ease: "linear" }}
              className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
            />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}