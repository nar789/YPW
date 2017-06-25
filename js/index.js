
    var mode=1; //1:BRQ 2:BKQ 3:KNN

    function send(){

    }

    function BRQCheck(){
        mode=1;
        Clean();
    }

    function BKQCheck(){
        mode=2;
        Clean();
    }

    function KNNCheck(){
        mode=3;
        Clean();
    }

    function Clean(){
        CleanPoint();
        CleanRectangle();
    }

   

  