<template>
  <div id="app">
    <v-app id="inspire" >
      <v-container fluid>
        <v-row dense>
          <v-col>
            <suwondetail1 v-bind:workplace="$SuwonApiPath" ></suwondetail1>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-card class="pa-0 ma-0 justify-center" outlined elevation="2">
                 <suwondetail3 v-bind:workplace="$SuwonApiPath" ></suwondetail3>
            </v-card>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-card class="pa-0 ma-0 justify-center" outlined elevation="2">
                 <suwondetail4 v-bind:workplace="$SuwonApiPath" ></suwondetail4>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-app>
  </div>
</template>

<script>
//import VueApexCharts from 'vue-apexcharts'
import SuwonDetail1 from './Dashboard/Suwon_Detail_1';
import SuwonDetail3 from './Dashboard/Suwon_Detail_3';
import SuwonDetail4 from './Dashboard/Suwon_Detail_4';

  export default {
    name: 'DashBoardSuwon',
    components: {
      suwondetail1: SuwonDetail1,
      suwondetail3: SuwonDetail3,
      suwondetail4: SuwonDetail4,
    },
   
  }
</script>