"use server";

import getCollection, {URLS_COLLECTION} from "@/db";
import { URLProps } from "@/types";

export default async function createNewURL(
    url: string, 
    alias: string
): Promise<URLProps| string> {
    console.log("creating link")
    const u = {
        initialURL: url,
        alias: alias,
    };
    try {
        const urlCheck = await fetch(url);
        if(!urlCheck.ok) {
            throw new Error("URL is unacessible")
        } else if (urlCheck.status >= 400) {
            throw new Error ("URL not found or unaccesible ")
        }
    }
    catch(error) {
        console.log(error);
        return "Invalid URL";
    }

    try{

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
    } catch (error) {
        console.error("Database error:", error);
        return "Error connecting to database";
    }


}