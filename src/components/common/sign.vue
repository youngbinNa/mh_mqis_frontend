<template>
  <div id="app">
 <v-main>
        <v-row
            align="center"
            justify="center"
          >
            <v-col
              cols="12"
              sm="8"
              md="4"
            >
              <v-card class="elevation-0">
                <div style="text-align:center">
                <img src="../../assets/logo_big.png" alt="명화공업" /></div>
                <v-card-text>
                  <v-form>
                    <v-select
                          v-model="form.selected"
                          :items="options"
                          item-text="name" 
                          item-value="value"
                          label="여기를 클릭해 계정 유형을 선택하세요."
                          return-object
                        >
                    </v-select>
                    <v-text-field
                      label="아이디"
                      v-model="form.id"
                      name="login"
                      prepend-icon="mdi-account"
                      type="text"
                    ></v-text-field>
  
                    <v-text-field
                      id="password"
                      :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                      @click:append="show1 = !show1"
                      v-model="form.pwd"
                      label="비밀번호"
                      name="password"
                      prepend-icon="mdi-lock"
                      :type="show1 ? 'text' : 'password'"
                      @keyup.up.enter="signIn" 
                    ></v-text-field>
                  </v-form>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn block color="primary" @click="signIn">로그인</v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
 </v-main>
</div>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      form: {
        id: '',
        pwd: '',
        selected:'',
      },
      show1: false,
      options : [ {name:'관리직(그룹웨어 계정)', value:0},{name:'검사원',value:1}  ], 
      user_seq:'',
    }
  },
  methods: {
    signIn () {
      axios.post(`${this.$D2ApiPath}/api/sign/in`, this.form)
        .then(r => {
          if (!r.data.success) return alert(r.data.msg)
          //console.log(r.data)
          
          if(r.data.user.USER_SEQ > 0) {
            localStorage.setItem('token', r.data.token)
            localStorage.setItem('user', r.data.user)
            localStorage.setItem('userseq', r.data.user.USER_SEQ)
            localStorage.setItem('type', r.data.user.login_option)
            localStorage.setItem('isAdmin', r.data.user.isAdmin)
            this.$store.commit('getToken', r.data.user)
            this.$store.commit('getTokenisAdmin', r.data.user.isAdmin)
            this.$store.commit('getTokenlogintype', r.data.user.login_option)
            this.$store.commit('getTokenUserSeq', r.data.user.USER_SEQ)
            //this.$router.push({path: '/mymenu', query:{user_seq: r.data.user.USER_SEQ}});
            this.$router.push('/')
            .catch(error => {
              console.info(error.message)
            })
          } else {
            return alert(r.data.msg)
          }
        })
        .catch(e => console.error(e.message))
    },
   
  }
}
</script>