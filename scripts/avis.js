/* global Chart */
export function displayCommentary() {

    const buttonsAvis = document.querySelectorAll(".fiches article button");

    buttonsAvis.forEach(button => {
        button.addEventListener("click", async function (event) {
            const id = event.target.dataset.id;
            const infosPiece = event.target.parentElement;
            
            let comments = window.localStorage.getItem("comments");

            if(comments === null) {
                const response = await fetch(`http://localhost:8081/pieces/${id}/avis`);
                comments = await response.json();
                window.localStorage.setItem(`commentary-piece-${id}`, JSON.stringify(comments));
            } else {
                comments = JSON.parse(comments);
            }

            displayComments(infosPiece, comments);
             
        });
    });
}

export function displayComments(pieceElement, comments) {
    comments.forEach(com => {
        const commentElement = document.createElement("p");
        commentElement.innerHTML += `<b>${com.user}:</b> ${com.commentary} (${com.nbStars} étoiles) <br><br>`;
        pieceElement.appendChild(commentElement);
    });    
}

export function sendNewCommentary() {
    const CommentForm = document.querySelector(".form-coms");

    CommentForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const comments = {
            pieceId: parseInt(event.target.querySelector("[name=piece-id]").value),
            user: event.target.querySelector("[name=user").value,
            commentary: event.target.querySelector("[name=commentary]").value,
            nbStars: parseInt(event.target.querySelector("[name=nbStars]").value),
        };

        const chargeUtile = JSON.stringify(comments);

        fetch("http://localhost:8081/avis", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: chargeUtile
        });
    });
}
 

export async function previewComments() {
    const pieces = await fetch("http://localhost:8081/pieces").then(res => res.json());
        
    // console.log(comments)
    const namesPieces = [];
    const nb_comments = [];
    const nb_stars = [];
    const avgStars = [];

    for(let i = 0 ; i < pieces.length ; i++)
    {
        namesPieces.push(pieces[i].nom);
        const infospieces = await fetch(`http://localhost:8081/pieces/${pieces[i].id}/avis`).then(res => res.json());
        nb_comments[i] = 0;
        nb_stars[i] = 0;
        
        infospieces.forEach(infos => {
            if(infos.pieceId === pieces[i].id) {
                nb_comments[i] += 1;
                nb_stars[i] += parseInt(infos.nbStars);
            }
        });
    }

    for(let i = 0 ; i < nb_comments.length ; i++) {
        avgStars.push((nb_stars[i] / nb_comments[i]).toFixed(2));
    }

    console.log(avgStars);

    const data = {
        labels: namesPieces,
        datasets: [{
            label: "Moyenne d'étoiles attribuées",
            data: avgStars,
            backgroundColor: "rgba(255, 230, 0, 1)" // couleur jaune
        }],
    };

    /* Preview comments */
    const graph = new Chart(
        document.getElementById("graph-comments"), 
        {
            type: "bar",
            data: data,
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        }
    );
}