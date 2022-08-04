<template>
<div>
    <v-toolbar flat>
                    <v-col>
                      <v-toolbar-title>월간 불합격 항목</v-toolbar-title>
                    </v-col>
                    <v-col>
                      <v-text-field
                        v-model="search"
                        append-icon="mdi-magnify"
                        label="검색"
                        single-line
                        hide-details
                      ></v-text-field>
                    </v-col>
                    <v-col>
                      <v-dialog
                        ref="dialog"
                        v-model="modal"
                        :return-value.sync="date"
                        persistent
                        width="290px"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            class="pt-2"
                            hide-details
                            v-model="date"
                            label="기준 월"
                            prepend-icon="mdi-calendar"
                            readonly
                            v-bind="attrs"
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          v-model="date"
                          type="month"
                          scrollable
                          locale="ko-kr"
                        >
                          <v-spacer></v-spacer>
                          <v-btn
                            text
                            color="primary"
                            @click="modal = false"
                          >
                            취소
                          </v-btn>
                          <v-btn
                            text
                            color="primary"
                            @click="$refs.dialog.save(date)"
                          >
                            확인
                          </v-btn>
                        </v-date-picker>
                      </v-dialog>
                    </v-col>
                    <div class="justify-end" style="text-align:right">
                      <v-btn @click="retrieveCalendar" tile outlined type="submit"  color="success"><v-icon left>mdi-magnify</v-icon> 조회</v-btn>
                    </div>
                 </v-toolbar>
                 <v-row class="pa-0 ma-0 justify-center">
                    <v-col class="px-4" style="text-align:center;">
                        <v-data-table
                          item-key="INDEX_KEY"
                          single-select
                          :headers="headers"
                          :items="tableItems"
                          :search="search"
                          fixed-header
                          >
                          <template v-slot:item.WORK_DATE="{ item }">
                            <span class="ma-0 pa-0">{{ getDateFormat(item.WORK_DATE) }}</span>
                          </template>
                          <template v-slot:item.JGCD="{ item }">
                            <v-chip class="ma-0" :color="getColor(item.JGCD)" dark >{{ item.JGCD }}</v-chip>
                          </template>
                          <template v-slot:item.COND="{ item }">
                            <span class="ma-0 pa-0 font-weight-bold">{{ item.COND }}</span>
                          </template>
                          <template v-slot:item.RSLT="{ item }">
                            <span class="ma-0 pa-0 font-weight-bold">{{ item.RSLT }}</span>
                          </template>
                          <template v-slot:item.IS_OK="{ item }">
                            <v-chip class="ma-0" color="error" outlined >{{ item.IS_OK }}</v-chip>
                          </template>
                          <template v-slot:no-data>
                            <v-alert dense :value="true" text type="success">
                              해당 월에 불합격 항목이 없습니다.
                            </v-alert>
                          </template>
                      </v-data-table>
                    </v-col>
                </v-row>
</div>
</template>

<script>
import axios from 'axios'

export default {
    //name: 'DashBoardSuwon',
    components: {
//      apexchart: VueApexCharts,
    },
    props: {
      workplace: String,
    },
    data() {
        return{
                  date: new Date().toISOString().substr(0, 7),
                  modal: false,
                  tableItems: [],
                  search: '',
                  headers: [
                      { text: '일자', align: 'start', value: 'WORK_DATE',width: "80px", class: "orange lighten-5 warning--text" },
                      { text: '주/야', value: 'ZONE',width: "70px", class: "orange lighten-5 warning--text"},
                      { text: '주기', value: 'JGCD',width: "70px", class: "orange lighten-5 warning--text"},
                      { text: '라인명', value: 'SHOPNM',width: "100px", class: "orange lighten-5 warning--text"},
                      { text: '품명', value: 'PARTNM',width: "100px", class: "orange lighten-5 warning--text"},
                      { text: '제품/공정', value: 'NANM',width: "130px", class: "orange lighten-5 warning--text"},
                      { text: '규격', value: 'COND',width: "100px", class: "orange lighten-5 warning--text"},
                      { text: '검사결과', value: 'RSLT',width: "80px", class: "orange lighten-5 warning--text" },
                      { text: '판정결과', value: 'IS_OK',width: "80px", class: "orange lighten-5 warning--text"},
                ],
          }
    },
    created(){
        this.retrieveCalendar()
    },
    methods:{
      retrieveCalendar(){
        //let pickdate=this.date;
        const token = localStorage.getItem('token')
        // axios.get(`${this.$SuwonApiPath}/api/dashboard/get1/`+ this.date.replace(/-/g, "")+'/'+ '주간', { headers: { Authorization: token } } )
        axios.get(this.workplace+'/api/dashboard/get4?date=' + this.date.replace(/-/g, ""), { headers: { Authorization: token } } )
          .then(response => {
            this.tableItems = response.data     // 반환되는 값을 toDoItems에 저장한다.
            //console.log(response.data.date);
          })
      },
      getColor (jgcd) {
        if (jgcd == '주') return 'orange'
        else return 'blue'
      },
      getDateFormat (a) {
        var b=this.getDay(a)
        return [a.slice(0, 4), "-", a.slice(4, 6), "-", a.slice(6, 8),' ('+b+')'].join('')
      },
      getDay(Ymd) { 
        var weekName = new Array('일','월','화','수','목','금','토'); 
        var year = Ymd.substring(0,4); 
        var month = Ymd.substring(4,6); 
        var day = Ymd.substring(6,8); 
        var week = new Date(year, month-1, day, 0,0,0,0); 
        week = weekName[week.getDay()]; 
        return week; 
      },
    },
  }
</script>
<style lang="scss">
</style>