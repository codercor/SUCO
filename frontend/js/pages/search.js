import { Services } from "../classes/Services.js";
import User from "../classes/User.js";
import Dom from "../classes/Dom.js";

export default async function(){
    await Services.standartInit();
    let user = await User.getUserData(localStorage.getItem("username"));
    Dom.searchResults();
}