<template>
  <div id="app">
    <v-app id="inspire" >
      <v-container style="padding:0;" app>
        <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="headline">{{ getDateFormat(apprItems.WORK_DATE) }} {{$route.query.jgcd}} 단위 검사를<br>결재 하시겠습니까?</v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn class="font-weight-bold" color="blue darken-1" text @click="closeDelete">취소</v-btn>
                <v-btn class="font-weight-bold" color="blue darken-1" text @click="deleteItemConfirm">확인</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
      </v-container>
              <div>
                <v-toolbar dense flat>
                  <v-toolbar-title>{{$route.query.jgcd}} 단위 검사</v-toolbar-title>
                  <v-col class="ma-0 pa-0 justify-end"  style="text-align:right">
                    <v-btn outlined tile class="text-h6" color="primary" link :to="{path: '/SW/approval/done'}" ><v-icon left>mdi-format-list-bulleted</v-icon> 목록</v-btn>
                    <template v-if="isApproved">
                        <v-btn outlined tile class="ml-5 text-h6" color="success" @click="dialogDelete = true"><v-icon left>mdi-draw</v-icon> 승인</v-btn>
                    </template>
                  </v-col>
                </v-toolbar>
              </div>
              
            <div>
              <v-card-text class="pt-0 mt-0 pb-0">
                      <v-row>
                      <v-col class="px-3">
                        <v-simple-table dense>
                          <template v-slot:default>
                            <tbody>
                              <tr>
                                <td class="text-h6">검사일</td>
                                <td class="text-h6">{{ getDateFormat(apprItems.WORK_DATE) }}</td>
                              </tr>
                              <tr>
                                <td class="text-h6">완료</td>
                                <td class="text-h6">{{$route.query.ok}} 라인</td>
                              </tr>
                              <tr>
                                <td class="text-h6">미완료</td>
                                <td class="text-h6">{{$route.query.yet}} 라인</td>
                              </tr>
                              <tr>
                                <td class="text-h6">불합격</td>
                                <td class="text-h6">{{$route.query.def}} 항목</td>
                              </tr>
                            </tbody>
                          </template>
                        </v-simple-table>
                      </v-col>
                        <v-divider vertical></v-divider>
                      <v-col >
                        <v-simple-table >
                          <template v-slot:default>
                            <tbody>
                              <tr>
                                <td class="text-h6">상태</td>
                                <template v-if="isApproved">
                                  <td><v-chip class="ml-2 text-h6" outlined color="error">결재중</v-chip> </td>
                                </template>
                                <template v-else>
                                  <td><v-chip class="ml-2 text-h6" outlined color="success">승인됨</v-chip> </td>
                                </template>
                              </tr>
                              <tr>
                                <td class="text-h6">결재일</td>
                                <template v-if="!isApproved">
                                  <td class="text-h6">{{ getDateFormat(formatDate2(apprItems.APPR_DATE)) }}</td>
                                </template>
                                <template v-else>
                                  <td></td>
                                </template>
                              </tr>
                              <tr>
                                <td class="text-h6">결재자</td>
                                <td class="text-h6">{{apprItems.kname}} {{apprItems.rank_name}}</td>
                              </tr>
                            </tbody>
                          </template>
                        </v-simple-table>
                      </v-col>
                      </v-row>
                    </v-card-text>
              </div>
      
      <v-container v-if="loading" grid-list-md text-xs-center fluid style="padding-top:5px;padding-bottom:5px;padding-left:12px;padding-right:12px">
        <v-card class="mx-auto mb-3" outlined elevation="2"><v-skeleton-loader loading height="150" type="list-item-avatar-two-line"></v-skeleton-loader></v-card>
        <v-card class="mx-auto mb-3" outlined elevation="2"><v-skeleton-loader loading height="150" type="list-item-avatar-two-line"></v-skeleton-loader></v-card>
        <v-card class="mx-auto mb-3" outlined elevation="2"><v-skeleton-loader loading height="150" type="list-item-avatar-two-line"></v-skeleton-loader></v-card>
        <v-card class="mx-auto mb-3" outlined elevation="2"><v-skeleton-loader loading height="150" type="list-item-avatar-two-line"></v-skeleton-loader></v-card>
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
                        <v-list-item-title class="text-h5"><v-chip outlined>{{item.WORK_SHOP_ID}}</v-chip>
                          <v-chip class="ml-2" outlined :color="getZoneColor(item.TIME_ZONE_ID)">{{item.TIME_ZONE_ID}}</v-chip>  
                          <template v-if="item.IS_TARGET == 1">
                            <template v-if="item.IS_MANUAL == 'Y'">
                                <v-chip class="ml-2"  outlined color="info">수동라인</v-chip>
                            </template></template>
                        </v-list-item-title>
                        <v-card flat class="grey--text text-h5 text--darken-1 ml-2">{{item.PART_ID}}</v-card>
                        <v-card flat class="text-h5 ml-2">{{item.WORK_SHOP_NAME}}</v-card>
                        <v-card flat class="grey--text text-h5 text--darken-1 ml-2">{{item.PART_NAME}}</v-card>
                    </v-col>
                  </v-row>
                  <v-row class="pa-0 ma-0">
                    <v-col  style="text-align:right" >
                      <template v-if="item.IS_OK > 0">
                          <v-chip class="ma-2" outlined color="error">불합격</v-chip>
                      </template>
                      <template >
                          <v-btn class="ma-2" tile outlined color="success" @click="callTargetSPC(item.WORK_SHOP_ID,item.PART_ID,$route.query.workdate,item.TIME_ZONE_ID,$route.query.jgcd)">
                            <v-icon left>mdi-file-search-outline</v-icon> 공정조회
                          </v-btn>
                      </template>
                    </v-col>
                  </v-row>
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
            loading:true,
                  tableItems: [],tableWeekItems:[],apprItems:[],
                  //dayornot: 0,
                  zones : [ {name:'전체', value:''}, {name:'주간', value:'주간'},{name:'야간', value:'야간'}  ], 
                  istarget : [ {name:'전체', value:''}, {name:'대상', value: '1'},{name:'비대상', value: '0'}  ], 
                  filter: '', filter2:'',
                  allowedDates: val => new Date(val).getDay() === 1,
                  isApproved: true,
                  dialogDelete: false,
        }
    },
    computed: {
      filteredTables() {
        return this.tableItems.filter(param => 
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
    },

    created(){
        //const currHour = new Date().getHours()
        //if (currHour >=9 && currHour <21 ){ this.filter= '주간' }
        //else if ( (currHour >= 0 && currHour < 9) || (currHour >= 21 && currHour <= 24 ) ){ this.filter= '야간' }
        //else { this.filter= '야간' }
        this.filter= '주간'
        this.filter2 = '1' //검사 대상
        this.getApproved()
        this.fetchData()
        
    },
    methods:{
        async fetchData(){
          this.loading=true;
          //const apiRes= await this.createData()
          try {
            const token = localStorage.getItem('token')
            if(this.$route.query.jgcd == "주"){
              const response = await axios.get(`${this.$SuwonApiPath}/api/inspection/getLineTargetListWeek?date=` + this.$route.query.workdate, { headers: { Authorization: token } } );
              this.tableItems = response.data 
              this.loading=false;
            }else{
              const response = await axios.get(`${this.$SuwonApiPath}/api/inspection/getLineTargetList?date=` + this.$route.query.workdate, { headers: { Authorization: token } } );
              this.tableItems = response.data 
              this.loading=false;
            }
          } catch (error) {
            console.error(error);
            this.loading=false;
          }
          
        },
        async getApproved(){
          const token = localStorage.getItem('token')
          const response = await axios.get(`${this.$SuwonApiPath}/api/approval/doc?date=` + this.$route.query.workdate+'&jgcd='+ this.$route.query.jgcd, { headers: { Authorization: token } } )
          //console.log(response.data[0])
          this.apprItems = response.data[0]
          //console.log(this.apprItems)
          this.isApproved = response.data[0].STATUS===2 ? true : false
          
            //.then(response => {
              //this.apprItems = response.data     // 반환되는 값을 toDoItems에 저장한다.
              //console.log(this.apprItems[0].STATUS);
              //apprItems[0].STATUS===2
            //})
        },
        retrieveCalendar(){
          //let pickdate=this.date;
          const token = localStorage.getItem('token')
          axios.get(`${this.$SuwonApiPath}/api/inspection/getLineTargetList?date=` + this.date.replace(/-/g, ""), { headers: { Authorization: token } } )
            .then(response => {
              this.tableItems = response.data     // 반환되는 값을 toDoItems에 저장한다.
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
        formatDate2(date) {
            var d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2) 
                month = '0' + month;
            if (day.length < 2) 
                day = '0' + day;

            return [year, month, day].join('');
        },
        getDateFormat (a) {
          if(a){
            var b=this.getDay(a)
            return [a.slice(0, 4), "-", a.slice(4, 6), "-", a.slice(6, 8),' ('+b+')'].join('')
          }
      },
        getDay(Ymd) {
          if(Ymd){
            var weekName = new Array('일','월','화','수','목','금','토'); 
            var year = Ymd.substring(0,4); 
            var month = Ymd.substring(4,6); 
            var day = Ymd.substring(6,8); 
            var week = new Date(year, month-1, day, 0,0,0,0); 
            week = weekName[week.getDay()]; 
            return week; 
          }
        },
        callTargetSPC(qLINE,qPART,pWORK_DATE,pZONE,pJGCD) {
         // let pickedLINE=this.fLINE;
         // let pickedPART=this.fPART;
            //this.$router.push("/inspection/tl/ts?"+fLINE+"&"+fPART);
            this.$router.push({path: '/SW/approval/doc/detail',  query:{line: qLINE, part: qPART,workdate: pWORK_DATE.replace(/-/g, ""), zone: pZONE, jgcd: pJGCD}});
            //console.log(fLINE)
        },
        getNum(val) {
          val = +val || 0
          return val;
        },
        getZoneColor(zone){
          return zone=="주간" ? "warning" : "primary"
        },
        save(){
          var arr= {
            index: this.apprItems.INDEX_KEY,
            user_seq:localStorage.getItem('userseq'),
            kname:this.$store.state.user.kname,
            rank_name:this.$store.state.user.rank_name,
          };
          //var selarray=[];
          
          //console.log(arr)
          //console.log(JSON.stringify(selarray))
          const token = localStorage.getItem('token')
              axios.patch(`${this.$SuwonApiPath}/api/approval/detail/doc`,arr, { headers: { Authorization: token } } )
              .then(response => {
                alert(response.data.msg) 
                this.$router.push({path: '/SW/approval/wait'});
              })
          
        },
        closeDelete () {
          this.dialogDelete = false
        },
        deleteItemConfirm () {
          this.save()
          this.closeDelete()
        },
      },
  }
</script>
<style lang="scss">
tbody {
     tr:hover {
        background-color: transparent !important;
     }
  }
</style>