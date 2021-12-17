const db = new Localbase('radio');
const nowplaying = {"index": null, "mode": null, "name" : null, "url": null, "region": null, "country": null};
const stations = [];
const favstations = [];
fetch('./crs-pf/stations.json').then((res) => res.json()).then((result) => { result.forEach(stn => stations.push(stn)) }).then(() => {
    getFavStaions();
    listbrowsedstations();
    changeNowPlayingTo({ "index": 0, "mode": 'bwr', "name": stations[0].name, "url": stations[0].url, "region": stations[0].region, "country": stations[0].country });
    npl_coun.innerText = nowplaying.country;
    npl_reg.innerText = nowplaying.region;
    npl_tit.innerText = nowplaying.name;
    audele.src = nowplaying.url;
    const USP = new URLSearchParams(location.search);
    USPStation:if (USP.has('station')) {
        let station = stations[parseInt(USP.get('station'))];
        if (!station) break USPStation;
        changeNowPlayingTo({ "index": parseInt(USP.get('station')), "mode": 'bwr', "name": station.name, "url": station.url, "region": station.region, "country": station.country });
        npl_reg.innerText = station.region;
        document.title = npl_tit.innerText = station.name;
        audele.src = station.url;
    }
    setTimeout(() => {
        favstations.forEach((ei) => {
            if (ei.url == nowplaying.url) {
                document.getElementById('fav-btn').src = './svg/fav.svg';
                document.getElementById('fav-btn').setAttribute('data-fav', 'fav');
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
                changeNowPlayingTo({ "index": i, "mode": 'bwr', "name": li.getAttribute('data-name'), "url": li.getAttribute('data-url'), "region": li.getAttribute('data-region'), "country": li.getAttribute('data-nation') });
                npl_tit.innerText = li.getAttribute('data-name')
                npl_coun.innerText = li.getAttribute('data-nation');
                npl_reg.innerText = li.getAttribute('data-region');
                document.title = li.getAttribute('data-name');
                audele.src = li.getAttribute('data-url');
                document.getElementById('fav-btn').setAttribute('data-fav', 'notfav');
                document.getElementById('fav-btn').src = './svg/notfav.svg';
                favstations.forEach((ei) => {
                    if (ei.url == li.getAttribute('data-url')) {
                        document.getElementById('fav-btn').src = './svg/fav.svg';
                        document.getElementById('fav-btn').setAttribute('data-fav', 'fav');
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
                changeNowPlayingTo({ "index": i, "mode": 'fav', "name": li.getAttribute('data-name'), "url": li.getAttribute('data-url'), "region": li.getAttribute('data-region'), "country": li.getAttribute('data-nation') });
                npl_tit.innerText = li.getAttribute('data-name')
                npl_coun.innerText = li.getAttribute('data-nation');
                npl_reg.innerText = li.getAttribute('data-region');
                document.title = li.getAttribute('data-name');
                audele.src = li.getAttribute('data-url');
                document.getElementById('fav-btn').src = './svg/fav.svg';
                document.getElementById('fav-btn').setAttribute('data-fav', 'fav');
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
                changeNowPlayingTo({ "index": stations.findIndex((stn) => { return stn.url == station.url }), "mode": 'bwr', "name": li.getAttribute('data-name'), "url": li.getAttribute('data-url'), "region": li.getAttribute('data-region'), "country": li.getAttribute('data-nation') });
                
                npl_tit.innerText = li.getAttribute('data-name')
                npl_coun.innerText = li.getAttribute('data-nation');
                npl_reg.innerText = li.getAttribute('data-region');
                document.title = li.getAttribute('data-name');
                audele.src = li.getAttribute('data-url');
                document.getElementById('fav-btn').src = './svg/notfav.svg';
                document.getElementById('fav-btn').setAttribute('data-fav', 'notfav');
                favstations.forEach((ei) => {
                    if (ei.url == li.getAttribute('data-url')) {
                        document.getElementById('fav-btn').src = './svg/fav.svg';
                        document.getElementById('fav-btn').setAttribute('data-fav', 'fav');
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
    db.collection('favstns').get().then(stns => {
        favstations.length = 0;
        stns.forEach(stn => favstations.push(stn));
        setTimeout(() => {listfavdstations()}, 50);
    });
}

function changeNowPlayingTo(stnObj) {
    nowplaying.name = stnObj.name ?? 'N/A';
    nowplaying.url = stnObj.url ?? new Error('Specify URL');
    nowplaying.index = stnObj.index ?? 0;
    nowplaying.mode = stnObj.mode ?? 'bwr';
    nowplaying.country = stnObj.country ?? 'N/A';
    nowplaying.region = stnObj.region ?? 'N/A';
}

getFavStaions();
listbrowsedstations();