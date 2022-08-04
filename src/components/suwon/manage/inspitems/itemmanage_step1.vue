<template>
  <v-app id="inspire" >
    <v-row>
      <v-col>
        <template v-slotcenter>
          <v-toolbar flat>
            <v-toolbar-title>검사 기준 관리</v-toolbar-title>
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
        <v-skeleton-loader v-if="firstLoad" type="table"></v-skeleton-loader>
        <v-data-table v-else id="itemTable"
            item-key="props.index"
            single-select
            :headers="headers"
            :items="tableItems"
            :search="search"
            fixed-header
            :options="pagination"
            :footer-props="footerProps"
            dense
            height="700"
            >
            <!--
          <template v-slot:item="{ index, item }">
            <tr>
            <td>{{ index+1 }}</td>
            <td>{{item.WCEN}}</td>
            <td>{{item.MACO}}</td>
            <td>{{item.actions}}</td>
            </tr>
        </template>
        -->
          <template v-slot:[`item.actions`]="{ item }">
            <v-btn block outlined @click="calldetail(item.WCEN,item.MACO,item.WORK_SHOP_NAME,item.PART_NAME)"><v-icon small>mdi-file-search-outline</v-icon></v-btn>
          </template>
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
        pagination: {
          itemsPerPage: 50
        },
        footerProps: {'items-per-page-options': [10, 30, 50, 100, -1]},
         image:null,imgsrc:null,url:'',
        tableItems:[],
        search: '',
        dialog: false,
        dialogDelete: false,
        headers: [
          { text: '라인번호',  align: 'start', value: 'WCEN', class: "orange lighten-5 warning--text text-h6"},
          { text: '라인명', value: 'WORK_SHOP_NAME', class: "orange lighten-5 warning--text text-h6"},
          { text: '품번', value: 'MACO', class: "orange lighten-5 warning--text text-h6"},
          { text: '품명', value: 'PART_NAME', class: "orange lighten-5 warning--text text-h6"},
          { text: '조회', value: 'actions', class: "orange lighten-5 warning--text text-h6", align:"center"},
        ],
        editedIndex: -1,
        editedItem: {
          WCEN: '',
          MACO: '',
          PSNO: '',
          PSNM: '',
          MANM: '',
          NAM1:'',
          NAM2:'',
          SCGU:'',
          CKCD:'',
          REM1:'',
          REM2:'',
          JGCD:'',
          SIZE:'',
          POINT:'',
          COND:'',
          CENT:'',
          LCLQ:'',
          UCLQ:'',
          UNIT:'',
          IS_INPUT:'',
          url: null,
          image: null,
          imgsrc:'',
        },
        defaultItem: {
          WCEN: '',
          MACO: '',
          PSNO: '',
          PSNM: '',
          MANM: '',
          NAM1:'',
          NAM2:'',
          SCGU:'',
          CKCD:'',
          REM1:'',
          REM2:'',
          JGCD:'',
          SIZE:'',
          POINT:'',
          COND:'',
          CENT:'',
          LCLQ:'',
          UCLQ:'',
          UNIT:'',
          IS_INPUT:'',
          url: null,
          image: null,
          imgsrc:'',
        },
        firstLoad: true,
      }
    },
   created(){
      this.gettableItems()
   },
   methods: {
    gettableItems(){
       const token = localStorage.getItem('token')
       axios.get(`${this.$SuwonApiPath}/api/manage/item/list/step1`, { headers: { Authorization: token } }) 
        .then(response => {
              this.tableItems = response.data
        })

        setTimeout(() => {
          if (this.firstLoad) this.firstLoad = false
        }, 1000);
     },
    editItem (item) {
      //console.log("editItem selected")
      this.editedIndex = this.tableItems.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },
    close () {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },
    calldetail(wcen,maco,ln,pn) {
        this.$router.push({path: '/sw/admin/manageitem/stp2', name: '검사기준 관리 step2', query:{line: wcen, part: maco, line_name: ln, part_name: pn} });
        },
  },
}
</script>

<style>
/*헤더 백그라운드 컬러*/
#itemTable table thead tr th + th { border-left:1px solid #dddddd !important; }
#itemTable table tbody tr td + td { border-left:1px solid #dddddd !important; }
</style>
