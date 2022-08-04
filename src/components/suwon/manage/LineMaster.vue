<template>
  <v-app id="inspire" >
    <v-row>
      <v-col>
        <template v-slotcenter>
          <v-toolbar flat>
            <v-toolbar-title>라인 마스터 (SIMES 데이터)</v-toolbar-title>
            <v-spacer></v-spacer> 
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="검색"
              single-line
              hide-details
            ></v-text-field>
              
            </v-toolbar>
        </template>
        <v-skeleton-loader v-if="loading" type="table"></v-skeleton-loader>
        <v-data-table v-else id="itemTable"
            dense
            item-key="props.index"
            single-select
            :headers="headers"
            :items="tableItems"
            :search="search"
            fixed-header
            :options="pagination"
            :footer-props="footerProps"
            >
            <v-alert slot="no-results" :value="true" type="error">
              "{{ search }}" 는 없는 데이터입니다.
            </v-alert>
        </v-data-table>
      </v-col>
      </v-row>
  </v-app>
</template>


<script>
import axios from 'axios'

export default {
  
  data () {
    return {
      date: new Date().toISOString().substr(0, 10),
        pagination: {
          itemsPerPage: -1
        },
        footerProps: {'items-per-page-options': [10, 30, 50, 100, -1]},
        tableItems:[],
        search: '',
        headers: [
          { text: '라인', align: 'start', value: 'WORK_SHOP_ID', class: "text-h6 orange lighten-5 warning--text" },
          { text: '라인명', align: 'start', value: 'WORK_SHOP_NAME', class: "text-h6 orange lighten-5 warning--text" },
          { text: '제품코드', align: 'start', value: 'PART_ID', class: "text-h6 orange lighten-5 warning--text" },
          { text: '제품명', align: 'start', value: 'PART_NAME', class: "text-h6 orange lighten-5 warning--text"},
          { text: '주간계획', align: 'start', value: 'AW_PLAN_QTY', class: "text-h6 orange lighten-5 warning--text" },
          { text: '주간실적', align: 'start', value: 'AW_GOOD_qTY', class: "text-h6 orange lighten-5 warning--text" },
          { text: '야간계획', align: 'start', value: 'PW_PLAN_QTY', class: "text-h6 orange lighten-5 warning--text" },
          { text: '야간실적', align: 'start', value: 'PW_GOOD_qTY', class: "text-h6 orange lighten-5 warning--text" },
        ],
        loading:true,
      }
    },
   created(){
      this.gettableItems()
   },
   methods: {
    gettableItems(){
        this.loading=true;
        const token = localStorage.getItem('token')
          axios.get(`${this.$SuwonApiPath}/api/line/GetLineMaster/` + this.date.replace(/-/g, ""), { headers: { Authorization: token } }) 
              .then(response => {
                this.tableItems = response.data 
                this.loading=false
              })
        },
     },
}
</script>

<style>
/*헤더 백그라운드 컬러*/
#itemTable table thead tr th + th { border-left:1px solid #dddddd !important; }
#itemTable table tbody tr td + td { border-left:1px solid #dddddd !important; }
</style>
