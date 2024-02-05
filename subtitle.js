import { getSubtitles } from "youtube-captions-scraper";

export const fetchTranscript = async (videoId) => {
    const captionData = await getSubtitles({
        videoID: videoId, // youtube video id
        //   lang: 'fr' // default: `en`
    }).catch((err) => {
        console.log(err);
        return false;
    });

    if (!captionData) {
        return false;
    }

    const transcript = captionData.map((elt) => elt.text).join(" ");

    return transcript;
};
