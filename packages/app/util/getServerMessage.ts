import { ServerResponseType } from "../@types";

interface Result{
    desc?: string;
    title?: string;
}

function getServerResponseMessage({code, errorStatus}: ServerResponseType) : Result{
    let result = {
        desc: "",
        title: ""
    };

    if(errorStatus){
        switch (code) {
            case "--waitlist/user-exists":
                result["desc"] = "User with this email already exists."
                result["title"] = "😒 YOU'RE ON OUR WAITLIST MY FRIEND"
                break;
            case "--waitlist/invalid-verification-token":
                result["desc"] = "OTP is invalid or has expired."
                result["title"] = "INVALID OTP"
                break;
            case "--waitlist/invalid-otp":
                result["desc"] = "Verificaion OTP is invalid."
                result["title"] = "INVALID OTP"
                break;
            case "--waitlist/error-verifying-user":
                result["desc"] = "Something went wrong verifying email, try again later."
                result["title"] = "SOMETHING WENT WRONG"
                break;
            case "--waitlist/error-adding-user":
                result["desc"] = "Something went wrong, try again later."
                result["title"] = "SOMETHING WENT WRONG"
                break;
            case "--waitlist/invalid-email":
                result["desc"] = "This email you've entered is invalid."
                result["title"] = "INVALID EMAIL"
                break;
            case "--waitlist/too-many-request":
                result["desc"] = "You've made too many requests, try after 10min."
                result["title"] = "TOO MANY REQUEST"
                break;
            default:
                result["desc"] = "some desc."
                result["title"] = "some title"
                break;
        }
    }
    if(!errorStatus){
        switch (code) {
            case "--waitlist/verify-email":
                result["desc"] = "A verification OTP has been sent to your email account.."
                result["title"] = "🎊 WELL DONE 🎊"
                break;
            case "--waitlist/email-verified":
                result["desc"] = "Congratulations! Your email has been verified and you've been added to the waitlist."
                result["title"] = "🎉 Email Verified 🎉"
                break;
            default:
                result["desc"] = "some desc."
                result["title"] = "some title."
                break;
        }
    }
    return result;
}

export default getServerResponseMessage