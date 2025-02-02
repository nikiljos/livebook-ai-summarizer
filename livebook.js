const livebookApiUrl = process.env.LIVEBOOK_API_URL;

export const getYtRefsFromLesson = async (slug) => {
    const lessonContent = await fetchLbLesson(slug);
    const ytRefs = parseYtRefs(lessonContent.content);

    return ytRefs;
};

const parseYtRefs = (content) => {
    const regex = /<Youtube\s+videoId="([^"]+)"/g;
    let match;
    const videoIds = [];

    while ((match = regex.exec(content)) !== null) {
        videoIds.push(match[1]);
    }

    return videoIds;
};

export const fetchLbLesson = async (slug) => {
    const lessonId = await getIdFromSlug(slug);

    if (!lessonId) {
        console.log("Invalid Slug", slug);
        throw new Error("invalid-slug");
    }

    const lessonData = await fetch(
        `${livebookApiUrl}/api/learning_units/${lessonId}/lessons`
    )
        .then((res) => res.json())
        .then((data) => data.list[0]);

    return lessonData;
};

const getIdFromSlug = async (slug) => {
    const idSlugMap = await fetch(`${livebookApiUrl}/api/learning_units/`).then(
        (res) => res.json()
    );

    const lessonInfo = idSlugMap.list.find((elt) => elt.slug == slug);

    return lessonInfo?.id;
};
