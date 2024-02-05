import OpenAI from "openai";
// import "dotenv/config";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_KEY,
});

const getAiResponse = async (instruct, content, model = "gpt-3.5-turbo-16k") => {
    // console.log({ instruct, content, model });
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

export const getAiResFromTranscript = (transcript, type) => {
    console.log(type);
    const instruct =
        type == "mcq"
            ? "Generate 30 MCQ questions along with their answers based on the lesson transcript given."
            : "Identify all the points mentioned in the given lecture along with a detailed sumamry of each point. This should include everythoing covered in the transcript given below.";

    return getAiResponse(instruct, transcript);
};
