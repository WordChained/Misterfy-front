const repliments = [
    'Hi',
    'Sure, sounds good',
    'Good, you?',
    'Nope, just you',
    'Good morning!',
    'Good night!',
    'YEESSS!',
]
export const botService = {
    sendMsg
}

function sendMsg(msg) {
    var msgText = msg.txt.toLowerCase();
    if (msgText.includes('how are you?')) {
        return repliments[2];
    }
    if (msgText.includes('want to listen to something')) {
        return repliments[1];
    }
    if (msgText.includes('hi')) {
        return repliments[0]
    }
    if (msgText.includes('good morning')) {
        return repliments[4]
    }
    if (msgText.includes('good night')) {
        return repliments[5]
    }
    if (msgText.includes('anyone here?')) {
        return repliments[3]
    }
    return repliments[repliments.length - 1];

}