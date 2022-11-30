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
  props: ["data"],
  mounted() {
    this.initChart();
  },
  methods: {
    initChart() {
      let _this = this;
      // 基于准备好的dom，初始化echarts实例
      myChart = echarts.init(document.getElementById("charts"));
      window.onresize = function () {
        myChart.resize();
      };
      var options = {
        title: {
          text: "最近一次考试及格情况",
          left: "center",
        },
        tooltip: {
          trigger: "item",
        },
        series: [
          {
            type: "pie",
            radius: "50%",
            data: [
              { value: _this.data[0], name: "优秀" },
              { value: _this.data[1], name: "良好" },
              { value: _this.data[2], name: "及格" },
              { value: _this.data[3], name: "不及格" },
            ],
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
};
</script>

<style scoped></style>
