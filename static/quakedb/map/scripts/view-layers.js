// Generated by CoffeeScript 1.6.3
(function() {
  var app, root, views, _ref,
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

  app.views.LayerView = (function(_super) {
    __extends(LayerView, _super);

    function LayerView() {
      _ref = LayerView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    LayerView.prototype.initialize = function(options) {};

    LayerView.prototype.render = function() {
      return this.collection.forEach(function(model) {});
    };

    LayerView.prototype.activeLayer = function() {
      var model, _i, _len, _ref1;
      _ref1 = this.collection.models;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        model = _ref1[_i];
        if (model.get('active')) {
          return model;
        }
      }
    };

    return LayerView;

  })(Backbone.View);

}).call(this);