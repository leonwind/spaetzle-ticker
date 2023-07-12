function encodeEmail(email, key) {
    const encodedKey = key.toString(16);
    let encodedString = addLeadingZero(encodedKey);

    for (let i = 0; i < email.length; i++) {
        let charCode = email.charCodeAt(i);
        let encoded = charCode ^ key;

        let value = encoded.toString(16);
        encodedString += addLeadingZero(value);
    }

    return encodedString;
}

function addLeadingZero(value){
    return value.length === 1 ? '0' + value : value;
}

function decodeEmail(encryptedEmail) {
    let email = ""; 
    
    const keyInHex = encryptedEmail.substr(0, 2);
    const key = parseInt(keyInHex, 16);

    for (let i = 2; i < encryptedEmail.length; i += 2) {
        let charInHex = encryptedEmail.substr(i, 2)
        let charCode = parseInt(charInHex, 16);

        let output = charCode ^ key;
        email += String.fromCharCode(output);
    }

    return email;
}

function resolveEncodedEmail(redirect=false) {
    const email_element = document.getElementsByClassName("encrypted-eml")[0];
    const encoded_email = "mailto:" + decodeEmail(email_element.dataset.email);
    
    email_element.href = encoded_email;

    if (redirect) {
        return encoded_email;
    }
}

