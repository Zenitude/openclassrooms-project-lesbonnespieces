import { sendNewCommentary, displayComments, previewComments } from './avis.js';

const fiches = document.querySelector('.fiches');
const buttonsFilter = document.querySelectorAll('.filters button');
const buttonUpdate = document.querySelector('.btn-update');

let pieces = window.localStorage.getItem("pieces");

if(pieces === null) {
    const response = await fetch('http://localhost:8081/pieces/');
    pieces = await response.json();

    const valeurPieces = JSON.stringify(pieces);
    window.localStorage.setItem("pieces", valeurPieces);
} else {
    pieces = JSON.parse(pieces);
}

sendNewCommentary()
previewComments()

/* name affordable pieces */
const affordable = pieces.map(piece => piece.nom);

for(let i = pieces.length -1 ; i >= 0 ; i-- ) {
    if(pieces[i].prix > 35) { affordable.splice(i,1); }
}

const affordablePieces = affordable.map(nom => `<li>${nom}</li>`);

/* Available pieces */
const available = pieces.filter(piece => piece.disponibilite === true)
const availablePieces = available.map(piece => `<li>${piece.nom} - ${piece.prix} €</li>`);

const detailsPieces = document.createElement('aside');
detailsPieces.setAttribute('class', 'affordables');

detailsPieces.innerHTML = 
`<p><strong>Pièces abordables :</strong></p>
<ul>
${affordablePieces.join('')}
</ul>
<br>
<p><strong>Pièces disponibles :</strong></p>
<ul>
${availablePieces.join('')}
</ul>`;

fiches.appendChild(detailsPieces);
const range = document.querySelector('[type="range"]');

filterbyPrice(pieces);

/* Filter buttons */
buttonsFilter.forEach(button => {
    button.addEventListener('click', (e) => {
        switch(e.target.classList.value) {
            case 'btn-all-pieces' : 
                pieces.sort((a, b) => a.id - b.id);
                filterbyPrice(pieces);
                break;
            case 'btn-trier-asc' : 
                pieces.sort((a, b) => a.prix - b.prix);
                filterbyPrice(pieces);
                break;

            case 'btn-trier-desc' :
                pieces.sort((a, b) => b.prix - a.prix);
                filterbyPrice(pieces);
                break;

            case 'btn-filtrer' : 
                const piecesFiltreesPrix = pieces.filter(piece => piece.prix <= 35);
                filterbyPrice(piecesFiltreesPrix);
                break;

            case 'btn-filtrer-desc' : 
                const piecesFiltreesDesc = pieces.filter(piece => piece.description !== undefined);
                filterbyPrice(piecesFiltreesDesc);
                break;
        }
    });
});

/* Pieces */
function displayPieces(pieces)
{
    if(document.querySelectorAll('.piece')) { document.querySelectorAll('.piece').forEach(el => el.remove()); }

    pieces.forEach(element => {
        const piece = document.createElement('article');
        piece.dataset.id = element.id;
        const id = piece.dataset.id;
        piece.setAttribute('class', 'piece');
        
        piece.innerHTML = 
        `<img src="${element.image}">
        <div class="infos">
            <h2>${element.nom}</h2>
            <p>${element.prix} € (${element.prix < 35 ? '€' : "€€€"})</p>
            <p>${element.categorie ?? "Aucune catégorie"}</p>
            <p>${element.description ?? "Pas de description pour le moment."}</p>
            <p>${element.disponibilite ? 'En stock' : 'Rupture de stock'}</p>
            <button data-id="${element.id}">Afficher les avis</button>
        </div>`;
    
        fiches.appendChild(piece);
        const commentsJSON = window.localStorage.getItem(`commentary-piece-${id}`);
        const comments = JSON.parse(commentsJSON);
        if(comments !== null) {
            displayComments(piece, comments);
        }
    });

    // displayCommentary();
}

function filterbyPrice(pieces) {
    displayPieces(pieces);
   
    range.addEventListener('input', (e) => {
        document.querySelector('.value').innerHTML = `${e.target.value} €`;
        const filterPrice = pieces.filter(piece => piece.prix <= e.target.value);
        displayPieces(filterPrice);
        
    });
}

buttonUpdate.addEventListener('click', () => {
    window.localStorage.removeItem("pieces");
});