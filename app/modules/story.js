define([
    "app"

], function( App ) {

    var Story = App.module();

    Story.Model = Backbone.Model.extend({
        defaults: {
            isAvailable: false,
            id: null
        },
        url: function() {
            return "http://alpha.zeega.org/api/items/" + this.id;
        },
        parse: function( obj ) {
            var data = obj.items[ 0 ];

            // API requests are coming up empty handed :(
            if ( !data ) {
                console.warn(
                    "Zeega API failed to respond with project data. Requested from: ", this.url()
                );
            }
            return data;
        },
        initialize: function() {
            // Push all new Story.Model instances into
            // the Story.Items collection
            Story.Items.add( this );

            this.set( "isAvailable", true );
        }
    });

    Story.Collection = Backbone.Collection.extend({
        model: Story.Model
    });

    Story.Items = new Story.Collection();

    Story.Views.Item = Backbone.View.extend({

        template: "story/item",

        data: function() {
            return {
                model: this.model
            };
        },

        initialize: function( config ) {
            this.model = Story.Items.get( config.id );
        },

        beforeRender: function() {
            console.log( "Story.Views.Item: beforeRender" );
        },

        afterRender: function() {
            var act, id, zp;

            act = this.model.get("act");
            id = this.model.get("id");

            zp = new Zeega.player({
                autoplay: true,
                data: this.model.get("text"),
                target: "#reinvention-story"
            });

            window.zp = zp;

            zp.on("deadend_frame", function() {
                this.off("deadend_frame").on("ended", function() {
                    console.log( "ended" );
                    App.router.go( act, "road", id );
                });
            });
        }
    });


    // Story.Items.from( array )
    //  array of ids
    //  array of objects with id property
    //
    Story.Items.from = function( marks ) {
        if ( marks.length ) {
            marks.forEach(function( story ) {
                // Do some param hockey... this let's us get away with
                // passing either an array of ids or an array of objects
                // with a single id property, set to the value of the
                // matching story marker
                story = typeof story === "object" ?
                    story : { id: story };

                ( new Story.Model(story) ).fetch();
            });
        }
    };

    return Story;
});
