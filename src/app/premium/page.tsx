'use client';

import { motion } from 'framer-motion';
import { Check, Sparkles, Zap, Star } from 'lucide-react';
import Link from 'next/link';
import { SUBSCRIPTION_PLANS, type PlanType } from '@/lib/payments/plans';
import Button from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';