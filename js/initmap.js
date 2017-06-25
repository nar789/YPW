    

    var marker1;
    var marker2;
    var map;
    var rectangle; 
    var df=false; //this is a drag flag.
    var pf=false; //this is a point flag;
    var infoWindow;

    function CleanRectangle(){
         if(rectangle && infoWindow)
         {
            rectangle.setMap(null);
            infoWindow.setMap(null);
            rectangle=null;
            infoWindow=null;
         }
    }
    function CleanPoint(){
        if(marker1){
            marker1.setMap(null);
            marker1=null;
            pf=false;
        }
    }

    function initMap() {

        $("#map").mousedown(function(e){
            if(mode==1){
                if(!rectangle){
                    rectangle = new google.maps.Rectangle({
                              map: map,
                            draggable:true
                    });     
                    rectangle.addListener('bounds_changed', showNewRect);
                }
                if(!infoWindow){
                        infoWindow = new google.maps.InfoWindow();
                }
                if(e.which==3)
                {
                    if(marker1 && marker2){
                        marker1.setMap(null);
                        marker2.setMap(null);
                        marker1=null;
                        marker2=null;
                    }
                    df=true;
                }
            }else if(mode==2){
                if(e.which==3)
                {
                    if(marker1){
                        marker1.setMap(null);
                        marker1=null;
                    }
                    pf=true;
                }
            }
        });
        $("#map").mouseup(function(e){
            if(df==true){
                df=false;
                redraw();
            }
        });


        map = new google.maps.Map(document.getElementById('map'), {
          zoom: 15,
          center: {lat: 35.944, lng: 126.683}
        });

        mMoveHandler = google.maps.event.addListener(map, 'mousemove', function(e) {

            if(pf==true){
                if(!marker1){
                    var latLng = e.latLng;
                    $("#bkqtext").val(e.latLng.lat()+", "+e.latLng.lng()+", Obama");
                    marker1 = new google.maps.Marker({
                        position: latLng,
                        map: map,
                        draggable: true
                    });
                }
            }
            if(df==true){
                if(!marker1)
                {
                    var latLng = e.latLng;
                    marker1 = new google.maps.Marker({
                        position: latLng,
                        map: map,
                        label:'START',
                        icon:null,
                        draggable: true
                    });
                    
                    marker2 = new google.maps.Marker({
                        position: latLng,
                        map: map,
                        draggable: true
                    });
                    marker1.setVisible(false);
                    marker2.setVisible(false);
                }
                if(marker2){
                    marker2.setPosition(e.latLng);
                    redraw();
                }
            }
        });
 
        rectangle = new google.maps.Rectangle({
          map: map,
          draggable:true
        });
        rectangle.addListener('bounds_changed', showNewRect);
        infoWindow = new google.maps.InfoWindow();
    }


     function redraw() {
        var latLngBounds = new google.maps.LatLngBounds(
          marker1.getPosition(),
          marker2.getPosition()
        );

        $("#brqtext").val(marker2.getPosition().lat()+", "+marker2.getPosition().lng()+
            ", "+marker1.getPosition().lat()+", "+marker1.getPosition().lng()+",Obama");
        rectangle.setBounds(latLngBounds);
    }


      function showNewRect(event) {
        var ne = rectangle.getBounds().getNorthEast();
        var sw = rectangle.getBounds().getSouthWest();

        var contentString = '<b>Rectangle moved.</b><br>' +
        'New north-east corner: ' + ne.lat() + ', ' + ne.lng() + '<br>' +
        'New south-west corner: ' + sw.lat() + ', ' + sw.lng();

        // Set the info window's content and position.
        infoWindow.setContent(contentString);
        infoWindow.setPosition(sw);

        infoWindow.open(map);
    }