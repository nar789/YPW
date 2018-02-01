/**
 * Created by black on 17. 5. 11.
 */

import awarematics.spatialkeywordspark.geometryObjects.SpatialWebObject;
import com.vividsolutions.jts.geom.Point;

import static spark.Spark.*;


import java.util.*;
import java.util.List;


class ValueComparator implements Comparator<String>{

    HashMap<String, Integer> map = new HashMap<String, Integer>();

    public ValueComparator(HashMap<String, Integer> map){
        this.map.putAll(map);
    }

    @Override
    public int compare(String s1, String s2) {
        if(map.get(s1) >= map.get(s2)){
            return -1;
        }else{
            return 1;
        }
    }
}

public class Main {



    public static void main(String[] args){


        port(8080);
        WordCount wordcount=new WordCount();
        //init();

        get("/spark",(req,res)->"TEST");

        get("/init",(req,res)->{
            wordcount.Init();
            return "Initialize Success";
        });

        get("/bkq/:x/:y/:k/:words",(req,res)->{

            double x=Double.parseDouble(req.params(":x"));
            double y=Double.parseDouble(req.params(":y"));
            int k=Integer.parseInt(req.params(":k"));
            String words=req.params(":words");
            System.out.println(x+","+y+","+k+","+words);
            long start=System.currentTimeMillis();
            List<SpatialWebObject> ret= wordcount.BKQ(x,y,k,words);
            long end=System.currentTimeMillis();
            System.out.println("실행시간 : "+(end-start)/1000.0f);

            StringBuilder str=new StringBuilder();
            str.append("{\"RunningTime\":"+(end-start)+",\"Coordinate\":");
            str.append("[");
            boolean first=true;
            for(SpatialWebObject i:ret){
                if(first){
                    first=false;
                }else{
                    str.append(",");
                }
                double _x=((Point)i.getGeom()).getX();
                double _y=((Point)i.getGeom()).getY();
                StringBuilder sb=new StringBuilder();
                for(String s:i.getWords())
                    sb.append(s+" ");
                str.append("{\"lng\":"+_x+",\"lat\":"+_y+",\"words\":\""+sb.toString()+"\"}");
            }
            str.append("]}");
            System.out.println("The END!!");
            return str.toString();
        });

        get("/brq/:minx/:miny/:maxx/:maxy/:words",(req,res)->{

            double minx=Double.parseDouble(req.params(":minx"));
            double miny=Double.parseDouble(req.params(":miny"));
            double maxx=Double.parseDouble(req.params(":maxx"));
            double maxy=Double.parseDouble(req.params(":maxy"));
            String words=req.params(":words");
            System.out.println(minx+","+miny+","+maxx+","+maxy+","+words);
            long start=System.currentTimeMillis();
            List<SpatialWebObject> ret= wordcount.BRQ(minx,miny,maxx,maxy,words);
            long end=System.currentTimeMillis();
            System.out.println("실행시간 : "+(end-start)/1000.0f);

            StringBuilder str=new StringBuilder();
            str.append("{\"RunningTime\":"+(end-start)+",\"Coordinate\":");
            str.append("[");
            boolean first=true;
            for(SpatialWebObject i:ret){
                if(first){
                   first=false;
                }else{
                    str.append(",");
                }
                double x=((Point)i.getGeom()).getX();
                double y=((Point)i.getGeom()).getY();
                StringBuilder sb=new StringBuilder();
                for(String s:i.getWords())
                    sb.append(s+" ");
                str.append("{\"lng\":"+x+",\"lat\":"+y+",\"words\":\""+sb.toString()+"\"}");
            }
            str.append("]}");
            System.out.println("The END!!");
            return str.toString();
        });


    }
}
