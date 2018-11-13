//When DOM is ready...
$(document).ready(function () {

    //Selectors;
    var form_budget = document.querySelector("#budget-amount-form");
    var clear_button = document.querySelector("#clear-table");
    var balance_id = $("#balance-id");
    var sum_incomes = $("#total-incomes-span");
    var sum_expenses = $("#total-expenses-span");
    var show_table = $("#table-all");;

    //Variables to use;
    var querys = [];
    var amount_item;
    var balance_amount = 0;
    var sumIncomes = 0;
    var sumExpenses = 0;
    var date = moment().format('LL');
    var concept;
    var concept_type;

    //Set Balance to $0.;
    balance_id.text("$" + balance_amount + ".");
    sum_incomes.text("$" + sumIncomes + ".");
    sum_expenses.text("$" + sumExpenses + ".");

    //empty_table awaits for a click on to clear the table and set all variables to 0;
    var empty_table = clear_button.addEventListener('click', () => {
        //Clear the table;
        $("#querys-loaded").empty();

        //hide the table;
        show_table.fadeOut("slow");

        //clear the array;
        querys.length = 0;

        //clear the amounts of balance_amount, sumIncomes and sumExpenses;
        balance_amount = 0.00;
        sumIncomes = 0.00;
        sumExpenses = 0.00;

        //set all names to actual 0;
        balance_id.text("$" + balance_amount + ".");
        sum_incomes.text("$" + sumIncomes + ".");
        sum_expenses.text("$" + sumExpenses + ".");
    });

    //result awaits for the form to be submit inr order to choose if is income or expense;
    var result = form_budget.addEventListener('submit', (e) => {

        //grab the amount and the concept introduced;
        amount_item = $("#budget-amount-input").val();
        concept = $("#budget-concept-input").val();

        e.preventDefault();//prevents to send the form;        

        //if the budget-choose-income element with correspoding id has been checked, 
        //then proceed with the income process;
        if (amount_item == "" || concept == "") {
            alert("Fields are empty. Please fulfill the input fields");
        }
        else {
            if (document.getElementById('budget-choose-income').checked) {
                //budget-choose-income radio button is checked
                concept_type = "Income";
                registerQuerys(concept, amount_item, date, concept_type);
                balance_amount += parseFloat(amount_item);
                sumIncomes += parseFloat(amount_item);
                showQuerys();

                //if the budget-choose-expense element with correspoding id has been checked, 
                //then proceed with the expense process;
            } else if (document.getElementById('budget-choose-expense').checked) {
                //variable concept_type set to 'Expense';
                concept_type = "Expense";
                let amount_parsed = parseFloat(amount_item);
                if (amount_parsed > balance_amount) {
                    alert("Please enter a positive amount, or an amount that dont overpass your actual balance.")
                }

                else {
                    //registerQuerys method call in order to pass all data to proceed wiht the expense;
                    registerQuerys(concept, amount_item, date, concept_type);

                    //do the SumExpense process;
                    sumExpenses += parseFloat(amount_item);

                    //udpate the balance_amount;
                    balance_amount -= amount_item;

                    //show all the querys for expenses;
                    showQuerys();
                }
            }
        }
        return false;
    });

    //method to register the values entered;
    function registerQuerys(concept, amount, date, concept_type) {
        //an array that dynamically enter the values caputed by the user into the array;
        //an array collection of JSON objects;
        querys.push(
            {
                "concept": concept,
                "amount": amount,
                "date": date,
                "concept_type": concept_type
            },
        );
        console.log(querys);
    }

    //show all the querys, creates dymanically the <td>s and append it into the table;
    function showQuerys() {
        //erase all <td>s of the table;
        $("#querys-loaded").empty();

        //if the concept_type is an income, then proceed with appeding the elements of the income in the income <td>;
        //go through all the elements of the array and puts it into the <td>s of the table dynamically;
        querys.forEach((item) => {
            if (item.concept_type == "Income") {
                var records = `
                <tr class="querys-loaded" id="incomes-loaded">
                    <td>${item.concept}</td>
                    <td>$${item.amount}</td>
                    <td>${item.date}</td>
                    <td>${item.concept_type}</td>
                </tr>`;
            }
            //if the concept_type is an expense, then proceed with appeding the elements of the expense in the expense <td>;
            //go through all the elements of the array and puts it into the <td>s of the table dynamically;
            else {
                var records = `
                <tr class="querys-loaded" id="expenses-loaded">
                    <td>${item.concept}</td>
                    <td>$${item.amount}</td>
                    <td>${item.date}</td>
                    <td>${item.concept_type}</td>
                </tr>`;
            }

            //appends all the registries: incomes or expenses into the table;
            var rec = $("#querys-loaded").append(records);
            rec.show("slow");

            //clear inputs form;                        
            amount_item = $("#budget-amount-input").val("");
            concept = $("#budget-concept-input").val("");

            //set all the variables with the corresponding values;
            balance_id.text("$" + balance_amount + ".");
            sum_incomes.text("$" + sumIncomes + ".");
            sum_expenses.text("$" + sumExpenses + ".");
            show_table.fadeIn("slow");
        })
    }
});