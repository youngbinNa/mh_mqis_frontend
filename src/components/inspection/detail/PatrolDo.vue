<template>
  <div id="app">
    <v-app id="inspire" >
      <!--
      <v-container grid-list-md text-xs-center fluid style="padding-top:5px;padding-bottom:5px;padding-left:12px;padding-right:12px">
        
            <v-row no-gutters>
              <v-col>
                <v-text-field
              :value="'라인번호\n'+this.$route.query.line"
              single-line
              filled
            ></v-text-field>
            
                <v-list-item-subtitle>라인번호</v-list-item-subtitle>
                <v-list-item-title>{{this.$route.query.line}}</v-list-item-title>
              </v-col>
              <v-col>
                <v-list-item-subtitle>품번</v-list-item-subtitle>
                <v-list-item-title>{{this.$route.query.part}}</v-list-item-title>
              </v-col>
              <v-col>
                <v-list-item-subtitle>날짜</v-list-item-subtitle>
                <v-list-item-title>{{this.$route.query.workdate}}</v-list-item-title>
              </v-col>
              <v-col>
                <v-list-item-subtitle>주/야</v-list-item-subtitle>
                <v-list-item-title>{{this.$route.query.zone}}</v-list-item-title>
              </v-col>
            </v-row>
        
      </v-container>
      -->
      <!--
      <v-container grid-list-md text-xs-center fluid style="padding-top:5px;padding-bottom:5px;padding-left:12px;padding-right:12px"
            v-for="(item) in filteredTables"
            :key="item.INDEX_KEY">
              <v-row>
                <v-col>
                  
                      <v-list-item-content>
                        <v-list-item-title>공정번호</v-list-item-title>
                        <v-list-item-subtitle>{{item.PSNO}}</v-list-item-subtitle>
                      </v-list-item-content>
                      <v-list-item-content>
                        <v-list-item-title>공정명</v-list-item-title>
                        <v-list-item-subtitle>{{item.PSNM}}</v-list-item-subtitle>
                      </v-list-item-content>
                      <v-list-item-content>
                        <v-list-item-title>주기</v-list-item-title>
                        <v-list-item-subtitle>{{item.JGCD}}</v-list-item-subtitle>
                      </v-list-item-content>
                      <v-list-item-content>
                        <v-list-item-title>규격</v-list-item-title>
                        <v-list-item-subtitle>{{item.COND}}</v-list-item-subtitle>
                      </v-list-item-content>
                      <v-list-item-content>
                        <v-list-item-title>Center</v-list-item-title>
                        <v-list-item-subtitle>{{item.CENT}}</v-list-item-subtitle>
                      </v-list-item-content>
                      <v-list-item-content>
                        <v-list-item-title>+공차</v-list-item-title>
                        <v-list-item-subtitle>{{item.UCLQ}}</v-list-item-subtitle>
                      </v-list-item-content>
                      <v-list-item-content>
                        <v-list-item-title>-공차</v-list-item-title>
                        <v-list-item-subtitle>{{item.LCLQ}}</v-list-item-subtitle>
                      </v-list-item-content>
                      <v-list-item-content>
                        <v-list-item-title>단위</v-list-item-title>
                        <v-list-item-subtitle>{{item.UNIT}}</v-list-item-subtitle>
                      </v-list-item-content>
                      <v-list-item-content>
                        <v-list-item-title>검사항목</v-list-item-title>
                        <v-list-item-subtitle>{{item.CKCD}}</v-list-item-subtitle>
                      </v-list-item-content>
                    </v-col>
                    <v-col>
                    <v-list-item>
                      
                      <v-list-item-content>
                          <v-list-item-title>검사결과</v-list-item-title>
                        <input style="border:thin solid rgba(0,0,0,.12)"
                            :value="input"
                            class="input"
                            @input="onInputChange"
                            placeholder="이 곳에 검사결과 표시"
                          >
                          <SimpleKeyboard @onChange="onChange" @onKeyPress="onKeyPress" :input="input"/>
                      </v-list-item-content>
                    </v-list-item>
                </v-col>
              </v-row>
              
      </v-container>
      -->
      <v-container fluid v-for="item in filteredTables"
                  :key="item.PSNO">
        <v-data-iterator
          :items="filteredTables"
          hide-default-footer
        >
         <template >
          <v-row>
            <v-col>
                  <v-row justify="center">
                    <!--
                    <v-img
                      src="https://picsum.photos/id/11/500/300"
                      lazy-src="https://picsum.photos/id/11/10/6"
                      max-width="300"
                      max-height="300"
                    >-->
                    <v-img
                      src="../../../assets/patrolsample.png"
                      lazy-src="../../../assets/patrolsample.png"
                      max-width="300"
                      max-height="300"
                    >
                      <template v-slot:placeholder>
                        <v-row
                          class="fill-height ma-0"
                          align="center"
                          justify="center"
                        >
                          <v-progress-circular
                            indeterminate
                            color="grey lighten-5"
                          ></v-progress-circular>
                        </v-row>
                      </template>
                    </v-img>
                  </v-row>
                <v-row>
                  <v-col
                  
                  cols="12"
                >
                    <!--<v-card-title class="subheading font-weight-bold">{{ $route.query.line }}</v-card-title>-->
                    
                    <v-divider></v-divider>
      
                    <v-list >
                      <v-list-item style="background:#E0E0E0">
                        <v-list-item-content>공정번호:</v-list-item-content>
                        <v-list-item-content class="align-end">{{ item.PSNO }}</v-list-item-content>
                      </v-list-item>
                      <v-list-item>
                        <v-list-item-content>공정명:</v-list-item-content>
                        <v-list-item-content class="align-end">{{ item.PSNM }}</v-list-item-content>
                      </v-list-item>
                      <v-list-item style="background:#E0E0E0">
                        <v-list-item-content>주기:</v-list-item-content>
                        <v-list-item-content class="align-end">{{ item.JGCD }}</v-list-item-content>
                      </v-list-item>
                      <v-list-item>
                        <v-list-item-content>규격:</v-list-item-content>
                        <v-list-item-content class="align-end">{{ item.COND }}</v-list-item-content>
                      </v-list-item>
                      <v-list-item style="background:#E0E0E0">
                        <v-list-item-content>Center:</v-list-item-content>
                        <v-list-item-content class="align-end">{{ item.CENT }}</v-list-item-content>
                      </v-list-item>
                      <v-list-item>
                        <v-list-item-content>+공차:</v-list-item-content>
                        <v-list-item-content class="align-end">{{ item.UCLQ }}</v-list-item-content>
                      </v-list-item>
                      <v-list-item style="background:#E0E0E0">
                        <v-list-item-content>-공차:</v-list-item-content>
                        <v-list-item-content class="align-end">{{ item.LCLQ }}</v-list-item-content>
                      </v-list-item>
                      <v-list-item>
                        <v-list-item-content>단위:</v-list-item-content>
                        <v-list-item-content class="align-end">{{ item.UNIT }}</v-list-item-content>
                      </v-list-item>
                      <v-list-item style="background:#E0E0E0">
                        <v-list-item-content>검사항목:</v-list-item-content>
                        <v-list-item-content class="align-end">{{ item.CKCD }}</v-list-item-content>
                      </v-list-item>
                    </v-list>
                  </v-col>
                </v-row>
            </v-col>
            <v-col>
                  <v-chip-group  column>
                  <v-chip  >{{ $route.query.line }}</v-chip>
                  <v-chip  >{{ $route.query.part }}</v-chip>
                  <v-chip  >{{ $route.query.workdate }}</v-chip>
                  <v-chip  >{{ $route.query.zone }}</v-chip>
                </v-chip-group>
                <v-divider></v-divider>
                  <v-row > 
                    <v-col>
                      <v-list-item-content>
                          <v-list-item-title>검사결과</v-list-item-title>
                        <input style="border:thin solid rgba(0,0,0,.12)"
                            :value="input"
                            class="input"
                            @input="onInputChange"
                            placeholder="이 곳에 검사결과 표시"
                          >
                          <SimpleKeyboard @onChange="onChange" @onKeyPress="onKeyPress" :input="input"/>
                      </v-list-item-content>
                    </v-col>
                  </v-row>
                  <v-row align="center" justify="space-around">
                    <v-col style="padding-top:0;padding-bottom:2;">
                      <!--
                      <v-btn-toggle   v-model="toggle_exclusive"  group mandatory >
                        <v-btn :value="1" block fill color="primary">합격</v-btn>
                        <v-btn :value="0" block fill color="error">불합격</v-btn>
                      </v-btn-toggle>
                      -->
                        <v-chip-group column mandatory v-model="toggle_val" id="oknot">
                          <v-chip  class="mr-2" filter outlined label color="primary" style="justify-content: center;">합격</v-chip>
                          <v-chip  class="mr-2" filter outlined label color="error" style="justify-content: center;">불합격</v-chip>
                        </v-chip-group>
                    </v-col>
                    <!--
                    <v-col style="padding-top:0;padding-bottom:2">
                      <v-btn block color="error">불합격</v-btn>
                    </v-col>
                    -->
                  </v-row>
                  <v-row >
                    <v-col style="padding-top:0;padding-bottom:0">
                      <v-textarea name="input-7-1" filled label="특이사항 입력" auto-grow rows="1" v-model="etcinput" counter :maxlength=100></v-textarea>
                    </v-col>
                  </v-row>
                  <v-row align="center" justify="space-around">
                    <v-col style="padding-top:0;padding-bottom:0">
                      <v-btn block  color="grey" @click="callTargetSPC(item.WCEN,item.MACO,item.CPID)">완료(저장)</v-btn>
                    </v-col>
                  </v-row>
            </v-col>
          </v-row>
        </template>
  
       
      </v-data-iterator>
    </v-container>
    </v-app>
  </div>
</template>


<script>
import axios from 'axios'
import SimpleKeyboard from '../keyboard/NumericKeyboard';

  export default {
    name: 'PatrolDo',
    components: {
        SimpleKeyboard,
    },
    data() {
        return{
           tableItems: [],
           input:'',
           filter: this.$route.query.cpid,
           toggle_val: ['합격','불합격'],
           etcinput: '',
        }
    },
    created(){
      const token = localStorage.getItem('token')
        axios.get('/api/inspection/target/spclist/' + this.$route.query.line +'/'+this.$route.query.part+'/01', { headers: { Authorization: token } }) 
            .then(response => {
              this.tableItems = response.data     // 반환되는 값을 toDoItems에 저장한다.
              //console.log(this.$props.workdate);
            })
    },
    computed: {
      filteredTables() {
        return this.tableItems.filter(param => 
          ( 
           // !this.filter || 
           // this.filter.includes(param.CPID)
           String(param.CPID).includes(this.filter)
          )
        )
      },
      
    },
    methods:{
        callTargetSPC(qLINE,qPART,qCPID) {
          console.log(qCPID +'/' + this.$route.query.workdate +'/'+this.$route.query.zone+'/'+this.input+'/'+this.toggle_val+'/'+this.etcinput)
          
            axios.patch('/api/inspection/target/endtime/'+qCPID +'/' + this.$route.query.workdate +'/'+this.$route.query.zone+'?pINPUT='+this.input+'&pTOGGLE='+this.toggle_val+'&pETC='+this.etcinput)
            //+qCPID +'/' + this.$route.query.workdate +'/'+this.$route.query.zone,{params://
            //{ pCPID: qCPID, pWORK_DATE: this.$route.query.workdate, pTIME_ZONE_ID:this.$route.query.zone, pINPUT: this.input, pTOGGLE: this.toggle_val, pETC: this.etcinput }} )
            //+qCPID +'/' + this.$route.query.workdate +'/'+this.$route.query.zone+'/'+this.input+'/'+this.toggle_val+'/'+this.etcinput)
            .then(function (response) {
              //this.thisrouter.push({path: '/inspection/tl/ts/do', name: '검사결과입력', query:{line: qLINE, part: qPART, cpid: qCPID, workdate: this.date, zone: this.$route.query.zone}});
              console.log(response);
            });
            
            this.$router.push({path: '/inspection/tl/ts', name: '공정조회', query:{line: qLINE, part: qPART,workdate: this.$route.query.workdate, zone: this.$route.query.zone}});
        },
        onChange(input) {
        this.input = input;
        //this.input = input.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
        },
        onKeyPress(button) {
          console.log("button", button);
        },
        onInputChange(input) {
          this.input = input.target.value;
         //this.input = input.target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
        }
      },
  }
</script>
<style lang="scss">
.v-list-item { margin-top: 5px;}
.hg-theme-default .hg-button {
  height: 40px;
}
.v-text-field.v-text-field--enclosed .v-text-field__details { margin-bottom: 0px;}
.v-text-field__details { min-height: 0px; }
.v-messages { min-height: 0px; }
.hg-theme-default .hg-row>div:last-child { width: 17px; } //백스페이스 크기
  .v-btn-toggle { display:block; }
#oknot > div.v-slide-group__wrapper > div {display:grid;}
</style>