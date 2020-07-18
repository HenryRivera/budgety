/*
// To-do list Part 1:

// Controller module
// 1. add event handler

// data module
// 3. add new item to internal data structure
// 5. calculate budget

// UI module
// 2. get input values
// 4. add new item to the UI
// 6. update the UI

// data encapsulation: allows us to hide the implementation details
// of a specific module from the outside scope so that we only expose
// a public interface which is sometimes called an API

// separation of concerns: each part of the application should only
// be interested in doing one thing independently

// IIFE allows us to have data privacy because it creates a new
// scope that is not visible from the outside scope

// module pattern returns an object containing all of the
// functions that we want to be public
let budgetController = (function(){
    let x = 23

    let add = function(m){
        return x + m
    }

    return{ // closure was created here
        // has access to outside vars even after they've returned
        publicTest: function(h){ // public because it was returned and now we can use it
            return add(h)
        }
    }
})()

let UIController = (function () {
    // module
})()

let controller = (function (budgetCtrl, UICtrl) {
    let tmp = budgetCtrl.publicTest(13)
    return{
        publicTest2: function(){
            console.log(tmp)
        }
    }
})(budgetController, UIController)

// To-do list Part 2:

// Controller module
// 1. add event handler
// 2. delete the item from our data structure
// 3. delete the item to the UI
// 4. re-calculate budget
// 5. update the UI

// event bubbling: when an event is fired or triggered on some
// DOM element, then the exact same event is also triggered
// on all of the parent elements

// target element: element that caused the event to happen

// event delegation: attach event handler to a parent element and
// catch the event there because it bubbles up

// Use Cases for event delegation
// 1. when we have an element with lots of child elements
// that we are interested in
// 2. when we want an event handler attached to an
// element that is not yet in the DOM when our page is loaded

// To-do list Part 3:
// 1. calculate percentages
// 2. update percentages in UI
// 3. display curr month and year
// 4. number formatting
// 5. improve input field UX
 */