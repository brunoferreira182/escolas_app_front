export default {
  defaultDir: '/Users/tiago/Desktop/B3Dev/Codigos/escolas_app/b3dev_escolas_app_front_app',
  defaultDirFilesToCopy: '/Users/tiago/Desktop/B3Dev/Codigos/___Icons - Splash - more/escolas_app',
  actions: [
    // {
    //   type: 'replaceTextInFile',
    //   textOut: 'com.escolas.app.b3dev',
    //   textIn: 'com.escolas.app.prosaber.b3dev',
    //   files: [
    //     '/capacitor.config.ts',
    //     '/android/app/build.gradle',
    //     '/android/app/src/main/AndroidManifest.xml',
    //     '/android/app/src/main/java/io/ionic/starter/MainActivity.java',
    //     '/android/app/src/main/res/values/strings.xml',
    //     '/ios/App/App.xcodeproj/project.pbxproj',
    //   ]
    // },
    {
      type: 'copyFile',
      to: '/assets/logo.png',
      fileToCopy: '/escolas_app/cordova-res/icone.png'
    },
    {
      type: 'copyFile',
      to: '/src/assets/logo_login_custom.png',
      fileToCopy: '/escolas_app/public/icone.png'
    },
    {
      type: 'copyFile',
      to: '/android/app/google-services.json',
      fileToCopy: '/escolas_app/google-services/google-services.json'
    },
    {
      type: 'copyFile',
      to: '/ios/App/App/GoogleService-Info.plist',
      fileToCopy: '/escolas_app/google-services/GoogleService-Info.plist'
    },
    // {
    //   type: 'copyFile',
    //   to: '/src/theme/variablesCustom.css',
    //   fileToCopy: '/escolas_app/theme/variablesCustom.css'
    // },
    {
      type: 'runCommand',
      commandToRun: "npx @capacitor/assets generate --iconBackgroundColor '#ffffff' --iconBackgroundColorDark '#222222' --splashBackgroundColor '#212529' --splashBackgroundColorDark '#212529'"
    },
    {
      type: 'runCommand',
      commandToRun: 'ionic cap sync'
    },
  ]
}