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
                      <v-btn @click="retrieveCalendar2(date)" tile outlined type="submit"  color="success"><v-icon left>mdi-magnify</v-icon> 조회</v-btn>
                    </div>
                 </v-toolbar>
                 <v-row class="pa-0 ma-0 justify-center">
                    <v-col>
                        <apexcharts ref="mychartday" width="100%" height="350" type="bar" :options="chartOptions" :series="series" ></apexcharts>
                    </v-col>
                    <v-col>
                        <apexcharts ref="mychartweek" width="100%" height="350" type="bar" :options="chartOptions" :series="seriesweek" ></apexcharts>
                    </v-col>
                </v-row>
                      
</div>
</template>

<script>
import axios from 'axios'
//import ApexCharts from 'apexcharts'
import VueApexCharts from 'vue-apexcharts'

  export default {
    components: {
      apexcharts: VueApexCharts
    },
    data() {
        return{
              date: [],
              zones : [ {name:'주간', value:'주간'},{name:'야간', value:'야간'}  ], 
              modal: false,
              filter: '',
              //workdate:[],ok_num:[], defect_num:[],yet_num:[],
                chartOptions: {
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
                      dataLabels: {
                        enabled: true,
                        style: {
                          fontSize: "16px",
                        }
                      },
                      colors: ['#1E4174', '#FF0000', '#FFA500', '#BDBDBD'],
                      responsive: [{
                        breakpoint: 480,
                        options: {
                          legend: {
                            position: 'top',
                            offsetY: 0,
                            fontSize: '16px',
                            labels: {
                                //colors: ['#1E4174', '#FF0000', '#FFA500']
                            },
                          },
                        }
                      }],
                      plotOptions: {
                        bar: {
                          borderRadius: 8,
                          horizontal: false,
                        },
                      },
                      xaxis: {
                        categories: [],
                        labels: {
                          style: {
                              fontSize: '16px'
                          }
                        }
                      },
                      legend: {
                        position: 'top',
                        offsetY: 0,
                        fontSize: '16px',
                        labels: {
                            //colors: ['#1E4174', '#FF0000', '#FFA500']
                        },
                      },
                      fill: {
                        opacity: 1,
                      // colors: ['#1E4174', '#FF0000', '#FFA500']
                      },
                },

                series: [
                    {
                      name: '합격',
                      data: [],
                    },
                    {
                      name: '불합격',
                      data: [],
                    },
                    {
                      name: '미완료',
                      data: [],
                    },
                    {
                      name: '미완&불합',
                      data: [],
                    },
                ],
                seriesweek: [
                    {
                      name: '합격',
                      data: [],
                    },
                    {
                      name: '불합격',
                      data: [],
                    },
                    {
                      name: '미완료',
                      data: [],
                    },
                    {
                      name: '미완&불합',
                      data: [],
                    },
                ],
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
      //console.log(this.chartOptions.xaxis.categories)
        const currHour = new Date().getHours()
        if (currHour >=9 && currHour <21 ){ this.filter= '주간'}
        //else if ( (currHour >= 0 && currHour < 9) || (currHour >= 21 && currHour <= 24 ) ){ this.filter= '야간' }
        else { this.filter= '야간'}
        this.filter= '주간'
        //this.retrieveCalendar()
          //this.retrieveCalendar();
    },
     mounted() {
         this.retrieveCalendar();
      },
      methods:{
        retrieveCalendar(){
          var today = new Date()
          var currday = this.formatDate(today)
          var first = today.getDate() - today.getDay() +1;
          var firstday = this.formatDate(new Date(today.setDate(first)))
          this.date = [firstday,currday]

          this.getAxiosDataDay()
          this.getAxiosDataWeek()
        },
        retrieveCalendar2(val){
          var _from = new Date(val[0])
          var _to = new Date(val[1])
          //var currday = this.formatDate(_to)
         // var first = _from.getDate() - _from.getDay() +1;
          //var firstday = new Date(_from.setDate(first)).toISOString().substr(0, 10)

          this.date = [_from.toISOString().substr(0, 10),_to.toISOString().substr(0, 10)]

         this.getAxiosDataDay()
         this.getAxiosDataWeek()
        },
        getAxiosDataDay(){
            const token = localStorage.getItem('token')
            axios.get(`${this.$D2ApiPath}/api/dashboard/get3?from=` + this.date[0].replace(/-/g, "")+'&to='+ this.date[1].replace(/-/g, "")+'&zone='+ this.filter, { headers: { Authorization: token } } )
            .then(response => {
                var str = response.data
                //let workdate = str.map(str => str.WORK_DATE.replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3'));
                let workdate = str.map(str => str.WORK_DATE);
                let ok_num = str.map(str => str.OK_NUM);
                let defect_num = str.map(str => str.DEFECT_NUM);
                let yet_num = str.map(str => str.YET_NUM);
                let yet_dtf_num = str.map(str => str.YET_DFT_NUM);

                this.updateChartDay(workdate,ok_num,defect_num,yet_num,yet_dtf_num)
             })
        },
        updateChartDay(workdate,ok_num,defect_num,yet_num,yet_dtf_num){
          // this.chartOptions.xaxis.categories=workdate
          this.$refs.mychartday.updateOptions({
                xaxis: {
                        categories: workdate
                      },
            })
          this.$refs.mychartday.updateSeries([
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
                        {
                          name: '미완&불합',
                          data: yet_dtf_num,
                        },
            ], false, true);
           //console.log(workdate)
           //console.log(this.chartOptions.xaxis.categories[0])
           this.series[0].data=ok_num
           this.series[1].data=defect_num
           this.series[2].data=yet_num
          
        },
        getAxiosDataWeek(){
            const token = localStorage.getItem('token')
            axios.get(`${this.$D2ApiPath}/api/dashboard/get3/week?from=` + this.date[0].replace(/-/g, "")+'&to='+ this.date[1].replace(/-/g, "")+'&zone='+ this.filter, { headers: { Authorization: token } } )
            .then(response => {
                var str = response.data
                //let workdate = str.map(str => str.WORK_DATE.replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3'));
                let workdate = str.map(str => str.WORK_DATE);
                let ok_num = str.map(str => str.OK_NUM);
                let defect_num = str.map(str => str.DEFECT_NUM);
                let yet_num = str.map(str => str.YET_NUM);
                let yet_dtf_num = str.map(str => str.YET_DFT_NUM);

                this.updateChartWeek(workdate,ok_num,defect_num,yet_num,yet_dtf_num)
             })
        },
        updateChartWeek(workdate,ok_num,defect_num,yet_num,yet_dtf_num){
          // this.chartOptions.xaxis.categories=workdate
          this.$refs.mychartweek.updateOptions({
                title: {
                   text: '주 단위',
                },
                xaxis: {
                   categories: workdate
                },
                legend: {
                   show: false,
                },
                plotOptions: {
                    bar: {
                      borderRadius: 8,
                      horizontal: false,
                      columnWidth: '20%',
                    },
                },
            })
          this.$refs.mychartweek.updateSeries([
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
                        {
                          name: '미완&불합',
                          data: yet_dtf_num,
                        },
            ], false, true);
           //console.log(workdate)
           //console.log(this.chartOptions.xaxis.categories[0])
           this.seriesweek[0].data=ok_num
           this.seriesweek[1].data=defect_num
           this.seriesweek[2].data=yet_num
           this.seriesweek[3].data=yet_dtf_num
        },
        /*
        getRandomArbitrary(min, max) {
          return Math.floor(Math.random() * 99);
        },
        setChartData() {
          setInterval(() => {
            this.series[0].data.splice(0, 1);
            this.series[0].data.push(this.getRandomArbitrary(0, 99));
            this.updateSeriesLine();
          }, 3000);
        },
        updateSeriesLine() {
          this.$refs.mychartweek.updateSeries([{
            data: this.series[0].data,
          }], false, true);
        },
        */
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
       
      },
  }
</script>