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
    const urlCheck = await fetch(url);
    if (!urlCheck.ok || urlCheck.status >= 400) {
    setError("Invalid URL. Please try a different URL.");
    setIsLoading(false);
    return;
    }
    } catch {
        setError("Invalid URL. Please try a different URL.");
        setIsLoading(false);
        return;
    }

    try {
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
        setError("Error creating shortened URL");
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
    <Container maxWidth="md" className="bg-white drop-shadow-2xl rounded-xl mb-10">
        <form 
        style={{width: "90%", margin: "0 auto"}}
        onSubmit={handleSubmit}
        >
        <h2 className="text-xl mt-6 mb-2">URL</h2>
        <TextField
            variant="filled"
            sx={{backgroundColor: "white", width: "100%"}}
            label="long url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={isLoading}
        />
        
        <h2 className="text-xl mt-2 mb-2">Custom Alias</h2>
        <TextField
            variant="filled"
            sx={{backgroundColor: "white", width: "100%"}}
            label="custom alias"
            value={alias}
            onChange={(e) => setAlias(e.target.value)}
            disabled={isLoading}
        />
        
        <div className="mt-6 mb-6">
            <Button 
            type="submit" 
            variant="contained" 
            sx={{width: "100%", backgroundColor: "purple"}}
            disabled={isLoading || !url || !alias}
            >
            {isLoading ? "Loading..." : "Shorten"}
            </Button> 
        </div>
        </form>
        
        <div className="flex justify-center mb-4">
        {error? ( <div className="text-red-700 font-bold">{error}</div>
        ) : (
        urlProp && (
        <div className="text-2xl text-black">
            <div>
                Your new url: <b>{`${window.location.origin}/${urlProp.alias}`}</b>
                <Button 
                variant="contained" 
                color="primary" 
                onClick={copyURL} 
                sx={{ ml: 2, height: "30px" }}
                >
                Copy
                </Button>
            </div>
            </div>
        )
        )}
        </div>
    </Container>
    );
}