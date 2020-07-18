//  Created by Henry Rivera on 5/30/20.
//  File Name: app.js
//  Description: Budgeting App completed in vanilla Javascript
//  Copyright © 2020 Henry Rivera. All rights reserved


let budgetController = (function(){
    let Expense = function(id, description, value){
        this.id = id
        this.description = description
        this.value = value
        this.percentage = -1
    }

    Expense.prototype.calcPercentage = function(totalInc){
        if (totalInc > 0){
            this.percentage = Math.round((this.value / totalInc) * 100)
        }
        else{
            this.percentage = -1
        }
    }

    Expense.prototype.getPercentage = function(){
        return this.percentage
    }

    let Income = function(id, description, value){
        this.id = id
        this.description = description
        this.value = value
    }

    let data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    }

    let calculateTotal = function(type){
        let sum = 0
        data.allItems[type].forEach(function(currElem){
            sum += currElem.value
        })
        data.totals[type] = sum
    }

    return{
        addItem: function(type, des, val){
            let newItem, ID

            // ID = last ID + 1
            // Create new ID
            if (data.allItems[type].length > 0){
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1
            }
            else{
                ID = 0
            }

            // Create new item based on 'inc' or 'exp' type
            if (type === 'exp'){
                newItem = new Expense(ID, des, val)
            }
            else if (type === 'inc'){
                newItem = new Income(ID, des, val)
            }

            // Push it into our data structure
            data.allItems[type].push(newItem)

            // return the new element
            return newItem
        },

        deleteItem: function(type, id){
            let ids, ind
            // map has access to curr elem, curr index, and entire arr; returns new arr
            ids = data.allItems[type].map(function(curr){
                return curr.id
            })
            // item we want to delete
            ind = ids.indexOf(id)

            if (ind !== -1){
                data.allItems[type].splice(ind, 1)
            }
        },

        calculateBudget: function(){
            // calc total income and expenses
            calculateTotal('exp')
            calculateTotal('inc')

            // calc the budget: income - expenses
            data.budget = data.totals.inc - data.totals.exp

            // calc the percentage of income that we spent
            if (data.totals.inc > 0){
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100)
            }
            else{
                data.percentage = -1
            }
        },

        calculatePercentages: function(){
            data.allItems.exp.forEach(function(currElem){
                currElem.calcPercentage(data.totals.inc)
            })
        },

        getPercentages: function(){
            let allPercentages = data.allItems.exp.map(function(currElem){
                return currElem.getPercentage()
            })
            return allPercentages
        },

        getBudget: function(){
            return{
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
        }
    }
})()

let UIController = (function () {

    let DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercentageLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
    }

    let formatNumber = function(type, num){
        let integer, decimal
        /*
        + or - before number
        exactly 2 decimal points
        comma separating the thousands
         */

        num = Math.abs(num)
        num = num.toFixed(2)
        num = num.split('.')
        integer = num[0]
        decimal = num[1]
        if (integer.length > 3){
            integer = integer.substr(0, integer.length - 3) + ','
                + integer.substr(integer.length - 3, 3)
        }

        return (type === 'exp' ? '-' : '+') + ' ' + integer + '.' + decimal
    }

    let nodeListForEach = function(nodeList, callBackFunc){
        for (let i = 0; i < nodeList.length; i++){
            callBackFunc(nodeList[i], i)
        }
    }

    return{
        getInput: function(){
            return{
                // read value of type; either inc or exp
                type: document.querySelector(DOMstrings.inputType).value,

                // read description of expense
                description: document.querySelector(DOMstrings.inputDescription).value,

                // read amount of expense described
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            }
        },

        addListItem: function(obj, type){
            let html, newHtml, element
            // Create HTML string with placeholder text

            if (type === 'inc'){
                element = DOMstrings.incomeContainer
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div> ' +
                    '<div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__delete"> ' +
                    '<button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div> </div>'
            }
            else if (type === 'exp'){
                element = DOMstrings.expensesContainer
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div>' +
                    '<div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%' +
                    '</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i>' +
                    '</button></div></div></div>'
            }

            // Replace the placeholder text with some actual data
            newHtml = html.replace('%id%', obj.id)
            newHtml = newHtml.replace('%description%', obj.description)
            newHtml = newHtml.replace('%value%', formatNumber(type, obj.value))

            // insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml)
        },

        deleteListItem: function(selectorID){
            let element = document.getElementById(selectorID)
            // in JS we cannot delete an element; we can only delete a child
            element.parentNode.removeChild(element)
        },

        clearFields: function(){
            let fields, fieldsArr

            // querySelectorAll returns list
            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue)

            // tricks slice method by making it think we are passing in array. Will return array which is what we want
            fieldsArr = Array.prototype.slice.call(fields)

            fieldsArr.forEach(function(currElem, index, array){
                currElem.value = ""
            })

            fieldsArr[0].focus()
        },

        displayBudget: function(obj){
            let type
            obj.budget > 0 ? type = 'inc' : type = 'exp'
            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(type, obj.budget)
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber('inc', obj.totalInc)
            document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber('exp', obj.totalExp)
            if (obj.percentage > 0){
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%'
            }
            else{
                document.querySelector(DOMstrings.percentageLabel).textContent = '-'
            }
        },

        displayPercentages: function(percentages){
            let fields = document.querySelectorAll(DOMstrings.expensesPercentageLabel)

            nodeListForEach(fields, function(curr, ind){
                if (percentages[ind] > 0){
                    curr.textContent = percentages[ind] + '%'
                }
                else{
                    curr.textContent = '-'
                }
            })
        },

        displayDate: function(){
            let today, year, month, months
            months = ['January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December']
            today = new Date()
            month = today.getMonth()
            year = today.getFullYear()
            document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + year
        },

        changedType: function(){
            let fields = document.querySelectorAll(
                DOMstrings.inputType + ', ' +
                DOMstrings.inputDescription + ', ' +
                DOMstrings.inputValue
            )

            nodeListForEach(fields, function (currElem){
                currElem.classList.toggle('red-focus')
            })

            document.querySelector(DOMstrings.inputBtn).classList.toggle('red')
        },

        getDOMstrings: function(){
            return DOMstrings
        }
    }
})()

let controller = (function (budgetCtrl, UICtrl) {

    let setupEventListeners = function(){
        let DOM = UICtrl.getDOMstrings()

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem)

        // keypress event happens on the global web page
        document.addEventListener('keypress', function(event){
            if (event.keyCode === 13 || event.which === 13){
                ctrlAddItem()
            }
        })

        // setup event listener which will allow us to do event delegation
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem)

        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType)
    }

    let ctrlAddItem = function(){
        let input, newItem

        // 1. get the field input data
        input = UIController.getInput()

        if (input.description !== "" && !isNaN(input.value) && input.value > 0){
            // 2. add the item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value)

            // 3. add the new item to the UI
            UICtrl.addListItem(newItem, input.type)

            // 4. Clear the fields
            UICtrl.clearFields()

            // 5. Calc and update budget
            updateBudget()

            // 6. calculate and update percentages
            updatePercentages()
        }
    }

    let ctrlDeleteItem = function(event){
        let itemID, splitID, type, ID
        // event.target returns an HTML node in the DOM
        // event where the click happened; moving up in DOM
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id

        if (itemID){
            // inc-ID or exp-ID
            // isolating variable
            splitID = itemID.split('-')
            type = splitID[0]
            ID = parseInt(splitID[1])

            // 1. Delete the item from the data structure
            budgetCtrl.deleteItem(type, ID)

            // 2. delete the item from the UI
            UICtrl.deleteListItem(itemID)

            //3. Update and show the new budget
            updateBudget()

            // 4. calculate and update percentages
            updatePercentages()
        }
    }

    let updateBudget = function(){
        // 6. calculate the budget
        budgetCtrl.calculateBudget()

        // 7. return the budget
        let budget = budgetCtrl.getBudget()

        // 8. display the button on the UI
        UICtrl.displayBudget(budget)
    }

    let updatePercentages = function(){
        // 1. calculate percentages
        budgetCtrl.calculatePercentages()

        // 2. read percentages from the budget controller
        let percentages = budgetCtrl.getPercentages()

        // 3. update the UI with the new percentages
        UICtrl.displayPercentages(percentages)
    }

    return{
        init: function(){ // initialization function
            UICtrl.displayDate()
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            })
            setupEventListeners()
        }
    }
})(budgetController, UIController)

controller.init()