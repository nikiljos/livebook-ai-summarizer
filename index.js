import "dotenv/config";
import { fetchTranscript } from "./subtitle.js";
import { writeFile } from "fs/promises";
import { fetchLbLesson, getYtRefsFromLesson } from "./livebook.js";
import { getAiResFromContent, getAiResFromTranscript } from "./ai.js";

// const lessonSlug = "os_m1_operating_system_structure_services";
// const lessonSlug = "os_m1_fundamentals_of_computer_systems";
// "ttct_choice" -> test case for yt and content mix

const lessonSlugs = [
    "structure_sign_languages",
    "internet_slang_memes",
    "language_preservation_technology",
];
const prefix = "demo1-";

const getAllTranscriptFromLesson = async (slug, index = "") => {
    const videoIds = await getYtRefsFromLesson(slug);
    const transcripts = await Promise.all(
        videoIds.map(async (video) => await fetchTranscript(video))
    );
    await writeFile(
        `./result/${index}-${slug}.txt`,
        transcripts.join("\n\n\n\n")
    );
};

const getVideoSummaryFromLesson = async (slug, index = "") => {
    console.log("Video Summary:", slug);
    const videoIds = await getYtRefsFromLesson(slug);

    const result = [];
    for await (const video of videoIds) {
        console.log(video);
        const transcript = await fetchTranscript(video);
        if (!transcript) {
            console.log("No transcript", video);
            result.push("No transcript found for " + video);
            continue;
        }
        // const aiMcq =
        // `### MCQ\n` + (await getAiResFromTranscript(transcript, "mcq", "gpt-3.5-turbo"));
        const aiSum =
            `### Summary\n` +
            (await getAiResFromTranscript(transcript, "summary"));
        result.push([aiSum].join("\n\n" + "*".repeat(25) + "\n\n"));
    }

    const textResult =
        `# ${slug}\n\n[**Livebook**](https://kalvium.community/livebooks?lu=${slug})\n\n## Video IDs \n${videoIds
            .map((vid) => `- [${vid}](https://youtu.be/${vid})`)
            .join("\n")}\n\n` +
        result
            .join("\n\n\n" + "-".repeat(50) + "\n\n\n")
            .split("\n")
            .map((line) => line + "  ")
            .join("\n");
    await writeFile(`./result/aiV-${index}-${slug}.md`, textResult);
};

const getSummaryFromLesson = async (slug, index = "") => {
    console.log("Content Summary:", slug);
    const content = await fetchLbLesson(slug);
    const summary = await getAiResFromContent(content.content);
    const textResult = `# ${slug}\n\n[**Livebook**](https://kalvium.community/livebooks?lu=${slug})\n\n${summary}`;
    await writeFile(`./result/aiC-${index}-${slug}.md`, textResult);
};

// ------- Driver Code --------
let i = 1;
for await (const slug of lessonSlugs) {
    await Promise.allSettled([
        getVideoSummaryFromLesson(slug, prefix + i),
        getSummaryFromLesson(slug, prefix + i),
    ]);
    i += 1;
}
