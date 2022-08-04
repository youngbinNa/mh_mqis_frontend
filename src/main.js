import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import router from './router';
import store from './store';
import vuetifytb from '@lzhoucs/vuetify'

var agent = window.navigator.userAgent.toLowerCase(); 
var appName = window.navigator.appName.toLowerCase(); 
if((appName === 'netscape' && agent.indexOf('trident')!== -1) || agent.indexOf('msie') !== -1) { 
  if(confirm("현재 페이지는 익스플로러(IE)를 지원하지 않습니다.\n" + "크롬 혹은 엣지브라우저에서 정상적으로 작동됩니다.\n해당 브라우저로 이동하시겠습니까?")) 
  { window.location = "microsoft-edge:" + window.location.href; } 
}

Vue.config.productionTip = false

new Vue({
  vuetifytb,
  vuetify,
  router,
  store,
  render: h => h(App)
}).$mount('#app')