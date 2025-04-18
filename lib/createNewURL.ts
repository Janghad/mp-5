"use server";

import getCollection, {URLS_COLLECTION} from "@/db";
import { URLProps } from "@/types";

export default async function createNewURL(
    url: string, 
    alias: string
): Promise<URLProps| string> {
    const u = {
        intialUrl: url,
        alias: alias,
    };
    try {
        const urlCheck = await fetch(url);
        if(!urlCheck.ok) {
            return "Invalid URL";
        } else if (urlCheck.status >= 400) {
            return "Invalid URL";
        }
    }
    catch(error) {
        console.log(error);
        return "Invalid URL";
    }

    const urlCollection = await getCollection(URLS_COLLECTION);

    const checkAlias = await urlCollection.findOne({alias});
    if (checkAlias) {
        return "There is already an alias with this name";
    }

    const result = await urlCollection.insertOne({...u});

    if(!result.acknowledged) {
        throw new Error("Invalid insert to DB");
    }

    return {...u, id: result.insertedId.toHexString()};


}