// (function($) {
//     console.log($('#chart_box'))
// })(jQuery)

let myChart = echarts.init(document.getElementById('chart_box'));

let myOption = {
    title: {
        text: 'ECharts实例应用test'
    },
    tooltip: {},
    legend: {
        data:['销量']
    },
    dataZoom: [
        {
            type: 'inside',
            start: 0,
            end: 20
        }
    ],
    xAxis: {
        data: ["", "2016-01", "2016-02", "2016-03", "2016-04", "2016-05", "2016-06", "2016-07", "2016-08", "2016-09", "2016-10", "2016-11", "2016-12", "2017-01", "2017-02", "2017-03", "2017-04", "2017-05", "2017-06", "2017-07", "2017-08", "2017-09", "2017-10", "2017-11", "2017-12"]
    },
    yAxis: {},
    series: [{
        name: '销量',
        type: 'line',
        radius: ['50%', '70%'],
        data: [25, 3, 1, 2, 1,25, 3, 1, 2, 1,25, 3, 1, 2, 1,25, 3, 1, 2, 1,25, 3, 1, 2]
    }]
};
let option = {
    xAxis: {
        type: 'value'
    },
    yAxis: {
        type: 'value'
    },
    dataZoom: [
        {
            type: 'slider',
            start: 1,
            end: 10
        }
    ],
    series: [
        {
            name: 'scatter',
            type: 'scatter',
            itemStyle: {
                normal: {
                    opacity: 0.8
                }
            },
            symbolSize: function (val) {
                return val[2] * 40;
            },
            data: [["14.616","7.241","0.896"],["3.958","5.701","0.955"],["2.768","8.971","0.669"],["9.051","9.710","0.171"],["14.046","4.182","0.536"],["12.295","1.429","0.962"],["4.417","8.167","0.113"],["0.492","4.771","0.785"],["7.632","2.605","0.645"],["14.242","5.042","0.368"]]
        }
    ]
}

myChart.setOption(myOption);