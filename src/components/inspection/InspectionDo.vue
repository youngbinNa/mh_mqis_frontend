<template>
  <div id="app">
    <v-app id="inspire" style="background:white;">
      <form @submit.prevent="retrieveCalendar">
        <div class="form-group" style="padding:12px">
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
      
      <v-container grid-list-md text-xs-center fluid style="padding-top:5px;padding-bottom:5px;padding-left:12px;padding-right:12px"
       v-for="item in this.tableItems"
                  :key="item.INDEX_KEY">
        <v-card :style="{borderLeft: item.DAY_COLOR}"
          class="mx-auto"
          outlined
          elevation="2"
                
        >
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
                    <v-btn class="ma-2" tile outlined color="success">
                      <v-icon left>mdi-file-search-outline</v-icon> 공정조회
                    </v-btn>
                  </div>
                </v-col>
              </v-row>
            </v-list-item-content>
          </v-list-item>
          <!--
          <v-card-text>
            <v-row align="center">
              <v-col>
                <v-list-item three-line>
                <v-list-item-content>
                  <v-list-item-subtitle >{{item.PART_ID}}</v-list-item-subtitle>
                  <v-list-item-title class="headline">{{item.PART_NAME}}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              </v-col>
              <v-col cols="2">
                <v-chip
                    class="ma-2"
                    color="green"
                    text-color="white"
                  >
                    합격
                  </v-chip>
              </v-col>
            </v-row>
          </v-card-text>
          -->
      <!--
          <v-list class="transparent">
            <v-list-item
              v-for="item in forecast"
              :key="item.day"
            >
              <v-list-item-title>{{ item.day }}</v-list-item-title>
      
              <v-list-item-icon>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-item-icon>
      
              <v-list-item-subtitle class="text-right">
                {{ item.temp }}
              </v-list-item-subtitle>
            </v-list-item>
          </v-list>
      
          <v-divider></v-divider>
      
          <v-card-actions>
            <v-btn text>Full Report</v-btn>
          </v-card-actions>
          
          <v-progress-linear
            v-model="skill"
            color="rgb(71, 156, 200)"
            height="25"
          >
            <template v-slot="{ value }">
              <strong>{{ Math.ceil(value) }}%</strong>
            </template>
          </v-progress-linear>
          -->
        </v-card>
      </v-container>
    </v-app>
  </div>
</template>


<script>
import axios from 'axios'

  export default {
    name: 'InspectionDo',
    data:() => {
        return{
                  date: new Date().toISOString().substr(0, 10),
                  modal: false,
        
                  tableItems: [],
        }
    },
    
    created(){
        axios.get('/api/inspection/getLineTargetList/' + this.date.replace(/-/g, "")) // http://localhost:3000/api/inspection/GetDoList/에 get call을 한다.
            .then(response => {
              this.tableItems = response.data     // 반환되는 값을 toDoItems에 저장한다.
              //console.log(response.data.date);
            })
    },
      methods:{
        retrieveCalendar(){
          let pickdate=this.date;
          axios.get('/api/inspection/getLineTargetList/' + pickdate.replace(/-/g, "")) // http://localhost:3000/api/inspection/GetDoList/에 get call을 한다.
            .then(response => {
              this.tableItems = response.data     // 반환되는 값을 toDoItems에 저장한다.
              //console.log(response.data.date);
            })
        }
      },
  }
</script>