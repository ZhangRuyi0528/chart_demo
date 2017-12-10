(function($) {

    let _options = {
        'title': "测试封装showchart"
    }
    $.fn.extend({
        showChart: function(options) {
            
            let myChart = echarts.init($('#chart_box')[0], 'dark');
            // options = $.extend({}, options);
            
            
            let myOption = {
                title: {
                    text: options.title
                },
                tooltip: {},
                legend: {
                    data:['销量']
                },
                xAxis: {
                    data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
                },
                yAxis: {},
                series: [{
                    name: '销量',
                    type: 'bar',
                    data: [5, 20, 36, 10, 10, 20]
                }]
            };
            
            myChart.setOption(myOption)
            
        }
    })

    $('#chart_box').showChart(_options);
})(jQuery)


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
            // type: 'slider',
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
        function renderIncreasingData(option) {
            option.yAxis = option.yAxis.concat({
                axisLine: {
                    show: false
                },
                splitLine: {show: false},
                type: 'value',
                name: '环比增长率',
                nameLocation: 'middle',
                position: 'right',
                nameGap: '50',
                nameTextStyle: {
                    fontSize: '12',
                    color: '#89A54E',
                    fontWeight: 'bolder'
                },
                boundaryGap: ['20%', '20%'],
                axisLabel : {
                    show: true,
                    interval: 'auto',
                    formatter: '{value}%',
                    textStyle: {
                        color: '#89A54E'
                    }
                },
                axisTick: {
                    show: false
                }
            });

            option.series = option.series.concat({
                name: '环比增长率',
                color: '#89A54E',
                type: 'line',
                yAxisIndex: 1,
                smooth: true,
                data: method.dealMoMdata(option.series[0].data),
                itemStyle: {
                    normal: {
                        lineStyle: {
                            type: 'dashed'
                        },
                        color: '#89A54E'
                    }
                }
            });

            option.legend.data = option.legend.data.concat('环比增长率');

            if (method.xIncType === 'QUARTER' || method.xIncType === 'MONTH') {
                option.yAxis = option.yAxis.concat({
                    axisLine: {
                        show: false
                    },
                    splitLine: {show: false},
                    type: 'value',
                    name: '同比增长率',
                    nameLocation: 'middle',
                    nameGap: '50',
                    nameTextStyle: {
                        fontSize: '12',
                        color: '#AA4643',
                        fontWeight: 'bolder'
                    },
                    boundaryGap: ['20%', '20%'],
                    offset: 60,
                    position: 'right',
                    axisLabel : {
                        show: true,
                        interval: 'auto',
                        formatter: '{value}%',
                        textStyle: {
                            fontSize: '12',
                            color: '#AA4643'
                        }
                    },
                    axisTick: {
                        show: false
                    }
                });

                option.series = option.series.concat({
                    name: '同比增长率',
                    type: 'line',
                    color: '#AA4643',
                    data: method.dealYoYdata(option.series[0].data),
                    yAxisIndex: 2,
                    smooth: true,
                    itemStyle: {
                        normal: {
                            color: '#AA4643'
                        }
                    }
                });
                option.legend.data = option.legend.data.concat('同比增长率');
            }
            option.tooltip = {
                trigger: 'axis',
                confine: true,
                formatter: function(params) {
                    var res = params[0].name + '<br/>';
                    for (i = 0; i < params.length; i++) {
                        if (i === 0) {
                            res += params[i].seriesName + ' : ' + params[i].value + '</br>';
                        } else {
                            res += params[i].seriesName + ' : ' + params[i].value + '%</br>';
                        }
                    }
                    return res;
                },
                axisPointer: {
                    show: true,
                    type: 'line',
                    lineStyle: {
                        type : 'dashed',
                        width : 1
                    }
                }
            };
            return option;
        }
        function dealMoMdata(data) {
            var result = [],
                item;

            for (i = 0; i < data.length - 1; i++) {
                item = (data[i + 1]['value'] === data[i]['value']) ?
                0 : (data[i + 1]['value'] - data[i]['value']) / data[i]['value'] * 100;
                item = Number(parseInt(item * 100, 10)) / 100;
                result.push(item);
            }
            result.unshift(0);

            return result;
        }
        //计算图形同比增长
        function dealYoYdata(data) {
            var result = [],
                item;
            for (i = 0; i < data.length; i++) {
                item = 100;

                for (j = i - 1; j >= 0; j--) {
                    preYear = data[j]['name'].split('-')[0] * 1;
                    preSecond = data[j]['name'].split('-')[1] * 1;
                    currentYear = data[i]['name'].split('-')[0] * 1;
                    currentSecond = data[i]['name'].split('-')[1] * 1;

                    if (preYear + 1 === currentYear && preSecond === currentSecond) {
                        item = (data[i]['value'] - data[j]['value']) / data[j]['value'] * 100;
                        item = Number(parseInt(item * 100, 10)) / 100;
                        break;
                    }
                }
                result.push(item);
            }
            return result;
        }

        // renderIncreasingData(myOption);

myChart.setOption(myOption);
// originMychart[options.config.id].on('datazoom', function (param) {
myChart.on('datazoom', function (param) {
    console.log(param.batch[0]);
    console.log(option.dataZoom[0]);
    if (param.end === 100) {
        alert('daotoule')
    }
    
    // console.log(myChart.dataZoom.start);
});
