<template>
 <!-- <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <v-img
          :src="require('../assets/logo.svg')"
          class="my-3"
          contain
          height="200"
        />
      </v-col>

      <v-col class="mb-4">
        <h1 class="display-2 font-weight-bold mb-3">
          Welcome to Vuetify
        </h1>

        <p class="subheading font-weight-regular">
          For help and collaboration with other Vuetify developers,
          <br>please join our online
          <a
            href="https://community.vuetifyjs.com"
            target="_blank"
          >Discord Community</a>
        </p>
      </v-col>

      

      <v-col
        class="mb-5"
        cols="12"
      >
        <h2 class="headline font-weight-bold mb-3">
          Ecosystem
        </h2>

        <v-row justify="center">
          <a
            v-for="(eco, i) in toDoItems"
            :key="i"
            :href="eco.href"
            class="subheading mx-3"
            target="_blank"
          >
            {{ eco.recordset }}
          </a>
        </v-row>
      </v-col>
    </v-row>
  </v-container> -->
  <div class="HelloWorld">
  <!-- 오늘 해야 할 일
  <li v-for="(toDoItem, i) in toDoItems" :key="i">
  {{toDoItem.userName}}
  </li> -->
  <v-container>
      <PatrollTables/>
    </v-container>
    
  </div>
</template>


<script>
//import axios from 'axios'
import PatrollTables from './PatrollTables';
  export default {
    name: 'HelloWorld',
     components: {
      PatrollTables,
    },

    data: () => ({

        /*return {
        toDoItems: [] // toDoItems를 빈 리스트로 초기화한다.
        }
        */
    }),
    /*
    created () {           // 초기화 함수를 정의 한다.
          axios.get('http://localhost:8001/club/user/:name') // http://localhost:5000/todo/에 get call을 한다.
            .then(response => {
              this.toDoItems = response.data     // 반환되는 값을 toDoItems에 저장한다.
//console.log(JSON.stringify(this.toDoItems));
            })
            .catch(e => {
              console.log('error : ', e)          // 에러가 나는 경우 콘솔에 에러를 출력한다
            })
        },
      */
  }
</script>
<style>
h1, h2 {
font-weight: normal;
}

ul {
list-style-type: none;
padding: 0;
}

li {
display: inline-block;
margin: 0 10px;
}

a {
color: #35495E;
}
</style>
