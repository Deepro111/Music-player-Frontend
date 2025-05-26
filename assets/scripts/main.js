// console.log("HEY We are here")
// let currentAudio = new Audio();

// //function to convert seconds into minutes
// function convertSecondsToMinutes(seconds) {
//     // Round down the seconds to ensure no fractions
//     seconds = Math.floor(seconds);

//     const minutes = Math.floor(seconds / 60);
//     const remainingSeconds = seconds % 60;

//     // Ensure two digits for both minutes and seconds
//     const formattedMinutes = minutes.toString().padStart(2, '0');
//     const formattedSeconds = remainingSeconds.toString().padStart(2, '0');

//     return `${formattedMinutes}:${formattedSeconds}`;
// }

// // URL of the API endpoint
// const apiUrl = 'https://mysongapit.onrender.com/api/songs';
// );


// // Function to fetch data
// async function fetchData() {
//     try {
//         // Send GET request
//         const response = await fetch(apiUrl);
//         console.log(response);
        
//         // Check if the request was successful
//         if (!response.ok) {
//             throw new Error(`HTTP error! Status: ${response.status}`);
//         }

//         // Parse the JSON data
//         const songData = await response.json();
//         playSong(songData);

//         // Process and log the data
//         console.log(songData);  // Corrected this line
//     } catch (error) {
//         console.error('Error fetching data:', error);
//     }
// }

// // Call the function to fetch data
// fetchData();


// const playMusic = (track, title, artist, pause=false) => {

//     currentAudio.src = track;
//     if(!pause){
//         currentAudio.play();
//         play.className = "bi bi-pause-circle-fill";
//     }
    
//     document.querySelector(".songName").innerHTML = title+`<p>${artist}</p>`
//     document.querySelector(".songTime").innerHTML = "00:00 / 00:00"

// };

// function playSong(songData) {
//     let playList = document.querySelector(".playlist");
//     playList.innerHTML = '';  // Clear existing content
    
//     playMusic(songData[0].url, songData[0].song, songData[0].artist, true);
//     // Loop through the song data and create playlist items
//     songData.forEach(song => {
//         let listItem = document.createElement('li');
//         listItem.classList.add('library-card');

//         // Create inner HTML for the list item
//         listItem.innerHTML = `
//             <div class="library-card-wrap">
//                 <div class="song-icon">
//                     <img src=${song.image} class="songImg">
//                 </div>
//                 <div class="song-details">
//                     <p>${song.song}</p>
//                     <p>${song.artist}</p>
//                 </div>
//             </div>
//             <div class="play-song">
//                 <i class="bi bi-play-circle"></i>
//             </div>
//         `;

//         // Append the list item to the playlist
//         playList.appendChild(listItem);

//         // Add click event listener to play the song
//         listItem.addEventListener('click', () => {
//             playMusic(song.songlink, song.title, song.artist);  // Play selected song and stop previous one
//         });

//         //  const play = document.getElementById("play");
//         // console.log(play);


//     });

//     // const play = document.getElementById("play");

//     play.addEventListener('click', () => {
//         console.log(currentAudio);
//         if (currentAudio.paused) {
//             currentAudio.play()
//             play.className = "bi bi-pause-circle-fill";
//         }
//         else {
//             currentAudio.pause();
//             play.className = "bi bi-play-circle-fill"
//         }
//     });

//     currentAudio.addEventListener('timeupdate', ()=>{
//         console.log(currentAudio.currentTime);
//         document.querySelector(".songTime").innerHTML = `${convertSecondsToMinutes(currentAudio.currentTime)} / ${convertSecondsToMinutes(currentAudio.duration)}`
        
//         document.querySelector(".circle").style.left = (currentAudio.currentTime / currentAudio.duration)*100+"%"
        
//     })


// }
































console.log("HEY We are here");

let currentAudio = new Audio();

// Function to convert seconds into MM:SS format
function convertSecondsToMinutes(seconds) {
    seconds = Math.floor(seconds);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// URL of the API endpoint
const apiUrl = 'https://mysongapit.onrender.com/api/songs';

// Function to fetch song data
async function fetchData() {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const songData = await response.json();
        console.log(songData);
        playSong(songData);

    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Call fetchData on load
fetchData();

// Function to play a specific music track
function playMusic(trackUrl, title, artist, pause = false) {
    currentAudio.src = trackUrl;
    if (!pause) {
        currentAudio.play();
        play.className = "bi bi-pause-circle-fill";
    }

    document.querySelector(".songName").innerHTML = `${title}<p>${artist}</p>`;
    document.querySelector(".songTime").innerHTML = "00:00 / 00:00";
}

// Function to build and control the song playlist
function playSong(songData) {
    let playList = document.querySelector(".playlist");
    playList.innerHTML = ''; // Clear previous list

    // Play the first song by default but paused
    playMusic(songData[0].url, songData[0].song, songData[0].artist, true);

    songData.forEach(song => {
        let listItem = document.createElement('li');
        listItem.classList.add('library-card');

        listItem.innerHTML = `
            <div class="library-card-wrap">
                <div class="song-icon">
                    <img src="${song.image}" class="songImg">
                </div>
                <div class="song-details">
                    <p>${song.song}</p>
                    <p>${song.artist}</p>
                </div>
            </div>
            <div class="play-song">
                <i class="bi bi-play-circle"></i>
            </div>
        `;

        // Play selected song on click
        listItem.addEventListener('click', () => {
            playMusic(song.url, song.song, song.artist);
        });

        playList.appendChild(listItem);
    });

    const play = document.getElementById("play");

    if (play) {
        play.addEventListener('click', () => {
            if (currentAudio.paused) {
                currentAudio.play();
                play.className = "bi bi-pause-circle-fill";
            } else {
                currentAudio.pause();
                play.className = "bi bi-play-circle-fill";
            }
        });
    }

    currentAudio.addEventListener('timeupdate', () => {
        const current = convertSecondsToMinutes(currentAudio.currentTime);
        const total = convertSecondsToMinutes(currentAudio.duration || 0);
        document.querySelector(".songTime").innerHTML = `${current} / ${total}`;

        const progress = (currentAudio.currentTime / currentAudio.duration) * 100;
        document.querySelector(".circle").style.left = `${progress || 0}%`;
    });
}


