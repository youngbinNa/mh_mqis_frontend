<template>
<div>
  <form @submit.prevent="retrieveCalendar">
    <div class="form-group">
 <v-dialog
          ref="dialog"
          v-model="modal"
          :return-value.sync="date"
          persistent
          width="290px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="date"
              label="기준일자"
              prepend-icon="mdi-calendar"
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker v-model="date" locale="ko-kr" :day-format="date => date.split('-')[2]" scrollable>
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="modal = false">취소</v-btn>
            <v-btn v-on:click="retrieveCalendar" type="submit" text color="primary" @click="$refs.dialog.save(date)">확인</v-btn>
          </v-date-picker>
        </v-dialog>
        </div>
    </form>
  <v-data-table
      :headers="headers"
      :items="tableItems"
      class="elevation-1"
    >
      <template v-slot:headers.name="{ headers }">
        {{ headers.text.toUpperCase() }}
      </template>
    </v-data-table>
</div>
</template>


<script>
import axios from 'axios'
  export default {
    name: 'PatrollTables',
    data:() => {
        return{
                  date: new Date().toISOString().substr(0, 10),
                  modal: false,
        
          tableItems: [],
       headers: [
        { text: '라인', align: 'start', value: 'WORK_SHOP_ID' },
        { text: '라인명', value: 'WORK_SHOP_NAME' },
        { text: '제품코드', value: 'PART_ID' },
        { text: '제품명', value: 'PART_NAME'},
        { text: '주간계획', value: 'AW_PLAN_QTY' },
        { text: '주간실적', value: 'AW_GOOD_qTY' },
        { text: '야간계획', value: 'PW_PLAN_QTY' },
        { text: '야간실적', value: 'PW_GOOD_qTY' },
      ],
        }
    },
    created(){
      const token = localStorage.getItem('token')
        axios.get('/api/line/GetLineMaster/' + this.date.replace(/-/g, ""), { headers: { Authorization: token } }) // http://localhost:3000/api/line/GetLineMaster/에 get call을 한다.
            .then(response => {
              this.tableItems = response.data     // 반환되는 값을 toDoItems에 저장한다.
              //console.log(response.data.date);
            })
    },
      methods:{
        retrieveCalendar(){
          let pickdate=this.date;
          const token = localStorage.getItem('token')
          axios.get('/api/line/GetLineMaster/' + pickdate.replace(/-/g, ""), { headers: { Authorization: token } }) // http://localhost:3000/api/line/GetLineMaster/에 get call을 한다.
            .then(response => {
              this.tableItems = response.data     // 반환되는 값을 toDoItems에 저장한다.
              //console.log(response.data.date);
            })
        }
      },
      // watch:{
      //   date:{
      //     handler: 'retrieveCalendar',
      //     immediate: true
      //   }
      // }
  }
</script>
<style >
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
table.v-table tbody td:first-child, table.v-table tbody td:not(:first-child), table.v-table tbody th:first-child, table.v-table tbody th:not(:first-child), table.v-table thead td:first-child, table.v-table thead td:not(:first-child), table.v-table thead th:first-child, table.v-table thead th:not(:first-child) {
  padding: 0 10px
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
  background: pink !important;
}
</style>
