 // Create a global object to store all logic in
var root = this;
root.app == null ? app = root.app = {} : app = root.app;
app.views == null ? app.views = app.views = {} : app.views = app.views;

app.views.ContentView = Backbone.View.extend({
  initialize: function (options) {
  	var view = this,
  	    controlEl = $("#content-control");
  	controlEl.click(function () {
  	  view.toggleContent(controlEl);
  	})
  },
  toggleContent: function (control) {
  	var contentTab = $("#content-tab");
  	if (contentTab.hasClass("hide-tab")) {
  	  contentTab.removeClass("hide-tab");
  	  contentTab.addClass("show-tab");
  	} else {
  	  contentTab.removeClass("show-tab");
  	  contentTab.addClass("hide-tab");
  	}
  }
});

app.views.AttributeTableView = Backbone.View.extend({
  initialize: function () {
    $("#query-results").remove();
    this.template = _.template($("#attribute-table").html());
    this.render();
  },
  render: function () {
    var el = this.el,
        template = this.template;
    this.processData(function (data) {
      $(el).append(template({
        data: data
      }));
    });
  },
  processData: function (callback) {
    var keys = Object.keys(this.attributes[0].properties),
        json = this.attributes,
        features = [];

    for (var i=0; i<json.length; i++) {
      var id = json[i].id;
      var feature = json[i].properties;
      var record = {
        "id": "",
        "feature": [],
      };
      for (var key in feature) {
        if (feature.hasOwnProperty(key)) {
          record.id = id.replace(".", "-");
          record.feature.push(feature[key]);
        }
      }
      features.push(record);
    };

    var data = {
      "fields": keys,
      "features": features,
    }
    callback(data);
  },
});