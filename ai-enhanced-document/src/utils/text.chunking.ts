import { Entities } from "../interfaces/entities.interface";

export const textChunkingByEntities = (output: string[], entities: Entities) => {
    const entityGroups: { [key: string]: { id: number; text: string }[] } = {};

    const allEntities = [
        ...entities.people,
        ...entities.places,
        ...entities.organizations
    ];

    allEntities.forEach(entity => {
        entityGroups[entity] = [];
    });

    let uniqueId = 0;

    output.map((sentence, id) => {
        allEntities.map(entity => {
            if (sentence.includes(entity)) {
                entityGroups[entity].push({id: uniqueId, text: sentence});
                uniqueId++;
            }
        });
    });

    return entityGroups;
};
