import { createApp } from 'vue'
import App from './App.vue'
import router from './router';
import { createPinia } from 'pinia'

import { IonicVue } from '@ionic/vue';

/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';

/* Theme variables */
import './theme/variables.css';

///////////// FONT AWESOME //////////////////
/* Set up using Vue 3 */
/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'
/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
/* import specific icons */
import { 
  faSyringe, 
  faHeartPulse, 
  faDollarSign,
  faBarcode, 
  faHouse, 
  faBandage,
  faCartShopping, 
  faMessage, 
  faMap,
  faCircleNodes, 
  faHandHoldingDollar, 
  faUsers, 
  faCalendar, 
  faHand,
  faFile,
  faHeadphones, 
  faThumbsUp, 
  faBullhorn, 
  faChildReaching,
  faRepeat,
  faTags,
  faArrowRightFromBracket,
  faCreditCard
} from '@fortawesome/free-solid-svg-icons'
import { faHeart,faCompass, faStar,faPaperPlane  } from '@fortawesome/free-regular-svg-icons'
import { faPix } from '@fortawesome/free-brands-svg-icons'
/* add icons to the library */
library.add(
  faBarcode, 
  faHeart, 
  faHouse, 
  faDollarSign,
  faHeartPulse, 
  faCreditCard,
  faFile,
  faSyringe, 
  faPix, 
  faCartShopping, 
  faBandage,
  faMessage, 
  faMap, 
  faCircleNodes, 
  faHandHoldingDollar, 
  faUsers, faCalendar,
  faHand, faHeadphones, faThumbsUp, faBullhorn, faChildReaching,
  faRepeat,faCompass,faTags,faStar,faPaperPlane,faArrowRightFromBracket
)
///////////// FONT AWESOME //////////////////

const pinia = createPinia()

const app = createApp(App)
  .use(IonicVue)
  .use(router)
  .component('font-awesome-icon', FontAwesomeIcon)
  // .component('pinch-zoom', PinchZoom);
  
router.isReady().then(() => {
  app.mount('#app');
});