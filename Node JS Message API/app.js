'use strict';

function myNumber(integer A)
    if(A > 0)
    {
        myNumber(A / 2);
        console.log(A % 2);
    }
    else
    {
        print("0");
    }

console.log(myNumber(6));

console.log(myNumber(7));

