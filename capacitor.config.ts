import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.hubertsocity.hubertapp',
  appName: 'hubertapp',
  webDir: 'dist',

  server: {
    androidScheme: 'https',
  },
 
  android: {
    allowMixedContent: true,
  },
};

export default config;
