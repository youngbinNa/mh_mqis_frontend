<template>
  <v-app id="inspire">
    <v-system-bar window
      :clipped-left="$vuetify.breakpoint.lgAndUp"
      app
      color="#3a474d"
      dark
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title
        style="width: 100%"
        class="ml-0 pl-4"
      >
        <span>순회검사 {{ $route.name }}</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items v-if="$store.state.token">
        <v-menu bottom left offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                dark
                icon
                v-bind="attrs"
                v-on="on"
              >
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>

          <v-list>
            <!--
              <v-list-item v-if="!$store.state.token" @click="$router.push('/')">
                <v-list-item-title>로그인</v-list-item-title>
              </v-list-item>
              -->
              <v-list-item  @click="signOut">
                <v-list-item-title>로그아웃</v-list-item-title>
              </v-list-item>
          </v-list>
        </v-menu>
      </v-toolbar-items>
    </v-system-bar>
    <!--
    <v-navigation-drawer v-if="$store.state.token"
      v-model="drawer"
      :clipped="$vuetify.breakpoint.lgAndUp"
      app
      width="200px"
    >-->
    <v-navigation-drawer v-if="$store.state.token"
      v-model="drawer"
      app
      width="200px">
      <v-list >
        <v-list-item>
          <v-list-item-avatar>
            <v-icon x-large
              color="info"
            >mdi-account-circle</v-icon>
          </v-list-item-avatar>
  
          <v-list-item-content>
            <v-list-item-subtitle>{{$store.state.user.corp_name}}</v-list-item-subtitle>
            <v-list-item-subtitle>{{$store.state.user.place_name}}</v-list-item-subtitle>
            <v-list-item-subtitle>{{$store.state.user.organ_name}}</v-list-item-subtitle>
            <v-list-item-title>{{$store.state.user.kname}} 님</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-divider></v-divider>
        <v-list-item :to="{path: homeitems.real_path}">
          <v-list-item-title v-text="homeitems.name"></v-list-item-title>
        </v-list-item>
        <menutree  ></menutree>
      </v-list>
    </v-navigation-drawer>
    
    <VMain>
      <!-- <HelloWorld/> -->
      <router-view :key="$route.fullPath"/>
    </VMain>
      <!-- <v-container fluid>
        <v-fade-transition mode="out-in">
          <router-view></router-view>
        </v-fade-transition>
      </v-container> -->
  </v-app>
</template>
<script>
//import axios from 'axios'
import MenuTreeView from './components/menu/TreeView';
// import HelloWorld from './components/HelloWorld';

  export default {
    title: 'Home Page - Example App',
    props: {
      source: String,
    },
    components: {
      menutree: MenuTreeView,
    },
    data() {
      return{
        dialog: false,
        drawer: null,
        tableItems: {
            둔포2공장: {
              기준정보: [
                ['· 라인 마스터', '/admin/line' ],
                ['· 계정 관리', '/admin/manageuser' ],
                ['· 권한 관리', '/admin/manageauth' ],
                ['· 검사기준 관리', '/admin/manageitem'],
              ],
              순회검사: [
                ['· 조회/입력', '/inspection/tl' ],
                ['· 조회/수정' , '/inspection/edit'],
              ],
            },
            수원: {
              기준정보: [
                ['· 라인 마스터', '/sw/admin/line' ],
                ['· 계정 관리', '/sw/admin/manageuser' ],
                ['· 권한 관리', '/sw/admin/manageauth' ],
                ['· 검사기준 관리', '/sw/admin/manageitem/stp1'],
              ],
              순회검사: [
                ['· 조회/입력', '/sw/inspection/tl' ],
                ['· 대시보드', '/sw/dashboard' ],
              ],
            },
        },
        /*
        items: [
            {
              "id": 1,
              name: '수원',
              children: [
                {
                  id: 2,
                  name: '순회검사',
                  children: [
                    { id: 7, name: '· 조회/입력', to: '/sw/inspection/tl' },
                    { id: 8, name: '· 대시보드', to: '/sw/dashboard' },
                  ],
                },
                {
                  id: 3,
                  name: '기준정보',
                  children: [
                    { id: 4, name: '· 조회/입력', to: '/inspection/tl' },
                    { id: 5, name: '· 대시보드', to: '/sw/dashboard' },
                  ],
                },
              ],
            },
            {
              id: 2,
              name: '둔포2',
              children: [
                {
                  id: 2,
                  name: '순회검사', to: null,
                  children: [
                    { id: 7, name: '· 조회/입력', to: '/sw/inspection/tl' },
                    { id: 8, name: '· 대시보드', to: '/sw/dashboard' },
                  ],
                },
                {
                  id: 3,
                  name: '기준정보',
                  children: [
                    { id: 4, name: '· 조회/입력', to: '/inspection/tl' },
                    { id: 5, name: '· 대시보드', to: '/sw/dashboard' },
                  ],
                },
              ],
            },
        ],*/
       // items:[{ id: 999999, name: '홈', real_path: '/home' }],
       homeitems:{ id: 999999, name: 'HOME', real_path: '/home' },
      }
    },
    created(){
    },
    methods: {
      signOut () {
        //localStorage.removeItem('token')
        this.$store.commit('delToken')
        this.$router.push('/login')
        
      },
    },
    /*
    computed: {
      menu_show() {
        if(this.$store.state.user.login_option > 0){ //검사원 계정
          return check_place
        }
        else{
          return true
        }
      },
      check_place() {
        if(this.$store.state.user.place_name == 21){
          return dp2
        }
        else{
          return false
        }
      },
      check_type(){
        if(this.$store.state.user.login_option > 0){ //검사원 계정
          return check_place
        }
        else{
          return true
        }
      }
    }
    */
  }
</script>
<style lang="scss">
.v-list-item__title {
    align-self: center;
    font-size: 0.9rem;
}
$list-group-sub-group-header-margin:(
  'padding-left' :32px
);
.v-list .v-list-item--active {
    background-color: white;
}
</style>