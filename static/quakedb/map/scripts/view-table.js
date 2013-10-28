// Generated by CoffeeScript 1.6.3
(function() {
  var app, root, views, _ref, _ref1,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  root = this;

  if (root.app == null) {
    app = root.app = {};
  } else {
    app = root.app;
  }

  if (app.views == null) {
    app.views = views = {};
  } else {
    views = app.views;
  }

  app.views.OtherTableView = (function(_super) {
    __extends(OtherTableView, _super);

    function OtherTableView() {
      _ref = OtherTableView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    OtherTableView.prototype.initialize = function() {
      $(".panel").remove();
      return this.template = _.template($("#table").html());
    };

    OtherTableView.prototype.render = function() {
      return this.$el.append(this.template({
        data: app.selected_data
      }));
    };

    return OtherTableView;

  })(Backbone.View);

  app.views.TableView = (function(_super) {
    __extends(TableView, _super);

    function TableView() {
      _ref1 = TableView.__super__.constructor.apply(this, arguments);
      return _ref1;
    }

    TableView.prototype.render = function() {
      var key_flag;
      key_flag = false;
      app.selected_data = [];
      return app.map.on(['click'], function(evt) {
        app.map.getFeatures({
          pixel: evt.getPixel(),
          layers: [app.dataLayerCollection.models[0].attributes.layer],
          success: function(feature) {
            var attributes, capital_keys, features, key, keys, values, _i, _len;
            capital_keys = [];
            features = feature[0];
            attributes = features[0].getAttributes();
            keys = _.keys(attributes);
            for (_i = 0, _len = keys.length; _i < _len; _i++) {
              key = keys[_i];
              capital_keys.push(key.charAt(0).toUpperCase() + key.slice(1));
            }
            values = _.values(attributes);
            if (!key_flag) {
              app.selected_data.push(capital_keys);
              return key_flag = true;
            }
          }
        });
        app.othertable = new app.views.OtherTableView({
          el: '#chart'
        });
        return app.othertable.render();
      });
    };

    return TableView;

  })(Backbone.View);

}).call(this);
