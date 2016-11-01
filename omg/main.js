(function(){

    //ajax request
    var httpRequest;
    var json_url = window.location.origin + '/items.json';
    var upload_btn = document.getElementById('more');
    var scroll = {
        status: false,
        btn: document.getElementById('scroll'),
        top: document.getElementById('scroll_to_top'),
        on: function(){
            upload_btn.style.display = "none";
            this.status = true;
            this.btn.innerHTML = "Выключить скролл";
        },
        off: function(){
            upload_btn.style.display = "";
            this.status = false;
            this.btn.innerHTML = "Включить скролл";
        },
        currentPosition : function(){
            return window.pageYOffset 
            || document.documentElement.scrollTop;
        },
        windowHeight : function(){
            return document.documentElement.clientHeight;
        },
        bodyHeight : function(){
            return document.body.offsetHeight;
        },
        //if autoloading mode on, but no scrolling we upload 
        //some blocks until the scrolling appeares
        checkPosition: function(){
            if(this.bodyHeight() < this.windowHeight()){
                //example of using callbacks with context binding
                makeRequest(json_url, this.checkPosition.bind(this));
            }else{
                return;
            }
        },
    
    };
    // add callback for running smth after ajax loaded
    function makeRequest(url, callback) {
        httpRequest = new XMLHttpRequest();
        if (!httpRequest) {
            alert('Cannot create an XMLHTTP instance');
        return false;
        }
        httpRequest.onreadystatechange = function(){
            if (httpRequest.readyState === XMLHttpRequest.DONE) {
                if(httpRequest.status === 200) {
                    getContents(httpRequest.responseText);
                    if(typeof callback == 'function'){
                        callback();
                    }
                } else {
                    alert('There was a problem with the request.');
                }
            }    
        };
        httpRequest.open('GET', url);
        httpRequest.send();
    };

    function getContents(data) {
        var data = JSON.parse(data);
        var tpl = '';
        for(var i in data){
            tpl += '\
            <div class="item"> \
                <img src= "'+ data[i].image+'"> \
                <p class="title">'+ data[i].title +'</p> \
                <div class="descr">' + data[i].paragraph +'</div> \
            </div>';
        }
        document.getElementById("container").innerHTML += tpl;
    };
    
    //change load mode
    scroll.btn.onclick = function() {
      if (scroll.status){
        scroll.off();
      }else{
        scroll.on();
        //check if the scrolling already exists
        scroll.checkPosition();
      }
    };
   
    window.onscroll = function() {

        var currentScroll = scroll.currentPosition();
        var windowHeight = scroll.windowHeight();
        var contentHeight = scroll.bodyHeight();
        //display button "GO UP!"
        scroll.top.style.display = (currentScroll > windowHeight)? "block":"none";
        //if the bottom of the scroll call ajax (autoload mode)
        if((contentHeight - currentScroll == windowHeight) 
           && scroll.status){
            makeRequest(json_url);
        }
    }
    //upload manual mode
    upload_btn.onclick = function(){
        makeRequest(json_url);
    }
    
    //scroll to top
    scroll.top.onclick = function() {
        //start timer recall every 5 ms, scroll offset 20px
        var timer = setInterval(function() {
            var position = scroll.currentPosition();
            if (position == 0) {
                clearInterval(timer);
                return;
            }
            window.scrollTo(0, position - 20);
        }, 5);
        this.style.display = 'none';  
    }
    
})();