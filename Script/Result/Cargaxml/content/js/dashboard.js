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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6366120218579235, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.1875, 500, 1500, "https://blazedemo.com/purchase.php"], "isController": false}, {"data": [0.4444444444444444, 500, 1500, "https://blazedemo.com/reserve.php-0"], "isController": false}, {"data": [0.75, 500, 1500, "https://blazedemo.com/purchase.php-5"], "isController": false}, {"data": [0.6875, 500, 1500, "https://blazedemo.com/purchase.php-4"], "isController": false}, {"data": [0.5555555555555556, 500, 1500, "https://blazedemo.com/reserve.php-3"], "isController": false}, {"data": [0.5555555555555556, 500, 1500, "https://blazedemo.com/reserve.php-4"], "isController": false}, {"data": [1.0, 500, 1500, "https://blazedemo.com/reserve.php-1"], "isController": false}, {"data": [0.4375, 500, 1500, "https://blazedemo.com/confirmation.php"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://blazedemo.com/reserve.php-2"], "isController": false}, {"data": [0.5555555555555556, 500, 1500, "https://blazedemo.com/reserve.php-5"], "isController": false}, {"data": [0.5625, 500, 1500, "https://blazedemo.com/purchase.php-3"], "isController": false}, {"data": [0.75, 500, 1500, "https://blazedemo.com/purchase.php-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://blazedemo.com/purchase.php-1"], "isController": false}, {"data": [0.4375, 500, 1500, "https://blazedemo.com/purchase.php-0"], "isController": false}, {"data": [0.9375, 500, 1500, "https://blazedemo.com/confirmation.php-5"], "isController": false}, {"data": [0.875, 500, 1500, "https://blazedemo.com/confirmation.php-4"], "isController": false}, {"data": [0.875, 500, 1500, "https://blazedemo.com/confirmation.php-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://blazedemo.com/confirmation.php-2"], "isController": false}, {"data": [0.0, 500, 1500, "Test"], "isController": true}, {"data": [1.0, 500, 1500, "https://blazedemo.com/confirmation.php-1"], "isController": false}, {"data": [0.0, 500, 1500, "https://blazedemo.com/reserve.php"], "isController": false}, {"data": [0.75, 500, 1500, "https://blazedemo.com/confirmation.php-0"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 175, 0, 0.0, 775.4742857142858, 71, 5481, 539.0, 1605.2, 2209.7999999999975, 5389.800000000001, 0.320207860645539, 11.99217391975591, 0.2792884409536705], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://blazedemo.com/purchase.php", 8, 0, 0.0, 2111.25, 1110, 5361, 1717.5, 5361.0, 5361.0, 5361.0, 0.018129613136717678, 0.10803408140649538, 0.05772838850967781], "isController": false}, {"data": ["https://blazedemo.com/reserve.php-0", 9, 0, 0.0, 1161.4444444444443, 680, 3926, 787.0, 3926.0, 3926.0, 3926.0, 0.016859836684381985, 0.0955006569482197, 0.00816099516591016], "isController": false}, {"data": ["https://blazedemo.com/purchase.php-5", 8, 0, 0.0, 595.5, 169, 1170, 508.0, 1170.0, 1170.0, 1170.0, 0.018161304163251964, 0.003103738504462005, 0.009719135431115309], "isController": false}, {"data": ["https://blazedemo.com/purchase.php-4", 8, 0, 0.0, 575.625, 192, 1180, 548.5, 1180.0, 1180.0, 1180.0, 0.018160726973900764, 0.003139110033574644, 0.009718826544626582], "isController": false}, {"data": ["https://blazedemo.com/reserve.php-3", 9, 0, 0.0, 751.4444444444445, 333, 1468, 654.0, 1468.0, 1468.0, 1468.0, 0.016966534453375964, 0.6542719848583106, 0.007638254280279608], "isController": false}, {"data": ["https://blazedemo.com/reserve.php-4", 9, 0, 0.0, 1053.6666666666667, 389, 2774, 997.0, 2774.0, 2774.0, 2774.0, 0.016955570752770825, 2.0990301148598625, 0.007616760299096269], "isController": false}, {"data": ["https://blazedemo.com/reserve.php-1", 9, 0, 0.0, 319.1111111111111, 286, 390, 303.0, 390.0, 390.0, 390.0, 0.01697831303481686, 1.3861698287595645, 0.007925423467424277], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php", 8, 0, 0.0, 1069.0, 539, 2163, 1009.5, 2163.0, 2163.0, 2163.0, 0.018018789092326022, 1.5582909234854645, 0.05878102047159676], "isController": false}, {"data": ["https://blazedemo.com/reserve.php-2", 9, 0, 0.0, 564.1111111111111, 286, 1206, 522.0, 1206.0, 1206.0, 1206.0, 0.01697831303481686, 0.4805161035761987, 0.007610396174786074], "isController": false}, {"data": ["https://blazedemo.com/reserve.php-5", 9, 0, 0.0, 854.5555555555555, 184, 1619, 827.0, 1619.0, 1619.0, 1619.0, 0.016950461335056, 0.06732180297819607, 0.00764757142265222], "isController": false}, {"data": ["https://blazedemo.com/purchase.php-3", 8, 0, 0.0, 593.4999999999999, 171, 1141, 566.0, 1141.0, 1141.0, 1141.0, 0.01817318591850689, 0.0031235163297433717, 0.009725494026700953], "isController": false}, {"data": ["https://blazedemo.com/purchase.php-2", 8, 0, 0.0, 836.5000000000001, 154, 3763, 344.5, 3763.0, 3763.0, 3763.0, 0.018171947510329616, 0.003123303478337903, 0.009689339199843721], "isController": false}, {"data": ["https://blazedemo.com/purchase.php-1", 8, 0, 0.0, 120.125, 71, 170, 123.5, 170.0, 170.0, 170.0, 0.018177562979575235, 0.003781075111962427, 0.009372805911343481], "isController": false}, {"data": ["https://blazedemo.com/purchase.php-0", 8, 0, 0.0, 896.75, 626, 1595, 739.0, 1595.0, 1595.0, 1595.0, 0.018149520285491955, 0.09189967058620682, 0.009617561957924875], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php-5", 8, 0, 0.0, 260.25, 171, 536, 181.5, 536.0, 536.0, 536.0, 0.018073337083550776, 0.003088705067989635, 0.00967205929861897], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php-4", 8, 0, 0.0, 349.0, 165, 1121, 184.5, 1121.0, 1121.0, 1121.0, 0.01804948265670335, 0.0031198812795278255, 0.009659293453001403], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php-3", 8, 0, 0.0, 315.875, 179, 539, 202.0, 539.0, 539.0, 539.0, 0.018073459576448476, 0.003106375864702082, 0.009672124851458755], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php-2", 8, 0, 0.0, 296.75, 172, 488, 195.5, 488.0, 488.0, 488.0, 0.018087271082975358, 0.003108749717386389, 0.009644189464164593], "isController": false}, {"data": ["Test", 8, 0, 0.0, 5764.75, 3670, 10136, 4958.5, 10136.0, 10136.0, 10136.0, 0.01695633743111488, 6.348111620389996, 0.15593124072700296], "isController": true}, {"data": ["https://blazedemo.com/confirmation.php-1", 8, 0, 0.0, 247.125, 215, 292, 240.5, 292.0, 292.0, 292.0, 0.018083305266536617, 1.4763853224592391, 0.008441230388090335], "isController": false}, {"data": ["https://blazedemo.com/reserve.php", 9, 0, 0.0, 2513.5555555555557, 1596, 5481, 1970.0, 5481.0, 5481.0, 5481.0, 0.01682331037886095, 4.743160404306207, 0.04625862720385366], "isController": false}, {"data": ["https://blazedemo.com/confirmation.php-0", 8, 0, 0.0, 576.125, 300, 1039, 571.5, 1039.0, 1039.0, 1039.0, 0.018064521956297406, 0.0749748225725234, 0.011863663101181645], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 175, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
