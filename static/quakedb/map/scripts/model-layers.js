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
  	layerOptions: 'undefined'
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
  getJSON: function (callback) {
  	d3.json(this.get("serviceUrl"), function (err, data) {
  	  if (err) callback(err);
  	  callback(data);
  	})
  },
  createLayer: function (callback) {
  	if (this.get("serviceUrl")) {
  	  var model = this;
  	  this.getJSON(function (data) {
  	  	var layer = new L.geoJson(data, model.get("layerOptions"));
  	  	callback(layer);
  	  })
  	}
  },
});

// Model for how we define a Leaflet Tile layer
app.models.TileLayer = app.models.LayerModel.extend({
  createLayer: function (callback) {
  	if (this.get("serviceUrl")) {
  	  var layer = new L.tileLayer(this.get("serviceUrl"));
  	  callback(layer);
  	}
  }
});

// Base model for how we define a collection of layers
app.models.LayerCollection = Backbone.Collection.extend({
  model: app.models.LayerModel
});