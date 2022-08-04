<template>
  <v-card id="inspire" v-if="line">
    
    
    <v-container fluid v-for="(item,index) in tableItems"
                :key="item.INDEX_KEY">
       <template >
        <v-row>
          
          <v-col>
                <v-chip-group  column >
                  <v-chip  >{{ line }}</v-chip>
                  <v-chip  >{{ part }}</v-chip>
                  <v-chip  >{{ getDateFormat(workdate) }}</v-chip>
                  <v-chip  >{{ zone }}</v-chip>
                </v-chip-group>
                <v-chip-group  column >
                  <v-chip outlined color="warning" >시료수 {{ item.SIZE }}</v-chip>
                  <v-chip outlined color="warning" >포인트 {{ item.POINT }}</v-chip>
                  <template v-if="item.IS_INPUT=='Y'">
                    <v-chip outlined color="info">하한 {{item.LCLQ}}</v-chip>
                    <v-chip outlined color="info">센터 {{item.CENT}}</v-chip>
                    <v-chip outlined color="info">상한 {{item.UCLQ}}</v-chip>
                  </template>
                </v-chip-group>
              <v-divider></v-divider>
                <v-row > 
                  <v-col v-if="item.IS_INPUT == 'Y'">
                    <v-list-item-content>
                        <v-list-item-title class="red--text">검사결과 *필수</v-list-item-title>
                      <input style="border:thin solid rgba(0,0,0,.12);height:60px;font-size:30px"
                          :value="input"
                          class="input"
                          @input="onInputChange"
                          placeholder="이 곳에 검사결과 표시"
                        >
                        <SimpleKeyboard @onChange="onChange" @onKeyPress="onKeyPress" :input="input" style="font-size:30px"/>
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
                        <v-chip :disabled="getOKdisabled[index]" class="mr-2" filter outlined label color="primary" style="justify-content: center;">합격</v-chip>
                        <v-chip :disabled="getOKdisabled[index]" class="mr-2" filter outlined label color="error" style="justify-content: center;">불합격</v-chip>
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
                    <v-btn block  color="grey" @click="save(item.WCEN,item.MACO,item.INDEX_KEY,item.IS_INPUT)">완료(저장)</v-btn>
                  </v-col>
                </v-row>
                <v-row justify="center">
                  <!--
                  <v-img
                    src="https://picsum.photos/id/11/500/300"
                    lazy-src="https://picsum.photos/id/11/10/6"
                    max-width="300"
                    max-height="300"
                  >-->
                  
                  <v-col>
                  <v-card-actions>
                    <v-btn class="justify-end px-3"
                      color="info"
                      text right
                      block
                      @click="setShowClicked"
                    >
                      {{ getShowClicked }}
                      <v-icon>{{ getShowIcon }}</v-icon>
                    </v-btn>
              
                    <v-spacer></v-spacer>
              
                  </v-card-actions>
                  <v-expand-transition>
                    <div v-show="expand">
                      <v-col align="center" md="0" ma="0">
                  <template v-if="item.IMAGE">
                      <v-img
                        :src="getImagePath[index]"
                        :lazy-src="getImagePath[index]"
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
                  </template>
                  <template v-else>
                      <v-img
                        src="../../../../assets/patrolsample.png"
                        lazy-src="../../../../assets/patrolsample.png"
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
                  </template>
                      </v-col>

                  </div>
          </v-expand-transition>
                  </v-col>
                </v-row>
              
          </v-col>
        </v-row>
      </template>

     
  </v-container>
  <input type="hidden"  v-model="input">
  </v-card>
</template>

<script src="/lodash.min.js"></script>
<script>
import axios from 'axios'
import SimpleKeyboard from '../keyboard/NumericKeyboard';
import _ from 'lodash';

export default {
  name: 'PatrolDo',
  components: {
      SimpleKeyboard,
  },
  props:
  {
    line: String, 
    part: String, 
    cpid: Number, 
    workdate: String, 
    zone: String
  },
  data() {
      return{
         tableItems: [],
         item:[],
         input:'',
         filter: this.cpid,
         toggle_val: ['합격','불합격'],
         etcinput: '',
         question: '',
         answer: '질문을 하기 전까지는 대답할 수 없습니다.',
         expand: false
      }
  },
  created(){
    const token = localStorage.getItem('token')
      axios.get(`${this.$D1ApiPath}/api/inspection/todo/list/` + this.cpid, { headers: { Authorization: token } }) 
          .then(response => {
            this.tableItems = response.data     // 반환되는 값을 toDoItems에 저장한다.
            //console.log(this.$props.workdate);
            this.item=this.tableItems
          })
    this.debouncedGetAnswer = _.debounce(this.getAnswer, 100)
  },
  watch:{
    input(newQuestion){
      //this.answer = '입력을 기다리는 중...'
      this.debouncedGetAnswer()
    },
  },
  computed: {
    filteredTables() {
      return this.tableItems.filter(param => 
        ( 
         // !this.filter || 
         // this.filter.includes(param.CPID)
          //String(param.INDEX_KEY).includes(this.filter)
            (String(param.INDEX_KEY) == this.filter) ? true : false
        )
      )
    },
    getOKdisabled(){
        return this.tableItems.map(function(item) {
            return (item.IS_INPUT=='Y') ? true : false
        });
    },
    getImagePath (){
        let apipath=this.$D1ApiPath
          return this.tableItems.map(function(item) {
              return apipath+'/images/'+item.IMAGE
          });
    },
    getShowIcon(){
          return this.expand ? 'mdi-chevron-up' : 'mdi-chevron-down'
    },
    getShowClicked(){
          return this.expand ? '사진 접기' : '사진 펼치기'
    },
  },
  methods:{
    afterLeave () {
    this.$root.$emit('triggerScroll')
  },
    getAnswer: function () {
      //if (this.input.indexOf('?') === -1) {
      //  this.answer = '질문에는 일반적으로 물음표가 포함 됩니다. ;-)'
      //  return
      //}
      //this.answer = '생각중...'
      //var vm = this
      if( (!this.tableItems[0].UCLQ) && (!this.tableItems[0].CENT) && (this.tableItems[0].LCLQ)){
        if( this.input >= this.tableItems[0].LCLQ ){
          this.toggle_val=0 //합격
        }
        else{
          this.toggle_val=1 //불합격
        }
      }
      else if( (!this.tableItems[0].LCLQ) && (!this.tableItems[0].CENT) && (this.tableItems[0].UCLQ)){
        if( this.input <= this.tableItems[0].UCLQ ){
          this.toggle_val=0 //합격
        }
        else{
          this.toggle_val=1 //불합격
        }
      } 
      else if( (this.tableItems[0].LCLQ!=null || this.tableItems[0].LCLQ!='') &&  (this.tableItems[0].UCLQ!=null || this.tableItems[0].UCLQ!='')){
        if( (this.input >= this.tableItems[0].LCLQ) && (this.input <= this.tableItems[0].UCLQ) ){
          this.toggle_val=0 //합격
        }
        else{
          this.toggle_val=1 //불합격
        }
      } 
      else{
        this.toggle_val=2//비정상
      }
    },
      save(qLINE,qPART,qCPID,qIS_INPUT) {
        var inputnum=parseFloat(this.input)

        if(qIS_INPUT == 'Y'){
           if(!inputnum) return alert("검사결과를 숫자로 입력해주세요.")
           else{
              this.saveandcall(qLINE,qPART,qCPID)
           }
        }
        else{
              this.saveandcall(qLINE,qPART,qCPID)
        }
      },
      saveandcall(qLINE,qPART,qCPID){
        //var inputnum=(this.input)
        //if(!inputnum) {inputnum='NULL'}
        let rt=this.$router
        let vm=this
        const token = localStorage.getItem('token')
          //console.log(qCPID +'/' + this.$route.query.workdate +'/'+this.$route.query.zone+'/'+this.input+'/'+this.toggle_val+'/'+this.etcinput)
          
            axios.patch(`${this.$D1ApiPath}/api/inspection/todo/endtime/`+qCPID +'?pINPUT='+this.input+'&pIS_OK='+this.toggle_val+'&pETC='+this.etcinput,this.$store.state.user, { headers: { Authorization: token } }) 
            //+qCPID +'/' + this.$route.query.workdate +'/'+this.$route.query.zone,{params://
            //{ pCPID: qCPID, pWORK_DATE: this.$route.query.workdate, pTIME_ZONE_ID:this.$route.query.zone, pINPUT: this.input, pTOGGLE: this.toggle_val, pETC: this.etcinput }} )
            //+qCPID +'/' + this.$route.query.workdate +'/'+this.$route.query.zone+'/'+this.input+'/'+this.toggle_val+'/'+this.etcinput)
            .then(function (response) {
              //this.thisrouter.push({path: '/inspection/tl/ts/do', name: '검사결과입력', query:{line: qLINE, part: qPART, cpid: qCPID, workdate: this.date, zone: this.$route.query.zone}});
              //console.log(response.data)
              vm.$emit('close-modal')
            });
            
            // if (this.$route.name !== '결과입력(둔포2)') {
            //     this.$router.push({path: '/dp2/inspection/tl/ts', name: '공정조회(둔포2)', query:{line: qLINE, part: qPART,workdate: this.workdate, zone: this.zone}});
            // }
            //this.$forceUpdate();
//this.$emit('close-modal')
           //this.$router.push(this.$router.currentRoute);
          // this.$router.push({path: '/dp2/inspection/tl/ts', name: '공정조회(둔포2)', query:{line: qLINE, part: qPART,workdate: this.workdate, zone: this.zone}});
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
      },
      getDateFormat (a) {
        return [a.slice(0, 4), "-", a.slice(4, 6), "-", a.slice(6, 8)].join('')
      },
      setShowClicked(){
        this.expand = !this.expand
      },
    },
}
</script>
<style lang="scss">
.v-list-item { margin-top: 5px;}
.hg-theme-default .hg-button {
height: 65px;
}
.v-text-field.v-text-field--enclosed .v-text-field__details { margin-bottom: 0px;}
.v-text-field__details { min-height: 0px; }
.v-messages { min-height: 0px; }
.hg-theme-default .hg-row>div:last-child { width: 17px; } //백스페이스 크기
.v-btn-toggle { display:block; }
#oknot > div.v-slide-group__wrapper > div {display:grid;}
.v-chip--disabled { opacity: 1; }
#inspire > div > div > div > div:nth-child(4) > div > div > div.simple-keyboard.hg-theme-default.hg-layout-default > div:nth-child(4) > div:nth-child(1) {width:28px}
</style>