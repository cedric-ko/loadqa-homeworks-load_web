/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9482758620689655, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Бронирование мест-7"], "isController": false}, {"data": [1.0, 500, 1500, "Нажимаем кнопку получения QR-кода"], "isController": false}, {"data": [1.0, 500, 1500, "Переход на страницу кинотеатра-1"], "isController": false}, {"data": [1.0, 500, 1500, "Переход на страницу кинотеатра-2"], "isController": false}, {"data": [1.0, 500, 1500, "Переход на страницу кинотеатра-0"], "isController": false}, {"data": [1.0, 500, 1500, "Переход на страницу кинотеатра-5"], "isController": false}, {"data": [1.0, 500, 1500, "Переход на страницу кинотеатра-6"], "isController": false}, {"data": [1.0, 500, 1500, "Выбор зала-0"], "isController": false}, {"data": [0.5, 500, 1500, "Test"], "isController": true}, {"data": [1.0, 500, 1500, "Переход на страницу кинотеатра-3"], "isController": false}, {"data": [0.5, 500, 1500, "Переход на страницу кинотеатра-4"], "isController": false}, {"data": [1.0, 500, 1500, "Выбор зала-3"], "isController": false}, {"data": [1.0, 500, 1500, "Бронирование мест-6"], "isController": false}, {"data": [1.0, 500, 1500, "Выбор зала-4"], "isController": false}, {"data": [1.0, 500, 1500, "Бронирование мест-5"], "isController": false}, {"data": [1.0, 500, 1500, "Переход на страницу кинотеатра-7"], "isController": false}, {"data": [1.0, 500, 1500, "Выбор зала-1"], "isController": false}, {"data": [1.0, 500, 1500, "Бронирование мест-4"], "isController": false}, {"data": [1.0, 500, 1500, "Выбор зала-2"], "isController": false}, {"data": [1.0, 500, 1500, "Бронирование мест-3"], "isController": false}, {"data": [1.0, 500, 1500, "Выбор зала-7"], "isController": false}, {"data": [1.0, 500, 1500, "Бронирование мест-2"], "isController": false}, {"data": [1.0, 500, 1500, "Бронирование мест-1"], "isController": false}, {"data": [1.0, 500, 1500, "Выбор зала-5"], "isController": false}, {"data": [1.0, 500, 1500, "Бронирование мест-0"], "isController": false}, {"data": [1.0, 500, 1500, "Выбор зала-6"], "isController": false}, {"data": [0.5, 500, 1500, "Переход на страницу кинотеатра"], "isController": false}, {"data": [1.0, 500, 1500, "Бронирование мест"], "isController": false}, {"data": [1.0, 500, 1500, "Выбор зала"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 28, 0, 0.0, 87.03571428571428, 2, 1149, 6.0, 310.40000000000066, 959.5499999999988, 1149.0, 1.2960562858729865, 8.899899902795779, 1.6460167966580264], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Бронирование мест-7", 1, 0, 0.0, 2.0, 2, 2, 2.0, 2.0, 2.0, 2.0, 500.0, 121.58203125, 384.27734375], "isController": false}, {"data": ["Нажимаем кнопку получения QR-кода", 1, 0, 0.0, 5.0, 5, 5, 5.0, 5.0, 5.0, 5.0, 200.0, 66.015625, 138.671875], "isController": false}, {"data": ["Переход на страницу кинотеатра-1", 1, 0, 0.0, 5.0, 5, 5, 5.0, 5.0, 5.0, 5.0, 200.0, 1242.1875, 137.6953125], "isController": false}, {"data": ["Переход на страницу кинотеатра-2", 1, 0, 0.0, 8.0, 8, 8, 8.0, 8.0, 8.0, 8.0, 125.0, 1112.9150390625, 85.693359375], "isController": false}, {"data": ["Переход на страницу кинотеатра-0", 1, 0, 0.0, 264.0, 264, 264, 264.0, 264.0, 264.0, 264.0, 3.787878787878788, 18.983783143939394, 2.3859197443181817], "isController": false}, {"data": ["Переход на страницу кинотеатра-5", 1, 0, 0.0, 9.0, 9, 9, 9.0, 9.0, 9.0, 9.0, 111.1111111111111, 1981.6623263888891, 75.84635416666667], "isController": false}, {"data": ["Переход на страницу кинотеатра-6", 1, 0, 0.0, 9.0, 9, 9, 9.0, 9.0, 9.0, 9.0, 111.1111111111111, 1981.6623263888891, 75.84635416666667], "isController": false}, {"data": ["Выбор зала-0", 1, 0, 0.0, 13.0, 13, 13, 13.0, 13.0, 13.0, 13.0, 76.92307692307693, 380.70913461538464, 52.35877403846154], "isController": false}, {"data": ["Test", 1, 0, 0.0, 1259.0, 1259, 1259, 1259.0, 1259.0, 1259.0, 1259.0, 0.7942811755361397, 76.49067340150914, 14.397897637013504], "isController": true}, {"data": ["Переход на страницу кинотеатра-3", 1, 0, 0.0, 7.0, 7, 7, 7.0, 7.0, 7.0, 7.0, 142.85714285714286, 516.1830357142857, 97.51674107142857], "isController": false}, {"data": ["Переход на страницу кинотеатра-4", 1, 0, 0.0, 728.0, 728, 728, 728.0, 728.0, 728.0, 728.0, 1.3736263736263736, 2.7043269230769234, 0.9591238839285715], "isController": false}, {"data": ["Выбор зала-3", 1, 0, 0.0, 6.0, 6, 6, 6.0, 6.0, 6.0, 6.0, 166.66666666666666, 40.52734375, 127.9296875], "isController": false}, {"data": ["Бронирование мест-6", 1, 0, 0.0, 5.0, 5, 5, 5.0, 5.0, 5.0, 5.0, 200.0, 48.828125, 153.7109375], "isController": false}, {"data": ["Выбор зала-4", 1, 0, 0.0, 39.0, 39, 39, 39.0, 39.0, 39.0, 39.0, 25.64102564102564, 50.48076923076923, 17.928685897435898], "isController": false}, {"data": ["Бронирование мест-5", 1, 0, 0.0, 2.0, 2, 2, 2.0, 2.0, 2.0, 2.0, 500.0, 121.58203125, 384.27734375], "isController": false}, {"data": ["Переход на страницу кинотеатра-7", 1, 0, 0.0, 4.0, 4, 4, 4.0, 4.0, 4.0, 4.0, 250.0, 4458.49609375, 170.654296875], "isController": false}, {"data": ["Выбор зала-1", 1, 0, 0.0, 3.0, 3, 3, 3.0, 3.0, 3.0, 3.0, 333.3333333333333, 81.0546875, 258.1380208333333], "isController": false}, {"data": ["Бронирование мест-4", 1, 0, 0.0, 31.0, 31, 31, 31.0, 31.0, 31.0, 31.0, 32.25806451612903, 63.50806451612903, 22.555443548387096], "isController": false}, {"data": ["Выбор зала-2", 1, 0, 0.0, 6.0, 6, 6, 6.0, 6.0, 6.0, 6.0, 166.66666666666666, 40.690104166666664, 128.58072916666666], "isController": false}, {"data": ["Бронирование мест-3", 1, 0, 0.0, 5.0, 5, 5, 5.0, 5.0, 5.0, 5.0, 200.0, 48.6328125, 153.515625], "isController": false}, {"data": ["Выбор зала-7", 1, 0, 0.0, 2.0, 2, 2, 2.0, 2.0, 2.0, 2.0, 500.0, 121.58203125, 384.27734375], "isController": false}, {"data": ["Бронирование мест-2", 1, 0, 0.0, 5.0, 5, 5, 5.0, 5.0, 5.0, 5.0, 200.0, 48.828125, 154.296875], "isController": false}, {"data": ["Бронирование мест-1", 1, 0, 0.0, 4.0, 4, 4, 4.0, 4.0, 4.0, 4.0, 250.0, 61.03515625, 193.603515625], "isController": false}, {"data": ["Выбор зала-5", 1, 0, 0.0, 5.0, 5, 5, 5.0, 5.0, 5.0, 5.0, 200.0, 48.828125, 153.7109375], "isController": false}, {"data": ["Бронирование мест-0", 1, 0, 0.0, 10.0, 10, 10, 10.0, 10.0, 10.0, 10.0, 100.0, 494.921875, 68.359375], "isController": false}, {"data": ["Выбор зала-6", 1, 0, 0.0, 6.0, 6, 6, 6.0, 6.0, 6.0, 6.0, 166.66666666666666, 40.690104166666664, 128.09244791666666], "isController": false}, {"data": ["Переход на страницу кинотеатра", 1, 0, 0.0, 1149.0, 1149, 1149, 1149.0, 1149.0, 1149.0, 1149.0, 0.8703220191470844, 68.93987298738033, 4.728126359878154], "isController": false}, {"data": ["Бронирование мест", 1, 0, 0.0, 47.0, 47, 47, 47.0, 47.0, 47.0, 47.0, 21.27659574468085, 178.2953789893617, 127.70113031914893], "isController": false}, {"data": ["Выбор зала", 1, 0, 0.0, 58.0, 58, 58, 58.0, 58.0, 58.0, 58.0, 17.241379310344826, 144.48073814655172, 103.4314385775862], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 28, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
