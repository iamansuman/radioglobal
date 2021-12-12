var db = new Localbase('radio');
var nowplaying = {"index": null, "mode": null, "name" : null, "url": null, "region": null, "country": null};
var stations = [];
var favstations = [];
fetch('./crs-pf/stations.json').then((res) => res.json()).then((result) => stations = result).then(() => {
    getFavStaions();
    listbrowsedstations();
    nowplaying = { "index": 0, "mode": 'bwr', "name": stations[0].name, "url": stations[0].url, "region": stations[0].region, "country": stations[0].country };
    npl_coun.innerText = nowplaying.country;
    npl_reg.innerText = nowplaying.region;
    npl_tit.innerText = nowplaying.name;
    audele.src = nowplaying.url;
    const USP = new URLSearchParams(location.search);
    USPStation:if (USP.has('station')) {
        let station = stations[parseInt(USP.get('station'))];
        if (!station) break USPStation;
        nowplaying.index = parseInt(USP.get('station'));
        nowplaying.mode = 'bwr';
        nowplaying.country = npl_coun.innerText = station.country;
        npl_reg.innerText = station.region;
        document.title = nowplaying.name = npl_tit.innerText = station.name;
        audele.src = nowplaying.url = station.url;
    }
    setTimeout(() => {
        favstations.forEach((ei) => {
            console.log(ei);
            if (ei.url == nowplaying.url) {
                document.getElementsByClassName('btns')[0].children[0].style.display = 'none';
                document.getElementsByClassName('btns')[0].children[1].style.display = 'block';
            }
        });
    }, 75);
    play();
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
            li.setAttribute('data-region', station.region);
            li.setAttribute('data-url', station.url);
            li.addEventListener('click', function(e){
                e.stopPropagation();
                e.preventDefault();
                nowplaying.index = i;
                nowplaying.mode = 'bwr';
                nowplaying.name = npl_tit.innerText = li.getAttribute('data-name')
                nowplaying.country = npl_coun.innerText = li.getAttribute('data-nation');
                npl_reg.innerText = li.getAttribute('data-region');
                document.title = li.getAttribute('data-name');
                pause();
                audele.src = nowplaying.url = li.getAttribute('data-url');
                document.getElementsByClassName('btns')[0].children[1].style.display = 'none';
		        document.getElementsByClassName('btns')[0].children[0].style.display = 'block';
                favstations.forEach((ei) => {
                    if (ei.url == li.getAttribute('data-url')) {
                        document.getElementsByClassName('btns')[0].children[0].style.display = 'none';
		                document.getElementsByClassName('btns')[0].children[1].style.display = 'block';
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
        browselist.innerHTML = "<center>No Stations Found 📶</center>";
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
            li.setAttribute('data-region', station.region);
            li.setAttribute('data-url', station.url);
            li.addEventListener('click', function(e){
                e.stopPropagation();
                e.preventDefault();
                nowplaying.index = i;
                nowplaying.mode = 'fav';
                nowplaying.name = npl_tit.innerText = li.getAttribute('data-name')
                nowplaying.country = npl_coun.innerText = li.getAttribute('data-nation');
                npl_reg.innerText = li.getAttribute('data-region');
                document.title = li.getAttribute('data-name');
                pause();
                audele.src = nowplaying.url = li.getAttribute('data-url');
                document.getElementsByClassName('btns')[0].children[0].style.display = 'none';
		        document.getElementsByClassName('btns')[0].children[1].style.display = 'block';
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
        favlist.innerHTML = "<center>No Favourite Stations Found 📶</center>";
    }
}

function searchStation(query) {
    if (query === "") {
        schlist.innerHTML = "<center>Type Your Query in Search Text Box 🔍</center>";
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
            li.setAttribute('data-region', station.region);
            li.setAttribute('data-url', station.url);
            li.addEventListener('click', function(e){
                e.preventDefault();
                e.stopPropagation();
                nowplaying.index = stations.findIndex((stn) => { return stn.url == station.url });
                nowplaying.mode = 'bwr';
                nowplaying.name = npl_tit.innerText = li.getAttribute('data-name')
                nowplaying.country = npl_coun.innerText = li.getAttribute('data-nation');
                npl_reg.innerText = li.getAttribute('data-region');
                document.title = li.getAttribute('data-name');
                audele.src = nowplaying.url = li.getAttribute('data-url');
                document.getElementsByClassName('btns')[0].children[1].style.display = 'none';
                document.getElementsByClassName('btns')[0].children[0].style.display = 'block';
                favstations.forEach((ei) => {
                    if (ei.url == li.getAttribute('data-url')) {
                        document.getElementsByClassName('btns')[0].children[0].style.display = 'none';
                        document.getElementsByClassName('btns')[0].children[1].style.display = 'block';
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
        schlist.innerHTML = "<center>No Stations Found 📶</center>";
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