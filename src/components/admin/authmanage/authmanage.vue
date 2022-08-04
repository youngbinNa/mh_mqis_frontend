<template>
  <v-container>
      <v-select
        v-model="selectionType"
        :items="['independent']"
        label="Selection type"
      ></v-select>
      <v-row>
        <v-col>
          <v-treeview
            v-model="selection"
            :items="items"
            :selection-type="selectionType"
            selectable
            return-object
            open-all
            dense
          ></v-treeview>
        </v-col>
        <v-col
          class="pa-6"
          cols="6"
        >
          <template v-if="!selection.length">
            선택된 조직이 없습니다.
          </template>
          <template v-else>
            <!--
            <div
            >
              {{ getUser(this.tableItems.id) }}
            </div>-->
            <div
              v-for="node in selection"
              :key="node.id"
            >
              {{ node.id }}
            </div>
          </template>
          <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Search"
                single-line
                hide-details
              ></v-text-field>
            <v-data-table
              item-key="id"
              single-select
              :headers="headers"
              :items="selection"
              :search="search"
              >
              <v-alert slot="no-results" :value="true" type="error">
                "{{ search }}" 는 없는 데이터입니다.
              </v-alert>
            </v-data-table>
        </v-col>
      </v-row>
    </v-container>
</template>

<script>
import axios from 'axios'

export default {
  
  data () {
    return {
        selectionType: 'independent',
        selection: [],
        tableItems:[],
        items: [],
        userItems:[],
        sel_org_seq:'',
        search: '',
        headers: [
          { text: '법인', align: 'start', value: 'id'},
          { text: '사업장', value: 'name' },
          { text: '부서', value: 'organ_name' },
          { text: '성명', value: 'kname' },
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
              console.log(this.items); 
            })
            /*
        axios.get('/api/auth/gwuser', { headers: { Authorization: token } }) 
            .then(response => {
              this.tableItems = response.data     // 반환되는 값을 toDoItems에 저장한다.
              console.log(this.tableItems);
            })*/
    },
    methods: {
      getUser (organ_seq) {
        const token = localStorage.getItem('token')
        axios.get('/api/auth/list/'+organ_seq, { headers: { Authorization: token } }) 
            .then(response => {
              this.tableItems = response.data
            })
      },
      onUpdate(selection) {
        //this.tableItems = selection[0]
        console.log("onUpdate(selection): "+JSON.stringify(this.tableItems))
        this.getUser(selection[0].id)
        //console.log(selection)
        //this.sel_org_seq=selection[0].id
        //console.log(this.sel_org_seq)
      },
      initAllUser() {
        const token = localStorage.getItem('token')
        axios.get('/api/auth/alluser', { headers: { Authorization: token } }) 
            .then(response => {
              this.tableItems = response.data     // 반환되는 값을 toDoItems에 저장한다.
              console.log(this.tableItems);
            })
      }
    },
}
</script>

<style>
</style>
