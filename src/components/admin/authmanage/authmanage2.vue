<template>
  <v-app>
       <v-app-bar flat dense app >
        <v-col class="justify-start pa-0 ma-0">
            
        </v-col>
        <v-col  class="justify-end" style="text-align:right">
          <span v-if="!sel_user_seq" class="headline">
                사용자를 선택해주세요.
            </span>
            <span v-else class="headline">
                선택된 사용자: {{sel_user_name}}
            </span>
          <v-btn @click="save" color="success" depressed>저장 <v-icon right>mdi-content-save</v-icon></v-btn>
        </v-col>
       </v-app-bar>
      <v-row >
        <v-col class="pa-6" md="4">
          <v-col class="pa-0 ma-0">
            <v-card class="pa-0 ma-0">
              <v-card-title>
                사업장
              </v-card-title>
              <v-data-table
                  dense
                  v-model="selectedplace"
                  item-key="pplace_seq"
                  single-select
                  :headers="placeheaders"
                  :items="items"
                  @click:row="handleClick"
                  >
                </v-data-table>
            </v-card>
          </v-col>
          <v-col class="pt-6 pa-0 ma-0">
            <v-card class="pa-0 ma-0">
                <v-card-title>
                 <v-card-text class="pa-0 ma-0">
                      사용자
                 </v-card-text>
                 <v-card-text class="pa-0 ma-0">
                    <v-text-field class="pa-0 ma-0"
                        v-model="search"
                        append-icon="mdi-magnify"
                        label="검색"
                        single-line
                        hide-details
                      ></v-text-field>
                 </v-card-text>
              </v-card-title>
                  <v-skeleton-loader v-if="firstLoad" height="300" type="table-tbody"></v-skeleton-loader>
                  <v-data-table v-else
                    dense
                    item-key="user_seq"
                    single-select
                    :headers="headers"
                    :items="tableItems"
                    :search="search"
                    :items-per-page=10
                    @click:row="handleClickUser"
                    >
                    <v-alert slot="no-results" :value="true" type="error">
                      "{{ search }}" 는 없는 데이터입니다.
                    </v-alert>
                  </v-data-table>
            </v-card>
          </v-col>
        </v-col>
        <v-divider vertical></v-divider>
          <v-col class="pt-6 pl-6 pa-0 ma-0 " md="3">
            <v-card class="pa-0 ma-0">
              <v-treeview v-if="selectedplace[0].pplace_seq==4"
                v-model="tree"
                :items="filteredMenu1"
                selected-color="info"
                selectable
                return-object
                open-all
              >
              </v-treeview>
              <v-treeview v-else
                v-model="tree"
                :items="filteredMenu2"
                selected-color="info"
                selectable
                return-object
                open-all
              >
              </v-treeview>
            </v-card>
          </v-col>
    
          
    
          <v-col md="3">
            
            <v-card-text>
              <div
                v-if="tree.length === 0"
                key="title"
                class="title font-weight-light grey--text pa-4 text-center"
              >
                사용자에게 위임하려는<br>메뉴를 선택하세요.
              </div>
    
              <v-scroll-x-transition
                group
                hide-on-leave
              >
                <v-chip
                  v-for="(selection, i) in _selection"
                  :key="i"
                  color="grey"
                  dark
                  small
                  class="ma-1"
                >
                  <v-icon
                    left
                    small
                  >
                    mdi-check-underline
                  </v-icon>
                  {{ selection.name }}
                </v-chip>
              </v-scroll-x-transition>
            </v-card-text>
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
        selectedplace: [1].map(pplace_seq => ({ pplace_seq })),
        selectionType: 'independent',
        selection: [],
        allParentNodes : false,
        sel_user_seq:'', sel_pplace_seq:'', sel_user_name:'',
        items: [],
        tableItems:[],
        tableLevelItems:[],
        userItems:[],
        menusItems:[],
        tree: [],
        mymenu:[],
        search: '',
        search2: '',
        headers: [
          { text: '사업장', align: 'start', value: 'place_name', class: "blue lighten-5 info--text" },
          { text: '부서', value: 'organ_name', class: "blue lighten-5 info--text" },
          { text: '성명', value: 'kname', class: "blue lighten-5 info--text" },
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
        placeheaders: [
          { text: 'Seq', align: 'start', value: 'pplace_seq', class: "blue lighten-5 info--text"},
          { text: '사업장', value: 'pplace_name', class: "blue lighten-5 info--text" },
        ],
      }
    },
    created(){
      const token = localStorage.getItem('token')
      
        axios.get(`${this.$D2ApiPath}/api/auth/place`, { headers: { Authorization: token } }) 
            .then(response => {
              this.items = response.data
              //console.log(JSON.stringify(this.items));
         //     this.items=this.getTree(this.tableItems)
            })
        this.getMenuList()

        axios.get(`${this.$D2ApiPath}/api/auth/userlv`, { headers: { Authorization: token } }) 
            .then(response => {
              this.tableLevelItems = response.data
              //console.log(JSON.stringify(this.items));
         //     this.items=this.getTree(this.tableItems)
            })
       
        axios.get(`${this.$D2ApiPath}/api/auth/gwuser`, { headers: { Authorization: token } }) 
            .then(response => {
              this.tableItems = response.data
              //console.log(JSON.stringify(this.items));
         //     this.items=this.getTree(this.tableItems)
              setTimeout(() => {
                if (this.firstLoad) this.firstLoad = false
              }, 1000);
            })
    },
    mounted(){
      
    },
    computed: {
      selected () {
        if (!this.active.length) return undefined
       // const id = this.active[0]
        
        this.getUser (this.active[0].id)
        return this.active
      },
      _items () {
        const replaceChildren = (obj,parent) => {
          const clone = Object.assign({},obj)
          delete clone.children
          if (parent) clone.parent = parent
          return clone
        }
        
        const addItems = (arr,parent) => {
          const items = arr.reduce((acc,x)=>{
              
            acc.push(replaceChildren(x,parent))
            
            if (x.children) {
              acc.push(addItems(x.children, x.id))
            }
            return acc
          },[])

          return items.flat()
        }
        
        return addItems(this.menusItems).reduce((acc,x)=>{
          acc[x.id]=x
          return acc
        },{})
      },
      _selection () {
        const proxy = {}
        var addParents = (x, all) => {
          const parentId = this._items[x.id].parent
          if (parentId) {
            if (all) addParents(this._items[parentId])
            proxy[parentId] = this._items[parentId]
          }
        }
        this.tree.forEach(x=>{
          addParents(x,this.allParentNodes)
          proxy[x.id] = x
        })
        return Object.values(proxy)
      },
      filteredMenu1(){
        return this.menusItems.filter(function(param) {
          return param.is_level==2;
        });
      },
      filteredMenu2(){
        return this.menusItems.filter(function(param) {
          return param.is_level<2;
        });
      },
    },
    methods: {
      getMenuList(){
        const token = localStorage.getItem('token')
        axios.get(`${this.$D2ApiPath}/api/auth/menus` , { headers: { Authorization: token } }) 
        .then(response => {
          this.menusItems=response.data
              //this.items.push(response.data)
        })
      },
      getSelectionName(menu_seq,menu_name){
        console.log(menu_seq)
          //return this.selection.map(function(item) {
          //      return item.name
           // });
        return menu_name
      },
      getUser (organ_seq) {
        const token = localStorage.getItem('token')
        axios.get(`${this.$D2ApiPath}/api/auth/list/`+organ_seq, { headers: { Authorization: token } }) 
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
          axios.get(`${this.$D2ApiPath}/api/auth/list/`+organ_seq, { headers: { Authorization: token } }) 
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
      handleClick: function (item, row) {
        row.select(true);
        //if (event.target.classList.contains('btn__content')) return;
        //this.sel_pplace_seq = item.pplace_seq
        //selectedplace: [1].map(pplace_seq => ({ pplace_seq }))

        if(this.sel_user_seq){
           this.getMymenu(item.pplace_seq)
        }
      },
      handleClickUser: function (item, row) {
        row.select(true);
        //if (event.target.classList.contains('btn__content')) return;
        this.sel_user_seq = item.user_seq
        this.sel_user_name = item.kname
        //console.log(this.sel_user_seq)
        //console.log(this.selectedplace[0].pplace_seq)
        this.getMymenu(this.selectedplace[0].pplace_seq)
      },
      getMymenu(pPlace_seq){
         var state= {
          place_seq: pPlace_seq,
          user_seq: this.sel_user_seq,
        };
        var _this=this
        const token = localStorage.getItem('token')
            axios.patch(`${this.$D2ApiPath}/api/auth/mymenu`,state, { headers: { Authorization: token } }) 
            .then(function (response) {
                //this.selection=response.data
                _this.tree=response.data
            })
            .catch(err => console.log(err));
      },
      save () {
        if(!this.sel_user_seq) return alert("사용자를 선택해주세요.")
        if(!this.tree[0]) return alert("메뉴를 선택해주세요.")

        console.log(this.sel_user_seq)
        console.log(this.selectedplace[0].pplace_seq)
        //console.log(this.tree)
        console.log(JSON.stringify(this._selection))
        this.saveandcall(this.selectedplace[0].pplace_seq,this.sel_user_seq,this._selection)
      },
      saveandcall(pPlace,pUser,pTree){
          //var inputnum=(this.input)
          //if(!inputnum) {inputnum='NULL'}
        var state= {
          place_seq: pPlace,
          user_seq: pUser,
          tree: pTree,
        };

        const token = localStorage.getItem('token')
            axios.patch(`${this.$D2ApiPath}/api/auth/save`,state, { headers: { Authorization: token } }) 
            .then(function (response) {
                if(response.data.success) alert("저장하였습니다.")
                else alert("저장에 실패하였습니다.")
                //console.log(response)
            })
            .catch(err => alert(err));
        },
    },
}
</script>

<style>
/*
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
*/
tr.v-data-table__selected {
  background: darkgrey !important;
}

</style>
