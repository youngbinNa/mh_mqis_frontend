<template>
  <div id="app">
 
</div>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
    }
  },
  created() {
    if(!this.$route.query.place){
      axios.post(`${this.$D2ApiPath}/api/sign/autoin`, this.$route.query)
        .then(r => {
          
          if(r.data.success) {
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
            this.$store.commit('delToken')
            this.$router.push('/login')
            alert(r.data.msg)
          }
        })
        .catch(e => console.error(e.message))
    }
    else{
      axios.post(`${this.$D2ApiPath}/api/sign/autoin`, this.$route.query)
        .then(r => {
          
          if(r.data.success) {
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
            this.$router.push('/SW/approval/wait') 
            .catch(error => {
              console.info(error.message)
            })
          } else {
            this.$store.commit('delToken')
            this.$router.push('/login')
            alert(r.data.msg)
          }
        })
        .catch(e => console.error(e.message))
    }
  },
   
}
</script>