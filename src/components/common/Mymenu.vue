<template>
  <div id="app">
 
</div>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      user_seq:'',
    }
  },
  created() {
    //console.log(this.$route.query.user_seq)
      var user= {
          user_seq: this.$route.query.user_seq,
      };
      axios.post(`${this.$D2ApiPath}/api/sign/mymenu`,user)
        .then(r => {
            //localStorage.setItem('token', r.data.token)
            localStorage.setItem('menu',JSON.stringify(r.data.menu))
            this.$store.commit('getTokenMenu', r.data.menu)
            //console.log(r.data.menu)
            this.$router.push('/')
            .catch(error => {
              console.info(error.message)
            })
        })
        .catch(e => console.error(e.message))

/*
      var auth= {
          place_seq: 1,
          menu_seq: 5,
      };
      axios.post(`${this.$D2ApiPath}/api/sign/page`,auth)
        .then(r => {
            console.log(r.data)
            .catch(error => {
              console.info(error.message)
            })
        })
        */
    },
   
}
</script>