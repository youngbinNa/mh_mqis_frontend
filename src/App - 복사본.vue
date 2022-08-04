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
            <v-icon
              color="indigo"
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
        <v-list-group>
            <template v-slot:activator>
            <v-list-item-title>둔포2공장</v-list-item-title>
          </template>
            <v-list-group 
              sub-group
            >
              <template v-slot:activator>
                  <v-list-item-content >
                    <v-list-item-title>순회검사</v-list-item-title>
                  </v-list-item-content>
                </template>
                <v-list-item 
                  v-for="(admin, i) in DP2.patrol"
                  :key="i"
                  :to="{path: admin[1]}"
                >
                  <!--
                  <v-list-item-icon>
                    <v-icon v-text="admin[0]"></v-icon>
                  </v-list-item-icon>
                  -->
                  <v-list-item-title v-text="admin[0]"></v-list-item-title>
                </v-list-item>
            </v-list-group> 

              <v-list-group 
              sub-group
            >
              
                <template v-slot:activator>
                  <v-list-item-content >
                    <v-list-item-title>기준정보</v-list-item-title>
                  </v-list-item-content>
                </template>
      
                <v-list-item 
                  v-for="(admin, i) in DP2.admins"
                  :key="i"
                  :to="{path: admin[1]}"
                >
                  <v-list-item-title v-text="admin[0]"></v-list-item-title>
                </v-list-item>
            </v-list-group>
        </v-list-group> <!--둔포2공장-->
        <v-list-group>
            <template v-slot:activator>
            <v-list-item-title>수원공장</v-list-item-title>
          </template>
            <v-list-group 
              sub-group
            >
              <template v-slot:activator>
                  <v-list-item-content >
                    <v-list-item-title>순회검사</v-list-item-title>
                  </v-list-item-content>
                </template>
                <v-list-item 
                  v-for="(admin, i) in SW.patrol"
                  :key="i"
                  :href="$router.resolve({path: admin[1]}).href"
                >
                  <!--
                  <v-list-item-icon>
                    <v-icon v-text="admin[0]"></v-icon>
                  </v-list-item-icon>
                  -->
                  <v-list-item-title v-text="admin[0]"></v-list-item-title>
                </v-list-item>
            </v-list-group> 

              <v-list-group 
              sub-group
            >
              
                <template v-slot:activator>
                  <v-list-item-content >
                    <v-list-item-title>기준정보</v-list-item-title>
                  </v-list-item-content>
                </template>
      
                <v-list-item 
                  v-for="(admin, i) in SW.admins"
                  :key="i"
                  :to="{path: admin[1]}"
                >
                  <v-list-item-title v-text="admin[0]"></v-list-item-title>
                </v-list-item>
            </v-list-group>
        </v-list-group> <!--둔포2공장-->
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
// import HelloWorld from './components/HelloWorld';

  export default {
    title: 'Home Page - Example App',
    props: {
      source: String,
    },
    components: {
    // HelloWorld,
    },
    data() {
      return{
        dialog: false,
        drawer: null,
        DP2: {
          admins: [
            ['· 라인 마스터', '/admin/line' ],
            ['· 계정 관리', '/admin/manageuser' ],
            ['· 권한 관리', '/admin/manageauth' ],
            ['· 검사기준 관리', '/admin/manageitem'],
          ],
          patrol: [
            ['· 조회/입력', '/inspection/tl' ],
            ['· 조회/수정' , '/inspection/edit'],
          ],
        },
        SW: {
          admins: [
            ['· 라인 마스터', '/sw/admin/line' ],
            ['· 계정 관리', '/sw/admin/manageuser' ],
            ['· 권한 관리', '/sw/admin/manageauth' ],
            ['· 검사기준 관리', '/sw/admin/manageitem/stp1'],
          ],
          patrol: [
            ['· 조회/입력', '/sw/inspection/tl' ],
            ['· 대시보드', '/sw/dashboard' ],
          ],
        },
      }
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
</style>