define([],

function() {

    //var PROXY_URL = "http://reinventionstories.org/twitter/submit.php";
    var PROXY_URL = "twitter/submit.php";

    return {
        post: function( data, callback ) {

            data = data || {};
            // data.status = encodeURIComponent( data.status || "" );

            callback = callback || function( response ) {
                console.log( response );
            };

            $.ajax({
                url: PROXY_URL,
                data: data,
                type: "POST",
                dataType: "json",
                success: function( data ) {
                    callback( data );
                }
            });
        }
    };
});
