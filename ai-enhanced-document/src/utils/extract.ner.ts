import compromise from "compromise";
import { Entities } from "../interfaces/entities.interface";

export const extractEntities = (text: string) => {
    const doc = compromise(text);
    const entities: Entities = {
        people: doc.people().out('array'),
        places: doc.places().out('array'),
        organizations: doc.organizations().out('array')
    };
    return entities;
};