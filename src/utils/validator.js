export default {
    isIntUp0:/^[0-9]*[1-9][0-9]*$/,
    isInt:/^\d+$/,
    isMoney:/(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/,
    isEmpty: /^\s*$/,
    isMobile: /^(13|14|15|16|17|18|19)[0-9]{9}$/,
    isLetter: /^[a-zA-Z]+$/,
    isNumAndLetterAndUnderline: /^[a-zA-Z][0-9a-zA-Z_]{0,}$/
}