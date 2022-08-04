<template>
  <div id="app">
    <v-app id="inspire" >
      <v-container style="padding:0;" app>
        <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="headline">{{this.editedItem.WORK_SHOP_ID}}라인 {{this.editedItem.PART_ID}}품번을<br>검사대상에{{this.editedItem.CAN_OK}}하시겠습니까?</v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn class="font-weight-bold" color="blue darken-1" text @click="closeDelete">취소</v-btn>
                <v-btn class="font-weight-bold" color="blue darken-1" text @click="deleteItemConfirm">확인</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDeleteWeek" max-width="500px">
            <v-card>
              <v-card-title class="headline">{{this.editedItem.WORK_SHOP_ID}}라인 {{this.editedItem.PART_ID}}품번을<br>검사대상에{{this.editedItem.CAN_OK}}하시겠습니까?</v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn class="font-weight-bold" color="blue darken-1" text @click="closeDeleteWeek">취소</v-btn>
                <v-btn class="font-weight-bold" color="blue darken-1" text @click="deleteItemConfirmWeek">확인</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
      
      </v-container>
              <div>
               <v-toolbar dense flat>
                
                    <v-tabs
                      v-model="tab"
                      background-color="transparent"
                      color="#DDA94B"
                      grow
                    >
                      <v-tab
                        v-for="item in items"
                        :key="item"
                      >
                        {{ item }}
                      </v-tab>
                    </v-tabs>
               </v-toolbar>
              </div>
             
            <v-tabs-items v-model="tab">
        <v-tab-item
          v-for="item in items"
          :key="item"
        >  
         <template v-if="item=='일 단위'" >
            <div>
              <v-row align="center" style="padding:0;">
                <v-col cols="12" sm="4" style="padding-top:5px;padding-bottom:0px;padding-left:15px;padding-right:10px">
                        <form @submit.prevent="retrieveCalendar">
                          <div class="form-group" >
                              <v-dialog
                                ref="dialog"
                                v-model="modal"
                                :return-value.sync="date"
                                persistent
                                width="290px"
                              >
                                <template v-slot:activator="{ on, attrs }">
                                  <v-text-field
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
                                  <v-btn v-on:click="retrieveCalendar" type="submit" text color="primary" @click="$refs.dialog[0].save(date)">확인</v-btn>
                                </v-date-picker>
                              </v-dialog>
                          </div>
                        </form>
                </v-col>
                <v-col class="d-flex" cols="12" sm="4" style="margin-top:18px;padding-top:0px;padding-bottom:0px;padding-left:30px;padding-right:30px">
                        <v-select
                          v-model="filter"
                          :items="zones"
                          item-text="name" 
                          item-value="value"
                          label="주간/야간"
                          dense
                        ></v-select>
                </v-col>
                <v-col class="d-flex" cols="12" sm="4" style="margin-top:18px;padding-top:0px;padding-bottom:0px;padding-left:30px;padding-right:30px">
                        <v-select
                          v-model="filter2"
                          :items="istarget"
                          item-text="name" 
                          item-value="value"
                          label="검사 대상/비대상"
                          dense
                        ></v-select>
                </v-col>
              </v-row>
              </div>
      <v-container v-if="loading && !nodata" grid-list-md text-xs-center fluid class="pt-1 pb-1 pl-3 pr-3">
        <v-card class="mx-auto mb-3" outlined elevation="2"><v-skeleton-loader loading height="150" type="list-item-avatar-two-line"></v-skeleton-loader></v-card>
        <v-card class="mx-auto mb-3" outlined elevation="2"><v-skeleton-loader loading height="150" type="list-item-avatar-two-line"></v-skeleton-loader></v-card>
        <v-card class="mx-auto mb-3" outlined elevation="2"><v-skeleton-loader loading height="150" type="list-item-avatar-two-line"></v-skeleton-loader></v-card>
        <v-card class="mx-auto mb-3" outlined elevation="2"><v-skeleton-loader loading height="150" type="list-item-avatar-two-line"></v-skeleton-loader></v-card>
      </v-container>
      <v-container v-else-if="!loading && nodata" grid-list-md text-xs-center fluid class="pt-1 pb-1 pl-3 pr-3">
          <v-alert type="error">
              데이터가 없습니다.
            </v-alert>
      </v-container>
      <v-container v-else grid-list-md text-xs-center fluid class="pt-1 pb-1 pl-3 pr-3" app
            v-for="(item,index) in filteredTables"
            :key="item.INDEX_KEY">
          <v-card :style="{borderLeft: getLeftColor[index]}"
            class="mx-auto"
            outlined
            elevation="2">
            <v-list-item two-line class="pa-0 ma-0">
              <v-list-item-content>
                <v-row class="pa-0 ma-0 justify-center">
                  <v-col class="pa-0 mx-4"  md="3">
                        
                      <v-col style="text-align:center;">
                        <v-badge color="grey" left :value="index+1" :content="index+1" >
                          <v-progress-circular rotate="270"
                                              size="100"
                                              :value="getNum(item.IS_DONE/item.TOTAL)*100"
                                              width="8"
                                              color=#479cc8>완료: {{Math.round(getNum(item.IS_DONE/item.TOTAL)*100)}}%<br/>{{item.IS_DONE}} / {{item.TOTAL}}
                          </v-progress-circular>
                          </v-badge>
                      </v-col>
                  </v-col>
                  <v-row class="pa-0 ma-0">
                    <v-col  style="width: 100%;">
                        <v-list-item-title class="text-h5"><v-chip outlined>{{item.WORK_SHOP_ID}}</v-chip>  {{item.TIME_ZONE_ID}}
                          <template v-if="item.IS_TARGET == 1">
                            <template v-if="item.IS_MANUAL == 'Y'">
                                <v-chip  outlined color="info">수동라인</v-chip>
                            </template></template>
                        </v-list-item-title>
                        <v-card flat class="grey--text text-h5 text--darken-1 ml-2">{{item.PART_ID}}</v-card>
                        <v-card flat class="text-h5 ml-2">{{item.WORK_SHOP_NAME}}</v-card>
                        <v-card flat class="grey--text text-h5 text--darken-1 ml-2">{{item.PART_NAME}}</v-card>
                    </v-col>
                  </v-row>
                  <!--
                  <v-col >
                      <v-list-item-subtitle class="headline">계획: {{item.PLAN_QTY}}</v-list-item-subtitle>
                      <v-list-item-subtitle class="headline">실적: {{item.GOOD_QTY}}</v-list-item-subtitle>
                  </v-col>
                  -->
                  <v-row class="pa-0 ma-0">
                    <v-col  style="text-align:right" >
                      <template v-if="item.IS_OK > 0">
                          <v-chip class="ma-2" outlined color="error">불합격</v-chip>
                      </template>
                      <template v-if="item.IS_TARGET == 1">
                                                <!--
                        <input type="hidden" name="fLINE" value="@{{ item.WORK_SHOP_ID }}"  v-model="fLINE">
                        <input type="hidden" name="fPART" value="@{{ item.PART_ID }}"  v-model="fPART">
                        -->
                         <template v-if="item.IS_MANUAL == 'Y' || $store.state.isAdmin">
                              <v-btn class="ma-2" tile outlined color="error" @click="deleteItem(item.INDEX_KEY,'N',item.WORK_SHOP_ID,item.PART_ID)">
                                <v-icon left>mdi-content-cut</v-icon> 등록 취소
                              </v-btn>
                        </template>
                              <v-btn class="ma-2" tile outlined color="success" @click="callTargetSPC(item.WORK_SHOP_ID,item.PART_ID,getThisDate(),item.TIME_ZONE_ID)">
                                <v-icon left>mdi-file-search-outline</v-icon> 공정조회
                              </v-btn>
                       
                      </template>
                      <template v-else>
                        
                              <v-btn class="ma-2" tile outlined color="error" @click="deleteItem(item.INDEX_KEY,'Y',item.WORK_SHOP_ID,item.PART_ID)">
                                <v-icon left>mdi-file-search-outline</v-icon> 검사대상 등록
                              </v-btn>
                      </template>
                    </v-col>
                  </v-row>
                </v-row>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </v-container>
          </template>
          <template v-else >
             <div>
              <v-row align="center" style="padding:0;">
                <v-col cols="12" sm="4" style="padding-top:5px;padding-bottom:0px;padding-left:15px;padding-right:10px">
                        <form @submit.prevent="retrieveCalendarWeek">
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
                                <v-btn v-on:click="retrieveCalendarWeek2(dateweek)" type="submit" text color="primary" @click="$refs.dialogweek[0].save(dateweek)">확인</v-btn>
                              </v-date-picker>
                            </v-dialog>
                        </template>
                      </form>
                </v-col>
                <v-col class="d-flex" cols="12" sm="4" style="margin-top:18px;padding-top:0px;padding-bottom:0px;padding-left:30px;padding-right:30px">
                        <v-select
                          v-model="filter"
                          :items="zones"
                          item-text="name" 
                          item-value="value"
                          label="주간/야간"
                          dense
                        ></v-select>
                </v-col>
                <v-col class="d-flex" cols="12" sm="4" style="margin-top:18px;padding-top:0px;padding-bottom:0px;padding-left:30px;padding-right:30px">
                        <v-select
                          v-model="filter2"
                          :items="istarget"
                          item-text="name" 
                          item-value="value"
                          label="검사 대상/비대상"
                          dense
                        ></v-select>
                </v-col>
              </v-row>
              </div>
      <v-container v-if="loadingweek && !nodataweek" grid-list-md text-xs-center fluid class="pt-1 pb-1 pl-3 pr-3">
        <v-card class="mx-auto mb-3" outlined elevation="2"><v-skeleton-loader loading height="150" type="list-item-avatar-two-line"></v-skeleton-loader></v-card>
        <v-card class="mx-auto mb-3" outlined elevation="2"><v-skeleton-loader loading height="150" type="list-item-avatar-two-line"></v-skeleton-loader></v-card>
        <v-card class="mx-auto mb-3" outlined elevation="2"><v-skeleton-loader loading height="150" type="list-item-avatar-two-line"></v-skeleton-loader></v-card>
        <v-card class="mx-auto mb-3" outlined elevation="2"><v-skeleton-loader loading height="150" type="list-item-avatar-two-line"></v-skeleton-loader></v-card>
      </v-container>
      <v-container v-else-if="!loadingweek && nodataweek" grid-list-md text-xs-center fluid class="pt-1 pb-1 pl-3 pr-3">
          <v-alert type="error">
              데이터가 없습니다.
            </v-alert>
      </v-container>
      <v-container v-else grid-list-md text-xs-center fluid class="pt-1 pb-1 pl-3 pr-3" app
            v-for="(item,index) in filteredTablesWeek"
            :key="item.INDEX_KEY">
          <v-card :style="{borderLeft: getLeftColorWeek[index]}"
            class="mx-auto"
            outlined
            elevation="2">
            <v-list-item two-line class="pa-0 ma-0">
              <v-list-item-content>
                <v-row class="pa-0 ma-0 justify-center">
                  <v-col class="pa-0 mx-4"  md="3">
                        
                      <v-col style="text-align:center;margin-left:15px">
                        <v-badge color="grey" left :value="index+1" :content="index+1" >
                          <v-progress-circular rotate="270"
                                              size="100"
                                              :value="getNum(item.IS_DONE/item.TOTAL)*100"
                                              width="8"
                                              color=#479cc8>완료: {{Math.round(getNum(item.IS_DONE/item.TOTAL)*100)}}%<br/>{{item.IS_DONE}} / {{item.TOTAL}}
                          </v-progress-circular>
                          </v-badge>
                      </v-col>
                  </v-col>
                  <v-row class="pa-0 ma-0">
                    <v-col  style="width: 100%;">
                        <v-list-item-title class="text-h5"><v-chip outlined>{{item.WORK_SHOP_ID}}</v-chip>  {{item.TIME_ZONE_ID}}
                          <template v-if="item.IS_TARGET == 1">
                            <template v-if="item.IS_MANUAL == 'Y'">
                                <v-chip  outlined color="info">수동라인</v-chip>
                            </template></template>
                        </v-list-item-title>
                        <v-card flat class="grey--text text-h5 text--darken-1 ml-2">{{item.PART_ID}}</v-card>
                        <v-card flat class="text-h5 ml-2">{{item.WORK_SHOP_NAME}}</v-card>
                        <v-card flat class="grey--text text-h5 text--darken-1 ml-2">{{item.PART_NAME}}</v-card>
                    </v-col>
                  </v-row>
                  <!--
                  <v-col >
                      <v-list-item-subtitle class="headline">계획: {{item.PLAN_QTY}}</v-list-item-subtitle>
                      <v-list-item-subtitle class="headline">실적: {{item.GOOD_QTY}}</v-list-item-subtitle>
                  </v-col>
                  -->
                  <v-row class="pa-0 ma-0">
                    <v-col  style="text-align:right">
                      <template v-if="item.IS_OK > 0">
                          <v-chip class="ma-2" outlined color="error">불합격</v-chip>
                      </template>
                      <template v-if="item.IS_TARGET == 1">
                                                <!--
                        <input type="hidden" name="fLINE" value="@{{ item.WORK_SHOP_ID }}"  v-model="fLINE">
                        <input type="hidden" name="fPART" value="@{{ item.PART_ID }}"  v-model="fPART">
                        -->
                        <template v-if="item.IS_MANUAL == 'Y' || $store.state.isAdmin">
                              <v-btn class="ma-2" tile outlined color="error" @click="deleteItemWeek(item.INDEX_KEY,'N',item.WORK_SHOP_ID,item.PART_ID)">
                                <v-icon left>mdi-content-cut</v-icon> 등록 취소
                              </v-btn>
                        </template>
                              <v-btn class="ma-2" tile outlined color="success" @click="callTargetSPC_Week(item.WORK_SHOP_ID,item.PART_ID,computedDateweek,item.TIME_ZONE_ID)">
                                <v-icon left>mdi-file-search-outline</v-icon> 공정조회
                              </v-btn>
                      </template>
                      <template v-else>
                        
                              <v-btn class="ma-2" tile outlined color="error" @click="deleteItemWeek(item.INDEX_KEY,'Y',item.WORK_SHOP_ID,item.PART_ID)">
                                <v-icon left>mdi-file-search-outline</v-icon> 검사대상 등록
                              </v-btn>
                      </template>
                    </v-col>
                  </v-row>
                </v-row>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </v-container>
          </template>
        </v-tab-item>
      </v-tabs-items>
    </v-app>
  </div>
</template>

<script>
import axios from 'axios'


  export default {
    name: 'TargetLine',
    data() {
        return{
            loading:true,loadingweek:true,nodata:false,nodataweek:false,
                  date: new Date().toISOString().substr(0, 10),
                  dateweek: new Date().toISOString().substr(0, 10),
                  computedDateweek:'',
                  today: new Date(),
                  diff:'',
                  modal: false,modalweek: false,
        
                  tableItems: [],tableWeekItems:[],
                  //dayornot: 0,
                  zones : [ {name:'전체', value:''}, {name:'주간', value:'주간'},{name:'야간', value:'야간'}  ], 
                  istarget : [ {name:'전체', value:''}, {name:'대상', value: '1'},{name:'비대상', value: '0'}  ], 
                  filter: '', filter2:'',
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
                  allowedDates: val => new Date(val).getDay() === 1,
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
                //return (item.TIME_ZONE_ID=='주간') ? '10px solid #DDA94B' : '10px solid #1E4174'
                var colorset=''
                if(item.IS_DONE != 0 && (item.IS_DONE===item.TOTAL)) colorset='10px solid #1E4174'
                else if(item.IS_DONE<item.TOTAL) colorset='10px solid orange'
                else if(item.IS_DONE===0 && item.TOTAL===0) colorset='10px solid grey'
                if(item.IS_OK>0) colorset='10px solid red'
                return colorset
            });
      },
      getLeftColorWeek() {
            return this.filteredTablesWeek.map(function(item) {
                //return (item.TIME_ZONE_ID=='주간') ? '10px solid orange' : '10px solid rgb(25 25 112)'
                var colorset=''
                if(item.IS_DONE != 0 && (item.IS_DONE===item.TOTAL)) colorset='10px solid #1E4174'
                else if(item.IS_DONE<item.TOTAL) colorset='10px solid orange'
                else if(item.IS_DONE===0 && item.TOTAL===0) colorset='10px solid grey'
                if(item.IS_OK>0) colorset='10px solid red'
                return colorset
            });
      },
    },

    created(){
        const currHour = new Date().getHours()
        if (currHour >=9 && currHour <21 ){ this.filter= '주간' }
        //else if ( (currHour >= 0 && currHour < 9) || (currHour >= 21 && currHour <= 24 ) ){ this.filter= '야간' }
        else { this.filter= '야간' }
        this.filter2 = '1' //검사 대상
        if(this.$route.params.jgcd) this.tab=1;

        this.retrieveCalendar()
        this.retrieveCalendarWeek()
    },
    methods:{
        retrieveCalendar(){
          this.loading=true;
          this.nodata=false;
          //let pickdate=this.date;
          const token = localStorage.getItem('token')
          axios.get(`${this.$D2ApiPath}/api/inspection/getLineTargetList?date=` + this.date.replace(/-/g, ""), { headers: { Authorization: token } } )
            .then(response => {
              this.tableItems = response.data     // 반환되는 값을 toDoItems에 저장한다.
              //console.log(response.data.date);
              this.loading=false;
              if(!response.data[0]) this.nodata=true;
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
          this.loadingweek=true;
          this.nodataweek=false;
          const token = localStorage.getItem('token')
          var today = new Date()
          var first = today.getDate() - today.getDay() +1;
          var firstday = this.formatDate(new Date(today.setDate(first)))
          this.computedDateweek=firstday
          axios.get(`${this.$D2ApiPath}/api/inspection/getLineTargetListWeek?date=` + firstday.replace(/-/g, ""), { headers: { Authorization: token } } )
            .then(response => {
              this.tableWeekItems = response.data  
              this.loadingweek=false;
              if(!response.data[0]) this.nodataweek=true;
            })
        },
        retrieveCalendarWeek2(val){
          this.loadingweek=true;
          this.nodataweek=false;
          var today = new Date(val)
          var first = today.getDate() - today.getDay() +1;
          var firstday = new Date(today.setDate(first)).toISOString().substr(0, 10)
          this.computedDateweek=firstday
          const token = localStorage.getItem('token')
          axios.get(`${this.$D2ApiPath}/api/inspection/getLineTargetListWeek?date=` + firstday.replace(/-/g, ""), { headers: { Authorization: token } } )
            .then(response => {
              this.tableWeekItems = response.data  
              this.loadingweek=false;
              if(!response.data[0]) this.nodataweek=true;
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