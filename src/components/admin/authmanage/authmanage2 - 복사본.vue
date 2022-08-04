<template>
  <v-app>
    
      <v-row >
        <v-col class="pa-6">
          <v-card class="pa-2">
            <v-treeview
              :active.sync="active"
              :items="items"
              :open.sync="open"
              activatable
              color="warning"
              open-on-click
              return-object
              dense
            ></v-treeview>
          </v-card>
        </v-col>
        <v-col
          class="pa-6" 
        >
          <v-card class="pa-2">
              <v-card-title>
                    
                <template v-if="!selected">
                    선택된 조직이 없습니다.
                </template>
                <template v-else>
                    선택된 조직
                </template>
               
                <v-spacer></v-spacer>
                <v-text-field
                    v-model="search"
                    append-icon="mdi-magnify"
                    label="검색"
                    single-line
                    hide-details
                  ></v-text-field>
            </v-card-title>
                <!--<v-skeleton-loader v-if="firstLoad" :loading="loading" type="table"></v-skeleton-loader>
                -->
                <v-data-table
                  item-key="id"
                  single-select
                  :headers="headers"
                  :items="tableItems"
                  :search="search"
                  :items-per-page=5
                  >
                  <v-alert slot="no-results" :value="true" type="error">
                    "{{ search }}" 는 없는 데이터입니다.
                  </v-alert>
                </v-data-table>
          </v-card>
          <v-card class="pa-2" style="margin-top:10px">
            <v-card-title>
               권한 리스트
            <v-spacer></v-spacer>
            <v-text-field
              v-model="search2"
              append-icon="mdi-magnify"
              label="검색"
              single-line
              hide-details
            ></v-text-field>
          </v-card-title>
            <v-data-table
                item-key="user_seq"
                single-select
                :headers="lvheaders"
                :items="tableLevelItems"
                :search="search2"
                >
                <v-alert slot="no-results" :value="true" type="error">
                  "{{ search2 }}" 는 없는 데이터입니다.
                </v-alert>
              </v-data-table>
          </v-card>
        </v-col>
      </v-row>
      
    </v-app>
</template>

<script>
import axios from 'axios'

export default {
  
  data () {
    return {
        loading: true,
        firstLoad: true,
        active: [],
        open: [],
        selectionType: 'independent',
        selection: [],
        items: [],
        tableItems:[],
        tableLevelItems:[],
        userItems:[],
        search: '',
        search2: '',
        headers: [
          { text: '법인', align: 'start', value: 'corp_name'},
          { text: '사업장', value: 'place_name' },
          { text: '부서', value: 'organ_name' },
          { text: '성명', value: 'kname' },
          { text: '권한', value: 'level' },
        ],
        lvheaders: [
          { text: '법인', align: 'start', value: 'corp_name'},
          { text: '사업장', value: 'place_name' },
          { text: '부서', value: 'organ_name' },
          { text: '성명', value: 'kname' },
          { text: '권한', value: 'level' },
          { text: '등록자', value: 'reg_kname' },
          { text: '등록일', value: 'reg_date' },
        ],
      }
    },
    created(){
      const token = localStorage.getItem('token')
      
        axios.get('/api/auth/list', { headers: { Authorization: token } }) 
            .then(response => {
              this.items = response.data
              //console.log(JSON.stringify(this.items));
         //     this.items=this.getTree(this.tableItems)
            })
        axios.get('/api/auth/gwuser', { headers: { Authorization: token } }) 
            .then(response => {
              this.tableItems = response.data
              //console.log(JSON.stringify(this.items));
         //     this.items=this.getTree(this.tableItems)
            })
        axios.get('/api/auth/userlv', { headers: { Authorization: token } }) 
            .then(response => {
              this.tableLevelItems = response.data
              //console.log(JSON.stringify(this.items));
         //     this.items=this.getTree(this.tableItems)
            })
    },
    computed: {
      selected () {
        if (!this.active.length) return undefined
       // const id = this.active[0]
        
        this.getUser (this.active[0].id)
        return this.active
      },
    },
    methods: {
      getUser (organ_seq) {
        const token = localStorage.getItem('token')
        axios.get('/api/auth/list/'+organ_seq, { headers: { Authorization: token } }) 
            .then(response => {
              this.tableItems = response.data
            })
      },
      getUserFromApi(organ_seq) {
        this.firstLoad = true;
        this.loading = true;
        return new Promise((resolve) => {
          //let items = this.getDesserts();
          const token = localStorage.getItem('token')
          axios.get('/api/auth/list/'+organ_seq, { headers: { Authorization: token } }) 
              .then(response => {
                this.tableItems = response.data
              })
          let items = this.tableItems

          setTimeout(() => {
          if (this.firstLoad) this.firstLoad = false
            this.loading = false;
            resolve({
              items,
            });
          }, 1000);
        });
        
      },
    },
}
</script>

<style>

.v-data-table__wrapper thead th {
  background: #FFF1E1;
}

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
