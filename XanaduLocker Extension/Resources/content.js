const sleep = (seconds) => new Promise((resolve) => setTimeout(resolve, seconds * 1000))
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
    let code
    try {
        const res = await request({ type: "code" });
        if (!res || !res.code || typeof res.code !== 'string' || res.code.length !== 4) {
            throw new Error(`Invalid code: "${res?.code}"`);
        }
        code = res.code;
    } catch (err) {
        console.error("Error retrieving code:", err);
        alert(err instanceof Error ? err.message : `${err}`);
        return;
    }

    const codeDisplay = document.getElementById("codeDisplay") || document.createElement('div');
    codeDisplay.id = "codeDisplay";
    codeDisplay.className = "mt-2 text-center font-bold";
    codeDisplay.style.color = "#29188e";
    codeDisplay.innerHTML = `Code: ${code}`;
    document.getElementById('checkout')?.after(codeDisplay);

    await sleep(0.1);

    const input1 = document.getElementById('passcode1-1');
    const input2 = document.getElementById('passcode2-1');
    const input3 = document.getElementById('passcode3-1');
    const input4 = document.getElementById('passcode4-1');
    
    input1.value = code[0];
    input1.dataset.passcodechar = code[0];

    input2.value = code[1];
    input2.dataset.passcodechar = code[1];

    input3.value = code[2];
    input3.dataset.passcodechar = code[2];

    input4.value = code[3];
    input4.dataset.passcodechar = code[3];

    document.getElementById('passcodeSubmit').click();
    
    await sleep(0.1);

    document.getElementById('declineMobile').click();

    await sleep(0.5);

    document.getElementById('mobileNumberDeclined').click();
};

document.body.addEventListener('click', (event) => {
    // Confirm button
    if (event.target.id === 'rentProductItem') {
        run();
    }
});
