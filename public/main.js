async function fetchArtists() {
    try {
        const response = await fetch('/api/artists');

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const artists = await response.json();
        renderArtists(artists);
    } catch (error) {
        console.error('Error fetching artists', error);
        const container = document.getElementById('artists-section');
        if (container) {
            container.innerHTML = '<p>Error while loading artists.</p>';
        }
    }
}

function renderArtists(artists) {
    const container = document.getElementById('artists-section');
    if (!container) return;

    container.innerHTML = '';

    if (!artists.length) {
        container.innerHTML = '<p>Artists list is empty.</p>';
        return;
    }

    artists.forEach(artist => {
        const card = document.createElement('article');
        card.classList.add('artist-card');

        card.innerHTML = `
            <h3>${artist.name}</h3>
            <p class="artist-id">${artist._id}</p>
            <img src=${artist.imageUrl || ''} alt="${artist.name}'s picture, ${artist.description}" class="artist-img"/>
            <p>${artist.genre || ''}</p>
            <p>${artist.country || ''}</p>
            <p>${artist.description || ''}</p>
            <button type="button" class="delete-btn">Delete</button>
        `;

        const deleteButton = card.querySelector('.delete-btn');
        deleteButton.addEventListener('click', () => {
            deleteArtist(artist._id);
        });

        container.appendChild(card);
    });
}


async function handleArtistFormSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const messageEl = document.getElementById('artist-form-message');

    const name = document.getElementById('artist-name').value.trim();
    const genre = document.getElementById('artist-genre').value.trim();
    const country = document.getElementById('artist-country').value.trim();
    const imageUrl = document.getElementById('artist-image-url').value.trim();
    const description = document.getElementById('artist-description').value.trim();

    if (!name) {
        messageEl.textContent = 'Artist name is required';
        messageEl.style.color = 'red';
        return;
    }

    const newArtist = {
        name,
        genre,
        country,
        imageUrl,
        description,
    };

    try {
        const response = await fetch('/api/artists', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newArtist),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const createdArtist = await response.json();
        console.log('Artist created:', createdArtist);

        messageEl.textContent = `Artist "${createdArtist.name}" successfully created.`;
        messageEl.style.color = 'green';

        form.reset();

        fetchArtists();

    } catch (error) {
    console.error('Error creating artist: ', error);
    messageEl.textContent = 'Error while creating artist. Please check console for details.';
    messageEl.style.color = 'red';
    }
}

async function deleteArtist(artistId) {
    const messageEl = document.getElementById("artist-suppression-message");

    try {
        const response = await fetch(`/api/artists/${artistId}`, {
            method: 'DELETE',
        })
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        messageEl.textContent = `Artist successfully deleted.`;
        messageEl.style.color = 'green';

        fetchArtists();
    } catch (error) {
        console.error('Error deleting artist: ', error);
        messageEl.textContent = 'Error deleting artist. Please check console for details.';
        messageEl.style.color = 'red';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    fetchArtists();

    const artistForm = document.getElementById('artist-form');
    if (artistForm) {
        artistForm.addEventListener('submit', handleArtistFormSubmit);
    }

});

document.addEventListener('DOMContentLoaded', () => {
    fetchArtists();

    const artistToDeleteButton = document.getElementsByClassName("delete-btn");

    if (artistToDeleteButton) {
        artistToDeleteButton.addEventListener('click', () => {
            const artistToDeleteContainer = artistToDeleteButton.parentElement;
            const artistIdParagraph = artistToDeleteContainer.getElementById('artist-id');
            const artistId = parseInt(artistIdParagraph.innerText);
            deleteArtist(artistId);
        })
    }

});