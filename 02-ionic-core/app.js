fetch('https://devfest-nantes-2018-api.cleverapps.io/blog')
.then(function(response) {
    if(!response.ok) {
        throw Error(response.statusText);
    }

    return response.json();
})
.then(tabObj => {
    html = "";    
    
    tabObj.forEach(objet => {
        html += `<ion-card>
            <ion-card-header>            
                <ion-card-title class="ion-text-center"><strong>${objet.title}</strong></ion-card-title>
            </ion-card-header>

            <ion-card-content class="ion-text-center">
                <img src="https://devfest2018.gdgnantes.com/${objet.image}">
                ${objet.brief}
            </ion-card-content>    
        </ion-card>`        
    });
    $('#Objet').append(html);
})
