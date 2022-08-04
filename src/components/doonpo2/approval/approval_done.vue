<template>
<div>
    <v-toolbar flat>
                    <v-col>
                      <v-toolbar-title>결재완료</v-toolbar-title>
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
                                  clearable
                                  v-model="date"
                                  label="FROM"
                                  prepend-icon="mdi-calendar"
                                  readonly
                                  v-bind="attrs"
                                  v-on="on"
                                ></v-text-field>
                              </template>
                              <v-date-picker v-model="date" locale="ko-kr" :day-format="date => date.split('-')[2]" scrollable>
                                <v-spacer></v-spacer>
                                <v-btn text color="primary" @click="modal = false">취소</v-btn>
                                <v-btn text color="primary" @click="$refs.dialog.save(date)">확인</v-btn>
                                  </v-date-picker>
                            </v-dialog>
                        </template>
                      </v-col>
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
                                  v-model="dateweek"
                                  label="TO"
                                  prepend-icon="mdi-calendar"
                                  readonly
                                  v-bind="attrs"
                                  v-on="on"
                                ></v-text-field>
                              </template>
                              <v-date-picker v-model="dateweek" locale="ko-kr" :day-format="dateweek => dateweek.split('-')[2]" scrollable>
                                <v-spacer></v-spacer>
                                <v-btn text color="primary" @click="modalweek = false">취소</v-btn>
                                <v-btn text color="primary" @click="$refs.dialogweek.save(dateweek)">확인</v-btn>
                              </v-date-picker>
                            </v-dialog>
                        </template>
                    </v-col>
                    <v-col>
                        <v-btn @click="retrieveCalendar" tile outlined type="submit"  color="success"><v-icon left>mdi-magnify</v-icon> 조회</v-btn>
                    </v-col>
        </v-toolbar>
                 <v-row class="pa-0 ma-0 justify-center">
                    <v-col class="px-4" style="text-align:center;">
                        <v-data-table id="approvTable"
                          item-key="INDEX_KEY"
                          :headers="headers"
                          :items="tableItems"
                          :search="search"
                          fixed-header
                          >
                          <template v-slot:header.data-table-select="{ on , props }">
                              <v-simple-checkbox
                                color="primary"
                                :ripple="false"
                                v-bind="props"
                                v-on="on"
                              />
                          </template>
                          <template v-slot:item.WORK_DATE="{ item }">
                            <v-btn  link block text class="ma-0 pa-0 text-h6 justify-center text-decoration-underline primary--text" 
                            :to="{path: '/SW/approval/doc_done', query:{workdate: item.WORK_DATE, zone: item.ZONE, jgcd: item.JGCD, ok: item.OK_NUM, yet: item.YET_NUM, def: item.DEF_ITEMS}}"  >{{ getDateFormat(item.WORK_DATE) }}</v-btn>
                          </template>
                          <template v-slot:item.ZONE="{ item }">
                            <span class="ma-0 text-h6"  >{{ item.ZONE }}</span>
                          </template>
                          <template v-slot:item.JGCD="{ item }">
                            <span :class="getColor(item.JGCD)">{{ item.JGCD }} 단위</span>
                          </template>
                          <template v-slot:item.OK_NUM="{ item }">
                            <span :class="getOkColor(item.OK_NUM)" >{{ item.OK_NUM }} 라인</span>
                          </template>
                          <template v-slot:item.YET_NUM="{ item }">
                            <span class="ma-0 text-h6"  >{{ item.YET_NUM }} 라인</span>
                          </template>
                          <template v-slot:item.OK_ITEMS="{ item }">
                            <span class="ma-0 text-h6"  >{{ item.OK_ITEMS }} 항목</span>
                          </template>
                          <template v-slot:item.DEF_ITEMS="{ item }">
                            <span :class="getDefectColor(item.DEF_ITEMS)" >{{ item.DEF_ITEMS }} 항목</span>
                          </template>
                          <template v-slot:item.STATUS>
                            <span class="ma-0 text-h6" >*승인됨</span>
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
    data() {
        return{
                  date: '',
                  dateweek: new Date().toISOString().substr(0, 10),
                  modal: false,modalweek: false,
                  tableItems: [],
                  search: '',
                  dialogDelete: false,
                  headers: [
                      { text: '검사일', value: 'WORK_DATE',width: "80px", class: "text-h6 font-weight-bold ma-0 pa-0", align:"center" },
                      { text: '주/야', value: 'ZONE',width: "70px", class: "text-h6 font-weight-bold", align:"center"},
                      { text: '주기', value: 'JGCD',width: "70px", class: "text-h6 font-weight-bold", align:"center"},
                      { text: '완료', value: 'OK_NUM',width: "100px", class: "text-h6 font-weight-bold", align:"center"},
                      { text: '미완료', value: 'YET_NUM',width: "100px", class: "text-h6 font-weight-bold", align:"center"},
                      { text: '합격', value: 'OK_ITEMS',width: "130px", class: "text-h6 font-weight-bold", align:"center"},
                      { text: '불합격', value: 'DEF_ITEMS',width: "100px", class: "text-h6 font-weight-bold", align:"center"},
                      { text: '상태', value: 'STATUS',width: "100px", class: "text-h6 font-weight-bold", align:"center"},
                      //{ text: '검사결과', value: 'RSLT',width: "80px", class: "orange lighten-5 warning--text" },
                      //{ text: '판정결과', value: 'IS_OK',width: "80px", class: "orange lighten-5 warning--text"},
                ],
          }
    },
    created(){
        this.retrieveCalendar()
    },
    computed:{
      getFrom(){
        return this.date ? this.date.replace(/-/g, "") : null
      },
    },
    methods:{
      retrieveCalendar(){
        //let pickdate=this.date;
        const token = localStorage.getItem('token')
        // axios.get(`${this.$SuwonApiPath}/api/dashboard/get1/`+ this.date.replace(/-/g, "")+'/'+ '주간', { headers: { Authorization: token } } )
        axios.get(`${this.$D2ApiPath}/api/approval/done?from=` + this.getFrom +'&to='+ this.dateweek.replace(/-/g, ""), { headers: { Authorization: token } } )
          .then(response => {
            this.tableItems = response.data     // 반환되는 값을 toDoItems에 저장한다.
            //console.log(response.data);
          })
          .catch(function (error) {
            console.log(error);
          })
      },
      getColor (jgcd) {
        if (jgcd == '주') return 'ma-0 text-h6 warning--text'
        else return 'ma-0 text-h6 info--text'
      },
      getOkColor(oknum) {
        if (oknum<1) return 'ma-0 text-h6 error--text'
        else return 'ma-0 text-h6'
      },
      getDefectColor (defect) {
        if (defect>0) return 'ma-0 text-h6 error--text'
        else return 'ma-0 text-h6 success--text'
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
#approvTable table thead tr th + th { border-left:1px solid #dddddd !important; }
#approvTable table tbody tr td + td { border-left:1px solid #dddddd !important; }
</style>