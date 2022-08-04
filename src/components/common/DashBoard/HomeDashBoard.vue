<template>
  <div id="app">
    <v-app id="inspire" >
      <v-container fluid>
        <v-row dense>
          <v-col >
            <v-select
              v-model="select" :items="items" item-text="name" 
                          item-value="value"
                          return-object label="사업장" autofocus color="error" dense hideDetails
            ></v-select>
          </v-col>
        </v-row>
        <v-row dense>
          <v-col>
            <suwondetail1 :workplace="select.value" v-bind="select"></suwondetail1>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-card class="pa-0 ma-0 justify-center" outlined elevation="2">
                 <suwondetail3 :workplace="select.value" ></suwondetail3>
            </v-card>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-card class="pa-0 ma-0 justify-center" outlined elevation="2">
                 <suwondetail4 :workplace="select.value" ></suwondetail4>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-app>
  </div>
</template>

<script>
//import VueApexCharts from 'vue-apexcharts'
import SuwonDetail1 from './Suwon_Detail_1';
import SuwonDetail3 from './Suwon_Detail_3';
import SuwonDetail4 from './Suwon_Detail_4';

  export default {
    name: 'DashBoardSuwon',
    components: {
      suwondetail1: SuwonDetail1,
      suwondetail3: SuwonDetail3,
      suwondetail4: SuwonDetail4,
    },
   data () {
      return {
        select: {name:'', value:''},
        items:[ {name:'수원', value:`${this.$SuwonApiPath}`}, {name:'둔포1', value:`${this.$D1ApiPath}` }, {name:'둔포2', value:`${this.$D2ApiPath}` }  ], 
      }
    },
   created(){
      this.select.value=`${this.$SuwonApiPath}`
    },
  }
</script>