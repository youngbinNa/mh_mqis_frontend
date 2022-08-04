<template>
  <div id="app">
    <v-app id="inspire" >
      <v-container fluid>
        <v-row dense>
          <v-col>
         <v-card class="mx-auto" outlined elevation="2"
          v-for="(item) in this.tableItems"
            :key="item.INDEX_KEY" >
              <template v-slotcenter>
                 <v-toolbar flat>
                    <v-col>
                      <v-toolbar-title>일 단위 달성율</v-toolbar-title>
                    </v-col>
                    <v-col >
                      <v-select
                          hide-details
                          v-model="filter"
                          :items="zones"
                          item-text="name" 
                          item-value="value"
                          label="주간/야간"
                          dense
                        ></v-select>
                    </v-col>
                 </v-toolbar>
                 <v-toolbar flat dense>
                    <v-col >
                        <template class="form-group" >
                            <v-dialog
                              ref="dialog"
                              v-model="modal"
                              :return-value.sync="date"
                              persistent
                              width="290px"
                            >
                              <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                  hide-details
                                  v-model="date"
                                  label="기준일자"
                                  prepend-icon="mdi-calendar"
                                  readonly
                                  v-bind="attrs"
                                  v-on="on"
                                ></v-text-field>
                              </template>
                              <v-date-picker v-model="date" locale="ko-kr" :day-format="date => date.split('-')[2]" scrollable>
                                <v-spacer></v-spacer>
                                <v-btn text color="primary" @click="modal = false">취소</v-btn>
                                <v-btn text color="primary" @click="$refs.dialog[0].save(date)">확인</v-btn>
                                  </v-date-picker>
                            </v-dialog>
                        </template>
                    </v-col>
                    <v-col  class="justify-end" style="text-align:right">
                      <v-btn @click="retrieveCalendar" tile outlined type="submit"  color="success"><v-icon left>mdi-magnify</v-icon> 조회</v-btn>
                    </v-col>
                 </v-toolbar>
              </template>
                <v-row class="pa-0 ma-0 justify-center">
                  <v-row class="pa-0 ma-0">
                    <v-col class="px-4" style="text-align:center;">
                        <v-progress-circular rotate="270"
                                            size="200"
                                            :value="getNum(item.DONE_LINE/item.IS_TARGET)*100"
                                            width="15"
                                            color=success>
                                            <div class="text-h5">완료: {{Math.round(getNum(item.DONE_LINE/item.IS_TARGET)*100)}}%<br/>{{item.DONE_LINE}} / {{item.IS_TARGET}}</div>
                        </v-progress-circular>
                    </v-col>
                  </v-row>
                  <v-row class="pa-0 ma-0">
                    <v-col style="align-self: center;">
                      <v-row class="pa-0 ma-0">
                        <div class="pt-0.5">
                            <v-avatar  color="success" size="15" ></v-avatar>
                          </div>
                        <strong class="px-6 pr-1">완료 {{item.DONE_LINE}}</strong>
                      </v-row>
                      <v-row class="pa-0 ma-0">
                        <div class="pt-0.5">
                            <v-avatar  color="grey" size="15" ></v-avatar>
                          </div>
                        <strong class="px-6 pr-1">미완료 {{item.IS_TARGET-item.DONE_LINE}}</strong>
                      </v-row>
                    </v-col>
                  </v-row>
                 
                </v-row>
          </v-card>
          </v-col>
          <v-col>
          <v-card class="mx-auto" outlined elevation="2"
          v-for="(item) in this.tableWeekItems"
            :key="item.INDEX_KEY" >
              <template v-slotcenter>
                 <v-toolbar flat>
                    <v-col>
                      <v-toolbar-title>주 단위 달성율</v-toolbar-title>
                    </v-col>
                    <v-col >
                      <v-select
                          hide-details
                          v-model="filterweek"
                          :items="zonesweek"
                          item-text="name" 
                          item-value="value"
                          label="주간/야간"
                          dense
                        ></v-select>
                    </v-col>
                 </v-toolbar>
                 <v-toolbar flat dense>
                    <v-col >
                        <template class="form-group" >
                            <v-dialog
                              ref="dialogweek"
                              v-model="modalweek"
                              :return-value.sync="dateweek"
                              persistent
                              width="290px"
                            >
                              <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                  hide-details
                                  v-model="computedDateweek"
                                  label="기준일자"
                                  prepend-icon="mdi-calendar"
                                  readonly
                                  v-bind="attrs"
                                  v-on="on"
                                ></v-text-field>
                              </template>
                              <v-date-picker v-model="dateweek" locale="ko-kr" :day-format="dateweek => dateweek.split('-')[2]" scrollable>
                                <v-spacer></v-spacer>
                                <v-btn text color="primary" @click="modalweek = false">취소</v-btn>
                                <v-btn text color="primary" @click="$refs.dialogweek[0].save(dateweek)">확인</v-btn>
                              </v-date-picker>
                            </v-dialog>
                        </template>
                    </v-col>
                    <v-col  class="justify-end" style="text-align:right">
                      <v-btn @click="retrieveCalendarWeek2(dateweek)" tile outlined type="submit"  color="success"><v-icon left>mdi-magnify</v-icon> 조회</v-btn>
                    </v-col>
                 </v-toolbar>
              </template>
              <!--
                <v-row class="pa-0 ma-0 justify-center">
                  <v-col class="pt-10"  cols="3" style="text-align:center;">
                        
                          <v-progress-circular rotate="270"
                                              size="100"
                                              :value="getNum(item.DONE_LINE/item.IS_TARGET)*100"
                                              width="8"
                                              color=success>완료: {{Math.round(getNum(item.DONE_LINE/item.IS_TARGET)*100)}}%<br/>{{item.DONE_LINE}} / {{item.IS_TARGET}}
                          </v-progress-circular>
                  </v-col>
                  <v-row class="pa-0 ma-0">
                    <v-col  style="width: 100%;">
                       <v-list >
                          <v-list-item style="background:#E0E0E0">
                            <v-list-item-content>대상 라인:</v-list-item-content>
                            <v-list-item-content class="align-end">{{ item.IS_TARGET }}</v-list-item-content>
                          </v-list-item>
                          <v-list-item >
                            <v-list-item-content>비대상 라인:</v-list-item-content>
                            <v-list-item-content class="align-end ">{{ item.NO_TARGET }}</v-list-item-content>
                          </v-list-item>
                          <v-list-item style="background:#E0E0E0">
                            <v-list-item-content>대상 등록라인:</v-list-item-content>
                            <v-list-item-content class="align-end">{{ item.IS_MANUAL }}</v-list-item-content>
                          </v-list-item>
                          <v-list-item >
                            <v-list-item-content>검사완료:</v-list-item-content>
                            <v-list-item-content class="align-end ">{{ item.DONE_LINE }}</v-list-item-content>
                          </v-list-item>
                        </v-list>
                    </v-col>
                  </v-row>
                 
                </v-row>
                -->
                <v-row class="pa-0 ma-0 justify-center">
                  <v-row class="pa-0 ma-0">
                    <v-col class="px-4" style="text-align:center;">
                        <v-progress-circular rotate="270"
                                            size="200"
                                            :value="getNum(item.DONE_LINE/item.IS_TARGET)*100"
                                            width="15"
                                            color=success>
                                            <div class="text-h5">완료: {{Math.round(getNum(item.DONE_LINE/item.IS_TARGET)*100)}}%<br/>{{item.DONE_LINE}} / {{item.IS_TARGET}}</div>
                        </v-progress-circular>
                    </v-col>
                  </v-row>
                  <v-row class="pa-0 ma-0">
                    <v-col style="align-self: center;">
                      <v-row class="pa-0 ma-0">
                        <div class="pt-0.5">
                            <v-avatar  color="success" size="15" ></v-avatar>
                          </div>
                        <strong class="px-6 pr-1">완료 {{item.DONE_LINE}}</strong>
                      </v-row>
                      <v-row class="pa-0 ma-0">
                        <div class="pt-0.5">
                            <v-avatar  color="grey" size="15" ></v-avatar>
                          </div>
                        <strong class="px-6 pr-1">미완료 {{item.IS_TARGET-item.DONE_LINE}}</strong>
                      </v-row>
                    </v-col>
                  </v-row>
                 
                </v-row>
          </v-card>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-card class="pa-0 ma-0 justify-center" outlined elevation="2">
                 <suwondetail3  ></suwondetail3>
            </v-card>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-card class="pa-0 ma-0 justify-center" outlined elevation="2">
                 <suwondetail4  ></suwondetail4>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-app>
  </div>
</template>

<script>
import axios from 'axios'
//import VueApexCharts from 'vue-apexcharts'
import SuwonDetail3 from './Dashboard/Suwon_Detail_3';
import SuwonDetail4 from './Dashboard/Suwon_Detail_4';

  export default {
    name: 'DashBoardSuwon',
    components: {
      suwondetail3: SuwonDetail3,
      suwondetail4: SuwonDetail4,
    },
    data() {
        return{
                  date: new Date().toISOString().substr(0, 10),
                  dateweek: new Date().toISOString().substr(0, 10),
                  computedDateweek:'',
                  date3: ['2021-03-01', '2021-03-05'],
                  today: new Date(),
                  diff:'',
                  modal: false,modalweek: false,modal3: false,
        menu2: false,
                  tableItems: [],tableWeekItems:[], table3: [],
                  //dayornot: 0,
                  zones : [ {name:'주간', value:'주간'},{name:'야간', value:'야간'}  ], 
                  zonesweek : [ {name:'주간', value:'주간'},{name:'야간', value:'야간'}  ], 
                  istarget : [ {name:'전체', value:''}, {name:'대상', value: '1'},{name:'비대상', value: '0'}  ], 
                  filter: '',filterweek: '',
                  dialogDelete: false,dialogDeleteWeek: false,
                  editedItem: {
                    INDEX_KEY: 0,
                    IS_MANUAL: '',
                    WORK_SHOP_ID:'',
                    PART_ID:'',
                    CAN_OK:'',
                  },
                  tab: null,
                  items: [
                    '일 단위', '주 단위',
                  ],
          }
    },
    computed: {
      filteredTables() {
        //const filter = this.filter.toUpperCase();
        //const filter2 = this.filter2.toUpperCase();
        return this.tableItems.filter(param => 
          //(String(param.TIME_ZONE_ID).toUpperCase().includes(filter) || String(param.IS_TARGET).toUpperCase().includes(filter2)) &&
          ( 
            (!this.filter && !this.filter2) || 
            (!this.filter && this.filter2.includes(param.IS_TARGET)) || 
            (this.filter.includes(param.TIME_ZONE_ID) && !this.filter2) ||    
            (this.filter.includes(param.TIME_ZONE_ID) && this.filter2.includes(param.IS_TARGET)) 
          )
          //const hasZoneMatch = String(param.TIME_ZONE_ID).includes(filter);
          //const hasGOOD_QTYMatch = String(param.IS_TARGET).includes(filter);
          //return hasZoneMatch || hasGOOD_QTYMatch;
        )
      },
      filteredTablesWeek() {
        return this.tableWeekItems.filter(param => 
          ( 
            (!this.filter && !this.filter2) || 
            (!this.filter && this.filter2.includes(param.IS_TARGET)) || 
            (this.filter.includes(param.TIME_ZONE_ID) && !this.filter2) ||    
            (this.filter.includes(param.TIME_ZONE_ID) && this.filter2.includes(param.IS_TARGET)) 
          )
        )
      },
      getLeftColor() {
            return this.filteredTables.map(function(item) {
                return (item.TIME_ZONE_ID=='주간') ? '10px solid orange' : '10px solid rgb(25 25 112)'
            });
      },
      getLeftColorWeek() {
            return this.filteredTablesWeek.map(function(item) {
                return (item.TIME_ZONE_ID=='주간') ? '10px solid orange' : '10px solid rgb(25 25 112)'
            });
      },
    },

    created(){
      console.log(this.$store.state)
        const currHour = new Date().getHours()
        if (currHour >=9 && currHour <21 ){ this.filter= '주간'; this.filterweek='주간'}
        //else if ( (currHour >= 0 && currHour < 9) || (currHour >= 21 && currHour <= 24 ) ){ this.filter= '야간' }
        else { this.filter= '야간' ; this.filterweek='야간'}
        this.filter2 = '1' //검사 대상
        this.filter= '주간'; this.filterweek='주간'
        this.retrieveCalendar()
        this.retrieveCalendarWeek()
    },
    methods:{
        retrieveCalendar(){
          //let pickdate=this.date;
          const token = localStorage.getItem('token')
         // axios.get(`${this.$SuwonApiPath}/api/dashboard/get1/`+ this.date.replace(/-/g, "")+'/'+ '주간', { headers: { Authorization: token } } )
         axios.get(`${this.$D2ApiPath}/api/dashboard/get1?date=` + this.date.replace(/-/g, "")+'&zone='+ this.filter, { headers: { Authorization: token } } )
            .then(response => {
              this.tableItems = response.data.length==0 ? [{DONE_LINE: 0, IS_TARGET: 0}] : response.data     // 반환되는 값을 toDoItems에 저장한다.
              //console.log(response.data.date);
            })
        },
        formatDate(date) {
            var d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2) 
                month = '0' + month;
            if (day.length < 2) 
                day = '0' + day;

            return [year, month, day].join('-');
        },
        retrieveCalendarWeek(){
          const token = localStorage.getItem('token')
          var today = new Date()
          var first = today.getDate() - today.getDay() +1;
          var firstday = this.formatDate(new Date(today.setDate(first)))
          this.computedDateweek=firstday
          axios.get(`${this.$D2ApiPath}/api/dashboard/get2?date=` + firstday.replace(/-/g, "")+'&zone='+ this.filterweek, { headers: { Authorization: token } } )
            .then(response => {
              console.log('--in method--')
              console.log(this.startOfWeek)
              this.tableWeekItems = response.data.length==0 ? [{DONE_LINE: 0, IS_TARGET: 0}] : response.data     // 반환되는 값을 toDoItems에 저장한다.
              //console.log(response.data.date);
            })
        },
        retrieveCalendarWeek2(val){
          var today = new Date(val)
          var first = today.getDate() - today.getDay() +1;
          var firstday = new Date(today.setDate(first)).toISOString().substr(0, 10)
          this.computedDateweek=firstday
          const token = localStorage.getItem('token')
          axios.get(`${this.$D2ApiPath}/api/dashboard/get2?date=` + firstday.replace(/-/g, "")+'&zone='+ this.filterweek, { headers: { Authorization: token } } )
            .then(response => {
              console.log('--in 2method--')
              console.log(firstday)
              this.tableWeekItems = response.data.length==0 ? [{DONE_LINE: 0, IS_TARGET: 0}] : response.data     // 반환되는 값을 toDoItems에 저장한다.
              //console.log(response.data.date);
            })
        },
        callTargetSPC(qLINE,qPART,pWORK_DATE,pZONE) {
         // let pickedLINE=this.fLINE;
         // let pickedPART=this.fPART;
            //this.$router.push("/inspection/tl/ts?"+fLINE+"&"+fPART);
            this.$router.push({path: '/dp2/inspection/tl/ts',  query:{line: qLINE, part: qPART,workdate: pWORK_DATE.replace(/-/g, ""), zone: pZONE}});
            //console.log(fLINE)
        },
        callTargetSPC_Week(qLINE,qPART,pWORK_DATE,pZONE) {
            this.$router.push({path: '/dp2/inspection/tl/ts/week', query:{line: qLINE, part: qPART,workdate: pWORK_DATE.replace(/-/g, ""), zone: pZONE}});
        },
        updateIS_MANUAL(){
            const token = localStorage.getItem('token')
            axios.patch(`${this.$D2ApiPath}/api/inspection/tl/manual?index_key=` + this.editedItem.INDEX_KEY+'&pIS_MANUAL='+this.editedItem.IS_MANUAL, { headers: { Authorization: token } } )
            .then(() => {
              this.retrieveCalendar() 
            })
        },
        updateIS_MANUAL_Week(){
            const token = localStorage.getItem('token')
            axios.patch(`${this.$D2ApiPath}/api/inspection/tl/manual/week?index_key=` + this.editedItem.INDEX_KEY+'&pIS_MANUAL='+this.editedItem.IS_MANUAL, { headers: { Authorization: token } } )
            .then(() => {
              this.retrieveCalendarWeek() 
            })
        },
        getNum(val) {
          val = +val || 0
          return val;
        },
        getThisDate() {
          return this.date;
        },
        deleteItem (pSEQ,pIS_MANUAL,pWORK_SHOP_ID,pPART_ID) {
          this.editedItem.INDEX_KEY = pSEQ
          this.editedItem.IS_MANUAL = pIS_MANUAL
          this.editedItem.WORK_SHOP_ID = pWORK_SHOP_ID
          this.editedItem.PART_ID = pPART_ID
          if(pIS_MANUAL=='Y') this.editedItem.CAN_OK=' 등록'
          else this.editedItem.CAN_OK='서 제외'
          this.dialogDelete = true
        },
        deleteItemConfirm () {
          this.updateIS_MANUAL()
          this.closeDelete()
        },
        deleteItemWeek (pSEQ,pIS_MANUAL,pWORK_SHOP_ID,pPART_ID) {
          this.editedItem.INDEX_KEY = pSEQ
          this.editedItem.IS_MANUAL = pIS_MANUAL
          this.editedItem.WORK_SHOP_ID = pWORK_SHOP_ID
          this.editedItem.PART_ID = pPART_ID
          if(pIS_MANUAL=='Y') this.editedItem.CAN_OK=' 등록'
          else this.editedItem.CAN_OK='서 제외'
          this.dialogDeleteWeek = true
        },
        deleteItemConfirmWeek () {
          this.updateIS_MANUAL_Week()
          this.closeDeleteWeek()
        },
        closeDelete () {
          this.dialogDelete = false
        },
        closeDeleteWeek () {
          this.dialogDeleteWeek = false
        },
      },
  }
</script>