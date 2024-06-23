const validateEmail = (email: string, errs: string[]) : string[] => {
    let splitByAt : string[] = email.split('@');
    let splitByDot : string[]  = email.split('.');

    if(/[!#$%^&*()_+\-=\[\]{};':"\\|,<>\/?]+/.test(email)) {
        errs.push('No special character other than @ and . allowed in the email address.');
    }

    if(splitByAt && splitByAt.length != 2) {
        errs.push('There should be exactly one @ in the email address.');
    }
    
    if(splitByAt[0] && splitByAt[0] == '') {
        errs.push('There should be something before @ in the email address.');
    }
    
    if((splitByAt[1] && splitByAt[1] == '') || (splitByAt[0] && splitByAt[0].includes('.'))) {
        errs.push('@ in email address is at a wrong position.');
    }
    
    if(splitByAt[1] && splitByAt[1].startsWith('.')) {
        errs.push('There should be something between @ and . in the email address.');
    }
        
    if(splitByDot && splitByDot.length != 2) {
        errs.push('There should be exactly one . in the email address.');
    }
    
    if(splitByDot[1] && splitByDot[1] == '') {
        errs.push('There should be something after . in the email address.');
    }
    
    if((splitByDot[0] && splitByDot[0] == '') || (splitByDot[1] && splitByDot[1].includes('@'))) {
        errs.push('. in email address is at a wrong position.');
    }
    
    return errs;
}

const validatePassword = (password: string, errs: string[]) : string[] => {
    if(password.length < 6 || password.length > 10) {
        errs.push('Password should be between 6 to 10 characters.');
    }
    
    if(!/[a-z]/.test(password)) {
        errs.push('Password should include at least one lowercase character.');
    }
    
    if(!/[A-Z]/.test(password)){
        errs.push('Password should include at least one uppercase character.');
    }
    
    if(!/[0-9]/.test(password)) {
        errs.push('Password should include at leaset one number.');
    }
    
    if(!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password)) {
        errs.push('Password should include at least one special character.');
    }
    
    return errs;
}

const validateConfirmation = (password: string, confirmation: string, errs: string[]) : string[] => {
    if(confirmation != password) {
        errs.push('Passwords should match.');
    }
    
    return errs;
}


export { validateEmail, validatePassword, validateConfirmation };