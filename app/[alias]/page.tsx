import getAliasById from "@/lib/getAlias";;
import { redirect } from "next/navigation";

export default async function AliasPage( {params,}: {
    params: Promise<{alias: string}>;
}) {
    const {alias} = await params; 
    const longUrl = await getAliasById(alias);

    if (!longUrl) {
        return redirect("/")
    }

    return redirect(longUrl.initialURL);
}