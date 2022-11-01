<template>
  <div id="charts_work" style="width: 100%; height: 250px"></div>
</template>

<script>
import * as echarts from "echarts";
var myChart;
window.onresize = function () {
  myChart.resize();
};

export default {
  mounted() {
    this.initChart();
  },
  methods: {
    initChart() {
      myChart = echarts.init(document.getElementById("charts_work"));
      window.onresize = function () {
        myChart.resize();
      };
      var options = {
        title: {
          text: "作业平均分数",
        },
        yAxis: {
          type: "value",
        },
        xAxis: {
          type: "category",
          data: ["work1", "work2", "work3", "work4", "work5", "work6", "work7"],
        },
        series: [
          {
            type: "line",
            data: [80, 85, 73, 92, 78, 90, 95],
            smooth: true,
          },
        ],
      };
      // 绘制图表
      myChart.setOption(options);
    },
  },
};
</script>

<style></style>
