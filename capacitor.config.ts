import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.escolas.app.b3dev',
  appName: 'escolas_app_front_app',
  webDir: 'dist',
  server: {
    androidScheme: 'http'
  },
  plugins: {
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
  },
};

export default config;
