const audele = document.getElementById('aud');
const browselist = document.getElementById('allbox');
const favlist = document.getElementById('favbox');
const schlist = document.getElementById('searchbox');
const searchquery = document.getElementById('stn-search-query');
const nply = document.getElementById('nowplaying');
var searchState = false;

function play(){
	if (audele.src != ""){
		audele.play().then(() => { 
			navigator.mediaSession.metadata = new MediaMetadata({
				title: stations[nowplaying.index].name ?? document.title,
				artist: `${stations[nowplaying.index].region}, ${stations[nowplaying.index].country}`,
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
			pause();
			audele.src = stations[nowplaying.index].url;
			play();
		}
	} else if (nowplaying.mode == 'fav'){
		if (nowplaying.index >= 0 && nowplaying.index <= favstations.length && favstations.length != 0){
			nowplaying.index = (nowplaying.index - 1 + favstations.length) % favstations.length;
			nowplaying.name = document.title = nply.innerText = favstations[nowplaying.index].name;
			pause();
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
			pause();
			audele.src = stations[nowplaying.index].url;
			play();
		}
	} else if (nowplaying.mode == 'fav') {
		if (nowplaying.index >= 0 && nowplaying.index <= favstations.length && favstations.length != 0){
			nowplaying.index = (nowplaying.index + 1) % favstations.length;
			nowplaying.name = document.title = nply.innerText = favstations[nowplaying.index].name;
			pause();
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
	if (document.location.hash == "#fav"){
		document.getElementById('brwbtn').style.backgroundColor = 'rgba(0, 0, 0)';
		document.getElementById('favbtn').style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
	} else {
		document.getElementById('favbtn').style.backgroundColor = 'rgba(0, 0, 0)';
		document.getElementById('brwbtn').style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
	}
}

audele.addEventListener('play', play);
audele.addEventListener('pause', pause);

window.addEventListener('keydown', (e) => {
	if (searchState == false && e.keyCode === 32) {
		e.preventDefault();
		e.stopPropagation();
		audele.paused ? play() : pause();
	} else if (searchState && e.key == 'Escape') {
		e.preventDefault();
		document.getElementById('schBtn').click();
	}
});

document.getElementById('schBtn').addEventListener('click', () => {
	if (searchState) {
		location.hash = 'all';
		searchquery.classList.remove('search-mode');
		searchquery.value = null;
		schlist.innerHTML = "Type Your Query in Search Text Box 🔍";
		searchState = false;
	} else {
		searchquery.classList.add('search-mode');
		location.hash = 'sch';
		searchState = true;
	}
})