export default {
  defaultDir: '/Users/tiago/Desktop/B3Dev/Codigos/app_escolas/b3dev_escolas_app_front_app',
  defaultDirFilesToCopy: '/Users/tiago/Desktop/B3Dev/Codigos/___Icons - Splash - more/bem_cuidar',
  actions: [
    // {
    //   type: 'replaceTextInFile',
    //   file: `/src/composables/variables.js`,
    //   textOut: 'const COMPANY_ID = 1',
    //   textIn: 'const COMPANY_ID = 2'
    // },
    // {
    //   type: 'replaceTextInFile',
    //   textOut: 'com.bemcuidar.b3dev.demo',
    //   textIn: 'com.bem.cuidar.b3dev',
    //   files: [
    //     '/capacitor.config.ts',
    //     '/android/app/build.gradle',
    //     '/android/app/src/main/AndroidManifest.xml',
    //     '/android/app/src/main/java/io/ionic/starter/MainActivity.java',
    //     '/android/app/src/main/res/values/strings.xml',
    //     '/ios/App/App.xcodeproj/project.pbxproj',
    //   ]
    // },
    // {
    //   type: 'replaceTextInFile',
    //   textOut: 'return "VSP"',
    //   textIn: 'return "VSP"',
    //   files: [ '/src/composables/utils.js' ]
    // },
    {
      type: 'replaceTextInFile',
      textOut: '>escolas_app_front_app</string>',
      textIn: '>EduLink</string>',
      files: [
        '/android/app/src/main/res/values/strings.xml',
        '/ios/App/App/Info.plist'
      ]
    },
    // {
    //   type: 'copyFile',
    //   to: '/assets/logo.png',
    //   fileToCopy: '/bem_cuidar/bem_cuidar/cordova-res/logo.png'
    // },
    // {
    //   type: 'copyFile',
    //   to: '/public/logo_login_custom.png',
    //   fileToCopy: '/bem_cuidar/bem_cuidar/public/logo_login_custom.png'
    // },
    // {
    //   type: 'copyFile',
    //   to: '/android/app/google-services.json',
    //   fileToCopy: '/bem_cuidar/bem_cuidar/google-services/google-services.json'
    // },
    // {
    //   type: 'copyFile',
    //   to: '/ios/App/App/GoogleService-Info.plist',
    //   fileToCopy: '/bem_cuidar/bem_cuidar/google-services/GoogleService-Info.plist'
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