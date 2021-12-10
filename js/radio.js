var db = new Localbase('radio');
var nowplaying = {"index": null, "mode": null, "name" : null, "url": null, "country": null};
var stations = [];
var favstations = [];
fetch('./crs-pf/stations.json').then((res) => res.json()).then((result) => stations = result).then(() => {
    getFavStaions();
    listbrowsedstations();
    audele.src = stations[0].url;
    nply.innerText = stations[0].name;
    document.title = stations[0].name;
    nowplaying = { "index": 0, "mode": 'bwr', "name": stations[0].name, "url": stations[0].url, "country": stations[0].country };
});

function listbrowsedstations(){
    browselist.innerHTML = null;
    if (stations.length != 0){
        stations.forEach((station, i) => {
            let li = document.createElement('li');
            let name = document.createElement('span');
            let country = document.createElement('span');

            li.setAttribute('data-name', station.name);
            li.setAttribute('data-nation', station.country);
            li.setAttribute('data-url', station.url);
            li.addEventListener('click', function(e){
                e.stopPropagation();
                e.preventDefault();
                nowplaying.index = i;
                nowplaying.mode = 'bwr';
                nowplaying.name = nply.innerText = li.getAttribute('data-name')
                nowplaying.country = li.getAttribute('data-nation');
                document.title = li.getAttribute('data-name');
                audele.src = nowplaying.url = li.getAttribute('data-url');
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
            name.textContent = station.name;
            name.classList.add('stname');
            country.classList.add('nations');
            country.textContent = station.country;
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
        favstations.forEach((station, i) => {
            let li = document.createElement('li');
            let name = document.createElement('span');
            let country = document.createElement('span');

            li.setAttribute('data-name', station.name);
            li.setAttribute('data-nation', station.country);
            li.setAttribute('data-url', station.url);
            li.addEventListener('click', function(e){
                e.stopPropagation();
                e.preventDefault();
                nowplaying.index = i;
                nowplaying.mode = 'fav';
                nowplaying.name = nply.innerText = li.getAttribute('data-name')
                nowplaying.country = li.getAttribute('data-nation');
                document.title = li.getAttribute('data-name');
                audele.src = nowplaying.url = li.getAttribute('data-url');
                document.getElementsByClassName('btns')[0].children[4].style.display = 'none';
		        document.getElementsByClassName('btns')[0].children[5].style.display = 'block';
                play();
            });
            name.textContent = station.name;
            name.classList.add('stname');
            country.classList.add('nations');
            country.textContent = station.country;
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

function searchStation(query) {
    if (query === "") {
        schlist.innerHTML = "Type Your Query in Search Text Box 🔍";
        return;
    }

    let searchedstations = [];
    for (i = 0; i < stations.length; i++)
        if (String(stations[i].name).toLocaleLowerCase().search(String(query).toLocaleLowerCase()) !== -1 || String(stations[i].country).toLocaleLowerCase().search(String(query).toLocaleLowerCase()) !== -1) searchedstations.push(stations[i]);
    
    schlist.innerHTML = null;
    if (searchedstations.length != 0){
        searchedstations.forEach((station) => {
            let li = document.createElement('li');
            let name = document.createElement('span');
            let country = document.createElement('span');

            li.setAttribute('data-name', station.name);
            li.setAttribute('data-nation', station.country);
            li.setAttribute('data-url', station.url);
            li.addEventListener('click', function(e){
                e.preventDefault();
                e.stopPropagation();
                nowplaying.index = stations.findIndex((stn) => { return stn.url == station.url });
                nowplaying.mode = 'bwr';
                nowplaying.name = nply.innerText = li.getAttribute('data-name')
                nowplaying.country = li.getAttribute('data-nation');
                document.title = li.getAttribute('data-name');
                audele.src = nowplaying.url = li.getAttribute('data-url');
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
            name.textContent = station.name;
            name.classList.add('stname');
            country.classList.add('nations');
            country.textContent = station.country;
            country.style.color = '#ffffff95';
            li.appendChild(name);
            li.appendChild(country);
            li.style.cursor = 'pointer';
            li.style.margin = '5px';
            schlist.appendChild(li);
        });
    } else {
        schlist.innerHTML = "No Stations Found 📶";
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