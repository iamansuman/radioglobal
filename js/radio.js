var db = new Localbase('radio');
var favstations = [];

var nowplaying = {"index": 0, "mode": 'bwr', "name" : stations[0].name, "url": stations[0].url, "country": stations[0].country}
audele.src = stations[0].url;
nply.innerText = stations[0].name;

function listbrowsedstations(){
    browselist.innerHTML = null;
    if (stations.length != 0){
        stations.forEach((e, i) => {
            let li = document.createElement('li');
            let name = document.createElement('span');
            let country = document.createElement('span');

            li.setAttribute('data-name', e.name);
            li.setAttribute('data-nation', e.country);
            li.setAttribute('data-url', e.url);
            li.addEventListener('click', function(e){
                e.stopPropagation();
                e.preventDefault();
                nowplaying.index = i;
                nowplaying.mode = 'bwr';
                nowplaying.name = nply.innerText = li.getAttribute('data-name')
                nowplaying.country = li.getAttribute('data-nation');
                document.title = li.getAttribute('data-name');
                audele.src = nowplaying.url = li.getAttribute('data-url');
                navigator.mediaSession.metadata = new MediaMetadata({
                    title: document.title,
                    artwork: [{ src: '.././img/radio.png', sizes: '512x512', type: 'image/png' }]
                });
                document.getElementsByClassName('btns')[0].children[5].style.display = 'none';
		        document.getElementsByClassName('btns')[0].children[4].style.display = 'block';
                favstations.forEach((ei) => {
                    if (ei.url == li.getAttribute('data-url')) {
                        document.getElementsByClassName('btns')[0].children[4].style.display = 'none';
		                document.getElementsByClassName('btns')[0].children[5].style.display = 'block';
                    }
                });
                play();
            });
            name.textContent = e.name;
            name.classList.add('stname');
            country.classList.add('nations');
            country.textContent = e.country;
            country.style.color = '#ffffff95';
            li.appendChild(name);
            li.appendChild(country);
            li.style.cursor = 'pointer';
            li.style.margin = '5px';
            browselist.appendChild(li);
        });
    } else {
        browselist.innerHTML = "No Stations Found 📶";
    }
}

function listfavdstations(){
    favlist.innerHTML = null;
    if (favstations.length != 0){
        favstations.forEach((e, i) => {
            let li = document.createElement('li');
            let name = document.createElement('span');
            let country = document.createElement('span');

            li.setAttribute('data-name', e.name);
            li.setAttribute('data-nation', e.country);
            li.setAttribute('data-url', e.url);
            li.addEventListener('click', function(e){
                e.stopPropagation();
                e.preventDefault();
                nowplaying.index = i;
                nowplaying.mode = 'fav';
                nowplaying.name = nply.innerText = li.getAttribute('data-name')
                nowplaying.country = li.getAttribute('data-nation');
                document.title = li.getAttribute('data-name');
                audele.src = nowplaying.url = li.getAttribute('data-url');
                navigator.mediaSession.metadata = new MediaMetadata({
                    title: document.title,
                    artwork: [{ src: '.././img/radio.png', sizes: '512x512', type: 'image/png' }]
                });
                document.getElementsByClassName('btns')[0].children[4].style.display = 'none';
		        document.getElementsByClassName('btns')[0].children[5].style.display = 'block';
                play();
            });
            name.textContent = e.name;
            name.classList.add('stname');
            country.classList.add('nations');
            country.textContent = e.country;
            country.style.color = '#ffffff95';
            li.appendChild(name);
            li.appendChild(country);
            li.style.cursor = 'pointer';
            li.style.margin = '5px';
            favlist.appendChild(li);
        });
    } else {
        favlist.innerHTML = "No Favourite Stations Found 📶";
    }
}

function getFavStaions() {
    favstations = [];
    db.collection('favstns').get().then(stn => {
        favstations = stn != undefined ? stn : [];
        setTimeout(() => {listfavdstations()}, 50);
    });
}


getFavStaions();
listbrowsedstations();