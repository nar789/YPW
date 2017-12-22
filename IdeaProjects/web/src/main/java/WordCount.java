/**
 * Created by black on 17. 5. 11.
 */

import java.util.*;

import awarematics.spatialkeywordspark.SpatialWebSparkQueryTest;
import awarematics.spatialkeywordspark.geometryObjects.SpatialWebObject;
import awarematics.spatialkeywordspark.spatialOperator.SpatialWebObjectQuerys;
import awarematics.spatialkeywordspark.test.WebClassTest;
import awarematics.sspark.srdd.SpatialRDD;
import com.vividsolutions.jts.geom.Coordinate;
import com.vividsolutions.jts.geom.Envelope;
import com.vividsolutions.jts.geom.GeometryFactory;
import com.vividsolutions.jts.geom.Point;
import org.apache.spark.api.java.JavaRDD;


public class WordCount {
    //public static WordCount instance = new WordCount();
    SpatialWebSparkQueryTest swt;
    SpatialRDD swRDD;
    WebClassTest test;

    public WordCount(){
        test = new WebClassTest();
        test.init("JHWebTEST",
                "hdfs://192.168.1.100:9000/spark/testdata/twitter_test_25m.csv",
                4,
                "spatialwebobject",
                "BSP",
                12,
                0.5f,
                10,
                256,
                0.01f,
                "obama",
                "memory_and_disk",
                "");

        swt = test.getSpatialWebSparkQueryTest();
        swRDD = swt.getSpatialRDD2("/home/black/SpatialWebSpark_v07.jar");
        swRDD.setIndexedRDD("STRTREE", "memory_and_disk");
    }

    public void Init(){
        test = new WebClassTest();
        test.init("JHWebTEST",
                "hdfs://192.168.1.100:9000/spark/testdata/twitter_test_25m.csv",
                4,
                "spatialwebobject",
                "BSP",
                12,
                0.5f,
                10,
                256,
                0.01f,
                "obama",
                "memory_and_disk",
                "");

        swt = test.getSpatialWebSparkQueryTest();
        swRDD.setIndexedRDD("STRTREE", "memory_and_disk");
    }

    public List<SpatialWebObject> BRQ(double x1,double y1,double x2,double y2,String w){

        double minx, maxx, miny, maxy;
        minx = Math.min(x1, x2);
        maxx = Math.max(x1, x2);
        miny = Math.min(y1, y2);
        maxy = Math.max(y1, y2);
        Envelope envelope = new Envelope(minx, maxx, miny, maxy);
        String[] words=w.split(" ");
        JavaRDD<SpatialWebObject> result = SpatialWebObjectQuerys.SpatialWebRangeQueryUsingGrid(swt.getSparkContext(), swRDD, envelope, words);

        List<SpatialWebObject> result2 = result.collect();

        return result2;
    }


    public List<SpatialWebObject> BKQ(double x1,double y1,int k,String w) {

        GeometryFactory gf = new GeometryFactory();

        Point point = gf.createPoint(new Coordinate(x1, y1));

        String[] words=w.split(" ");
        SpatialWebObject swo = new SpatialWebObject(point, words);

        JavaRDD<SpatialWebObject> result_bkq = SpatialWebObjectQuerys.Rtree_BkQ(swt.getSparkContext(), swRDD, swo, k);

        class WeightedSWO implements Comparable<WeightedSWO>{
            double weight;
            SpatialWebObject wSwo;

            public WeightedSWO(SpatialWebObject wSwo){
                this.wSwo = wSwo;
            }

            public void setWeight(SpatialWebObject other){
                this.weight = wSwo.distance(other);
            }

            public double getWeight(){
                return weight;
            }
            public SpatialWebObject getSWO(){
                return this.wSwo;
            }
            @Override
            public int compareTo(WeightedSWO o) {
                if(o.getWeight() < this.weight)
                    return 1;
                else if(o.getWeight() > this.weight)
                    return -1;
                else
                    return 0;
            }
        }

        PriorityQueue<WeightedSWO> bkq = new PriorityQueue<WeightedSWO>();
        List<SpatialWebObject> tempResult = result_bkq.collect();

        for(SpatialWebObject temp : tempResult){
            WeightedSWO tempswo = new WeightedSWO(temp);
            tempswo.setWeight(swo);
            bkq.add(tempswo);
        }

        List<SpatialWebObject> result = new ArrayList<SpatialWebObject>();
        for(int i=0; i<k; i++){
            result.add(bkq.poll().getSWO());
        }

        return result;
    }
}
