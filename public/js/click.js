/*
 * 클릭하면 인식하고 숫자를 올려주는 코드
 */
var EnterClicker = EnterClicker || {};

EnterClicker.count = 0;
EnterClicker.countMessage = null;
EnterClicker.countToMessage = function()
{
    if (EnterClicker.countMessage != null) EnterClicker.countMessage.innerHTML = EnterClicker.count.toString() + '번';
}

document.getElementById('reset').onclick = function()
{
    EnterClicker.count = 0;
    EnterClicker.countToMessage();
}

document.body.onkeyup = function()
{
    console.log('pressed something');
    var keyCode = event.keyCode;
    if (keyCode == 13)
    {
        EnterClicker.count++;
        EnterClicker.countToMessage();
    }
};