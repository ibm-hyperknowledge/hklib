const FI = require("./fi");

function testFi(str)
{
    str = str.replace(/\s+/g, '');
    let myFi = new FI(str);
    console.log(myFi);
    console.log(str);
    console.log(myFi.toString());
    if (str !== myFi.toString())
    {
        console.log('ˆˆˆFAIL!ˆˆˆˆ');
        return false;
    }
    return true;
}


let failuresCount = 0;
let testsCount = 0;
failuresCount += testFi('estImage.``rect``({x: 20, y: 20, w: 800, h: "20"})') ? 0 : 1;
testsCount++;
failuresCount += testFi('``picture1.jpg``') ? 0 : 1;
testsCount++;
failuresCount += testFi('``picture1.jpg``.func') ? 0 : 1;
testsCount++;
failuresCount += testFi('``picture1.jpg``.func({p1: "v1",p2: 43.23})') ? 0 : 1;
testsCount++;
failuresCount += testFi('``picture1.jpg``.``fmask``({m: 3})') ? 0 : 1;
testsCount++;
failuresCount += testFi('<http://example.org/document.txt>.subtext({istart:2,iend:5})') ? 0 : 1;
testsCount++;
failuresCount += testFi('<http://example.org/document.txt>.subtext({istart:2,iend:5}).subtext({istart:0,iend:2})') ? 0 : 1;
testsCount++;
failuresCount += testFi('<http://example.org/document.txt>.subtext*({istart:2,iend:5})') ? 0 : 1;
testsCount++;
failuresCount += testFi('``picture1.jpg``.<http://exemple.org/fmask>(``themask.bmp``)') ? 0 : 1;
testsCount++;
failuresCount += testFi('``picture1.jpg``.<http://exemple.org/fmask>({m:``themask.bmp``, p:56})') ? 0 : 1;
testsCount++;
failuresCount += testFi('``http://www.co-ode.org/ontologies/pizza/pizza.owl#VegetarianPizza``') ? 0 : 1;
testsCount++;

if (failuresCount === 0)
{
    console.log(`###### ${testsCount} tests successfully executed!`);
}
else
{
    console.log(`###### ${failuresCount} of ${testsCount} tests failed!`);
}
