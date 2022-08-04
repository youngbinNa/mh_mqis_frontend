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

      <v-container grid-list-md text-xs-center fluid style="padding-top:5px;padding-bottom:5px;padding-left:12px;padding-right:12px" app
            v-for="(item,index) in filteredTables"
            :key="item.INDEX_KEY">
          <v-card :style="{borderLeft: getLeftColor[index]}"
            class="mx-auto"
            outlined
            elevation="2">
            <v-list-item two-line>
              <v-list-item-content>
                <v-row>
                  <v-col style="padding:0">
                    <v-row>
                        
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
                    </v-row>
                  </v-col>
                  <v-col >
                      <v-list-item-title class="headline"><v-chip outlined>{{item.WORK_SHOP_ID}}</v-chip>  {{item.TIME_ZONE_ID}}</v-list-item-title>
                      <v-list-item-subtitle class="headline">{{item.PART_ID}}</v-list-item-subtitle>
                      <v-list-item-title class="headline">{{item.WORK_SHOP_NAME}}</v-list-item-title>
                  </v-col>
                  <!--
                  <v-col >
                      <v-list-item-subtitle class="headline">계획: {{item.PLAN_QTY}}</v-list-item-subtitle>
                      <v-list-item-subtitle class="headline">실적: {{item.GOOD_QTY}}</v-list-item-subtitle>
                  </v-col>
                  -->
                  <v-col  style="text-align:right">
                    <div v-if="item.IS_OK > 0">
                        <v-chip class="ma-2" outlined color="error">불합격</v-chip>
                    </div>
                    <div v-if="item.IS_TARGET == 1">
                      <div v-if="item.IS_MANUAL == 'Y'">
                          <v-chip class="ma-2" outlined color="info">수동라인</v-chip>
                      </div>
                                               <!--
                      <input type="hidden" name="fLINE" value="@{{ item.WORK_SHOP_ID }}"  v-model="fLINE">
                      <input type="hidden" name="fPART" value="@{{ item.PART_ID }}"  v-model="fPART">
                      -->
                            <v-btn class="ma-2" tile outlined color="success" @click="callTargetSPC(item.WORK_SHOP_ID,item.PART_ID,getThisDate(),item.TIME_ZONE_ID)">
                              <v-icon left>mdi-file-search-outline</v-icon> 공정조회
                            </v-btn>
                      <div v-if="item.IS_MANUAL == 'Y'">
                            <v-btn class="ma-2" tile outlined color="error" @click="deleteItem(item.INDEX_KEY,'N',item.WORK_SHOP_ID,item.PART_ID)">
                              <v-icon left>mdi-content-cut</v-icon> 등록 취소
                            </v-btn>
                      </div>
                    </div>
                    <div v-else>
                      
                            <v-btn class="ma-2" tile outlined color="error" @click="deleteItem(item.INDEX_KEY,'Y',item.WORK_SHOP_ID,item.PART_ID)">
                              <v-icon left>mdi-file-search-outline</v-icon> 검사대상 등록
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
                  dialogDelete: false,
                  editedItem: {
                    INDEX_KEY: 0,
                    IS_MANUAL: '',
                    WORK_SHOP_ID:'',
                    PART_ID:'',
                    CAN_OK:'',
                  },
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
      getLeftColor() {
            return this.filteredTables.map(function(item) {
                return (item.TIME_ZONE_ID=='주간') ? '10px solid orange' : '10px solid rgb(25 25 112)'
            });
      },
    },
    created(){
        const currHour = new Date().getHours()
        if (currHour >=9 && currHour <21 ){ this.filter= '주간' }
        //else if ( (currHour >= 0 && currHour < 9) || (currHour >= 21 && currHour <= 24 ) ){ this.filter= '야간' }
        else { this.filter= '야간' }
        this.filter2 = '1' //검사 대상

        this.retrieveCalendar()
    },
    methods:{
        retrieveCalendar(){
          //let pickdate=this.date;
          const token = localStorage.getItem('token')
          axios.get(`${this.$SuwonApiPath}/api/inspection/getLineTargetList?date=` + this.date.replace(/-/g, ""), { headers: { Authorization: token } } )
            .then(response => {
              this.tableItems = response.data     // 반환되는 값을 toDoItems에 저장한다.
              //console.log(response.data.date);
            })
        },
        callTargetSPC(qLINE,qPART,pWORK_DATE,pZONE) {
         // let pickedLINE=this.fLINE;
         // let pickedPART=this.fPART;
            //this.$router.push("/inspection/tl/ts?"+fLINE+"&"+fPART);
            this.$router.push({path: '/sw/inspection/tl/ts', name: '공정조회(수원)', query:{line: qLINE, part: qPART,workdate: pWORK_DATE.replace(/-/g, ""), zone: pZONE}});
            //console.log(fLINE)
        },
        updateIS_MANUAL(){
            const token = localStorage.getItem('token')
            axios.patch(`${this.$SuwonApiPath}/api/inspection/tl/manual?index_key=` + this.editedItem.INDEX_KEY+'&pIS_MANUAL='+this.editedItem.IS_MANUAL, { headers: { Authorization: token } } )
            .then(() => {
              this.retrieveCalendar() 
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
        closeDelete () {
          this.dialogDelete = false
        },
      },
  }
</script>