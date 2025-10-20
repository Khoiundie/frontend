// import { showAlert } from "./admin";
let string = window.location.search;
let params = new URLSearchParams(string);
let ctrl = params.get('ctrl')??"Categories";
let act = params.get("act")??"List";
console.log(act+ctrl+"()")
try {
	eval(ctrl, act, "()")
} catch(err) {
	showAlert('Tính năng này đang được phát triển', 'info');
}