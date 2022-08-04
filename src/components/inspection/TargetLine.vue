<template>
  <div id="app">
    <v-app id="inspire" style="background:white;">
      <v-container style="padding:0;">
              <v-row align="center" style="padding:0;">
                <v-col cols="12" sm="6" style="padding-top:5px;padding-bottom:0px;padding-left:15px;padding-right:10px">
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
                <v-col class="d-flex" cols="12" sm="6" style="margin-top:18px;padding-top:0px;padding-bottom:0px;padding-left:30px;padding-right:30px">
                        <v-select
                          v-model="selected"
                          :items="zones"
                          item-text="name" 
                          item-value="value"
                          label="주간/야간"
                          @input="setSelected"
                          dense
                        ></v-select>
                </v-col>
              </v-row>
      </v-container>

      <v-container grid-list-md text-xs-center fluid style="padding-top:5px;padding-bottom:5px;padding-left:12px;padding-right:12px"
            v-for="item in this.tableItems"
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
                      :value="item.NUM"
                      :content="item.NUM"
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
                  <v-col  style="text-align:right">
                    <div v-if="item.GOOD_QTY > 0">
                      

                         <!--
                      <input type="hidden" name="fLINE" value="@{{ item.WORK_SHOP_ID }}"  v-model="fLINE">
                      <input type="hidden" name="fPART" value="@{{ item.PART_ID }}"  v-model="fPART">
                      -->
                            <v-btn class="ma-2" tile outlined color="success" @click="callTargetSPC(item.WORK_SHOP_ID,item.PART_ID)">
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
    data:() => {
       const zones = [ {name:'전체', value:''}, {name:'주간', value:'주간'},{name:'야간', value:'야간'}  ]
        return{
                  date: new Date().toISOString().substr(0, 10),
                  modal: false,
        
                  tableItems: [],
                  dayornot: 0,
                  zones, selected: zones[0]
                  
        }
    },
    
    created(){
        const currHour = new Date().getHours()
        if (currHour >=8 && currHour <=19 ){ this.dayornot= 1 }
        else if ( (currHour >= 1 && currHour < 8) || (currHour >= 20 && currHour <= 24 ) ){ this.dayornot= 2 }
        
        axios.get('/api/inspection/getLineTargetList?date=' + this.date.replace(/-/g, "")+'&zone=' + this.zones[this.dayornot].value ) // http://localhost:3000/api/inspection/GetDoList/에 get call을 한다.
            .then(response => {
              this.tableItems = response.data     // 반환되는 값을 toDoItems에 저장한다.
              //console.log(response.data.date);
            })
    },
      methods:{
        retrieveCalendar(){
          let pickdate=this.date;
          axios.get('/api/inspection/getLineTargetList?date=' + pickdate.replace(/-/g, "")) // http://localhost:3000/api/inspection/GetDoList/에 get call을 한다.
            .then(response => {
              this.tableItems = response.data     // 반환되는 값을 toDoItems에 저장한다.
              //console.log(response.data.date);
            })
        },
        callTargetSPC(fLINE,fPART) {
         // let pickedLINE=this.fLINE;
         // let pickedPART=this.fPART;
            //this.$router.push("/inspection/tl/ts?"+fLINE+"&"+fPART);
            this.$router.push({path: '/inspection/tl/ts', name: '조회/입력-공정조회', query:{line: fLINE, part: fPART}});
            //console.log(fLINE)
        },
        setSelected(selectedzone) {
          //  trigger a mutation, or dispatch an action  
          let pickdate=this.date;
          axios.get('/api/inspection/getLineTargetList?date=' + pickdate.replace(/-/g, "") +'&zone='+ selectedzone) // http://localhost:3000/api/inspection/GetDoList/에 get call을 한다.
            .then(response => {
              this.tableItems = response.data     // 반환되는 값을 toDoItems에 저장한다.
              //console.log(response.data.date);
            })
        }
      },
  }
</script>