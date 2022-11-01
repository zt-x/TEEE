<template>
  <v-container fluid>
    <v-overlay :value="prepareing_overlay">
      <v-chip>
        <v-progress-circular indeterminate size="16" class="mr-3"></v-progress-circular>
        <v-spacer></v-spacer>
        <span>正在加载库功能 ...</span>
      </v-chip>
    </v-overlay>
    <v-row justify="center">
      <v-col cols="12" class="text-center">
        <v-card>
          <v-card-title>
            库类型:
            <div style="width: 180px" class="ml-2 mt-2">
              <v-card-text
                ><v-select item-color="brown" :items="bankType" />
              </v-card-text>
            </div>
            <v-spacer></v-spacer>
            库名称：
            <v-text-field></v-text-field>
            <v-spacer></v-spacer>
            库标签:
            <v-text-field></v-text-field>
            <div></div>
            <v-spacer></v-spacer>
            <div></div>
            <v-spacer></v-spacer>
            <div></div>
            <v-spacer></v-spacer>
            <div></div>
            <v-spacer></v-spacer>
            <div></div>
            <v-spacer></v-spacer>
            <div></div>
            <v-spacer></v-spacer>
            <div></div>
            <v-spacer></v-spacer>
            <div></div>
            <v-spacer></v-spacer>
            <div></div>
            <v-spacer></v-spacer>
          </v-card-title>
        </v-card>
      </v-col>
      <v-col cols="8">
        <v-card>111</v-card>
      </v-col>
      <v-col cols="4">
        <v-card>111</v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      prepareing_overlay: false,
      bankType: ["作业库", "题库"],
    };
  },
};
</script>

<style></style>
