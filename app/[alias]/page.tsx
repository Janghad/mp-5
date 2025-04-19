import getAliasById from "@/lib/getAlias";;
import { redirect } from "next/navigation";

export default async function AliasPage( {
    params, 
}: {
    params: {alias: string};
}) {
    const {alias} = params;
    const longUrl = await getAliasById(alias);

    if (!longUrl) {
        return redirect("/")
    }

    return redirect(longUrl.initialURL);
}