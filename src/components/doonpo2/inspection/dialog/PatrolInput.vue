<template>
  <div>
    <v-dialog v-model="dial" fullscreen hide-overlay transition="dialog-bottom-transition" :retain-focus="false">
                      <!--<template v-slot:activator="{ on, attrs }">
                        <v-btn
                          color="primary"
                          dark
                          v-bind="attrs"
                          v-on="on"
                        >
                          Open Dialog
                        </v-btn>
                      </template>-->
                      <v-card>
                        <v-toolbar dark color="primary">
                          <v-btn icon dark @click="dialog = false">
                            <v-icon>mdi-close</v-icon>
                          </v-btn>
                          <v-toolbar-title>Settings</v-toolbar-title>
                          <v-spacer></v-spacer>
                          <v-toolbar-items>
                            <v-btn dark text @click="dialog = false">Save</v-btn>
                          </v-toolbar-items>
                        </v-toolbar>
                        
                          <v-list three-line subheader>
                            <v-subheader>검사기준</v-subheader>
                            <v-list-item>
                              <v-list-item-content>
                                <v-list-item-title>규격</v-list-item-title>
                                <v-list-item-subtitle>규격표시</v-list-item-subtitle>
                              </v-list-item-content>
                            </v-list-item>
                            
                            <v-list-item>
                             
                              <v-list-item-content>
                                 <v-list-item-title>검사결과</v-list-item-title>
                                <input
                                    :value="input"
                                    class="input"
                                    @input="onInputChange"
                                    placeholder="이 곳에 검사결과 표시"
                                  >
                                  <SimpleKeyboard @onChange="onChange" @onKeyPress="onKeyPress" :input="input"/>
                              </v-list-item-content>
                            </v-list-item>
                          </v-list>
                      </v-card>
                    </v-dialog>
  </div>
</template>

<script>
import SimpleKeyboard from '../keyboard/NumericKeyboard';

export default {
  name: "PatrolInput",
  components: {
      SimpleKeyboard,
    },
  props: {
    dialg: {
      type: Boolean,
      default: false
    }
  },
  data() {
        return{
                  dialog: false,
                  notifications: false,
                  sound: true,
                  widgets: false,
                  input:''
        }
    },
    methods: {
      onChange(input) {
        this.input = input;
      },
      onKeyPress(button) {
        console.log("button", button);
      },
      onInputChange(input) {
        this.input = input.target.value;
      }
    },
    computed: {
      dial: {
        get(){
          return this.dialog;
        },
        set(updated) {
          this.$emit("input", updated);
        }
      }
    }
};
</script>