// Create a global object to store all logic in
var root = this;
root.app == null ? app = root.app = {} : app = root.app;
app.models == null ? app.models = app.models = {} : app.models = app.models;

// Base model for how we define a Leaflet layer
app.models.LayerModel = Backbone.Model.extend({
  defaults: {
  	id: 'undefined',
  	serviceUrl: 'undefined',
  	active: false,
  	detectRetina: true,
    isExtent: false,
  	layerOptions: 'undefined',
    attributeTable: false,
    geoJson: "undefined",
  },
  initialize: function (options) {
  	var model = this;
  	this.createLayer(function (layer) {
  	  model.set("layer", layer);
  	})
  },
  createLayer: function (options) {},
});

// Model for how we define a Leaflet GeoJSON layer
app.models.GeoJSONLayer = app.models.LayerModel.extend({
  createLayer: function (callback) {
    var layer = new L.geoJson(null, this.get("layerOptions"));
    callback(layer);
  },
  getJSON: function (callback) {
    var model = this;
    if (model.get("serviceUrl")) {
      d3.json(model.get("serviceUrl"), function (err, data) {
        if (err) callback(err);
        if (model.get("attributeTable")) {
          model.set("geoJson", data)
        }
        callback(data);
      }) 
    }
  },
});

// Model for how we define a Leaflet Tile layer
app.models.BingLayer = app.models.LayerModel.extend({
  createLayer: function (callback) {
    var model = this;
    if (model.get("apiKey") && model.get("bingType")) {
      var layer = new L.BingLayer(model.get("apiKey"), {
        type: model.get("bingType")
      })
      callback(layer);
    }
  }
});

// Base model for how we define a collection of layers
app.models.LayerCollection = Backbone.Collection.extend({
  model: app.models.LayerModel
});