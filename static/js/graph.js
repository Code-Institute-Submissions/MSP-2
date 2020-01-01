queue()
    .defer(d3.csv, "data/vgsales.csv")
    .await(makeGraphs);
    
function makeGraphs(error, gameData) {
    var ndx = crossfilter(gameData);

    barChart_platform(ndx);
    barChart_genre(ndx);
    Publisher(ndx);
    timeline(ndx);
    publisher_selector(ndx);
    dc.renderAll();
}

function publisher_selector(ndx) {
  var dim = ndx.dimension(dc.pluck("Publisher"));
  var group = dim.group();

  dc.selectMenu("#platform_selector")
    .dimension(dim)
    .group(group);
}

function barChart_platform(ndx) {
  var dim = ndx.dimension(dc.pluck('Platform'));
  var group = dim.group();
    
  dc.barChart("#barChart_platform")
    .width(900)
    .height(400)
    .margins({top: 10, right: 50, bottom: 30, left: 50})
    .dimension(dim)
    .group(group)
    .transitionDuration(500)
    .x(d3.scale.ordinal())
    .xUnits(dc.units.ordinal)
    .xAxisLabel("Platform")
    .elasticY(true)
    .yAxis().ticks(10);
}
function barChart_genre(ndx) {
  var dim = ndx.dimension(dc.pluck('Genre'));
  var group = dim.group();
    
  dc.barChart("#barChart_genre")
    .width(700)
    .height(400)
    .margins({top: 10, right: 50, bottom: 30, left: 50})
    .dimension(dim)
    .group(group)
    .transitionDuration(500)
    .x(d3.scale.ordinal())
    .xUnits(dc.units.ordinal)
    .xAxisLabel("Genre")
    .elasticY(true)
    .yAxis().ticks(10);
}

// Top 5 pulishers
function Publisher(ndx) {
  var dim = ndx.dimension(dc.pluck("Publisher"));
  var group = dim.group();
  
  function getTop(group) {
    return {
      all: function() {
        return group.top(10);
      }
    };
  }
  
  var top = getTop(group);
  
  dc.rowChart("#publisher")
    .width(400)
    .height(400)
    .dimension(dim)
    .group(top)
    .elasticX(true)
    .colors(d3.scale.category10());
}

// Timeline of sales
function timeline(ndx) {
  var dim = ndx.dimension(dc.pluck("Year"));
  var group = dim.group().reduceSum(dc.pluck('Global_Sales'));

  //var minDate = dim.bottom(1)[0].Year;
  //var maxDate = dim.top(1)[0].Year;


  dc.lineChart("#timeline")
  
    .width(1000)
    .height(300)
    .margins({top: 10, right: 50, bottom: 30, left: 50})
    .dimension(dim)
    .group(group)
    .transitionDuration(500)
    //.x(d3.time.scale().domain([minDate,maxDate]))
    .x(d3.scale.ordinal())
    .xAxisLabel("YEAR")
    .elasticY(true)
    .xUnits(dc.units.ordinal); 
}

