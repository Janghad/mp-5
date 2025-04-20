'use client';

import { useState } from 'react';
import createNewURL from '@/lib/createNewURL';
import { URLProps } from '@/types';
import Container from '@mui/material/Container';
import { Button, TextField } from '@mui/material';

export default function NewUrlForm() {
    const [url, setUrl] = useState<string>('');
    const [alias, setAlias] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [urlProp, setUrlProp] = useState<URLProps | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    
    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try{
        const result = await createNewURL(url, alias);

        if (typeof result === 'string') {
        setError(result);
        setUrlProp(null);
        } else {
        setUrlProp(result);
        setUrl("");   
        setAlias("");
        }
    } catch (error) {
        console.error('Unable to create shortened URL:', error);
        setError("result");
        setUrlProp(null);
    } finally {
        setIsLoading(false);
    }
    };

    const copyURL = async () => {
    if (urlProp) {
        const shortUrl = `${window.location.origin}/${urlProp.alias}`;
        try {
        await navigator.clipboard.writeText(shortUrl);
        } catch (error) {
        console.error('Failed to copy:', error);
        }
        }
    };

return (
    <div className="flex justify-center items-center bg-black" style = {{height: "100vh"}}>
        <Container className="bg-white drop-shadow-2xl rounded-xl p-12">

            <div className="text-center mb-6">
                <h1 className="text-5xl font-bold text-blue-600 mb-4">URL Shortener</h1>
                <p className = "text-base text-black">
                    Please provide a URL to shorten along with an alias to create a sharable link
                </p>
            </div>

            <form className = "w-full" onSubmit={handleSubmit}>
                <h2 className = "text-xl text-black mr-6 mb-2">URL</h2>
                <TextField
                    variant="filled"
                    sx={{backgroundColor: "white", width: "100%"}}
                    label="long url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    disabled={isLoading}
                />
                
                <h2 className="text-xl text-black mt-6 mb-2">Custom Alias</h2>
                
                <TextField
                    variant="filled"
                    sx={{backgroundColor: "white", width: "100%"}}
                    label="custom alias"
                    value={alias}
                    onChange={(e) => setAlias(e.target.value)}
                    disabled={isLoading}
                />
        
                <div className="mt-6 mb-6">
                <Button type="submit" variant="contained" sx={{width: "100%", backgroundColor: "blue"}} disabled={isLoading || !url || !alias}> 
                    {isLoading ? "Loading..." : "Shorten"}
                </Button> 
                </div>
        
            </form>
        
            <div className="flex flex-col justify-center items-center mb-4">
                {error? ( 
                    <div className="text-red-700 font-bold">{error}</div>
                ) : (
                    urlProp && (
                        <div className="text-center">
                            <div className = "text-2x1 text-black mb-2"> Your shortened URL: </div> 
                            <div className = "flex items-center justify-center space-x-4">
                            <b className = "text-black font-bold">{`${window.location.origin}/${urlProp.alias}`}</b>
                                <Button 
                                variant="contained" 
                                color="primary" 
                                onClick={copyURL} 
                                sx={{ height: "30px", fontSize: "0.75rem", padding: "4px 10px" }}
                            >
                            Copy
                        </Button>
                    </div>
                </div>
            )
        )}
        </div>
        </Container>
        </div>
    );
}