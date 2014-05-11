// Create a global object to store all logic in
var root = this;
root.app == null ? app = root.app = {} : app = root.app;
app.views == null ? app.views = app.views = {} : app.views = app.views;

app.views.QueryView = Backbone.View.extend({
  initialize: function () {
  },
  events: {
    "click": "returnQuery"
  },
  render: function () {
  },
  returnQuery: function () {
    var view = this;
    view.makeQuery(function (data) {
      view.makeAttributeTable(data);

      var contentTab = $("#content-tab");
      if (contentTab.hasClass("hide-tab")) {
        contentTab.removeClass("hide-tab");
        contentTab.addClass("show-tab");
      }

      var resetStyle = {};

      $("tr").hover(function () {
        var rowId = this.className.replace("-", ".");
        view.queryLayer(function (model) {
          var layer = model.get("layer");
          layer.eachLayer(function (data) {
            if (data.toGeoJSON().id == rowId) {
              resetStyle.selectedLayer = data;
              resetStyle.originalStyle = data.options;
              data.setStyle({fillColor: "blue"});
            }
          })
        })
      }, function () {
        resetStyle.selectedLayer.setStyle(resetStyle.originalStyle);
      });

      $("tr").click(function () {
        var rowId = this.className.replace("-", ".");
        view.queryLayer(function (model) {
          var layer = model.get("layer");
          layer.eachLayer(function (data) {
            if (data.toGeoJSON().id == rowId) {
              var bounds = data.getLatLng();
              app.map.setView(bounds, 17);
            }
          })
        })
      })
    })
  },
  makeQuery: function (callback) {
  	var model = this.model,
        view = this,
        results = [];
    model.makeQuery(function (bounds) {
      app.map.fitBounds(bounds);
      view.queryLayer(function (model) {
        var layer = model.get("layer");
        layer.eachLayer(function (data) {
          view.queryStyle(data, false);
          var geom = data.getLatLng();
          if (bounds.contains(geom) == true) {
            view.queryStyle(data, true);
            results.push(data.toGeoJSON());
          }
        })
        callback(results);
      })
    });
  },
  queryLayer: function (callback) {
    var queryModel = this.model;
    this.collection.each(function (model) {
      if (model.id == queryModel.get("queryLayerId")) {
        callback(model);
      }
    })
  },
  makeAttributeTable: function (data) {
    new app.views.AttributeTableView({
      el: $("#content-tab"),
      attributes: data,
    })
  },
  queryStyle: function (data, results) {
    var mag = data.toGeoJSON().properties.calculated_magnitude,
        featureId = data.toGeoJSON().id.replace(".", "-");
    function selectQuery (data, mag) {
      var color;
      if (0 < mag && mag <= 1) {
        color = "rgb(239,237,245)";
      } else if (1 < mag && mag <= 2) {
        color = "rgb(218,218,235)";
      } else if (2 < mag && mag <= 3) {
        color = "rgb(188,189,220)";
      } else if (3 < mag && mag <= 4) {
        color = "rgb(158,154,200)";
      } else if (4 < mag && mag <= 5) {
        color = "rgb(128,125,186)";
      } else if (5 < mag && mag <= 6) {
        color = "rgb(106,81,163)";
      } else if (6 < mag && mag <= 7) {
        color = "rgb(84,39,143)";
      } else if (7 < mag && mag <= 8) {
        color = "rgb(63,0,125)";
      }
      
      data.on("mouseover", function () {
        var quakeId = $("." + featureId);
        data.setStyle({fillColor: "blue"});
        quakeId.addClass("quake-highlight");
      });

      data.on("click", function () {
        var quakeId = $("." + featureId);
        $("#query-results #table-body").prepend(quakeId);
        $("#query-results #table-body").animate({scrollTop:0}, "fast");
      });

      data.on("mouseout", function () {
        var quakeId = $("." + featureId);
        data.setStyle({fillColor: color});
        quakeId.removeClass("quake-highlight");
      });

      return data.setStyle({fillColor: color, fillOpacity: 0.9});
    };
    function resetQuery (mag) {
      var color;
      if (0 < mag && mag <= 1) {
        color = "rgb(255,255,204)";
      } else if (1 < mag && mag <= 2) {
        color = "rgb(255,237,160)";
      } else if (2 < mag && mag <= 3) {
        color = "rgb(254,217,118)";
      } else if (3 < mag && mag <= 4) {
        color = "rgb(254,178,76)";
      } else if (4 < mag && mag <= 5) {
        color = "rgb(253,141,60)";
      } else if (5 < mag && mag <= 6) {
        color = "rgb(252,78,42)";
      } else if (6 < mag && mag <= 7) {
        color = "rgb(227,26,28)";
      } else if (7 < mag && mag <= 8) {
        color = "rgb(177,0,38)";
      }
      return data.setStyle({fillColor: color, fillOpacity: 0.8});
    };

    if (results) {
      selectQuery(data, mag);
    } else if (!results) {
      resetQuery(data, mag);
    }
  }
})