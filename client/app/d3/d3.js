angular.module('d3directive', [])
  .directive('pieChart', ['$window', '$timeout', function($scope, $window, $timeout) {
    return {
      // MATCH element OR attribute
      restrict: 'EA',
      replace: false,
      scope: {
        // two-way data binding
        data: "=",
      },
      link: function(scope, element, attrs) {

        // ASSIGN chart radius
        var radius = 75;
        // ASSIGN colors to chart paths
        var color = d3.scaleOrdinal()
          .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

        var svg = d3.select(element[0])
          .append('svg')
          .style('width', '100%')
          .style('height', '200px')
          .append('g')
          .attr('class', 'canvas')

        var width = parseInt(d3.select("svg").style("width"));
        var height = parseInt(d3.select("svg").style("height"));
        var radius = Math.min(width, height) / 2;

        svg.attr('transform', "translate(" + ( width / 2 - ( width / 5 ) - 75 ) + "," + height / 2 + ")");

        // WATCH scope.data
        scope.$watch('data', function(newData, oldData) {
          // when change, RENDER new data
          render(newData);
        }, true);

        d3.select(window).on('resize', function(){
          render(scope.data);
        });

        var arc = d3.arc()
          .outerRadius(radius - 10)
          // CHANGE size of hole
          .innerRadius(radius - 35);

        var pie = d3.pie()
          .sort(null)
          .value(function(d) {
            return d.rate;
          })
          // .startAngle();

        function render(data){

          // REMOVE svg elements from canvas
          svg.selectAll('*').remove();
          if( !data ){
            return;
          }

          var width = parseInt(d3.select("svg").style("width"));
          var height = parseInt(d3.select("svg").style("height"));
          var radius = Math.min(width, height) / 2;
          var totalRate = [ data.totalRate ];
          data = data.rates;

          var g = svg.selectAll('.arc')
            .data(pie(data)).enter()
            .append("g")
            .attr('r', radius).attr('class', 'arc')

          g.append('path')
            .attr('d', arc)
            .style("fill", function(d){
              return color(d.data.rate);
            })
            .append("svg:title")
            .text(function(d){
              return d.data.name + ': ' + d.data.rate + '%';
            })

          svg.selectAll('.canvas')
            .style('height', '100%')
            .style('width', '100%')
            .data(totalRate)
            .enter()
            .append('text')
            .text(function(d){
              return d.toFixed(1) + '%';
            })
            .attr('transform', "translate(-39,10)")
            .style('fill', function(d){
                return color(d);
            })
            .style('font-size', '250%')
            .style('font-weight', '700');

        }
      }
    };
  }]);
