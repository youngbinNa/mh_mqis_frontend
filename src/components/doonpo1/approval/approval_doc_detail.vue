<template>
  <div id="app">
    <v-app id="inspire" >
           <v-container class="pa-0 ml-0">
            <v-app-bar :height="getMobileHeight" app  elevation="1"  >
                    
                  <v-row class="ma-0 pa-0">
                    
                        <v-btn class="align-self-center" elevation="0" text color="indigo" @click="$router.go(-1)"><v-icon>mdi-arrow-left</v-icon></v-btn>
                      <v-col md="7" class="pr-0">
                        <v-chip-group  column >
                          <v-chip  >{{ $route.query.line }}</v-chip>
                          <v-chip >{{ $route.query.part }}</v-chip>
                          <v-chip >{{ getDateFormat($route.query.workdate) }}</v-chip>
                          <v-chip >{{ $route.query.zone }}</v-chip>
                        </v-chip-group>
                      </v-col>
                       <v-col class="align-self-center" md="4">
                        <template v-if="isPercent">
                          <!--
                          <v-slider
                            readonly
                            inverse-label
                            :value="getNum(percentItems[0].DONE_CNT/percentItems[0].TOTAL_CNT)*100"
                            :color="getSliderColor" track-color="grey"
                            hide-details
                            :label="getHint"
                          >
                          </v-slider>
                          -->
                          <strong>{{getHint}}</strong>
                          <v-progress-linear :value="getNum(percentItems[0].DONE_CNT/percentItems[0].TOTAL_CNT)*100"  :color="getSliderColor"></v-progress-linear>
                        </template>
                      </v-col>
                  </v-row>
             </v-app-bar> 
           </v-container>

          <v-container grid-list-md text-xs-center fluid style="padding-top:5px;padding-bottom:5px;padding-left:12px;padding-right:12px"
            v-for="(item,index) in this.tableItems"
            :key="item.INDEX_KEY" >
          <v-card :style="{borderLeft: getLeftColor[index]}" 
            class="mx-auto"
            outlined
            elevation="2" :tabindex="index">
            <v-list-item two-line class="pa-0 ma-0">
              <v-list-item-content>
                <v-row class="pa-0 ma-0 ">
                  <v-row class="pa-0 ma-0">
                    <v-col class="ml-4">
                        <v-badge color="grey" left :value="index+1" :content="index+1" >
                          <v-list-item-subtitle class="headline"><v-chip outlined class="text-h5" color="grey">{{item.PSNO}}</v-chip>  {{item.PSNM}}</v-list-item-subtitle>
                        </v-badge>
                        <v-card flat class="text-h5 ">{{item.NAM1}}</v-card>
                        <v-card flat class="text-h5 ">규격: {{item.COND}}</v-card>
                    </v-col>
                  </v-row>
                </v-row>
              </v-list-item-content>
            </v-list-item>



            <v-divider></v-divider>
             <v-card-actions>
              <v-btn class="justify-end px-3"
                color="info"
                text right
                block
                @click="setShowClicked(index)"
              ><v-icon v-if="item.ETCTXT" color="warning">mdi-alert-octagon-outline</v-icon>
                {{ getShowClicked[index] }}
                <v-icon>{{ getShowIcon[index] }}</v-icon>
              </v-btn>
        
              <v-spacer></v-spacer>
        
            </v-card-actions>
        
            <v-expand-transition>
              <div v-show="getShowExpand[index]">
               
                    <v-card-text>
                      <v-row>
                      <v-col class="px-3">
                        <v-list style="padding:0px" dense>
                          <v-list-item>
                            <v-list-item-content>주기</v-list-item-content>
                            <v-list-item-content class="d-flex justify-center headline">{{ item.JGCD }}</v-list-item-content>
                          </v-list-item>
                          <v-divider ></v-divider>
                          <v-list-item>
                            <v-list-item-content>시료수</v-list-item-content>
                            <v-list-item-content class="d-flex justify-center headline">{{ item.SIZE }}</v-list-item-content>
                          </v-list-item>
                          <v-divider ></v-divider>
                          <v-list-item>
                            <v-list-item-content>검사 포인트</v-list-item-content>
                            <v-list-item-content class="d-flex justify-center headline">{{ item.POINT }}</v-list-item-content>
                          </v-list-item>
                        </v-list>
                      </v-col>
                        <v-divider vertical></v-divider>
                      <v-col >
                        <v-list style="padding:0px" dense>
                          <v-list-item>
                            <v-list-item-content>검사결과</v-list-item-content>
                            <v-list-item-content class="d-flex justify-center headline">{{ item.INSP_RESULT }}</v-list-item-content>
                          </v-list-item>
                          <v-divider ></v-divider>
                          <v-list-item>
                            <v-list-item-content>특이사항</v-list-item-content></v-list-item>
                            <v-list-item-content class="d-flex justify-center headline" style="word-break: break-all">{{ item.ETCTXT }}</v-list-item-content>
                          
                        </v-list>
                      </v-col>
                      </v-row>
                    </v-card-text>
                
              </div>
            </v-expand-transition>
          </v-card>
        </v-container>
    </v-app>
  </div>
</template>


<script>
import axios from 'axios'
//import SimpleKeyboard from './keyboard/NumericKeyboard';

  export default {
    name: 'TargetSPC',
    components: {
      //SimpleKeyboard,
    },
    props: {
            workdate: {
                type: String,
                default : ''
            },
            zone: {
                type: String,
                default: ''
            }
    },
    data() {
        return{
        
                  tableItems: [],
                  percentItems:[],isPercent:false,


                  total:0,isdone:0,percent:0,
                  show: [],
                  //thisrouter: this.$router,
                  //fLINE: this.$route.params.line,
                  //fPART: this.$route.params.part,
        }
    },
    methods: {
      setShowClicked(index){
        this.tableItems[index].BOOL = !this.tableItems[index].BOOL
      },
      
      getNum(val) {
          val = +val || 0
          return val;
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
    created(){
      const token = localStorage.getItem('token')
      if(this.$route.query.jgcd == "주"){
       axios.get(`${this.$D1ApiPath}/api/inspection/target/percent/week/` + this.$route.query.line +'/'+this.$route.query.part+'/'+this.$route.query.workdate.replace(/-/g, "")+'/'+this.$route.query.zone, { headers: { Authorization: token } }) 
            .then(response => {
              this.percentItems = response.data
              this.isPercent = response.data ? true : false
            })
        axios.get(`${this.$D1ApiPath}/api/inspection/target/spclist/week/` + this.$route.query.line +'/'+this.$route.query.part+'/'+this.$route.query.workdate.replace(/-/g, "")+'/'+this.$route.query.zone, { headers: { Authorization: token } }) 
            .then(response => {
              this.tableItems = response.data   
            })
      }
      else{
        axios.get(`${this.$D1ApiPath}/api/inspection/target/percent/` + this.$route.query.line +'/'+this.$route.query.part+'/'+this.$route.query.workdate.replace(/-/g, "")+'/'+this.$route.query.zone, { headers: { Authorization: token } }) 
            .then(response => {
              this.percentItems = response.data
              this.isPercent = response.data ? true : false
            })
        axios.get(`${this.$D1ApiPath}/api/inspection/target/spclist/` + this.$route.query.line +'/'+this.$route.query.part+'/'+this.$route.query.workdate.replace(/-/g, "")+'/'+this.$route.query.zone, { headers: { Authorization: token } }) 
            .then(response => {
              this.tableItems = response.data   
            })
            
      }
    },
    computed: {
      getSliderColor(){
         var cal = this.percentItems[0].DONE_CNT/this.percentItems[0].TOTAL_CNT
         return (cal< 0.25) ? 'red' : (cal< 0.5) ? 'orange' : (cal< 0.75) ? 'indigo' : 'green'
      },
      getHint(){
        return '완료 '+this.percentItems[0].DONE_CNT+' / 대상 '+this.percentItems[0].TOTAL_CNT
      },
      getShowExpand(){
            return this.tableItems.map(function(item) {
                return item.BOOL
            });
      },
      getShowIcon(){
            return this.tableItems.map(function(item) {
                return item.BOOL ? 'mdi-chevron-up' : 'mdi-chevron-down'
            });
      },
      getShowClicked(){
            return this.tableItems.map(function(item) {
                return item.BOOL ? '접기' : '펼치기' 
            });
      },
      getLeftColor() {
            return this.tableItems.map(function(item) {
                return (item.IS_OK==0) ? '10px solid #3F51B5' : ((item.IS_OK==1) ? '10px solid red' :(!item.START_TIME) ? '10px solid grey' :'10px solid orange')
            });
      },
      getMobileHeight(){
          return (this.$vuetify.breakpoint.mobile) ? '80' : '48'
      },
    }
  }
</script>
<style lang="scss">
.v-text-field.v-text-field--enclosed .v-text-field__details { margin-bottom: 0px;}
.v-text-field__details { min-height: 0px; }
.v-messages { min-height: 0px; }
.v-application .headline { white-space: normal; }

.v-toolbar__content, .v-toolbar__extension {
  justify-content: space-evenly;
}
</style>
