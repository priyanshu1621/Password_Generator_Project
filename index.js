const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector("[generateButton]");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

let password = "";
let passwordLength = 10;
let checkCount = 1;
handelSlider();
//Set strength circle color to grey
setIndicator("#ccc");

//set passwordLength
function handelSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    // or kuch dalna ho to
    //to put the black color to the percentage of the password length
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordLength - min)*100/(max - min) ) + "% 100%" ; 
}

//changing indicator color
function setIndicator(color) {
    indicator.style.backgroundColor = color;
    //shadow
    indicator.style.boxShadow =`0px 0px 12px 1px ${color}`;
}
//generate random output

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;

}
//get number
function generateRandomNumber() {
    return getRndInteger(0, 9);
}
//get lowercase
function generateLowerCase() {
    return String.fromCharCode(getRndInteger(97, 123));
}
// get uppercase
function generateUpperCase() {
    return String.fromCharCode(getRndInteger(65, 91));
}
//get symbols
function generateSymbol() {
    const randNum = getRndInteger(0, symbols.length);
    return symbols.charAt(randNum);

}
//checking strength of password and rules, color of the strength indicator
function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;

    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;

    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
        setIndicator("#0f0");
    } else if (
        (hasLower || hasUpper) &&
        (hasNum || hasSym) &&
        passwordLength >= 6
    ) {
        setIndicator("#ff0");

    } else {
        setIndicator("#f00");
    }

}
//copy button
async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied";
    }
    catch (e) {
        copyMsg.innerText = "Failed";
    }
    //to make copy wala span visible
    copyMsg.classList.add("active");

    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);

};

// shuffle password function to get random 
function shufflePassword(array) {
    //Fisher yates method
    for (let i = array.length - 1; i > 0; i--) {
        // random j , find out using random function
        const j = Math.floor(Math.random() * (i + 1));
        //swaping of j with index at i
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;

}

//change in check box
function handelCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if (checkbox.checked)
            checkCount++;
    });
    // special rule
    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handelSlider();
    }
};


//listener on check box
allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change', handelCheckBoxChange);
})
//slider number change
inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handelSlider();
});

// copy nothing when there is no content
copyBtn.addEventListener('click', () => {
    if (passwordDisplay.value)
        copyContent();

});

//generate button
generateBtn.addEventListener('click', () => {
    //none of the checkbox are selected

    if (checkCount <= 0) return;

    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handelSlider();
    }
    //let's start  to the journey of find new password
    console.log("Starting the journey");

    //remove old password
    password = "";

    //let's put the stuff mentioned by checkboxes

    // if(uppercaseCheck.checked){
    //     password += generateUpperCase();
    // }
    // if(lowercaseCheck.checked){
    //     password += generateLowerCase();
    // }
    // if(numbersCheck.checked){
    //     password += generateRandomCase();
    // }
    // if(symbolsCheck.checked){
    //     password += generateSymbol();
    // }


    // above code is replaced by the array?
    let funArr = [];

    if (uppercaseCheck.checked)
        funArr.push(generateUpperCase);

    if (lowercaseCheck.checked)
        funArr.push(generateLowerCase);

    if (numbersCheck.checked)
        funArr.push(generateRandomNumber);

    if (symbolsCheck.checked)
        funArr.push(generateSymbol);


    // compulsory addition
    for (let i = 0; i < funArr.length; i++) {
        password += funArr[i]();
    }

    console.log("Compulsory Addition done");

    //Remaining addition
    for (let i = 0; i < passwordLength - funArr.length; i++) {
        let rndIndex = getRndInteger(0, funArr.length);
        password += funArr[rndIndex]();
    }
    console.log("Reaming Addition done");

    //shuffle the password

    password = shufflePassword(Array.from(password));
    console.log("Shuffling done");

    //show in Ui
    passwordDisplay.value = password;
    console.log("UI Addition done");

    // calculate strength function
    calcStrength();

});
