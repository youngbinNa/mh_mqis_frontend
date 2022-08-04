<template>
<div>
                      <!--
                    <div id="chart">
                      <apexchart  ref="Chart1" type="bar" height="273"  :options="chartOptions" :series="series"></apexchart>
                       
                    </div>
                    -->
    
                 <v-toolbar flat>
                    <v-col>
                      <v-toolbar-title>주간 라인 실적</v-toolbar-title>
                    </v-col>
                    <v-col >
                      <v-select
                          hide-details
                          class="pt-2"
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
                                  v-model="dateRangeText"
                                  label="기준일자"
                                  prepend-icon="mdi-calendar"
                                  readonly
                                  v-bind="attrs"
                                  v-on="on"
                                ></v-text-field>
                              </template>
                              <v-date-picker v-model="datesProxy" locale="ko-kr" selectedItemsText="{0}개 선택됨" :day-format="date => date.split('-')[2]" scrollable range>
                                <v-spacer></v-spacer>
                                <v-btn text color="primary" @click="modal = false">취소</v-btn>
                                <v-btn text color="primary" @click="$refs.dialog.save(date)">확인</v-btn>
                              </v-date-picker>
                            </v-dialog>
                        </template>
                    </v-col>
                    <div class="justify-end" style="text-align:right">
                      <v-btn @click="retrieveCalendar2(date)"  type="submit"  color="success">조회</v-btn>
                    </div>
                 </v-toolbar>
                 <v-row class="pa-0 ma-0 justify-center">
                    <v-col>
                        <div id="mychartday" ref="mychartday"></div>
                    </v-col>
                    <v-col>
                        <div id="mychartweek" ref="mychartweek"></div>
                    </v-col>
                </v-row>
                      
</div>
</template>

<script>
import axios from 'axios'
import ApexCharts from 'apexcharts'
//import VueApexCharts from 'vue-apexcharts'

  export default {
    data() {
        return{
              date: ['2021-03-01', '2021-03-05'],
              zones : [ {name:'주간', value:'주간'},{name:'야간', value:'야간'}  ], 
              modal: false,
              filter: '',
          }
    },
    computed: {
      dateRangeText () {
        return this.date.join(' ~ ')
      },
      datesProxy: {
        get() {
          return this.date;
        },
        set([newVal]) {
          const fourthDay = new Date(new Date(newVal).setDate(new Date(newVal).getDate() + 4)).toISOString().slice(0, 10);
          this.date = [newVal, fourthDay]
        }
      }
    },
    created(){
        const currHour = new Date().getHours()
        if (currHour >=9 && currHour <21 ){ this.filter= '주간'}
        //else if ( (currHour >= 0 && currHour < 9) || (currHour >= 21 && currHour <= 24 ) ){ this.filter= '야간' }
        else { this.filter= '야간'}
        this.filter= '주간'
        //this.retrieveCalendar()
    },
     mounted: function() {
         this.retrieveCalendar()
      },
      methods:{
        updateChartDay(){
            const token = localStorage.getItem('token')
            axios.get(`${this.$SuwonApiPath}/api/dashboard/get3?from=` + this.date[0].replace(/-/g, "")+'&to='+ this.date[1].replace(/-/g, "")+'&zone='+ this.filter, { headers: { Authorization: token } } )
            .then(response => {
              var str = response.data
              //let workdate = str.map(str => str.WORK_DATE.replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3'));
              let workdate = str.map(str => str.WORK_DATE);
              let ok_num = str.map(str => str.OK_NUM);
              let defect_num = str.map(str => str.DEFECT_NUM);
              let yet_num = str.map(str => str.YET_NUM);
              var options = {
                      chart: {
                        type: 'bar',
                        height: 300,
                        width: '100%',
                        stacked: true,
                        toolbar: {
                          show: true
                        },
                        zoom: {
                          enabled: true
                        }
                      },
                      title: {
                          text: '일 단위',
                      },
                      colors: ['#1E4174', '#FF0000', '#FFA500'],
                      series: [
                        {
                          name: '합격',
                          data: ok_num,
                        },
                        {
                          name: '불합격',
                          data: defect_num,
                        },
                        {
                          name: '미완료',
                          data: yet_num,
                        },
                      ],
                      responsive: [{
                        breakpoint: 480,
                        options: {
                          legend: {
                            position: 'bottom',
                            offsetX: -10,
                            offsetY: 0
                          }
                        }
                      }],
                      
                      xaxis: {
                        categories: workdate
                      },
                      legend: {
                        position: 'top',
                        offsetY: 0,
                        labels: {
                            //colors: ['#1E4174', '#FF0000', '#FFA500']
                        },
                      },
                      fill: {
                        opacity: 1,
                      // colors: ['#1E4174', '#FF0000', '#FFA500']
                      }
                  }
                  const chart = new ApexCharts(this.$refs.mychartday, options)
                  chart.render()
                  
                  chart.updateOptions({
                      plotOptions: {
                        bar: {
                          borderRadius: 8,
                          horizontal: false,
                        },
                      },
                  })
                })
        },
        updateChartWeek(){
            const token = localStorage.getItem('token')
            axios.get(`${this.$SuwonApiPath}/api/dashboard/get3/week?from=` + this.date[0].replace(/-/g, "")+'&to='+ this.date[1].replace(/-/g, "")+'&zone='+ this.filter, { headers: { Authorization: token } } )
            .then(response => {
              var str = response.data
              //let workdate = str.map(str => str.WORK_DATE.replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3'));
              let workdate = str.map(str => str.WORK_DATE);
              let ok_num = str.map(str => str.OK_NUM);
              let defect_num = str.map(str => str.DEFECT_NUM);
              let yet_num = str.map(str => str.YET_NUM);
              var options = {
                      chart: {
                        type: 'bar',
                        height: 300,
                        width: '100%',
                        stacked: true,
                        toolbar: {
                          show: true
                        },
                        zoom: {
                          enabled: true
                        }
                      },
                      title: {
                          text: '주 단위',
                      },
                      colors: ['#1E4174', '#FF0000', '#FFA500'],
                      series: [
                        {
                          name: '합격',
                          data: ok_num,
                        },
                        {
                          name: '불합격',
                          data: defect_num,
                        },
                        {
                          name: '미완료',
                          data: yet_num,
                        },
                      ],
                      responsive: [{
                        breakpoint: 480,
                        options: {
                          legend: {
                            show: false,
                          }
                        }
                      }],
                      plotOptions: {
                        bar: {
                          borderRadius: 8,
                          horizontal: false,
                          columnWidth: '20%',
                        },
                      },
                      xaxis: {
                        categories: workdate
                      },
                      legend: {
                        show: false,
                      },
                      fill: {
                        opacity: 1,
                      // colors: ['#1E4174', '#FF0000', '#FFA500']
                      },
                  }
                  const chart = new ApexCharts(this.$refs.mychartweek, options)
                  chart.render()
                  chart.updateSeries([
                  {
                          name: '합격',
                          data: ok_num,
                        },
                        {
                          name: '불합격',
                          data: defect_num,
                        },
                        {
                          name: '미완료',
                          data: yet_num,
                        },
                  ])
                  chart.updateOptions({
                      plotOptions: {
                        bar: {
                          borderRadius: 8,
                          horizontal: false,
                          columnWidth: '20%',
                        },
                      },
                  })
                })
        },
        retrieveCalendar(){
          //var today= new Date().toISOString().substr(0, 10)
          //this.date = [today,today]

          var today = new Date()
          var currday = this.formatDate(today)
          var first = today.getDate() - today.getDay() +1;
          var firstday = this.formatDate(new Date(today.setDate(first)))
          this.date = [firstday,currday]

            this.updateChartDay()
            this.updateChartWeek()
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
        retrieveCalendar2(val){
          var _from = new Date(val[0])
          var _to = new Date(val[1])
          //var currday = this.formatDate(_to)
         // var first = _from.getDate() - _from.getDay() +1;
          //var firstday = new Date(_from.setDate(first)).toISOString().substr(0, 10)

          this.date = [_from.toISOString().substr(0, 10),_to.toISOString().substr(0, 10)]

         this.updateChartDay()
            this.updateChartWeek()
        },
        /*
        gettable3(){
          const token = localStorage.getItem('token')
         axios.get(`${this.$SuwonApiPath}/api/dashboard/get3?from=` + this.date.replace(/-/g, "")+'&to='+ this.date.replace(/-/g, "")+'&zone='+ this.filter, { headers: { Authorization: token } } )
            .then(response => {
              var str = response.data
              let workdate = str.map(str => str.WORK_DATE);
              this.chartOptions = {
                chart: {
                        type: 'bar',
                        height: 350,
                        stacked: true,
                        toolbar: {
                          show: true
                        },
                        zoom: {
                          enabled: true
                        }
                      },
                      responsive: [{
                        breakpoint: 480,
                        options: {
                          legend: {
                            position: 'bottom',
                            offsetX: -10,
                            offsetY: 0
                          }
                        }
                      }],
                      plotOptions: {
                        bar: {
                          borderRadius: 8,
                          horizontal: false,
                        },
                      },
                      
                xaxis: {
                  categories: workdate
                },
                      legend: {
                        position: 'right',
                        offsetY: 40
                      },
                      fill: {
                        opacity: 1,
                        colors: ['#1E4174', '#FF0000', '#FFA500']
                      }
              };
              let ok_num = str.map(str => str.OK_NUM);
              //let ok_num= JSON.stringify(str2)
              //console.log(ok_num)
              
              this.series=[{ name: '합격', data: ok_num }]
              //var str = this.table3
              
              //this.series=[{ name: '합격', data: ok_num }]
              //this.series=response.data
           
            })
            
              
        },
*/

      
      },
  }
</script>