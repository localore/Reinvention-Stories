define([
    "app",
    "modules/userstory",
    "modules/videopos"
], function( App, UserStory, VideoPos ) {

    var Contribute;

    Contribute = App.module();


    Contribute.View = Backbone.LayoutView.extend({
        template: "contribute/contribute",

        className: "contribute-view",

        afterRender: function() {
            var $bg = this.$(".contribute-bg");

            VideoPos.positionVideo( $bg );
            
            App.DOM.$window.on( "resize", function() {
                VideoPos.positionVideo( $bg );
            });

            // create new user story model now
            this.storyToSubmit = new UserStory.Model();
        },

        events: {
            "click .next" : "validateSection",
            "click .prev" : "prevSection"
        },

        validateSection: function() {
            var activeSection = this.$(".active-section"),
                activeId = activeSection.attr("id"),
                inputs = activeSection.find("input[type='text'], textarea"),
                valid = true;

            inputs.each( function(i,v) {
                if ( $(this).val().length === 0 ) {
                    $(this).addClass("invalid");
                    valid = false;
                } else {
                    $(this).removeClass("invalid");
                }
            });

            if ( valid ) {
                if ( activeSection .hasClass("last-section") ) {
                    // on the last section, submit
                   this.submitStory();
                } else {
                    // not on the last section, go to next section
                    this.nextSection();
                }
            }
            
        },

        nextSection: function() {
            var current = this.$(".active-section"),
                next = current.next(".contribute-section"),
                windowWidth = App.DOM.$body.width();

            // send the current section off to the left of the screen
            current.removeClass("active-section").animate( {
                left: windowWidth * -1
            }, function() {
                $(this).hide();
            } );

            // position the next section to the right of the viewport and make it visible
            next.addClass("active-section").css({
                left: windowWidth
            }).show();

            // slide the next section into position
            next.animate( {
                left: 0
            } );

            this.updateNavAndArrows();

        },

        prevSection: function() {
            var current = this.$(".active-section"),
                prev = current.prev(".contribute-section"),
                windowWidth = App.DOM.$body.width();

            // send the current section off to the right of the screen
            current.removeClass("active-section").animate( {
                left: windowWidth
            }, function() {
                $(this).hide();
            } );

            // position the next section to the left of the viewport and make it visible
            prev.addClass("active-section").css({
                left: windowWidth * -1
            }).show();

            // slide the next section into position
            prev.animate( {
                left: 0
            } );

            this.updateNavAndArrows();
        },

        updateNavAndArrows: function() {
            var index = this.$(".active-section").index(".contribute-section");

            // show or hide next arrow
            // if ( this.$(".active-section").next(".contribute-section").length > 0 ) {
            //     this.$(".next").fadeIn();
            // } else {
            //     this.$(".next").fadeOut();
            // }

            // show or hide previous arrow
            if ( this.$(".active-section").prev(".contribute-section").length > 0 ) {
                this.$(".prev").fadeIn();
            } else {
                this.$(".prev").fadeOut();
            }

            // activate the correct section name in the list
            this.$(".contribute-nav li").eq( index ).addClass("active")
                .siblings().removeClass("active");


        },

        submitStory: function() {
            
        }

    });

    return Contribute;
});
