// @flow
import pauseBtn from 'svgs/journalism/in-article-audio-player/btn-pause.svg';
import playBtn from 'svgs/journalism/in-article-audio-player/btn-play.svg';
import { sendToOphan, formatTime } from './utils';
import { monitorPercentPlayed, playerObserved } from './inArticleDataEvents';

// STYLING FUNCTIONS
const setPlayButton = el => {
    el.innerHTML = `<span>${playBtn.markup}</span>`;
};

const setPauseButton = el => {
    el.innerHTML = `<span>${pauseBtn.markup}</span>`;
};

// design hack to give immediate feedback on the progress bar for a play event
const showStarterBlockOnFirstPlay = () => {
    const scrubberBar: ?HTMLElement = document.querySelector(
        '.inline-audio_content_progress-bar'
    );
    if (scrubberBar) scrubberBar.classList.add('started');
};

// PLAYER ACTION FUNCTIONS
const updateProgressBar = percentPlayed => {
    const progressBar: ?HTMLElement = document.querySelector(
        '.inline-audio_content_progress-bar .played'
    );
    if (progressBar) {
        progressBar.style.width = `${percentPlayed}%`;
    }
};

const updateTime = (el: HTMLElement, player) => {
    player.addEventListener('timeupdate', () => {
        el.textContent = formatTime(player.currentTime);
        const percentPlayed = (player.currentTime / player.duration) * 100;
        updateProgressBar(percentPlayed);
    });
};

const activateAudioControls = (el, player, id) => {
    el.addEventListener('click', () => {
        if (player.paused) {
            sendToOphan(id, 'play');
            player.play();
            setPauseButton(el);
            showStarterBlockOnFirstPlay();
        } else {
            player.pause();
            setPlayButton(el);
        }
    });
};

const activateScrubber = (el, player, w) => {
    const d = player.duration;

    el.addEventListener('click', (e: MouseEvent | Touch) => {
        const leftOffset = el.getBoundingClientRect().left;
        const clickX = e.clientX - leftOffset;
        const ratio = clickX / w;
        player.currentTime = ratio * d;
    });
};

const setDuration = (el, player) => {
    el.textContent = formatTime(player.duration);
};

// INITIALISER

const init = () => {
    const player = document.querySelector('audio.inline-audio-player-element');

    if (player && !(player instanceof HTMLMediaElement))
        throw new Error("Expected an 'audio' element.");

    const container: ?HTMLElement = document.querySelector(
        '.inline-audio_container'
    );

    const mediaId: ?string =
        player && player.hasAttribute('data-media-id')
            ? player.getAttribute('data-media-id')
            : '';
    const buttonDiv: ?HTMLElement = document.querySelector(
        '.inline-audio_button'
    );
    const scrubberBar: ?HTMLElement = document.querySelector(
        '.inline-audio_content_progress-bar'
    );
    const timePlayedSpan: ?HTMLElement = document.querySelector(
        '#inline-audio_time-played'
    );
    const durationSpan: ?HTMLElement = document.querySelector(
        '#inline-audio_duration'
    );

    if (
        player &&
        mediaId &&
        buttonDiv &&
        scrubberBar &&
        timePlayedSpan &&
        durationSpan
    ) {
        const barWidth = scrubberBar.offsetWidth;

        playerObserved(container, mediaId);
        activateAudioControls(buttonDiv, player, mediaId);
        setDuration(durationSpan, player);
        updateTime(timePlayedSpan, player);
        activateScrubber(scrubberBar, player, barWidth);

        monitorPercentPlayed(player, 25, mediaId);
        monitorPercentPlayed(player, 50, mediaId);
        monitorPercentPlayed(player, 75, mediaId);
        monitorPercentPlayed(player, 99, mediaId);
    }
};

export { init };
