define([
  "app",
  "core/entries/entries.collection",
  "core/entries/entries.model",
  "core/entries/entries.nestedcollection",
  "core/collection",
  "core/edit",
  "core/table/table.view",
  "core/modal",
  "core/tableSimple",
  "core/collection.settings"
],

function(app, EntriesCollection, EntriesModel, EntriesNestedCollection, Collection, Edit, Table, Modal, TableSimple, Settings) {

  "use strict";

  var Directus = {};

  //Directus.Media = Entries.MediaCollection;
  Directus.Collection = Collection;
  Directus.EntriesCollection = EntriesCollection;
  Directus.EditView = Edit;
  Directus.Table = Table;
  Directus.Modal = Modal;
  Directus.TableSimple = TableSimple;
  Directus.Settings = Settings;
  Directus.Model = EntriesModel;
  //Directus.MediaCollection = Structure.MediaCollection;

  Directus.SubRoute = Backbone.Router.extend({
    constructor: function(prefix) {
      var routes = {};

      // Prefix is optional, set to empty string if not passed
      prefix = prefix || "";

      // Allow for optionally omitting trailing /.  Since base routes do not
      // trigger with a trailing / this is actually kind of important =)
      if (prefix[prefix.length-1] == "/") {
        prefix = prefix.slice(0, prefix.length-1);

      // If a prefix exists, add a trailing /
      } else if (prefix) {
        prefix += "/";
      }

      // Every route needs to be prefixed
      _.each(this.routes, function(callback, path) {
        if (path) {
          return routes[prefix + path] = callback;
        }

        // If the path is "" just set to prefix, this is to comply
        // with how Backbone expects base paths to look gallery vs gallery/
        routes[prefix] = callback;
      });

      // Must override with prefixed routes
      this.routes = routes;

      // Required to have Backbone set up routes
      Backbone.Router.prototype.constructor.call(this);
    }
  });

  return Directus;
});