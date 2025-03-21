import OpenAI from "openai";
import { latexMode } from "./config.js";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_KEY,
});

const getAiResponse = async (instruct, content, model = "gpt-4o-mini") => {
    const completion = await openai.chat.completions.create({
        messages: [
            { role: "system", content: instruct },
            { role: "user", content: content },
        ],
        model,
    });

    console.dir(completion.usage, { depth: null });
    return completion.choices[0].message.content;
};

const formatPrompt = latexMode
    ? `
Make sure to follow these formatting instructions while generatin the results:
- Use valid markdown syntax
- All mathematical expressions should use LaTex format and must be wrapped in $(for inline) and $$(for block). e.g. a $\rightarrow$ b
`
    : "";

export const getAiResFromTranscript = (
    transcript,
    type,
    model = "gpt-4o-mini"
) => {
    console.log(type);
    const instruct =
        type == "mcq"
            ? "You are an agent that creates Multiple Choice Questions for a university exam based on a lecture transcript provided. The questions should be solely based on the given transcript. Generate 10-20 MCQ questions along with their answers based on the lesson transcript given. All the answers should have an explanation, along with the relevant sentences from the lecture transcript."
            : "You are an agent that summarizes lecutres and create notes that cover everything covered in the lecture in great detail. These notes should cover all content in a way that it can be used to cram up all the concepts just before the exam." +
              formatPrompt;

    return getAiResponse(instruct, transcript, model);
};

export const getAiResFromContent = (
    content,
    type = "",
    model = "gpt-4o-mini"
) => {
    // TODO: parse yt, images and links with regex and add to end
    const instruct =
        "You are an agent that summarizes a given lesson text and create notes that cover everything covered in the lecture in without missing any detail. These notes should cover all content in a way that it can be used to cram up all the concepts just before the exam." +
        formatPrompt;
    // + " All the Youtube video references, image links and other URLs mentioned in the content must be present in the response along with their respective summaries";

    return getAiResponse(instruct, content, model);
};
