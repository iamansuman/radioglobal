var audele = document.getElementById('aud');
var browselist = document.getElementById('allbox');
var favlist = document.getElementById('favbox');
var nply = document.getElementById('nowplaying');



function play(){
	if (audele.src != ""){
		audele.play().then(() => { 
			navigator.mediaSession.metadata = new MediaMetadata({
				title: stations[nowplaying.index].name,
				artwork: [{ src: '.././img/radio.png', sizes: '512x512', type: 'image/png' }]
			});
			navigator.mediaSession.setActionHandler('play', play);
			navigator.mediaSession.setActionHandler('pause', pause);
			navigator.mediaSession.setActionHandler('previoustrack', pre);
			navigator.mediaSession.setActionHandler('nexttrack', next);
			navigator.mediaSession.setActionHandler('seekbackward', seekBackward);
			navigator.mediaSession.setActionHandler('seekforward', seekForward);
		})
		document.getElementsByClassName('btns')[0].children[2].style.display = 'block';
		document.getElementsByClassName('btns')[0].children[1].style.display = 'none';
	}
}

function pause(){
	document.getElementsByClassName('btns')[0].children[1].style.display = 'block';
	document.getElementsByClassName('btns')[0].children[2].style.display = 'none';
	audele.pause();
}

function pre(){
	if (nowplaying.mode == 'bwr'){
		if (nowplaying.index >= 0 && nowplaying.index <= stations.length && stations.length != 0){
			nowplaying.index = (nowplaying.index - 1 + stations.length) % stations.length;
			nowplaying.name = document.title = nply.innerText = stations[nowplaying.index].name;
			audele.src = stations[nowplaying.index].url;
			play();
		}
	} else if (nowplaying.mode == 'fav'){
		if (nowplaying.index >= 0 && nowplaying.index <= favstations.length && favstations.length != 0){
			nowplaying.index = (nowplaying.index - 1 + favstations.length) % favstations.length;
			nowplaying.name = document.title = nply.innerText = favstations[nowplaying.index].name;
			audele.src = favstations[nowplaying.index].url;
			play();
		}
	}
}

function next(){
	if (nowplaying.mode == 'bwr'){
		if (nowplaying.index >= 0 && nowplaying.index <= stations.length && stations.length != 0){
			nowplaying.index = (nowplaying.index + 1) % stations.length;
			nowplaying.name = document.title = nply.innerText = stations[nowplaying.index].name;
			audele.src = stations[nowplaying.index].url;
			play();
		}
	} else if (nowplaying.mode == 'fav') {
		if (nowplaying.index >= 0 && nowplaying.index <= favstations.length && favstations.length != 0){
			nowplaying.index = (nowplaying.index + 1) % favstations.length;
			nowplaying.name = document.title = nply.innerText = favstations[nowplaying.index].name;
			audele.src = favstations[nowplaying.index].url;
			play();
		}
	}
}

function seekForward() {
	const skipTime = arguments[0] ?? 10;
	audele.currentTime = Math.min(audele.currentTime + skipTime, audele.duration);
}

function seekBackward() {
	const skipTime = arguments[0] ?? 10;
	audele.currentTime = Math.max(audele.currentTime - skipTime, 0);
}

function fav(){
	if (nowplaying.index != null){
		db.collection('favstns').add(stations[nowplaying.index]).then(() => {
			document.getElementsByClassName('btns')[0].children[4].style.display = 'none';
			document.getElementsByClassName('btns')[0].children[5].style.display = 'block';
			getFavStaions();
		});
	}
}

function rmfav(){
	if (nowplaying != null){
		db.collection('favstns').doc({url: nowplaying.url}).delete().then(() => {
			document.getElementsByClassName('btns')[0].children[5].style.display = 'none';
			document.getElementsByClassName('btns')[0].children[4].style.display = 'block';
			getFavStaions();
		});
		nowplaying.mode = 'bwr';
		let i;
		stations.forEach((element, index) => {
			i = element.url == nowplaying.url ? index : 0 ;
		});
		nowplaying.index = i;
	}
}

function changeindicator(){
	document.getElementById('brwbtn').style.backgroundColor = 'rgba(0, 0, 0)';
	document.getElementById('favbtn').style.backgroundColor = 'rgba(0, 0, 0)';
	if (document.location.hash == "#fav"){
		document.getElementsByClassName('indicator')[0].innerText = "Favorites";
	} else {
		document.getElementsByClassName('indicator')[0].innerText = "Browse";
	}
}

function changeindicatormobile(){
	if (document.location.hash == "#fav"){
		document.getElementById('brwbtn').style.backgroundColor = 'rgba(0, 0, 0)';
		document.getElementById('favbtn').style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
	} else {
		document.getElementById('favbtn').style.backgroundColor = 'rgba(0, 0, 0)';
		document.getElementById('brwbtn').style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
	}
}

window.addEventListener('resize', (e) => {
	e.preventDefault();
	innerWidth >= 600 ? changeindicator() : changeindicatormobile();
})

audele.addEventListener('play', e => {play()});
audele.addEventListener('pause', e => {pause()});

window.addEventListener('keydown', (e) => {
	if (e.keyCode === 32) {
		e.preventDefault();
		e.stopPropagation();
		audele.paused ? play() : pause();
	}
});

document.getElementById('stn-search-query').addEventListener('keyup', (e) => {
	e.preventDefault();
	console.log(e.key);
});