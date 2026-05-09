'use client';

import { useState, useEffect } from 'react';

export interface WatermarkData {
  userId: string;
  ipAddress: string;
}

export interface WatermarkConfig {
  opacity: number;
  fontSize: number;
  rotation: number;
  spacing: number;
}

const generateAnonymousUserId = (): string => {
  if (typeof window === 'undefined') return 'GUEST';
  
  const stored = localStorage.getItem('divine_tarot_user_id');
  if (stored) return stored.slice(0, 8).toUpperCase();
  
  const newId = Math.random().toString(36).substr(2, 8).toUpperCase();
  localStorage.setItem('divine_tarot_user_id', newId);
  return newId;
};

export const useWatermarkData = (): WatermarkData => {
  const [ipAddress, setIpAddress] = useState('103.xxx.xxx.xxx');

  useEffect(() => {
    const fetchIp = async () => {
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        if (response.ok) {
          const data = await response.json();
          const parts = data.ip.split('.');
          if (parts.length === 4) {
            setIpAddress(`${parts[0]}.${parts[1]}.xxx.xxx`);
          }
        }
      } catch {
        const parts = ['103', Math.floor(Math.random() * 255), 'xxx', 'xxx'];
        setIpAddress(`${parts[0]}.${parts[1]}.xxx.xxx`);
      }
    };

    fetchIp();
  }, []);

  const userId = typeof window !== 'undefined' ? generateAnonymousUserId() : 'GUEST';

  return { userId: `USER_${userId}`, ipAddress };
};

export const getWatermarkText = (data: WatermarkData): string => {
  return `The Divine Tarot • ${data.userId} • ${data.ipAddress}`;
};

export const useResponsiveConfig = (): WatermarkConfig => {
  const [config, setConfig] = useState<WatermarkConfig>({
    opacity: 0.12,
    fontSize: 14,
    rotation: -25,
    spacing: 200,
  });

  useEffect(() => {
    const updateConfig = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setConfig({
          opacity: 0.15,
          fontSize: 10,
          rotation: -25,
          spacing: 150,
        });
      } else if (width < 1024) {
        setConfig({
          opacity: 0.12,
          fontSize: 12,
          rotation: -25,
          spacing: 180,
        });
      } else {
        setConfig({
          opacity: 0.12,
          fontSize: 14,
          rotation: -25,
          spacing: 200,
        });
      }
    };

    updateConfig();
    window.addEventListener('resize', updateConfig);
    return () => window.removeEventListener('resize', updateConfig);
  }, []);

  return config;
};

export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};