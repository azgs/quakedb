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
  returnQuery: function () {
    var view = this;
    view.makeQuery(function (data) {
      view.makeAttributeTable(data);
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
    var mag = data.toGeoJSON().properties.calculated_magnitude;
    function selectQuery (data, mag) {
      var color;
      if (0 < mag && mag <= 1) {
        color = "rgb(247,252,240)";
      } else if (1 < mag && mag <= 2) {
        color = "rgb(224,243,219)";
      } else if (2 < mag && mag <= 3) {
        color = "rgb(204,235,197)";
      } else if (3 < mag && mag <= 4) {
        color = "rgb(168,221,181)";
      } else if (4 < mag && mag <= 5) {
        color = "rgb(123,204,196)";
      } else if (5 < mag && mag <= 6) {
        color = "rgb(78,179,211)";
      } else if (6 < mag && mag <= 7) {
        color = "rgb(43,140,190)";
      } else if (7 < mag && mag <= 8) {
        color = "rgb(8,88,158)";
      }
      return data.setStyle({fillColor: color});
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
      return data.setStyle({fillColor: color});
    };

    if (results) {
      selectQuery(data, mag);
    } else if (!results) {
      resetQuery(data, mag);
    }
  }
})