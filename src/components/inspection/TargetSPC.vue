<template>
  <div id="app">
    <v-app id="inspire" >
      <!---
                    <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition" :retain-focus="false">
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          color="primary"
                          dark
                          v-bind="attrs"
                          v-on="on"
                        >
                          Open Dialog
                        </v-btn>
                      </template>
                      <v-card>
                        <v-toolbar dark color="primary">
                          <v-btn icon dark @click="dialog = false">
                            <v-icon>mdi-close</v-icon>
                          </v-btn>
                          <v-toolbar-title>Settings</v-toolbar-title>
                          <v-spacer></v-spacer>
                          <v-toolbar-items>
                            <v-btn dark text @click="dialog = false">Save</v-btn>
                          </v-toolbar-items>
                        </v-toolbar>
                        
                          <v-list three-line subheader>
                            <v-subheader>검사기준</v-subheader>
                            <v-list-item>
                              <v-list-item-content>
                                <v-list-item-title>규격</v-list-item-title>
                                <v-list-item-subtitle>규격표시</v-list-item-subtitle>
                              </v-list-item-content>
                            </v-list-item>
                            
                            <v-list-item>
                             
                              <v-list-item-content>
                                 <v-list-item-title>검사결과</v-list-item-title>
                                <input
                                    :value="input"
                                    class="input"
                                    @input="onInputChange"
                                    placeholder="이 곳에 검사결과 표시"
                                  >
                                  <SimpleKeyboard @onChange="onChange" @onKeyPress="onKeyPress" :input="input"/>
                              </v-list-item-content>
                            </v-list-item>
                          </v-list>
                      </v-card>
                    </v-dialog>
                    -->
           <v-container style="padding:0;margin-left:0">
              <v-row align="center" style="padding:0;">
                <v-col cols="12" sm="4" style="margin-top:18px;padding-top:0px;padding-bottom:0px;padding-left:30px;padding-right:30px">
                        <!--<v-list-item-title class="headline">라인번호 {{this.$route.query.line}}</v-list-item-title>-->
                    <v-text-field filled label="라인번호"  readonly :value="this.$route.query.line"></v-text-field>
                </v-col>
                <v-col cols="12" sm="4" style="margin-top:18px;padding-top:0px;padding-bottom:0px;padding-left:30px;padding-right:30px">
                        <!--<v-list-item-title class="headline">품번 {{this.$route.query.part}}</v-list-item-title>-->
                    <v-text-field filled label="품번"  readonly :value="this.$route.query.part"></v-text-field>
                </v-col>
              </v-row>
              
           </v-container>

          <v-container grid-list-md text-xs-center fluid style="padding-top:5px;padding-bottom:5px;padding-left:12px;padding-right:12px"
            v-for="(item,index) in this.tableItems"
            :key="item.INDEX_KEY">
          <v-card 
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
                      <v-list-item-title class="headline">{{item.PSNO}}  {{item.PSNM}}</v-list-item-title>
                    </v-badge>
                      <v-list-item-subtitle style="margin-left:25px">{{item.NAM1}}</v-list-item-subtitle>
                      <span style="margin-left:25px">규격: {{item.COND}}</span>
                  </v-col>
                  <v-col  style="margin-left:25px" >
                    <v-list-item-subtitle>주기</v-list-item-subtitle>
                    <v-list-item-title >{{item.JGCD}}</v-list-item-title>
                    <v-list-item-subtitle>확인방법</v-list-item-subtitle>
                    <v-list-item-title >{{item.CKCD}}</v-list-item-title>
                  </v-col>
                  <v-col  style="text-align:right">
                     <v-btn class="ma-2" tile outlined color="success" @click="callDetailView(item.WCEN,item.MACO,item.CPID)">
                        <v-icon left>mdi-lead-pencil</v-icon>검사시작
                     </v-btn>
                  </v-col>
                </v-row>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </v-container>
          <v-bottom-navigation  fixed style="height:auto;">
            <v-container style="padding:0;margin:0;max-width:100%">
            <v-progress-linear
              :value="Math.round(percent)"
              color=#479cc8
              height="25"
              width=auto>
                <strong >{{Math.round(this.percent)}}%</strong>
            </v-progress-linear>
            </v-container>
          </v-bottom-navigation>
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
                  //date: new Date().toISOString().substr(0, 10),
                  date: this.$route.query.workdate.replace(/-/g, ""),
                  modal: false,
        
                  tableItems: [],
                  dialog: false,
                  notifications: false,
                  sound: true,
                  widgets: false,

                  input:'',

                  total:0,isdone:0,percent:0,
                  //thisrouter: this.$router,
                  //fLINE: this.$route.params.line,
                  //fPART: this.$route.params.part,
        }
    },
    methods: {
      openMyDialog () {
        this.dialog=true // emit the event to the bus
      },
      onChange(input) {
        this.input = input;
      },
      onKeyPress(button) {
        console.log("button", button);
      },
      onInputChange(input) {
        this.input = input.target.value;
      },
      callDetailView(qLINE,qPART,qCPID) {
        axios.patch('/api/inspection/target/starttime/'+ qCPID +'/' + this.date +'/'+this.$route.query.zone)
        .then(function (response) {
          //this.thisrouter.push({path: '/inspection/tl/ts/do', name: '검사결과입력', query:{line: qLINE, part: qPART, cpid: qCPID, workdate: this.date, zone: this.$route.query.zone}});
          console.log(response);
        });
        this.$router.push({path: '/inspection/tl/ts/do', name: '검사결과입력', query:{line: qLINE, part: qPART, cpid: qCPID, workdate: this.date, zone: this.$route.query.zone}});
      },
      getNum(val) {
          val = +val || 0
          return val;
      },
      getThisDate() {
            return this.date;
      }
    },
    created(){
      const token = localStorage.getItem('token')
        axios.get('/api/inspection/target/spclist/' + this.$route.query.line +'/'+this.$route.query.part+'/01', { headers: { Authorization: token } }) // http://localhost:3000/api/inspection/GetDoList/에 get call을 한다.
            .then(response => {
              this.tableItems = response.data     // 반환되는 값을 toDoItems에 저장한다.
              //console.log(this.$props.workdate);
            })
        axios.get('/api/inspection/target/percent/' + this.$route.query.line +'/'+this.$route.query.part+'/'+this.$route.query.workdate.replace(/-/g, "")+'/'+this.$route.query.zone, { headers: { Authorization: token } }) // http://localhost:3000/api/inspection/GetDoList/에 get call을 한다.
            .then(response => {
              //this.total = response.data[0].TOTAL
              this.percent = response.data[0].PERCENTAGE
              //this.isdone = response.data[0].IS_DONE
              //console.log(response.data[0].TOTAL);
            })
    },
  }
</script>
<style lang="scss">
.v-text-field.v-text-field--enclosed .v-text-field__details { margin-bottom: 0px;}
.v-text-field__details { min-height: 0px; }
.v-messages { min-height: 0px; }
.v-application .headline { white-space: normal; }
</style>
