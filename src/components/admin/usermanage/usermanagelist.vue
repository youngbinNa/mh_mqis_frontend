<template>
  <v-container grid-list-md>
    
      <template v-slotcenter>
      <v-toolbar flat>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="검색"
          single-line
          hide-details
        ></v-text-field>
        
          <v-dialog
            v-model="dialog"
            max-width="500px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
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
                        v-model="editedItem.corp_name"
                        label="법인"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.place_name"
                        label="사업장"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.organ_name"
                        label="부서"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.kname"
                        label="성명"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.user_id"
                        label="아이디"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.passwd"
                        label="비밀번호"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.email"
                        label="메일"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.cell_phone"
                        label="휴대폰"
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
      <v-data-table
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

  </v-container>
</template>

<script>
import axios from 'axios'

export default {
  
  data () {
    return {
      search: '',
      tableItems: [],
      sel_corp_name:'',
       dialog: false,
       dialogDelete: false,
       headers: [
        { text: '고유번호', align: 'start', value: 'user_seq' },
        { text: '법인', value: 'corp_name'},
        { text: '사업장', value: 'place_name' },
        { text: '부서', value: 'organ_name' },
        { text: '성명', value: 'kname' },
        { text: '아이디', value: 'user_id' },
        { text: '비밀번호', value: 'passwd' },
        { text: '메일', value: 'email' },
        { text: '휴대폰', value: 'cell_phone' },
        { text: '수정/삭제', value: 'actions' },
      ],
      editedIndex: -1,
      editedItem: {
        user_seq: 0,
        corp_name: '',
        place_name: '',
        organ_name: '',
        kname: '',
        user_id: '',
        passwd: '',
        email: '',
        cell_phone: '',
      },
      defaultItem: {
        user_seq: 0,
        corp_name: '',
        place_name: '',
        organ_name: '',
        kname: '',
        user_id: '',
        passwd: '',
        email: '',
        cell_phone: '',
      },
    }
  },
    created(){
      const token = localStorage.getItem('token')
        axios.get('/api/manage/list', { headers: { Authorization: token } }) 
            .then(response => {
              this.tableItems = response.data     // 반환되는 값을 toDoItems에 저장한다.
              console.log(this.tableItems);
            })
    },
  methods: {
    handleClick: function (item, row) {
      row.select(true);
     // this.sel_corp_name=item.corp_name
      
    },

    editItem (item) {
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
      if (this.editedIndex > -1) {
        Object.assign(this.tableItems[this.editedIndex], this.editedItem)
      } else {
        this.tableItems.push(this.editedItem)
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
</style>
