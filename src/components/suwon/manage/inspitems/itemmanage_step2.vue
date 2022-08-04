<template>
  <v-app id="inspire" >
   <v-row>
      <v-col>
  <template v-slotcenter>
      <v-toolbar flat>
        
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="검색"
          single-line
          hide-details
        ></v-text-field>
        <v-spacer></v-spacer> 
        <v-row class="justify-space-between">
                      <v-chip  >{{ $route.query.line }}</v-chip>
                      <v-chip  >{{ $route.query.line_name }}</v-chip>
                      <v-chip  >{{ $route.query.part }}</v-chip>
                      <v-chip  >{{ $route.query.part_name }}</v-chip>
        </v-row>  
        <v-spacer></v-spacer> 
          <v-dialog
            v-model="dialog"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn depressed color="warning" dark class="mb-2" v-bind="attrs" v-on="on">
                신규 등록
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
                <v-spacer></v-spacer>
               <v-card-actions>
                
                <v-btn color="blue darken-1" text @click="close">취소</v-btn>
                <v-btn color="blue darken-1" text @click="save">저장</v-btn>
              </v-card-actions>
              </v-card-title>
              <v-card-text>
                 



                  <v-row>
            <v-col>
                <v-row>
                   <v-col cols="12" sm="6" md="2">
                        <v-select
                          v-model="defaultItem.WCEN"
                          :items="tablePartItems"
                          item-text="WORK_SHOP_ID" 
                          item-value="WORK_SHOP_ID" 
                          label="라인번호"
                          outlined
                          dense
                        ></v-select>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                        <v-select
                          v-model="defaultItem.MACO"
                          :items="tablePartItems"
                          :item-text="item => item.PART_ID +' - '+ item.PART_NAME"
                          item-value="PART_ID" 
                          label="품번"
                          outlined
                          dense
                        ></v-select>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.PSNO"
                        label="공정번호"
                        dense
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.PSNM"
                        label="공정명"
                        dense
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.MANM"
                        label="설비명"
                        dense
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.NAM1"
                        label="제품"
                        dense
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.NAM2"
                        label="공정"
                        dense
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-select
                          v-model="defaultItem.SCGU"
                          :items="YNItems"
                          item-text="name" 
                          item-value="value"
                          label="특별특성"
                          outlined
                          dense
                        ></v-select>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.CKCD"
                        label="확인방법"
                        dense
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.REM1"
                        label="이상발생 시 조치사항"
                        dense
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.REM2"
                        label="비고"
                        dense
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-select
                          v-model="editedItem.JGCD"
                          :items="jgcdItems"
                          item-text="value" 
                          item-value="value"
                          label="주기"
                          outlined
                          dense
                        ></v-select>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.SIZE"
                        label="시료수"
                        type="number"
                        oninput="javascript: this.value = this.value.replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g, '' );"
                        dense
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.POINT"
                        label="검사포인트"
                        type="number"
                        oninput="javascript: this.value = this.value.replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g, '' );"
                        dense
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.COND"
                        label="규격"
                        dense
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.CENT"
                        label="센터"
                        type="number"
                        dense
                      ></v-text-field>
                    </v-col>
                    <!--
                      <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.CENT"
                        label="센터"
                        type="number"
                        oninput="javascript: this.value = this.value.replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g, '' );"
                        dense
                      ></v-text-field>
                    </v-col>
                    -->
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.LCLQ"
                        label="하한값"
                        type="number"
                        dense
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.UCLQ"
                        label="상한값"
                        type="number"
                        dense
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.UNIT"
                        label="단위"
                        dense
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-select
                          v-model="editedItem.IS_INPUT"
                          :items="YNItems"
                          item-text="name" 
                          item-value="value"
                          label="결과 필수"
                          outlined
                          dense
                        ></v-select>
                    </v-col>
                    <template v-if="this.editedIndex > -1">
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.ORDR"
                          label="순서"
                          type="number"
                          oninput="javascript: this.value = this.value.replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g, '' );"
                          dense
                        ></v-text-field>
                      </v-col>
                    </template>
                </v-row>
            </v-col>
            <v-divider vertical></v-divider>
            <v-col>
                  <v-row>
                   

                    <v-col cols="6" sm="12" md="12">
                      <div v-cloak @drop.prevent="addDropFile" @dragenter.prevent @dragover.prevent>
                        <v-file-input 
                          v-model="editedItem.image"
                          label="여기를 클릭하여 파일 첨부"
                          outlined
                          @change="Preview_image"
                          accept="image/png, image/jpeg, image/bmp, image/jpg"
                          >
                        </v-file-input>
                        </div>
                        
                      </v-col>
                      </v-row>
                      <v-row justify="center">
                      <v-col cols="8" >
                        <div style="max-width:600px" v-if="this.editedItem.image"><v-img  :src="this.editedItem.url"></v-img></div>
                        <div style="max-width:600px" v-else> 
                            <v-img
                              :src="getImagePath"
                              max-width="600"
                              max-height="600" >
                            </v-img>
                        </div>
                      </v-col>
                  </v-row>
            </v-col>
          </v-row>
              </v-card-text>
  
              
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="headline">정말 삭제합니까?</v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDelete">취소</v-btn>
                <v-btn color="blue darken-1" text @click="deleteItemConfirm">확인</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
         
        
        </v-toolbar>
      </template>
      <v-skeleton-loader v-if="firstLoad" type="table"></v-skeleton-loader>
      <!--<v-sheet width="1700" v-else>-->
      <v-data-table  v-else id="itemTable"
          item-key="INDEX_KEY"
          single-select
          :headers="headers"
          :items="tableItems"
          :search="search"
          fixed-header
          :options="pagination"
          :footer-props="footerProps"
          
          height="800"
          ><!-- :item-class="itemRowBackground" -->
        <template v-slot:[`item.actions`]="{ item }">
            <template v-if="item.USE_YN=='Y'">
              <v-btn x-small block outlined @click="editItem(item)">
                <v-icon small>mdi-pencil</v-icon>
              </v-btn>
              <v-btn x-small block outlined @click="deleteItem(item)">
                <v-icon small>mdi-delete</v-icon>
              </v-btn>
            </template>
            <template v-else>
                <v-btn medium block color="primary" @click="activate_USE_YN(item)">
                  활성화
                </v-btn>
            </template>
        </template>
        <template v-slot:[`item.IMAGE`]="{ item }">
            <div class="p-2" >
              <v-img :src="getTableImageInPath(item)" height="50px" width="50px"></v-img>
            </div>
          </template>
          <v-alert slot="no-results" :value="true" type="error">
            "{{ search }}" 는 없는 데이터입니다.
          </v-alert>
      </v-data-table>
      <!--</v-sheet>-->
  </v-col>
  </v-row>
  </v-app>
</template>


<script>
import axios from 'axios'

export default {
  data () {
    return {
        pagination: {
          itemsPerPage: 50
        },
        footerProps: {'items-per-page-options': [10, 30, 50, 100, -1]},
         image:null,imgsrc:null,url:'',
        jgcdItems : [ { value:'Shift'},{value:'일'},{value:'주'}  ], 
        YNItems : [ { name: 'Y-필수', value:'Y'},{name: 'N-불필',value:'N'}  ], 
        tableItems:[],
        tablePartItems:[],
        search: '',
        dialog: false,
        dialogDelete: false,
        headers: [
          { text: '수정/삭제', value: 'actions',width: "110px", align:"center", class: "orange lighten-5 warning--text"},
          { text: '이미지', value: 'IMAGE',width: "100px", align:"center", class: "orange lighten-5 warning--text"},
          //{ text: '라인번호', align: 'start', value: 'WCEN',width: "100px"},
          //{ text: '품번', value: 'MACO',width: "150px"},
          //{ text: '시퀀스', value: 'INDEX_KEY',width: "90px", align:"center", class: "orange lighten-5 warning--text"},
          { text: '순서', value: 'ORDR',width: "90px", align:"center", class: "orange lighten-5 warning--text"},
          { text: '공정번호', value: 'PSNO',width: "100px", align:"center", class: "orange lighten-5 warning--text"},
          { text: '공정명', value: 'PSNM',width: "200px", class: "orange lighten-5 warning--text"},
          
          { text: '주기', value: 'JGCD',width: "90px" , align:"center", class: "orange lighten-5 warning--text"},
          { text: '시료수', value: 'SIZE',width: "90px" , align:"center", class: "orange lighten-5 warning--text"},
          { text: '포인트', value: 'POINT',width: "90px" , align:"center", class: "orange lighten-5 warning--text"},
          { text: '규격', value: 'COND',width: "100px" , class: "orange lighten-5 warning--text"},
          { text: '센터', value: 'CENT',width: "80px", align:"center", class: "orange lighten-5 warning--text" },
          { text: '하한값', value: 'LCLQ',width: "90px", align:"center", class: "orange lighten-5 warning--text" },
          { text: '상한값', value: 'UCLQ' ,width: "90px", align:"center", class: "orange lighten-5 warning--text"},
          { text: '단위', value: 'UNIT',width: "80px", align:"center", class: "orange lighten-5 warning--text" },
          { text: '결과 필수', value: 'IS_INPUT',width: "110px", align:"center", class: "orange lighten-5 warning--text" },
          { text: '제품', value: 'NAM1',width: "150px" , class: "orange lighten-5 warning--text"},
          { text: '공정', value: 'NAM2',width: "150px", class: "orange lighten-5 warning--text" },
          { text: '특별특성', value: 'SCGU',width: "100px", class: "orange lighten-5 warning--text"  },
          { text: '확인방법', value: 'CKCD',width: "200px" , class: "orange lighten-5 warning--text" },
          { text: '이상발생시 조치사항', value: 'REM1',width: "200px", class: "orange lighten-5 warning--text"  },
          { text: '비고', value: 'REM2',width: "200px", class: "orange lighten-5 warning--text"  },
          { text: '설비명', value: 'MANM',width: "200px", class: "orange lighten-5 warning--text"  },
        ],
        editedIndex: -1,
        editedItem: {
          INDEX_KEY:'',
          WCEN: this.$route.query.line,
          MACO: this.$route.query.part,
          PSNO: '',
          PSNM: '',
          MANM: '',
          NAM1:'',
          NAM2:'',
          SCGU:'',
          CKCD:'',
          REM1:'',
          REM2:'',
          JGCD:'',
          SIZE:'',
          POINT:'',
          COND:'',
          CENT:'',
          LCLQ:'',
          UCLQ:'',
          UNIT:'',
          IS_INPUT:'',
          USE_YN:'',
          ORDR:'',
          url: null,
          image: null,
          imgsrc:'',
        },
        defaultItem: {
          INDEX_KEY:'',
          WCEN: this.$route.query.line,
          MACO: this.$route.query.part,
          PSNO: '',
          PSNM: '',
          MANM: '',
          NAM1:'',
          NAM2:'',
          SCGU:'N',
          CKCD:'',
          REM1:'',
          REM2:'',
          JGCD:'',
          SIZE:'',
          POINT:'',
          COND:'',
          CENT:'',
          LCLQ:'',
          UCLQ:'',
          UNIT:'',
          IS_INPUT:'',
          USE_YN:'',
          ORDR:'',
          url: null,
          image: null,
          imgsrc:'',
        },
        firstLoad: true,
        
        param: {
            SEQ: '',
            WCEN:'',
            MACO:'',
        },
        filelist: '' // Store our uploaded files
      }
    },
   created(){
      this.gettableItems()
      this.gettablePartItems()
   },
  watch: {
    dialog (val) {
      val || this.close()
    },
    dialogDelete (val) {
      val || this.closeDelete()
    },
  },
   methods: {
    gettableItems(){
       const token = localStorage.getItem('token')
       axios.get(`${this.$SuwonApiPath}/api/manage/item/list/` + this.$route.query.line +'/'+this.$route.query.part, { headers: { Authorization: token } }) 
        .then(response => {
              this.tableItems = response.data
        })

        setTimeout(() => {
          if (this.firstLoad) this.firstLoad = false
        }, 1000);
     },
    gettablePartItems(){
       const token = localStorage.getItem('token')
       axios.get(`${this.$SuwonApiPath}/api/manage/item/part/list`, { headers: { Authorization: token } }) 
        .then(response => {
              this.tablePartItems = response.data
              //console.log(response.data)
        })
     },
     addDropFile(e) { 
       //this.editedItem.image = e.dataTransfer.files[0]; 
       //this.Preview_image
       this.inputImageFile(e.dataTransfer.files)
      },
      inputImageFile (files) {
        if (files.length) {
          let file = files[0]
          this.editedItem.image = file
          this.editedItem.url= URL.createObjectURL(file)
        }
      },
     Preview_image() {
        this.editedItem.url= URL.createObjectURL(this.editedItem.image)
        console.log("url: "+this.editedItem.url)
     },
    previewFile() {
      let file = this.$refs.myFile.files[0];
      if(!file || file.type.indexOf('image/') === -1) return;
      let reader = new FileReader();

      reader.onload = e => {
        this.imgsrc = e.target.result;
      }

      reader.readAsDataURL(file);
    },
    editItem (item) {
      //console.log("editItem selected")
      this.editedIndex = this.tableItems.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem (item) {
      this.editedIndex = this.tableItems.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    deleteItemConfirm () {
      const token = localStorage.getItem('token')
      axios.patch(`${this.$SuwonApiPath}/api/manage/item/list/DEL`,this.editedItem, { headers: { Authorization: token }} )
        .then(r => {
          alert(r.data.output.outmsg) //(이)가 정상 처리 되었습니다.
        })
      this.tableItems.splice(this.editedIndex, 1)
      this.closeDelete()
    },

    close () {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
      this.gettableItems()
    },

    closeDelete () {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
      this.gettableItems()
    },
    closeActive () {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
      this.tableItems.splice(this.editedIndex, 1)
      this.gettableItems()
    },

    save () {
      const token = localStorage.getItem('token')
      if (this.editedIndex > -1) { //수정
        //Object.assign(this.tableItems[this.editedIndex], this.editedItem)
        axios.patch(`${this.$SuwonApiPath}/api/manage/item/list/UPD`,this.editedItem, { headers: { Authorization: token }} )
          .then(r => {
            alert(r.data.output.outmsg) //(이)가 정상 처리 되었습니다.
          })
          this.close()
          this.submit();
        
      } else {//등록
        //this.tableItems.push(this.editedItem) 
        axios.patch(`${this.$SuwonApiPath}/api/manage/item/list/INS`,this.editedItem, { headers: { Authorization: token }} )
          .then(r => {
            alert(r.data.output.outmsg) //(이)가 정상 처리 되었습니다.
          })
        //this.submit();
      }
      this.close()
    },
    activate_USE_YN(item){
      const token = localStorage.getItem('token')
      axios.patch(`${this.$SuwonApiPath}/api/manage/item/active`,item, { headers: { Authorization: token }} )
        .then(r => {
          alert(r.data) //(이)가 정상 처리 되었습니다.
        })
      this.closeActive()
    },
    submit() {
      const formData = new FormData();
      formData.append('Image', this.editedItem.image)
      //formData.append('SEQ', this.editedItem.INDEX_KEY)
      //formData.append('WCEN', this.editedItem.WCEN)
      //formData.append('MACO', this.editedItem.MACO)
/**
      this.param.SEQ=this.editedItem.INDEX_KEY
      this.param.WCEN=this.editedItem.WCEN
      this.param.MACO=this.editedItem.MACO
**/
      const token = localStorage.getItem('token')
      /*
      axios.post(`${this.$SuwonApiPath}/api/manage/item/path`,this.param, {  
          headers: {
                    Authorization: token
                   } 
        }).then((res) => {
          console.log("RESPONSE ==== : ", res);
        }).catch((err) => {
          console.log("AXIOS ERROR: ", err);
        })
*/
      //for(let key of formData.entries()){ console.log(`${key}`)}
      //const token = localStorage.getItem('token')
      
      axios.post(`${this.$SuwonApiPath}/api/manage/item/upload/`+this.editedItem.INDEX_KEY+'/'+this.editedItem.WCEN+'/'+this.editedItem.MACO , formData, {  
          headers: {
                    Authorization: token,
                    //'Content-Type': 'multipart/form-data'
                   } 
        }).then((res) => {
          console.log("RESPONSE ==== : ", res);
        }).catch((err) => {
          console.log("AXIOS ERROR: ", err);
        })
        
    },
    getTableImageInPath(item){
      return item.IMAGE ? `${this.$SuwonApiPath}/images/`+item.IMAGE : `${this.$SuwonApiPath}/images/patrolsample.png`
    },
    itemRowBackground: function (item) {
      return item.USE_YN=='N' ? 'style-1' : ''
    },
    onChange() {
      this.filelist = this.$refs.file.files;
      this.editedItem.url= URL.createObjectURL(this.editedItem.image)
    },
    remove() {
      this.filelist='';
    },
    dragover(event) {
      event.preventDefault();
      // Add some visual fluff to show the user can drop its files
      if (!event.currentTarget.classList.contains('bg-green-300')) {
        event.currentTarget.classList.remove('bg-gray-100');
        event.currentTarget.classList.add('bg-green-300');
      }
    },
    dragleave(event) {
      // Clean up
      event.currentTarget.classList.add('bg-gray-100');
      event.currentTarget.classList.remove('bg-green-300');
    },
    drop(event) {
      event.preventDefault();
      this.$refs.file.files = event.dataTransfer.files;
      this.onChange(); // Trigger the onChange event manually
      // Clean up
      event.currentTarget.classList.add('bg-gray-100');
      event.currentTarget.classList.remove('bg-green-300');
    }
  },
  computed: {
    formTitle () {
      return this.editedIndex === -1 ? '신규 등록' : '수정'
    },
    getImagePath (){
      return this.editedItem.IMAGE ? `${this.$SuwonApiPath}/images/`+this.editedItem.IMAGE : `${this.$SuwonApiPath}/images/patrolsample.png`
    },
  },
}
</script>

<style lang="scss">

.style-1 {
  background: repeating-linear-gradient(45deg, #444, #444 5px, #999 0, #999 20px)
}
#itemTable table thead tr th + th { border-left:1px solid #dddddd !important; }
#itemTable table tbody tr td + td { border-left:1px solid #dddddd !important; }
//@import 'https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/1.1.4/tailwind.min.css';
</style>
