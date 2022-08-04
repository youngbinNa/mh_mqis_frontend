<template>
  <div id="app">
    <v-app id="inspire" >
      <v-container style="padding:0;">
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
                                  <v-btn v-on:click="retrieveCalendar" type="submit" text color="primary" @click="$refs.dialog.save(date)">확인</v-btn>
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
      </v-container>

      <v-container grid-list-md text-xs-center fluid style="padding-top:5px;padding-bottom:5px;padding-left:12px;padding-right:12px"
            v-for="(item,index) in filteredTables"
            :key="item.INDEX_KEY">
          <v-card :style="{borderLeft: item.DAY_COLOR}"
            class="mx-auto"
            outlined
            elevation="2">
            <v-list-item two-line>
              <v-list-item-content>
                <v-row>
                  <v-col >
                    <v-badge style="margin-left:25px"
                      color="grey"
                      left
                      :value="index+1"
                      :content="index+1"
                    >
                      <v-list-item-title class="headline">{{item.WORK_SHOP_ID}}  {{item.TIME_ZONE_ID}}  {{item.PART_ID}}</v-list-item-title>
                    </v-badge>
                      <v-list-item-subtitle style="margin-left:25px">{{item.WORK_SHOP_NAME}}</v-list-item-subtitle>
                      <span style="margin-left:25px">{{item.PART_NAME}}</span>
                  </v-col>
                  <v-col >
                    <v-list-item-title >계획: {{item.PLAN_QTY}}</v-list-item-title>
                    <v-list-item-title >실적: {{item.GOOD_QTY}}</v-list-item-title>
                  </v-col>
                  <v-col style="padding:0">
                    <v-row>
                      <v-col style="text-align:center;padding-top:0px;padding-bottom:0px;padding-left:0px;padding-right:12px">
                          <v-progress-circular rotate="270"
                                              size="100"
                                              :value="getNum(item.IS_DONE/item.TOTAL)*100"
                                              width="4"
                                              color=#479cc8>완료: {{Math.round(getNum(item.IS_DONE/item.TOTAL)*100)}}%<br/>{{item.IS_DONE}} / {{item.TOTAL}}
                          </v-progress-circular>
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col  style="text-align:right">
                    <div v-if="item.IS_TARGET == 1">
                      

                         <!--
                      <input type="hidden" name="fLINE" value="@{{ item.WORK_SHOP_ID }}"  v-model="fLINE">
                      <input type="hidden" name="fPART" value="@{{ item.PART_ID }}"  v-model="fPART">
                      -->
                            <v-btn class="ma-2" tile outlined color="success" @click="callTargetSPC(item.WORK_SHOP_ID,item.PART_ID,getThisDate(),item.TIME_ZONE_ID)">
                              <v-icon left>mdi-file-search-outline</v-icon> 공정조회
                            </v-btn>
                    </div>
                  </v-col>
                </v-row>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </v-container>
     
    </v-app>
  </div>
</template>


<script>
import axios from 'axios'

  export default {
    name: 'TargetLine',
    data() {
        return{
                  date: new Date().toISOString().substr(0, 10),
                  modal: false,
        
                  tableItems: [],
                  //dayornot: 0,
                  zones : [ {name:'전체', value:''}, {name:'주간', value:'주간'},{name:'야간', value:'야간'}  ], 
                  istarget : [ {name:'전체', value:''}, {name:'대상', value: '1'},{name:'비대상', value: '0'}  ], 
                  filter: '', filter2:'',
                  
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
    },
    created(){
        const currHour = new Date().getHours()
        const token = localStorage.getItem('token')
        if (currHour >=9 && currHour <=21 ){ this.filter= '주간' }
        else if ( (currHour >= 0 && currHour < 9) || (currHour > 21 && currHour <= 24 ) ){ this.filter= '야간' }
        this.filter2 = '1' //검사 대상

        axios.get('/api/inspection/getLineTargetList?date=' + this.date.replace(/-/g, ""), { headers: { Authorization: token } }) 
            .then(response => {
              this.tableItems = response.data     // 반환되는 값을 toDoItems에 저장한다.
              //console.log(response.data.date);
            })
    },
    methods:{
        retrieveCalendar(){
          //let pickdate=this.date;
          const token = localStorage.getItem('token')
          axios.get('/api/inspection/getLineTargetList?date=' + this.date.replace(/-/g, ""), { headers: { Authorization: token } } ) // http://localhost:3000/api/inspection/GetDoList/에 get call을 한다.
            .then(response => {
              this.tableItems = response.data     // 반환되는 값을 toDoItems에 저장한다.
              //console.log(response.data.date);
            })
        },
        callTargetSPC(qLINE,qPART,pWORK_DATE,pZONE) {
         // let pickedLINE=this.fLINE;
         // let pickedPART=this.fPART;
            //this.$router.push("/inspection/tl/ts?"+fLINE+"&"+fPART);
            this.$router.push({path: '/inspection/tl/ts', name: '공정조회', query:{line: qLINE, part: qPART,workdate: pWORK_DATE.replace(/-/g, ""), zone: pZONE}});
            //console.log(fLINE)
        },
        getNum(val) {
          val = +val || 0
          return val;
        },
        getThisDate() {
          return this.date;
        }
      },
  }
</script>