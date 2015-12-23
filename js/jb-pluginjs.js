(function($, Backbone) {
    var Map = Backbone.View.extend({
        // load info window content template
        events: {},
        // initialize view
        initialize: function (options) {
            _.bindAll(this, 'setCenter');
            var view = this;
            if ($('#map-wrapper').length === 0) {
                return;
            }
            view.options = _.extend(this, options);
            view.center = new google.maps.LatLng(this.options.latitude, this.options.longitude);
            view.map_options = {
                'zoom': parseInt(9),
                'center': view.center,
                'scrollwheel': false,
                'zoomControl': true,
            };
            this.template = _.template($('#jb_info_content_template').html());
            // map marker collections
            view.markers = [];
            view.currentMarker = null;
            // map marker cluster
            view.markerCluster = [];
            this.initMapWindow();
            // Map for default save-widget
            this.map = new google.maps.Map(document.getElementById("map-wrapper"), view.map_options);
            this.categories = [];
            this.initMapIcon();
            // render map
            this.renderMap();
            this.lockView = true;
            this.nearby = false;
            if ($('#nearby_location').length > 0) {
                this.nearby = true;
            }
            view.blockUi = new Views.BlockUi();
        },
        initMapWindow : function() {
            var view = this,
            // init map info window
                iw1 = new InfoBubble({
                    content: '',
                    // position: new google.maps.LatLng(-35, 151),
                    shadowStyle: 0,
                    padding: 0,
                    borderRadius: 0,
                    arrowSize: 0,
                    borderWidth: 5,
                    borderColor: '#ccc',
                    disableAutoPan: false,
                    backgroundColor: '#fff',
                    arrowStyle: 0,
                    maxWidth: 400,
                    minWidth: 300,
                    minHeight: 90,
                    maxHeight: 400,
                    autoPan: true
                });

            view.infoWindow = iw1;
        },
        initMapIcon: function() {
            var view = this;
            this.icons = {};
            this.colors = {};
            this.fontClass = {};
            _.each(this.categories, function(element) {
                var icon = {
                    path: 'M 50 -119.876 -50 -119.876 -50 -19.876 -13.232 -19.876 0.199 0 13.63 -19.876 50 -19.876 Z',
                    fillColor: element.color,
                    fillOpacity: 1,
                    scale: 0.3,
                    strokeColor: element.color,
                    strokeWeight: 0
                };
                if(element.parent !== 0 && typeof element.icon === 'undefined') {
                    view.icons[element.term_id] = view.icons[element.parent];
                    view.fontClass[element.term_id] = view.fontClass[element.parent];
                }else {
                    view.icons[element.term_id] = icon;
                    view.fontClass[element.term_id] = element.icon;
                }
                if(element.parent !== 0 && typeof element.color === 'undefined'){
                    view.colors[element.term_id] = view.colors[element.parent];
                }
                else{
                    view.colors[element.term_id] = element.color;
                }

            });
            view.labelAnchor = new google.maps.Point(10, 31);
        },
        renderMap: function(data) {
            var view = this,
                data = {
                    action: 'jb_get_map_data'
                };
            view.markers = [];
            /**
             * ajax request get all place on map
             */
            if ($('.main-pagination').length > 0) {
                var query = JSON.parse($('.main-pagination .ae_query').html());
                data.query = query;
            }
            var i = 100,
                k = 1;
            current_place = Array();
            if ($('#total_place').length > 0) {
                i = JSON.parse($('#total_place').html());
                current_place = Array(i.2);
                i = i.number;
            }
            var cat = '';
            if ($('#place_cat_slug').length > 0) {
                cat = JSON.parse($('#place_cat_slug').html());
                cat = cat.slug;
            }

            data.paged = k;
            data.showposts = 50;
            data.place_category = cat;
            //if(ae_globals.is_single && ae_globals.single_map_marker === "1"){
                data = current_place;
                view.ajaxSuccess(data);
            //}
            //else{
            //    $.ajax({
            //        type: 'get',
            //        url: ae_globals.ajaxURL,
            //        data: data,
            //        beforeSend: function() {},
            //        success: function(resp) {
            //            if(IsJsonString(resp)){
            //                resp = JSON.parse(resp);
            //            }
            //            if (typeof resp.data !== 'undefined' && resp.data.length > 0) {
            //                var data = resp.data;
            //                // bind data markers to map
            //                view.ajaxSuccess(data);
            //            }
            //        }
            //    });
            //}
        },
        ajaxSuccess: function(data) {
            var view = this;
            var bounds = new google.maps.LatLngBounds();
            for (var i = 0; i < data.length; i++) {
                var content = '',
                // place latitude and longitude
                    latLng = new google.maps.LatLng(data[i].latitude, data[i].longitude),
                // get place category
                    term = data[i].term_taxonomy_id,
                    color = view.colors[term],
                    fontClass = view.fontClass[term],
                    icon = view.icons[term];
                bounds.extend(latLng);
                if (typeof color === 'undefined') {
                    color = '#F59236';
                }
                if (typeof fontClass === 'undefined') {
                    fontClass = 'fa-map-marker';
                }
                if (typeof icon === 'undefined') {
                    var icon = {
                        path: 'M 50 -119.876 -50 -119.876 -50 -19.876 -13.232 -19.876 0.199 0 13.63 -19.876 50 -19.876 Z',
                        fillColor: '#F59236',
                        fillOpacity: 1,
                        scale: 0.3,
                        strokeColor: '#F59236',
                        strokeWeight: 0
                    };
                }
                var marker = new MarkerWithLabel({
                    position: latLng,
                    // label by place category color and icon class
                    labelContent: "<span><i style='color:" + color + ";' class='fa " + fontClass + "'></i><span>",
                    labelAnchor: view.labelAnchor,
                    labelClass: "map-labels", // the CSS class for the label
                    labelStyle: {
                        opacity: 1.0
                    },
                    icon: icon
                });
                // set marker content using in multichoice
                marker.content = '';
                marker.ID = data[i].ID;
                view.markers.push(marker);
                // attach info window
                view.attachMarkerInfowindow(marker, content, data[i]);
                if (typeof view.model !== 'undefined' && view.model.get('ID') == data[i]['ID'] && !ae_globals.is_search) {
                    var model_data = view.model.toJSON(),
                        content = view.template(model_data);

                    marker.content = content;
                    view.map.setCenter(latLng);
                    /**
                     * set content for info window
                     */
                    view.infoWindow.setContent(content);
                    // set border color for info window
                    view.infoWindow.setBorderColor(color);
                    // open info window
                    view.infoWindow.open(this.map, marker);
                    view.map.setZoom(15);
                    google.maps.event.addListener(view.map,'idle',function(){
                        // display rating on map after the map is loaded
                        $('.infowindow .rate-it').raty({
                            readOnly: true,
                            half: true,
                            score: function() {
                                return $(this).attr('data-score');
                            },
                            hints: raty.hint
                        });
                    });
                }
            }

            // init map cluster
            view.markerCluster = new MarkerClusterer(view.map, view.markers, {
                zoomOnClick: true,
                gridSize: 20
            });
            // bind event click on cluster for multi marker in a position
            view.markerCluster.onClick = function(icon) {
                return view.multiChoice(icon.cluster_);
            };
            if (typeof view.model === 'undefined' && parseInt(ae_globals.fitbounds)) {
                //  Fit these bounds to the map
                view.map.fitBounds(bounds);
            }
            if (ae_globals.is_search && parseInt(ae_globals.fitbounds)){
                view.map.fitBounds(bounds);
            }
        },
    });
    $(document).ready(function() {
        new Map();
    });
    })(jQuery, Backbone);
