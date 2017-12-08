/*
说明：此插件用于绘图,
参数：defaults = {
        type: '',
        data: []
    } type为必须参数
                total: '总值图',
                line: '折线图',
                bar: '柱状图',
                pie: '饼状图',
                form / table: '表格显示',
                radar: '雷达图',
                barchart: '条形图',
                stackColumn: '堆积柱形图',
                circlePie: '圆环图',
                scatter: '散点图',
                map: '地图',
                histogram: '直方图',
                controlChart: '控制图'
    data为绘图所需参数,callback为点击统计图时触发的回调函数
*/
(function($) {
    var getOption = {},
        myTheme = Safirst.user.theme ? Safirst.user.theme : 'blue';
    $.fn.appAnalysisChart = function(options) {
        var defaults = {
            config: {
                type: 'total'
            },
            data: '',
            lablestyle: '14px',
            callback: function() {}
        }, method, url, self = this, data,
        originMychart = {},
        maxWidth = this.width() > 600 ? 380 : this.width();
        options = $.extend(defaults, options);
        this.id = options.config.id || '';
        url = '/api/dashboard/svg';
        method = {
            chartData: '',
            config: {},
            x_line: [],
            flag: 0,
            come: 1,
            xlength: 0,
            ylength: 0,
            index: 0,
            datatable: {},
            target: {},
            gaugeData: '',
            xIncType: '',
            formIncYoY: '',
            formIncMoM: '',
            redLight: '#C23531',
            greenLignt: '#91C7AE',
            yellowLight: '#DD883C',
            chartTypes: {
                total: '总值图',
                line: '折线图',
                bar: '柱状图',
                pie: '饼状图',
                table: '表格显示',
//                radar: '雷达图',
                barchart: '条形图',
                stackColumn: '堆积柱形图',
                circlePie: '圆环图',
                scatter: '散点图',
                map: '地图',
                histogram: '直方图',
                controlChart: '控制图'
            },
            init: function() {
                if (_.isEmpty(options.data)) {
                    options.data.data = [0];
                }
                method.target = options.config.target ? options.config.target : '';
                method.xIncType = options.config.xIncType ? options.config.xIncType : '';
                method.formIncYoY = options.config.formIncYoY || '';
                method.formIncMoM = (options.config.formIncMoM === 'MoM') ? 'MoM' : '';
                data = options.data;
                
                if (typeof options.config !== 'undefined') {
                    options.config.id = typeof options.config.id === 'undefined' ? '' : options.config.id;
                } else {
                    options.config.id = '';
                }
                
                //                myChart = originMychart[options.config.id];
                if (myTheme === 'black' && location.pathname === '/dashboard') {
                    originMychart[options.config.id] = echarts.init(self[0], 'dark');
                    method.title = {
                        text: _.has(options.config, 'title') ? options.config.title : '',
                        textAlign: 'left',
                        x: '20px',
                        y: '20px',
                        textStyle: {
                            fontWeight: 'bold',
                            fontSize: '18',
                            color: '#fff'
                        }
                    };
                } else {
                    originMychart[options.config.id] = echarts.init(self[0], 'macarons');
                    method.title = {
                        text: _.has(options.config, 'title') ? options.config.title : '',
                        textAlign: 'left',
                        x: '20px',
                        y: '20px',
                        textStyle: {
                            fontWeight: 'bold',
                            fontSize: '18',
                            color: '#333'
                        }
                    };
                }
                var date = new Date(),
                    year = date.getFullYear(),
                    month = date.getMonth() + 1,
                    day = date.getDate(),
                    hour = date.getHours(),
                    minute = date.getMinutes(),
                    second = date.getSeconds(),
                    nametime = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
                method.toolBox = {
                    show : false,
                    itemSize: 18,
                    right: '3%',
                    feature : {
                        saveAsImage : {
                            show : false,
                            title : '保存为图片',
                            name: method.chartTypes[options.data.type] + '_' + nametime,
                            type : 'png',
                            lang : ['点击保存']
                        }
                    }
                };
                addEvent();
                return method.renderChart(data);
            },
            renderChart: function(data) {
                var option,
                    originType = options.data.type;
                switch (options.data.type) {
                    case 'total':
                        method.renderTotalChart(data);
                        break;
                    case 'form':
                    case 'table':
                        return method.renderTable();
                    case 'line':
                        originMychart[options.config.id].on('click', function(e) {
                            options.callback(e);
                        });
                        option = method.renderAngleChart(data, options.data.type);
                        break;
                    case 'bar':
                        originMychart[options.config.id].on('click', function(e) {
                            options.callback(e);
                        });
                        option = method.renderAngleChart(data, options.data.type);
                        break;
                    case 'pie':
                        originMychart[options.config.id].on('click', function(e) {
                            options.callback(e);
                        });
                        option = method.renderCircleChart(data, options.data.type);
                        break;
                    case 'radar':
                        option = method.renderRadarChart(data);
                        break;
                    case 'barchart':
                        originMychart[options.config.id].on('click', function(e) {
                            options.callback(e);
                        });
                        options.data.type = 'bar';
                        option = method.renderAngleChart(data, 'barchart');
                        break;
                    case 'stackColumn':
                        originMychart[options.config.id].on('click', function(e) {
                            options.callback(e);
                        });
                        options.data.type = 'bar';
                        option = method.renderAngleChart(data, 'stackColumn');
                        break;
                    case 'circlePie':
                        originMychart[options.config.id].on('click', function(e) {
                            options.callback(e);
                        });
                        options.data.type = 'pie';
                        option = method.renderCircleChart(data, 'circlePie');
                        break;
                    case 'map':
                        originMychart[options.config.id].on('click', function(e) {
                            options.callback(e);
                        });
                        option = method.renderMapChart(data, options.data.type);
                        break;
                    case 'scatter':
                        originMychart[options.config.id].on('click', function(e) {
                            options.callback(e);
                        });
                        option = method.renderScatterChart(data);
                        break;
                    case 'histogram':
                        options.data.type = 'bar';
                        option = method.renderAngleChart(data, 'histogram');
                        break;
                    case 'controlChart':
                        originMychart[options.config.id].on('click', function(e) {
                            options.callback(e);
                        });
                        options.data.type = 'line';
                        option = method.renderControlChart(data, 'controlChart');
                        break;
                    default:
                        break;
                }

                if (option) {
                    originMychart[options.config.id].setOption(option);

                    setTimeout(function() {
                        getOption[options.config.id + '_' + originType] =
                            'a=' + originMychart[options.config.id].getDataURL({
                                pixelRatio: 2,
                                backgroundColor: '#fff'
                            });
                    }, 5000);
                    window.onresize = originMychart[options.config.id].resize;
                }
            },

            //总值动态图渲染
            renderTotalChart: function(data) {
                var maxHeight = 200,
                    myChart,
                    option,
                    row = maxHeight / 8,
                    col = maxWidth / 8,
                    gaugeheight = '',
                    gaugewidth = '',
                    svgheight = '',
                    svgewidth = '',
                    viewwidth = '',
                    viewheight = '',
                    polygonab = '',
                    polygonac = '',
                    polygonad = '',
                    polygonae = '',
                    polygonaf = '',
                    polygonag = '',
                    textx = '',
                    texty = '',
                    top = '',
                    viewBoxleft = '',
                    viewBoxtop = '',
                    svgTpl = '<div style="text-align: left;padding-top:20px;" > ' +
                    '<span class="totalChartTitle" style="font-weight:bold;' +
                    'font-size:18px;color:#333;margin-left:20px;"><%=title%></span>' +
                    '<a href="javascript:void(0)" class="saveTable saveTotal"></a>' +
                    '</div>' +
                    '<div class="pull-left tangle" style="margin-top:<%=top%>">' +
                        '<svg width="<%=svgewidth%>" height="<%= svgheight%>" ' +
                        'viewBox="<%=viewBoxleft%>,<%=viewBoxtop%>,<%=viewwidth%>,' +
                        '<%= viewheight%>">' + '<defs><style></style></defs>' +
                            '<polygon  points="<%=polygonab%>,<%=polygonac%> <%=polygonad%>,<%=polygonae%> ' +
                                        '<%=polygonaf%>,<%=polygonag%>"' +
                                'style="fill:<%=color%>; stroke:#DCDCDC;stroke-width:1"/>' +
                            '<text x="<%=textx%>" y="<%=texty%>" font-size="18" ' +
                                'style="text-anchor:middle;">' +
                                    '<%=data%>' +
                            '</text>' +
                        '</svg>' +
                    '</div>' +
                    '<div class="pull-right" id="gaugeChart" ' +
                        'style=" width: <%=gaugewidth%>; height: <%=gaugeheight%>"></div>';
                if ($(self).width() > 1000) {
                    gaugewidth = $(self).width() * 0.45;
                    gaugeheight = $(self).height() * 0.9;
                    svgewidth = $(self).width() * 0.4;
                    svgheight = $(self).height() * 0.6;
                    polygonab = 350;
                    polygonac = 100;
                    polygonad = 500;
                    polygonae = 380;
                    polygonaf = 200;
                    polygonag = 380;
                    viewwidth = 440;
                    viewheight = 440;
                    textx = 350;
                    texty = 420;
                    top = 4;
                    viewBoxleft = 60;
                    viewBoxtop = 0;
                    if ($(self).height() === 450) {
                        gaugewidth = $(self).width() * 0.6;
                        gaugeheight = $(self).height();
                        svgewidth = $(self).width() * 0.3;
                        svgheight = $(self).height() * 0.9;
                        polygonab = 350;
                        polygonac = 100;
                        polygonad = 500;
                        polygonae = 380;
                        polygonaf = 200;
                        polygonag = 380;
                        textx = 350;
                        texty = 400;
                        top = 0;
                    }

                } else if ($(self).width() <= 1000 && $(self).width() > 600) {
                    gaugewidth = ($(self).width() - 300);
                    gaugeheight = 410;
                    svgewidth = 280;
                    svgheight = 280;
                    polygonab = 175;
                    polygonac = 60;
                    polygonad = 250;
                    polygonae = 210;
                    polygonaf = 100;
                    polygonag = 210;
                    viewwidth = 280;
                    viewheight = 280;
                    textx = 170;
                    texty = 250;
                    top = 10;
                    viewBoxleft = 50;
                    viewBoxtop = 10;
                } else if ($(self).width() <= 600 && $(self).width() >= 0) {
                    gaugewidth = ($(self).width() - 300);
                    gaugeheight = 250;
                    svgewidth = 200;
                    svgheight = 200;
                    polygonab = 175;
                    polygonac = 60;
                    polygonad = 250;
                    polygonae = 210;
                    polygonaf = 100;
                    polygonag = 210;
                    viewwidth = 210;
                    viewheight = 210;
                    textx = 170;
                    texty = 230;
                    top = 4;
                    viewBoxleft = 40;
                    viewBoxtop = 30;
                }

                $('.canvasArea').css('margin-top', '2%');
                $(self).html(
                    _.template(svgTpl, {
                        color: '#79B2F2',
                        title: options.config.title || data['tableName'],
                        data: Number(data.data['total']).toFixed(2) || 0,
                        row: row,
                        col: col,
                        gaugewidth: gaugewidth + 'px',
                        gaugeheight: gaugeheight + 'px',
                        svgewidth : svgewidth + 'px',
                        svgheight : svgheight + 'px',
                        polygonab : polygonab,
                        polygonac : polygonac,
                        polygonad : polygonad,
                        polygonae : polygonae,
                        polygonaf : polygonaf,
                        polygonag : polygonag,
                        viewwidth :  viewwidth,
                        viewheight : viewheight,
                        textx : textx,
                        texty : texty,
                        top : top + '%',
                        viewBoxleft : viewBoxleft,
                        viewBoxtop : viewBoxtop

                    })
                );
                //检查当前主题色
                if (myTheme === 'black' && location.pathname === '/dashboard') {
                    originMychart[options.config.id] = echarts.init(self[0].childNodes[2], 'dark');
                    $('.boardList .board').css({
                        'background': '#1b2026'
                    });
                } else {
                    originMychart[options.config.id] = echarts.init(self[0].childNodes[2], 'macarons');
                }
                option = method.renderGaugeChart(data);
                originMychart[options.config.id].setOption(option);

                method.gaugeData = 'a=' + originMychart[options.config.id].getDataURL({
                    pixelRatio: 2,
                    backgroundColor: '#fff'
                });
                id = typeof options.config.id === 'undefined' ? '' : options.config.id;
                getOption[id + '_total'] = method.gaugeData;
                getOption[id + 'total.title'] = method.title.text;
                window.onresize = originMychart[options.config.id].resize;
            },
            renderGaugeChart: function(data) {
                var min = 20, max = 80,
                    target = method.target[1],
                    total = Number(data.data['total']).toFixed(2) || 0,
                    maxTotal = 100, option = {};

                if (total > maxTotal) {
                    maxTotal = parseInt(total + total * 0.2, 10);
                }
                option = {
                    tooltip : {
                        confine: true,
                        formatter: '{a}：{c}'
                    },
                    series: [
                        {
                            name: '总数',
                            type: 'gauge',
                            min: 0,
                            max: maxTotal,
                            center: ['50%', '50%'],
                            detail: {formatter: '{value}'},
                            data: [{value: total, name: '总数值'}],
                            axisLine: {
                                show: true,
                                lineStyle: {
                                    color: [
                                        [0.2, '#91C7AE'],
                                        [0.8, '#DD883C'],
                                        [1, '#C23531']
                                    ]
                                }
                            }
                        }
                    ]
                };

                if (!_.isEmpty(target) && !_.isEmpty(target.minValue) && !_.isEmpty(target.maxValue)) {
                    min = parseInt(target.minValue, 10);
                    max = parseInt(target.maxValue, 10);
                    option.dataRange = {
                        x: 'center',
                        y: 'bottom',
                        orient: 'horizontal',
                        selectedMode: false,
                        splitList: [
                            {start: max},
                            {start: min, end: max},
                            {end: min}
                        ],
                        itemGap: 20,
                        color: ['#C23531', '#DD883C', '#91C7AE']
                    };

                    option.series[0].axisLine.lineStyle = {
                        color: [
                            [min / maxTotal, '#91C7AE'],
                            [max / maxTotal, '#DD883C'],
                            [1, '#C23531']
                        ]
                    };
                }

                return option;
            },
            //表格渲染
            renderTable: function() {
                var tableSvg = [];
                $('.chartBoxpp').css({
                    'overflow-y': 'auto'
                });
                $('.boardList .chartBox').css({
                    'overflow-x': 'auto',
                    'overflow-y': 'auto'
                });
                if (options.type === 'combine') {
                    tableSvg = method.formTableChart(options.data, method.target);
                    setTimeout(function() {
                        getOption[options.config.id + '_form'] = tableSvg;
                    }, 6000);
                    return tableSvg;
                } else {
                    getOption[options.config.id + '_form'] = method.formChart(options.data);
                    return getOption[options.config.id + '_form'];
                    // setTimeout(function(){
                    //     getOption[options.config.id + '_form'] = tableSvg;
                    // }, 6000);
                    // return tableSvg;
                }
            },
            //对直角系（line, bar, barchart, stackColumn, histogram）图形渲染
            renderAngleChart: function(data, originType) {
                var yInterval = ((originType === 'barchart' && method.getXline(data, true).length > 20) ? 'auto' : '0'),
                    option = {
                        title: method.title,
                        tooltip : {
                            trigger: 'item',
                            confine: true,
                            axisPointer: {
                                show: true,
                                type: 'line',
                                lineStyle: {
                                    type : 'dashed',
                                    width : 1
                                }
                            }
                        },
                        animation: true,
                        toolbox: method.toolBox,
                        legend: {
                            show: method.getKeys(data).length > 25 ? false : true,
                            x: 'center',
                            y: 'bottom',
                            data: method.getKeys(data)
                        },
                        grid: {
                            y2: '32%',
                            y: '100',
                            left: '12%',
                            right: '24%'
                        },
                        dataRange: method.getDataRange(),
                        xAxis: [
                            {
                                type: originType === 'barchart' ? 'value' : 'category',
                                name: originType === 'barchart' ? method.getYlineTitle() : method.getXlineTitle(),
                                nameLocation: 'middle',
                                nameGap: 60,
                                nameTextStyle: {
                                    fontWeight: 'bold',
                                    fontSize: '14',
                                    color: '#666'
                                },
                                position: 'bottom',
                                boundaryGap: options.data.type === 'line' ?
                                    false : (originType === 'barchart' ? [0, 0.1] : true),
                                data: originType === 'barchart' ? '' :
                                        (originType === 'histogram' ?
                                            method.getHistogramXline(data) : method.getXline(data)),
                                axisLabel : {
                                    show: true,
                                    margin: 10,
                                    interval: method.getXline(data).length > 25 ? 'auto' : 0,
                                    rotate: -30,
                                    formatter: function(param) {
                                        if (param.length > 7) {
                                            param = param.substr(0, 7) + '..';
                                        }
                                        return param;
                                    },

                                    textStyle: {
                                        fontSize: '14'
                                    }
                                },
                                axisTick: {
                                    inside: true
                                }
                            }
                        ],
                        yAxis: [
                            {
                                type: originType === 'barchart' ? 'category' : 'value',
                                name: originType === 'barchart' ? method.getXlineTitle() : method.getYlineTitle(),
                                data: originType === 'barchart' ? method.getXline(data, true) : '',
                                position: 'left',
                                nameLocation: originType === 'barchart' ? 'end' : 'end',
                                nameGap: '30',
                                alignWithLabel: true,
                                nameTextStyle: {
                                    fontWeight: 'bold',
                                    fontSize: '14',
                                    color: '#666'
                                },
                                boundaryGap: [0, 0.1],
                                axisLabel : {
                                    show: true,
                                    interval: yInterval,
                                    formatter: function(param) {
                                        if (param.length > 5) {
                                            param = param.substr(0, 5) + '..';
                                        }
                                        return param;
                                    },
                                    textStyle: {
                                        fontSize: '14'
                                    }
                                }
                            }
                        ],
                        series: method.setAngleChartData(data, originType)
                    };
                if (method.xIncType) {
                    // 暂时注销同比环比
                    option = method.renderIncreasingData(option);
                }
                return option;
            },
            //对圆环类（pie, circlePie）图形渲染
            renderCircleChart: function(data, originType) {
                var option = {
                        title: method.title,
                        dataRange: method.getDataRange(),
                        tooltip : {
                            trigger: 'item',
                            confine: true,
                            formatter: '{b} : {c} ({d}%)'
                        },
                        toolbox: method.toolBox,
                        calculable : true,
                        animation: true,
                        series: method.setAngleChartData(data, originType)
                    };
                option.series[0].label = {
                    normal: {
                        show: option.series[0].data.length > 25 ? false : true,
                        formatter: function(param) {
                            return param.name + ' (' + param.percent + '%)';
                        }
                    }
                };
                return option;
            },
            renderMapChart: function(data, originType) {
                var option = {
                        title: method.title,
                        dataRange: method.getDataRange(),
                        animation: true,
                        tooltip: {
                            trigger: 'item',
                            confine: true,
                            formatter: function(params) {
                                var i = 0,
                                    res = params.name + '<br/>';
                                for (; i < option.series.length; i++) {
                                    _.each(option.series[i].data, function(item, key) {
                                        if (params.name === item.name) {
                                            res += data.yaxis[i] + '：' + item.value + '</br>';
                                        }
                                    });
                                }
                                return res;
                            }
                        },
                        toolbox: method.toolBox,
                        legend: {
                            x: 'center',
                            y: 'bottom',
                            data: data.data.length === 0 ? [] : data.yaxis
                        },
                        visualMap: {
                            min: 0,
                            max: 2500,
                            left: 'left',
                            top: 'bottom',
                            text: ['高', '低'],
                            calculable: true
                        },
                        series : method.setMapChartData(data)
                    };

                return option;
            },
            renderRadarChart: function(data) {
                var option = {
                        title : method.title,
                        tooltip: {
                            trigger: 'item',
                            confine: true
                        },
                        animation: true,
                        dataRange: method.getDataRange(),
                        toolbox: method.toolBox,
                        legend: {
                            show: method.getKeys(data).length > 25 ? false : true,
                            x: 'center',
                            y: 'bottom',
                            data: method.getKeys(data)
                        },
                        polar: [
                            {
                                indicator: method.getRadarXline(data)
                            }
                        ],
                        calculable: true,
                        series: method.setAngleChartData(data)
                    };
                return option;
            },
            renderScatterChart: function(data) {
                var yTitle = typeof options.config.y[1] === 'undefined' ?
                            '' : method.getTitle(options.config.y[1].field),
                    yname = (options.type === 'combine') ? data.yaxis[0] :
                            ((options.config.x.length === 0) ? yTitle : ''),
                    option = {
                        title: method.title,
                        animation: true,
                        tooltip: {
                            trigger: 'axis',
                            confine: true,
                            showDelay: 0,
                            formatter: function(params) {
                                if (params.value.length > 1) {
                                    return params.seriesName + '<br/>' + params.value[0] + ':  ' + params.value[1];
                                } else {
                                    return method.getYlineTitle() + ': ' + params.value[0] + '<br/>' +
                                            method.getTitle(options.config.y[1].field) + ': ' + params.value[1];
                                }
                            },
                            axisPointer: {
                                show: true,
                                type : 'cross',
                                lineStyle: {
                                    type : 'dashed',
                                    width : 1
                                }
                            }
                        },
                        grid: {
                            right: '15%',
                            y2: '35%',
                            left: '12%'
                        },
                        toolbox: method.toolBox,
                        legend: {
                            x: 'center',
                            y: 'bottom',
                            data: (options.type === 'combine' ||
                            (options.config.hasOwnProperty('x') && options.config.x.length === 0)) ? [] : data.yaxis
                        },
                        dataRange: method.getDataRange(),
                        xAxis : [
                            {
                                type: (options.config.hasOwnProperty('x') && options.config.x.length === 0) ? 'value' :
                                        'category',
                                name: (options.type === 'combine') ? data.xaxis[0] :
                                        ((options.config.x.length === 0) ? method.getYlineTitle() :
                                        method.getXlineTitle()),
                                position: 'bottom',
                                boundaryGap: false,
                                data: method.getXline(data, true),
                                nameLocation: 'middle',
                                nameGap: 70,
                                nameTextStyle: {
                                    fontWeight: 'bold',
                                    fontSize: '14',
                                    color: '#666'
                                },
                                axisLabel : {
                                    show: true,
                                    rotate: -30,
                                    y: 20,
                                    formatter: function(param) {
                                        if (param.length > 7) {
                                            param = param.substr(0, 7) + '..';
                                        }
                                        return param;
                                    },
                                    textStyle: {
                                        fontWeight: 'normal',
                                        fontSize: '14'
                                    }
                                },
                                axisTick: {
                                    inside: true
                                }
                            }
                        ],
                        yAxis: [
                            {
                                type: 'value',
                                name: yname,
                                nameTextStyle: {
                                    fontWeight: 'bold',
                                    fontSize: '14',
                                    color: '#666'
                                },
                                nameLocation: 'middle',
                                nameGap: 70,
                                data: '',
                                position: 'left',
                                boundaryGap: [0, 0.1],
                                axisLabel: {
                                    show: true,
                                    interval: 'auto',
                                    formatter: '{value}',
                                    textStyle: {
                                        fontWeight: 'normal',
                                        fontSize: '14px'
                                    }
                                }
                            }
                        ],
                        series: method.setScatterChartData(data)
                    };
                return option;
            },
            renderControlChart: function(data, originType) {
                var low = 0, top = 0,
                    option = {};
                if (!_.isEmpty(data)) {
                    low = data.data.low;
                    top = data.data.top;
                }

                option = {
                    title: method.title,
                    tooltip : {
                        trigger: 'axis',
                        axisPointer: {
                            show: true,
                            type: 'line',
                            confine: true,
                            lineStyle: {
                                type : 'dashed',
                                width : 1
                            }
                        },
                        formatter: function(params) {
                            if (params[0]) {
                                return params[0]['name'] + ':  ' + params[0]['value'];
                            } else {
                                return params.name + ':  ' + params.value;
                            }

                        }
                    },
                    animation: true,
                    toolbox: method.toolBox,
                    legend: {
                        x: 'center',
                        y: 'bottom',
                        data: method.getKeys(data)
                    },
                    grid: {
                        right: '15%',
                        y2: '26%',
                        left: '12%'
                    },
                    dataRange: method.getDataRange(),
                    xAxis: [
                        {
                            type: 'category',
                            name: method.getXlineTitle(),
                            position: 'bottom',
                            boundaryGap: false,
                            nameLocation: 'middle',
                            nameGap: 70,
                            nameTextStyle: {
                                fontWeight: 'bold',
                                fontSize: '14',
                                color: '#666'
                            },
                            data: method.getXline(data),
                            axisLabel : {
                                show: true,
                                margin: 0,
                                rotate: -30,
                                formatter: '{value}',
                                textStyle: {
                                    fontSize: '14px'
                                }
                            },
                            axisTick: {
                                inside: true
                            }
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            name: method.getYlineTitle(),
                            position: 'left',
                            alignWithLabel: true,
                            nameTextStyle: {
                                fontWeight: 'bold',
                                fontSize: '14',
                                color: '#666'
                            },
                            nameLocation: 'middle',
                            nameGap: 70,
                            min: data.data.min > low ? (low - 20) : (data.data.min - 20),
                            max: data.data.max > top ? (data.data.max + 20) : (top + 20),
                            axisLabel : {
                                show: true,
                                interval: 'auto',
                                formatter: '{value}',
                                textStyle: {
                                    fontSize: '14'
                                }
                            }
                        }
                    ],
                    series: method.setControlChartData(data, originType, low, top)
                };
                return option;
            },
            setMapChartData: function(data) {
                var series = [],
                    x_line,
                    result = [],
                    values = [];
                series = [{
                    type: options.data.type,
                    name: '数值',
                    mapType: 'china',
                    roam: true,
                    label: {
                        normal: {
                            show: true
                        },
                        emphasis: {
                            show: true
                        }
                    },
                    data: []
                }];
                if (data.data.length === 0) {
                    return series;
                }
                if (options.type) {
                    _.each(data, function(value, name) {
                        if (name.length > 10) {
                            name = name.substr(0, 10) + '...';
                        }
                        if (options.type === 'combine') {
                            series[0].data.push({
                                name: name || '其它',
                                value: value[0] * 1
                            });
                        } else {
                            series[0].data.push([name, value]);
                        }
                    });

                } else {
                    x_line = method.getXline(data);
                    if (x_line.length === 1) {
                        //以省展示
                        series[0].mapType = data.sort[0].match(/(\S*)(?=省|市)/)[1];
                        _.each(data.data[data.sort[0]], function(val, key) {
                            series[0].data.push({
                                name: key,
                                value: val[0] * 1
                            });
                        });
                        series[0].name = data.yaxis[0];

                    } else {
                        //以全国地图展示
                        _.each(data.yaxis, function(yaxis, ktitle) {
                            var itemData = [], matchName;

                            _.each(x_line, function(name) {
                                var item = 0, i = 0;
                                values = _.values(data.data[name]);
                                for (; i < values.length; i ++) {
                                    if (!_.isUndefined(values[i][ktitle])) {
                                        item += values[i][ktitle] * 1;
                                    }
                                }
                                matchName = name.match(/(\S*)(?=省|市)/);
                                if (!_.isEmpty(matchName)) {
                                    name = matchName[1];
                                }
                                itemData.push({
                                    name: name,
                                    value: item
                                });
                            });

                            result.push({
                                type: options.data.type,
                                name: yaxis,
                                mapType: 'china',
                                roam: true,
                                label: {
                                    normal: {
                                        show: true
                                    },
                                    emphasis: {
                                        show: true
                                    }
                                },
                                data: itemData
                            });
                        });
                        series = result;
                    }

                }
                return series;
            },
            //对数据处理（line, scatter, bar, radar, pie, circlepie, histogram, stackColumn, barchart）
            setAngleChartData: function(data, originType) {
                var keysArray,
                    series = [],
                    result = [],
                    x_line, values, xValues, combineData,
                    radarValues = [];
                series = [{
                    type: options.data.type,
                    radius : (originType === 'circlePie') ? ['50%', '60%'] : '75%',
                    center: ['50%', '55%'],
                    name: '数值',
                    data: [],
                    itemStyle: {
                        normal: {
                            color: (options.data.type !== 'pie' && options.data.type !== 'radar') ? '#4572A7' : ''
                        }
                    }
                }];
                if (options.type === 'dataSource') {
                    _.each(data.data, function(value, name) {
                        series[0].data.push({
                            name: name,
                            value: value
                        });
                    });
                } else {
                    //单应用且只有一个x轴
                    if (options.type === 'combine' ||
                            (options.config.hasOwnProperty('x') && options.config.x.length === 1)) {
                        //计算Ｘ轴　展示值
                        x_line = method.getXline(data);
                        if (originType === 'histogram') {
                            x_line = method.getHistogramXline(data);
                        }
                        _.each(x_line, function(name) {
                            var item = 0;
                            if (!_.isUndefined(data.data[name])) {
                                item = data.data[name][0] * 1;
                            } else if (name === '其它' &&
                                !_.isUndefined(data.data['']) &&
                                !_.isUndefined(data.data[''][0])
                            ) {
                                item = data.data[''][0] * 1;
                            }
                            radarValues.push(item);
                            series[0].data.push({
                                name: name,
                                value: item
                            });
                        });
                        if (options.data.type === 'radar') {
                            series[0].data = [];
                            series[0].data.push({
                                name: '数值',
                                value: radarValues
                            });
                        }
                    } else {
                        // 计算两个Ｘ轴　展示值
                        keysArray = this.getKeys(data);
                        x_line = method.getXline(data);
                        values = data.data;
                        _.each(keysArray, function(name) {
                            var itemData = [];
                            name = (name === '其它' ? '' : name);
                            _.each(x_line, function(firstKey) {
                                var item = 0;
                                if (!_.isUndefined(values[firstKey]) && !_.isUndefined(values[firstKey][name])) {
                                    item = values[firstKey][name][0] * 1;
                                } else if (firstKey === '其它' && !_.isUndefined(values[''][name])) {
                                    item = values[''][name][0] * 1;
                                }
                                itemData.push(item);
                            });

                            result.push({
                                name: name === '' ? '其它' : name,
                                stack: originType === 'stackColumn' ? keysArray[0] : '',
                                type: options.data.type,
                                data: itemData
                            });

                            //雷达图专用类型
                            series[0].data.push({
                                name: name === '' ? '其它' : name,
                                value: itemData
                            });
                        });
                        if (options.data.type !== 'radar') {
                            series = result;
                        }
                    }
                }

                return series;
            },
            setScatterChartData: function(data) {
                var keysArray,
                    series = [],
                    result = [],
                    itemData = [],
                    xValues = data.data,
                    i = 0,
                    index = 2,
                    x_line;
                if (xValues.length === 0) {
                    return series.push({
                        name: '数值',
                        type: options.data.type,
                        data: []
                    });
                }
                if (options.type === 'dataSource') {
                    _.each(data, function(value, name) {
                        series[0].data.push([name, value]);
                    });
                } else if (options.type === 'combine') {
                    x_line = method.getXline(data);
                    _.each(x_line, function(name) {
                        var item = 0;

                        if (!_.isUndefined(xValues[name])) {
                            item = xValues[name][0] * 1;
                        } else if (name === '其它') {
                            item = xValues[''][0] * 1;
                        }
                        itemData.push([name, item]);
                    });

                    series.push({
                        name: '数值',
                        type: options.data.type,
                        data: itemData
                    });
                } else {
                    if (options.config.x.length === 1) {
                        //单应用且只有一个x轴　且有两个Ｙ轴
                        //计算Ｘ轴　展示值
                        x_line = method.getXline(data);
                        for (; i < index; i ++) {
                            itemData = [];
                            _.each(x_line, function(name) {
                                var item = 0;

                                if (!_.isUndefined(xValues[name])) {
                                    item = xValues[name][i] * 1;
                                } else if (name === '其它') {
                                    item = xValues[''][i] * 1;
                                }
                                itemData.push([name, item]);
                            });
                            if (_.isUndefined(options.config.y[i])) {
                                break;
                            }
                            result.push({
                                type: options.data.type,
                                name: data.yaxis[i],
                                data: itemData
                            });
                        }
                        series = result;
                    } else {
                        // x轴为０，y轴两个
                        keysArray = this.getKeys(data);
                        itemData = [];
                        _.each(xValues, function(val, firstKey) {
                            var item = 0;
                            if (!_.isUndefined(xValues[firstKey])) {
                                item = xValues[firstKey][0] * 1;
                            }
                            itemData.push([firstKey * 1, item]);
                        });

                        series.push({
                            name: '数值',
                            type: options.data.type,
                            data: itemData
                        });
                    }
                }
                return series;
            },
            setControlChartData: function(data, originType, low, top) {
                var series = [], x_line, values = [];
                series = [
                    {
                        type: options.data.type,
                        name: '',
                        data: [],
                        markLine : {
                            data : [
                                {type : 'average', name: '理想状态', itemStyle: {normal: {color: '#457200'}}},
                                {
                                    yAxis: parseInt(top, 10),
                                    name: '上限（UCL）',
                                    itemStyle: {
                                        normal: {
                                            color: '#dc143c',
                                            lineStyle: {
                                                type : 'dashed',
                                                width : 2
                                            }
                                        }
                                    }
                                },
                                {
                                    yAxis: parseInt(low, 10),
                                    name: '下限（LCL）',
                                    itemStyle: {
                                        normal: {
                                            color: '#dc143c',
                                            lineStyle: {
                                                type : 'dashed',
                                                width : 2
                                            }
                                        }
                                    }
                                }
                            ],
                            lable: {
                                normal: {
                                    formatter: '{b}: {d}'
                                }
                            }
                        },
                        markPoint: {
                            clickable: false
                        },
                        itemStyle: {
                            normal: {
                                color: '#4572A7'
                            }
                        }
                    }
                ];
                if (options.type === 'dataSource') {
                    _.each(data, function(value, name) {
                        series[0].data.push([name, value]);
                    });
                } else {
                    //单应用且只有一个x轴
                    x_line = method.getXline(data);
                    values = data.data.data ? data.data.data : data.data;
                    _.each(x_line, function(name) {
                        var item = 0;
                        if (!_.isUndefined(values[name])) {
                            item = values[name][0] * 1;
                        } else if (name === '其它') {
                            item = values[''][0] * 1;
                        }
                        series[0].data.push({
                            name: name,
                            value: item
                        });
                    });
                }

                return series;
            },
            getDataRange: function() {
                var min, max, dataRange,
                    target = method.target[1];

                if (_.isEmpty(target) || _.isEmpty(target.minValue) || _.isEmpty(target.maxValue)) {
                    return;
                }

                dataRange = {
                    x: 'left',
                    y: '70%',
                    selectedMode: false,
                    splitList: [],
                    itemGap: 10,
                    color: ['#C23531', '#DD883C', '#91C7AE']
                };
                min = parseInt(target.minValue, 10);
                max = parseInt(target.maxValue, 10);
                dataRange.splitList.push(
                    {start: max},
                    {start: min, end: max},
                    {end: min}
                );
                return dataRange;
            },
            getHistogramXline: function(data) {
                var x_line = [];
                _.each(data.data, function(value, key) {
                    x_line.push($.trim(key) || '其它');
                });
                return !_.isEmpty(x_line) ? x_line : ['无数据'];
            },
            //获取x轴底部单位标题
            getXline: function(data) {
                var week = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'],
                    x_line = [],
                    weekTarget = [],
                    result;
                _.each(data.sort, function(value) {
                    x_line.push($.trim(value) || '其它');
                });

                //判断是否为星期分类
                _.each(week, function(value) {
                    _.find(x_line, function(day) {
                        if (value === day) {
                            weekTarget.push(value);
                        }
                    });
                });
                return !_.isEmpty(weekTarget) ? weekTarget : (!_.isEmpty(x_line) ? x_line : ['无数据']);
            },
            //获取雷达图的Ｘ轴极坐标
            getRadarXline: function(data) {
                var x_line, Newx_line = [], i = 0, max = 0, series = [];
                x_line = method.getXline(data);

                series = method.setAngleChartData(data);

                _.each(x_line, function(value, i) {
                    max = 0;
                    _.each(series[0]['data'], function(item) {
                        max = max > item.value[i] ? max : item.value[i];
                    });

                    Newx_line.push({text: value, max: max});

                });

                return Newx_line;
            },
            dealWIthKeys: function(collection) {
                var keys = [];

                _.each(collection, function(value) {
                    keys.push($.trim(value) || '其它');
                });

                return keys;
            },

            getXlineTitle: function() {
                var xTitle = [],
                    result;

                if (options.data.type === 'pie') {
                    return;
                }

                if (options.type === 'combine') {
                    xTitle = _.map(options.xtitle, function(item) {
                        return method.getConditionTitle(item);
                    });
                    if (options.data.type === 'table') {
                        result = xTitle;
                    } else {
                        result = xTitle[0];
                    }
                } else {
                    result = method.getAppXlineTitle();
                }

                return result;
            },
            //获取单应用x轴总标题
            getAppXlineTitle: function() {
                var title = '',
                    typeTitle;

                if (options.config.x.length > 0) {
                    title = this.getTitle(options.config.x[method.index].field);
                    typeTitle = this.getTypeTitle(options.config.x[method.index].type);
                    if (typeTitle) {
                        title = title + '(' + typeTitle + ')';
                    }
                }
                return title;
            },
            //获取表名
            getTitle: function(field) {
                var dataArray = field.split('-'),
                    tableId = dataArray[0],
                    fieldId = dataArray[1],
                    title;

                if (!_.has(this.datatable, tableId)) {
                    this.getTable(tableId);
                }

                if (fieldId === 'id') {
                    title = this.datatable[tableId].title;
                } else {
                    title = this.datatable[tableId].schema[fieldId].title;
                }

                return title;
            },
            getTable: function(tableId) {
                this.datatable[tableId] = Common.getTable(tableId);
            },
            //获取表后的类型
            getTypeTitle: function(type) {
                var title = '总数';
                switch (type) {
                    case 'SUM':
                        title = '总和';
                        break;
                    case 'AVG':
                        title = '平均数';
                        break;
                    case 'MIN':
                        title = '最小值';
                        break;
                    case 'MAX':
                        title = '最大值';
                        break;
                    case 'YEAR':
                        title = '年';
                        break;
                    case 'QUARTER':
                        title = '季度';
                        break;
                    case 'MONTH':
                        title = '月';
                        break;
                    case 'WEEKDAY':
                        title = '周';
                        break;
                    case 'DAYOFMONTH':
                        title = '日';
                        break;
                    case 'HOUR':
                        title = '时';
                        break;
                    case 'BASIC':
                        title = '';
                        break;
                    default:
                        break;
                }
                return title;
            },
            getConditionTitle: function(str) {
                var fields = {},
                    parts,
                    labelId,
                    maxLen,
                    maxLenKey,
                    index = 1;

                _.each(_.union(str.match(/`(.*?)`/g)), function(item) {
                    parts = item.match(/`(.*?)\[(.*?)\]`/);
                    if (parts.length === 3) {
                        labelId = parts[1] + index;
                        if (typeof fields[labelId] === 'undefined') {
                            fields[labelId]   = [];
                        }
                        fields[labelId].push(parts[2]);
                        index++;
                    }
                });
                maxLen = 0;
                maxLenKey = '';
                _.each(fields, function(xs, labelId) {
                    if (xs.length > maxLen) {
                        maxLenKey = labelId;
                        maxLen = xs.length;
                    }
                });

                return fields[maxLenKey];
            },
            //获取y轴总标题
            getYlineTitle: function() {
                var result;

                if (options.data.type === 'pie') {
                    return;
                }

                if (options.type === 'combine') {
                    result = _.map(options.ytitle, function(item) {
                        var symbol = ['+', '-', '*', '/'],
                            express = item.match(/\[(.*?)\]|\+|\-|\*|\//g).join('').replace(/\[|\]/g, '');

                        return $.inArray(express[express.length - 1], symbol) === -1 ? express :
                                express.substr(0, express.length - 1);
                    });
                    if (options.data.type !== 'table') {
                        result = result[0];
                    }
                } else {
                    result = method.getTitle(options.config.y[0].field);
                }
                return result;
            },
            getKeys: function(data) {
                var week = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'],
                    weekTarget = [],
                    keys = {};

                if (!_.isUndefined(data.callout) && data.callout.length === 1 && data.callout[0] === 0) {
                    return ['数值'];
                }
                _.each(data.callout, function(item, key) {
                    if (item === '') {
                        item = '其它';
                    }
                    if (key !== 'length') {
                        keys[item] = true;
                    }
                });

                _.each(week, function(value) {
                    _.find(keys, function(day, key) {
                        if (value === key) {
                            weekTarget.push(value);
                        }
                    });
                });

                if (!_.isEmpty(weekTarget)) {
                    return weekTarget;
                }
                return _.keys(keys).sort(function(a, b) {
                    a = a.length === 1 ? '0' + a : a;
                    b = b.length === 1 ? '0' + b : b;

                    return a - b;
                });
            },
            //获取目标值
            getTargetText: function() {
                var target = method.target[1],
                    text;
                if (_.isEmpty(target) || _.isEmpty(target.minValue) || _.isEmpty(target.maxValue)) {
                    return;
                }

                text = '报警值:' + '\n最小值为' + target.minValue + '\n最大值为' + target.maxValue;
                return text;
            },

            getHtmlInfo: function(data, isRoot, tdWidth) {
                var _this = this,
                    rows = [],
                    count = 0;
                if (_.isArray(data)) {
                    rows.push(
                        _.map(data, function(item) {
                            return '<td width="' + tdWidth + '" style="text-align:center">' + item + '</td>';
                        }).join('')
                    );
                    return {
                        rows: rows,
                        count: 1
                    };
                }

                _.each(data, function(children, thisValue) {
                    var htmlInfo = _this.getHtmlInfo(children);

                    htmlInfo.rows[0] = '<td width="' + tdWidth + '" style="text-align:center" rowspan="' +
                        htmlInfo.count + '">' + thisValue + '</td>' + htmlInfo.rows[0];

                    rows = rows.concat(htmlInfo.rows);
                    count += htmlInfo.count;
                });

                return {
                    rows: rows,
                    count: count
                };
            },
            formChart: function(data) {
                var titleList = [],
                    xTitles = [],
                    yTitles = [];
                _.each(options.config.x, function(item, key) {
                    titleList.push({
                        title: data.xaxis[key],
                        field: item.field,
                        type: item.type
                    });
                    xTitles.push({
                        title: data.xaxis[key],
                        field: item.field,
                        type: item.type
                    });
                    method.index++;
                });
                _.each(options.config.y, function(item) {
                    titleList.push({
                        title: method.getTitle(item.field) + '的' + method.getTypeTitle(item.type),
                        field: item.field,
                        type: item.type
                    });
                    yTitles.push({
                        title: method.getTitle(item.field) + '的' + method.getTypeTitle(item.type),
                        field: item.field,
                        type: item.type
                    });
                });

                //添加同比环比数据
                if (method.formIncYoY === 'YoY' || method.formIncMoM === 'MoM') {
                    method.addFormTitleList(titleList, yTitles, data);
                }

                return $(self).reportTable({
                    title: _.has(options.config, 'title') ? options.config.title : '',
                    titles: titleList,
                    xTitles: xTitles,
                    yTitles: yTitles,
                    data: data.data,
                    target: method.target,
                    clickCbf: options.callback,
                    isAppTab: options.config.isAppTab ? true : false
                });
            },

            formTableChart: function(data) {
                var titleList = [], xtitle, ytitle,
                    xTitles = [],
                    yTitles = [];

                xtitle = method.getXlineTitle();
                ytitle = method.getYlineTitle();
                if (xtitle[0] !== undefined) {
                    _.each(_.union(data.xaxis, data.yaxis), function(value) {
                        titleList.push({
                            title: value,
                            field: 'x',
                            type: 'x'
                        });
                    });
                    _.each(data.xaxis, function(value) {
                        xTitles.push({
                            title: value,
                            field: 'x',
                            type: 'x'
                        });
                    });
                    _.each(data.yaxis, function(value) {
                        yTitles.push({
                            title: value,
                            field: 'x',
                            type: 'x'
                        });
                    });
                }

                return $(self).reportTable({
                    title: _.has(options.config, 'title') ? options.config.title : '',
                    titles: titleList,
                    data: data.data,
                    xTitles: xTitles,
                    yTitles: yTitles,
                    target: method.target,
                    clickCbf: options.callback
                });
            },
            translateSymbol: function(symbol) {
                switch (symbol) {
                    case '>=':
                        symbol = '不低于';
                        break;
                    case '<=':
                        symbol = '不超过';
                        break;
                    case '>':
                        symbol = '超过';
                        break;
                    case '<':
                        symbol = '低于';
                        break;
                }
                return symbol;
            },
            //渲染同比环比数据
            renderIncreasingData: function(option) {
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
            },
            //计算图形环比增长
            dealMoMdata: function(data) {
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
            },
            //计算图形同比增长
            dealYoYdata: function(data) {
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
            },
            //增加同比、环比表格标题
            addFormTitleList: function(data, yTitles, originData) {
                var yaxis = originData.yaxis;

                if (yaxis.indexOf('同比增长率') !== -1 && method.formIncYoY === 'YoY') {
                    data.push({
                        title: '同比增长率'
                    });
                    yTitles.push({
                        title: '同比增长率'
                    });
                }
                if (yaxis.indexOf('环比增长率') !== -1 && method.formIncMoM === 'MoM') {
                    data.push({
                        title: '环比增长率'
                    });
                    yTitles.push({
                        title: '环比增长率'
                    });
                }
            },
            //还原数据格式
            regainMapData: function(dataMap, xFields) {
                var _this = this,
                    result = {},
                    pValue = result,
                    maxIndex = _.size(xFields) - 1;

                _.each(dataMap, function(itemData) {
                    pValue = result;
                    _.each(xFields, function(fieldId, index) {
                        var value = itemData[fieldId];
                        if (typeof pValue[value] === 'undefined') {
                            if (maxIndex !== index) {
                                pValue[value] = {};
                            } else {
                                pValue[value] = itemData.YFields;
                            }
                        }
                        pValue = pValue[value];
                    });
                });
                return result;
            },
            //拆分数据为可计算格式
            transFormData: function(data, groups, parents, result) {
                groups = _.clone(groups);
                var _this = this,
                    fieldKey = groups.shift(),
                    values,
                    valueKey;

                if (typeof parents === 'undefined') {
                    parents = [];
                }

                if (typeof result === 'undefined') {
                    result = {};
                }

                if (!_.isArray(data)) {
                    _.each(data, function(values, keyValue) {
                        var parent = _.clone(parents);

                        parent.push({
                            key: fieldKey,
                            value: keyValue
                        });
                        _this.transFormData(values, groups, parent, result);
                    });
                } else {
                    values = {
                        YFields: data
                    };
                    valueKey = _.map(parents, function(item) {
                        values[item.key] = item.value;

                        return item.value;
                    }).join('_');

                    result[valueKey] = values;
                }

                return result;
            },

            //计算仪表盘同比数据
            dealCombineFormYoY: function(data) {
                var YoY;
                if (method.formIncYoY !== 'YoY') {
                    return data;
                }
                _.each(data, function(value, key) {
                    var dateArr = key.split('-');
                    if (dateArr.length === 1) {
                        YoY = '-';
                    } else {
                        dateArr[0] = dateArr[0] - 1;
                        dateArr = dateArr.join('-');
                        if (data[dateArr]) {
                            YoY = (value[0] - data[dateArr][0]) / data[dateArr][0] * 100;
                            YoY = Number(parseInt(YoY * 100, 10)) / 100 + '%';
                        } else {
                            YoY = '-';
                        }
                    }
                    value.push(YoY);
                });
                return data;
            },
            //计算仪表盘环比数据
            dealCombineFormMoM: function(data) {
                var MoM,
                    monOfDateType = ['02', '04', '06', '09', '11'];

                if (method.formIncMoM !== 'MoM') {
                    return data;
                }
                _.each(data, function(value, key) {
                    var curDate = key.split('-'),
                        preDate;

                    if (curDate.length === 1) {
                        if (curDate[0].length === 4) {
                            preDate = curDate[0] - 1;
                        } else {
                            preDate = '';
                        }
                    } else if (curDate.length === 2) {
                        //年-季度
                        if (curDate[1].length === 1) {
                            if (curDate[1] === '1') {
                                curDate[0] = curDate[0] - 1;
                                curDate[1] = '4';
                            } else {
                                curDate[1] = curDate[1] - 1;
                            }
                        } else {
                            //年-月
                            if (curDate[1] - 1 === 0) {
                                curDate[0] = curDate[0] - 1;
                                curDate[1] = '12';
                            } else if (curDate[1] - 1 > 0 && curDate[1] - 1 < 10) {
                                curDate[1] = '0' + curDate[1] - 1;
                            } else {
                                curDate[1] = curDate[1] - 1;
                            }
                        }
                        preDate = curDate.join('-');
                    } else {
                        //年-月-日
                        if (curDate[2] === '01') {
                            if (curDate[1] === '01') {
                                preDate = (curDate[0] - 1) + '-12-31';
                            } else if (curDate[1] === '03') {
                                if (curDate[0] % 4 === 0) {
                                    preDate = curDate[0] + '-' + (curDate[1] - 1) + '29';
                                } else {
                                    preDate = curDate[0] + '-' + (curDate[1] - 1) + '28';
                                }
                            } else if (_.contains(monOfDateType, curDate[1])) {
                                preDate = curDate[0] + '-' + (curDate[1] - 1) + '31';
                            } else {
                                preDate = curDate[0] + '-' + (curDate[1] - 1) + '30';
                            }
                        } else if (curDate[2] - 1 > 0 && curDate[2] - 1 < 10) {
                            preDate = curDate[0] + '-' + curDate[1] + '-0' +  (curDate[2] - 1);
                        } else {
                            preDate = curDate[0] + '-' + curDate[1] + '-' + (curDate[2] - 1);
                        }
                    }
                    if (preDate && data[preDate]) {
                        MoM = (value[0] - data[preDate][0]) / data[preDate][0] * 100;
                        MoM = Number(parseInt(MoM * 100, 10)) / 100 + '%';
                    } else {
                        MoM = '-';
                    }
                    value.push(MoM);
                });

                return data;
            }
        };
        function addEvent() {
            self.delegate('.saveTotal', 'click', function() {
                $.ajax({
                    url: url,
                    type: 'post',
                    data: {
                        name: '总值图',
                        tangle: $(self).find('.tangle').html(),
                        gaugeData: method.gaugeData,
                        title: method.title.text
                    },
                    dataType: 'json',
                    success: function(obJson) {
                        if (obJson.status === 200) {
                            window.open(
                                url + '?fileName=' + obJson.fileName + '&filePath=' + obJson.filePath
                            );
                        }
                    }
                });
            });
        }
        return method.init();
    };
    $.fn.getOption = function() {
        return getOption;
    };
})(jQuery);
