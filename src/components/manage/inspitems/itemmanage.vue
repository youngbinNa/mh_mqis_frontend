<template>
  <v-app id="inspire" >
    <div class="text-center">
    <v-card>
        <v-file-input 
              v-model="image"
              >
            </v-file-input>
          <v-btn
        class="ma-2"
        @click="submit"
      >
        업로드
      </v-btn>
    </v-card>
      
    <p>
  <input type="file" accept="image/*" ref="myFile"  v-cloak @drop.prevent="addDropFile" @dragover.prevent
   @change="previewFile">
  </p>
  <div v-if="imgsrc">
  <v-img  :src="imgsrc" class="imgpreview"></v-img></div>
  
  <!-- eslint-disable -->

        <!-- eslint-enable -->
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
          <v-dialog
            v-model="dialog"
            max-width="500px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="warning" dark class="mb-2" v-bind="attrs" v-on="on">
                신규 등록
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>
  
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.WCEN"
                        label="라인번호"
                        dense
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.MACO"
                        label="아이디"
                        dense
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.PSNO"
                        label="아이디"
                        dense
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.PSNM"
                        label="성명"
                        dense
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.MANM"
                        label="아이디"
                        dense
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="12" md="12">
                      <div  v-cloak @drop.prevent="addDropFile" @dragover.prevent>
                        <v-file-input 
                          v-model="editedItem.image"
                          label="클릭해 첨부하거나 여기에 파일을 드래그"
                          outlined
                          @change="Preview_image"
                          accept="image/png, image/jpeg, image/bmp"
                          >
                        </v-file-input>
                        </div>
                        <div v-if="editedItem.imgsrc">
                        <v-img  :src="editedItem.url"></v-img>
                      </div>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
  
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">취소</v-btn>
                <v-btn color="blue darken-1" text @click="save">저장</v-btn>
              </v-card-actions>
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
      <v-data-table v-else
          item-key="INDEX_KEY"
          single-select
          :headers="headers"
          :items="tableItems"
          :search="search"
          fixed-header
          height="700"
          >
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon
            small
            class="mr-2"
            @click="editItem(item)">
            mdi-pencil
          </v-icon>
          <v-icon
            small
            @click="deleteItem(item)">
            mdi-delete
          </v-icon>
        </template>
          <v-alert slot="no-results" :value="true" type="error">
            "{{ search }}" 는 없는 데이터입니다.
          </v-alert>
      </v-data-table>
      </div>
  </v-app>
</template>


<script>
import axios from 'axios'

export default {
  
  data () {
    return {
        
         image:null,imgsrc:null,url:'',
        tableItems:[],
        search: '',
        dialog: false,
        dialogDelete: false,
        headers: [
          { text: '수정/삭제', value: 'actions',width: "110px"},
          { text: '라인번호', align: 'start', value: 'WCEN',width: "100px"},
          { text: '품번', value: 'MACO',width: "150px"},
          { text: '공정번호', value: 'PSNO',width: "100px"},
          { text: '공정명', value: 'PSNM',width: "200px"},
          { text: '설비명', value: 'MANM',width: "200px" },
          { text: '제품', value: 'NAM1',width: "200px" },
          { text: '공정', value: 'NAM2',width: "90px" },
          { text: '특별특성', value: 'SCGU',width: "100px" },
          { text: '규격', value: 'COND',width: "100px" },
          { text: '확인방법', value: 'CKCD',width: "200px" },
          { text: '주기', value: 'JGCD',width: "100px" },
          { text: '이상발생시 조치사항', value: 'REM1',width: "200px" },
          { text: '센터', value: 'CENT',width: "80px" },
          { text: '하한값', value: 'LCLQ',width: "90px" },
          { text: '상한값', value: 'UCLQ' ,width: "90px"},
          { text: '단위', value: 'UNIT',width: "80px" },
          { text: '등록일', value: 'REG_DATE',width: "200px" },
        ],
        editedIndex: -1,
        editedItem: {
          WCEN: '',
          MACO: '',
          PSNO: '',
          PSNM: '',
          MANM: '',
          url: null,
          image: null,
          imgsrc:'',
        },
        defaultItem: {
          WCEN: '',
          MACO: '',
          PSNO: '',
          PSNM: '',
          MANM: '',
          url: null,
          image: null,
          imgsrc:'',
        },
        firstLoad: true,
      }
    },
   created(){
      this.gettableItems()
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
       axios.get('/api/manage/item/list', { headers: { Authorization: token } })
        .then(response => {
              this.tableItems = response.data
        })

        setTimeout(() => {
          if (this.firstLoad) this.firstLoad = false
        }, 1000);
     },

     addDropFile(e) { this.image = e.dataTransfer.files[0]; },
     Preview_image() {
        this.url= URL.createObjectURL(this.image)
        console.log("url: "+this.url)
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
      this.tableItems.splice(this.editedIndex, 1)
      this.closeDelete()
    },

    close () {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    closeDelete () {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    save () {
      if (this.editedIndex > -1) { //수정
        Object.assign(this.tableItems[this.editedIndex], this.editedItem)
      } else {//등록
        this.tableItems.push(this.editedItem) 
      }
      this.close()
    },
    submit() {
      const formData = new FormData();
      formData.append('Image', this.image)

      for(let key of formData.entries()){ console.log(`${key}`)}
      const token = localStorage.getItem('token')
      axios.post('/api/manage/item/upload', formData, { 
          headers: {
                    Authorization: token,
                    'Content-Type': 'multipart/form-data'
                   } 
        }).then((res) => {
          console.log("RESPONSE ==== : ", res);
        }).catch((err) => {
          console.log("AXIOS ERROR: ", err);
        })
    }
  },
  computed: {
    formTitle () {
      return this.editedIndex === -1 ? '신규 등록' : '수정'
    },
  },
}
</script>

<style>
/*헤더 백그라운드 컬러*/
.v-data-table__wrapper thead th {
  background: #FFF1E1;
}

.theme--light.v-data-table.v-data-table--fixed-header thead th {
  background:#FFF1E1;
}
/**/
.theme--light.v-data-table > .v-data-table__wrapper > table > thead > tr:last-child > th {
  color: orange;
}

.theme--light.v-data-table .v-data-table-header th.sortable:hover, .theme--light.v-data-table .v-data-table-header th.sortable.active {
  color: orange;
}
.theme--light.v-data-table .v-data-table-header th.sortable.active .v-data-table-header__icon {
  color: orange;
}
.theme--light.v-data-table .v-data-table-header th.sortable .v-data-table-header__icon {
    color: orange;
}
tr.v-data-table__selected {
  background: pink !important;
}
</style>
