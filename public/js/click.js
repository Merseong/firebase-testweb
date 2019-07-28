/*
 * 클릭하면 인식하고 숫자를 올려주는 코드
 */
var SpaceClicker = SpaceClicker || {};

SpaceClicker.count = 0;
SpaceClicker.countMessage = null;
SpaceClicker.countToMessage = function()
{
    if (SpaceClicker.countMessage != null) SpaceClicker.countMessage.innerHTML = SpaceClicker.count.toString() + '번';
}

document.getElementById('reset').onclick = function()
{
    SpaceClicker.count = 0;
    SpaceClicker.countToMessage();
}

document.body.onkeyup = function()
{
    console.log('pressed something');
    var keyCode = event.keyCode;
    if (keyCode == 13)
    {
        SpaceClicker.count++;
        SpaceClicker.countToMessage();
    }
};