export default {
  defaultDir: '/Users/tiago/Desktop/B3Dev/Codigos/app_escolas/b3dev_escolas_app_front_app',
  defaultDirFilesToCopy: '/Users/tiago/Desktop/B3Dev/Codigos/___Icons - Splash - more/escolas_app',
  actions: [
    {
      type: 'replaceTextInFile',
      file: `/src/composables/variables.js`,
      textOut: 'const COMPANY_ID = 2',
      textIn: 'const COMPANY_ID = 10'
    },
    {
      type: 'replaceTextInFile',
      textOut: 'com.escolas.app.b3dev',
      textIn: 'com.escolas.app.prosaber.b3dev',
      files: [
        '/capacitor.config.ts',
        '/android/app/build.gradle',
        '/android/app/src/main/AndroidManifest.xml',
        '/android/app/src/main/java/io/ionic/starter/MainActivity.java',
        '/android/app/src/main/res/values/strings.xml',
        '/ios/App/App.xcodeproj/project.pbxproj',
      ]
    },
    {
      type: 'replaceTextInFile',
      textOut: 'EduLink',
      textIn: 'Escola Pró-Saber',
      files: [ '/src/composables/variables.js' ]
    },
    {
      type: 'replaceTextInFile',
      textOut: '>EduLink</string>',
      textIn: '>Pró-saber</string>',
      files: [
        '/android/app/src/main/res/values/strings.xml',
        '/ios/App/App/Info.plist'
      ]
    },
    {
      type: 'copyFile',
      to: '/assets/logo.png',
      fileToCopy: '/pro_saber/cordova-res/icone.png'
    },
    {
      type: 'copyFile',
      to: '/src/assets/logo_login_custom.png',
      fileToCopy: '/pro_saber/public/logo.jpeg'
    },
    {
      type: 'copyFile',
      to: '/android/app/google-services.json',
      fileToCopy: '/pro_saber/google-services/google-services.json'
    },
    {
      type: 'copyFile',
      to: '/ios/App/App/GoogleService-Info.plist',
      fileToCopy: '/pro_saber/google-services/GoogleService-Info.plist'
    },
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