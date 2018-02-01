
    var mode=1; //1:BRQ 2:BKQ 3:KNN
    var runningtime_t_handle=null;
    var clumap;

    function send(){
        var ne = {lat:0,lng:0};
        var sw = {lat:0,lng:0};
        var strarr="";
        if(mode==1)
            strarr=$("#brqtext").val().split(",");
        else if(mode==2)
            strarr=$("#bkqtext").val().split(",");

        var words;
        var k=null;
        ne.lat=strarr[0].trim();
        ne.lng=strarr[1].trim();
        
        if(mode==1){
            sw.lat=strarr[2].trim();
            sw.lng=strarr[3].trim();
            words=strarr[4];
        }else if(mode==2){
            k=strarr[2].trim();
            words=strarr[3];
        }
        
        if(markerCluster!=null){
            markerCluster.clearMarkers();
        }

        var url="";
        if(mode==1)
            url="pos.php?x1="+ne.lng+"&y1="+ne.lat+"&x2="+sw.lng+"&y2="+sw.lat+"&words="+words;
        else if(mode==2)
            url="pos.php?x="+ne.lng+"&y="+ne.lat+"&k="+k+"&words="+words;

        $.get(url,function (data,status){
            var parent=JSON.parse(data);            
            var runtime=parent.RunningTime;
            var obj=parent.Coordinate;
            clumap = obj.map(function(location, i) {
                    var mark=new google.maps.Marker({
                        position: location
                      });
                    mark.addListener('click',function(){
                            infoWindow = new google.maps.InfoWindow();
                            infoWindow.setContent("LNG : "+obj[i].lng+"<br>LAT : "+obj[i].lat+"<br>WORDS : "+obj[i].words);
                            infoWindow.setPosition(location);
                            infoWindow.open(map);
                    });
                  return mark;                  
            });

            markerCluster = new MarkerClusterer(map, clumap,
            {  minimumClusterSize:5,
                imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
            $("#runningtime").html("Complete query. Excution time =  "+runtime+"ms / Count of data = "+obj.length);
            $("#runningtime").slideDown();
            runningtime_t_handle=setTimeout(function(){
                $("#runningtime").slideUp();
            },10000);
        });
    }

    function runningtime_click(){
        if(runningtime_t_handle!=null){
            clearTimeout(runningtime_t_handle);
            runningtime_t_handle=null;
        }
        $("#runningtime").slideUp();
    }

    function BRQCheck(){
        AllWhereUp()
        $("#brqtext").slideDown();
        mode=1;
        Clean();
    }

    function BKQCheck(){
        AllWhereUp()
        $("#bkqtext").slideDown();
        mode=2;
        Clean();
    }

    function RangeCheck(){
        AllWhereUp()
        $("#rangetext").slideDown();
        mode=3;
        Clean();
    }
    function IntersectCheck(){
        AllWhereUp()
        $("#intersecttext").slideDown();
        mode=3;
        Clean();
    }

    function Clean(){
        CleanPoint();
        CleanRectangle();
    }

    function AllWhereUp()
    {
        $("#brqtext").slideUp();
        $("#bkqtext").slideUp();
        $("#rangetext").slideUp();
        $("#intersecttext").slideUp();
    }


  function init()
  {
    $("#conf-title").click(function(){
        $("#conf").slideToggle("slow");
    });
    $("#query-title").click(function(){
        $("#query").slideToggle("slow");
    });
    BRQCheck();
  }

  function initsend(){
    var url="pos.php?init=1";
     $.get(url,function (data,status){
            alert(data);
     });    
  }

  window.onload=init();