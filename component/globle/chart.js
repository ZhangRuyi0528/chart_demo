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


