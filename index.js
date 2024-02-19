import "dotenv/config";
import { fetchTranscript } from "./subtitle.js";
import { writeFile } from "fs/promises";
import { getYtRefsFromLesson } from "./livebook.js";
import { getAiResFromTranscript } from "./ai.js";

// const lessonSlug = "os_m1_operating_system_structure_services";
// const lessonSlug = "os_m1_fundamentals_of_computer_systems";

// const lessonSlugs = [
//     "os_m1_intro_to_os",
//     "os_m1_operating_system_structure_services",
//     "os_m1_interacting_with_os",
//     "os_m1_system_calls_programs",
//     "os_m1_design_implementation_structures",
// ];

// const lessonSlugs = [
//     "os_m2_intro_to_processes",
//     "os_m2_operation_on_processes",
//     "os_m2_interprocess_communication",
//     "os_m2_shared_memory_message_passing_systems",
//     "os_m2_remote_procedure_calls",
//     "os_m2_intro_to_threads",
//     "os_m2_multithreading_models_hyperthreading",
//     "os_m2_issues_in_threading",
// ];

const lessonSlugs = [
    "os_m3_intro_to_CPU_scheduling",
    "OS_fcfs_concept_assignment",
    "OS_sjf_concept_assignment",
    "OS_priority_concept_assignment",
    "OS_RR_concept_assignment",
];

const getAllTranscriptFromLesson = async (slug, index = "") => {
    const videoIds = await getYtRefsFromLesson(slug);
    const transcripts = await Promise.all(
        videoIds.map(async (video) => await fetchTranscript(video))
    );
    await writeFile(`./result/${index}-${slug}.txt`, transcripts.join("\n\n\n\n"));
};

const getAllMcqFromLesson = async (slug, index = "") => {
    console.log(slug);
    const videoIds = (await getYtRefsFromLesson(slug))
    // .slice(0,1);
    // const transcripts = await Promise.all(
    //     videoIds.map(async (video) => await fetchTranscript(video))
    // );

    const result = [];
    for await (const video of videoIds) {
        console.log(video);
        const transcript = await fetchTranscript(video);
        if (!transcript) {
            console.log("No transcript", video);
            result.push("No transcript found for " + video);
            continue;
        }
        const aiMcq = `### MCQ\n` + (await getAiResFromTranscript(transcript, "mcq","gpt-3.5-turbo"));
        // const aiSum = `### Summary\n` + (await getAiResFromTranscript(transcript, "summary"));
        result.push([aiMcq].join("\n\n" + "*".repeat(25) + "\n\n"));
    }

    const textResult =
        `# ${slug}\n\n## Video IDs \n${videoIds
            .map((vid) => `- [${vid}](https://youtu.be/${vid})`)
            .join("\n")}\n\n` +
        result
            .join("\n\n\n" + "-".repeat(50) + "\n\n\n")
            .split("\n")
            .map((line) => line + "  ")
            .join("\n");
    await writeFile(`./result/ai-${index}-${slug}.md`, textResult);
};

// const transcript = await fetchTranscript(videoId);
// await getAllTranscriptFromLesson(lessonSlug);

let i = 0;
let indexOffset = 0;
for await (const slug of lessonSlugs) {
    await getAllMcqFromLesson(slug, "m3-mcq-" + (i + indexOffset));
    i += 1;
}
