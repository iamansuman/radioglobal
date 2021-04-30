var favstations = []

var nowplaying = {"index": 0, "mode": 'bwr', "name" : null, "url": null, "country": null}

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
                document.title = li.getAttribute('data-name');
                audele.src = nowplaying.url = li.getAttribute('data-url');
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

            li.setAttribute('data-name', e.name);
            li.setAttribute('data-url', e.url);
            li.addEventListener('click', function(e){
                e.stopPropagation();
                e.preventDefault();
                nowplaying.index = i;
                nowplaying.mode = 'fav';
                nowplaying.name = nply.innerText = li.getAttribute('data-name')
                audele.src = nowplaying.url = li.getAttribute('data-url');
                play();
            });
            li.textContent = e.name;
            name.classList.add('stname');
            country.classList.add('nations');
            li.style.cursor = 'pointer';
            li.style.margin = '5px';
            favlist.appendChild(li);
        });
    } else {
        favlist.innerHTML = "No Favourite Stations Found 📶";
    }
}

listbrowsedstations();
listfavdstations();