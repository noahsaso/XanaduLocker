const request = (body) => new Promise((resolve, reject) =>
    browser.runtime.sendMessage(body).then((response) => {
        if (!response || 'error' in response) {
            reject(new Error(response ? response.error : 'Empty response'));
        } else {
            resolve(response);
        }
    })
);

const run = async () => {
    const codeDisplay = document.getElementById('code');
    const errorDisplay = document.getElementById('error');
    
    codeDisplay.innerHTML = 'Code: ...';
    errorDisplay.innerHTML = '';
    
    let code
    try {
        const res = await request({ type: "code" });
        if (!res || !res.code || typeof res.code !== 'string' || res.code.length !== 4) {
            throw new Error(`Invalid code: "${res?.code}"`);
        }
        codeDisplay.innerHTML = `Code: ${res.code}`;
    } catch (err) {
        console.error("Error retrieving code:", err);
        errorDisplay.innerHTML = err instanceof Error ? err.message : `${err}`;
        codeDisplay.innerHTML = 'Code: <error>';
    }
}

run();
