import Vue from 'vue';
import VueRouter from 'vue-router'
import axios from 'axios'

Vue.use(VueRouter)

const SuwonApiPath = 'http://1.214.194.148:4000'
Vue.prototype.$SuwonApiPath = SuwonApiPath

const D2ApiPath = 'http://211.105.215.172:4000'
Vue.prototype.$D2ApiPath = D2ApiPath

const D1ApiPath = 'http://175.204.111.5:4000'
Vue.prototype.$D1ApiPath = D1ApiPath

// let component3 = {
//   template:'<div class="title">Page 3</div>'
// }
/*
const pageCheck =(ps,ms) => (to, from, next) => {
  // return next()
    //var array =[]
    //if (!localStorage.getItem('token')) return next('/block')
    //else{
      console.log(ps,ms)
      //var menuArray=[];
      var json_data =  JSON.parse(JSON.stringify(localStorage.getItem('menu')))
      Object.values(json_data).some(json_data => {
        if(json_data.pplace_seq==ps && json_data.menu_seq == ms) console.log(json_data.pplace_seq)
        else console.log(json_data.pplace_seq)
      });
      next()
      console.log(json_data)
      /*for(var i in json_data){
         menuArray.push([i, json_data [i]]);
      }*/

      //console.log(to+from+next)
   // }
//}

const pageCheck =(ps,ms) => (to, from, next) => {
      var auth= {
        user_seq: localStorage.getItem('userseq'),
        place_seq: ps,
        menu_seq: ms,
        login_option: localStorage.getItem('type'),
      };
      const token = localStorage.getItem('token')
      if (!token) {alert("세션 허용 시간이 만료되었습니다. 다시 로그인해주세요."); return next('/block')}
      axios.post(`http://211.105.215.172:4000/api/sign/page`,auth, { headers: { Authorization: token } })
      .then(r => {
          if(r.data.auth){
            console.log(r.data.auth)
            return next()
          }
          else{
            console.log(r.data.auth)
            return next('/noauth')
          }
      })
      .catch(error => {
        console.info(error.message)
      })
}

const scrollBehavior = function (to, from, savedPosition) {
  if (savedPosition) {
    // savedPosition is only available for popstate navigations.
    return savedPosition
  } else {
    const position = {}

    // scroll to anchor by returning the selector
    if (to.hash) {
      position.selector = to.hash

      // specify offset of the element
      if (to.hash === '#anchor2') {
        position.offset = { y: 100 }
      }

      // bypass #1number check
      if (/^#\d/.test(to.hash) || document.querySelector(to.hash)) {
        return position
      }

      // if the returned position is falsy or an empty object,
      // will retain current scroll position.
      return false
    }

    return new Promise(resolve => {
      // check if any matched route config has meta that requires scrolling to top
      if (to.matched.some(m => m.meta.scrollToTop)) {
        // coords will be used if no selector is provided,
        // or if the selector didn't match any element.
        position.x = 0
        position.y = 0
      }

      // wait for the out transition to complete (if necessary)
      this.app.$root.$once('triggerScroll', () => {
        // if the resolved position is falsy or an empty object,
        // will retain current scroll position.
        resolve(position)
      })
    })
  }
}

export default new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    scrollBehavior,
    routes: [
      {
        path: '/',
        name: '인덱스',
        //component: () => import('./components/sign.vue'),
        beforeEnter: (to, from, next) => {
          if (!localStorage.getItem('token')) return next('/login')
          else next('/home')
        }
      },
      {
        path: '/autologin',
        name: 'SSO로그인',
        component: () => import('./components/common/autoSign.vue'),
      },
      {
        path: '/login',
        name: '로그인',
        component: () => import('./components/common/sign.vue'),
      },
      {
        path: '/mymenu',
        name: '메뉴',
        component: () => import('./components/common/Mymenu.vue'),
      },
      {
        path: '/home',
        name: 'HOME',
        component: () => import('./components/common/DashBoard/HomeDashBoard.vue'),
        //component: () => import('./components/home.vue'),
        beforeEnter: (to, from, next) => {
          if (!localStorage.getItem('token')) return next('/block')
          next()
        }
      },
      {
        path: '/tree',
        name: 'tree',
        component: () => import('./components/menu/TreeView.vue'),
      },
      {
        path: '/admin/manageuser',
        name: '검사원 계정',
        component: () => import('./components/admin/usermanage/usermanage.vue'),
        beforeEnter: pageCheck(4,12),
      },
      {
        path: '/admin/manageauth',
        name: '관리직 계정',
        component: () => import('./components/admin/authmanage/authmanage2.vue'),
        beforeEnter: pageCheck(4,2),
      },
      {
        path: '/testjwt',
        name: 'testjwt',
        component: () => import('./components/testcustomvuetify.vue')
      },
      {
        path: '/SW/inspection/tl',
        name: '조회/입력(수원)',
        params: 'swtl',
        component: () => import('./components/suwon/inspection/TargetLineFilter.vue'),
        beforeEnter: pageCheck(3,4),
      },
      {
        path: '/DP2/inspection/tl',
        name: '조회/입력(둔포2)',
        params: 'swtl',
        component: () => import('./components/doonpo2/inspection/TargetLineFilter.vue'),
        beforeEnter: pageCheck(1,4),
      },
      {
        path: '/DP1/inspection/tl',
        name: '조회/입력(둔포1)',
        params: 'swtl',
        component: () => import('./components/doonpo1/inspection/TargetLineFilter.vue'),
        beforeEnter: pageCheck(2,4),
      },
      {
        path: '/SW/dashboard',
        name: '대시보드(수원)',
        params: 'swtl',
        component: () => import('./components/suwon/inspection/DashBoardSuwon.vue'),
        beforeEnter: pageCheck(3,5),
      },
      {
        path: '/DP2/dashboard',
        name: '대시보드(둔포2)',
        params: 'swtl',
        component: () => import('./components/doonpo2/inspection/DashBoardSuwon.vue'),
        beforeEnter: pageCheck(1,5),
      },
      {
        path: '/DP1/dashboard',
        name: '대시보드(둔포1)',
        component: () => import('./components/doonpo1/inspection/DashBoardSuwon.vue'),
        beforeEnter: pageCheck(2,5),
      },
      {
        path: '/SW/dashboard/detail1',
        name: '대시보드3(수원)',
        params: 'swtl',
        component: () => import('./components/suwon/inspection/Dashboard/Suwon_Detail_1.vue'),
        beforeEnter: (to, from, next) => {
          if (!localStorage.getItem('token')) return next('/block')
          next()
        }
      },
      {
        path: '/SW/inspection/tl/ts',
        name: '공정조회(수원)',
        props: true,
        component: () => import('./components/suwon/inspection/TargetSPC.vue'),
        beforeEnter: pageCheck(3,4),
      },
      {
        path: '/DP2/inspection/tl/ts',
        name: '공정조회(둔포2)',
        props: true,
        component: () => import('./components/doonpo2/inspection/TargetSPC.vue'),
        beforeEnter: pageCheck(1,4),
      },
      {
        path: '/DP1/inspection/tl/ts',
        name: '공정조회(둔포1)',
        props: true,
        component: () => import('./components/doonpo1/inspection/TargetSPC.vue'),
        beforeEnter: pageCheck(2,4),
      },
      {
        path: '/SW/inspection/tl/ts/week',
        name: '공정조회 주 단위(수원)',
        props: true,
        component: () => import('./components/suwon/inspection/TargetSPCWeek.vue'),
        beforeEnter: pageCheck(3,4),
      },
      {
        path: '/DP2/inspection/tl/ts/week',
        name: '공정조회 주 단위(둔포2)',
        props: true,
        component: () => import('./components/doonpo2/inspection/TargetSPCWeek.vue'),
        beforeEnter: pageCheck(1,4),
      },
      {
        path: '/DP1/inspection/tl/ts/week',
        name: '공정조회 주 단위(둔포1)',
        props: true,
        component: () => import('./components/doonpo1/inspection/TargetSPCWeek.vue'),
        beforeEnter: pageCheck(2,4),
      },
      {
        path: '/SW/inspection/tl/ts/do',
        name: '결과입력(수원)',
        props: true,
        component: () => import('./components/suwon/inspection/detail/PatrolDo_Modal.vue'),
        beforeEnter: pageCheck(3,4),
      },
      {
        path: '/DP2/inspection/tl/ts/do',
        name: '결과입력(둔포2)',
        props: true,
        component: () => import('./components/doonpo2/inspection/detail/PatrolDo_Modal.vue'),
        beforeEnter: pageCheck(1,4),
      },
      {
        path: '/DP1/inspection/tl/ts/do',
        name: '결과입력(둔포1)',
        props: true,
        component: () => import('./components/doonpo1/inspection/detail/PatrolDo_Modal.vue'),
        beforeEnter: pageCheck(2,4),
      },
      {
        path: '/SW/inspection/tl/ts/do/week',
        name: '결과입력 주 단위(수원)',
        props: true,
        component: () => import('./components/suwon/inspection/detail/PatrolDoWeek_Modal.vue'),
        beforeEnter: pageCheck(3,4),
      },
      {
        path: '/DP2/inspection/tl/ts/do/week',
        name: '결과입력 주 단위(둔포2)',
        props: true,
        component: () => import('./components/doonpo2/inspection/detail/PatrolDoWeek_Modal.vue'),
        beforeEnter: pageCheck(1,4),
      },
      {
        path: '/DP1/inspection/tl/ts/do/week',
        name: '결과입력 주 단위(둔포1)',
        props: true,
        component: () => import('./components/doonpo1/inspection/detail/PatrolDoWeek_Modal.vue'),
        beforeEnter: pageCheck(2,4),
      },
      {
        path: '/SW/admin/line',
        name: '라인마스터(수원)',
        component: () => import('./components/suwon/manage/LineMaster.vue'),
        beforeEnter: pageCheck(3,7),
      },
      {
        path: '/DP2/admin/line',
        name: '라인마스터(둔포2)',
        component: () => import('./components/doonpo2/manage/LineMaster.vue'),
        beforeEnter: pageCheck(1,7),
      },
      {
        path: '/DP1/admin/line',
        name: '라인마스터(둔포1)',
        component: () => import('./components/doonpo1/manage/LineMaster.vue'),
        beforeEnter: pageCheck(2,7),
      },
      {
        path: '/SW/admin/manageitem/stp1',
        name: '검사기준 관리 step1',
        component: () => import('./components/suwon/manage/inspitems/itemmanage_step1.vue'),
        beforeEnter: pageCheck(3,8),
      },
      {
        path: '/DP2/admin/manageitem/stp1',
        name: '검사기준 관리 step1',
        component: () => import('./components/doonpo2/manage/inspitems/itemmanage_step1.vue'),
        beforeEnter: pageCheck(1,8),
      },
      {
        path: '/DP1/admin/manageitem/stp1',
        name: '검사기준 관리 step1',
        component: () => import('./components/doonpo1/manage/inspitems/itemmanage_step1.vue'),
        beforeEnter: pageCheck(2,8),
      },
      {
        path: '/SW/admin/manageitem/stp2',
        name: '검사기준 관리 step2',
        component: () => import('./components/suwon/manage/inspitems/itemmanage_step2.vue'),
        beforeEnter: pageCheck(3,8),
      },
      {
        path: '/DP2/admin/manageitem/stp2',
        name: '검사기준 관리 step2',
        component: () => import('./components/doonpo2/manage/inspitems/itemmanage_step2.vue'),
        beforeEnter: pageCheck(1,8),
      },
      {
        path: '/DP1/admin/manageitem/stp2',
        name: '검사기준 관리 step2',
        component: () => import('./components/doonpo1/manage/inspitems/itemmanage_step2.vue'),
        beforeEnter: pageCheck(2,8),
      },
      {
        path: '/SW/approval/wait',
        name: '결재대기(수원)',
        props: true,
        component: () => import('./components/suwon/approval/approval_wait.vue'),
        beforeEnter: pageCheck(3,11),
      },
      {
        path: '/DP2/approval/wait',
        name: '결재대기(둔포2)',
        props: true,
        component: () => import('./components/doonpo2/approval/approval_wait.vue'),
        beforeEnter: pageCheck(1,11),
      },
      {
        path: '/DP1/approval/wait',
        name: '결재대기(둔포1)',
        props: true,
        component: () => import('./components/doonpo1/approval/approval_wait.vue'),
        beforeEnter: pageCheck(2,11),
      },
      {
        path: '/SW/approval/doc',
        name: '결재(수원)',
        props: true,
        component: () => import('./components/suwon/approval/approval_doc.vue'),
        beforeEnter: pageCheck(3,11),
      },
      {
        path: '/DP2/approval/doc',
        name: '결재(둔포2)',
        props: true,
        component: () => import('./components/doonpo2/approval/approval_doc.vue'),
        beforeEnter: pageCheck(1,11),
      },
      {
        path: '/DP1/approval/doc',
        name: '결재(둔포1)',
        props: true,
        component: () => import('./components/doonpo1/approval/approval_doc.vue'),
        beforeEnter: pageCheck(2,11),
      },
      {
        path: '/SW/approval/doc/detail',
        name: '결재(수원)',
        props: true,
        component: () => import('./components/suwon/approval/approval_doc_detail.vue'),
        beforeEnter: pageCheck(3,11),
      },
      {
        path: '/DP2/approval/doc/detail',
        name: '결재(둔포2)',
        props: true,
        component: () => import('./components/doonpo2/approval/approval_doc_detail.vue'),
        beforeEnter: pageCheck(1,11),
      },
      {
        path: '/DP1/approval/doc/detail',
        name: '결재(둔포1)',
        props: true,
        component: () => import('./components/doonpo1/approval/approval_doc_detail.vue'),
        beforeEnter: pageCheck(2,11),
      },
      {
        path: '/SW/approval/done',
        name: '결재완료(수원)',
        props: true,
        component: () => import('./components/suwon/approval/approval_done.vue'),
        beforeEnter: pageCheck(3,11),
      },
      {
        path: '/DP2/approval/done',
        name: '결재완료(둔포2)',
        props: true,
        component: () => import('./components/doonpo2/approval/approval_done.vue'),
        beforeEnter: pageCheck(1,11),
      },
      {
        path: '/DP1/approval/done',
        name: '결재완료(둔포1)',
        props: true,
        component: () => import('./components/doonpo1/approval/approval_done.vue'),
        beforeEnter: pageCheck(2,11),
      },
      {
        path: '/SW/approval/doc_done',
        name: '결재(수원)',
        props: true,
        component: () => import('./components/suwon/approval/approval_doc_done.vue'),
        beforeEnter: pageCheck(3,11),
      },
      {
        path: '/DP2/approval/doc_done',
        name: '결재(둔포2)',
        props: true,
        component: () => import('./components/doonpo2/approval/approval_doc_done.vue'),
        beforeEnter: pageCheck(1,11),
      },
      {
        path: '/DP1/approval/doc_done',
        name: '결재(둔포1)',
        props: true,
        component: () => import('./components/doonpo1/approval/approval_doc_done.vue'),
        beforeEnter: pageCheck(2,11),
      },
      {
        path: '/block',
        name: '',
        component: () => import('./components/block.vue')
      },
      {
        path: '/noauth',
        name: '',
        component: () => import('./components/NoAuth.vue')
      },
    ],
  })
