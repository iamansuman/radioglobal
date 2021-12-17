const audele = document.getElementById('aud');
const browselist = document.getElementById('allbox');
const favlist = document.getElementById('favbox');
const schlist = document.getElementById('searchbox');
const searchquery = document.getElementById('stn-search-query');
const npl_tit = document.getElementById('nowplaying-title');
const npl_reg = document.getElementById('nowplaying-region');
const npl_coun = document.getElementById('nowplaying-country');
var searchState = false;

function play(){
	if (audele.src != ""){
		audele.play().then(() => { 
			navigator.mediaSession.metadata = new MediaMetadata({
				title: nowplaying.name,
				artist: `${nowplaying.region}, ${nowplaying.country}`,
				artwork: [{ src: '.././img/radiox192.png', sizes: '192x192', type: 'image/png' }, { src: '.././img/radio.png', sizes: '512x512', type: 'image/png' }]
			});
			navigator.mediaSession.setActionHandler('play', play);
			navigator.mediaSession.setActionHandler('pause', pause);
			navigator.mediaSession.setActionHandler('previoustrack', pre);
			navigator.mediaSession.setActionHandler('nexttrack', next);
			navigator.mediaSession.setActionHandler('seekbackward', seekBackward);
			navigator.mediaSession.setActionHandler('seekforward', seekForward);
			navigator.mediaSession.playbackState = "playing";
		})
		document.getElementById('ppc-btn').src = './svg/pause.svg';
	}
}

function pause(){
	document.getElementById('ppc-btn').src = './svg/play.svg';
	audele.pause();
}

function pre() {
	let station = nowplaying.mode == 'bwr' ? stations : favstations ;
	if (nowplaying.index >= 0 && nowplaying.index <= station.length && station.length != 0){
		nowplaying.index = (nowplaying.index - 1 + station.length) % station.length;
		nowplaying.name = document.title = npl_tit.innerText = station[nowplaying.index].name;
		nowplaying.country = station[nowplaying.index].country;
		nowplaying.region = station[nowplaying.index].region;
		audele.src = nowplaying.url = station[nowplaying.index].url;
		play();
	}
}

function next() {
	let station = nowplaying.mode == 'bwr' ? stations : favstations ;
	if (nowplaying.index >= 0 && nowplaying.index <= station.length && station.length != 0){
		nowplaying.index = (nowplaying.index + 1) % station.length;
		nowplaying.name = document.title = npl_tit.innerText = station[nowplaying.index].name;
		nowplaying.country = station[nowplaying.index].country;
		nowplaying.region = station[nowplaying.index].region;
		audele.src = nowplaying.url = station[nowplaying.index].url;
		play();
	}
}

function toggleMute() {
	if (document.getElementById('vol-btn').getAttribute('data-mute') == 'muted') {
		audele.volume = 1;
		document.getElementById('vol-btn').src = './svg/unmuted.svg';
		document.getElementById('vol-btn').setAttribute('data-mute', 'unmuted');
	} else {
		audele.volume = 0;
		document.getElementById('vol-btn').src = './svg/muted.svg';
		document.getElementById('vol-btn').setAttribute('data-mute', 'muted');
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

function toggleFavs() {
	if (document.getElementById('fav-btn').getAttribute('data-fav') == 'notfav' && nowplaying.index != null) {
		db.collection('favstns').add(stations[nowplaying.index]).then(() => {
			document.getElementById('fav-btn').src = './svg/fav.svg';
			document.getElementById('fav-btn').setAttribute('data-fav', 'fav');
			getFavStaions();
		});
	} else if (document.getElementById('fav-btn').getAttribute('data-fav') == 'fav' && nowplaying != null) {
		db.collection('favstns').doc({url: nowplaying.url}).delete().then(() => {
			document.getElementById('fav-btn').src = './svg/notfav.svg';
			document.getElementById('fav-btn').setAttribute('data-fav', 'notfav');
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
	} else if ((searchState && e.key == 'Escape') || (!searchState && (e.key == 's' || e.key == 'S'))) {
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
		document.getElementById('stn-search-query').focus();
		searchState = true;
	}
})