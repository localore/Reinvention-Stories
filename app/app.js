define([
    // Libraries.
    "jquery",
    "lodash",
    "backbone",
    "layout",
    "scrollable",
    "scrollablecueset"
],

function( $, _, Backbone, Layout ) {
    var App, JST;

    // Provide a global location to place configuration settings and module
    // creation.
    window.App = App = {
        // The root path to run the Application.
        root: "/"
    };

    // Localize or create a new JavaScript Template object.
    // ...Preload some templates that we can avoid requesting:
    JST = window.JST = window.JST || {};

    // Create global "namespace"
    window.Reinvention = {
        data: {
            acts: null,
            roads: null
        },
        Acts: null,
        Roads: null,
        Profiles: null
    };

    // Configure LayoutManager with Backbone Boilerplate defaults.
    Backbone.Layout.configure({
        // Allow LayoutManager to augment Backbone.View.prototype.
        manage: true,

        prefix: "app/templates/",

        fetch: function( path ) {
            // Put fetch into `async-mode`.
            var done = this.async();

            // Concatenate the file extension.
            path = path + ".html";

            // If cached, use the compiled template.
            if ( JST[ path ] ) {
                return JST[ path ];
            }

            // Seek out the template asynchronously.
            $.get( App.root + path, function( contents ) {
                done( JST[ path ] = _.template( contents ) );
            });
        }
    });

    function extract( obj, prop ) {
        // console.log( "extract", prop, "from", obj );
        return obj.model && obj.$el ?
            obj.model.get( prop ) : obj.get( prop );
    }

    // Mix Backbone.Events, modules, and layout management into the App object.
    return Abstract.merge( App, {

        global: {},

        views: {},

        isCurrent: function( id, type ) {
            // If the |id| is an object, assume we've recieved
            // either a |view| object or a |model| object.
            if ( typeof id === "object" ) {
                type = extract( id, "type" );
                id = extract( id, "id" );
            }
            // console.log( "Test isCurrent", [id, type], [App.current.id, App.current.type] );
            return App.current.id === id && App.current.type === type;
        },

        current: {
            type: "",
            path: "",
            id: 0,
            act: 0
        },

        // Create a custom object with a nested Views object.
        module: function( props ) {
            return Abstract.merge({
                Views: {}
            }, props );
        },

        // Helper for using layouts.
        useLayout: function( name, options ) {
            // Enable variable arity by allowing the first argument to be the options
            // object and omitting the name argument.
            if ( _.isObject(name) ) {
              options = name;
            }

            // Ensure options is an object.
            options = options || {};

            // If a name property was specified use that as the template.
            if ( _.isString(name) ) {
              options.template = name;
            }
            // Cache the refererence.
            return this.layout = new Backbone.Layout(
                Abstract.merge({ el: "#main" }, options )
            );
        },

        goto: function( act, type ) {
            var args = type === "intro" ?
                [ 1, "intro", 1 ] :
                Act.Items.get( act ).next( type );

            App.router.go.apply( null, args );
        }
    }, Backbone.Events );
});
