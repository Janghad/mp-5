import getCollection, { URLS_COLLECTION } from "@/db"; 
import { URLProps } from "@/types";

export default async function getAliasById(
    alias: string,
): Promise<URLProps | null> {
    if (!alias) {
        return null;
    }
    const collection = await getCollection(URLS_COLLECTION);
    const urlData = await collection.findOne({ alias: alias });

    if (!urlData) {
        return null;
    }

    const url = {
        id: urlData._id.toHexString(),
        intialUrl: urlData.intialUrl,
        alias: urlData.alias,
    };

    return url;
}
