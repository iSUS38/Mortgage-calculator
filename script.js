window.onload = function (){
    var button = document.getElementById("submitButton");
    var bankName = document.getElementById("bankName");
    var userLoanAmount = document.getElementById("loanAmount");
    var userRate = document.getElementById("rate");
    var userTerm = document.getElementById("term")
    var body = document.querySelector("body");
    var fieldForRate = document.getElementById("fieldForRate");
    var fieldForInitalLoan = document.getElementById("fieldForInitalLoan");
    var fieldForDownPayment = document.getElementById("fieldForDownPayment");
    var fieldForTerm = document.getElementById("fieldForTerm");
    var fieldForMonthlyPayment = document.getElementById("fieldForMonthlyPayment");
    var fieldForTotalPayment = document.getElementById("fieldForTotalPayment");
    var checkInputResult = true;
    var deleteButtonBlock = document.querySelector(".delete-bank");
    var deleteButton = document.querySelector(".delete-bank button");
    var bankInput = document.querySelector(".login-input input");
    var monthlyPayment;
    var maxAmount = 500000;
    var minTerm = 0.6;
    var bankSelect = document.querySelector(".bank-select");
    var storageKeys = Object.keys(localStorage);


    function fillInfoInputs(){
        let bank = JSON.parse(localStorage.getItem(key));

        fieldForRate.value = bank.rate + '%';
        fieldForTerm.value = bank.term + ' year(s)';
        fieldForInitalLoan.value = '$' + bank.loanAmount;
        fieldForDownPayment.value = '$' + bank.downPayment;
        fieldForMonthlyPayment.value = '$' + bank.monthlyPayment;
        fieldForTotalPayment.value = '$' + bank.totalPayment;
    }

    function getDownPaymentSum(userLoanAmount){
        return Number(userLoanAmount.value) * 0.2;
    }

    function calculatePayment() {
        let amt = +userLoanAmount.value;
        let apr = +userRate.value;
        let term = +userTerm.value;
        apr /= 1200;
        term *= 12;
        let mPayment = amt*(apr * Math.pow((1 + apr), term))/(Math.pow((1 + apr), term) - 1);
        monthlyPayment = mPayment.toFixed(2);
	    return mPayment.toFixed(2);
    }

    function changeButtonBackground(button){
        button.style.backgroundColor = "green";
        setTimeout(function(){
            button.style.backgroundColor = "#7289da";
        }, 1500)
    }

    function calcTotalPayment(){
        let mpt = monthlyPayment;
        let term = userTerm.value;
        return (+mpt * +term * 12).toFixed(2);
    }

    function checkInputs(){

        let bankNameVal = bankName.value;
        let rateVal = userRate.value;
        let loanAmountVal = userLoanAmount.value;
        let termVal = userTerm.value;
        let regExp = /^\d+$/;
        let loanAmountTest = regExp.test(loanAmountVal);

        if(bankNameVal.length <= 3){
            alert("Your login length is not enough");
            checkInputResult = false;
        } else if(rateVal <= 1 || rateVal >= 20){
            alert("Enter another rate and try again");
            checkInputResult = false;
        } else if(loanAmountVal >= maxAmount || loanAmountVal <= 10000 || loanAmountTest === false){
            alert("Enter another loan amount and try again");
            checkInputResult = false;
        } else if(termVal < minTerm || termVal >= 10){
            alert("Enter another term and try again");
            checkInputResult = false;
        }
    }

    body.addEventListener('submit', function(sub){
        sub.preventDefault();
        checkInputs();
        if(checkInputResult === false){
            checkInputResult = true;
            return sub;
        }
        
        changeButtonBackground(button);

        var data = {
            'bankName': bankName.value,
            'loanAmount': userLoanAmount.value,
            'rate': userRate.value,
            'term': userTerm.value,
            'downPayment': getDownPaymentSum(userLoanAmount),
            'monthlyPayment': calculatePayment(),
            'totalPayment': calcTotalPayment()
        }

        localStorage.setItem(data.bankName, JSON.stringify(data));
    });

    if(localStorage.length !== 0){
        for(var i = 0; i < storageKeys.length; i++){
            bankSelect.insertAdjacentHTML('beforeend', `<option>${storageKeys[i]}</option>`);
        }
    }

    bankSelect.addEventListener("change", function(){
        let selectedItem = bankSelect.value;
        for(key in localStorage){
            if(selectedItem === key){
                bankInput.value = "";
                bankInput.setAttribute('placeholder', "Enter a bank name");
                deleteButtonBlock.style.display = "block";
                fillInfoInputs();
            }

        }
    });

    bankInput.addEventListener('keyup', function(){
        for(key in localStorage){
            if(bankInput.value == key){
                bankSelect.value = "Choose a bank";

                //this.setAttribute('disabled', true);
                deleteButtonBlock.style.display = "block";

                fillInfoInputs();
            }
        }
    });

    function deleteKeyFromStorage(){
        localStorage.removeItem(bankInput.value);
        localStorage.removeItem(bankSelect.value);
    }

    deleteButton.addEventListener("click", function (){
        
        deleteKeyFromStorage();

        changeButtonBackground(deleteButton);
        setTimeout(function(){
            window.location.reload();

        }, 2000);
    });
};