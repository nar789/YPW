var rectangle;
var map;
var infoWindow;
var markerwin;

    function send(){
        var s=document.getElementById('select').value;
        var f=document.getElementById('from').value;
        var w=document.getElementById('where').value;
        if(!s || !f){
            alert('SQL문을 완성해주십시오.');
        }else if(s && f){
            sql='Select '+s+' From '+f;
            if(w){
                sql = sql +' Where '+w;
            }
            alert(sql);
        }
    }


   function initMap() {

        map = new google.maps.Map(document.getElementById('map'), {
          zoom: 3,
          center: {lat: -28.024, lng: 140.887}
        });

        LoadData();        
      }

      function render()
      {

        // Create an array of alphabetical characters used to label the markers.
        var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        pos=new Array();
        // Add some markers to the map.
        // Note: The code uses the JavaScript Array.prototype.map() method to
        // create an array of markers based on a given "locations" array.
        // The map() method here has nothing to do with the Google Maps API.

        var markerc='정보1<br>정보2<br>정보3';
        markerwin = new google.maps.InfoWindow();


        var markers = locations.map(function(location, i) {
          return new google.maps.Marker({
            position: location,
            label: labels[i % labels.length]
          });
        });

        for(var i=0;i<markers.length;i++){
            markers[i].addListener('click',function(){                
                markerwin.setContent('<center>'+this.label+'</center><br>'+markerc);
                markerwin.setPosition(this.position);
                markerwin.open(map);
            });
        }
         

        // Add a marker clusterer to manage the markers.
        var markerCluster = new MarkerClusterer(map, markers,
            {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});






        var bounds = {
          north: -25.36,
          south: -31.21,
          east: 143.23,
          west: 135.80
        };

        // Define the rectangle and set its editable property to true.
        rectangle = new google.maps.Rectangle({
          bounds: bounds,
          editable: true,
          draggable: true
        });

        rectangle.setMap(map);

        // Add an event listener on the rectangle.
        rectangle.addListener('bounds_changed', showNewRect);

        // Define an info window on the map.
        infoWindow = new google.maps.InfoWindow();



      }


        function showNewRect(event) {
        var ne = rectangle.getBounds().getNorthEast();
        var sw = rectangle.getBounds().getSouthWest();

        var contentString = '<b>Rectangle moved.</b><br>' +
            'New north-east corner: ' + ne.lat() + ', ' + ne.lng() + '<br>' +
            'New south-west corner: ' + sw.lat() + ', ' + sw.lng();

        // Set the info window's content and position.
        infoWindow.setContent(contentString);
        infoWindow.setPosition(ne);

        infoWindow.open(map);
      }

      var locations;
/*
      = [
        {lat: -31.563910, lng: 147.154312},
        {lat: -33.718234, lng: 150.363181},
        {lat: -33.727111, lng: 150.371124},
        {lat: -33.848588, lng: 151.209834},
        {lat: -33.851702, lng: 151.216968},
        {lat: -34.671264, lng: 150.863657},
        {lat: -35.304724, lng: 148.662905},
        {lat: -36.817685, lng: 175.699196},
        {lat: -36.828611, lng: 175.790222},
        {lat: -37.750000, lng: 145.116667},
        {lat: -37.759859, lng: 145.128708},
        {lat: -37.765015, lng: 145.133858},
        {lat: -37.770104, lng: 145.143299},
        {lat: -37.773700, lng: 145.145187},
        {lat: -37.774785, lng: 145.137978},
        {lat: -37.819616, lng: 144.968119},
        {lat: -38.330766, lng: 144.695692},
        {lat: -39.927193, lng: 175.053218},
        {lat: -41.330162, lng: 174.865694},
        {lat: -42.734358, lng: 147.439506},
        {lat: -42.734358, lng: 147.501315},
        {lat: -42.735258, lng: 147.438000},
        {lat: -43.999792, lng: 170.463352}
      ]*/

      function LoadData(){
        $.post("data.htm",{},function(data,status){
            var j=JSON.parse(data);
            locations=j;
            render();
        });
      }