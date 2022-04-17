window.onload = function (){
    var button = document.getElementById("submitButton");
    var form = document.getElementById("form");
    var userLogin = document.getElementById("login");
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
    var monthlyPayment;
    var maxAmount = 500000;
    var minTerm = 0.6;

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

    function changeButtonBackground(){
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

        let loginVal = userLogin.value;
        let rateVal = userRate.value;
        let loanAmountVal = userLoanAmount.value;
        let termVal = userTerm.value;
        let regExp = /^\d+$/;
        let loanAmountTest = regExp.test(loanAmountVal);

        if(loginVal.length <= 3){
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

        if(checkInputResult === true){
            changeButtonBackground();

            var data = {
                'login': userLogin.value,
                'loanAmount': userLoanAmount.value,
                'rate': userRate.value,
                'term': userTerm.value,
                'downPayment': getDownPaymentSum(userLoanAmount),
                'monthlyPayment': calculatePayment(),
                'totalPayment': calcTotalPayment()
            }
        }

        checkInputResult = true;
        localStorage.setItem(data.login, JSON.stringify(data));
    });

    var loginInput = document.querySelector(".login-input input");
    loginInput.addEventListener('keyup', function(){
        for(key in localStorage){
            if(loginInput.value == key){
                //this.setAttribute('disabled', true);
                let user = JSON.parse(localStorage.getItem(key));
                fieldForRate.value = user.rate + '%';
                fieldForTerm.value = user.term + ' year(s)';
                fieldForInitalLoan.value = '$' + user.loanAmount;
                fieldForDownPayment.value = '$' + user.downPayment;
                fieldForMonthlyPayment.value = '$' + user.monthlyPayment;
                fieldForTotalPayment.value = '$' + user.totalPayment;
            }
        }
    });
};