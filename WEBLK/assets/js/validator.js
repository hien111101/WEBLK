//Hàm thực hiện Validator
function Validator(options){

    var selectorRules = {};

    function Validate(inputElement,rule){
        var errorElement = inputElement.parentElement.querySelector(options.errorSelector);
        var ErrorMess;

        //lấy các rules của selector
        var rules = selectorRules[rule.selector];
        //lặp qua các rules & kiểm tra, Nếu có lỗi thì dừng kiểm
        for(var i = 0; i < rules.length; ++i ){
            ErrorMess = rules[i](inputElement.value);
            if(ErrorMess) break;
        }
        if(ErrorMess){
            errorElement.innerText = ErrorMess;
            inputElement.parentElement.classList.add('invalid');
        }else{
            errorElement.innerText = ' ';
            inputElement.parentElement.classList.remove('invalid');

        }return !ErrorMess;
    }

    var formElement = document.querySelector(options.form);
    if(formElement){
        formElement.onsubmit = function(e){
            e.preventDefault(); 

            var isFormValid =true;
            //lặp qua từng rules và validate
            options.rules.forEach(function (rule){
                var inputElement = formElement.querySelector(rule.selector);
                var isValid = Validate(inputElement,rule);
                if(!isValid){
                    isFormValid = false;
                }
            });
            if (isFormValid){
                if(typeof options.onSubmit === 'function'){
                    var enableInputs = formElement.querySelectorAll('[name]');
                    var formValues = Array.from(enableInputs).reduce(function (values,input){
                        values[input.name] = input.value;
                        return values;
                    }, {});
                    options.onSubmit(formValues);
                }
                else{
                    formElement.submit();
                }
            }
        }

        options.rules.forEach(function (rule){
            //lưu lại rule cho mỗi input
            if(Array.isArray(selectorRules[rule.selector])){
                selectorRules[rule.selector].push(rule.test);
            }else{
                selectorRules[rule.selector] = [rule.test];
            }
            

            var inputElement = formElement.querySelector(rule.selector);
            if(inputElement){
                //Xử lý trường hợp bblur ra khỏi input
                inputElement.onblur = function(){
                    Validate(inputElement,rule);
                }
                //xử lý mỗi khi người dùng nhập vào inpput
                inputElement.oninput = function(){
                    var errorElement = inputElement.parentElement.querySelector('.form-mess');
                    errorElement.innerText = '';
                    inputElement.parentElement.classList.remove('invalid');
                }
            }
        });
    }
}

Validator.isRequired = function(selector){
    return {
        selector: selector,
        test: function(value){
            return value.trim() ? undefined : 'Vui Lòng Nhập Tài Khoản!'
        }
    };
}
Validator.isRequiredPS = function(selector,min){
    return {
        selector: selector,
        test: function(value){
            return value.length >= min ? undefined : `Vui Lòng Tối thiểu ${min} kí tự!`
        }
    };
}
Validator.isRequiredPST = function(selector,getCofirmvalue,message){
    return {
        selector: selector,
        test: function(value){
            return value === getCofirmvalue()  ? undefined : message || 'Vui Lòng Nhập Lại Mật Khẩu!'
        }
    };
}
Validator.isRequiredSDT = function(selector){
    return {
        selector: selector,
        test: function(value){
            return value.trim() ? undefined : 'Vui Lòng Nhập Số Điện Thoại!'
        }
    };
}
Validator.isEmail = function(selector){
    return {
        selector: selector,
        test: function(value ){
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : 'Vui Lòng Nhập Email!';
        }
    };
}