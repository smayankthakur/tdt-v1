// Security configuration for Devine Tarot
// Toggle features based on environment

// Security is ONLY enabled in production
// This allows free development and debugging

export const isProduction = process.env.NODE_ENV === 'production';

export const securityConfig = {
  // Disable right-click context menu
  blockContextMenu: isProduction,
  
  // Block DevTools and keyboard shortcuts
  blockDevTools: isProduction,
  
  // Block screenshot/print screen
  blockScreenshots: isProduction,
  
  // Block text selection
  blockTextSelection: isProduction,
  
  // Show watermark
  showWatermark: isProduction,
};

export type SecurityConfig = typeof securityConfig;

export function shouldBlockContextMenu(): boolean {
  return securityConfig.blockContextMenu;
}

export function shouldBlockDevTools(): boolean {
  return securityConfig.blockDevTools;
}

export function shouldBlockScreenshots(): boolean {
  return securityConfig.blockScreenshots;
}

export function shouldBlockTextSelection(): boolean {
  return securityConfig.blockTextSelection;
}

export function shouldShowWatermark(): boolean {
  return securityConfig.showWatermark;
}
