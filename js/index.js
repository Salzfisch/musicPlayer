var currentIndex = 0;
var musicList;
var audio = new Audio();
var clock
audio.autoplay = false;

getMusicList(function(list){
    musicList = list
    setPlaylist(list)
    loadMusic(list[currentIndex])
})

audio.ontimeupdate = function() {
    // console.log(this.currentTime);
    $('.musicBox .progress-now').style.width = (this.currentTime / this.duration) * 100 + '%';
    
}

audio.onplay = function() {
    clock = setInterval(function() {
        var min = Math.floor(audio.currentTime/60);
        var sec = Math.floor(audio.currentTime)%60 + '';
        sec = sec.length === 2 ? sec : '0' + sec;
        $('.musicBox .time').innerText = min + ':' + sec;
    }, 1000)
}
audio.onpause = function() {
    clearInterval(clock)
}
// audio.onplay = function() {
//      clock = setTimeout(function tick() {
//         var min = Math.floor(audio.currentTime/60);
//         var sec = Math.floor(audio.currentTime)%60 + '';
//         sec = sec.length === 2 ? sec : '0' + sec;
//         $('.musicBox .time').innerText = min + ':' + sec;
//         clock = setTimeout(tick, 1000)
//     }, 1000)
// }
// audio.onpause = function() {
//     clearTimeout(clock)
// }

// audio.onplay = function() {
//     clock = setInterval(function() {
//       var min = Math.floor(audio.currentTime/60)
//       var sec = Math.floor(audio.currentTime)%60 + ''
//       sec = sec.length === 2? sec : '0' + sec
//       $('.musicBox .time').innerText = min + ':' + sec
//     }, 1000)
//   }
// audio.onpause = function() {
//     clearInterval(clock)
// }

audio.onended = function() {
    currentIndex = (++currentIndex) % musicList.length
    loadMusic(musicList[currentIndex])
    if(audio.pause) {
        audio.play()
        $('.musicBox .play .fa').classList.remove('fa-play')
        $('.musicBox .play .fa').classList.add('fa-pause')
    }
}

$('.musicBox .play ').addEventListener('click', function() {
    if(audio.paused) {
        audio.play()
        console.log('playing...')
        this.querySelector('.fa').classList.remove('fa-play')
        this.querySelector('.fa').classList.add('fa-pause')
    } else {
        audio.pause()
        console.log('paused')
        this.querySelector('.fa').classList.remove('fa-pause')
        this.querySelector('.fa').classList.add('fa-play')
    }
})

$('.musicBox .forward .fa-step-forward').addEventListener('click', function() {
    currentIndex = ++currentIndex % musicList.length
    // console.log('下一首' + currentIndex)
    loadMusic(musicList[currentIndex])
    if(audio.pause) {
        audio.play()
        console.log('playing')
        $('.musicBox .play .fa').classList.remove('fa-play')
        $('.musicBox .play .fa').classList.add('fa-pause')
    }
    
})

$('.musicBox .back .fa-step-backward').addEventListener('click', function() {
    currentIndex = (musicList.length + --currentIndex) % musicList.length
    // console.log('上一首' + currentIndex)
    loadMusic(musicList[currentIndex])
    if(audio.pause) {
        audio.play()
        console.log('playing')
        $('.musicBox .play .fa').classList.remove('fa-play')
        $('.musicBox .play .fa').classList.add('fa-pause')
    }
})

$('.musicBox .bar').addEventListener('click', function(e) {
    // console.log(e)
    var percent = e.offsetX / parseInt(getComputedStyle(this).width)
    audio.currentTime = audio.duration * percent;
})

$('.musicBox .list').addEventListener('click', function(e) {
    if(e.target.tagName.toLowerCase() === 'li'){
        // console.log(this.children)
        for(var i = 0; i < this.children.length; i++){
            if(this.children[i] === e.target){
                currentIndex = i
            }
        }
    }
    // console.log(currentIndex)
    loadMusic(musicList[currentIndex])
    if(audio.pause) {
        audio.play()
        console.log('playing')
        $('.musicBox .play .fa').classList.remove('fa-play')
        $('.musicBox .play .fa').classList.add('fa-pause')
    }
})

function setPlaylist(musiclist){
    // 从服务器拿取数据，设置歌曲列表
    // console.log(musiclist)
    var container = document.createDocumentFragment()
    musiclist.forEach(function(musicObj){
      var node = document.createElement('li')
      node.innerText = musicObj.title + '-' + musicObj.auther
    //   console.log(node)
      container.appendChild(node)
    })
    $('.musicBox .list').appendChild(container)
  }
function $(selection) {
    return document.querySelector(selection);
}

function getMusicList(callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('get', './music.json', true);
    xhr.onload = function() {
        if(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
            // console.log(JSON.parse(this.responseText));
            callback(JSON.parse(this.responseText))
        } else {
            console.log('获取数据失败');
        }
    }
    xhr.onerror = function() {
        console.log('网络异常');
    }
    xhr.send()
}
function loadMusic(musicObj) {
    // console.log('begin play', musicObj);
    $('.musicBox .title').innerHTML = musicObj.title;
    $('.musicBox .auther').innerHTML = musicObj.auther;
    $('.cover').style.backgroundImage = 'url('+musicObj.img+')'
    audio.src = musicObj.src;
    for(var i = 0; i < $('.musicBox .list').children.length; i++){
        // console.log($('.musicBox .list').children[i])
        $('.musicBox .list').children[i].classList.remove('playing')
      }
    $('.musicBox .list').children[currentIndex].classList.add('playing')
}

