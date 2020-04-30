const sgMail =require('@sendgrid/mail')

sgMail.setApiKey(process.env.Send_Grid_ApiKey)

const sendWelcomeEmail =(email,name)=>{

    sgMail.send({
        to: email,
        from:'ankurc2001@gmail.com',

        subject:'Welcome Mail',
        text: `hello ${name} to our task manager app may you enjoy it`
    

    })

}

const sendCancilationEmail =(email,name)=>{

    sgMail.send({
        to: email,
        from:'ankurc2001@gmail.com',
        subject:'Delted your account',
        text: `hello ${name} your accout from task manager has been deleted . `
    

    })

}


module.exports={
    sendWelcomeEmail,
    sendCancilationEmail
}