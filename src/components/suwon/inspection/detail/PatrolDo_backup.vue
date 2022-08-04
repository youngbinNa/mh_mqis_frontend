<template>
  <div id="app">
    <v-app id="inspire" >
      <v-container grid-list-md text-xs-center fluid style="padding:0;margin:0">
              <v-row no-gutters>
               <v-col>
                  <v-card class="pa-2" outlined tile>
                    라인번호<br/>{{this.$route.query.line}}
                  </v-card>
                </v-col>
                <v-col>
                  <v-card class="pa-2" outlined tile>
                    품번<br/>{{this.$route.query.part}}
                  </v-card>
                </v-col>
                <v-col>
                  <v-card class="pa-2" outlined tile>
                    날짜<br/>{{this.$route.query.workdate}}
                  </v-card>
                </v-col>
                <v-col>
                  <v-card class="pa-2" outlined tile>
                    주/야<br/>{{this.$route.query.zone}}
                  </v-card>
                </v-col>
              </v-row>
      </v-container>
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
                        <v-list-item-title>+공자</v-list-item-title>
                        <v-list-item-subtitle>{{item.UCLQ}}</v-list-item-subtitle>
                      </v-list-item-content>
                      <v-list-item-content>
                        <v-list-item-title>-공자</v-list-item-title>
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
        }
    },
    created(){
        axios.get('/api/inspection/target/spclist/' + this.$route.query.line +'/'+this.$route.query.part+'/01') 
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
        callTargetSPC(qLINE,qPART,pWORK_DATE,pZONE) {
         // let pickedLINE=this.fLINE;
         // let pickedPART=this.fPART;
            //this.$router.push("/inspection/tl/ts?"+fLINE+"&"+fPART);
            this.$router.push({path: '/inspection/tl/ts', name: '조회/입력>공정조회', query:{line: qLINE, part: qPART,workdate: pWORK_DATE, zone: pZONE}});
            //console.log(fLINE)
        },
        onChange(input) {
        this.input = input;
        },
        onKeyPress(button) {
          console.log("button", button);
        },
        onInputChange(input) {
          this.input = input.target.value;
        }
      },
  }
</script>