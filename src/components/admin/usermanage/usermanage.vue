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
          <v-dialog
            v-model="dialog"
            max-width="500px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn depressed color="warning" dark class="mb-2" v-bind="attrs" v-on="on">
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
                      <v-select
                          v-model="editedItem.corp_seq"
                          :items="tableCorp"
                          item-text="corp_name" 
                          item-value="corp_seq"
                          return-object
                          @input="atCorpInput($event)"
                          label="법인"
                          dense
                        ></v-select>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <div v-if="editedItem.corp_seq">
                        <v-select
                            v-model="editedItem.place_seq"
                            :items="tablePlace"
                            item-text="place_name" 
                            item-value="place_seq"
                            return-object
                            @input="atPlaceInput($event)"
                            label="사업장"
                            dense
                          ></v-select>
                      </div>
                      <div v-else>
                        <v-textarea
                          label="사업장"
                          value="법인을 먼저 선택해주세요."
                          rows="2"
                          readonly
                          dense
                      ></v-textarea>
                      </div>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <div v-if="editedItem.place_seq">
                        <v-select
                            v-model="editedItem.organ_seq"
                            :items="tableOrgan"
                            item-text="organ_name" 
                            item-value="organ_seq"
                            return-object
                            @input="atOrganInput($event)"
                            label="부서"
                            dense
                          ></v-select>
                      </div>
                      <div v-else>
                        <v-textarea
                          label="부서"
                          value="사업장을 먼저 선택해주세요."
                          rows="2"
                          readonly
                          dense
                      ></v-textarea>
                      </div>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.kname"
                        label="성명"
                        dense
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.user_id"
                        label="아이디"
                        dense
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.passwd"
                        value="9999"
                        disabled
                        label="비밀번호"
                        dense
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.email"
                        label="메일"
                        dense
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.cell_phone"
                        label="휴대폰"
                        dense
                      ></v-text-field>
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
      <v-data-table id="userTable"
        @click:row="handleClick"
        item-key="user_seq"
        single-select
        :headers="headers"
        :items="tableItems"
        :search="search"
        
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
  </v-col>
  </v-row>
  </v-app>
</template>

<script>
import axios from 'axios'

export default {
  
  data () {
    return {
      search: '',
      tableItems: [],
      tableCorp: [],
      tablePlace: [],
      tableOrgan: [],
      sel_corp_name:'',
       dialog: false,
       dialogDelete: false,
       headers: [
        { text: '고유번호', align: 'center', value: 'user_seq', class: "text-h6 blue lighten-5 info--text"  },
        { text: '법인', align: 'center', value: 'corp_name', class: "text-h6 blue lighten-5 info--text" },
        { text: '사업장', align: 'center', value: 'place_name', class: "text-h6 blue lighten-5 info--text"  },
        { text: '부서', align: 'center', value: 'organ_name', class: "text-h6 blue lighten-5 info--text"  },
        { text: '성명', align: 'center', value: 'kname', class: "text-h6 blue lighten-5 info--text"  },
        { text: '아이디', align: 'center', value: 'user_id', class: "text-h6 blue lighten-5 info--text"  },
        { text: '비밀번호', align: 'center', value: 'passwd', class: "text-h6 blue lighten-5 info--text"  },
        { text: '메일', align: 'center', value: 'email', class: "text-h6 blue lighten-5 info--text"  },
        { text: '휴대폰', align: 'center', value: 'cell_phone', class: "text-h6 blue lighten-5 info--text"  },
        { text: '삭제여부', align: 'center', value: 'del_yn', class: "text-h6 blue lighten-5 info--text"  },
        { text: '수정/삭제', align: 'center', value: 'actions', class: "text-h6 blue lighten-5 info--text"  },
      ],
      editedIndex: -1,
      editedItem: {
        user_seq: 0,
        corp_seq: '',
        corp_name: '',
        place_seq: '',
        place_name: '',
        organ_name: '',
        kname: '',
        user_id: '',
        passwd: '9999',
        email: '',
        cell_phone: '',
        del_yn: '',
      },
      defaultItem: {
        user_seq: 0,
        corp_seq: '',
        corp_name: '',
        place_seq: '',
        place_name: '',
        organ_name: '',
        kname: '',
        user_id: '',
        passwd: '9999',
        email: '',
        cell_phone: '',
        del_yn: '',
      },
    }
  },
    created(){
      const token = localStorage.getItem('token')
        axios.get(`${this.$D2ApiPath}/api/manage/list`, { headers: { Authorization: token } }) 
            .then(response => {
              this.tableItems = response.data     // 반환되는 값을 toDoItems에 저장한다.
              //console.log(this.tableItems);
            })
        axios.get(`${this.$D2ApiPath}/api/manage/corp`, { headers: { Authorization: token } }) 
            .then(response => {
              this.tableCorp = response.data     // 반환되는 값을 toDoItems에 저장한다.
              //console.log(this.tableCorp);
            })
        //this.initialPlace()
    },
  methods: {
    initialPlace() {
      const token = localStorage.getItem('token')
      axios.get(`${this.$D2ApiPath}/api/manage/place`, { headers: { Authorization: token } }) 
        .then(response => {
          this.tablePlace = response.data
        })
    },
    getPlace() {
      const token = localStorage.getItem('token')
      axios.get(`${this.$D2ApiPath}/api/manage/place/`+this.editedItem.corp_seq, { headers: { Authorization: token } }) 
      .then(response => {
        this.tablePlace = response.data
        //console.log(this.tablePlace);
      })
    },
    getOrgan() {
      const token = localStorage.getItem('token')
      axios.get(`${this.$D2ApiPath}/api/manage/organ/`+this.editedItem.place_seq, { headers: { Authorization: token } }) 
      .then(response => {
        this.tableOrgan = response.data
        //console.log(this.tableOrgan);
      })
    },
    atCorpInput(event) {
      //console.log(event)
      this.editedItem.corp_seq=event.corp_seq
      this.editedItem.corp_name=event.corp_name
      this.getPlace()
    },
    atPlaceInput(event) {
      //console.log(event)
      this.editedItem.place_seq=event.place_seq
      this.editedItem.place_name=event.place_name
      this.getOrgan()
    },
    atOrganInput(event) {
      //console.log(event)
      this.editedItem.organ_seq=event.organ_seq
      this.editedItem.organ_name=event.organ_name
    },
    handleClick: function (item, row) {
      row.select(true);
      //if (event.target.classList.contains('btn__content')) return;
      this.sel_corp_name=item.corp_name
      
    },

    editItem (item) {
      //console.log("editItem selected")
      this.editedIndex = this.tableItems.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.getPlace()
      this.getOrgan()
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
        //this.initialPlace()
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
        //console.log(this.editedItem)
          axios.patch(`${this.$D2ApiPath}/api/manage/list/UPD`,{ items: this.editedItem} )
          .then(r => {
            alert(r.data.output.outmsg) //(이)가 정상 처리 되었습니다.
          })
      } else {//등록
        this.tableItems.push(this.editedItem) 
        axios.patch(`${this.$D2ApiPath}/api/manage/list/INS`,{ items: this.editedItem} )
          .then(r => {
            alert(r.data.output.outmsg) //(이)가 정상 처리 되었습니다.
          })
      }
      this.close()
    },
  },
  
  computed: {
    formTitle () {
      return this.editedIndex === -1 ? '신규 등록' : '수정'
    },
  },
  watch: {
    dialog (val) {
      val || this.close()
    },
    dialogDelete (val) {
      val || this.closeDelete()
    },
  },
}
</script>

<style>
h1, h2 {
font-weight: normal;
}

ul {
list-style-type: none;
padding: 0;
}

li {
display: inline-block;
margin: 0 10px;
}

a {
color: #35495E;
}
/*
.v-data-table__wrapper tbody tr:nth-of-type(odd) {
  background-color: rgba(115, 134, 241, 0.1);
}

.v-data-table__wrapper thead th {
  background: #1565C0;
}

.theme--light.v-data-table > .v-data-table__wrapper > table > thead > tr:last-child > th {
  color: white;
}

.theme--light.v-data-table .v-data-table-header th.sortable:hover, .theme--light.v-data-table .v-data-table-header th.sortable.active {
  color: white;
}
.theme--light.v-data-table .v-data-table-header th.sortable.active .v-data-table-header__icon {
  color: white;
}
.theme--light.v-data-table .v-data-table-header th.sortable .v-data-table-header__icon {
    color: white;
}
table.v-table tbody td:first-child, table.v-table tbody td:not(:first-child), table.v-table tbody th:first-child, table.v-table tbody th:not(:first-child), table.v-table thead td:first-child, table.v-table thead td:not(:first-child), table.v-table thead th:first-child, table.v-table thead th:not(:first-child) {
  padding: 0 10px
}
tr.v-data-table__selected {
  background: pink !important;
}
*/
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
  background: darkgrey !important;
}
#userTable table thead tr th + th { border-left:1px solid #dddddd !important; }
#userTable table tbody tr td + td { border-left:1px solid #dddddd !important; }
</style>
