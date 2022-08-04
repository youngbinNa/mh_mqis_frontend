<template>
<div>
<v-treeview
              :items="items"
              activatable
              class="pa-0 ma-0"
              color="info"
              open-on-click
              return-object
              dense
            >
            <template slot="label" slot-scope="props">
                <v-list-item  link class="text-body-2 pa-0 ma-0"  :to="props.item.real_path" v-if="props.item.real_path">{{ props.item.name }}</v-list-item>
                <span v-else>{{ props.item.name }}</span>
            </template>
        </v-treeview>
                      
</div>
</template>

<script>
import axios from 'axios'

  export default {
    components: {
      //apexcharts: VueApexCharts
    },
    data() {
        return{
              items:[],
          }
    },
    created(){
      var state= {
          user_seq: this.$store.state.userseq,
          login_option: this.$store.state.type,
      };
      //const token = localStorage.getItem('token')
       axios.post(`${this.$D2ApiPath}/api/sign/menulist`,state) 
        .then(response => {
          this.items=response.data
              //this.items.push(response.data)
        })
    },
  }
</script>