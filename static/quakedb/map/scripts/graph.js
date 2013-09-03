// Generated by CoffeeScript 1.6.3
(function() {
  var app, root;

  root = this;

  if (root.app == null) {
    app = root.app = {};
  } else {
    app = root.app;
  }

  app.drawgraph = function(collection) {
    app.graph_x.domain(d3.extent(collection.features, function(d) {
      return d.properties.calculated_magnitude;
    })).nice();
    app.graph_y.domain(d3.extent(collection.features, function(d) {
      return d.properties.depth;
    })).nice();
    app.scaled_data = [];
    collection.features.forEach(function(d) {
      return app.scaled_data.push(Math.abs(d.properties.calculated_magnitude));
    });
    app.min_mag = d3.min(app.scaled_data);
    app.max_mag = d3.max(app.scaled_data);
    app.scale = d3.scale.linear().domain([app.min_mag, app.max_mag]).range(d3.range(app.classes));
    app.graph_svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + app.graph_height + ")").call(app.graph_x_axis).style("fill", "white").append("text").attr("class", "label").attr("x", app.graph_width).attr("y", -6).style("text-anchor", "end").text("Magnitude");
    app.graph_svg.append("g").attr("class", "y axis").call(app.graph_y_axis).style("fill", "white").append("text").attr("class", "label").attr("transform", "rotate(-90)").attr("y", 6).attr("dy", ".71em").style("text-anchor", "end").text("Depth");
    return app.graph_svg.selectAll(".dot").data(collection.features).enter().append("circle").attr("class", "dot").attr("r", 3.5).attr("cx", function(d) {
      return app.graph_x(d.properties.calculated_magnitude);
    }).attr("cy", function(d) {
      return app.graph_y(d.properties.depth);
    }).attr("mag", function(d) {
      return d.properties.calculated_magnitude;
    }).style('fill', function(d) {
      return app.scheme[(app.scale(d.properties.calculated_magnitude) * 8).toFixed()];
    }).style('stroke', app.scheme[app.classes - 1]).style("opacity", 1);
  };

}).call(this);