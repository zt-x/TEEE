<template>
  <div id="charts" style="width: 100%; height: 100%"></div>
</template>

<script>
import * as echarts from "echarts";
var myChart;
window.onresize = function () {
  myChart.resize();
};

export default {
  props: ["statistic"],
  mounted() {
    myChart = echarts.init(document.getElementById("charts"));
    this.initChart();
  },
  methods: {
    initChart() {
      window.onresize = function () {
        myChart.resize();
      };
      var options = {
        title: {
          text: "已批改的作业统计",
          left: "center",
        },
        tooltip: {
          trigger: "item",
        },
        series: [
          {
            type: "pie",
            radius: "50%",
            data: this.statistic,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      };
      // 绘制图表
      myChart.setOption(options);
    },
  },
  data() {
    return {
      sta: this.statistic,
    };
  },
  watch: {
    statistic: {
      deep: true,
      handler(newVal, oldVal) {
        this.sta = newVal;
        this.initChart();
      },
    },
  },
};
</script>

<style></style>
