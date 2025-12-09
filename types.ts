import React from 'react';

export enum Page {
  HOME = 'home',
  FEATURES = 'features',
  RECRUITMENT = 'recruitment',
  PRICING = 'pricing',
  CONTACT = 'contact',
  DEMO = 'demo'
}

export interface NavItem {
  label: string;
  page: Page;
}

export interface PricingTier {
  name: string;
  price: string;
  features: string[];
  recommended?: boolean;
}

export interface KPICardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: React.ReactNode;
}