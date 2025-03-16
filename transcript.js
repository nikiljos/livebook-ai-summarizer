import "dotenv/config";
import { lessonSlugs, prefix } from "./config.js";
import { fetchLbLesson, getYtRefsFromLesson } from "./livebook.js";
import { fetchTranscript } from "./subtitle.js";
import { writeFile } from "fs/promises";
import { formatIndex } from "./utils.js";

const getAllVideoTranscriptFromLesson = async (slug, index = "") => {
    const videoIds = await getYtRefsFromLesson(slug);
    if (videoIds.length == 0) {
        console.log("No YT Links:", slug);
        return;
    }
    console.log("Fetching YT subtitle:", slug, videoIds);
    const transcripts = await Promise.all(
        videoIds.map(async (video) => [video, await fetchTranscript(video)])
    );
    await writeFile(
        `./result/tnV-${index}-${slug}.txt`,
        transcripts
            .map((data) => `Video transcript for ${data[0]} → ${data[1]}`)
            .join("\n\n")
    );
};

const getLessonMarkdown = async (slug, index = "") => {
    console.log("Fetching Raw Livebook:", slug);
    const { content } = await fetchLbLesson(slug);

    await writeFile(`./result/tnC-${index}-${slug}.md`, content);
};

let i = 1;
for await (const slug of lessonSlugs) {
    await Promise.allSettled([
        getLessonMarkdown(slug, formatIndex(prefix, i)),
        getAllVideoTranscriptFromLesson(slug, formatIndex(prefix, i)),
    ]);
    i += 1;
}
