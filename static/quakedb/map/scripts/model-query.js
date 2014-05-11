 // Create a global object to store all logic in
var root = this;
root.app == null ? app = root.app = {} : app = root.app;
app.models == null ? app.models = app.models = {} : app.models = app.models;

app.models.QueryArea = Backbone.Model.extend({
  defaults: {
    queryLayerId: 'earthquakes' 
  },
  initialize: function () {
    var queryModel = this;
    drawnItems = new L.FeatureGroup();
    this.set("featureGroup", drawnItems);
  },
  makeQuery: function (callback) {
    new L.Draw.Rectangle(app.map).enable();
    var featureGroup = this.get("featureGroup");
  	app.map.on("draw:created", function (query) {
      featureGroup.clearLayers();
      featureGroup.addLayer(query.layer);
      var bounds = query.layer.getBounds();
      callback(bounds);
  	})
  },
});