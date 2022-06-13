function countDown() {
    var timeleft = 3;
    var downloadTimer = setInterval(function(){
      if(timeleft <= 0){
        clearInterval(downloadTimer);
        document.getElementById("gamestart").innerHTML = "START!!!";
      } else {
        document.getElementById("gamestart").innerHTML = timeleft + " !!!";
      }
      timeleft -= 1;
    }, 1000);
} 